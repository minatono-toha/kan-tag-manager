// src/constants/shipListColumns.ts

// 艦船情報テーブルの列幅（px）。
// ヘッダ行と表本体を別テーブルに分けているため、両方へ同じ colgroup を出して幅を揃える。
// 内容依存の auto レイアウトが使えないので、最長の内容が収まる幅をここで決め打ちする。
// 幅の調整はこのファイルだけで完結する。
export const SHIP_LIST_COLUMNS = {
  libraryId: 64,
  shipType: 88,
  // 増減ボタン + 艦名 + 「(0隻:未着任)」 + 改装段階の▼ が並ぶ最も広い列。
  // ヘッダの注記「改装段階によって特攻倍率が変動する艦に※を付けています」を
  // 1行(10px × 27文字 = 270px)で表示するため、左右の余白 16px を足した幅を確保する。
  name: 320,
  class: 150,
  speed: 64,
  // 最長ラベル「(改造後)大発系・内火艇OK」が収まる幅
  groundAtk: 190,
} as const

export type ShipListColumn = keyof typeof SHIP_LIST_COLUMNS

// 図鑑ID列は現在非表示。再表示は true に戻すだけでよいよう、列自体は残してある。
// 表の幅はヘッダ帯の列幅にも使うため、この判定は表の外からも参照できる必要がある。
export const SHOW_LIBRARY_ID = false

// 詳細表示の列順。図鑑ID は既定で非表示（ShipListTable の SHOW_LIBRARY_ID）。
const DETAIL_COLUMNS: readonly ShipListColumn[] = [
  'libraryId',
  'shipType',
  'name',
  'class',
  'speed',
  'groundAtk',
]

// 表示中の列キーを表示順で返す。艦名のみ表示では艦名列だけになる。
export const visibleShipListColumns = (
  displayMode: 'detail' | 'nameOnly',
  showLibraryId: boolean,
): ShipListColumn[] => {
  if (displayMode !== 'detail') return ['name']
  return DETAIL_COLUMNS.filter((key) => key !== 'libraryId' || showLibraryId)
}

// 表全体の幅（px）。ヘッダ用と本体用のテーブルに同じ値を与える。
export const shipListTableWidth = (
  displayMode: 'detail' | 'nameOnly',
  showLibraryId: boolean,
): number =>
  visibleShipListColumns(displayMode, showLibraryId).reduce(
    (total, key) => total + SHIP_LIST_COLUMNS[key],
    0,
  )
