// src/constants/tableStyle.ts

// 行の高さ（px）
export const TABLE_ROW_HEIGHT = 30

// フォントサイズ（CSSの文字列指定） - Tailwindのtext-xs (12px) 相当
export const TABLE_FONT_SIZE = '12px'

// セル内のパディング
export const TABLE_PADDING = '4px'

// ヘッダーの高さ（必要であれば）
export const TABLE_HEADER_HEIGHT = 40

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
