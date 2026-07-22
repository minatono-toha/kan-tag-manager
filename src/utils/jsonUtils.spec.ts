import { describe, it, expect } from 'vitest'
import { parseFleetAnalysisJSON, type FleetAnalysisShip } from './jsonUtils'

const baseShip: FleetAnalysisShip = {
  id: 1,
  ship_id: 318,
  lv: 175,
  st: [0, 0, 0, 0, 0, 0, 0],
  exp: [0, 0, 0],
  area: 1,
  ex: 1,
  sp: [],
}

describe('parseFleetAnalysisJSON', () => {
  it('ゲーム由来のコード(ktm_assigned なし)を受け入れる', () => {
    const parsed = parseFleetAnalysisJSON(JSON.stringify([baseShip]))
    expect(parsed[0].ktm_assigned).toBeUndefined()
  })

  it('本アプリが生成した ktm_assigned を保持する', () => {
    const parsed = parseFleetAnalysisJSON(JSON.stringify([{ ...baseShip, ktm_assigned: false }]))
    expect(parsed[0].ktm_assigned).toBe(false)
    expect(parsed[0].area).toBe(1)
  })

  it('ktm_assigned の型が不正なら弾く', () => {
    expect(() =>
      parseFleetAnalysisJSON(JSON.stringify([{ ...baseShip, ktm_assigned: 1 }])),
    ).toThrow()
  })
})
