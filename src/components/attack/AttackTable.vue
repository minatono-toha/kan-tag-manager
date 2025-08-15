<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-2">特攻情報</h2>
    <div v-if="loading">読み込み中...</div>
    <div v-else>
      <table class="sp-attack-table w-full text-sm border-collapse border border-gray-300">
        <thead class="bg-gray-100" :style="headerStyle">
          <tr>
            <th
              v-for="map in eventMaps.slice().sort((a, b) => a.mapId - b.mapId)"
              :key="map.mapId"
              :style="cellStyle"
              class="border sp-col text-center cursor-pointer"
              @click="sortBy(`mapId_${map.mapId}`)"
            >
              {{ map.stage }}
              <span v-if="sortKey === `mapId_${map.mapId}`">{{
                sortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ship in sortedShips" :key="ship.orig" :style="rowStyle">
            <td
              v-for="map in eventMaps.slice().sort((a, b) => a.mapId - b.mapId)"
              :key="map.mapId"
              :style="getCellStyle(ship.spAttackData[`mapId_${map.mapId}`])"
              class="border sp-col text-center"
            >
              {{
                typeof ship.spAttackData[`mapId_${map.mapId}`] === 'number'
                  ? ship.spAttackData[`mapId_${map.mapId}`]
                  : '-'
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { TABLE_STYLE } from '@/constants/tableStyle'
import type { Ship, ShipWithSpAttack, Event } from '@/types/interfaces'

export default defineComponent({
  name: 'AttackTable',
  props: {
    filteredUniqueOrigs: {
      type: Array as () => Ship[],
      required: true,
    },
    selectedEventId: {
      type: Number,
      required: true,
    },
  },
  emits: ['update-sorted-ships'],
  setup(props, { emit }) {
    const eventMaps = ref<Event[]>([])
    const mapIds = computed(() =>
      eventMaps.value
        .slice()
        .sort((a, b) => a.mapId - b.mapId)
        .map((map) => `mapId_${map.mapId}`),
    )

    const shipsWithSpAttack = ref<ShipWithSpAttack[]>([])
    const loading = ref(true)
    const spAttackCache = ref<Record<number, Record<string, number>>>({})

    const sortKey = ref<string | null>(null)
    const sortOrder = ref<'asc' | 'desc'>('asc')

    const sortBy = (key: string) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'desc'
      }
    }

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
      const snap = await getDocs(collection(db, 'maintable'))
      const results: Record<number, Record<string, number>> = {}

      snap.forEach((doc) => {
        const data = doc.data()
        // 選択されたイベントIDでフィルタリング
        if (data.eventId === props.selectedEventId) {
          const orig: number = data.orig
          results[orig] = {}

          for (const map of eventMaps.value) {
            const mapKey = `mapId_${map.mapId}`
            if (typeof data[mapKey] === 'number') {
              results[orig][mapKey] = data[mapKey]
            }
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
    watch(() => props.selectedEventId, () => {
      if (props.selectedEventId) {
        fetchAllSpAttackData()
      }
    })
    fetchAllSpAttackData()

    watch(
      () => sortedShips.value,
      (newSortedShips) => {
        emit(
          'update-sorted-ships',
          newSortedShips.map((ship) => ({ ...ship })),
        )
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

      if (typeof spAttackData === 'number') {
        if (spAttackData === 1) {
          backgroundColor = 'rgb(255, 255, 255)'
        } else {
          const intensity = Math.min(Math.max(spAttackData, 1.0), 2.0)
          const red = 245
          const green = Math.floor(255 - (intensity - 1) * 70)
          const blue = 220
          backgroundColor = `rgb(${red}, ${green}, ${blue})`
        }
      }

      return {
        ...cellStyle,
        backgroundColor,
      }
    }

    return {
      mapIds,
      eventMaps,
      shipsWithSpAttack,
      sortedShips,
      loading,
      rowStyle,
      cellStyle,
      headerStyle,
      getCellStyle,
      sortKey,
      sortOrder,
      sortBy,
    }
  },
})
</script>
