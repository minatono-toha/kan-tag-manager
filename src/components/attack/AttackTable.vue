<template>
  <div>
    <div v-if="loading">読み込み中...</div>
    <div v-else>
      <table class="sp-attack-table w-full text-sm border-collapse border border-gray-300">
        <thead class="bg-gray-100 sticky top-0 z-10" :style="headerStyle" ref="theadRef">
          <!-- Area Mode Header -->
          <template v-if="sortByMode === 'area'">
            <tr>
              <th
                v-for="group in stageGroups"
                :key="'stageNum-' + group.stageNum"
                :colspan="isExpanded(group.stageNum) ? group.maps.length : group.maps.length"
                :style="cellStyle"
                class="border sp-col text-center cursor-pointer align-top bg-gray-100"
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
                    class="border sp-col text-center cursor-pointer align-top bg-gray-100 select-none"
                    :title="map.fleetGuide ? 'ダブルクリックで編成指南を表示' : undefined"
                    @click="handleMapHeaderClick(map)"
                    @dblclick="handleMapHeaderDblClick($event, map)"
                  >
                    {{ formatStageLabel(map) }}
                    <span v-if="sortKey === `mapId_${map.mapId}`">{{
                      sortOrder === 'asc' ? '▲' : '▼'
                    }}</span>
                  </th>
                </template>
                <template v-else>
                  <th
                    :colspan="group.maps.length"
                    :style="cellStyle"
                    class="border sp-col sp-col-collapsed text-center align-top bg-gray-100"
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
                    class="border sp-col text-center align-top bg-gray-100"
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
                    class="border sp-col sp-col-collapsed text-center align-top bg-gray-100"
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
                    class="border sp-col text-center cursor-pointer align-top select-none"
                    :title="map.fleetGuide ? 'ダブルクリックで編成指南を表示' : undefined"
                    @click="handleMapHeaderClick(map)"
                    @dblclick="handleMapHeaderDblClick($event, map)"
                  >
                    {{ formatStageLabel(map) }}
                    <span v-if="sortKey === `mapId_${map.mapId}`">{{
                      sortOrder === 'asc' ? '▲' : '▼'
                    }}</span>
                  </th>
                </template>
                <template v-else>
                  <th
                    :colspan="group.maps.length"
                    :style="cellStyle"
                    class="border sp-col sp-col-collapsed text-center align-top"
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
            :key="`${ship.orig}_${ship.shipIndex}`"
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
                    class="border sp-col sp-col-collapsed text-center"
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
                    class="border sp-col sp-col-collapsed text-center"
                    :key="'cell-tag-colspan-' + ship.orig + '-' + group.tagId"
                  >
                    <!-- mapId非表示 -->
                  </td>
                </template>
              </template>
            </template>
          </tr>
          <tr v-if="!selectedEventId">
            <td :colspan="totalColspan" class="border text-center py-4 text-gray-500">
              海域を選択してください
            </td>
          </tr>
          <tr v-else-if="sortedShips.length === 0">
            <td :colspan="totalColspan" class="border text-center py-4 text-gray-500">
              -
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <FleetGuidePopup
      :show="fleetGuide.show"
      :x="fleetGuide.x"
      :y="fleetGuide.y"
      :title="fleetGuide.title"
      :content="fleetGuide.content"
      @close="closeFleetGuide"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted, nextTick, toRefs } from 'vue'
import { TABLE_STYLE } from '@/constants/tableStyle'
import type { Event, ExpandedShip } from '@/types/interfaces'
import { useAttackData } from '@/composables/useAttackData'
import { contrastingTextColor } from '@/utils/color'
import FleetGuidePopup from './FleetGuidePopup.vue'

