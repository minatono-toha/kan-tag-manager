import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagManageTable from './TagManageTable.vue'
import type { ExpandedShip, TagManagement } from '@/types/interfaces'

const ship = (orig: number, name: string): ExpandedShip => ({
  libraryId: orig, spGroupId: orig, shipType: '駆逐艦', shipTypeCategory: '駆逐艦', speed: '高',
  bannerId: orig, filterId: 1, name, orig, class: '',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0,
  shipIndex: 0, ownershipCount: 1, isSpGroupSplit: false,
})

// tagId が firestore 上の並び順そのもの。海域は tagId の小さい札を持つ順に並ぶ。
const 甲 = { tagId: 1, tagName: '甲', tagColor: '#fff' }
const 乙 = { tagId: 2, tagName: '乙', tagColor: '#fff' }
const 丙 = { tagId: 3, tagName: '丙', tagColor: '#fff' }

const stageTagMap = { 'E-1-1': [丙], 'E-2-1': [甲], 'E-3-1': [乙] }
const tagMap = { 1: 甲, 2: 乙, 3: 丙 }

const tag = (orig: number, targetStage: string, tagId: number): TagManagement => ({
  eventId: 1, orig, shipIndex: 0, assigned: false, preserve: false, targetStage, tagId, comment: '',
})

// 入力順は昇順とも降順とも一致させない。並べ替えが本当に効いたことを見分けるため。
const ships = [ship(20, '島風'), ship(10, '雪風'), ship(30, '時雨'), ship(40, '夕立')]

const tagManagementData = new Map<string, TagManagement>([
  ['10_0', tag(10, 'E-1-1', 3)], // 丙
  ['20_0', tag(20, 'E-3-1', 2)], // 乙
  ['30_0', tag(30, 'E-2-1', 1)], // 甲
  ['40_0', tag(40, '', 0)], // 未割当
])

const mountTable = () =>
  mount(TagManageTable, {
    props: {
      ships,
      sourceShips: ships,
      selectedEventId: 1,
      tagManagementData,
      stageOptions: ['E-1-1', 'E-2-1', 'E-3-1'],
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
    expect(emittedOrder(w)).toEqual(['島風', '雪風', '時雨', '夕立'])
    expect(emittedIsSorting(w)).toBe(false)

    // 1回目: 昇順(甲=1 → 乙=2 → 丙=3)。未割当は末尾。
    await clickHeader(w, '割当札')
    expect(emittedOrder(w)).toEqual(['時雨', '島風', '雪風', '夕立'])
    expect(emittedIsSorting(w)).toBe(true)
    expect(header(w, '割当札').text()).toContain('▲')

    // 2回目: 降順。未割当は降順でも末尾のまま。
    await clickHeader(w, '割当札')
    expect(emittedOrder(w)).toEqual(['雪風', '島風', '時雨', '夕立'])
    expect(header(w, '割当札').text()).toContain('▼')

    // 3回目: 解除して元の並びへ戻る
    await clickHeader(w, '割当札')
    expect(emittedOrder(w)).toEqual(['島風', '雪風', '時雨', '夕立'])
    expect(emittedIsSorting(w)).toBe(false)
    expect(header(w, '割当札').text()).not.toContain('▲')
  })

  it('割当先は海域が持つ札の tagId 順に並ぶ', async () => {
    const w = mountTable()

    // E-2-1(甲=1) → E-3-1(乙=2) → E-1-1(丙=3)。海域名の昇順ではない点が肝。
    await clickHeader(w, '割当先')
    expect(emittedOrder(w)).toEqual(['時雨', '島風', '雪風', '夕立'])
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
