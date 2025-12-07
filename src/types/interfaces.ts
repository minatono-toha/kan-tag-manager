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
  wiki_url?: string
}

export interface EventInfo {
  eventId: number
  event_jp: string
  event_en: string
  eventName: string
  eventStart: any // Firestore Timestamp or Date
  eventEnd: any // Firestore Timestamp or Date
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
  stageNum: number
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

// 札管理データ
export interface TagManagement {
  id?: string
  eventId: number
  orig: number  // Ship ID
  assigned: boolean  // 割り当て済み
  preserve: boolean  // 温存
  targetStage: string  // 割当先
  comment: string  // コメント
}
