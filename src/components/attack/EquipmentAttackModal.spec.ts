import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'

// Firestore は使わず、実データと同じ形の固定データを返す
const EVENTMAP = [
  { eventId: 3, mapId: 7, stage: 'E-3-1', mapPlace: 'O', stageNum: 3 },
  { eventId: 3, mapId: 10, stage: 'E-3-4', mapPlace: 'Z', stageNum: 3 },
]
// 飛機A は機数で伸びる組(O は2個で頭打ち、Z は3個まで)。A1 は重複しない組。
const EQRATE = [
  { eventId: 3, grp: '飛機A', slot: '艦上', count: 1, mapId_7: 1.08, mapId_10: 1.11 },
  { eventId: 3, grp: '飛機A', slot: '艦上', count: 2, mapId_7: 1.16, mapId_10: 1.18 },
  { eventId: 3, grp: '飛機A', slot: '艦上', count: 3, mapId_10: 1.28 },
  { eventId: 3, grp: 'A1', slot: '艦上', count: 1, mapId_10: 1.05 },
]
const air = (eqId: number, name: string) => ({
  eventId: 3, eqId, name, officialType: '艦上攻撃機', eqType: '艦攻', baseType: '陸攻',
  Torpedo: 5, grp1: '飛機A',
})
const fighter = (eqId: number, name: string) => ({
  eventId: 3, eqId, name, officialType: '艦上戦闘機', eqType: '艦戦', baseType: '陸戦',
  AA: 10, grp1: 'A1',
})
const EQATTACK = [
  air(1, '流星改(一航戦)'), air(2, '天山一二型甲改'), air(3, '彗星(江草隊)'), air(4, '彩雲(偵四)'),
  fighter(5, 'Corsair Mk.II'), fighter(6, 'Corsair Mk.II(Ace)'),
]

vi.mock('@/firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: (_db: unknown, name: string) => ({ name }),
  query: (c: { name: string }) => c,
  where: () => ({}),
  getDocs: async (c: { name: string }) => {
    const src = { eqattack: EQATTACK, eqrate: EQRATE, eventmap: EVENTMAP }[c.name] ?? []
    return { docs: src.map((d) => ({ data: () => d })) }
  },
}))

import EquipmentAttackModal from './EquipmentAttackModal.vue'

// モーダルは body へ Teleport されるので、ラッパーではなく DOM から引く
const $ = (sel: string) => Array.from(document.body.querySelectorAll(sel)) as HTMLElement[]
const text = (el: Element) => (el.textContent ?? '').replace(/\s+/g, ' ').trim()

const openModal = async () => {
  mount(EquipmentAttackModal, {
    props: { visible: true, selectedEventId: 3, eventName: 'テストイベント' },
  })
  await flushPromises()
}

const click = async (el: Element) => {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await nextTick()
  await flushPromises()
}

const rows = () => $('tbody tr')
const rowByName = (name: string) => rows().find((r) => text(r).includes(name))!
// 合計行の海域セル。E-3-1(O) と E-3-4(Z) の2列(ステータス列は除く)
const totals = () => $('tfoot td.eq-heat').map(text)
const chips = () => $('.eq-chip').map(text)

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('装備特攻モーダル', () => {
  it('搭載先3つと、その搭載先の装備種別を件数付きで出す', async () => {
    await openModal()

    const labels = chips()
    expect(labels).toContain('空母用')
    expect(labels).toContain('空母以外')
    expect(labels).toContain('基地')
    // 空母用は艦戦2件・艦攻4件。艦爆/艦偵は該当が無いので0件
    expect(labels.slice(0, 4)).toEqual(['艦戦2', '艦攻4', '艦爆0', '艦偵0'])
    expect(rows()).toHaveLength(6)
  })

  it('機数倍率の組は、積むほど合計倍率が上がる', async () => {
    await openModal()

    await click(rowByName('流星改(一航戦)'))
    expect(totals()).toEqual(['1.080', '1.110'])

    await click(rowByName('天山一二型甲改'))
    expect(totals()).toEqual(['1.160', '1.180'])

    // 3個目。Z は 1.28 まで伸びるが、O は count=3 に値が無いので 1.16 のまま
    await click(rowByName('彗星(江草隊)'))
    expect(totals()).toEqual(['1.160', '1.280'])
  })

  it('重複しない組は2つ積んでも倍率が変わらず、2つ目の⭕が淡色になる', async () => {
    await openModal()

    await click(rowByName('Corsair Mk.II'))
    expect(totals()).toEqual(['-', '1.050'])

    // 未選択の同組装備は「足しても増えない」ことを (⭕) で示す
    expect(rowByName('Corsair Mk.II(Ace)').querySelector('.eq-dup')).not.toBeNull()

    await click(rowByName('Corsair Mk.II(Ace)'))
    expect(totals()).toEqual(['-', '1.050'])
  })

  it('機数倍率の組は2つ目の⭕を淡色にしない', async () => {
    await openModal()

    await click(rowByName('流星改(一航戦)'))
    expect(rowByName('天山一二型甲改').querySelector('.eq-dup')).toBeNull()
  })

  it('チェックは5つまでで、6つ目は押せない', async () => {
    await openModal()

    for (const n of ['流星改(一航戦)', '天山一二型甲改', '彗星(江草隊)', '彩雲(偵四)', 'Corsair Mk.II']) {
      await click(rowByName(n))
    }
    expect(text(document.body)).toContain('（上限）')

    const sixth = rowByName('Corsair Mk.II(Ace)')
    expect(sixth.classList.contains('eq-rowfull')).toBe(true)
    expect(sixth.querySelector<HTMLInputElement>('input[type="checkbox"]')!.disabled).toBe(true)

    await click(sixth)
    expect($('tbody tr[aria-selected="true"]')).toHaveLength(5)
  })

  it('掛け合わせ式に装備名と、機数の組は個数を出す', async () => {
    await openModal()

    await click(rowByName('流星改(一航戦)'))
    await click(rowByName('天山一二型甲改'))
    await click(rowByName('Corsair Mk.II'))

    const inputs = $('input.eq-input').map((i) => (i as HTMLInputElement).value)
    expect(inputs[0]).toBe('流星改(一航戦) × 天山一二型甲改 × Corsair Mk.II')
    expect(inputs[1]).toBe('A1 × 飛機A×2')
  })

  it('海域の見出しクリックで展開・格納する', async () => {
    await openModal()

    const head = $('th.eq-areahead').find((t) => text(t).startsWith('E-3'))!
    expect(text(head)).toContain('▾')
    expect($('th.eq-sortable').some((t) => text(t).includes('E-3-1'))).toBe(true)

    await click(head)
    expect(text($('th.eq-areahead')[0])).toContain('▸')
    expect($('th.eq-sortable').some((t) => text(t).includes('E-3-1'))).toBe(false)
    expect($('th.eq-collapsed').length).toBeGreaterThan(0)
  })
})
