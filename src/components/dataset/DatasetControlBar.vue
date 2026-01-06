<template>
  <div class="dataset-control-bar bg-gray-200 border-b border-gray-400 select-none transition-all duration-300 ease-in-out" :class="isExpanded ? 'py-1' : 'py-0 h-[24px] overflow-hidden'">
      <div class="flex items-center px-2 h-full">
        <!-- Toggle Button (Left Top) -->
         <button
           @click="toggleExpand"
           class="text-gray-600 hover:text-gray-900 font-bold text-lg leading-none mr-2 w-5 h-5 flex items-center justify-center"
         >
           {{ isExpanded ? '-' : '+' }}
         </button>

         <!-- Expanded Content -->
         <div v-if="isExpanded" class="flex items-center gap-2 flex-1 w-full justify-between">
            <!-- Left: Controls -->
            <div class="flex items-center gap-2 flex-1 max-w-[900px]">
                 <!-- JSON Section (Disabled for Release) -->
                 <div class="relative flex items-center gap-2 flex-1 max-w-[550px]">
                      <div class="absolute inset-0 z-20 flex items-center justify-center bg-gray-200/50 backdrop-blur-[1px] rounded" title="現在開発中です">
                         <span class="text-[10px] font-bold text-gray-600 bg-white/90 px-2 py-0.5 rounded border border-gray-300 shadow-sm">(実装中)</span>
                      </div>
                      <div class="flex items-center gap-2 w-full opacity-50 pointer-events-none select-none" aria-disabled="true">
                        <div class="relative flex-1 max-w-[400px]">
                          <input
                            type="text"
                            v-model="codeText"
                            class="w-full pl-2 pr-8 py-1 border border-gray-400 rounded text-xs shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="艦隊分析コード（JSON）"
                            disabled
                          />
                          <button
                            @click="copyCode"
                            class="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            title="コピー"
                            disabled
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                          </button>
                        </div>

                        <div class="h-4 w-px bg-gray-400 mx-1"></div>

                        <button
                          type="button"
                          @click="triggerImport"
                          class="px-2 py-1 bg-gray-300 text-gray-800 border border-gray-400 rounded hover:bg-gray-400 text-xs flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap"
                          disabled
                        >
                          <span v-if="loading">...</span>
                          <span v-else>コードから取り込み</span>
                        </button>

                        <button
                          type="button"
                          @click="triggerExport"
                          class="px-2 py-1 bg-gray-300 text-gray-800 border border-gray-400 rounded hover:bg-gray-400 text-xs flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap"
                          disabled
                        >
                          <span>コードを生成</span>
                        </button>
                      </div>
                 </div>

                <div class="h-4 w-px bg-gray-400 mx-1"></div>

                 <!-- CSV Import Button -->
                 <input
                  type="file"
                  ref="fileInput"
                  accept=".csv,.txt"
                  class="hidden"
                  @change="handleFileSelect"
                 />
                 <button
                  type="button"
                  @click="triggerCsvImport"
                  class="px-2 py-1 bg-gray-300 text-gray-800 border border-gray-400 rounded hover:bg-gray-400 text-xs flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap"
                  :disabled="loading"
                  @mouseenter="handleMouseEnter($event, '艦名のみ、改行区切りのUTF-8形式のCSVを取り込みます')"
                  @mouseleave="handleMouseLeave"
                >
                  <span>csvから取り込み(艦船のみ)</span>
                </button>
            </div>

            <!-- Right: Feedback Link -->
            <a
              href="https://tally.so/r/2EaBrD"
              target="_blank"
              class="text-xs text-blue-600 hover:text-blue-800 hover:underline ml-4 whitespace-nowrap"
            >
              ご意見・ご要望はこちらまで
            </a>
         </div>
      </div>

      <!-- Modals -->
      <CsvImportDestinationModal
        v-if="showDestinationModal"
        @select="handleDestinationSelect"
        @cancel="closeDestinationModal"
      />

      <CsvImportResultModal
        v-if="showResultModal"
        :total="importResult.total"
        :success="importResult.success"
        :excluded="importResult.excluded"
        @close="closeResultModal"
      />
    <Teleport to="body">
      <div
        v-if="tooltipState.show"
        class="fixed z-[9999] px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none whitespace-nowrap -translate-x-1/2 -translate-y-full mb-2 border border-gray-600"
        :style="{ top: tooltipState.y + 'px', left: tooltipState.x + 'px' }"
      >
        {{ tooltipState.content }}
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDatasetStore } from '@/stores/datasetStore'
import { useShips } from '@/composables/useShips'
import { useTagManagement } from '@/composables/useTagManagement'
import CsvImportDestinationModal from './CsvImportDestinationModal.vue'
import CsvImportResultModal from './CsvImportResultModal.vue'

