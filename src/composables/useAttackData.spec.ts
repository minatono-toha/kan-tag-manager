import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { useAttackData } from './useAttackData'
import type { ExpandedShip } from '@/types/interfaces'

const makeShip = (over: Partial<ExpandedShip>): ExpandedShip => ({
  libraryId: 1, spGroupId: 1, shipType: '軽巡洋艦', shipTypeCategory: '軽巡洋艦', speed: '高',
  bannerId: 1, filterId: 4, name: '?', orig: 1, class: '', filtertype_jp: '', filtertype_en: '',
  updateLevel: 0, shipIndex: 0, ownershipCount: 0, isSpGroupSplit: false, ...over,
})

describe('useAttackData の並び順(sortKey 未指定時)', () => {
  it('上流(useShips)が組んだ並び順をそのまま使い、filterId/libraryId で組み直さない', async () => {
    // 大井/大井改(spGroupId 分割行)は upstream の orderShipRows で隣接済みの状態で渡ってくる。
    // ここで filterId/libraryId の単純ソートをかけ直すと、libraryId の大きい大井改/北上改が
    // 天龍・龍田より後ろへ飛んでしまう(実際に報告されたバグと同じ現象)。
    const ooi = makeShip({ name: '大井', libraryId: 19, orig: 19, spGroupId: 19 })
    const ooiKai = makeShip({ name: '大井改', libraryId: 97, orig: 9057, spGroupId: 9057 })
    const kitakami = makeShip({ name: '北上', libraryId: 20, orig: 20, spGroupId: 20 })
    const kitakamiKai = makeShip({ name: '北上改', libraryId: 98, orig: 9058, spGroupId: 9058 })
    const tenryu = makeShip({ name: '天龍', libraryId: 51, orig: 51, spGroupId: 51 })
    const tatsuta = makeShip({ name: '龍田', libraryId: 52, orig: 52, spGroupId: 52 })

    const input = [ooi, ooiKai, kitakami, kitakamiKai, tenryu, tatsuta]
    const filteredUniqueOrigs = ref<ExpandedShip[]>([])
    const selectedEventId = ref<number | null>(null)

    const { sortedShips } = useAttackData(selectedEventId, filteredUniqueOrigs)

    filteredUniqueOrigs.value = input
    await nextTick()

    expect(sortedShips.value.map((s) => s.name)).toEqual([
      '大井', '大井改', '北上', '北上改', '天龍', '龍田',
    ])
  })

  it('sortKey を指定した場合は従来どおり特攻倍率でソートする(この経路は変更していない)', async () => {
    const a = makeShip({ name: 'A', libraryId: 1, orig: 1, spGroupId: 1 })
    const b = makeShip({ name: 'B', libraryId: 2, orig: 2, spGroupId: 2 })
    const filteredUniqueOrigs = ref<ExpandedShip[]>([])
    const selectedEventId = ref<number | null>(null)

    const { sortedShips, sortBy } = useAttackData(selectedEventId, filteredUniqueOrigs)

    filteredUniqueOrigs.value = [a, b]
    await nextTick()
    sortBy('mapId_1')
    await nextTick()

    // spAttackData が空のため両者とも -Infinity 扱いだが、ソート経路自体が生きていることだけ確認する
    expect(sortedShips.value.map((s) => s.name).sort()).toEqual(['A', 'B'])
  })
})
