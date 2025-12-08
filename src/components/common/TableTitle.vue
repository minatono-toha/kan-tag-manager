<template>
  <div
    class="relative inline-block"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <h2
      class="text-xl font-bold mb-2 cursor-help border-b-2 border-dotted border-gray-400 inline-block hover:text-blue-600 transition-colors select-none"
    >
      {{ title }}
    </h2>
    <div
      v-if="isVisible"
      class="absolute left-0 top-full mt-1 z-50 w-80 bg-gray-100 border border-gray-200 rounded-lg shadow-xl p-4 text-sm font-normal text-left"
      @click.stop
    >
      <TableAnnotations :type="type" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import TableAnnotations from './TableAnnotations.vue'

defineProps<{
  title: string
  type: 'ship' | 'attack' | 'tag'
}>()

const isVisible = ref(false)
const isLocked = ref(false) // Lock popup open on click

const onMouseEnter = () => {
  if (!isLocked.value) {
    isVisible.value = true
  }
}

const onMouseLeave = () => {
  if (!isLocked.value) {
    isVisible.value = false
  }
}

const closePopup = () => {
  isLocked.value = false
  isVisible.value = false
}

const onClick = (event: MouseEvent) => {
  // Stop propagation to prevent immediate closing by window listener
  event.stopPropagation()

  if (isLocked.value) {
    // If locked, click unlocks and hides
    closePopup()
  } else {
    // If not locked, click locks it open
    isVisible.value = true
    isLocked.value = true
  }
}

// Watch isLocked to add/remove global click listener
watch(isLocked, (newValue) => {
  if (newValue) {
    window.addEventListener('click', closePopup)
  } else {
    window.removeEventListener('click', closePopup)
  }
})

onUnmounted(() => {
  window.removeEventListener('click', closePopup)
})
</script>

<style scoped>
/* Optional: slightly nicer shadow or transition if needed */
</style>
