// Shared sort comparator for ships: filterId asc, then libraryId asc.
// Used by useShips and useAttackData when no explicit sort key is set.

export interface ShipSortable {
  filterId?: number | null
  libraryId?: number | null
}

export const compareShipsByFilterAndLibrary = (a: ShipSortable, b: ShipSortable): number => {
  const fa = a.filterId ?? 0
  const fb = b.filterId ?? 0
  if (fa !== fb) return fa - fb
  return (a.libraryId || 0) - (b.libraryId || 0)
}

export interface ShipForm {
  updateLevel: number
  bannerId: number
}

// グループ(spGroupId)の「基本艦」= 最も改装段階の低い形態。未着任時に行へ出る形態であり、
// 着任時の既定変種でもある。
// bannerId は改装段階順ではない(Iowa改=360 < Iowa=440)ので、bannerId で選んではいけない。
// updateLevel が同値の形態(神威 / 神威改母)だけ bannerId で決める。
export const isBaseFormOf = (candidate: ShipForm, current: ShipForm | undefined): boolean => {
  if (!current) return true
  if (candidate.updateLevel !== current.updateLevel) return candidate.updateLevel < current.updateLevel
  return candidate.bannerId < current.bannerId
}

export interface ShipRow {
  spGroupId: number
  orig: number
  filterId?: number | null
  libraryId?: number | null
}

// 特攻グループ分割で別行にした艦(spGroupId !== orig。千歳航・Верный など)は、
// 分割元の系統の行の直下に置く。単独で libraryId 順に並ぶと元の艦から離れてしまい、
// 「同じ艦の別形態が別行になっている」ことが読み取れないため。
//
// 艦種フィルタで分割元の行が消えている場合(千歳=水母 / 千歳航=軽空母)は、寄せる先が無いので
// 通常の並び順のままにする。分割元が居るときだけ直下に寄せる。
export const orderShipRows = <T extends ShipRow>(rows: T[]): T[] => {
  const sorted = [...rows].sort(compareShipsByFilterAndLibrary)
  const parentOf = new Map<number, T>() // 系統ID -> 分割元の行
  for (const row of sorted) {
    if (row.spGroupId === row.orig) parentOf.set(row.orig, row)
  }

  const children = new Map<T, T[]>()
  const ordered: T[] = []
  for (const row of sorted) {
    const parent = row.spGroupId !== row.orig ? parentOf.get(row.orig) : undefined
    if (parent) {
      const siblings = children.get(parent) ?? []
      siblings.push(row)
      children.set(parent, siblings)
    } else {
      ordered.push(row)
    }
  }
  return ordered.flatMap((row) => [row, ...(children.get(row) ?? [])])
}

export interface ShipLineage {
  orig: number
  spGroupId: number
}

// spGroupId で指定したグループの系統(orig)に、別の spGroupId へ分割されている形態が
// 他に存在するか。改装段階の選択UI(▼ポップアップ・詳細モーダル)で「この一覧には
// 出てこない改装段階が別の行にある」ことを案内するために使う。
export const hasSpGroupSplit = (allShips: ShipLineage[], spGroupId: number): boolean => {
  const rep = allShips.find((s) => s.spGroupId === spGroupId)
  if (!rep) return false
  const distinctGroups = new Set(allShips.filter((s) => s.orig === rep.orig).map((s) => s.spGroupId))
  return distinctGroups.size > 1
}
