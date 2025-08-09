<template>
  <ul class="list-none p-0 m-0">
    <li v-for="item in items" :key="item[itemKey]" class="p-2 border-b">
      <slot :item="item">
        {{ item[itemLabel] }}
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  items: any[]
  itemKey: string
  itemLabel: string
}>()
</script>
