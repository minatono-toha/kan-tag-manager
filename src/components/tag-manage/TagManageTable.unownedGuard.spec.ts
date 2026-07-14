import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TagManageTable from './TagManageTable.vue'
import type { ExpandedShip, Ship, TagManagement } from '@/types/interfaces'

const UNOWNED_MESSAGE = '札割り当て操作をする際は先に着任させてください'

const makeShip = (over: Partial<Ship>): Ship => ({
  libraryId: 1, spGroupId: 500, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 131, filterId: 1, name: '大和', orig: 500, class: '大和型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0, ...over,
})

const expand = (ownershipCount: number): ExpandedShip => ({
  ...makeShip({}),
  shipIndex: 0,
  ownershipCount,
  isSpGroupSplit: false,
})

// 割当済チェックを押せる状態(=割当先が入っている)にしておく。
// 未着任ガードが「割当先未選択」の検証より先に効くことを確かめるため。
const tagData: TagManagement = {
  eventId: 1, orig: 500, shipIndex: 0,
  assigned: false, preserve: false, targetStage: 'E-1', tagId: 1, comment: '',
}

const tagManageProps = (ship: ExpandedShip, updateTagManagement: (d: TagManagement) => Promise<void>) => ({
  ships: [ship],
  sourceShips: [ship],
  selectedEventId: 1,
  tagManagementData: new Map([['500_0', tagData]]),
  stageOptions: ['E-1'],
  stageTagMap: { 'E-1': [{ tagId: 1, tagName: '甲', tagColor: '#fff' }] },
  tagMap: { 1: { tagId: 1, tagName: '甲', tagColor: '#fff' } },
  updateTagManagement,
})

// 割当済 / 温存 はセル自体が、割当先は札選択を開く内側の要素がクリック対象。
const ASSIGNED_CELL = 'tbody td:nth-child(1)'
const PRESERVE_CELL = 'tbody td:nth-child(2)'
const STAGE_TRIGGER = '.stage-trigger'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('未着任の艦は札まわりを変更できない', () => {
  it.each([
    ['割当済', ASSIGNED_CELL],
    ['温存', PRESERVE_CELL],
    ['割当先', STAGE_TRIGGER],
  ])('一覧の%sを押すと着任を促し、保存しない', async (_label, selector) => {
    const saved: TagManagement[] = []
    const w = mount(TagManageTable, {
      props: tagManageProps(expand(0), async (d) => {
        saved.push(d)
      }),
    })

    await w.get(selector).trigger('click')

    expect(saved).toHaveLength(0)
    expect(document.body.textContent).toContain(UNOWNED_MESSAGE)
  })

  it('着任済の艦は従来どおり変更できる', async () => {
    const saved: TagManagement[] = []
    const w = mount(TagManageTable, {
      props: tagManageProps(expand(1), async (d) => {
        saved.push(d)
      }),
    })

    await w.get(PRESERVE_CELL).trigger('click')

    expect(saved).toEqual([{ ...tagData, preserve: true }])
    expect(document.body.textContent).not.toContain(UNOWNED_MESSAGE)
  })
})
