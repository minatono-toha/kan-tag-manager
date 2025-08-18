<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-2">特攻情報</h2>
    <div v-if="loading">読み込み中...</div>
    <div v-else>
      <table class="sp-attack-table w-full text-sm border-collapse border border-gray-300">
        <thead class="bg-gray-100" :style="headerStyle">
          <tr>
            <th
              v-for="group in stageGroups"
              :key="'stageNum-' + group.stageNum"
              :colspan="isExpanded(group.stageNum) ? group.maps.length : group.maps.length"
              :style="cellStyle"
              class="border sp-col text-center cursor-pointer"
              @click="toggleStage(group.stageNum)"
            >
              E-{{ group.stageNum }}
            </th>
          </tr>
          <tr>
            <template v-for="group in stageGroups">
              <template v-if="isExpanded(group.stageNum)">
                <th
                  v-for="map in group.maps"
                  :key="'mapId-' + map.mapId"
                  :style="cellStyle"
                  class="border sp-col text-center cursor-pointer"
                  @click="sortBy(`mapId_${map.mapId}`)"
                >
                  {{ map.stage }}
                  <span v-if="sortKey === `mapId_${map.mapId}`">{{
                    sortOrder === 'asc' ? '▲' : '▼'
                  }}</span>
                </th>
              </template>
              <template v-else>
                <th
                  :colspan="group.maps.length"
                  :style="cellStyle"
                  class="border sp-col text-center"
                  :key="'stageNum-colspan-' + group.stageNum"
                >
                  <!-- mapId非表示 -->
                </th>
              </template>
            </template>
          </tr>
          <!-- tagId行追加 -->
          <tr>
            <template v-for="group in stageGroups">
              <template v-if="isExpanded(group.stageNum)">
                <th
                  v-for="map in group.maps"
                  :key="'tagId-' + map.mapId"
                  :style="cellStyle"
                  class="border sp-col text-center"
                >
                  <template v-for="tagId in getTagIds(map)" :key="'tag-' + map.mapId + '-' + tagId">
                    <span
                      :style="{ backgroundColor: tagMap[tagId]?.tagColor || '#eee', color: getTextColor(tagMap[tagId]?.tagColor), display: 'inline-block', padding: '2px 6px', borderRadius: '6px', margin: '1px' }"
                    >
                      {{ tagMap[tagId]?.tagName || ('tagId: ' + tagId) }}
                    </span><br />
                  </template>
                </th>
              </template>
              <template v-else>
                <th
                  :colspan="group.maps.length"
                  :style="cellStyle"
                  class="border sp-col text-center"
                  :key="'tagId-colspan-' + group.stageNum"
                >
                  <!-- tagId非表示 -->
                </th>
              </template>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ship in sortedShips" :key="ship.orig" :style="rowStyle">
            <template v-for="group in stageGroups">
              <template v-if="isExpanded(group.stageNum)">
                <td
                  v-for="map in group.maps"
                  :key="'cell-' + ship.orig + '-' + map.mapId"
                  :style="getCellStyle(ship.spAttackData[`mapId_${map.mapId}`])"
                  class="border sp-col text-center"
                >
                  {{
                    typeof ship.spAttackData[`mapId_${map.mapId}`] === 'number'
                      ? ship.spAttackData[`mapId_${map.mapId}`]
                      : '-'
                  }}
                </td>
              </template>
              <template v-else>
                <td
                  :colspan="group.maps.length"
                  class="border sp-col text-center"
                  :key="'cell-colspan-' + ship.orig + '-' + group.stageNum"
                >
                  <!-- mapId非表示 -->
                </td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
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
    // tag情報格納用
    const tagMap = ref<Record<number, { tagName: string; tagColor: string }>>({})
    // mapからtagId1～4の値（1以上のみ）を配列で返す
    const getTagIds = (map: Event): number[] => {
      return [map.tagId1, map.tagId2, map.tagId3, map.tagId4].filter(id => typeof id === 'number' && id >= 1)
    }
    // タグ色の明度に応じて文字色を決定
    const getTextColor = (bgColor: string | undefined): string => {
      if (!bgColor) return '#000';
      // RGB形式
      const rgbMatch = bgColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        return luminance < 128 ? '#fff' : '#000';
      }
      // HEX形式
      const hexMatch = bgColor.match(/^#([0-9a-fA-F]{6})$/);
      if (hexMatch) {
        const hex = hexMatch[1];
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        return luminance < 128 ? '#fff' : '#000';
      }
      // その他は黒文字
      return '#000';
    }
  const eventMaps = ref<Event[]>([])
  const expandedStageNums = ref<number[]>([])

    // stageNumごとにグループ化
    const stageGroups = computed(() => {
      const groups: { stageNum: number; maps: Event[] }[] = []
      const mapByStage: Record<number, Event[]> = {}
      for (const map of eventMaps.value) {
        if (!mapByStage[map.stageNum]) mapByStage[map.stageNum] = []
        mapByStage[map.stageNum].push(map)
      }
      Object.keys(mapByStage)
        .sort((a, b) => Number(a) - Number(b))
        .forEach((stageNum) => {
          groups.push({ stageNum: Number(stageNum), maps: mapByStage[Number(stageNum)] })
        })
      return groups
    })

    const toggleStage = (stageNum: number) => {
      const idx = expandedStageNums.value.indexOf(stageNum)
      if (idx >= 0) {
        expandedStageNums.value.splice(idx, 1)
      } else {
        expandedStageNums.value.push(stageNum)
      }
    }
    const isExpanded = (stageNum: number) => expandedStageNums.value.includes(stageNum)
  // ...existing code...
    // tagsコレクション取得
    const fetchTags = async () => {
      const snap = await getDocs(collection(db, 'tags'))
      const map: Record<number, { tagName: string; tagColor: string }> = {}
      snap.forEach((doc) => {
        const data = doc.data()
        if (typeof data.tagId === 'number') {
          map[data.tagId] = {
            tagName: data.tagName,
            tagColor: data.tagColor,
          }
        }
      })
      tagMap.value = map
    }
    onMounted(() => {
      fetchTags()
    })

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
  expandedStageNums.value = []
    }

    const fetchAllSpAttackData = async () => {
      await fetchEventMaps()
      const snap = await getDocs(collection(db, 'maintable'))
      const results: Record<number, Record<string, number>> = {}
      snap.forEach((doc) => {
        const data = doc.data()
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
  expandedStageNums,
  toggleStage,
  isExpanded,
  stageGroups,
  getTagIds,
  tagMap,
  getTextColor,
    }
  },
})
</script>
