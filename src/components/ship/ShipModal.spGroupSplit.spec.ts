import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ShipModal from './ShipModal.vue'
import type { Ship } from '@/types/interfaces'
import { SP_GROUP_SPLIT_NOTE } from '@/utils/shipSort'

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
// 特攻グループ分割で別行にした大和改二重(spGroupId=9500, orig は同じ500)。
const yamatoKai2Ju = makeShip({ name: '大和改二重', spGroupId: 9500, bannerId: 916, updateLevel: 1 })

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

// カスタムtooltipは body へ Teleport されるので、ラッパーではなく DOM から引く
const tooltipText = () => document.body.querySelector('.z-\\[9999\\]')?.textContent ?? null

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('改装段階選択モーダルの分割注記', () => {
  it('hasSpGroupSplit=true のとき注記が出る(App.vue が系統全体を見て渡す値)', () => {
    const w = mount(ShipModal, { props: { ...baseProps, hasSpGroupSplit: true } })
    expect(w.text()).toContain(SP_GROUP_SPLIT_NOTE)
  })

  it('hasSpGroupSplit=false(既定)のときは注記が出ない', () => {
    const w = mount(ShipModal, { props: baseProps })
    expect(w.text()).not.toContain(SP_GROUP_SPLIT_NOTE)
  })
})

describe('改装段階選択モーダルの分割先グレーアウト表示', () => {
  it('「選択された改装段階を表示」(既定)では分割先のバナーは出ない', () => {
    const w = mount(ShipModal, {
      props: { ...baseProps, hasSpGroupSplit: true, spGroupSiblings: [yamatoKai2Ju] },
    })
    expect(w.text()).not.toContain('大和改二重')
  })

  it('「すべての改装段階を表示」に切り替えると分割先のバナーがグレーアウトして出る', async () => {
    const w = mount(ShipModal, {
      props: { ...baseProps, hasSpGroupSplit: true, spGroupSiblings: [yamatoKai2Ju] },
    })
    await w.find('span.cursor-pointer.text-blue-600').trigger('click')

    const items = w.findAll('.ship-item')
    const foreignItem = items.find((i) => i.text().includes('大和改二重'))!
    expect(foreignItem.exists()).toBe(true)
    expect(foreignItem.classes()).toContain('opacity-50')
    expect(foreignItem.classes()).toContain('cursor-not-allowed')
  })

  it('分割先のバナーにマウスオーバーすると即時にtooltipが出て、離すと消える', async () => {
    const w = mount(ShipModal, {
      props: { ...baseProps, hasSpGroupSplit: true, spGroupSiblings: [yamatoKai2Ju] },
    })
    await w.find('span.cursor-pointer.text-blue-600').trigger('click')

    const items = w.findAll('.ship-item')
    const foreignItem = items.find((i) => i.text().includes('大和改二重'))!
    await foreignItem.trigger('mouseenter')
    expect(tooltipText()).toBe(SP_GROUP_SPLIT_NOTE)

    await foreignItem.trigger('mouseleave')
    expect(tooltipText()).toBeNull()
  })

  it('分割先のバナーをクリックしても改装段階は変更されない', async () => {
    const w = mount(ShipModal, {
      props: { ...baseProps, hasSpGroupSplit: true, spGroupSiblings: [yamatoKai2Ju] },
    })
    await w.find('span.cursor-pointer.text-blue-600').trigger('click')

    const items = w.findAll('.ship-item')
    const foreignItem = items.find((i) => i.text().includes('大和改二重'))!
    await foreignItem.trigger('click')

    expect(w.emitted('select-variant')).toBeUndefined()
  })

  it('spGroupSiblings が無いときは従来どおり分割先のバナーは出ない', async () => {
    const w = mount(ShipModal, { props: { ...baseProps, hasSpGroupSplit: false } })
    await w.find('span.cursor-pointer.text-blue-600').trigger('click')

    expect(w.text()).not.toContain('大和改二重')
  })
})
