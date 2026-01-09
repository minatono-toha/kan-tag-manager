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
  read_kana?: string
  read_kata?: string
  read_romaji1?: string
  read_romaji2?: string
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
export interface ShipWithSpAttack extends ExpandedShip {
  spAttackData: Record<string, number>
}

// 艦船所持数データ (グローバル、イベント非依存)
export interface ShipOwnership {
  id?: string // `${orig}`
  orig: number // 艦ID
  count: number // 所持数 (0-30)
}

// 札管理データ (イベントごと、艦インスタンスごと)
export interface TagManagement {
  id?: string // `${eventId}_${orig}_${shipIndex}`
  eventId: number
  orig: number // Ship ID
  shipIndex: number // 何隻目か (0-29)
  assigned: boolean // 割り当て済み
  preserve: boolean // 温存
  targetStage: string // 割当先
  comment: string // コメント
}

// 展開された艦船データ（所持数に応じて複数インスタンス化）
export interface ExpandedShip extends Ship {
  shipIndex: number // 何隻目か (0-29)
  ownershipCount: number // この艦の総所持数
}

// 更新履歴データ
export interface Changelog {
  c_logId: number // ログID（ソート用）
  c_logDate: any // Firestore Timestamp
  c_logStr: string // ログメッセージ
}

// 艦船改修段階の上書き保存データ
export interface ShipVariantOverride {
  id?: string // `${orig}_${shipIndex}`
  orig: number
  shipIndex: number
  variantId: number // Selected Ship.id
}

// 公開QAデータ
export interface QA {
  id?: string
  qa_category: number
  qa_status: number
  qa_createDate: any // Firestore Timestamp
  qa_updateDate: any // Firestore Timestamp
  qa_question: string
  qa_answer: string
}
