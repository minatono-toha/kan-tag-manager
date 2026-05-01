// UI-only string union types. Kept separate from data interfaces so component
// files can import display-mode types without dragging in domain models.

export type ShipDisplayMode = 'card' | 'table'
export type TagManageDisplayMode = 'table' | 'card'
export type AttackSortMode = 'area' | 'tag'
export type SortOrder = 'asc' | 'desc'
export type ImportMode = 'merge' | 'replace'
export type ConfirmVariant = 'primary' | 'danger'
