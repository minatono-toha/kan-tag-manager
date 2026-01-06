<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96" @click.stop>
      <h3 class="text-lg font-medium text-gray-900 mb-2">データセットの切り替え</h3>

      <p class="text-sm text-gray-600 mb-6">
        データセットを切り替えますか？<br>
        ページがリロードされます。
      </p>

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
          @click="$emit('confirm')"
          class="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          切り替え
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DatasetSwitchModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'confirm']
})
</script>
