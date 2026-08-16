import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ModalTagManagement from './ModalTagManagement.vue'
import type { Ship, TagManagement } from '@/types/interfaces'
import { GIMMICK_STAGE } from '@/utils/gimmickTags'

const yamato: Ship = {
  libraryId: 1, spGroupId: 500, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 131, filterId: 1, name: '大和', orig: 500, class: '大和型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0,
}

const 甲 = { tagId: 1, tagName: '甲', tagColor: '#fff' }
const forceH = { tagId: 9, tagName: 'Force H', tagColor: '#000' }

const mountModal = (withGimmick: boolean, saved: TagManagement[] = []) =>
  mount(ModalTagManagement, {
    props: {
      ship: yamato,
      shipIndex: 0,
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
      arriveShip: async () => {},
    },
  })

const clickAreaButton = (w: ReturnType<typeof mountModal>, label: string) =>
  w.findAll('button').find((b) => b.text() === label)!.trigger('click')

describe('モーダルでもギミック用の札を選べる', () => {
  it('割当先のボタンに「ギミック用」が並ぶ', () => {
    const w = mountModal(true)

    const labels = w.findAll('button').map((b) => b.text())
    expect(labels).toContain('E-1')
    expect(labels).toContain(GIMMICK_STAGE)
  })

  it('押すと海域を挟まずに札が並び、選ぶと割当先がギミック用になる', async () => {
    const saved: TagManagement[] = []
    const w = mountModal(true, saved)

    await clickAreaButton(w, GIMMICK_STAGE)
    const item = w.findAll('div').find((d) => d.text() === 'Force H' && d.element.children.length === 0)!
    await item.trigger('click')

    expect(saved).toHaveLength(1)
    expect(saved[0].tagId).toBe(9)
    expect(saved[0].targetStage).toContain(GIMMICK_STAGE)
    expect(saved[0].targetStage).not.toContain('E-1')
  })

  it('ギミック用の札が無いイベントでは - を出す', async () => {
    const w = mountModal(false)

    await clickAreaButton(w, GIMMICK_STAGE)

    expect(w.text()).not.toContain('Force H')
    expect(w.findAll('div').some((d) => d.text() === '-' && d.element.children.length === 0)).toBe(
      true,
    )
  })
})
