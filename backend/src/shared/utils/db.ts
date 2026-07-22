import { AsyncLocalStorage } from 'node:async_hooks';
import { query, pool } from '../../config/database';
import { QueryResult } from 'pg';

const transactionStorage = new AsyncLocalStorage<{ query: (text: string, params?: any[]) => Promise<QueryResult> }>();

function getQueryFn(): (text: string, params?: any[]) => Promise<QueryResult> {
  const store = transactionStorage.getStore();
  return store?.query || query;
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function mapRowToCamelCase(row: any): any {
  if (!row || typeof row !== 'object') return row;
  if (Array.isArray(row)) return row.map(mapRowToCamelCase);
  const result: any = {};
  for (const key of Object.keys(row)) {
    result[toCamelCase(key)] = row[key];
  }
  return result;
}

type WhereCondition = {
  column?: string;
  operator?: string;
  value?: any;
  params?: any[];
  conditions?: WhereCondition[];
  logic?: 'AND' | 'OR';
};

function buildWhereClause(conditions: WhereCondition[], paramIndexOffset: number = 0, joinOp: 'AND' | 'OR' = 'AND'): { clause: string; params: any[] } {
  if (!conditions || conditions.length === 0) return { clause: '', params: [] };

  const parts: string[] = [];
  const params: any[] = [];

  for (const cond of conditions) {
    if (cond.operator === 'OR' && cond.conditions) {
      const sub = buildWhereClause(cond.conditions, paramIndexOffset + params.length, 'OR');
      if (sub.clause) {
        parts.push(`(${sub.clause})`);
        params.push(...sub.params);
      }
      continue;
    }

    if (cond.operator === 'AND' && cond.conditions) {
      const sub = buildWhereClause(cond.conditions, paramIndexOffset + params.length, 'AND');
      if (sub.clause) {
        parts.push(`(${sub.clause})`);
        params.push(...sub.params);
      }
      continue;
    }

    const col = cond.column ? toSnakeCase(cond.column) : '';
    const op = cond.operator || '=';
    if (op === 'IN') {
      const vals = cond.value as any[];
      const placeholders = vals.map((_, i) => `$${paramIndexOffset + params.length + i + 1}`);
      parts.push(`"${col}" IN (${placeholders.join(', ')})`);
      params.push(...vals);
    } else if (op === 'ILIKE') {
      params.push(`%${cond.value}%`);
      parts.push(`"${col}" ILIKE $${paramIndexOffset + params.length}`);
    } else if (op === 'IS NULL') {
      parts.push(`"${col}" IS NULL`);
    } else if (op === 'IS NOT NULL') {
      parts.push(`"${col}" IS NOT NULL`);
    } else if (op === '<' || op === '<=' || op === '>' || op === '>=' || op === '!=' || op === 'gte' || op === 'lte' || op === 'gt' || op === 'lt') {
      const mappedOp = op === 'gte' ? '>=' : op === 'lte' ? '<=' : op === 'gt' ? '>' : op === 'lt' ? '<' : op;
      params.push(cond.value);
      parts.push(`"${col}" ${mappedOp} $${paramIndexOffset + params.length}`);
    } else if (op === 'raw') {
      const rawSql = cond.value;
      const rawParams = cond.params || [];
      const reindexedSql = rawSql.replace(/\$(\d+)/g, (_: string, num: string) => `$${paramIndexOffset + params.length + parseInt(num)}`);
      parts.push(`(${reindexedSql})`);
      params.push(...rawParams);
    } else {
      params.push(cond.value);
      parts.push(`"${col}" = $${paramIndexOffset + params.length}`);
    }
  }

  return { clause: parts.join(` ${joinOp} `), params };
}

function buildOrderClause(orderBy?: { column: string; dir?: string }[]): string {
  if (!orderBy || orderBy.length === 0) return '';
  const parts = orderBy.map((o) => `"${toSnakeCase(o.column)}" ${(o.dir || 'ASC').toUpperCase()}`);
  return ' ORDER BY ' + parts.join(', ');
}

function buildPaginationClause(offset?: number, limit?: number, paramIdx: number = 0): { clause: string; params: any[] } {
  const params: any[] = [];
  let clause = '';
  if (limit !== undefined) {
    params.push(limit);
    clause += ` LIMIT $${paramIdx + params.length}`;
  }
  if (offset !== undefined) {
    params.push(offset);
    clause += ` OFFSET $${paramIdx + params.length}`;
  }
  return { clause, params };
}

function buildReturningClause(columns?: string[]): string {
  if (!columns || columns.length === 0) return ' RETURNING *';
  const cols = columns.map((c) => `"${toSnakeCase(c)}"`).join(', ');
  return ` RETURNING ${cols}`;
}

export async function findMany(
  table: string,
  options?: {
    where?: WhereCondition[];
    orderBy?: { column: string; dir?: string }[];
    offset?: number;
    limit?: number;
    select?: string[];
    extraJoins?: string;
    extraWhere?: string | { sql: string; params?: any[] };
  }
): Promise<any[]> {
  const q = getQueryFn();
  const selectCols = options?.select?.length
    ? options.select.map((c) => `"${toSnakeCase(c)}"`).join(', ')
    : '*';
  const { clause: whereClause, params: whereParams } = buildWhereClause(options?.where || []);
  const whereSQL = whereClause ? `WHERE ${whereClause}` : '';
  const orderSQL = buildOrderClause(options?.orderBy);
  const { clause: paginationClause, params: paginationParams } = buildPaginationClause(
    options?.offset,
    options?.limit,
    whereParams.length
  );
  let extraWhereSQL = '';
  let extraParams: any[] = [];
  if (options?.extraWhere) {
    if (typeof options.extraWhere === 'string') {
      extraWhereSQL = `AND ${options.extraWhere}`;
    } else {
      extraWhereSQL = `AND ${options.extraWhere.sql}`;
      extraParams = options.extraWhere.params || [];
    }
  }
  const joinsSQL = options?.extraJoins || '';
  const sql = `SELECT ${selectCols} FROM "${table}" ${joinsSQL} ${whereSQL} ${extraWhereSQL} ${orderSQL} ${paginationClause}`;
  const result = await q(sql.trim(), [...whereParams, ...extraParams, ...paginationParams]);
  return result.rows.map(mapRowToCamelCase);
}

export async function findUnique(
  table: string,
  where: WhereCondition[],
  select?: string[]
): Promise<any | null> {
  const q = getQueryFn();
  const selectCols = select?.length
    ? select.map((c) => `"${toSnakeCase(c)}"`).join(', ')
    : '*';
  const { clause: whereClause, params } = buildWhereClause(where);
  const sql = `SELECT ${selectCols} FROM "${table}" WHERE ${whereClause} LIMIT 1`;
  const result = await q(sql, params);
  return result.rows.length ? mapRowToCamelCase(result.rows[0]) : null;
}

export async function findFirst(
  table: string,
  options?: {
    where?: WhereCondition[];
    orderBy?: { column: string; dir?: string }[];
    select?: string[];
  }
): Promise<any | null> {
  const rows = await findMany(table, { ...options, limit: 1 });
  return rows.length ? rows[0] : null;
}

export async function create<T = any>(
  table: string,
  data: Record<string, any>,
  returning?: string[]
): Promise<T> {
  const q = getQueryFn();
  const columns: string[] = [];
  const values: any[] = [];
  const paramPlaceholders: string[] = [];
  let idx = 0;

  // Auto-generate id if not provided and table uses text-based id
  if (data.id === undefined) {
    data.id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }

  // Auto-add updatedAt for tables that have it
  if (data.updatedAt === undefined) {
    data.updatedAt = new Date();
  }

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    columns.push(`"${toSnakeCase(key)}"`);
    paramPlaceholders.push(`$${++idx}`);
    values.push(value);
  }

  const returningClause = buildReturningClause(returning);
  const sql = `INSERT INTO "${table}" (${columns.join(', ')}) VALUES (${paramPlaceholders.join(', ')})${returningClause}`;
  const result = await q(sql, values);
  return mapRowToCamelCase(result.rows[0]) as T;
}

