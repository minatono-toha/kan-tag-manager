import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AmbiguousShipSelectModal from './AmbiguousShipSelectModal.vue'
import type { Ship } from '@/types/interfaces'

const ship = (name: string, bannerId: number, shipType: string, updateLevel: number) =>
  ({ name, bannerId, shipType, updateLevel }) as Ship

const mountModal = (name: string, candidates: Ship[], index = 1, total = 1) =>
  mount(AmbiguousShipSelectModal, {
    props: { prompt: { name, index, total, candidates } },
    attachTo: document.body,
  })

describe('AmbiguousShipSelectModal', () => {
  it('候補の艦名が同じ宗谷は艦種と改装段階で区別して表示する', () => {
    const wrapper = mountModal('宗谷', [
      ship('宗谷', 699, '特務艦', 0),
      ship('宗谷', 645, '灯台補給船', 1),
      ship('宗谷', 650, '南極観測船', 2),
    ])

    const labels = document.body.querySelectorAll('button')
    const texts = Array.from(labels).map((b) => b.textContent!.replace(/\s+/g, ''))
    expect(texts).toContain('特務艦(改装段階:0)')
    expect(texts).toContain('灯台補給船(改装段階:1)')
    expect(texts).toContain('南極観測船(改装段階:2)')

    wrapper.unmount()
  })

  it('候補の艦名が異なる場合は艦名を添える', () => {
    const wrapper = mountModal('Glorious改', [
      ship('Glorious 改(戦)', 740, '巡洋戦艦', 3),
      ship('Glorious 改(航)', 741, '正規空母', 2),
    ])

    const texts = Array.from(document.body.querySelectorAll('button')).map((b) =>
      b.textContent!.replace(/\s+/g, ''),
    )
    expect(texts).toContain('巡洋戦艦(Glorious改(戦))')
    expect(texts).toContain('正規空母(Glorious改(航))')

    wrapper.unmount()
  })

  it('選択すると bannerId を emit し、複数所持なら何隻目かを表示する', async () => {
    const wrapper = mountModal(
      '宗谷',
      [ship('宗谷', 699, '特務艦', 0), ship('宗谷', 650, '南極観測船', 2)],
      2,
      3,
    )

    expect(document.body.textContent).toContain('2 隻目')

    const buttons = document.body.querySelectorAll('button')
    await (buttons[1] as HTMLButtonElement).click()
    expect(wrapper.emitted('select')?.[0]).toEqual([650])

    wrapper.unmount()
  })
})
