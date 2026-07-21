<template>
  <colgroup>
    <col v-for="(width, index) in widths" :key="index" :style="{ width: `${width}px` }" />
  </colgroup>
</template>

<script setup lang="ts">
// ヘッダ用テーブルと本体用テーブルに同じ列幅を与えるための colgroup。
// 表を2つに分けた以上、列幅は内容任せ(auto)にできないので、
// 両方のテーブルがこの同じ幅の配列を描画することで列を揃える。
defineProps<{
  widths: readonly number[]
}>()
</script>
