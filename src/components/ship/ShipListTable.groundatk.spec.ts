import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShipListTable from './ShipListTable.vue'
import type { Ship, ExpandedShip } from '@/types/interfaces'

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
const nagato = makeShip({ bannerId: 80, name: '長門', spGroupId: 1, orig: 1, ground_atk: 0, libraryId: 4 })
const noField = makeShip({ bannerId: 999, name: '未設定艦', spGroupId: 900, orig: 900, libraryId: 5 })

const allShips = [chitose, chitoseKou, unyoKai, noshiro, nagato, noField]

const expand = (s: Ship): ExpandedShip => ({ ...s, orig: s.spGroupId, shipIndex: 0, ownershipCount: 1 })

const render = (variantMap = new Map<string, number>()) =>
  mount(ShipListTable, {
    props: {
      ships: [chitose, unyoKai, noshiro, nagato, noField].map(expand),
      sourceShips: [chitose, unyoKai, noshiro, nagato, noField].map(expand),
      hasFiltersSelected: true,
      displayMode: 'detail',
      selectedEventId: 1,
      tagManagementData: new Map(),
      allShips,
      variantMap,
      showUnownedShips: true,
    },
  })

// 詳細表示の列: 図鑑ID / 艦種 / 艦名 / 艦型・艦番 / 速力 / 対地装備
const GROUND_ATK_COL = 5
const groundAtkCells = (w: ReturnType<typeof render>) =>
  w.findAll('tbody tr').map((tr) => tr.findAll('td')[GROUND_ATK_COL]?.text())

describe('ShipListTable の対地装備列', () => {
  it('詳細表示のとき「対地装備」列が出る', () => {
    const headers = render().findAll('thead th').map((th) => th.text())
    expect(headers).toContain('対地装備')
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

  it('ground_atk 0〜3 をそれぞれの文言で表示し、未設定は "-" にする', () => {
    // 行順は props.ships のまま: 千歳(3) / 雲鷹改(1) / 能代改二(2) / 長門(0) / 未設定艦(undefined)
    expect(groundAtkCells(render())).toEqual(['大発系・内火艇OK', '大発系のみ', '内火艇のみ', '-', '-'])
  })

  it('改装段階を切り替えると、その形態の ground_atk を表示する(千歳3 → 千歳航0)', () => {
    // 千歳(spGroupId=49)の行で 千歳航(bannerId=108, 軽空母) を選択している状態
    const cells = groundAtkCells(render(new Map([['49_0', 108]])))
    expect(cells[0]).toBe('-')
  })
})
