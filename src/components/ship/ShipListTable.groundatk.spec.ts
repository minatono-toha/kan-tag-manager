import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShipListTable from './ShipListTable.vue'
import FilterPopup from '@/components/common/FilterPopup.vue'
import type { Ship, ExpandedShip } from '@/types/interfaces'

// jsdom には ResizeObserver が無い。ShipListTable はヘッダ高さの実測に使っているためポリフィルする。
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

const makeShip = (over: Partial<Ship>): Ship => ({
  libraryId: 1, spGroupId: 49, shipType: '水上機母艦', shipTypeCategory: '水上機母艦',
  speed: '低', bannerId: 102, filterId: 1, name: '千歳', orig: 49, class: '千歳型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0, ...over,
})

// 行の艦(基本形)と、表示中の改装形態。ground_atk は形態ごとに違うので、行ではなく形態の値が出る必要がある。
const chitose = makeShip({ bannerId: 102, name: '千歳', ground_atk: 3, updateLevel: 0 })
const chitoseKou = makeShip({ bannerId: 108, name: '千歳航', shipType: '軽空母', ground_atk: 0, updateLevel: 3 })
const unyoKai = makeShip({ bannerId: 382, name: '雲鷹改', spGroupId: 322, orig: 322, ground_atk: 1, libraryId: 2 })
const noshiro = makeShip({ bannerId: 662, name: '能代改二', spGroupId: 138, orig: 138, ground_atk: 2, libraryId: 3 })
const nagato = makeShip({ bannerId: 80, name: '長門', spGroupId: 1, orig: 1, ground_atk: 6, libraryId: 4 }) // 改二で解禁
const iowa = makeShip({ bannerId: 440, name: 'Iowa', spGroupId: 240, orig: 240, ground_atk: 0, libraryId: 6 })
const noField = makeShip({ bannerId: 999, name: '未設定艦', spGroupId: 900, orig: 900, libraryId: 5 })

const allShips = [chitose, chitoseKou, unyoKai, noshiro, nagato, iowa, noField]

const expand = (s: Ship): ExpandedShip => ({
  ...s,
  orig: s.spGroupId,
  isSpGroupSplit: s.spGroupId !== s.orig,
  shipIndex: 0,
  ownershipCount: 1,
})

const render = (variantMap = new Map<string, number>()) =>
  mount(ShipListTable, {
    props: {
      ships: [chitose, unyoKai, noshiro, nagato, iowa, noField].map(expand),
      sourceShips: [chitose, unyoKai, noshiro, nagato, iowa, noField].map(expand),
      hasFiltersSelected: true,
      displayMode: 'detail',
      selectedEventId: 1,
      tagManagementData: new Map(),
      allShips,
      variantMap,
      showUnownedShips: true,
    },
  })

// 詳細表示の列: 艦種 / 艦名 / 艦型・艦番 / 速力 / 対地装備 (図鑑ID は非表示)
const GROUND_ATK_COL = 4
const groundAtkCells = (w: ReturnType<typeof render>) =>
  w.findAll('tbody tr').map((tr) => tr.findAll('td')[GROUND_ATK_COL]?.text())

// 画面には FilterPopup が複数ある(艦名/艦型/速力/艦種/対地装備)。title で対地装備のものを取る。
const groundAtkPopup = (w: ReturnType<typeof render>) =>
  w.findAllComponents(FilterPopup).find((c) => c.props('title') === '対地装備で絞り込み')!

describe('ShipListTable の対地装備列', () => {
  it('詳細表示のとき「対地装備」列が出て、図鑑ID列は出ない', () => {
    const headers = render().findAll('thead th').map((th) => th.text())
    expect(headers).toContain('対地装備')
    expect(headers.some((h) => h.includes('図鑑ID'))).toBe(false)
  })

  it('艦名のみ表示のとき「対地装備」列は出ない', () => {
    const w = mount(ShipListTable, {
      props: {
        ships: [expand(chitose)], sourceShips: [expand(chitose)], hasFiltersSelected: true,
        displayMode: 'nameOnly', selectedEventId: 1, tagManagementData: new Map(),
        allShips, variantMap: new Map(), showUnownedShips: true,
      },
    })
    expect(w.findAll('thead th').map((th) => th.text())).not.toContain('対地装備')
  })

  it('ground_atk 0〜6 をそれぞれの文言で表示し、未設定は "-" にする', () => {
    // 行順は props.ships のまま: 千歳(3) / 雲鷹改(1) / 能代改二(2) / 長門(6) / Iowa(0) / 未設定艦(undefined)
    expect(groundAtkCells(render())).toEqual([
      '大発系・内火艇OK', '大発系のみ', '内火艇のみ', '(改造後)大発系・内火艇OK', '-', '-',
    ])
  })

  it('改装段階を切り替えると、その形態の ground_atk を表示する(千歳3 → 千歳航0)', () => {
    // 千歳(spGroupId=49)の行で 千歳航(bannerId=108, 軽空母) を選択している状態
    const cells = groundAtkCells(render(new Map([['49_0', 108]])))
    expect(cells[0]).toBe('-')
  })

  // 表が描くのは props.ships。絞り込み結果は filter-change で親(App.vue)に返し、親が ships に流し戻す。
  // 単体では ships が固定なので、描画行ではなく emit された結果を見る。
  const lastFiltered = async (w: ReturnType<typeof render>) => {
    await new Promise((r) => setTimeout(r, 250)) // watchDebounced(150ms, maxWait 300ms)
    const events = w.emitted('filter-change')!
    const [ships, isFiltering] = events[events.length - 1] as [ExpandedShip[], boolean]
    return { names: ships.map((s) => s.name), isFiltering }
  }

  it('対地装備の絞り込みは7択のチェックボックスで、複数選択できる', async () => {
    const w = render()

    // 虫眼鏡アイコンを押すと FilterPopup(checkbox) が開く
    const header = w.findAll('thead th').find((th) => th.text().includes('対地装備'))!
    await header.find('span[title="絞り込み"]').trigger('click')

    const popup = groundAtkPopup(w)
    expect(popup.props('show')).toBe(true)
    expect(popup.props('type')).toBe('checkbox')
    expect(popup.props('options')).toEqual([
      '-', '大発系のみ', '内火艇のみ', '大発系・内火艇OK',
      '(改造後)大発系のみ', '(改造後)内火艇のみ', '(改造後)大発系・内火艇OK',
    ])

    // 「大発系のみ」「内火艇のみ」「(改造後)大発系・内火艇OK」を選ぶ → 1 / 2 / 6 の艦だけ残る
    await popup.vm.$emit('apply', ['大発系のみ', '内火艇のみ', '(改造後)大発系・内火艇OK'])
    const { names, isFiltering } = await lastFiltered(w)
    expect(names).toEqual(['雲鷹改', '能代改二', '長門'])
    expect(isFiltering).toBe(true)
  })

  it('絞り込みは表示中の改装段階の値で判定する', async () => {
    // 千歳(素は3)の行で 千歳航(ground_atk=0) を選択 → 「-」で絞ると千歳の行が残る
    const w = render(new Map([['49_0', 108]]))
    await groundAtkPopup(w).vm.$emit('apply', ['-'])

    const { names } = await lastFiltered(w)
    expect(names).toContain('千歳')
    expect(names).not.toContain('能代改二')
  })
})
