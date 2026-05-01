// Date helpers that handle Firestore Timestamps, Date instances, ISO strings, and numbers.

const toDate = (value: unknown): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate()
  }
  const d = new Date(value as string | number)
  return isNaN(d.getTime()) ? null : d
}

export const formatDate = (value: unknown, fallback = '-'): string => {
  const d = toDate(value)
  if (!d || isNaN(d.getTime())) return fallback
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

export const toJsDate = (value: unknown): Date | null => toDate(value)
