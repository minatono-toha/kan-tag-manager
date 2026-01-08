<template>
  <BaseShipModal
    :visible="true"
    width="lg"
    title="取り込み結果"
    :z-index="1000"
    @close="$emit('close')"
    :show-default-footer="false"
  >
    <div class="mb-4">
      <div class="text-sm text-gray-700">総件数: <span class="font-bold">{{ total }}</span> 件</div>
      <div class="text-sm text-green-600">正常取り込み: <span class="font-bold">{{ success }}</span> 件</div>
      <div class="text-sm text-red-600">除外 (未登録): <span class="font-bold">{{ excluded.length }}</span> 件</div>
    </div>

    <div v-if="excluded.length > 0" class="border border-gray-200 rounded bg-gray-50 p-2 mb-4 max-h-[40vh] overflow-y-auto">
      <div class="text-xs text-gray-500 font-medium mb-1">除外されたエントリ一覧:</div>
      <ul class="text-xs text-red-500 font-mono">
        <li v-for="(item, index) in excluded" :key="index">{{ item }}</li>
      </ul>
    </div>
    <div v-else class="mb-4 text-sm text-gray-500">
      すべて正常に取り込まれました。
    </div>

    <template #footer>
      <button
        @click="$emit('close')"
        class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
      >
        閉じる
      </button>
    </template>
  </BaseShipModal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import BaseShipModal from '@/components/common/BaseShipModal.vue'

export default defineComponent({
  name: 'CsvImportResultModal',
  components: {
    BaseShipModal
  },
  props: {
    total: { type: Number, required: true },
    success: { type: Number, required: true },
    excluded: { type: Array as PropType<string[]>, required: true }
  },
  emits: ['close']
})
</script>
