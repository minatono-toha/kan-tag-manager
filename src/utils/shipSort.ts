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
