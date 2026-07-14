import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { FairyComment } from '@/types/interfaces'
import { ERROR_MESSAGE } from './tipsData'

const getDocs = vi.fn()
vi.mock('@/firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  getDocs: () => getDocs(),
}))

const snapshotOf = (docs: FairyComment[]) => ({
  docs: docs.map((d) => ({ id: String(d.fc_id), data: () => d })),
})

const comment = (over: Partial<FairyComment>): FairyComment => ({
  fc_id: 1, fc_type: 'tips', fc_status: 1, fc_text: 'text', ...over,
})

// FairyTips と composable はシングルトン状態を持つため、テストごとにモジュールを作り直す
const mountFairy = async () => {
  const FairyTips = (await import('./FairyTips.vue')).default
  return mount(FairyTips)
}

const bubbleText = (w: Awaited<ReturnType<typeof mountFairy>>) => w.get('.speech-bubble').text()

const clickFairy = async (w: Awaited<ReturnType<typeof mountFairy>>) => {
  await w.get('.fairy-character').trigger('click')
  await flushPromises()
}

beforeEach(() => {
  vi.resetModules()
  getDocs.mockReset()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('妖精さんコメントはFirestoreから取得する', () => {
  it('初回クリックまで読み取りが発生せず、2回目以降はキャッシュを使う', async () => {
    getDocs.mockResolvedValue(snapshotOf([comment({ fc_id: 1 }), comment({ fc_id: 2 })]))
    const w = await mountFairy()
    expect(getDocs).not.toHaveBeenCalled()

    await clickFairy(w)
    expect(getDocs).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(600) // クリックのクールダウンを解除する
    await clickFairy(w)
    expect(getDocs).toHaveBeenCalledTimes(1)
  })

  it('fc_status=0 のコメントは表示しない', async () => {
    getDocs.mockResolvedValue(
      snapshotOf([
        comment({ fc_id: 1, fc_text: '有効1' }),
        comment({ fc_id: 2, fc_text: '有効2' }),
        comment({ fc_id: 3, fc_text: '非表示', fc_status: 0 }),
      ]),
    )
    const w = await mountFairy()

    await clickFairy(w)
    expect(['有効1', '有効2']).toContain(bubbleText(w))
  })

  it('つぶやきモードでは fc_type=tweet のみ表示する', async () => {
    getDocs.mockResolvedValue(
      snapshotOf([
        comment({ fc_id: 1, fc_type: 'tips', fc_text: 'ヒント' }),
        comment({ fc_id: 2, fc_type: 'tweet', fc_text: 'つぶやき' }),
      ]),
    )
    const w = await mountFairy()

    await w.get('.fairy-character').trigger('contextmenu')
    await clickFairy(w)
    expect(bubbleText(w)).toBe('つぶやき')
  })

  it('取得に失敗したらエラー用の一言を表示する', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    getDocs.mockRejectedValue(new Error('offline'))
    const w = await mountFairy()

    await clickFairy(w)
    expect(bubbleText(w)).toBe(ERROR_MESSAGE)
  })
})
