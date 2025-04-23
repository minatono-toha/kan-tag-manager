<template>
  <li class="p-2 border rounded shadow hover:bg-gray-100 cursor-pointer">
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
  </li>
</template>

<script setup lang="ts">
import type { Ship } from '@/types/interfaces'

const props = defineProps<{
  ship: Ship
  showBanner?: boolean
}>()

const showBanner = props.showBanner ?? true
const baseUrl = import.meta.env.BASE_URL
defineEmits<{
  (e: 'select', orig: number): void
  (e: 'openCard', bannerId: number): void
}>()
</script>
