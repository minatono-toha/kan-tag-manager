<template>
  <div class="p-4 pb-0">
    <div class="flex items-center mb-2" style="min-height: 44px;">
      <h2 class="text-xl font-bold">札管理</h2>
    </div>
    <TableAnnotations type="tag" />
  </div>
</template>

<script setup lang="ts">
import TableAnnotations from '../common/TableAnnotations.vue'
</script>

<style scoped></style>
