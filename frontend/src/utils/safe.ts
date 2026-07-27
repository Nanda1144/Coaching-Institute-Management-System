export function safeString(val: unknown, fallback = ''): string {
  if (typeof val === 'string') return val
  if (typeof val === 'number' || typeof val === 'boolean') return String(val)
  return fallback
}

export function safeNumber(val: unknown, fallback = 0): number {
  if (typeof val === 'number' && !Number.isNaN(val)) return val
  if (typeof val === 'string') {
    const n = Number(val)
    if (!Number.isNaN(n)) return n
  }
  return fallback
}

export function safeBool(val: unknown, fallback = false): boolean {
  if (typeof val === 'boolean') return val
  if (val === 'true' || val === '1' || val === 1) return true
  if (val === 'false' || val === '0' || val === 0) return false
  return fallback
}

export function safeDate(val: unknown, fallback = ''): string {
  if (typeof val === 'string' && val) {
    const d = new Date(val)
    if (!Number.isNaN(d.getTime())) {
      try { return d.toISOString().split('T')[0] } catch { return val }
    }
    return val
  }
  if (val instanceof Date && !Number.isNaN(val.getTime())) {
    try { return val.toISOString().split('T')[0] } catch { return fallback }
  }
  return fallback
}

export function safeDateTime(val: unknown, fallback = ''): string {
  if (typeof val === 'string' && val) {
    const d = new Date(val)
    if (!Number.isNaN(d.getTime())) {
      try { return d.toISOString() } catch { return val }
    }
    return val
  }
  if (val instanceof Date && !Number.isNaN(val.getTime())) {
    try { return val.toISOString() } catch { return fallback }
  }
  return fallback
}

export function safeArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val
  return []
}

export function safeObject<T extends Record<string, unknown>>(val: unknown, fallback?: T): T {
  if (val !== null && val !== undefined && typeof val === 'object' && !Array.isArray(val)) {
    return val as T
  }
  return (fallback ?? {}) as T
}

export function safeEnum<T extends string>(val: unknown, allowed: readonly T[], fallback: T): T {
  const str = safeString(val) as T
  if (allowed.includes(str)) return str
  return fallback
}

export function safeEmail(val: unknown): string {
  const str = safeString(val)
  if (!str) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(str) ? str : ''
}

export function safePhone(val: unknown): string {
  const str = safeString(val).replace(/[\s-]/g, '')
  return str || ''
}

export function safeUrl(val: unknown): string {
  const str = safeString(val)
  if (!str) return ''
  try {
    new URL(str)
    return str
  } catch {
    return ''
  }
}

export function safeJoin(arr: unknown, separator = ', '): string {
  if (!Array.isArray(arr)) return safeString(arr)
  return arr.filter((x) => x !== null && x !== undefined).map(String).join(separator)
}

export function safeTruncate(val: unknown, max = 100): string {
  const str = safeString(val)
  if (str.length <= max) return str
  return str.slice(0, max).trimEnd() + '...'
}

export function safeMap<K extends string, V>(val: unknown, fallback: Record<K, V> = {} as Record<K, V>): Record<K, V> {
  if (val !== null && val !== undefined && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<K, V>
  }
  return fallback
}

export function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.length > 0
}

export function isPlainObject(val: unknown): val is Record<string, unknown> {
  return val !== null && val !== undefined && typeof val === 'object' && !Array.isArray(val)
}

export function isValidDate(val: unknown): boolean {
  if (val instanceof Date) return !Number.isNaN(val.getTime())
  if (typeof val === 'string' && val) return !Number.isNaN(new Date(val).getTime())
  return false
}
