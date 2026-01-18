<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-50"
      @click.self="handleCancel"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 transform transition-all"
        role="alertdialog"
        aria-modal="true"
        ref="dialogRef"
      >
        <div class="mb-4" v-if="title">
          <h3 class="text-gray-800 text-lg font-bold text-center">
            {{ title }}
          </h3>
        </div>
        <div class="mb-6">
          <p class="text-gray-700 text-sm whitespace-pre-line text-center leading-relaxed font-medium">
            {{ message }}
          </p>
        </div>
        <div class="flex justify-center gap-4">
          <template v-if="type === 'confirm'">
            <button
              @click="handleCancel"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors font-medium text-sm"
              ref="cancelButton"
            >
              キャンセル
            </button>
            <button
              @click="handleConfirm"
              class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold text-sm"
              ref="okButton"
            >
              OK
            </button>
          </template>
          <template v-else>
            <button
              @click="handleCancel"
              class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold text-sm"
              ref="closeButton"
            >
              閉じる
            </button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  message: string
  type?: 'confirm' | 'alert'
}>(), {
  title: '',
  type: 'confirm'
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const okButton = ref<HTMLElement | null>(null)
const cancelButton = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)

const handleConfirm = () => {
  emit('confirm')
  emit('update:show', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}

const getFocusableElements = (): HTMLElement[] => {
  if (props.type === 'confirm') {
    return [cancelButton.value, okButton.value].filter(el => !!el) as HTMLElement[]
  } else {
    return [closeButton.value].filter(el => !!el) as HTMLElement[]
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.show) return

  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  } else if (event.key === 'Enter' || (props.type === 'alert' && event.key === ' ')) {
    // For alert, Space/Enter closes. For confirm, Enter triggers OK unless another button is focused.
    if (props.type === 'alert') {
      event.preventDefault()
      handleCancel()
    } else if (document.activeElement !== cancelButton.value && document.activeElement !== okButton.value) {
      event.preventDefault()
      handleConfirm()
    }
  } else if (event.key === 'Tab') {
    const focusable = getFocusableElements()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
    setTimeout(() => {
      const focusable = getFocusableElements()
      if (focusable.length > 0) {
        // For confirm, default to OK button. For alert, default to Close.
        const defaultFocus = props.type === 'confirm' ? okButton.value : closeButton.value
        defaultFocus?.focus()
      }
    }, 0)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

onMounted(() => {
  if (props.show) {
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
