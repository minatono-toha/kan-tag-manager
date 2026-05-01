// src/constants/tableStyle.ts

// 行の高さ（px）— 密度はほぼ維持しつつ可読性を上げるため微増
export const TABLE_ROW_HEIGHT = 32

// フォントサイズ（CSSの文字列指定）
export const TABLE_FONT_SIZE = '12px'

// セル内のパディング — 横方向に余白を増やして読みやすさを向上
export const TABLE_PADDING = '4px 8px'

// ヘッダーの高さ
export const TABLE_HEADER_HEIGHT = 42

// 表の幅（必要に応じて）
export const TABLE_WIDTH = '100%'

// セルのホワイトスペース制御（自動改行しない）
export const TABLE_WHITE_SPACE = 'nowrap'

// 全体スタイルまとめ
export const TABLE_STYLE = {
  rowHeight: TABLE_ROW_HEIGHT,
  headerHeight: TABLE_HEADER_HEIGHT,
  fontSize: TABLE_FONT_SIZE,
  padding: TABLE_PADDING,
  width: TABLE_WIDTH,
  whiteSpace: TABLE_WHITE_SPACE,
}
