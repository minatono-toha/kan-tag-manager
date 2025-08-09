<template>
  <tbody>
    <tr v-for="ship in sortedShips" :key="ship.orig" :style="rowStyle">
      <td
        v-for="map in sortedEventMaps"
        v-if="expandedStages[map.stageNum]"
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { ShipWithSpAttack, Event } from '@/types/interfaces'

export default defineComponent({
  name: 'AttackTableBody',
  props: {
    sortedShips: Array as () => ShipWithSpAttack[],
sortedEventMaps: Array as () => Event[],
expandedStages: Object,
rowStyle: Object,
getCellStyle: Function,
} as AttackTableBodyProps,
  },
})
</script>
