<template>
  <div>
    <!-- ヘッダ行は縦スクロールしないヘッダ帯へ送る。3表のヘッダが同じ flex 行に並ぶので
         高さがブラウザ側で自動的に揃い、実測して配り直す必要がない。
         送り先が無いとき(単体テスト等)はその場に描画する。 -->
    <Teleport :to="headerTarget || 'body'" :disabled="!headerTarget" defer>
      <!-- ヘッダは内容に合わせて自動で幅が決まる。ここで決まった列幅を本体へ渡す。 -->
      <table class="sp-attack-table sp-attack-table--header text-sm" ref="headerTableRef">
        <thead class="bg-gray-100" :style="headerStyle">
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
                <span class="sp-caret">{{ isExpanded(group.stageNum) ? '▾' : '▸' }}</span>
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
                <span class="sp-caret">{{ isTagExpanded(group.tagId) ? '▾' : '▸' }}</span>
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
      </table>
    </Teleport>

    <div v-if="loading">読み込み中...</div>
    <div v-else>
      <!-- 本体の列幅はヘッダから受け取る(本体のセルは必ず小数点2桁の数値なので、
           幅はヘッダ側だけで決まる)。未計測のうちは自動幅で描く。 -->
      <table class="sp-attack-table text-sm" :style="bodyTableStyle">
        <TableColgroup v-if="bodyColumnWidths.length" :widths="bodyColumnWidths" />
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
          <!-- 該当なしの行も通常の行と同じ高さにする(他の2表と行がずれるため、
               余白を足して高くしない) -->
          <tr v-if="!selectedEventId" :style="emptyRowStyle">
            <td :colspan="totalColspan" :style="bodyCellStyle" class="border text-center text-gray-500">
              海域を選択してください
            </td>
          </tr>
          <tr v-else-if="sortedShips.length === 0" :style="emptyRowStyle">
            <td :colspan="totalColspan" :style="bodyCellStyle" class="border text-center text-gray-500">
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
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  toRefs,
} from 'vue'
import type { CSSProperties } from 'vue'
import { TABLE_STYLE } from '@/constants/tableStyle'
import { distributeSpanWidth } from '@/constants/attackColumns'
import type { Event, ExpandedShip } from '@/types/interfaces'
import { useAttackData } from '@/composables/useAttackData'
import { contrastingTextColor } from '@/utils/color'
import TableColgroup from '@/components/common/TableColgroup.vue'
import FleetGuidePopup from './FleetGuidePopup.vue'

