import { ref, computed, watch } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { Ship, ExpandedShip, UserShip } from '@/types/interfaces'
import {
  saveUserShip,
  getAllUserShips,
  deleteUserShip
} from '@/utils/indexedDB'
import { compareShipsByFilterAndLibrary } from '@/utils/shipSort'

// --- Singleton State ---
const allShips = ref<Ship[]>([])
// 艦の同一性は bannerId（＝ゲーム艦ID / 艦隊分析コードの ship_id）で統一する。
// 旧 body `id` フィールドは一部の艦（新規追加分）に存在せず信頼できないため使わない。
const shipByBannerId = ref<Map<number, Ship>>(new Map())
const uniqueOrigs = ref<Ship[]>([])
const filters = ref<{ id: number; label: string }[]>([])
const selectedFilterIds = ref<number[]>([])

// UserShip data: Map<string, UserShip> where key is `${orig}_${shipIndex}`
// We also maintain a count map for performance: Map<orig, count>
const userShipMap = ref<Map<string, UserShip>>(new Map())
const ownershipCountMap = ref<Map<number, number>>(new Map())

// Search state
const filteredShipsFromSearch = ref<ExpandedShip[]>([])
const isSearchActive = ref(false)
// -----------------------

export function useShips() {

  const fetchShips = async (force = false) => {
    if (!force && allShips.value.length > 0) return

    const snap = await getDocs(collection(db, 'shiplist'))
    const list = snap.docs.map((doc) => {
      const data = doc.data() as Ship
      // spGroupId 未設定の艦は系統ID(orig)を既定値にする(後方互換)。
      return { ...data, spGroupId: data.spGroupId ?? data.orig }
    })
    allShips.value = list

    // bannerId は艦の同一性キー。欠落/重複があると変種解決が別艦に化けるため検知する。
    const bannerIndex = new Map<number, Ship>()
    const missingBannerId: string[] = []
    const duplicatedBannerId: string[] = []
    for (const ship of list) {
      if (ship.bannerId == null) {
        missingBannerId.push(ship.name)
        continue
      }
      const existing = bannerIndex.get(ship.bannerId)
      if (existing) {
        duplicatedBannerId.push(`bannerId=${ship.bannerId}: ${existing.name} / ${ship.name}`)
      }
      bannerIndex.set(ship.bannerId, ship)
    }
    if (missingBannerId.length > 0) {
      console.warn('[useShips] bannerId が欠落した艦があります(艦種タブが誤表示されます):', missingBannerId)
    }
    if (duplicatedBannerId.length > 0) {
      console.warn('[useShips] bannerId が重複しています(片方が別艦として解決されます):', duplicatedBannerId)
    }

    shipByBannerId.value = bannerIndex
    getUniqueOrigs()
  }

  const fetchFilters = async (force = false) => {
    if (!force && filters.value.length > 0) return

    const snap = await getDocs(collection(db, 'filter'))
    filters.value = snap.docs
      .map((doc) => {
        const data = doc.data()
        return { id: Number(data.filterId), label: data.filtertype_jp }
      })
      .filter((f) => !isNaN(f.id))
      .sort((a, b) => a.id - b.id)
  }

  const getUniqueOrigs = () => {
    const map = new Map<number, Ship>()
    for (const ship of allShips.value) {
      // 各グループ(spGroupId)の代表(基本艦)は bannerId 最小の艦とする。
      if (!map.has(ship.spGroupId) || ship.bannerId < (map.get(ship.spGroupId)?.bannerId ?? Infinity)) {
        map.set(ship.spGroupId, ship)
      }
    }
    uniqueOrigs.value = Array.from(map.values()).sort(compareShipsByFilterAndLibrary)
  }

  // Load UserShips from IndexedDB
  const loadUserShips = async () => {
    try {
      const allData = await getAllUserShips()
      const uMap = new Map<string, UserShip>()
      const cMap = new Map<number, number>()

      allData.forEach((ship) => {
        uMap.set(`${ship.orig}_${ship.shipIndex}`, ship)
        cMap.set(ship.orig, (cMap.get(ship.orig) || 0) + 1)
      })

      userShipMap.value = uMap
      ownershipCountMap.value = cMap
    } catch (error) {
      console.error('Error loading user ships:', error)
    }
  }

  // Helper to construct a new UserShip
  const createDefaultUserShip = (orig: number, index: number): UserShip => {
    // orig はグルーピングID(spGroupId)。既定の変種(基本艦)の bannerId を初期値にする。
    const baseShip = uniqueOrigs.value.find(s => s.spGroupId === orig)
    const variantId = baseShip ? baseShip.bannerId : orig

    return {
      orig,
      shipIndex: index,
      variantId,
      lv: 99,
      st: [0,0,0,0,0,0,0],
      exp: [0,0,0],
      ex: 0,
      sp: []
    }
  }

  // Increment ship count (max 30)
  const incrementShipCount = async (orig: number) => {
    const currentCount = getOwnershipCount(orig)
    if (currentCount >= 30) return

    const newIndex = currentCount // 0-based index
    const newUserShip = createDefaultUserShip(orig, newIndex)

    await saveUserShip(newUserShip)

    // Update local state with fresh Map identities so consumers re-evaluate
    const newUserMap = new Map(userShipMap.value)
    newUserMap.set(`${orig}_${newIndex}`, newUserShip)
    userShipMap.value = newUserMap

    const newCountMap = new Map(ownershipCountMap.value)
    newCountMap.set(orig, currentCount + 1)
    ownershipCountMap.value = newCountMap
  }

  // Decrement ship count (min 0)
  const decrementShipCount = async (orig: number) => {
    const currentCount = getOwnershipCount(orig)
    if (currentCount <= 0) return

    const lastIndex = currentCount - 1
    await deleteUserShip(orig, lastIndex)

    const newUserMap = new Map(userShipMap.value)
    newUserMap.delete(`${orig}_${lastIndex}`)
    userShipMap.value = newUserMap

    const newCountMap = new Map(ownershipCountMap.value)
    newCountMap.set(orig, currentCount - 1)
    ownershipCountMap.value = newCountMap
  }

  // Update ship variant
  const updateShipVariant = async (orig: number, shipIndex: number, variantId: number) => {
    const key = `${orig}_${shipIndex}`
    const existing = userShipMap.value.get(key)

    if (existing) {
      const updated = { ...existing, variantId }
      await saveUserShip(updated)
      const newMap = new Map(userShipMap.value)
      newMap.set(key, updated)
      userShipMap.value = newMap
    } else {
      // Safety fallback if no UserShip record exists yet for this slot
      const newUserShip = createDefaultUserShip(orig, shipIndex)
      newUserShip.variantId = variantId
      await saveUserShip(newUserShip)
      const newMap = new Map(userShipMap.value)
      newMap.set(key, newUserShip)
      userShipMap.value = newMap
    }
  }

  // Get ownership count for a ship
  const getOwnershipCount = (orig: number): number => {
    return ownershipCountMap.value.get(orig) || 0
  }

  // Expand ships based on ownership count
  const expandShips = (ships: Ship[]): ExpandedShip[] => {
    const expanded: ExpandedShip[] = []

    for (const ship of ships) {
      const count = getOwnershipCount(ship.spGroupId)

      // ExpandedShip.orig にグルーピングID(spGroupId)を入れることで、
      // 下流の行/所持/札/特攻キー(${orig}_${shipIndex} 等)を無改修で spGroupId 基準にする。
      if (count === 0) {
        // Show unowned ship
        expanded.push({
          ...ship,
          orig: ship.spGroupId,
          shipIndex: 0,
          ownershipCount: 0
        })
      } else {
        // Show owned ships (1 or more)
        for (let i = 0; i < count; i++) {
          expanded.push({
            ...ship,
            orig: ship.spGroupId,
            shipIndex: i,
            ownershipCount: count
          })
        }
      }
    }

    return expanded
  }

  const ships = computed(() => {
    if (selectedFilterIds.value.length === 0) return []

    return uniqueOrigs.value
      .filter((ship) => {
        // 1. Basic check: Does the original ship match?
        if (selectedFilterIds.value.includes(ship.filterId)) return true

        // 2. Extended check: Does any owned variant match?
        const count = getOwnershipCount(ship.spGroupId)
        if (count > 0) {
           for (let i = 0; i < count; i++) {
             const key = `${ship.spGroupId}_${i}`
             const userShip = userShipMap.value.get(key)
             if (userShip) {
               const variant = shipByBannerId.value.get(userShip.variantId)
               if (variant && selectedFilterIds.value.includes(variant.filterId)) {
                 return true
               }
             }
           }
        }
        return false
      })
      .sort(compareShipsByFilterAndLibrary)
  })

  // Expanded ships for display
  const expandedShips = computed(() => {
    const expanded = expandShips(ships.value)

    if (selectedFilterIds.value.length === 0) return expanded

    return expanded.filter(ship => {
      // Resolve the actual ship type being displayed
      let currentFilterId = ship.filterId
      const key = `${ship.orig}_${ship.shipIndex}`
      const userShip = userShipMap.value.get(key)

      if (userShip) {
        const variant = shipByBannerId.value.get(userShip.variantId)
        if (variant) {
          currentFilterId = variant.filterId
        }
      }

      return selectedFilterIds.value.includes(currentFilterId)
    })
  })

  const shipsToDisplay = computed(() => {
    if (!isSearchActive.value) {
      return expandedShips.value
    }
    return filteredShipsFromSearch.value
  })

  const toggleFilter = (id: number) => {
    const index = selectedFilterIds.value.indexOf(id)
    if (index > -1) selectedFilterIds.value.splice(index, 1)
    else selectedFilterIds.value.push(id)
  }

  const toggleAllFilters = () => {
    if (isAllSelected.value) selectedFilterIds.value = []
    else selectedFilterIds.value = filters.value.map((f) => f.id)
  }

  const isAllSelected = computed(() => {
    return selectedFilterIds.value.length === filters.value.length && filters.value.length > 0
  })

  const handleShipFilterChange = (filtered: ExpandedShip[], isActive: boolean) => {
    filteredShipsFromSearch.value = filtered
    isSearchActive.value = isActive
  }

  // Watch for changes in allShips and reload
  watch(allShips, async () => {
    await loadUserShips()
  })

  return {
    allShips,
    shipByBannerId,
    uniqueOrigs,
    filters,
    selectedFilterIds,
    ships,
    expandedShips,
    shipsToDisplay,
    fetchShips,
    fetchFilters,
    toggleFilter,
    toggleAllFilters,
    isAllSelected,
    handleShipFilterChange,
    filteredShipsFromSearch,
    isSearchActive,
    loadUserShips,
    incrementShipCount,
    decrementShipCount,
    getOwnershipCount,
    userShipMap,
    updateShipVariant
  }
}
