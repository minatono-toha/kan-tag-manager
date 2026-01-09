<template>
  <BaseShipModal
    :visible="visible"
    :theme="theme"
    :title="title"
    @close="$emit('close')"
    @confirm="handleConfirm"
    :confirm-disabled="!name.trim()"
    :confirm-text="confirmText"
  >
    <div class="mb-4">
      <label
        class="block text-sm font-medium mb-1"
        :class="theme !== 'light' ? 'text-gray-300' : 'text-gray-700'"
      >
        データセット名
      </label>
      <input
        ref="inputRef"
        v-model="name"
        type="text"
        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        :class="theme !== 'light' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'"
        placeholder="名前を入力"
        @keyup.enter="handleConfirm"
      />
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm rounded-md transition-colors"
          :class="theme !== 'light' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'"
        >
          キャンセル
        </button>
        <button
          type="button"
          @click="handleConfirm"
          :disabled="!name.trim()"
          class="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ confirmText }}
        </button>
      </div>
    </template>
  </BaseShipModal>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue'
import BaseShipModal from '@/components/common/BaseShipModal.vue'

export default defineComponent({
  name: 'DatasetNameModal',
  components: {
    BaseShipModal
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      default: 'light'
    },
    title: {
      type: String,
      default: '新規データセット作成'
    },
    confirmText: {
      type: String,
      default: '作成'
    },
    initialName: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const name = ref('')
    const inputRef = ref<HTMLInputElement | null>(null)

    watch(() => props.visible, (val) => {
      if (val) {
        name.value = props.initialName
        nextTick(() => {
          inputRef.value?.focus()
          if (props.initialName) {
            inputRef.value?.select()
          }
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
