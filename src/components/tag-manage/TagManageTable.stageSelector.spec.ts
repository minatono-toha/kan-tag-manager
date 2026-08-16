import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagManageTable from './TagManageTable.vue'
import type { ExpandedShip, TagManagement } from '@/types/interfaces'

const yamato: ExpandedShip = {
  libraryId: 1, spGroupId: 500, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 131, filterId: 1, name: '大和', orig: 500, class: '大和型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0,
  shipIndex: 0, ownershipCount: 1, isSpGroupSplit: false,
}

const 甲 = { tagId: 1, tagName: '甲', tagColor: '#fff' }

// 割当先は eventmap 由来のステージ(E-1-1 など)。エリア(E-1)は そこから導出する。
const stageOptions = ['E-1-1', 'E-1-2', 'E-2-1']

const mountTable = (saved: TagManagement[] = []) =>
  mount(TagManageTable, {
    props: {
      ships: [yamato],
      sourceShips: [yamato],
      selectedEventId: 1,
      tagManagementData: new Map(),
      stageOptions,
      stageTagMap: { 'E-1-1': [甲], 'E-1-2': [甲], 'E-2-1': [甲] },
      tagMap: { 1: 甲 },
      updateTagManagement: async (d: TagManagement) => {
        saved.push(d)
      },
    },
  })

// 下の階層を持つ項目には ▶ が付くため、ラベルだけを取り出して比較する
const itemLabels = (w: ReturnType<typeof mountTable>) =>
  w.findAll('.popup-item').map((i) => i.text().replace('▶', '').trim())

const findItem = (w: ReturnType<typeof mountTable>, label: string) =>
  w.findAll('.popup-item').find((i) => i.text().replace('▶', '').trim() === label)!

const hoverItem = (w: ReturnType<typeof mountTable>, label: string) =>
  findItem(w, label).trigger('mouseenter')

describe('割当先はエリア→ステージ→札の3段で選ぶ', () => {
  it('1段目はエリア(E-1, E-2)で、ステージ(E-1-1)は出さない', async () => {
    const w = mountTable()

    await w.get('.stage-trigger').trigger('click')

    // 末尾の「ギミック用」は海域を持たない札用の枠(該当が無くても常に出す)
    expect(itemLabels(w)).toEqual(['E-1', 'E-2', 'ギミック用', '選択解除'])
  })

  it('2段目はマウスオーバーしたエリアのステージだけを出す', async () => {
    const w = mountTable()

    await w.get('.stage-trigger').trigger('click')
    await hoverItem(w, 'E-1')

    const labels = itemLabels(w)
    expect(labels).toContain('E-1-1')
    expect(labels).toContain('E-1-2')
    expect(labels).not.toContain('E-2-1')
  })

  it('3段目の札を選ぶとステージと札が保存される', async () => {
    const saved: TagManagement[] = []
    const w = mountTable(saved)

    await w.get('.stage-trigger').trigger('click')
    await hoverItem(w, 'E-1')
    await hoverItem(w, 'E-1-2')
    await findItem(w, '甲').trigger('click')

    expect(saved).toHaveLength(1)
    expect(saved[0].targetStage).toBe('E-1-2')
    expect(saved[0].tagId).toBe(1)
  })
})
