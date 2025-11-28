<template>
  <div class="p-4">
    <div class="flex items-center mb-2 flex-nowrap" style="min-height: 44px;">
      <h2 class="text-xl font-bold mr-4 whitespace-nowrap">特攻情報</h2>
      <button
        @click="toggleSortMode"
        class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap"
      >
        {{ sortByMode === 'area' ? '札で並べ替え' : '海域で並べ替え' }}
      </button>
    </div>
    <div v-if="loading">読み込み中...</div>
    <div v-else class="overflow-x-auto">
      <table class="sp-attack-table w-full text-sm border-collapse border border-gray-300">
        <thead class="bg-gray-100" :style="headerStyle" ref="theadRef">
          <!-- Area Mode Header -->
          <template v-if="sortByMode === 'area'">
            <tr>
              <th
                v-for="group in stageGroups"
                :key="'stageNum-' + group.stageNum"
                :colspan="isExpanded(group.stageNum) ? group.maps.length : group.maps.length"
                :style="cellStyle"
                class="border sp-col text-center cursor-pointer align-top"
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
                    class="border sp-col text-center cursor-pointer align-top"
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
                    class="border sp-col text-center align-top"
                    :key="'stageNum-colspan-' + group.stageNum"
                  >
                    <!-- mapId非表示 -->
                  </th>
                </template>
              </template>
            </tr>
            <!-- tagId行 -->
            <tr>
              <template v-for="group in stageGroups">
                <template v-if="isExpanded(group.stageNum)">
                  <th
                    v-for="map in group.maps"
                    :key="'tagId-' + map.mapId"
                    :style="cellStyle"
                    class="border sp-col text-center align-top"
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
                    class="border sp-col text-center align-top"
                    :key="'tagId-colspan-' + group.stageNum"
                  >
                    <!-- tagId非表示 -->
                  </th>
                </template>
              </template>
            </tr>
          </template>

          <!-- Tag Mode Header -->
          <template v-else>
            <tr>
              <th
                v-for="group in tagGroups"
                :key="'tagGroup-' + group.tagId"
                :colspan="group.maps.length"
                :style="{ ...cellStyle, backgroundColor: group.tagColor + ' !important', color: getTextColor(group.tagColor) + ' !important' }"
                class="border sp-col text-center cursor-pointer align-top"
                @click="toggleTag(group.tagId)"
              >
                {{ group.tagName }}
              </th>
            </tr>
            <tr>
              <template v-for="group in tagGroups">
                <template v-if="isTagExpanded(group.tagId)">
                  <th
                    v-for="(map, index) in group.maps"
                    :key="'tagMap-' + group.tagId + '-' + map.mapId + '-' + index"
                    :style="cellStyle"
                    class="border sp-col text-center cursor-pointer align-top"
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
                    class="border sp-col text-center align-top"
                    :key="'tagGroup-colspan-' + group.tagId"
                  >
                    <!-- mapId非表示 -->
                  </th>
                </template>
              </template>
            </tr>
          </template>
        </thead>
        <tbody>
          <tr
            v-for="ship in sortedShips"
            :key="ship.orig"
            :style="{ ...rowStyle, height: `${TABLE_STYLE.rowHeight}px`, boxSizing: 'border-box' }"
            class="hover:bg-gray-100"
          >
            <!-- Area Mode Body -->
            <template v-if="sortByMode === 'area'">
              <template v-for="group in stageGroups">
                <template v-if="isExpanded(group.stageNum)">
                  <td
                    v-for="map in group.maps"
                    :key="'cell-' + ship.orig + '-' + map.mapId"
                    :style="getCellStyle(ship.spAttackData[`mapId_${map.mapId}`])"
                    class="border sp-col text-center"
                  >
                    {{ formatSpAttackValue(ship.spAttackData[`mapId_${map.mapId}`]) }}
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
            </template>

            <!-- Tag Mode Body -->
            <template v-else>
              <template v-for="group in tagGroups">
                <template v-if="isTagExpanded(group.tagId)">
                  <td
                    v-for="(map, index) in group.maps"
                    :key="'cell-tag-' + ship.orig + '-' + group.tagId + '-' + map.mapId + '-' + index"
                    :style="getCellStyle(ship.spAttackData[`mapId_${map.mapId}`])"
                    class="border sp-col text-center"
                  >
                    {{ formatSpAttackValue(ship.spAttackData[`mapId_${map.mapId}`]) }}
                  </td>
                </template>
                <template v-else>
                  <td
                    :colspan="group.maps.length"
                    class="border sp-col text-center"
                    :key="'cell-tag-colspan-' + ship.orig + '-' + group.tagId"
                  >
                    <!-- mapId非表示 -->
                  </td>
                </template>
              </template>
            </template>
          </tr>
          <tr v-if="sortedShips.length === 0">
            <td :colspan="totalColspan" class="border text-center py-4 text-gray-500">
              {{ emptyStateMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
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
  emits: ['update-sorted-ships', 'loading', 'header-height-change'],
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
      nextTick(() => {
        emitHeaderHeight()
      })
    }
    const isExpanded = (stageNum: number) => expandedStageNums.value.includes(stageNum)

    // --- Sort by Tag Logic ---
    const sortByMode = ref<'area' | 'tag'>('area')
    const expandedTagIds = ref<number[]>([])

    const toggleSortMode = () => {
      sortByMode.value = sortByMode.value === 'area' ? 'tag' : 'area'
      nextTick(() => {
        emitHeaderHeight()
      })
    }

    const tagGroups = computed(() => {
      // Collect all unique tags from tagMap
      // Or iterate over all maps and collect tags?
      // Better to iterate over known tags in tagMap to ensure order if possible, or just sort keys.
      // But we only want tags that are actually used in the current eventMaps?
      // Let's iterate over tagMap keys, assuming tagMap contains all tags for this event.

      const groups: { tagId: number; tagName: string; tagColor: string; maps: Event[] }[] = []

      // Get all tagIds from tagMap, sorted numerically
      const tagIds = Object.keys(tagMap.value).map(Number).sort((a, b) => a - b)

      for (const tagId of tagIds) {
        const mapsForTag = eventMaps.value.filter(map => {
           return [map.tagId1, map.tagId2, map.tagId3, map.tagId4].includes(tagId)
        })

        if (mapsForTag.length > 0) {
           // Sort maps by mapId or stageNum? Let's keep them in order of stageNum then mapId
           mapsForTag.sort((a, b) => {
             if (a.stageNum !== b.stageNum) return a.stageNum - b.stageNum
             return a.mapId - b.mapId
           })

           groups.push({
             tagId,
             tagName: tagMap.value[tagId].tagName,
             tagColor: tagMap.value[tagId].tagColor,
             maps: mapsForTag
           })
        }
      }
      return groups
    })

    const toggleTag = (tagId: number) => {
      const idx = expandedTagIds.value.indexOf(tagId)
      if (idx >= 0) {
        expandedTagIds.value.splice(idx, 1)
      } else {
        expandedTagIds.value.push(tagId)
      }
       nextTick(() => {
        emitHeaderHeight()
      })
    }

    const isTagExpanded = (tagId: number) => expandedTagIds.value.includes(tagId)


  // ...existing code...
    // tagsコレクション取得
    const fetchTags = async () => {
      const q = query(collection(db, 'tags'), where('eventId', '==', props.selectedEventId))
      const snap = await getDocs(q)
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
      // Initialize expandedTagIds to empty (collapsed by default)
      expandedTagIds.value = []
    }
    const theadRef = ref<HTMLElement | null>(null)
    let resizeObserver: ResizeObserver | null = null

    const emitHeaderHeight = () => {
      if (theadRef.value) {
        emit('header-height-change', theadRef.value.getBoundingClientRect().height)
      }
    }

    onMounted(() => {
      // fetchTags() // fetchAllSpAttackDataで呼ぶので削除
      if (theadRef.value) {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            emit('header-height-change', entry.contentRect.height)
          }
        })
        resizeObserver.observe(theadRef.value)
      }
    })

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    })

    const shipsWithSpAttack = ref<ShipWithSpAttack[]>([])
    const loading = ref(true)
    const spAttackCache = ref<Record<number, Record<string, number>>>({})

    const sortKey = ref<string | null>(null)
    const sortOrder = ref<'asc' | 'desc'>('desc')
    const sortBy = (key: string) => {
      if (sortKey.value === key) {
        // Cycle through: desc -> asc -> none
        if (sortOrder.value === 'desc') {
          sortOrder.value = 'asc'
        } else if (sortOrder.value === 'asc') {
          // Clear sort
          sortKey.value = null
        }
      } else {
        // New column: start with desc
        sortKey.value = key
        sortOrder.value = 'desc'
      }
      nextTick(() => {
        emitHeaderHeight()
      })
    }

    const totalColspan = computed(() => {
      if (sortByMode.value === 'area') {
        if (stageGroups.value.length === 0) return 1
        const total = stageGroups.value.reduce((acc, group) => {
          return acc + group.maps.length
        }, 0)
        return Math.max(total, 1)
      } else {
         if (tagGroups.value.length === 0) return 1
         const total = tagGroups.value.reduce((acc, group) => {
           return acc + group.maps.length
         }, 0)
         return Math.max(total, 1)
      }
    })

    const emptyStateMessage = computed(() => {
      if (!props.selectedEventId) {
        return '海域を選択してください'
      }
      return '-'
    })

    // Watchers to sync header height
    watch(
      [sortByMode, expandedStageNums, tagGroups],
      () => {
        nextTick(() => {
          emitHeaderHeight()
        })
      },
      { deep: true }
    )

    const sortedShips = computed(() => {
      if (!sortKey.value) {
        // Default sort: filterId (ascending) -> libraryId (ascending)
        return [...shipsWithSpAttack.value].sort((a, b) => {
          const fa = a.filterId ?? 0
          const fb = b.filterId ?? 0
          if (fa !== fb) return fa - fb
          return (a.libraryId || 0) - (b.libraryId || 0)
        })
      }
      return [...shipsWithSpAttack.value].sort((a, b) => {
        const aVal = a.spAttackData[sortKey.value!]
        const bVal = b.spAttackData[sortKey.value!]
        const aNum = typeof aVal === 'number' ? aVal : -Infinity
        const bNum = typeof bVal === 'number' ? bVal : -Infinity
        return sortOrder.value === 'asc' ? aNum - bNum : bNum - aNum
      })
    })

    const fetchEventMaps = async () => {
      const q = query(collection(db, 'eventmap'), where('eventId', '==', props.selectedEventId))
      const snap = await getDocs(q)
      eventMaps.value = snap.docs.map((doc) => doc.data() as Event)
      expandedStageNums.value = []
      // Auto-expand all stages by default? Or just let them be empty?
      // Original code initialized it to empty, meaning collapsed?
      // Wait, original code: expandedStageNums.value = []
      // And isExpanded checks includes. So initially all collapsed?
      // Let's check if we should expand them by default.
      // Usually users want to see data.
      // But let's stick to original behavior for now unless requested.
      // Actually, looking at original code, it seems they start collapsed?
      // Let's check if I missed something.
      // Ah, I should probably expand them by default if that's better UX, but sticking to previous behavior is safer.
      // However, for tags, I'll expand them by default as I did in fetchTags.

      // Let's expand stages by default too, it's annoying otherwise.
      // But wait, if I change behavior I should be careful.
      // The user didn't ask to change default expansion state of stages.
      // I will leave stage expansion as is (collapsed by default if that was the case, or maybe the user manually expands).
      // Actually, let's look at how `expandedStageNums` is used.
      // If it's empty, `isExpanded` returns false.
      // If `isExpanded` is false, it shows a colspan header and empty body cells?
      // Wait, the original code had:
      // <template v-if="isExpanded(group.stageNum)"> ... </template>
      // <template v-else> ... </template>
      // If collapsed, it shows a placeholder column.

      // Initialize expandedStageNums to empty (collapsed by default)
      expandedStageNums.value = []
    }

    const fetchAllSpAttackData = async () => {
      loading.value = true
      emit('loading', true)
      try {
        await fetchEventMaps()
        await fetchTags()
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
      } finally {
        loading.value = false
        emit('loading', false)
      }
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

    const formatSpAttackValue = (value: number | undefined): string => {
      if (typeof value !== 'number') {
        return '-'
      }
      if (value === 1) {
        return '1'
      }
      return value.toFixed(2)
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
      theadRef,
      formatSpAttackValue,
      // New properties
      sortByMode,
      toggleSortMode,
      tagGroups,
      toggleTag,
      isTagExpanded,
      totalColspan,
      emptyStateMessage,
      TABLE_STYLE,
    }
  },
})
</script>