export default defineComponent({
  name: 'DatasetControlBar',
  components: {
    CsvImportDestinationModal,
    CsvImportResultModal
  },
  props: {
    selectedEventId: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const datasetStore = useDatasetStore()
    const { allShips } = useShips()
    const selectedEventIdRef = ref(props.selectedEventId)
    const { tagMap, stageTagMap, fetchData } = useTagManagement(selectedEventIdRef, ref([]))

    const loading = ref(false)
    const codeText = ref('')
    const fileInput = ref<HTMLInputElement | null>(null)
    const isExpanded = ref(false)

    // Custom Tooltip State
    const tooltipState = ref({
      show: false,
      content: '',
      x: 0,
      y: 0
    })

    const handleMouseEnter = (e: MouseEvent, content: string) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      tooltipState.value = {
        show: true,
        content,
        x: rect.left + rect.width / 2,
        y: rect.top - 5 // Position just above the element
      }
    }

    const handleMouseLeave = () => {
      tooltipState.value.show = false
    }

    // CSV Import State
    const showDestinationModal = ref(false)
    const showResultModal = ref(false)
    const csvContent = ref('')
    const importResult = ref<{ total: number, success: number, excluded: string[] }>({ total: 0, success: 0, excluded: [] })

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    const triggerImport = async () => {
      if (!codeText.value) return

      const name = prompt('インポートするデータセット名を入力してください:', 'Imported Data')
      if (!name) return

      loading.value = true
      try {
        if (props.selectedEventId) {
            selectedEventIdRef.value = props.selectedEventId
            await fetchData(props.selectedEventId)
        }

        const tMap: Record<number, { tagId: number, tagName: string }> = {}
        for (const k in tagMap.value) {
            const v = tagMap.value[k]
            tMap[v.tagId] = { tagId: v.tagId, tagName: v.tagName }
        }

        const sTagMap: Record<string, { tagId: number }[]> = {}
        for (const k in stageTagMap.value) {
            const v = stageTagMap.value[k]
            sTagMap[k] = v.map(t => ({ tagId: t.tagId }))
        }

        await datasetStore.importDataset(
          codeText.value,
          name,
          allShips.value,
          props.selectedEventId,
          tMap,
          sTagMap
        )
      } catch (error) {
        alert('インポートに失敗しました。形式を確認してください。')
        console.error(error)
      } finally {
        loading.value = false
        codeText.value = ''
      }
    }

    const triggerExport = async () => {
      if (!props.selectedEventId) {
        alert('イベントを選択してください')
        return
      }

      loading.value = true
      try {
          selectedEventIdRef.value = props.selectedEventId
          await fetchData(props.selectedEventId)

          const sTagMap: Record<string, { tagId: number }[]> = {}
          for (const k in stageTagMap.value) {
              const v = stageTagMap.value[k]
              sTagMap[k] = v.map(t => ({ tagId: t.tagId }))
          }

          const json = await datasetStore.exportDataset(
            allShips.value,
            props.selectedEventId,
            sTagMap
          )

          codeText.value = json
      } catch (error) {
          console.error(error)
          alert('エクスポートに失敗しました')
      } finally {
          loading.value = false
      }
    }

    const copyCode = () => {
      if (!codeText.value) return
      navigator.clipboard.writeText(codeText.value).then(() => {
        // Optional: Show feedback?
      }).catch(err => {
        console.error('Failed to copy: ', err)
      })
    }

    // CSV Logic
    const triggerCsvImport = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        csvContent.value = e.target?.result as string
        showDestinationModal.value = true
        // Reset input so same file can be selected again if needed
        target.value = ''
      }
      reader.readAsText(file)
    }

    const closeDestinationModal = () => {
      showDestinationModal.value = false
      csvContent.value = ''
    }

    const handleDestinationSelect = async (mode: 'overwrite' | 'new') => {
      showDestinationModal.value = false
      loading.value = true

      try {
        let name
        if (mode === 'new') {
           name = prompt('新しいデータセット名を入力してください:', 'CSV Imported Data')
           if (!name) {
             loading.value = false
             return
           }
        }

        const result = await datasetStore.importShipCsv(csvContent.value, mode, allShips.value, name)

        importResult.value = {
          total: result.success + result.excluded.length,
          success: result.success,
          excluded: result.excluded
        }
        showResultModal.value = true

      } catch (error) {
        console.error('CSV Import Failed:', error)
        alert('CSVインポートに失敗しました')
      } finally {
        loading.value = false
      }
    }

    const closeResultModal = () => {
      showResultModal.value = false
      window.location.reload()
    }

    return {
      triggerImport,
      triggerExport,
      loading,
      codeText,
      copyCode,
      isExpanded,
      toggleExpand,
      fileInput,
      triggerCsvImport,
      handleFileSelect,
      showDestinationModal,
      showResultModal,
      importResult,
      handleDestinationSelect,
      closeDestinationModal,
      closeResultModal,
      tooltipState,
      handleMouseEnter,
      handleMouseLeave
    }
  }
})
</script>
