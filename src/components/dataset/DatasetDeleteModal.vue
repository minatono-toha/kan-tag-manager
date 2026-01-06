<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
    <div
      class="rounded-lg shadow-lg p-6 w-96 transition-colors duration-200"
      :class="theme !== 'light' ? 'bg-gray-800' : 'bg-white'"
      @click.stop
    >
      <h3
        class="text-lg font-medium mb-2"
        :class="theme !== 'light' ? 'text-white' : 'text-gray-900'"
      >
        データセットの削除
      </h3>

      <p
        class="text-sm mb-6"
        :class="theme !== 'light' ? 'text-gray-300' : 'text-gray-600'"
      >
        このデータセットを削除してもよろしいですか？<br>
        この操作は取り消せません。
      </p>

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
    </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DatasetDeleteModal',
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
