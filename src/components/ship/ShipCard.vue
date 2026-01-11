<template>
  <div
    class="p-2 border rounded shadow cursor-pointer transition-colors"
    :class="cardClass"
  >
    <img
      v-if="showBanner"
      :src="`${baseUrl}img/ship/banner/${ship.bannerId}.png`"
      alt="バナー"
      class="w-full h-auto"
      @click="$emit('openCard', ship.bannerId)"
    />
    <p class="text-center mt-1 text-sm" @click="$emit('select', ship.orig)">
      {{ ship.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Ship } from '@/types/interfaces'
import { useTheme } from '@/composables/useTheme'

const props = defineProps<{
  ship: Ship
  showBanner?: boolean
}>()

const { theme } = useTheme()

const cardClass = computed(() => {
  if (theme.value === 'dark' || theme.value === 'gradient') {
    return 'hover:bg-gray-600 border-gray-600 text-gray-100 bg-gray-800'
  }
  return 'hover:bg-blue-50 border-gray-200 bg-white'
})

const showBanner = props.showBanner ?? true
const baseUrl = import.meta.env.BASE_URL
defineEmits<{
  (e: 'select', orig: number): void
  (e: 'openCard', bannerId: number): void
}>()
</script>
