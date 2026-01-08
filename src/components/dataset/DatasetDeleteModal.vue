<template>
  <BaseShipModal
    :visible="visible"
    :theme="theme"
    title="データセットの削除"
    @close="$emit('close')"
    @confirm="$emit('confirm')"
    confirm-text="削除"
    confirm-variant="danger"
  >
    <p
      class="text-sm mb-2"
      :class="theme !== 'light' ? 'text-gray-300' : 'text-gray-600'"
    >
      このデータセットを削除してもよろしいですか？<br>
      この操作は取り消せません。
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
          class="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          削除
        </button>
      </div>
    </template>
  </BaseShipModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseShipModal from '@/components/common/BaseShipModal.vue'

export default defineComponent({
  name: 'DatasetDeleteModal',
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
