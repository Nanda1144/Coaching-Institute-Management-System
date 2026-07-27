export function unwrapApiResponse<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];

  const obj = response as Record<string, unknown> | null | undefined;
  if (!obj) return [];

  // { success: true, data: [...] }
  if (obj.data && Array.isArray(obj.data)) return obj.data as T[];

  // { data: { data: [...] } }
  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    const nested = (obj.data as Record<string, unknown>).data;
    if (Array.isArray(nested)) return nested as T[];
  }

  return [];
}

export function unwrapApiObject<T extends Record<string, unknown>>(response: unknown): T | null {
  if (!response || typeof response !== 'object') return null;

  const obj = response as Record<string, unknown>;

  // { success: true, data: { ... } }
  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    return obj.data as T;
  }

  return obj as T;
}

export function getFacultyName(faculty: unknown): string {
  if (!faculty || typeof faculty !== 'object') return String(faculty || '');
  const f = faculty as Record<string, unknown>;
  return String(f.fullName || f.name || `${f.firstName || ''} ${f.lastName || ''}`.trim() || '');
}

export function getInitials(name: unknown, fallback = '?'): string {
  if (!name || typeof name !== 'string') return fallback;
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || fallback;
}

export function safeUpperFirst(value: unknown, fallback = ''): string {
  if (!value || typeof value !== 'string') return fallback;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function safeConfig<T extends Record<string, any>>(
  lookup: Record<string, T> | undefined,
  key: string | undefined,
  fallback: T
): T {
  if (!lookup || !key) return fallback;
  return lookup[key] || fallback;
}
