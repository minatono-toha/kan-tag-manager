import { describe, it, expect } from 'vitest'
import {
  rateFor, totalRate, soloRate, inSlot, itemsForSlot, isStackingGroup, typeOfItem,
  EQ_SLOTS, type EqItem, type EqRate,
} from './useEquipmentAttack'

const cv = EQ_SLOTS[0]
const noncv = EQ_SLOTS[1]
const base = EQ_SLOTS[2]

// 実データと同じ形。E-3-1(O)=7 / E-3-4(Z)=10 / E-4-1(D)=11
const RATES: EqRate[] = [
  { grp: 'A1', slot: '艦上', count: 1, byMapId: { 11: 1.113 } },
  { grp: 'A3', slot: '艦上', count: 1, byMapId: { 11: 1.0712 } },
  { grp: 'C2', slot: '基地', count: 1, byMapId: { 11: 1.06 } },
  // 機数倍率。O は2個で頭打ち、Z は3個まで伸びる
  { grp: '飛機A', slot: '艦上', count: 1, byMapId: { 7: 1.08, 10: 1.11 } },
  { grp: '飛機A', slot: '艦上', count: 2, byMapId: { 7: 1.16, 10: 1.18 } },
  { grp: '飛機A', slot: '艦上', count: 3, byMapId: { 10: 1.28 } },
]

const item = (p: Partial<EqItem> & { name: string; groups: string[] }): EqItem => ({
  eqId: 1, officialType: '', eqType: '艦戦', baseType: '陸戦', stats: {}, ...p,
})

const corsair = item({ name: 'Corsair Mk.II', groups: ['A1', 'C2'], eqId: 434 })
const xf5u = item({ name: 'XF5U', groups: ['A3'], eqId: 375 })
const 流星改 = item({ name: '流星改(一航戦)', groups: ['飛機A'], eqType: '艦攻', baseType: '陸攻', eqId: 342 })
const 瑞雲 = item({ name: '瑞雲(六三四空)', groups: ['飛機A'], eqType: '水爆', baseType: '水攻', eqId: 79 })

describe('rateFor(組と個数から倍率を引く)', () => {
  it('count=1 の行しか無い組は、何個積んでも同じ倍率', () => {
    expect(rateFor(RATES, 'A1', 1, 11)).toBe(1.113)
    expect(rateFor(RATES, 'A1', 3, 11)).toBe(1.113)
  })

  it('機数倍率は積んだ数の行を引く', () => {
    expect(rateFor(RATES, '飛機A', 1, 10)).toBe(1.11)
    expect(rateFor(RATES, '飛機A', 2, 10)).toBe(1.18)
    expect(rateFor(RATES, '飛機A', 3, 10)).toBe(1.28)
  })

  it('そのマスに値が無い個数は、値のある一段下の行に落ちる(出典の「≥2」)', () => {
    // E-3-1(O) は count=3 の行にO列の値が無いので、3個積んでも 2個分の 1.16
    expect(rateFor(RATES, '飛機A', 3, 7)).toBe(1.16)
  })

  it('定義より多く積んでも頭打ちになる', () => {
    expect(rateFor(RATES, '飛機A', 9, 10)).toBe(1.28)
  })

  it('倍率が無いマス・無い組は null', () => {
    expect(rateFor(RATES, '飛機A', 1, 11)).toBeNull()
    expect(rateFor(RATES, 'B9', 1, 11)).toBeNull()
  })
})

describe('totalRate(選択中の装備の合計)', () => {
  it('同じ組を2つ積んでも1回しか掛からない', () => {
    const one = totalRate(RATES, [corsair], 11, cv)
    const two = totalRate(RATES, [corsair, { ...corsair, eqId: 999 }], 11, cv)
    expect(one).toBe(1.113)
    expect(two).toBe(1.113)
  })

  it('違う組は掛け合わさる', () => {
    expect(totalRate(RATES, [corsair, xf5u], 11, cv)).toBe(Number((1.113 * 1.0712).toFixed(8)))
  })

  it('機数倍率の組は積んだ数だけ倍率が上がる', () => {
    expect(totalRate(RATES, [流星改], 10, cv)).toBe(1.11)
    expect(totalRate(RATES, [流星改, { ...流星改, eqId: 343 }], 10, cv)).toBe(1.18)
  })

  it('搭載先で有効なグループだけを見る(艦上ではC組が効かない)', () => {
    // Corsair は A1(艦上) と C2(基地) 持ち。基地では C2 だけが効く
    expect(totalRate(RATES, [corsair], 11, base)).toBe(1.06)
    expect(totalRate(RATES, [corsair], 11, cv)).toBe(1.113)
  })

  it('効く組が無ければ null', () => {
    expect(totalRate(RATES, [xf5u], 11, base)).toBeNull()
    expect(totalRate(RATES, [], 11, cv)).toBeNull()
  })
})

describe('搭載先による絞り込み', () => {
  it('種別と、その搭載先で有効なグループの両方で絞る', () => {
    const all = [corsair, xf5u, 流星改, 瑞雲]
    // 空母用は艦戦・艦攻・艦爆・艦偵。瑞雲(水爆)は入らない
    expect(itemsForSlot(all, RATES, cv).map((i) => i.name)).toEqual([
      'Corsair Mk.II', 'XF5U', '流星改(一航戦)',
    ])
    // 空母以外は水上機。瑞雲だけ
    expect(itemsForSlot(all, RATES, noncv).map((i) => i.name)).toEqual(['瑞雲(六三四空)'])
    // 基地はC組を持つものだけ。Corsair のみ
    expect(itemsForSlot(all, RATES, base).map((i) => i.name)).toEqual(['Corsair Mk.II'])
  })

  it('基地では基地の種別で見る', () => {
    expect(typeOfItem(corsair, cv)).toBe('艦戦')
    expect(typeOfItem(corsair, base)).toBe('陸戦')
  })

  it('有効なグループを持たない装備は出さない', () => {
    expect(inSlot(RATES, xf5u, base)).toBe(false)
    expect(inSlot(RATES, xf5u, cv)).toBe(true)
  })
})

describe('soloRate / isStackingGroup', () => {
  it('単体倍率は1つだけ積んだときの値', () => {
    expect(soloRate(RATES, 流星改, 10, cv)).toBe(1.11)
  })

  it('機数で伸びる組かどうかを判別できる', () => {
    expect(isStackingGroup(RATES, '飛機A')).toBe(true)
    expect(isStackingGroup(RATES, 'A1')).toBe(false)
  })
})
