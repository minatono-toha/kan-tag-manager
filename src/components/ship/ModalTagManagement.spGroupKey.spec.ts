import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ModalTagManagement from './ModalTagManagement.vue'
import type { Ship, TagManagement } from '@/types/interfaces'

const makeShip = (over: Partial<Ship>): Ship => ({
  libraryId: 49, spGroupId: 49, shipType: '水上機母艦', shipTypeCategory: '水上機母艦', speed: '高',
  bannerId: 49, filterId: 8, name: '千歳', orig: 49, class: '千歳型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0, ...over,
})

// 千歳航は千歳(orig=49)から分割された行。札のキーは系統ID(orig)ではなく spGroupId で作る。
const chitoseCV = makeShip({ name: '千歳航', bannerId: 104, libraryId: 104, orig: 49, spGroupId: 9108, updateLevel: 2 })

// 分割元(千歳)の札データ。キーは `${spGroupId}_${shipIndex}` = '49_0'。
const chitoseTag: TagManagement = {
  eventId: 1, orig: 49, shipIndex: 0,
  assigned: false, preserve: true, targetStage: 'E-1', tagId: 1, comment: '',
}

const mountFor = (ship: Ship, updateTagManagement: (data: TagManagement) => Promise<void> = async () => {}) =>
  mount(ModalTagManagement, {
    props: {
      ship,
      shipIndex: 0,
      selectedEventId: 1,
      tagManagementData: new Map([['49_0', chitoseTag]]),
      stageOptions: ['E-1'],
      stageTagMap: {},
      tagMap: { 1: { tagId: 1, tagName: '甲', tagColor: '#fff' } },
      updateTagManagement,
      arriveShip: async () => {},
    },
  })

// 割当先の選択ボタンにもステージ名が出るため、判定は現在の割当を示すサマリ部分だけを見る
const summaryOf = (w: ReturnType<typeof mountFor>) => w.get('.grid').text()

describe('モーダルの札データはグルーピングID(spGroupId)で引く', () => {
  it('分割行は分割元の札を表示しない', () => {
    const w = mountFor(chitoseCV)
    expect(summaryOf(w)).not.toContain('E-1')
  })

  it('分割行の更新は spGroupId のキーに書き込む(分割元を上書きしない)', async () => {
    const saved: TagManagement[] = []
    const w = mountFor(chitoseCV, async (data: TagManagement) => {
      saved.push(data)
    })

    await w.findAll('span').find((s) => s.text() === '温存')!.trigger('click')

    expect(saved).toHaveLength(1)
    expect(saved[0].orig).toBe(9108)
    expect(saved[0].shipIndex).toBe(0)
  })

  it('分割していない艦は従来どおり自分の札を読む', () => {
    const w = mountFor(makeShip({}))
    expect(summaryOf(w)).toContain('E-1')
  })
})
