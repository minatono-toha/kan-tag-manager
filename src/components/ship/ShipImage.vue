<template>
  <img
    v-if="src"
    :src="src"
    :alt="alt"
    :class="imgClass"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  imgClass?: string
}>()

const emit = defineEmits<{ (e: 'click'): void }>()
function onClick() {
  emit('click')
}
</script>
