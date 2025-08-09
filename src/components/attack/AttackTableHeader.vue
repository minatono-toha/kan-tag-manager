<template>
  <thead class="bg-gray-100" :style="headerStyle">
    <tr>
      <th
        v-for="(group, index) in groupedStageNums"
        :key="'stageNum_' + index"
        :colspan="group?.count || 1"
        :style="cellStyle"
        class="border sp-col text-center bg-blue-50 cursor-pointer"
        @click="$emit('toggleStage', group?.stageNum)"
      >
        {{ group ? 'E-' + group.stageNum : 'E-?' }}
      </th>
    </tr>
    <tr v-if="anyStageExpanded">
      <th
        v-for="map in sortedEventMaps"
        :key="map?.mapId"
        :style="cellStyle"
        class="border sp-col text-center cursor-pointer"
        @click="$emit('sortBy', `mapId_${map?.mapId}`)"
      >
        {{ map?.stage ?? 'Unknown' }}
        <span v-if="sortKey === `mapId_${map?.mapId}`">
          {{ sortOrder === 'asc' ? '▲' : '▼' }}
        </span>
      </th>
    </tr>
  </thead>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { Event } from '@/types/interfaces'

interface GroupedStage {
  stageNum: number
  count: number
}

export default defineComponent({
  name: 'AttackTableHeader',
  props: {
    groupedStageNums: {
  type: Array as PropType<GroupedStage[]>,
  required: true,
} as AttackTableHeaderProps['groupedStageNums'],
    },
    headerStyle: {
      type: Object as PropType<Partial<CSSStyleDeclaration>>,
      required: false,
      default: () => ({}),
    },
  },
  emits: ['toggleStage', 'sortBy'],
})
</script>
