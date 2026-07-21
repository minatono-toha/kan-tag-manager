import { describe, it, expect } from 'vitest'
import { distributeSpanWidth } from './attackColumns'

describe('特攻表の列幅の配り直し', () => {
  it('colspan=1 のセルはそのままの幅になる', () => {
    expect(distributeSpanWidth(84.5, 1)).toEqual([84.5])
  })

  it('折りたたみ中のグループの幅は束ねている列数に等分される', () => {
    expect(distributeSpanWidth(100, 4)).toEqual([25, 25, 25, 25])
  })

  it('等分できない幅でも合計は元の幅と一致する(1pxのずれも横位置の狂いになる)', () => {
    for (const [width, span] of [
      [100, 3],
      [84.37, 5],
      [17, 7],
      [123.456, 6],
    ] as const) {
      const widths = distributeSpanWidth(width, span)

      expect(widths).toHaveLength(span)
      expect(widths.reduce((a, b) => a + b, 0)).toBeCloseTo(width, 6)
    }
  })

  it('端数は最後の列だけで吸収する(先頭から順に同じ幅が並ぶ)', () => {
    const widths = distributeSpanWidth(100, 3)

    expect(widths[0]).toBe(widths[1])
    expect(widths[2]).toBeCloseTo(100 - widths[0] * 2, 6)
  })
})