export default defineComponent({
  name: 'AttackTable',
  components: { FleetGuidePopup, TableColgroup },
  props: {
    filteredUniqueOrigs: {
      type: Array as () => ExpandedShip[],
      required: true,
    },
    selectedEventId: {
      type: Number,
      required: true,
    },
    // ヘッダ行の送り先(ヘッダ帯)のセレクタ。未指定ならヘッダをその場に描画する。
    headerTarget: {
      type: String,
      default: null,
    },
  },
  emits: ['update-sorted-ships', 'loading', 'update-sort-mode', 'update-is-all-expanded'],
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

    // 列幅は固定にすると札名が重なるので、ヘッダ側は内容に合わせた自動幅のままにする。
    // 表を2つに分けている以上その幅は本体に伝わらないので、ヘッダで決まった列幅を
    // 実測して本体へ渡す。本体のセルは必ず小数点2桁の数値で、幅を押し広げることが
    // ないため、これは「ヘッダ → 本体」の一方向で完結する(測り合うループにならない)。
    const headerTableRef = ref<HTMLTableElement | null>(null)
    const bodyColumnWidths = ref<number[]>([])

    const bodyTableStyle = computed<CSSProperties>(() =>
      bodyColumnWidths.value.length
        ? {
            tableLayout: 'fixed',
            width: `${bodyColumnWidths.value.reduce((total, w) => total + w, 0)}px`,
          }
        : {},
    )

    // 海域ラベルの行(area/tag どちらのモードでも thead の2行目)は、展開中のグループが
    // 1海域=1セル、折りたたみ中のグループが colspan でまとめた1セルになっている。
    // これを列単位にほどくと、本体の列と1対1で対応する幅の並びが得られる。
    const measureHeaderColumns = () => {
      const row = headerTableRef.value?.tHead?.rows[1]
      if (!row) return

      const widths: number[] = []
      for (const cell of Array.from(row.cells)) {
        const width = cell.getBoundingClientRect().width
        if (width <= 0) return // 非表示中は測れないので、その回は見送る
        widths.push(...distributeSpanWidth(width, cell.colSpan || 1))
      }

      const current = bodyColumnWidths.value
      const unchanged =
        widths.length === current.length &&
        widths.every((w, i) => Math.abs(w - current[i]) < 0.5)
      if (!unchanged) bodyColumnWidths.value = widths
    }

    let headerObserver: ResizeObserver | null = null

    // 並べ替えや展開/格納でヘッダの列構成が変わったら測り直す
    watch([sortByMode, expandedStageNums, tagGroups, stageGroups], () => {
      nextTick(measureHeaderColumns)
    })

    onMounted(() => {
      // fetchAllSpAttackData is called by watcher in composable or manually?
      // In composable:
      // watch(() => selectedEventId.value, () => { if (selectedEventId.value) fetchAllSpAttackData() })
      // But we also need to call it initially if selectedEventId is already set.
      if (selectedEventId.value) {
        fetchAllSpAttackData()
      }

      if (headerTableRef.value) {
        headerObserver = new ResizeObserver(measureHeaderColumns)
        headerObserver.observe(headerTableRef.value)
      }
      nextTick(measureHeaderColumns)
      // 日本語フォントの読み込みで札名の幅が変わるため、確定後にもう一度測る
      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(measureHeaderColumns)
      }
    })

    onUnmounted(() => {
      headerObserver?.disconnect()
      headerObserver = null
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
    // 表本体は縦方向の余白を詰める(タイトル行は cellStyle のまま)
    const bodyCellStyle = {
      padding: TABLE_STYLE.bodyPadding,
      whiteSpace: TABLE_STYLE.whiteSpace,
    }
    const headerStyle = {
      fontSize: TABLE_STYLE.fontSize,
    }
    // 該当なしの行。通常の行と同じ高さにして、他の2表と行がずれないようにする。
    const emptyRowStyle = {
      ...rowStyle,
      height: `${TABLE_STYLE.rowHeight}px`,
      boxSizing: 'border-box' as const,
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
        ...bodyCellStyle,
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
      bodyCellStyle,
      headerStyle,
      emptyRowStyle,
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
      headerTableRef,
      bodyColumnWidths,
      bodyTableStyle,
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
/* overflow:hidden は使わない。祖先に overflow が付くと子孫の position:sticky が
   効かなくなり、ヘッダのスクロール固定が死ぬため。
   罫線はすべて inset shadow で描くので、border-collapse は separate + spacing 0 で足りる
   (collapse は sticky なヘッダで罫線が消える不具合があるため避ける)。 */
table.sp-attack-table {
  border-collapse: separate;
  border-spacing: 0;
  border: 0 !important;
  box-shadow: 0 0 0 1px var(--table-border, #e5e7eb);
}

/* 罫線は inset shadow で描く。外周は表の box-shadow が1本引いているので、
   端の列・端の行では引かない(引くと外枠だけ2pxになり他の表と太さが揃わない)。
   2本を別々のカスタムプロパティに分けて、規則ごとの詳細度を気にせず合成する。 */
table.sp-attack-table th,
table.sp-attack-table td {
  border: 0 !important;
  box-shadow:
    var(--cell-bottom, 0 0 0 0 transparent),
    var(--cell-right, 0 0 0 0 transparent);
}

table.sp-attack-table th:not(:last-child),
table.sp-attack-table td:not(:last-child) {
  --cell-right: inset -1px 0 0 var(--table-border, #e5e7eb);
}

table.sp-attack-table thead tr:not(:last-child) th,
table.sp-attack-table tbody tr:not(:last-child) td {
  --cell-bottom: inset 0 -1px 0 var(--table-border, #e5e7eb);
}

/* ヘッダは内容に合わせて幅が決まる。札名を折り返さないので文字が重ならない。
   ここで決まった列幅を実測して本体の colgroup に渡している。 */
table.sp-attack-table--header {
  table-layout: auto;
  width: auto;
}

table.sp-attack-table th.sp-col {
  white-space: nowrap;
  word-break: keep-all;
}

/* 本体のセルは必ず小数点2桁の数値なので、列幅を押し広げることはない */
table.sp-attack-table td.sp-col {
  overflow: hidden;
  box-sizing: border-box;
  word-break: keep-all;
}

/* 展開・格納の三角。見出し文字に対して小さすぎると気付かれないので大きく出す。 */
.sp-caret {
  font-size: 20px;
  line-height: 0.8;
  margin-left: 4px;
  vertical-align: -3px;
}

/* 折りたたんだ海域グループのプレースホルダ。中身が無いので、
   見出し(E-1 等)が読める幅をヘッダ側で確保する。 */
table.sp-attack-table--header th.sp-col-collapsed {
  min-width: 100px;
}

table.sp-attack-table th.sp-col-collapsed,
table.sp-attack-table td.sp-col-collapsed {
  padding: 0 !important;
}
</style>
