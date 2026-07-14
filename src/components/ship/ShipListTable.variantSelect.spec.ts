import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShipListTable from './ShipListTable.vue'
import type { Ship, ExpandedShip } from '@/types/interfaces'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

const makeShip = (over: Partial<Ship>): Ship => ({
  libraryId: 1, spGroupId: 1, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 80, filterId: 1, name: '長門', orig: 1, class: '長門型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0, ...over,
})

const nagato = makeShip({ name: '長門', bannerId: 80, updateLevel: 0, libraryId: 1 })
const nagatoKai = makeShip({ name: '長門改', bannerId: 275, updateLevel: 1, libraryId: 2 })
const allShips = [nagato, nagatoKai]

const row: ExpandedShip = {
  ...nagato,
  orig: nagato.spGroupId,
  isSpGroupSplit: false,
  shipIndex: 0,
  ownershipCount: 1, // 着任済み(▼ が出る条件)
}

describe('改装段階選択プルダウンでの選択(update-variant emit)', () => {
  it('▼ を開いて別の改装段階をクリックすると update-variant が発火する', async () => {
    const w = mount(ShipListTable, {
      props: {
        ships: [row],
        sourceShips: [row],
        hasFiltersSelected: true,
        displayMode: 'detail',
        selectedEventId: 1,
        tagManagementData: new Map(),
        allShips,
        variantMap: new Map(),
        showUnownedShips: true,
      },
    })

    await w.find('span[title="改装段階変更"]').trigger('click')
    const items = w.findAll('.popup-item')
    expect(items.map((i) => i.text())).toEqual(['長門', '長門改'])

    await items[1].trigger('click') // 長門改 を選択

    const emitted = w.emitted('update-variant')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([row.orig, row.shipIndex, nagatoKai.bannerId])
  })
})
