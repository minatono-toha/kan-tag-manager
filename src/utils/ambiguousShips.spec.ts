import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { normalizeShipName, getAmbiguousBannerIds } from './ambiguousShips'

// マスタ(Firestoreダンプ)は .gitignore 対象で、手元にしか無い。
// static import にするとダンプの無い環境(CI)で型解決に失敗してビルドごと落ちるため、
// ファイルの有無を見てから読み、無ければ突合テストだけを飛ばす。
// テスト環境は jsdom で import.meta.url が file: にならないため、
// vitest.config.ts の root と同じプロジェクトルートからのパスで解決する。
type MasterShip = { bannerId: number; name: string; shipType: string; updateLevel: number }
const masterPath = resolve(process.cwd(), 'data/master/shiplist.json')
const hasMaster = existsSync(masterPath)
const shiplist: MasterShip[] = hasMaster ? JSON.parse(readFileSync(masterPath, 'utf-8')) : []

describe('normalizeShipName', () => {
  it('空白の有無を吸収する', () => {
    expect(normalizeShipName('Glorious 改(航)')).toBe('Glorious改(航)')
    expect(normalizeShipName('  雪風 ')).toBe('雪風')
  })
})

describe('getAmbiguousBannerIds', () => {
  it('艦これ表記の Glorious / Glorious改 を候補付きで返す', () => {
    expect(getAmbiguousBannerIds('Glorious')).toEqual([1022, 1027])
    expect(getAmbiguousBannerIds('Glorious 改')).toEqual([740, 741])
    expect(getAmbiguousBannerIds('Glorious改')).toEqual([740, 741])
  })

  it('宗谷は3形態を改装段階順で返す', () => {
    expect(getAmbiguousBannerIds('宗谷')).toEqual([699, 645, 650])
  })

  it('通常の艦は選択不要', () => {
    expect(getAmbiguousBannerIds('雪風')).toBeUndefined()
    expect(getAmbiguousBannerIds('大和')).toBeUndefined()
  })
})

// 候補の bannerId はマスタ更新でズレると黙って選択肢が消えるため、マスタと突き合わせる。
// マスタが無い環境(CI)では検証できないので飛ばす。ダンプを更新したら手元で流すこと。
describe.skipIf(!hasMaster)('マスタとの整合性', () => {
  const byBannerId = new Map(shiplist.map((s) => [s.bannerId, s]))

  it('Glorious の候補が戦艦形態と空母形態になっている', () => {
    const [bb, cv] = getAmbiguousBannerIds('Glorious')!.map((id) => byBannerId.get(id)!)
    expect(bb.shipType).toBe('巡洋戦艦')
    expect(cv.shipType).toBe('正規空母')
  })

  it('Glorious改 の候補が戦艦形態と空母形態になっている', () => {
    const [bb, cv] = getAmbiguousBannerIds('Glorious改')!.map((id) => byBannerId.get(id)!)
    expect(bb.shipType).toBe('巡洋戦艦')
    expect(cv.shipType).toBe('正規空母')
  })

  it('宗谷の候補が改装段階順の3形態になっている', () => {
    const forms = getAmbiguousBannerIds('宗谷')!.map((id) => byBannerId.get(id)!)
    expect(forms.map((f) => [f.shipType, f.updateLevel])).toEqual([
      ['特務艦', 0],
      ['灯台補給船', 1],
      ['南極観測船', 2],
    ])
  })
})
