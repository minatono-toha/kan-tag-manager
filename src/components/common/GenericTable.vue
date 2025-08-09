<template>
  <table class="w-full border-collapse border border-gray-300 text-sm">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key" class="border bg-gray-100 text-left px-2 py-1">
          {{ col.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item[rowKey]" class="hover:bg-gray-100 cursor-pointer">
        <td v-for="col in columns" :key="col.key" class="border px-2 py-1">
          <slot :name="col.key" :item="item">
            {{ item[col.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface ColumnDef {
  label: string
  key: string
}

const props = defineProps<{
  columns: ColumnDef[]
  items: any[]
  rowKey: string
}>()
</script>
