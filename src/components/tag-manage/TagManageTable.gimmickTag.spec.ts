import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagManageTable from './TagManageTable.vue'
import type { ExpandedShip, TagManagement } from '@/types/interfaces'
import { GIMMICK_STAGE } from '@/utils/gimmickTags'

const yamato: ExpandedShip = {
  libraryId: 1, spGroupId: 500, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 131, filterId: 1, name: '大和', orig: 500, class: '大和型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0,
  shipIndex: 0, ownershipCount: 1, isSpGroupSplit: false,
}

const 甲 = { tagId: 1, tagName: '甲', tagColor: '#fff' }
const forceH = { tagId: 9, tagName: 'Force H', tagColor: '#000' }

// 攻略に使われない札は useTagManagement が擬似海域「ギミック用」に詰めて渡してくる
const mountTable = (withGimmick: boolean, saved: TagManagement[] = []) =>
  mount(TagManageTable, {
    props: {
      ships: [yamato],
      sourceShips: [yamato],
      selectedEventId: 1,
      tagManagementData: new Map(),
      stageOptions: ['E-1-1'],
      stageTagMap: withGimmick
        ? { 'E-1-1': [甲], [GIMMICK_STAGE]: [forceH] }
        : { 'E-1-1': [甲] },
      tagMap: withGimmick ? { 1: 甲, 9: forceH } : { 1: 甲 },
      updateTagManagement: async (d: TagManagement) => {
        saved.push(d)
      },
    },
  })

const findItem = (w: ReturnType<typeof mountTable>, label: string) =>
  w.findAll('.popup-item').find((i) => i.text().replace('▶', '').trim() === label)!

const openGimmickMenu = async (w: ReturnType<typeof mountTable>) => {
  await w.get('.stage-trigger').trigger('click')
  await findItem(w, GIMMICK_STAGE).trigger('mouseenter')
}

describe('ギミック用の札を割当先から選べる', () => {
  it('2段目に eventmap へ出てこない札を並べる(海域は挟まない)', async () => {
    const w = mountTable(true)

    await openGimmickMenu(w)

    const labels = w.findAll('.popup-item').map((i) => i.text().replace('▶', '').trim())
    expect(labels).toContain('Force H')
    expect(labels).not.toContain('甲')
    expect(labels).not.toContain('E-1-1')
  })

  it('札を選ぶと割当先が「ギミック用」として保存される', async () => {
    const saved: TagManagement[] = []
    const w = mountTable(true, saved)

    await openGimmickMenu(w)
    await findItem(w, 'Force H').trigger('click')

    expect(saved).toHaveLength(1)
    expect(saved[0].targetStage).toBe(GIMMICK_STAGE)
    expect(saved[0].tagId).toBe(9)
  })

  it('ギミック用の札が無いイベントでは - を出す', async () => {
    const w = mountTable(false)

    await openGimmickMenu(w)

    // 1段目=エリア、2段目=ギミック用の中身
    const subMenu = w.findAll('.popup-container')[1]
    expect(subMenu.text().trim()).toBe('-')
    expect(subMenu.findAll('.popup-item')).toHaveLength(0)
  })
})
