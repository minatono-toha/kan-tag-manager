import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagManageTable from './TagManageTable.vue'
import type { ExpandedShip, TagManagement } from '@/types/interfaces'

const ship = (orig: number, name: string): ExpandedShip => ({
  libraryId: orig, spGroupId: orig, shipType: '駆逐艦', shipTypeCategory: '駆逐艦', speed: '高', nationality: 'JP',
  bannerId: orig, filterId: 1, name, orig, class: '',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0,
  shipIndex: 0, ownershipCount: 1, isSpGroupSplit: false,
})

// tagId が firestore 上の並び順そのもの。海域は tagId の小さい札を持つ順に並ぶ。
const 甲 = { tagId: 1, tagName: '甲', tagColor: '#fff' }
const 乙 = { tagId: 2, tagName: '乙', tagColor: '#fff' }
const 丙 = { tagId: 3, tagName: '丙', tagColor: '#fff' }

// 甲は E-1-1 と E-3-1 の両方へ行ける。同じ札で割当先が割れる場合の並びを見るための配置。
const stageOptions = ['E-1-1', 'E-2-1', 'E-3-1']
const stageTagMap = { 'E-1-1': [甲, 丙], 'E-2-1': [乙], 'E-3-1': [甲] }
const tagMap = { 1: 甲, 2: 乙, 3: 丙 }

const tag = (orig: number, targetStage: string, tagId: number): TagManagement => ({
  eventId: 1, orig, shipIndex: 0, assigned: false, preserve: false, targetStage, tagId, comment: '',
})

// 入力順は昇順とも降順とも一致させない。並べ替えが本当に効いたことを見分けるため。
// 特に島風(E-3-1/甲)を雪風(E-1-1/甲)より前に置き、第二ソートが無ければ
// 安定ソートで島風が上に残ってしまう状態から始める。
const ships = [
  ship(20, '島風'),
  ship(10, '雪風'),
  ship(30, '時雨'),
  ship(40, '夕立'),
  ship(50, '綾波'),
]

const tagManagementData = new Map<string, TagManagement>([
  ['20_0', tag(20, 'E-3-1', 1)], // 甲 / E-3-1
  ['10_0', tag(10, 'E-1-1', 1)], // 甲 / E-1-1
  ['30_0', tag(30, 'E-2-1', 2)], // 乙 / E-2-1
  ['40_0', tag(40, 'E-1-1', 3)], // 丙 / E-1-1
  ['50_0', tag(50, '', 0)], // 未割当
])

const mountTable = () =>
  mount(TagManageTable, {
    props: {
      ships,
      sourceShips: ships,
      selectedEventId: 1,
      tagManagementData,
      stageOptions,
      stageTagMap,
      tagMap,
      updateTagManagement: async () => {},
    },
  })

type Wrapper = ReturnType<typeof mountTable>

// 割当先=3列目, 割当札=4列目
const header = (w: Wrapper, column: '割当先' | '割当札') =>
  w.findAll('th')[column === '割当先' ? 2 : 3]

// 見出しのクリックで昇順→降順→解除を巡回する(特攻情報表と同じ操作)
const clickHeader = (w: Wrapper, column: '割当先' | '割当札') => header(w, column).trigger('click')

// 親へ届いた最新の行順を艦名で見る
const emittedOrder = (w: Wrapper): string[] => {
  const events = w.emitted('filter-change')!
  return (events[events.length - 1][0] as ExpandedShip[]).map((s) => s.name)
}

const emittedIsSorting = (w: Wrapper): boolean => {
  const events = w.emitted('filter-change')!
  return events[events.length - 1][2] as boolean
}

describe('割当札管理表の札順ソート', () => {
  it('割当札の見出しは tagId の昇順→降順→解除で巡回する', async () => {
    const w = mountTable()

    // 初期状態は未ソート(入力順のまま)
    expect(emittedOrder(w)).toEqual(['島風', '雪風', '時雨', '夕立', '綾波'])
    expect(emittedIsSorting(w)).toBe(false)

    // 1回目: 昇順(甲=1 → 乙=2 → 丙=3)。未割当は末尾。
    await clickHeader(w, '割当札')
    expect(emittedOrder(w)).toEqual(['雪風', '島風', '時雨', '夕立', '綾波'])
    expect(emittedIsSorting(w)).toBe(true)
    expect(header(w, '割当札').text()).toContain('▲')

    // 2回目: 降順。未割当は降順でも末尾のまま。
    await clickHeader(w, '割当札')
    expect(emittedOrder(w)).toEqual(['夕立', '時雨', '島風', '雪風', '綾波'])
    expect(header(w, '割当札').text()).toContain('▼')

    // 3回目: 解除して元の並びへ戻る
    await clickHeader(w, '割当札')
    expect(emittedOrder(w)).toEqual(['島風', '雪風', '時雨', '夕立', '綾波'])
    expect(emittedIsSorting(w)).toBe(false)
    expect(header(w, '割当札').text()).not.toContain('▲')
  })

  it('同じ札の中は割当先の若い海域が上にくる(第二ソート)', async () => {
    const w = mountTable()

    // 雪風と島風はどちらも甲。入力順では島風が先だが、
    // 割当先が E-1-1 の雪風が E-3-1 の島風より上に出る。
    await clickHeader(w, '割当札')
    const order = emittedOrder(w)
    expect(order.indexOf('雪風')).toBeLessThan(order.indexOf('島風'))
  })

  it('割当先は海域が持つ札の tagId 順に並び、同じ札の海域同士は海域順で決まる', async () => {
    const w = mountTable()

    // 代表札は E-1-1(甲=1) / E-3-1(甲=1) / E-2-1(乙=2)。
    // E-1-1 と E-3-1 は代表札が同じなので、第二ソートの海域順で E-1-1 が先にくる。
    await clickHeader(w, '割当先')
    expect(emittedOrder(w)).toEqual(['雪風', '夕立', '島風', '時雨', '綾波'])
  })

  it('絞り込みアイコンのクリックではソートしない(メニューを開くだけ)', async () => {
    const w = mountTable()

    await header(w, '割当札').get('span[title="絞り込み"]').trigger('click')

    expect(emittedIsSorting(w)).toBe(false)
    expect(header(w, '割当札').text()).not.toContain('▲')
  })

  it('ソートしても「絞り込み中」扱いにはしない', async () => {
    const w = mountTable()
    await clickHeader(w, '割当札')

    const events = w.emitted('filter-change')!
    expect(events[events.length - 1][1]).toBe(false)
  })

  it('片方の列でソートするともう片方のソートは解除される', async () => {
    const w = mountTable()

    await clickHeader(w, '割当札')
    await clickHeader(w, '割当札')
    expect(header(w, '割当札').text()).toContain('▼')

    // 割当先を押した時点で割当札側の印が消え、割当先は昇順から始まる
    await clickHeader(w, '割当先')
    expect(header(w, '割当先').text()).toContain('▲')
    expect(header(w, '割当札').text()).not.toContain('▼')
  })
})
