import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import TagManageTable from './TagManageTable.vue'
import type { ExpandedShip, Ship, TagManagement } from '@/types/interfaces'

const UNOWNED_MESSAGE = '札割り当て操作をする際は先に着任させてください'
const 甲 = { tagId: 1, tagName: '甲', tagColor: '#fff' }

const makeShip = (over: Partial<Ship>): Ship => ({
  libraryId: 1, spGroupId: 500, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 131, filterId: 1, name: '大和', orig: 500, class: '大和型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0, ...over,
})

const expand = (shipIndex: number, ownershipCount = 1): ExpandedShip => ({
  ...makeShip({}),
  shipIndex,
  ownershipCount,
  isSpGroupSplit: false,
})

const baseProps = (
  ships: ExpandedShip[],
  data: Map<string, TagManagement>,
  updateTagManagement: (d: TagManagement) => Promise<void>,
) => ({
  ships,
  sourceShips: ships,
  selectedEventId: 1,
  tagManagementData: data,
  stageOptions: ['E-1-1', 'E-1-2'],
  stageTagMap: { 'E-1-1': [甲], 'E-1-2': [甲] },
  tagMap: { 1: 甲 },
  updateTagManagement,
})

const pressKey = (init: KeyboardEventInit) =>
  document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ...init }))

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('① Ctrl+D で一つ上の行の札情報をホバー行へ複製', () => {
  it('割当先・割当札・コメント・温存をまとめて複製する', async () => {
    const saved: TagManagement[] = []
    const above: TagManagement = {
      eventId: 1, orig: 500, shipIndex: 0,
      assigned: false, preserve: true, targetStage: 'E-1-1', tagId: 1, comment: 'メモ',
    }
    const w = mount(TagManageTable, {
      props: baseProps(
        [expand(0), expand(1)],
        new Map([['500_0', above]]),
        async (d) => { saved.push(d) },
      ),
    })

    await w.findAll('tbody tr')[1].trigger('mouseenter')
    pressKey({ key: 'd', ctrlKey: true })

    expect(saved).toHaveLength(1)
    expect(saved[0]).toMatchObject({
      orig: 500, shipIndex: 1,
      targetStage: 'E-1-1', tagId: 1, comment: 'メモ', preserve: true,
    })
  })

  it('一番上の行では複製元が無いので何もしない', async () => {
    const saved: TagManagement[] = []
    const w = mount(TagManageTable, {
      props: baseProps([expand(0), expand(1)], new Map(), async (d) => { saved.push(d) }),
    })

    await w.findAll('tbody tr')[0].trigger('mouseenter')
    pressKey({ key: 'd', ctrlKey: true })

    expect(saved).toHaveLength(0)
  })

  it('ホバー行が未着任なら着任を促し、保存しない', async () => {
    const saved: TagManagement[] = []
    const above: TagManagement = {
      eventId: 1, orig: 500, shipIndex: 0,
      assigned: false, preserve: false, targetStage: 'E-1-1', tagId: 1, comment: '',
    }
    const w = mount(TagManageTable, {
      props: baseProps(
        [expand(0), expand(1, 0)],
        new Map([['500_0', above]]),
        async (d) => { saved.push(d) },
      ),
    })

    await w.findAll('tbody tr')[1].trigger('mouseenter')
    pressKey({ key: 'd', ctrlKey: true })
    await nextTick()

    expect(saved).toHaveLength(0)
    expect(document.body.textContent).toContain(UNOWNED_MESSAGE)
  })
})

describe('② F4 で直前の割当をホバー行へ繰り返す', () => {
  it('直前の割当がまだ無ければ何もしない', async () => {
    const saved: TagManagement[] = []
    const w = mount(TagManageTable, {
      props: baseProps([expand(0)], new Map(), async (d) => { saved.push(d) }),
    })

    await w.findAll('tbody tr')[0].trigger('mouseenter')
    pressKey({ key: 'F4' })

    expect(saved).toHaveLength(0)
  })

  it('割当操作の直後にF4でホバー行へ同じ割当を適用する', async () => {
    const saved: TagManagement[] = []
    const w = mount(TagManageTable, {
      props: baseProps([expand(0), expand(1)], new Map(), async (d) => { saved.push(d) }),
    })

    // 1隻目に対して 割当先→エリア→ステージ→札 を選び、直前割当を記憶させる
    await w.findAll('.stage-trigger')[0].trigger('click')
    const label = (t: string) =>
      w.findAll('.popup-item').find((i) => i.text().replace('▶', '').trim() === t)!
    await label('E-1').trigger('mouseenter')
    await label('E-1-2').trigger('mouseenter')
    await label('甲').trigger('click')

    expect(saved).toHaveLength(1)

    // 2隻目をホバーして F4 → 同じ割当が適用される
    await w.findAll('tbody tr')[1].trigger('mouseenter')
    pressKey({ key: 'F4' })

    expect(saved).toHaveLength(2)
    expect(saved[1]).toMatchObject({ orig: 500, shipIndex: 1, targetStage: 'E-1-2', tagId: 1 })
  })
})
