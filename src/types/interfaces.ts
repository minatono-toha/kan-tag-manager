export interface Ship {
  // 旧内部ID。新規追加艦には存在せず信頼できないため、艦の同一性判定には使わない。
  // 同一性は bannerId（＝ゲーム艦ID / 艦隊分析コードの ship_id）で行う。
  id?: number
  libraryId: number
  // 行/所持/札/特攻のグルーピング単位。既定は orig。
  // 改装段階で特攻倍率が変わる例外形態(龍鳳・Верный 等)は独立値を持ち、別行として扱う。
  spGroupId: number
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
  // 対地装備(上陸用舟艇・特型内火艇)の可否。形態(bannerId)ごとに異なる。
  // 0=どちらもNG
  // 1=大発系のみ / 2=内火艇のみ / 3=どちらもOK        … 今の形態で装備できる
  // 4/5/6 = 上記の「(改造後)」版                      … 今は不可だが改装を進めれば装備できる
  ground_atk?: number
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
  eventStart: unknown // Firestore Timestamp or Date
  eventEnd: unknown // Firestore Timestamp or Date
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
  targetStage: string // 割当先 (例: "E-1 (甲第一遊撃部隊)")
  tagId: number // 札ID (0=未割当)
  comment: string // コメント
}

// ユーザー所持艦 (正規化されたマスタデータ)
// 旧 shipOwnership (数) + shipVariant (改造段階) + TagManagementのメタデータ を統合
export interface UserShip {
  id?: string // `${orig}_${shipIndex}`
  uniqueId?: number // オリジナルの艦隊分析コードのid (情報のロストを防ぐため)
  orig: number // グルーピングID (= Ship.spGroupId。既定は系統ID、例外形態は独立値)
  shipIndex: number // 何隻目か (0-29)
  variantId: number // 現在の改造段階の bannerId (＝ゲーム艦ID / 艦隊分析コードの ship_id)
  lv: number
  st: number[]
  exp: number[]
  ex: number
  sp: number[]
}

// 展開された艦船データ（所持数に応じて複数インスタンス化）
// 注意: orig にはグルーピングID(spGroupId)が入り、元の系統IDは失われる。
// 分割行かどうかは展開時に isSpGroupSplit へ退避しておく。
export interface ExpandedShip extends Ship {
  shipIndex: number // 何隻目か (0-29)
  ownershipCount: number // この艦の総所持数
  isSpGroupSplit: boolean // 特攻グループ分割で系統から切り出した行か (艦名末尾の ※)
}

// 更新履歴データ
export interface Changelog {
  c_logId: number // ログID（ソート用）
  c_logDate: unknown // Firestore Timestamp
  c_logStr: string // ログメッセージ
}

// 艦船改修段階の上書き保存データ
export interface ShipVariantOverride {
  id?: string // `${orig}_${shipIndex}`
  orig: number
  shipIndex: number
  variantId: number // Selected Ship.bannerId
}

// 公開QAデータ
export interface QA {
  id?: string
  qa_category: number
  qa_status: number
  qa_createDate: unknown // Firestore Timestamp
  qa_updateDate: unknown // Firestore Timestamp
  qa_question: string
  qa_answer: string
}
