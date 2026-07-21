// src/constants/attackColumns.ts

// 特攻表の列幅は内容に合わせて自動で決まる(固定幅にすると札名が重なる)。
// ただしヘッダ行と表本体は別テーブルなので、ヘッダ側で決まった列幅を本体へ渡す必要がある。
// 本体のセルは必ず「小数点2桁の数値」なので、列幅はヘッダ側だけで決めてよい。
// ＝ ヘッダ → 本体 の一方向。本体の幅がヘッダに影響しないので、測って配り直すループにならない。

// 折りたたんだ海域グループの最小幅。見出し(E-1 等)が読める幅を確保する。
export const SP_ATTACK_COLLAPSED_MIN_WIDTH = 100

// 折りたたみ中のグループはヘッダで1つのセル(colspan=N)にまとめられるが、
// 表本体の列は N 本あるので、実測した幅を N 等分して列に配り直す。
// 端数は最後の列で吸収し、合計が元の幅と一致するようにする(1pxのずれも横位置の狂いになる)。
export const distributeSpanWidth = (width: number, span: number): number[] => {
  if (span <= 1) return [width]
  const base = Math.floor((width / span) * 100) / 100
  const widths = Array.from({ length: span - 1 }, () => base)
  widths.push(width - base * (span - 1))
  return widths
}
