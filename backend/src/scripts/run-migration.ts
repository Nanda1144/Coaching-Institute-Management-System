import fs from 'fs';
import path from 'path';
import { query } from '../config/database';

async function main() {
  const migrationFile = path.resolve(__dirname, '../../prisma/migrations/20260730000000_add_subscription/migration.sql');
  const sql = fs.readFileSync(migrationFile, 'utf-8');
  const statements = sql.split(';').filter(s => s.trim());
  console.log(`Running migration: ${path.basename(path.dirname(migrationFile))}`);
  for (const stmt of statements) {
    try {
      await query(stmt);
      console.log('  ✓');
    } catch (err: any) {
      if (err.message?.includes('already exists') || err.message?.includes('already been applied')) {
        console.log('  - already exists, skipping');
      } else {
        console.error(`  ✗ ${err.message}`);
      }
    }
  }
  console.log('Migration complete');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
