<template>
  <div class="tabs-container fixed top-0 left-0 right-0 bg-white z-10">
    <button
      class="px-3 py-1 rounded-full"
      :class="isAllSelected ? 'bg-green-500 text-white' : 'bg-gray-300'"
      @click="$emit('toggle-all')"
    >
      全選択
    </button>

    <button
      v-for="filter in filters"
      :key="filter.id"
      class="px-3 py-1 rounded-full"
      :class="selectedFilterIds.includes(filter.id) ? 'bg-blue-500 text-white' : 'bg-gray-200'"
      @click="$emit('toggle-filter', filter.id)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<ShipFilterTabsProps>()

defineEmits<{
  (e: 'toggle-filter', id: number): void
  (e: 'toggle-all'): void
}>()
</script>
