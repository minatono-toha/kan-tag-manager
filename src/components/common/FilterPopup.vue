<template>
  <div
    v-if="show"
    ref="popupRef"
    class="fixed bg-white border border-gray-300 shadow-lg rounded p-3 z-[100]"
    :class="{ 'max-h-80 overflow-y-auto': type === 'checkbox' }"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
    @click.stop
  >
    <div class="font-bold mb-2 text-sm">{{ title }}</div>

    <!-- Radio type (boolean or custom options) -->
    <div v-if="type === 'radio'" key="radio-content" class="space-y-2">
      <template v-if="options && options.length > 0">
        <label
          v-for="option in options"
          :key="option"
          class="flex items-center cursor-pointer"
        >
          <input
            type="radio"
            :value="option"
            v-model="tempValue"
            class="mr-2"
          />
          <span class="text-sm font-normal">{{ option }}</span>
        </label>
      </template>
      <template v-else>
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :value="true"
            v-model="tempValue"
            class="mr-2"
          />
          <span>選択済</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :value="false"
            v-model="tempValue"
            class="mr-2"
          />
          <span>未選択</span>
        </label>
      </template>
      <div class="flex items-center justify-between mt-2">
        <button
          @click="handleClear"
          class="text-xs text-gray-500 hover:underline"
        >
          クリア
        </button>
        <button
          @click="handleApply"
          class="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>

    <!-- Checkbox type (multi-select) -->
    <div v-if="type === 'checkbox'" key="checkbox-content">
      <div class="space-y-1">
        <label
          v-for="option in options"
          :key="option"
          class="flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            :value="option"
            v-model="tempValue"
            class="mr-2"
          />
          <span class="text-sm font-normal">{{ option }}</span>
        </label>
        <label v-if="includeEmpty" class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            v-model="tempValue"
            class="mr-2"
          />
          <span class="text-sm font-normal">(空白)</span>
        </label>
        <div class="flex items-center justify-between mt-2">
          <button
            @click="handleClear"
            class="text-xs text-gray-500 hover:underline"
          >
            クリア
          </button>
          <button
            @click="handleApply"
            class="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Input type (text search) -->
    <div v-if="type === 'input'" key="input-content">
      <input
        type="text"
        v-model="tempValue"
        @keyup.enter="handleApply"
        class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        :placeholder="placeholder || '検索...'"
      />
      <div class="flex items-center justify-between mt-2">
        <button
          @click="handleClear"
          class="text-xs text-gray-500 hover:underline"
        >
          クリア
        </button>
        <button
          @click="handleApply"
          class="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  show: boolean
  position: { x: number; y: number }
  type: 'radio' | 'checkbox' | 'input'
  title: string
  modelValue: boolean | null | string[] | string
  options?: string[]
  includeEmpty?: boolean
  placeholder?: string
}>(), {
  includeEmpty: false,
  placeholder: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | null | string[] | string): void
  (e: 'close'): void
  (e: 'apply', value: boolean | null | string[] | string): void
  (e: 'clear'): void
}>()

const popupRef = ref<HTMLElement | null>(null)
const tempValue = ref<boolean | null | string[] | string>(props.modelValue)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newVal) => {
  tempValue.value = newVal
}, { deep: true })

// Watch for show changes to reset temp value
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Initialize temp value when popup opens
    if (props.type === 'checkbox' && Array.isArray(props.modelValue)) {
      tempValue.value = [...props.modelValue]
    } else if (props.type === 'input') {
      tempValue.value = typeof props.modelValue === 'string' ? props.modelValue : ''
    } else {
      tempValue.value = props.modelValue
    }
  }
})

const handleApply = () => {
  emit('apply', tempValue.value)
  emit('close')
}

const handleClear = () => {
  if (props.type === 'radio') {
    tempValue.value = (props.options && props.options.length > 0) ? '' : null
  } else if (props.type === 'checkbox') {
    tempValue.value = []
  } else {
    tempValue.value = ''
  }
  emit('clear')
  emit('close')
}

defineExpose({
  popupRef
})
</script>
