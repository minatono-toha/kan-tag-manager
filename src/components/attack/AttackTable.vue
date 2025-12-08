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
                    class="border sp-col text-center cursor-pointer align-top bg-gray-100"
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
                    class="border sp-col text-center align-top bg-gray-100"
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
                    class="border sp-col text-center align-top bg-gray-100"
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
          <tr v-if="!selectedEventId || sortedShips.length === 0">
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
import { defineComponent, ref, computed, watch, onMounted, onUnmounted, nextTick, toRefs } from 'vue'
import { TABLE_STYLE } from '@/constants/tableStyle'
import type { Ship, Event } from '@/types/interfaces'
import { useAttackData } from '@/composables/useAttackData'

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

    const theadRef = ref<HTMLElement | null>(null)
    let resizeObserver: ResizeObserver | null = null

    const emitHeaderHeight = () => {
      if (theadRef.value) {
        emit('header-height-change', theadRef.value.getBoundingClientRect().height)
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
      sortByMode,
      toggleSortMode,
      tagGroups,
      toggleTag,
      isTagExpanded,
      totalColspan,
      emptyStateMessage,
      TABLE_STYLE,
      toggleAllStages,
      isAllExpanded,
    }
  },
})
</script>

<style scoped>
/* Force opaque borders */
table, th, td {
  border-color: #d1d5db !important; /* Tailwind gray-300 equivalent */
}
</style>
