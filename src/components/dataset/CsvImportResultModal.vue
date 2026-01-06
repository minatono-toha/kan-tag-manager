<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl p-6 w-[500px] max-h-[80vh] flex flex-col">
      <h3 class="text-lg font-bold text-gray-800 mb-2">取り込み結果</h3>

      <div class="mb-4">
        <div class="text-sm text-gray-700">総件数: <span class="font-bold">{{ total }}</span> 件</div>
        <div class="text-sm text-green-600">正常取り込み: <span class="font-bold">{{ success }}</span> 件</div>
        <div class="text-sm text-red-600">除外 (未登録): <span class="font-bold">{{ excluded.length }}</span> 件</div>
      </div>

      <div v-if="excluded.length > 0" class="flex-1 overflow-y-auto border border-gray-200 rounded bg-gray-50 p-2 mb-4">
        <div class="text-xs text-gray-500 font-medium mb-1">除外されたエントリ一覧:</div>
        <ul class="text-xs text-red-500 font-mono">
          <li v-for="(item, index) in excluded" :key="index">{{ item }}</li>
        </ul>
      </div>
      <div v-else class="mb-4 text-sm text-gray-500">
        すべて正常に取り込まれました。
      </div>

      <button
        @click="$emit('close')"
        class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
      >
        閉じる
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'CsvImportResultModal',
  props: {
    total: { type: Number, required: true },
    success: { type: Number, required: true },
    excluded: { type: Array as PropType<string[]>, required: true }
  },
  emits: ['close']
})
</script>