export default defineComponent({
  name: 'AttackTable',
  components: { FleetGuidePopup },
  props: {
    filteredUniqueOrigs: {
      type: Array as () => ExpandedShip[],
      required: true,
    },
    selectedEventId: {
      type: Number,
      required: true,
    },
  },
  emits: ['update-sorted-ships', 'loading', 'header-height-change', 'update-sort-mode', 'update-is-all-expanded'],
  setup(props, { emit }) {
    const { filteredUniqueOrigs, selectedEventId } = toRefs(props)

    const {
      eventMaps,
      tagMap,
      shipsWithSpAttack,
      loading,
      sortKey,
      sortOrder,
      sortByMode,
      expandedStageNums,
      sortedShips,
      stageGroups,
      tagGroups,
      fetchAllSpAttackData,
      sortBy,
      toggleStage,
      toggleTag,
      toggleSortMode,
      isExpanded,
      isTagExpanded,
      toggleAllStages,
      isAllExpanded
    } = useAttackData(selectedEventId, filteredUniqueOrigs)

    // tag情報格納用
    // mapからtagId1～4の値（1以上のみ）を配列で返す
    const getTagIds = (map: Event): number[] => {
      return [map.tagId1, map.tagId2, map.tagId3, map.tagId4].filter(id => typeof id === 'number' && id >= 1)
    }

    // ステージ名にボスマス情報(mapPlace)を付与して返す。例: E-1-1 (I)
    const formatStageLabel = (map: Event): string => {
      return map.mapPlace ? `${map.stage} (${map.mapPlace})` : map.stage
    }

    const getTextColor = contrastingTextColor

    // --- 編成指南(fleetGuide)のポップアップ -------------------------------
    const fleetGuide = ref({ show: false, x: 0, y: 0, title: '', content: '' })

    // ダブルクリックは click を2回発火させてしまうため、ソートは少し遅らせて
    // 2打目が来たらキャンセルする(ダブルクリックで並び順が動かないようにする)。
    const DOUBLE_CLICK_GRACE_MS = 220
    let pendingSortTimer: ReturnType<typeof setTimeout> | null = null

    const cancelPendingSort = () => {
      if (pendingSortTimer !== null) {
        clearTimeout(pendingSortTimer)
        pendingSortTimer = null
      }
    }

    const handleMapHeaderClick = (map: Event) => {
      cancelPendingSort()
      pendingSortTimer = setTimeout(() => {
        pendingSortTimer = null
        sortBy(`mapId_${map.mapId}`)
      }, DOUBLE_CLICK_GRACE_MS)
    }

    const handleMapHeaderDblClick = (event: MouseEvent, map: Event) => {
      cancelPendingSort()
      const content = map.fleetGuide?.trim()
      if (!content) {
        fleetGuide.value = { ...fleetGuide.value, show: false }
        return
      }
      fleetGuide.value = {
        show: true,
        x: event.clientX,
        y: event.clientY,
        title: formatStageLabel(map),
        content,
      }
    }

    const closeFleetGuide = () => {
      fleetGuide.value = { ...fleetGuide.value, show: false }
    }

    const theadRef = ref<HTMLElement | null>(null)
    let resizeObserver: ResizeObserver | null = null

    const emitHeaderHeight = () => {
      if (theadRef.value) {
        // Math.ceil avoids subpixel undershoot that leaves the receiver's bottom edge 1px short
        emit('header-height-change', Math.ceil(theadRef.value.getBoundingClientRect().height))
      }
    }

    onMounted(() => {
      // fetchAllSpAttackData is called by watcher in composable or manually?
      // In composable:
      // watch(() => selectedEventId.value, () => { if (selectedEventId.value) fetchAllSpAttackData() })
      // But we also need to call it initially if selectedEventId is already set.
      if (selectedEventId.value) {
        fetchAllSpAttackData()
      }

      if (theadRef.value) {
        resizeObserver = new ResizeObserver(() => {
          // Re-measure via getBoundingClientRect to include subpixel-rounded outer height
          emitHeaderHeight()
        })
        resizeObserver.observe(theadRef.value)
      }

      // Ensure correct height after fonts/styles fully settle
      nextTick(() => emitHeaderHeight())
      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(() => emitHeaderHeight())
      }
    })

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      cancelPendingSort()
    })

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



    // Watchers to sync header height
    watch(
      [sortByMode, expandedStageNums, tagGroups],
      () => {
        nextTick(() => {
          emitHeaderHeight()
        })
      },
    )

    // Emit loading state
    watch(loading, (newVal) => {
      emit('loading', newVal)
    })

    // Emit sort mode and expand state changes
    watch(sortByMode, (newVal) => {
      emit('update-sort-mode', newVal)
    }, { immediate: true })

    watch(isAllExpanded, (newVal) => {
      emit('update-is-all-expanded', newVal)
    })

    watch(
      () => sortedShips.value,
      (newSortedShips) => {
        emit('update-sorted-ships', newSortedShips)
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
      formatStageLabel,
      fleetGuide,
      handleMapHeaderClick,
      handleMapHeaderDblClick,
      closeFleetGuide,
      tagMap,
      getTextColor,
      theadRef,
      formatSpAttackValue,
      sortByMode,
      toggleSortMode,
      tagGroups,
      toggleTag,
      isTagExpanded,
      totalColspan,

      TABLE_STYLE,
      toggleAllStages,
      isAllExpanded,
    }
  },
})
</script>

<style scoped>
/* Refined: full grid retained for column tracking, but with collapse to eliminate
   subpixel border misalignment. Sticky header borders are drawn via inset
   box-shadow so they don't detach during scroll. */
table.sp-attack-table {
  border-collapse: collapse !important;
  border: 0 !important;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--table-border, #e5e7eb);
  /* Auto width based on summed column widths so it doesn't expand to viewport edge */
  width: auto !important;
  table-layout: auto;
}

table.sp-attack-table th,
table.sp-attack-table td {
  border: 0 !important;
  /* Single shared grid via inset shadows — no double-border or misalignment */
  box-shadow:
    inset -1px 0 0 var(--table-border, #e5e7eb),
    inset 0 -1px 0 var(--table-border, #e5e7eb);
}

table.sp-attack-table thead th {
  /* Sticky-safe: header keeps full edges even while scrolling */
  box-shadow:
    inset -1px 0 0 var(--table-border, #e5e7eb),
    inset 0 -1px 0 var(--table-border, #e5e7eb),
    inset 0 1px 0 var(--table-border, #e5e7eb);
}

/* Compact, stable column widths — prevents expand/collapse from inflating cells.
   :not([colspan]) excludes parent group headers (E-X, tagName) so they auto-size
   to the sum of their leaf columns. */
table.sp-attack-table th.sp-col:not([colspan]),
table.sp-attack-table td.sp-col:not([colspan]) {
  min-width: 56px;
  box-sizing: border-box;
  word-break: keep-all;
}

/* Body cells hold short numeric values — cap them to keep columns compact */
table.sp-attack-table td.sp-col:not([colspan]) {
  max-width: 56px;
  overflow: hidden;
}

/* Header tag-pill cells: let the column grow just enough to fit pill labels */
table.sp-attack-table thead th.sp-col:not([colspan]) {
  white-space: nowrap;
}

/* Collapsed group placeholders: keep the whole column group minimal */
table.sp-attack-table th.sp-col-collapsed,
table.sp-attack-table td.sp-col-collapsed {
  width: 16px !important;
  min-width: 16px !important;
  max-width: 16px !important;
  padding: 0 !important;
}
</style>
