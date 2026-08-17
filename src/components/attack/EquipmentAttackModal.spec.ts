import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'

// Firestore は使わず、実データと同じ形の固定データを返す。
// E-3 は KA(機数倍率)だけ、E-4 は A/C 組と対地。倍率を持つマスが重ならないので別系統になる。
const EVENTMAP = [
  // E-1 は装備特攻が無い海域。データ欠落と疑われないよう「-」の1列として出す
  { eventId: 3, mapId: 1, stage: 'E-1-1', mapPlace: 'I', stageNum: 1 },
  { eventId: 3, mapId: 7, stage: 'E-3-1', mapPlace: 'O', stageNum: 3 },
  { eventId: 3, mapId: 10, stage: 'E-3-4', mapPlace: 'Z', stageNum: 3 },
  { eventId: 3, mapId: 11, stage: 'E-4-1', mapPlace: 'D', stageNum: 4 },
]
// KA は機数で伸びる組(O は2個で頭打ち、Z は3個まで)。A1 は重複しない組。
const EQRATE = [
  { eventId: 3, grp: 'KA', slot: '艦上', count: 1, mapId_7: 1.08, mapId_10: 1.11 },
  { eventId: 3, grp: 'KA', slot: '艦上', count: 2, mapId_7: 1.16, mapId_10: 1.18 },
  { eventId: 3, grp: 'KA', slot: '艦上', count: 3, mapId_10: 1.28 },
  { eventId: 3, grp: 'A1', slot: '艦上', count: 1, mapId_11: 1.05 },
  { eventId: 3, grp: 'GA', slot: '艦上', count: 1, mapId_11: 1.12 },
  { eventId: 3, grp: 'GB', slot: '艦上', count: 1, mapId_11: 1.08 },
  { eventId: 3, grp: 'C2', slot: '基地', count: 1, mapId_11: 1.06 },
]
// 天山(電探装備)は実データでも夜間攻撃機。チップは艦攻にまとめ、種別列は夜攻で出す
const air = (eqId: number, name: string, eqType = '艦攻') => ({
  eventId: 3, eqId, name, officialType: '艦上攻撃機', eqType, baseType: '陸攻',
  Torpedo: 5, CombatRadius: 4, grp1: 'KA',
})
const fighter = (eqId: number, name: string) => ({
  eventId: 3, eqId, name, officialType: '艦上戦闘機', eqType: '艦戦', baseType: '陸戦',
  AA: 10, CombatRadius: 5, grp1: 'A1', grp2: 'C2',
})
// 対地装備は GA/GB/GC だけに所属し、航空機の A/B 組とは重ならない
const ground = (eqId: number, name: string, grp1: string) => ({
  eventId: 3, eqId, name, officialType: '上陸用舟艇', eqType: '対地', baseType: '', grp1,
})
const EQATTACK = [
  air(1, '流星改(一航戦)'), air(2, '天山一二型甲改', '夜攻'), air(3, '彗星(江草隊)'), air(4, '彩雲(偵四)'),
  fighter(5, 'Corsair Mk.II'), fighter(6, 'Corsair Mk.II(Ace)'), fighter(7, 'F6F-5'),
  fighter(8, 'F6F-3'), fighter(9, 'XF5U'), fighter(10, 'FR-1 Fireball'),
  ground(11, '特二式内火艇', 'GA'), ground(12, '陸軍歩兵部隊', 'GB'),
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
const clickChip = (label: string) => click($('.eq-chip').find((c) => text(c) === label)!)

const rows = () => $('tbody tr')
const rowByName = (name: string) => rows().find((r) => text(r).includes(name))!
const names = () => rows().map((r) => text(r.querySelector('td.eq-name')!))
const groupCols = () => $('th.eq-grp').map(text)
// 合計行の海域セル(ステータス列と「-」列は除く)
const totals = () => $('tfoot td.eq-heat').map(text)
const chips = () => $('.eq-chip').map(text)
const heads = () => $('thead th').map(text)

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
    // 既定は後段(E-4)の系統なので、E-3 専用の KA(艦攻)は出ない
    expect(labels.slice(0, 4)).toEqual(['艦戦6', '艦攻0', '艦爆0', '艦偵0'])
    expect(rows()).toHaveLength(6)
  })

  it('既定は後段の系統で、E-3 だけの KA は出さない', async () => {
    await openModal()

    expect(groupCols()).toEqual(['A1'])
    expect(names()).not.toContain('流星改(一航戦)')
  })

  it('対象海域を E-3 にすると KA だけの表になる', async () => {
    await openModal()

    await clickChip('E-3')
    expect(groupCols()).toEqual(['KA'])
    // 既定の並びは種別の昇順なので、夜攻の天山は最後にくる
            expect(names()).toEqual(['流星改(一航戦)', '彗星(江草隊)', '彩雲(偵四)', '天山一二型甲改'])
  })

  it('機数倍率の組は、積むほど合計倍率が上がる', async () => {
    await openModal()
    await clickChip('E-3')

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
    expect(totals()).toEqual(['1.050'])

    // 未選択の同組装備は「足しても増えない」ことを (⭕) で示す
    expect(rowByName('Corsair Mk.II(Ace)').querySelector('.eq-dup')).not.toBeNull()

    await click(rowByName('Corsair Mk.II(Ace)'))
    expect(totals()).toEqual(['1.050'])
  })

  it('機数倍率の組は2つ目の⭕を淡色にしない', async () => {
    await openModal()
    await clickChip('E-3')

    await click(rowByName('流星改(一航戦)'))
    expect(rowByName('天山一二型甲改').querySelector('.eq-dup')).toBeNull()
  })

  it('チェックは5つまでで、6つ目は押せない', async () => {
    await openModal()

    for (const n of ['Corsair Mk.II', 'Corsair Mk.II(Ace)', 'F6F-5', 'F6F-3', 'XF5U']) {
      await click(rowByName(n))
    }
    expect(text(document.body)).toContain('（上限）')

    const sixth = rowByName('FR-1 Fireball')
    expect(sixth.classList.contains('eq-rowfull')).toBe(true)
    expect(sixth.querySelector<HTMLInputElement>('input[type="checkbox"]')!.disabled).toBe(true)

    await click(sixth)
    expect($('tbody tr[aria-selected="true"]')).toHaveLength(5)
  })

  it('掛け合わせ式に装備名と、機数の組は個数を出す', async () => {
    await openModal()
    await clickChip('E-3')

    await click(rowByName('流星改(一航戦)'))
    await click(rowByName('天山一二型甲改'))

    const inputs = $('input.eq-input').map((i) => (i as HTMLInputElement).value)
    expect(inputs[0]).toBe('流星改(一航戦) × 天山一二型甲改')
    expect(inputs[1]).toBe('KA×2')
  })

  it('既定は種別の昇順で並ぶ', async () => {
    await openModal()
    await clickChip('E-3')

    // 艦攻 → 夜攻 の順(TYPE_ORDER 準拠)
    expect(rows().map((r) => text(r.querySelector('td.eq-type-col')!))).toEqual(
      ['艦攻', '艦攻', '艦攻', '夜攻'],
    )
  })

  it('航空機の表に対地の組(GA/GB)は出ない', async () => {
    await openModal()

    expect(groupCols()).toEqual(['A1'])
  })

  it('対地装備を選ぶと、対地の組だけの表に切り替わる', async () => {
    await openModal()

    // 空母以外へ。既定では対地は選ばれていない(航空機と同じ表に出せないため)
    await clickChip('空母以外')
    expect(groupCols()).not.toContain('GA')

    await click($('.eq-chip').find((c) => text(c).startsWith('対地装備'))!)
    expect(groupCols()).toEqual(['GA', 'GB'])
    expect(names()).toEqual(['特二式内火艇', '陸軍歩兵部隊'])
  })

  it('装備名は省略表示にし、正式名を title で出す', async () => {
    await openModal()

    const cell = rowByName('Corsair Mk.II(Ace)').querySelector('td.eq-name')!
    expect(cell.getAttribute('title')).toBe('Corsair Mk.II(Ace)')
  })

  it('既定はステータス列を出さず、詳細表示で出す', async () => {
    await openModal()

    expect(heads()).not.toContain('対空')
    expect(heads()).not.toContain('半径')

    await click($('button').find((b) => text(b) === '詳細表示')!)
    expect(heads()).toContain('対空')
    expect(heads()).toContain('半径')
  })

  it('基地は行動半径だけ既定でも出す', async () => {
    await openModal()

    await clickChip('基地')
    expect(heads()).toContain('半径')
    expect(heads()).not.toContain('対空')
  })

  it('装備特攻が無い海域は「-」だけの1列で出す', async () => {
    await openModal()

    // 見出しは E-1(展開・格納しないので三角なし)
    const e1 = $('th.eq-areahead-static').find((t) => text(t).startsWith('E-1'))!
    expect(text(e1)).toBe('E-1')
    expect(e1.getAttribute('colspan')).toBe('1')
    expect(text(rowByName('Corsair Mk.II').querySelector('td.eq-dash')!)).toBe('-')
  })

  it('夜戦・夜攻は昼の相方のチップに含め、種別列では出し分ける', async () => {
    await openModal()
    await clickChip('E-3')

    // 夜攻の装備は「艦攻」チップの件数に入る
    expect(chips().slice(0, 4)).toEqual(['艦戦0', '艦攻4', '艦爆0', '艦偵0'])
    // 種別列は夜攻のまま
    expect(text(rowByName('天山一二型甲改').querySelector('td.eq-type-col')!)).toBe('夜攻')
  })

  it('掛け合わせ欄の✕で選択をまとめて外せる', async () => {
    await openModal()

    // 何も選んでいないうちは出さない
    expect($('.eq-clear')).toHaveLength(0)

    await click(rowByName('Corsair Mk.II'))
    await click(rowByName('F6F-5'))
    expect($('tbody tr[aria-selected="true"]')).toHaveLength(2)

    await click($('.eq-clear')[0])
    expect($('tbody tr[aria-selected="true"]')).toHaveLength(0)
    expect(($('input.eq-input')[0] as HTMLInputElement).value).toBe('')
    expect($('.eq-clear')).toHaveLength(0)
  })

  it('種別セルは淡色背景なので、テーマの白文字に勝つよう文字色を !important で指定する', async () => {
    await openModal()

    // ダーク系テーマは `td { color: ... !important }` で白文字を強制してくる
    const cell = rowByName('Corsair Mk.II').querySelector('td.eq-type-col') as HTMLElement
    expect(cell.style.getPropertyPriority('color')).toBe('important')
    expect(cell.style.backgroundColor).not.toBe('')
  })

  it('操作は常に2行で、搭載先は搭載先を切り替えても2行目の左端にある', async () => {
    await openModal()

    const rowLabels = () =>
      $('[data-row]').map((r) => text(r.querySelector('.eq-label')!))
    expect(rowLabels()).toEqual(['装備種別', '搭載先'])

    // 装備種別チップが6つになる基地でも、行の構成は変わらない
    await clickChip('基地')
    expect(rowLabels()).toEqual(['装備種別', '搭載先'])
  })

  it('海域は1つだけ展開し、他を開くと前のものが閉じる', async () => {
    await openModal()

    // 既定は後段の先頭(E-4)が開いている
    expect(heads().some((t) => t.includes('E-4-1'))).toBe(true)

    const e3 = $('th.eq-areahead').find((t) => text(t).startsWith('E-3'))!
    await click(e3)
    expect(heads().some((t) => t.includes('E-3-1'))).toBe(true)
    expect(heads().some((t) => t.includes('E-4-1'))).toBe(false)
  })

  it('海域の見出しクリックで展開・格納する', async () => {
    await openModal()

    const head = $('th.eq-areahead').find((t) => text(t).startsWith('E-4'))!
    expect(text(head)).toContain('▾')
    expect(heads().some((t) => t.includes('E-4-1'))).toBe(true)

    await click(head)
    expect(heads().some((t) => t.includes('E-4-1'))).toBe(false)
    // 格納したら1列に畳む(E-1 の「-」列と同じ幅)
    expect(head.getAttribute('colspan')).toBe('1')
  })
})
