export interface QACategory {
  id: number | null
  name: string
}

export const QA_CATEGORIES: QACategory[] = [
  { id: null, name: 'すべて' },
  { id: 1, name: '艦情報修正' },
  { id: 2, name: '特攻情報修正' },
  { id: 3, name: '改善要望' },
  { id: 4, name: '不具合修正' },
  { id: 5, name: 'その他' },
]

export const QA_STATUS_NAMES: Record<number, string> = {
  1: '未回答',
  2: '対応中',
  3: '回答済',
  4: '対応保留',
}

export const QA_STATUS_STYLES: Record<number, string> = {
  1: 'bg-gray-100 text-gray-600',
  2: 'bg-yellow-100 text-yellow-700',
  3: 'bg-green-100 text-green-700',
  4: 'bg-blue-100 text-blue-700',
}

export const getQACategoryName = (id: number): string => {
  const cat = QA_CATEGORIES.find((c) => c.id === id)
  return cat ? cat.name : '不明'
}

export const getQAStatusName = (status: number): string => QA_STATUS_NAMES[status] || '不明'

export const getQAStatusStyle = (status: number): string =>
  QA_STATUS_STYLES[status] || QA_STATUS_STYLES[1]
