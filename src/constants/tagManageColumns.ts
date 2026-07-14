// src/constants/tagManageColumns.ts

// 制御札管理テーブルの列幅（px）。
// テーブル全体の幅とコンテナの最小幅はここから算出するため、列幅の変更はこのファイルだけで完結する。
export const TAG_MANAGE_COLUMNS = {
  assigned: 60,
  preserve: 60,
  targetStage: 80,
  assignedTag: 120,
  comment: 150,
} as const

export type TagManageColumn = keyof typeof TAG_MANAGE_COLUMNS

// checkOnly（簡易表示）モードで表示する列
const CHECK_ONLY_COLUMNS: TagManageColumn[] = ['assigned', 'preserve', 'assignedTag']

const sumWidths = (columns: readonly TagManageColumn[]): number =>
  columns.reduce((total, key) => total + TAG_MANAGE_COLUMNS[key], 0)

export const TAG_MANAGE_DETAIL_WIDTH = sumWidths(
  Object.keys(TAG_MANAGE_COLUMNS) as TagManageColumn[],
)

export const TAG_MANAGE_CHECK_ONLY_WIDTH = sumWidths(CHECK_ONLY_COLUMNS)

export const tagManageTableWidth = (displayMode: 'detail' | 'checkOnly'): number =>
  displayMode === 'detail' ? TAG_MANAGE_DETAIL_WIDTH : TAG_MANAGE_CHECK_ONLY_WIDTH
