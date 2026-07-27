<template>
  <BaseShipModal
    :visible="true"
    width="lg"
    title="艦種を選択してください"
    :close-on-overlay="false"
    :show-default-footer="false"
    @cancel="$emit('cancel')"
  >
    <p class="text-sm text-gray-600">
      <span class="font-medium text-gray-800">{{ prompt.name }}</span>
      は艦これ上では同じ艦名ですが、艦種によって見え方が変わるため別の形態として管理しています。
      <br />
      取り込む艦種を選択してください。
    </p>
    <p v-if="prompt.total > 1" class="mt-3 text-xs text-gray-500">
      {{ prompt.name }} は {{ prompt.total }} 隻あります（{{ prompt.index }} 隻目の選択）。
    </p>

    <template #footer>
      <div class="flex flex-col gap-3">
        <button
          v-for="candidate in prompt.candidates"
          :key="candidate.bannerId"
          @click="$emit('select', candidate.bannerId)"
          class="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 rounded text-center transition-colors"
        >
          {{ candidate.shipType }}
          <span class="text-xs text-blue-600">({{ candidateNote(candidate) }})</span>
        </button>
        <div class="border-t border-gray-200 my-1"></div>
        <button
          @click="$emit('cancel')"
          class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 rounded text-center transition-colors"
        >
          取り込みをキャンセル
        </button>
      </div>
    </template>
  </BaseShipModal>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import BaseShipModal from '@/components/common/BaseShipModal.vue'
import { normalizeShipName, type AmbiguousShipPrompt } from '@/utils/ambiguousShips'
import type { Ship } from '@/types/interfaces'

export default defineComponent({
  name: 'AmbiguousShipSelectModal',
  components: {
    BaseShipModal,
  },
  props: {
    prompt: {
      type: Object as PropType<AmbiguousShipPrompt>,
      required: true,
    },
  },
  emits: ['select', 'cancel'],
  setup(props) {
    // 候補の艦名がすべて同じ(宗谷 等)なら艦名では区別できないので改装段階を添える。
    const sameName = computed(() => {
      const names = new Set(props.prompt.candidates.map((c) => normalizeShipName(c.name || '')))
      return names.size === 1
    })

    const candidateNote = (candidate: Ship) =>
      sameName.value ? `改装段階:${candidate.updateLevel}` : candidate.name

    return { candidateNote }
  },
})
</script>
