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

const mountTable = (showComment: boolean) =>
  mount(TagManageTable, {
    props: {
      ships: [yamato],
      sourceShips: [yamato],
      selectedEventId: 1,
      tagManagementData: new Map<string, TagManagement>(),
      stageOptions: ['E-1-1'],
      stageTagMap: {},
      tagMap: {},
      updateTagManagement: async () => {},
      showComment,
    },
  })

// ヘッダのラベルだけを取り出す(絞り込みアイコンは文字を持たない)
const headers = (w: ReturnType<typeof mountTable>) => w.findAll('thead th').map((h) => h.text())

describe('表示切替はコメント欄の出し入れだけ', () => {
  it('コメント欄非表示でも割当先・割当札は出る', () => {
    expect(headers(mountTable(false))).toEqual(['割当済', '温存', '割当先', '割当札'])
  })

  it('コメント欄表示にするとコメント列が増える', () => {
    expect(headers(mountTable(true))).toEqual(['割当済', '温存', '割当先', '割当札', 'コメント'])
  })
})
