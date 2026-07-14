import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShipModal from './ShipModal.vue'
import type { Ship } from '@/types/interfaces'

// jsdom には matchMedia が無い(useTheme が onMounted 時に参照する)。
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia

const makeShip = (over: Partial<Ship>): Ship => ({
  libraryId: 1, spGroupId: 500, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 131, filterId: 1, name: '大和', orig: 500, class: '大和型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0, ...over,
})

const yamato = makeShip({ name: '大和' })

const baseProps = {
  ships: [yamato],
  modalVisible: true,
  selectedShipOrig: 500,
  modalShipIndex: 0,
  currentVariantId: yamato.bannerId,
  selectedEventId: null, // ModalTagManagement を描かせない(このテストと無関係なため)
  tagManagementData: new Map(),
  stageOptions: [],
  stageTagMap: {},
  tagMap: {},
  updateTagManagement: async () => {},
  arriveShip: async () => {},
}

describe('改装段階選択モーダルの分割注記', () => {
  it('hasSpGroupSplit=true のとき注記が出る(App.vue が系統全体を見て渡す値)', () => {
    const w = mount(ShipModal, { props: { ...baseProps, hasSpGroupSplit: true } })
    expect(w.text()).toContain('改装によって艦種が変わる艦は別の行で扱っています')
  })

  it('hasSpGroupSplit=false(既定)のときは注記が出ない', () => {
    const w = mount(ShipModal, { props: baseProps })
    expect(w.text()).not.toContain('改装によって艦種が変わる艦は別の行で扱っています')
  })
})
