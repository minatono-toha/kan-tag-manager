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
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold text-sm"
              ref="okButton"
            >
              {{ confirmText }}
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
import { ref, toRef, watch } from 'vue'
import { useFocusTrap } from '@/composables/useFocusTrap'

const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  message: string
  type?: 'confirm' | 'alert'
  confirmText?: string
  cancelText?: string
}>(), {
  title: '',
  type: 'confirm',
  confirmText: 'OK',
  cancelText: 'キャンセル'
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

const getFocusable = (): HTMLElement[] =>
  (props.type === 'confirm'
    ? [cancelButton.value, okButton.value]
    : [closeButton.value]
  ).filter((el): el is HTMLElement => !!el)

useFocusTrap(toRef(props, 'show'), {
  getFocusable,
  onEscape: handleCancel,
  onEnter: () => (props.type === 'alert' ? handleCancel() : handleConfirm()),
})

watch(() => props.show, (isOpen) => {
  if (!isOpen) return
  setTimeout(() => {
    const focusable = getFocusable()
    if (focusable.length === 0) return
    const defaultFocus = props.type === 'confirm' ? okButton.value : closeButton.value
    defaultFocus?.focus()
  }, 0)
})
</script>
