<template>
  <li class="p-2 border rounded shadow hover:bg-gray-100 cursor-pointer">
    <ShipImage
      v-if="showBanner"
      :src="`${baseUrl}img/ship/banner/${ship.bannerId}.png`"
      alt="バナー"
      imgClass="w-full h-auto"
      @click="$emit('openCard', ship.bannerId)"
    />
    <p class="text-center mt-1 text-sm" @click="$emit('select', ship.orig)">
      {{ ship.name }}
    </p>
  </li>
</template>

<script setup lang="ts">
import type { Ship } from '@/types/interfaces'
import ShipImage from './ShipImage.vue'

const props = defineProps<ShipCardProps>()
const showBanner = props.showBanner ?? true
const baseUrl = import.meta.env.BASE_URL
defineEmits<{
  (e: 'select', orig: number): void
  (e: 'openCard', bannerId: number): void
}>()
</script>
