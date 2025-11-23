<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-2">艦船情報</h2>
    <div v-if="loading">読み込み中...</div>
    <table v-else class="w-full text-sm border-collapse border border-gray-300">
      <thead class="bg-gray-100" :style="headerStyle">
        <tr>
          <th :style="cellStyle" class="border text-left align-bottom">図鑑ID</th>
          <th :style="cellStyle" class="border text-left align-bottom">艦名</th>
          <th :style="cellStyle" class="border text-left align-bottom">艦型・艦番</th>
          <th :style="cellStyle" class="border text-left align-bottom">艦種</th>
          <th :style="cellStyle" class="border text-left align-bottom">速力</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ship in props.ships"
          :key="ship.id"
          :style="rowStyle"
          class="hover:bg-gray-100 cursor-pointer"
          @click="openModal(ship.orig)"
        >
          <td :style="cellStyle" class="border">{{ ship.libraryId }}</td>
          <td :style="cellStyle" class="border">{{ ship.name }}</td>
          <td :style="cellStyle" class="border">{{ ship.class }}</td>
          <td :style="cellStyle" class="border">{{ ship.shipType }}</td>
          <td :style="cellStyle" class="border">{{ ship.speed }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Ship } from '@/types/interfaces'
import { TABLE_STYLE } from '@/constants/tableStyle'

const props = defineProps<{
  ships: Ship[]
  loading?: boolean
  targetHeaderHeight?: number
}>()

const emit = defineEmits<{
  (e: 'select', orig: number): void
}>()

function openModal(orig: number) {
  emit('select', orig)
}

const rowStyle = {
  height: `${TABLE_STYLE.rowHeight}px`,
  fontSize: TABLE_STYLE.fontSize,
}

const cellStyle = {
  padding: TABLE_STYLE.padding,
  whiteSpace: TABLE_STYLE.whiteSpace,
}

const headerStyle = computed(() => ({
  height: props.targetHeaderHeight ? `${props.targetHeaderHeight}px` : `${TABLE_STYLE.headerHeight}px`,
  fontSize: TABLE_STYLE.fontSize,
}))
</script>

<style scoped></style>
