export interface FleetAnalysisShip {
  id: number // Unique ID (not used in our app)
  ship_id: number // Banner ID (equivalent to libraryId? No, it's bannerId which maps to ship master)
  lv: number
  st: number[] // Stats
  exp: number[]
  area: number // Tag ID
  ex: number
  sp: number[] // Special attack or something?
  // 本アプリ独自の拡張。艦隊分析コードの area だけでは「割当先を決めただけ」と
  // 「実際に札が付いている」を区別できないため、割当済みかどうかを別に持たせる。
  // ゲーム由来のコードには存在しないので、無い場合は area > 0 を割当済みとみなす。
  ktm_assigned?: boolean
}

// Helper to convert array to JSON string nicely
export function generateFleetAnalysisJSON(ships: FleetAnalysisShip[]): string {
  return JSON.stringify(ships)
}

const isNumberArray = (v: unknown): v is number[] =>
  Array.isArray(v) && v.every((n) => typeof n === 'number' && Number.isFinite(n))

// 取り込んだJSONが艦隊分析形式として妥当かを最低限検証する
function isFleetAnalysisShip(v: unknown): v is FleetAnalysisShip {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false
  const o = v as Record<string, unknown>
  return (
    (o.ktm_assigned === undefined || typeof o.ktm_assigned === 'boolean') &&
    typeof o.ship_id === 'number' &&
    typeof o.lv === 'number' &&
    typeof o.area === 'number' &&
    typeof o.ex === 'number' &&
    typeof o.id === 'number' &&
    isNumberArray(o.st) &&
    isNumberArray(o.exp) &&
    isNumberArray(o.sp)
  )
}

export function parseFleetAnalysisJSON(json: string): FleetAnalysisShip[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (e) {
    console.error('Failed to parse JSON', e)
    throw new Error('Invalid JSON format')
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid JSON format: expected an array')
  }
  const invalidIndex = parsed.findIndex((entry) => !isFleetAnalysisShip(entry))
  if (invalidIndex !== -1) {
    console.error('Invalid fleet analysis entry at index', invalidIndex, parsed[invalidIndex])
    throw new Error('Invalid JSON format: unexpected data structure')
  }
  return parsed
}
