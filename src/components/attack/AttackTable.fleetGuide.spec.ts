import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AttackTable from './AttackTable.vue'
import type { Event } from '@/types/interfaces'

const eventMaps: Event[] = [
  {
    mapId: 1, stage: 'E-2-1', mapPlace: 'P', stageNum: 2, eventId: 1,
    tagId1: 0, tagId2: 0, tagId3: 0, tagId4: 0,
    fleetGuide: '空母機動部隊<br>道中制空優勢<br />\n決戦支援あり',
  } as Event,
  {
    mapId: 2, stage: 'E-2-2', mapPlace: 'Q', stageNum: 2, eventId: 1,
    tagId1: 0, tagId2: 0, tagId3: 0, tagId4: 0,
  } as Event,
]

vi.mock('@/firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  // eventmap 以外(tags / maintable)は空スナップショットで足りる
  getDocs: vi.fn((q: { __maps?: boolean }) => Promise.resolve(q?.__maps ? mapsSnapshot() : emptySnapshot())),
}))

const emptySnapshot = () => ({ docs: [], forEach: () => {} })
const mapsSnapshot = () => ({ docs: eventMaps.map((m) => ({ data: () => m })), forEach: () => {} })

// jsdom には ResizeObserver が無い(AttackTable がヘッダ高さ計測に使う)
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverStub)

// collection 名で eventmap クエリを識別できるようにする
const firestore = await import('firebase/firestore')

beforeEach(async () => {
  vi.mocked(firestore.collection).mockImplementation(
    ((_db: unknown, name: string) => ({ __maps: name === 'eventmap' })) as never,
  )
  vi.mocked(firestore.query).mockImplementation(((c: unknown) => c) as never)
})

afterEach(() => {
  document.body.innerHTML = ''
})

const mountTable = async () => {
  const wrapper = mount(AttackTable, {
    props: { filteredUniqueOrigs: [], selectedEventId: 1 },
    attachTo: document.body,
  })
  await flushPromises()
  // E-2 グループを展開してボスマス見出しを出す
  await wrapper.get('thead th').trigger('click')
  return wrapper
}

const mapHeader = (wrapper: Awaited<ReturnType<typeof mountTable>>, label: string) =>
  wrapper.findAll('thead th').find((th) => th.text().startsWith(label))!

const popup = () => document.body.querySelector('.fleet-guide-popup')

describe('ボスマス見出しのダブルクリックで編成指南を表示する', () => {
  it('fleetGuide があるマスは内容とマス名を表示し、Escで閉じる', async () => {
    const wrapper = await mountTable()

    await mapHeader(wrapper, 'E-2-1').trigger('dblclick', { clientX: 120, clientY: 80 })
    expect(popup()?.textContent).toContain('E-2-1 (P)')
    expect(popup()?.textContent).toContain('道中制空優勢')

    // <br> は改行として描画し、直後の生改行は二重にしない
    const body = popup()!.querySelector('.fleet-guide-body')!
    expect(body.querySelectorAll('br')).toHaveLength(2)
    expect(body.innerHTML).not.toMatch(/<br\s*\/?>\n/i)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(popup()).toBeNull()

    wrapper.unmount()
  })

  it('fleetGuide が無いマスでは何も出さない', async () => {
    const wrapper = await mountTable()

    await mapHeader(wrapper, 'E-2-2').trigger('dblclick', { clientX: 10, clientY: 10 })
    expect(popup()).toBeNull()

    wrapper.unmount()
  })

  it('ポップアップ外のクリックで閉じる', async () => {
    const wrapper = await mountTable()

    await mapHeader(wrapper, 'E-2-1').trigger('dblclick', { clientX: 10, clientY: 10 })
    expect(popup()).not.toBeNull()

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await flushPromises()
    expect(popup()).toBeNull()

    wrapper.unmount()
  })

  it('ダブルクリックでは並び順を変えない', async () => {
    vi.useFakeTimers()
    const wrapper = await mountTable()

    const header = mapHeader(wrapper, 'E-2-1')
    await header.trigger('click')
    await header.trigger('click')
    await header.trigger('dblclick', { clientX: 10, clientY: 10 })
    vi.runAllTimers()
    await flushPromises()

    // ソート中なら見出しに ▲/▼ が付く
    expect(mapHeader(wrapper, 'E-2-1').text()).not.toMatch(/[▲▼]/)

    wrapper.unmount()
    vi.useRealTimers()
  })
})
