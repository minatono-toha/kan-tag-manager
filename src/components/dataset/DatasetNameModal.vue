<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96" @click.stop>
      <h3 class="text-lg font-medium text-gray-900 mb-4">新規データセット作成</h3>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">データセット名</label>
        <input
          ref="inputRef"
          v-model="name"
          type="text"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="名前を入力"
          @keyup.enter="handleConfirm"
        />
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          キャンセル
        </button>
        <button
          type="button"
          @click="handleConfirm"
          :disabled="!name.trim()"
          class="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          作成
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue'

export default defineComponent({
  name: 'DatasetNameModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const name = ref('')
    const inputRef = ref<HTMLInputElement | null>(null)

    watch(() => props.visible, (val) => {
      if (val) {
        name.value = ''
        nextTick(() => {
          inputRef.value?.focus()
        })
      }
    })

    const handleConfirm = () => {
      if (!name.value.trim()) return
      emit('confirm', name.value.trim())
      name.value = ''
    }

    return {
      name,
      inputRef,
      handleConfirm
    }
  }
})
</script>