export async function update<T = any>(
  table: string,
  where: WhereCondition[],
  data: Record<string, any>,
  returning?: string[]
): Promise<T | null> {
  const q = getQueryFn();
  const setClauses: string[] = [];
  const values: any[] = [];
  let idx = 0;

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    setClauses.push(`"${toSnakeCase(key)}" = $${++idx}`);
    values.push(value);
  }

  const { clause: whereClause, params: whereParams } = buildWhereClause(where, idx);
  const returningClause = buildReturningClause(returning);

  const sql = `UPDATE "${table}" SET ${setClauses.join(', ')} WHERE ${whereClause}${returningClause}`;
  const result = await q(sql, [...values, ...whereParams]);
  return result.rows.length ? mapRowToCamelCase(result.rows[0]) : null;
}

export async function remove(
  table: string,
  where: WhereCondition[],
  softDelete: boolean = true,
  userId?: string
): Promise<any | null> {
  if (softDelete) {
    return update(table, where, {
      isDeleted: true,
      deletedAt: new Date(),
      updatedById: userId,
    });
  }
  const q = getQueryFn();
  const { clause: whereClause, params } = buildWhereClause(where);
  const sql = `DELETE FROM "${table}" WHERE ${whereClause} RETURNING *`;
  const result = await q(sql, params);
  return result.rows.length ? mapRowToCamelCase(result.rows[0]) : null;
}

