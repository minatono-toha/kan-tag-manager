import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShipListTable from './ShipListTable.vue'
import type { Ship, ExpandedShip } from '@/types/interfaces'

// jsdom には ResizeObserver が無い(ヘッダ高さの実測に使っている)。
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

const makeShip = (over: Partial<Ship>): Ship => ({
  libraryId: 1, spGroupId: 500, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 131, filterId: 1, name: '大和', orig: 500, class: '大和型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0, ...over,
})

// 大和(spGroupId=500)と、特攻グループ分割で別行にした大和改二重(spGroupId=9500, orig は同じ500)。
const yamato = makeShip({ name: '大和', spGroupId: 500, orig: 500, updateLevel: 0, libraryId: 10 })
const yamatoKai2Ju = makeShip({ name: '大和改二重', spGroupId: 9500, orig: 500, bannerId: 916, updateLevel: 1, libraryId: 11 })
// 分割の無い艦(比較用)
const nagato = makeShip({ name: '長門', spGroupId: 1, orig: 1, bannerId: 80, updateLevel: 0, libraryId: 20 })
const nagatoKai = makeShip({ name: '長門改', spGroupId: 1, orig: 1, bannerId: 275, updateLevel: 1, libraryId: 21 })

const allShips = [yamato, yamatoKai2Ju, nagato, nagatoKai]

const expand = (s: Ship): ExpandedShip => ({
  ...s,
  orig: s.spGroupId,
  isSpGroupSplit: s.spGroupId !== s.orig,
  shipIndex: 0,
  ownershipCount: 1,
})

const render = () =>
  mount(ShipListTable, {
    props: {
      ships: [yamato, nagato].map(expand),
      sourceShips: [yamato, nagato].map(expand),
      hasFiltersSelected: true,
      displayMode: 'detail',
      selectedEventId: 1,
      tagManagementData: new Map(),
      allShips,
      variantMap: new Map(),
      showUnownedShips: true,
    },
  })

const openVariantPopup = async (w: ReturnType<typeof render>, shipName: string) => {
  const row = w.findAll('tbody tr').find((tr) => tr.text().includes(shipName))!
  await row.find('span[title="改装段階変更"]').trigger('click')
}

describe('改装段階選択プルダウンの分割注記', () => {
  it('系統が spGroupId 分割されている艦(大和)では注記が出る', async () => {
    const w = render()
    await openVariantPopup(w, '大和')
    expect(w.text()).toContain('改装によって艦種が変わる艦は別の行で扱っています')
  })

  it('分割されていない艦(長門)では注記が出ない', async () => {
    const w = render()
    await openVariantPopup(w, '長門')
    expect(w.text()).not.toContain('改装によって艦種が変わる艦は別の行で扱っています')
  })
})
