<template>
  <BaseShipModal
    :visible="visible"
    :theme="theme"
    title="データセットの切り替え"
    @close="$emit('close')"
    @confirm="$emit('confirm')"
    confirm-text="切り替え"
  >
    <p
      class="text-sm mb-2"
      :class="theme !== 'light' ? 'text-gray-300' : 'text-gray-600'"
    >
      データセットを切り替えますか？<br>
      ページがリロードされます。
    </p>

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
          @click="$emit('confirm')"
          class="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          切り替え
        </button>
      </div>
    </template>
  </BaseShipModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseShipModal from '@/components/common/BaseShipModal.vue'

export default defineComponent({
  name: 'DatasetSwitchModal',
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
    }
  },
  emits: ['close', 'confirm']
})
</script>