export async function count(
  table: string,
  where?: WhereCondition[],
  extraWhere?: string | { sql: string; params?: any[] }
): Promise<number> {
  const q = getQueryFn();
  const { clause: whereClause, params } = buildWhereClause(where || []);
  const whereSQL = whereClause ? `WHERE ${whereClause}` : '';
  let extraWhereSQL = '';
  let extraParams: any[] = [];
  if (extraWhere) {
    if (typeof extraWhere === 'string') {
      extraWhereSQL = `AND ${extraWhere}`;
    } else {
      extraWhereSQL = `AND ${extraWhere.sql}`;
      extraParams = extraWhere.params || [];
    }
  }
  const sql = `SELECT COUNT(*) as count FROM "${table}" ${whereSQL} ${extraWhereSQL}`;
  const result = await q(sql.trim(), [...params, ...extraParams]);
  return parseInt(result.rows[0].count, 10);
}

export async function exists(
  table: string,
  where: WhereCondition[]
): Promise<boolean> {
  const q = getQueryFn();
  const { clause: whereClause, params } = buildWhereClause(where);
  const sql = `SELECT 1 FROM "${table}" WHERE ${whereClause} LIMIT 1`;
  const result = await q(sql, params);
  return result.rows.length > 0;
}

export async function groupBy(
  table: string,
  options: {
    by: string[];
    where?: WhereCondition[];
    _count?: string[];
    _sum?: string[];
    _avg?: string[];
    _min?: string[];
    _max?: string[];
  }
): Promise<any[]> {
  const q = getQueryFn();
  const byCols = options.by.map((c) => `"${toSnakeCase(c)}"`).join(', ');
  const { clause: whereClause, params } = buildWhereClause(options.where || []);
  const whereSQL = whereClause ? `WHERE ${whereClause}` : '';

  const aggregates: string[] = [];
  for (const col of options._count || []) aggregates.push(`COUNT("${toSnakeCase(col)}") as "${toSnakeCase(col)}_count"`);
  for (const col of options._sum || []) aggregates.push(`COALESCE(SUM("${toSnakeCase(col)}"), 0) as "${toSnakeCase(col)}_sum"`);
  for (const col of options._avg || []) aggregates.push(`COALESCE(AVG("${toSnakeCase(col)}"), 0) as "${toSnakeCase(col)}_avg"`);
  for (const col of options._min || []) aggregates.push(`MIN("${toSnakeCase(col)}") as "${toSnakeCase(col)}_min"`);
  for (const col of options._max || []) aggregates.push(`MAX("${toSnakeCase(col)}") as "${toSnakeCase(col)}_max"`);

  const sql = `SELECT ${byCols}${aggregates.length ? ', ' + aggregates.join(', ') : ''} FROM "${table}" ${whereSQL} GROUP BY ${byCols}`;
  const result = await q(sql.trim(), params);
  return result.rows.map(mapRowToCamelCase);
}

export async function transact<T>(callback: (q: (text: string, params?: any[]) => Promise<QueryResult>) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const txnQuery = (text: string, params?: any[]) => client.query(text, params);
    const result = await transactionStorage.run({ query: txnQuery }, () => callback(txnQuery));
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
