import type { Ship } from '@/types/interfaces'

// 艦名の表記ゆれ(空白の有無)を吸収した比較キー。
// 例: 'Glorious 改(航)' → 'Glorious改(航)'
export const normalizeShipName = (name: string): string => name.replace(/\s+/g, '')

// 艦これ上は同名なのに、当アプリでは艦種の異なる別形態として扱う艦。
// CSV には艦これ表記の名前しか書けないため、取り込み時に艦種をユーザーへ選択してもらう。
// キーは normalizeShipName() 済みの艦これ表記、値は候補形態の bannerId(表示順)。
// 表示ラベルはマスタの shipType / updateLevel から組み立てるので、ここには持たせない。
const AMBIGUOUS_SHIP_BANNER_IDS: Record<string, number[]> = {
  // Glorious は巡洋戦艦形態と正規空母形態で特攻グループが分かれる (spGroupId 612 / 9741)
  Glorious: [1022, 1027],
  Glorious改: [740, 741],
  // 宗谷は同一グループだが、形態によって詳細表示の見え方が変わる
  宗谷: [699, 645, 650],
}

// 選択が必要な艦名なら候補の bannerId を返す。通常の艦は undefined。
export const getAmbiguousBannerIds = (name: string): number[] | undefined =>
  AMBIGUOUS_SHIP_BANNER_IDS[normalizeShipName(name)]

// ユーザーへの艦種選択を依頼するときの情報。
export interface AmbiguousShipPrompt {
  // CSV に書かれていた艦名
  name: string
  // 同名艦のうち何隻目か (1始まり)。複数所持なら都度選択してもらう。
  index: number
  // CSV 内の同名艦の総数
  total: number
  // 選択肢となる形態
  candidates: Ship[]
}

// 選んだ形態の bannerId を返す。null は取り込み自体のキャンセル。
export type AmbiguousShipResolver = (prompt: AmbiguousShipPrompt) => Promise<number | null>
