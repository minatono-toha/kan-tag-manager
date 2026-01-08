<template>
  <BaseShipModal
    :visible="true"
    width="md"
    title="出力先を選択"
    :close-on-overlay="false"
    :show-default-footer="false"
  >
    <p class="text-sm text-gray-600 mb-6">
      CSVから取り込んだ艦船データをどこに出力しますか？
      <br>
      <span class="text-xs text-red-500">※「上書き」を選択すると、現在のタブの所持数データがCSVの内容で置き換わります。</span>
    </p>

    <template #footer>
      <div class="flex flex-col gap-3">
        <button
          @click="$emit('select', 'overwrite')"
          class="w-full py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300 rounded text-center transition-colors"
        >
          現在のタブに上書き
        </button>
        <button
          @click="$emit('select', 'new')"
          class="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 rounded text-center transition-colors"
        >
          新規データセットに出力
        </button>
        <div class="border-t border-gray-200 my-1"></div>
        <button
          @click="$emit('cancel')"
          class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 rounded text-center transition-colors"
        >
          キャンセル
        </button>
      </div>
    </template>
  </BaseShipModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseShipModal from '@/components/common/BaseShipModal.vue'

export default defineComponent({
  name: 'CsvImportDestinationModal',
  components: {
    BaseShipModal
  },
  emits: ['select', 'cancel']
})
</script>
