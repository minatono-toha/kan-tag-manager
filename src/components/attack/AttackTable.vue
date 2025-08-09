<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-2">特攻情報</h2>
    <div v-if="loading">読み込み中...</div>
    <div v-else>
      <table class="sp-attack-table w-full text-sm border-collapse border border-gray-300">
        <AttackTableHeader
          :groupedStageNums="groupedStageNums"
          :sortedEventMaps="sortedEventMaps"
          :expandedStages="expandedStages"
          :sortKey="sortKey"
          :sortOrder="sortOrder"
          :anyStageExpanded="anyStageExpanded"
          :cellStyle="cellStyle"
          :headerStyle="headerStyle"
          @toggleStage="toggleStage"
          @sortBy="sortBy"
        />
        <AttackTableBody
          :sortedShips="sortedShips"
          :sortedEventMaps="sortedEventMaps"
          :expandedStages="expandedStages"
          :rowStyle="rowStyle"
          :getCellStyle="getCellStyle"
        />
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { TABLE_STYLE } from '@/constants/tableStyle'
import AttackTableHeader from './AttackTableHeader.vue'
import AttackTableBody from './AttackTableBody.vue'
import type { Ship, ShipWithSpAttack, Event } from '@/types/interfaces'

export default defineComponent({
  name: 'AttackTable',
  components: { AttackTableHeader, AttackTableBody },
  props: {
    filteredUniqueOrigs: {
  type: Array as () => Ship[],
  required: true,
} as AttackTableProps['filteredUniqueOrigs'],
  },
  emits: ['update-sorted-ships'],
  setup(props, { emit }) {
    const eventMaps = ref<Event[]>([])
    const shipsWithSpAttack = ref<ShipWithSpAttack[]>([])
    const loading = ref(true)
    const spAttackCache = ref<Record<number, Record<string, number>>>({})

    const sortKey = ref<string | null>(null)
    const sortOrder = ref<'asc' | 'desc'>('asc')
    const expandedStages = ref<Record<number, boolean>>({})

    const sortBy = (key: string) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'desc'
      }
    }

    const toggleStage = (stageNum: number) => {
      expandedStages.value[stageNum] = !expandedStages.value[stageNum]
    }

    const anyStageExpanded = computed(() =>
      Object.values(expandedStages.value).some((v) => v),
    )

    const sortedEventMaps = computed(() =>
      eventMaps.value.slice().sort((a, b) => a.mapId - b.mapId),
    )

    const groupedStageNums = computed(() => {
      const sorted = sortedEventMaps.value
      const groups: { stageNum: number; count: number }[] = []

      for (const map of sorted) {
        const last = groups[groups.length - 1]
        if (last && last.stageNum === map.stageNum) {
          last.count++
        } else {
          groups.push({ stageNum: map.stageNum, count: 1 })
        }
      }

      return groups
    })

    const sortedShips = computed(() => {
      if (!sortKey.value) return shipsWithSpAttack.value
      return [...shipsWithSpAttack.value].sort((a, b) => {
        const aVal = a.spAttackData[sortKey.value!]
        const bVal = b.spAttackData[sortKey.value!]
        const aNum = typeof aVal === 'number' ? aVal : -Infinity
        const bNum = typeof bVal === 'number' ? bVal : -Infinity
        return sortOrder.value === 'asc' ? aNum - bNum : bNum - aNum
      })
    })

    const fetchEventMaps = async () => {
      const snap = await getDocs(collection(db, 'eventmap'))
      eventMaps.value = snap.docs.map((doc) => doc.data() as Event)
    }

    const fetchAllSpAttackData = async () => {
      await fetchEventMaps()
      const snap = await getDocs(collection(db, 'eventId_1'))
      const results: Record<number, Record<string, number>> = {}

      snap.forEach((doc) => {
        const data = doc.data()
        const orig: number = data.orig
        results[orig] = {}

        for (const map of eventMaps.value) {
          const mapKey = `mapId_${map.mapId}`
          if (typeof data[mapKey] === 'number') {
            results[orig][mapKey] = data[mapKey]
          }
        }
      })

      spAttackCache.value = results
      updateShipsWithSpAttack()
      loading.value = false
    }

    const updateShipsWithSpAttack = () => {
      shipsWithSpAttack.value = props.filteredUniqueOrigs.map((ship) => ({
        ...ship,
        spAttackData: spAttackCache.value[ship.orig] || {},
      }))
    }

    watch(() => props.filteredUniqueOrigs, updateShipsWithSpAttack)
    fetchAllSpAttackData()

    watch(
      () => sortedShips.value,
      (newSortedShips) => {
        emit('update-sorted-ships', newSortedShips.map((ship) => ({ ...ship })))
      },
      { immediate: true },
    )

    const rowStyle = {
      height: `${TABLE_STYLE.rowHeight}px`,
      fontSize: TABLE_STYLE.fontSize,
    }

    const cellStyle = {
      padding: TABLE_STYLE.padding,
      whiteSpace: TABLE_STYLE.whiteSpace,
    }

    const headerStyle = {
      height: `${TABLE_STYLE.headerHeight}px`,
      fontSize: TABLE_STYLE.fontSize,
    }

    const getCellStyle = (spAttackData: number | undefined) => {
      let backgroundColor = 'rgb(255, 255, 255)'
      if (typeof spAttackData === 'number' && spAttackData !== 1) {
        const intensity = Math.min(Math.max(spAttackData, 1.0), 2.0)
        const red = 245
        const green = Math.floor(255 - (intensity - 1) * 70)
        const blue = 220
        backgroundColor = `rgb(${red}, ${green}, ${blue})`
      }
      return { ...cellStyle, backgroundColor }
    }

    return {
      groupedStageNums,
      sortedEventMaps,
      sortedShips,
      loading,
      rowStyle,
      cellStyle,
      headerStyle,
      sortKey,
      sortOrder,
      sortBy,
      expandedStages,
      toggleStage,
      anyStageExpanded,
      getCellStyle,
    }
  },
})
</script>
