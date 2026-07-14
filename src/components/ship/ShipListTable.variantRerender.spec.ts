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
  ownershipCount: 1,
}

describe('改装段階を選択した後、行の表示が実際に更新されるか(v-memo のキャッシュ漏れが無いか)', () => {
  it('親が variantMap を更新すると、選択していなくても行の艦名がその形態に変わる', async () => {
    // App.vue の実際の流れを模す: 最初は variantMap が空(= 素の状態を表示)。
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

    expect(w.text()).toContain('長門')
    expect(w.text()).not.toContain('長門改')

    // updateShipVariant → shipVariantMap(computed) → variantMap prop 更新、を模す
    await w.setProps({ variantMap: new Map([[`${row.orig}_${row.shipIndex}`, nagatoKai.bannerId]]) })

    expect(w.text()).toContain('長門改')
  })
})
