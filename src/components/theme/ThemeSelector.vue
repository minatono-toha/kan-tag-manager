<template>
  <div class="theme-selector flex gap-2">
    <button
      @click="setTheme('light')"
      class="theme-button"
      :class="{ active: currentTheme === 'light' }"
      title="ライトモード"
      aria-label="ライトモード"
    >
      <div class="theme-square theme-square-white border-2 border-gray-400"></div>
    </button>
    <button
      @click="setTheme('dark')"
      class="theme-button"
      :class="{ active: currentTheme === 'dark' }"
      title="ダークモード"
      aria-label="ダークモード"
    >
      <div class="theme-square bg-black"></div>
    </button>
    <button
      @click="setTheme('gradient')"
      class="theme-button"
      :class="{ active: currentTheme === 'gradient' }"
      title="グラデーションモード"
      aria-label="グラデーションモード"
    >
      <div class="theme-square bg-gradient-navy"></div>
    </button>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  currentTheme: 'light' | 'dark' | 'gradient'
}>()

const emit = defineEmits<{
  (e: 'theme-change', theme: 'light' | 'dark' | 'gradient'): void
}>()

const setTheme = (theme: 'light' | 'dark' | 'gradient') => {
  emit('theme-change', theme)
}
</script>

<style scoped>
.theme-selector {
  display: flex;
  gap: 0.5rem;
}

.theme-button {
  padding: 2px;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.theme-button:hover {
  border-color: rgba(99, 102, 241, 0.5);
}

.theme-button.active {
  border-color: rgb(99, 102, 241);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.theme-square {
  width: 14px;
  height: 14px;
  border-radius: 2px;
}

.theme-square-white {
  background-color: white !important;
}

.bg-gradient-navy {
  background: linear-gradient(135deg, #1e3a8a 0%, #000000 100%);
}
</style>
