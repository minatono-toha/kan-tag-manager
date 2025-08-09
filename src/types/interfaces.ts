export interface Ship {
  id: number
  libraryId: number
  shipType: string
  shipTypeCategory: string
  speed: string
  bannerId: number
  filterId: number
  name: string
  orig: number
  class: string
  filtertype_jp: string
  filtertype_en: string
  updateLevel: number
}

export interface Event {
  eventId: number
  eventStart: Date
  eventEnd: Date
  event_en: string
  eventName: string
  mapId: number
  stage: string
  mapPlace: string
  tagId1: number
  tagId2: number
  tagId3: number
  tagId4: number
  tagId: number
  event: string
  tagName: string
  tagColor: string
  tagging1: string
  tagging2: string
  tagging3: string
  // mapId_1 ～ mapId_15 を統一的に扱う
  [key: `mapId_${number}`]: number
}

// 拡張型
export interface ShipWithSpAttack extends Ship {
  spAttackData: Record<string, number>
}

// --- Vueコンポーネント用Props型 ---
export interface ShipFilter {
  id: number;
  label: string;
}

export interface ShipModalProps {
  ships: Ship[];
  modalVisible: boolean;
  selectedShipOrig: number | null;
}

export interface ShipListTableProps {
  ships: Ship[];
}

export interface ShipCardProps {
  ship: Ship;
  showBanner?: boolean;
}

export interface ShipFilterTabsProps {
  filters: ShipFilter[];
  selectedFilterIds: number[];
  isAllSelected: boolean;
}

export interface AttackTableProps {
  filteredUniqueOrigs: Ship[];
}

export interface AttackTableBodyProps {
  sortedShips: ShipWithSpAttack[];
  sortedEventMaps: Event[];
  expandedStages: Record<number, boolean>;
  rowStyle: object;
  getCellStyle: (spAttackData: number | undefined) => object;
}

export interface GroupedStage {
  stageNum: number;
  count: number;
}

export interface AttackTableHeaderProps {
  groupedStageNums: GroupedStage[];
  sortedEventMaps: Event[];
  expandedStages: Record<number, boolean>;
  sortKey: string;
  sortOrder: string;
  anyStageExpanded: boolean;
  cellStyle?: Partial<CSSStyleDeclaration>;
  headerStyle?: Partial<CSSStyleDeclaration>;
}
