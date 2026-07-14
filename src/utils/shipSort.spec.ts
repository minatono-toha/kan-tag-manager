import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { isBaseFormOf, orderShipRows, hasSpGroupSplit } from '@/utils/shipSort'
import type { Ship } from '@/types/interfaces'

// useShips.getUniqueOrigs と同じ選び方でグループの基本艦を決める
const pickBaseForm = (forms: Ship[]): Ship =>
  forms.reduce<Ship | undefined>((base, s) => (isBaseFormOf(s, base) ? s : base), undefined)!

const makeShip = (over: Partial<Ship>): Ship => ({
  libraryId: 1, spGroupId: 240, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 440, filterId: 1, name: 'Iowa', orig: 240, class: 'Iowa級1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0, ...over,
})

describe('グループの基本艦(未着任時に行へ出る形態)', () => {
  it('bannerId が改装段階順でない艦でも、改装段階0を基本艦にする(Iowa)', () => {
    // Iowa は 改=360 < 素=440。bannerId 最小で選ぶと未着任なのに「Iowa改」が行に出ていた。
    const iowa = makeShip({ name: 'Iowa', bannerId: 440, updateLevel: 0 })
    const iowaKai = makeShip({ name: 'Iowa改', bannerId: 360, updateLevel: 1 })
    expect(pickBaseForm([iowaKai, iowa]).name).toBe('Iowa')
    expect(pickBaseForm([iowa, iowaKai]).name).toBe('Iowa') // 並び順に依存しない
  })

  it('改装段階が同値なら bannerId の小さい方を採る(神威 / 神威改母)', () => {
    const kamoi = makeShip({ name: '神威', bannerId: 162, updateLevel: 0, spGroupId: 162 })
    const kamoiBo = makeShip({ name: '神威改母', bannerId: 500, updateLevel: 0, spGroupId: 162 })
    expect(pickBaseForm([kamoiBo, kamoi]).name).toBe('神威')
  })

  it('特攻グループ分割で改装形態だけの行になる艦は、その中の最小段階を基本艦にする(大井改二)', () => {
    // spGroupId=9057 は 大井改 / 大井改二 だけのグループ。素の大井は別グループ。
    const ooiKai = makeShip({ name: '大井改', bannerId: 57, updateLevel: 1, spGroupId: 9057 })
    const ooiKai2 = makeShip({ name: '大井改二', bannerId: 118, updateLevel: 2, spGroupId: 9057 })
    expect(pickBaseForm([ooiKai2, ooiKai]).name).toBe('大井改')
  })

  // data/master/ は fetch-master.mjs の生成物(git管理外)。無い環境ではスキップする。
  const MASTER = 'data/master/shiplist.json'
  it.skipIf(!existsSync(MASTER))('実データ(shiplist)の全グループで、基本艦が最小の改装段階になる', () => {
    const shiplist: Ship[] = JSON.parse(readFileSync(MASTER, 'utf8')).map(
      (d: Ship) => ({ ...d, spGroupId: d.spGroupId ?? d.orig }),
    )
    const groups = new Map<number, Ship[]>()
    for (const s of shiplist) {
      if (!groups.has(s.spGroupId)) groups.set(s.spGroupId, [])
      groups.get(s.spGroupId)!.push(s)
    }
    expect(groups.size).toBeGreaterThan(300)

    for (const [gid, forms] of groups) {
      const base = pickBaseForm(forms)
      const minLevel = Math.min(...forms.map((f) => f.updateLevel))
      expect(base.updateLevel, `spGroupId=${gid} の基本艦が ${base.name}(lv${base.updateLevel})`).toBe(minLevel)
    }
  })
})

describe('行の並び(orderShipRows)', () => {
  // 千歳(水母, f8) と その分割行 千歳航(軽空母, f2)。libraryId 順に素直に並べると離れてしまう。
  const chitose = makeShip({ name: '千歳', spGroupId: 49, orig: 49, filterId: 8, libraryId: 49 })
  const chitoseCV = makeShip({ name: '千歳航', spGroupId: 9108, orig: 49, filterId: 2, libraryId: 104 })
  const zuiho = makeShip({ name: '瑞鳳', spGroupId: 60, orig: 60, filterId: 2, libraryId: 60 })
  const mizuho = makeShip({ name: '瑞穂', spGroupId: 251, orig: 251, filterId: 8, libraryId: 251 })

  it('分割行は分割元の直下に置く', () => {
    const names = orderShipRows([mizuho, chitoseCV, zuiho, chitose]).map((s) => s.name)
    // 千歳航 は本来 filterId=2 で先頭側に来るが、分割元(千歳)の直下へ寄せる
    expect(names).toEqual(['瑞鳳', '千歳', '千歳航', '瑞穂'])
  })

  it('分割元が艦種フィルタで消えている場合は通常の並び順のままにする', () => {
    // 軽空母タブ: 千歳(水母) は居ない。寄せる先が無いので libraryId 順のまま。
    const names = orderShipRows([chitoseCV, zuiho]).map((s) => s.name)
    expect(names).toEqual(['瑞鳳', '千歳航'])
  })
})

describe('hasSpGroupSplit(この系統は他の spGroupId に分割されているか)', () => {
  const chitose = makeShip({ name: '千歳', spGroupId: 49, orig: 49 })
  const chitoseCV = makeShip({ name: '千歳航', spGroupId: 9108, orig: 49 })
  const zuiho = makeShip({ name: '瑞鳳', spGroupId: 60, orig: 60 })
  const all = [chitose, chitoseCV, zuiho]

  it('分割元(千歳)の spGroupId で調べても true になる', () => {
    expect(hasSpGroupSplit(all, 49)).toBe(true)
  })

  it('分割先(千歳航)の spGroupId で調べても true になる(対称)', () => {
    expect(hasSpGroupSplit(all, 9108)).toBe(true)
  })

  it('分割されていない艦は false', () => {
    expect(hasSpGroupSplit(all, 60)).toBe(false)
  })

  it('存在しない spGroupId は false', () => {
    expect(hasSpGroupSplit(all, 99999)).toBe(false)
  })
})
