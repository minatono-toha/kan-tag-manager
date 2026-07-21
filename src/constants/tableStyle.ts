// src/constants/tableStyle.ts

// 表本体の行の高さ（px）— 1画面に入る行数を増やすため、余白を詰めて約2割低くしている
export const TABLE_ROW_HEIGHT = 26

// フォントサイズ（CSSの文字列指定）
export const TABLE_FONT_SIZE = '12px'

// セル内のパディング — 横方向に余白を増やして読みやすさを向上
export const TABLE_PADDING = '4px 8px'

// 表本体のセルのパディング。行を低くした分、縦方向だけ詰める。
// ここを詰めないと、セルの中身(増減ボタン等)の高さが行の高さを上回って
// TABLE_ROW_HEIGHT が効かなくなる。タイトル行は TABLE_PADDING のまま。
export const TABLE_BODY_PADDING = '2px 8px'

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
  bodyPadding: TABLE_BODY_PADDING,
  width: TABLE_WIDTH,
  whiteSpace: TABLE_WHITE_SPACE,
}
