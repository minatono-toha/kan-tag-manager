export interface FleetAnalysisShip {
  id: number // Unique ID (not used in our app)
  ship_id: number // Banner ID (equivalent to libraryId? No, it's bannerId which maps to ship master)
  lv: number
  st: number[] // Stats
  exp: number[]
  area: number // Tag ID
  ex: number
  sp: number[] // Special attack or something?
}

// Helper to convert array to JSON string nicely
export function generateFleetAnalysisJSON(ships: FleetAnalysisShip[]): string {
  return JSON.stringify(ships)
}

export function parseFleetAnalysisJSON(json: string): FleetAnalysisShip[] {
  try {
    return JSON.parse(json) as FleetAnalysisShip[]
  } catch (e) {
    console.error('Failed to parse JSON', e)
    throw new Error('Invalid JSON format')
  }
}
