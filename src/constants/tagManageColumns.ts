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

// コメント欄以外は常に表示する（表示切替はコメント欄の出し入れだけ）
const ALWAYS_VISIBLE_COLUMNS: TagManageColumn[] = [
  'assigned',
  'preserve',
  'targetStage',
  'assignedTag',
]

const sumWidths = (columns: readonly TagManageColumn[]): number =>
  columns.reduce((total, key) => total + TAG_MANAGE_COLUMNS[key], 0)

export const TAG_MANAGE_WITH_COMMENT_WIDTH = sumWidths(
  Object.keys(TAG_MANAGE_COLUMNS) as TagManageColumn[],
)

export const TAG_MANAGE_WITHOUT_COMMENT_WIDTH = sumWidths(ALWAYS_VISIBLE_COLUMNS)

export const tagManageTableWidth = (showComment: boolean): number =>
  showComment ? TAG_MANAGE_WITH_COMMENT_WIDTH : TAG_MANAGE_WITHOUT_COMMENT_WIDTH
