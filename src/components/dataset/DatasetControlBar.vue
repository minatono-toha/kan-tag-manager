<template>
  <div class="dataset-control-bar bg-gray-200 border-b border-gray-400 select-none py-1">
    <div class="flex items-center px-2 h-full">
      <!-- Expanded Content -->
      <div class="flex items-center gap-2 flex-1 w-full justify-between">
        <!-- Left: Controls -->
        <div class="flex items-center gap-2 flex-1 max-w-[900px]">
          <!-- JSON Section -->
          <div class="relative flex items-center gap-2 flex-1 max-w-[550px]">
            <div class="flex items-center gap-2 w-full transition-opacity duration-300">
              <div class="relative flex-1 max-w-[400px]">
                <input
                  type="text"
                  v-model="codeText"
                  class="w-full pl-2 pr-8 py-1 border border-gray-400 rounded text-xs shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="艦隊分析コード（JSON）"
                />
                <button
                  @click="copyCode"
                  class="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  title="コピー"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path
                      d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
                    />
                  </svg>
                </button>
              </div>

              <div class="h-4 w-px bg-gray-400 mx-1"></div>

              <button
                type="button"
                @click="triggerImport"
                class="px-2 py-1 bg-gray-300 text-gray-800 border border-gray-400 rounded hover:bg-gray-400 text-xs flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap"
                :disabled="loading"
              >
                <span v-if="loading">...</span>
                <span v-else>コードから取り込み</span>
              </button>

              <button
                type="button"
                @click="triggerExport"
                class="px-2 py-1 bg-gray-300 text-gray-800 border border-gray-400 rounded hover:bg-gray-400 text-xs flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap"
                :disabled="loading"
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
            @mouseenter="
              handleMouseEnter(
                $event,
                '艦名のみ、改行区切りのCSVを取り込みます (UTF-8 / Shift_JIS 自動判定)',
              )
            "
            @mouseleave="handleMouseLeave"
          >
            <span>csvから取り込み(艦船のみ)</span>
          </button>
        </div>

        <!-- Right: Feedback Link -->
        <div class="flex items-center gap-2 ml-4">
          <a
            href="https://github.com/minatono-toha/kan-tag-manager"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            title="GitHub リポジトリ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </a>
          <a
            href="mailto:kantagmanager@gmail.com"
            class="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            title="メールで問い合わせ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </a>
          <a
            href="https://x.com/kan_tag_mng"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            title="X (旧Twitter)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
          </a>
          <a
            href="https://tally.so/r/2EaBrD"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
          >
            ご意見箱
          </a>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ImportDestinationModal
      v-if="showDestinationModal"
      @select="handleDestinationSelect"
      @cancel="closeDestinationModal"
    />

    <AmbiguousShipSelectModal
      v-if="ambiguousPrompt"
      :prompt="ambiguousPrompt"
      @select="handleAmbiguousSelect"
      @cancel="handleAmbiguousCancel"
    />

    <ImportResultModal
      v-if="showResultModal"
      :total="importResult.total"
      :success="importResult.success"
      :excluded="importResult.excluded"
      @close="closeResultModal"
    />
    <BaseDialog
      v-if="alertDialog.show"
      :show="alertDialog.show"
      :title="alertDialog.title"
      :message="alertDialog.message"
      :type="alertDialog.type"
      @cancel="alertDialog.show = false"
      @confirm="alertDialog.show = false"
      @update:show="alertDialog.show = $event"
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
import { defineComponent, ref, computed } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
import { useDatasetStore } from '@/stores/datasetStore'
import { useShips } from '@/composables/useShips'
import { useTagManagement } from '@/composables/useTagManagement'
import { useTooltip } from '@/composables/useTooltip'
import { readFileAsText } from '@/utils/textEncodingDetect'
import type { AmbiguousShipPrompt } from '@/utils/ambiguousShips'
import ImportDestinationModal from './ImportDestinationModal.vue'
import ImportResultModal from './ImportResultModal.vue'
import AmbiguousShipSelectModal from './AmbiguousShipSelectModal.vue'

export default defineComponent({
  name: 'DatasetControlBar',
  components: {
    ImportDestinationModal,
    ImportResultModal,
    AmbiguousShipSelectModal,
    BaseDialog,
  },
  props: {
    selectedEventId: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const datasetStore = useDatasetStore()
    const { allShips } = useShips()
    const selectedEventIdRef = ref(props.selectedEventId)
    const { tagMap, stageTagMap, fetchData } = useTagManagement(selectedEventIdRef, ref([]))

    const loading = ref(false)
    const codeText = ref('')
    const fileInput = ref<HTMLInputElement | null>(null)

    const { state: tooltipState, show: handleMouseEnter, hide: handleMouseLeave } = useTooltip()

    // CSV Import State
    const showDestinationModal = ref(false)
    const showResultModal = ref(false)
    const csvContent = ref('')
    const importSource = ref<'csv' | 'json'>('csv')
    const importResult = ref<{ total: number; success: number; excluded: string[] }>({
      total: 0,
      success: 0,
      excluded: [],
    })

    const alertDialog = ref({
      show: false,
      title: '',
      message: '',
      type: 'alert' as 'alert' | 'confirm',
    })

    // 艦これ上は同名だが艦種違いの艦(Glorious 等)の選択待ち。1隻ずつ順に聞く。
    const ambiguousPrompt = ref<AmbiguousShipPrompt | null>(null)
    let ambiguousResolve: ((bannerId: number | null) => void) | null = null

    const resolveAmbiguousShip = (prompt: AmbiguousShipPrompt) =>
      new Promise<number | null>((resolve) => {
        ambiguousPrompt.value = prompt
        ambiguousResolve = resolve
      })

    const answerAmbiguous = (bannerId: number | null) => {
      ambiguousPrompt.value = null
      const resolve = ambiguousResolve
      ambiguousResolve = null
      resolve?.(bannerId)
    }

    const handleAmbiguousSelect = (bannerId: number) => answerAmbiguous(bannerId)
    const handleAmbiguousCancel = () => answerAmbiguous(null)

    const isAnyModalOpen = computed(
      () =>
        showDestinationModal.value ||
        showResultModal.value ||
        ambiguousPrompt.value !== null ||
        alertDialog.value.show,
    )

    const showAlert = (title: string, message: string) => {
      alertDialog.value = {
        show: true,
        title,
        message,
        type: 'alert',
      }
    }

    const triggerImport = async () => {
      if (!codeText.value || isAnyModalOpen.value) return
      importSource.value = 'json'
      showDestinationModal.value = true
    }

    const triggerExport = async () => {
      if (isAnyModalOpen.value) return

      if (!props.selectedEventId) {
        showAlert('通知', 'イベントを選択してください')
        return
      }

      loading.value = true
      try {
        selectedEventIdRef.value = props.selectedEventId
        await fetchData(props.selectedEventId)

        const json = await datasetStore.exportDataset(allShips.value, props.selectedEventId)

        codeText.value = json
      } catch (error) {
        console.error(error)
        showAlert('エラー', 'エクスポートに失敗しました')
      } finally {
        loading.value = false
      }
    }

    const copyCode = () => {
      if (!codeText.value) return
      navigator.clipboard
        .writeText(codeText.value)
        .then(() => {
          // Optional: Show feedback?
        })
        .catch((err) => {
          console.error('Failed to copy: ', err)
        })
    }

    // CSV Logic
    const triggerCsvImport = () => {
      if (isAnyModalOpen.value) return
      importSource.value = 'csv'
      fileInput.value?.click()
    }

    const handleFileSelect = async (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      try {
        csvContent.value = await readFileAsText(file)
        showDestinationModal.value = true
      } catch {
        showAlert('エラー', 'ファイルの読み込みに失敗しました')
      } finally {
        // Reset input so same file can be selected again if needed
        target.value = ''
      }
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
          const defaultName =
            importSource.value === 'csv' ? 'CSV Imported Data' : 'Fleet Analysis Import'
          name = prompt('新しいデータセット名を入力してください:', defaultName)
          if (!name) {
            loading.value = false
            return
          }
        }

        if (importSource.value === 'csv') {
          const result = await datasetStore.importShipCsv(
            csvContent.value,
            mode,
            allShips.value,
            name,
            resolveAmbiguousShip,
          )
          // 艦種選択でキャンセルされた場合は何も取り込まない
          if (!result) return
          importResult.value = {
            total: result.success + result.excluded.length,
            success: result.success,
            excluded: result.excluded,
          }
          showResultModal.value = true
        } else {
          // JSON (Fleet Analysis) Import
          if (props.selectedEventId) {
            selectedEventIdRef.value = props.selectedEventId
            await fetchData(props.selectedEventId)
          }

          const tMap: Record<number, { tagId: number; tagName: string }> = {}
          for (const k in tagMap.value) {
            const v = tagMap.value[k]
            tMap[v.tagId] = { tagId: v.tagId, tagName: v.tagName }
          }

          const sTagMap: Record<string, { tagId: number; tagName: string }[]> = {}
          for (const k in stageTagMap.value) {
            const v = stageTagMap.value[k]
            sTagMap[k] = v.map((t) => ({ tagId: t.tagId, tagName: t.tagName }))
          }

          await datasetStore.importDataset({
            fileContent: codeText.value,
            newDatasetName: name || '',
            allShips: allShips.value,
            selectedEventId: props.selectedEventId,
            tagMap: tMap,
            stageTagMap: sTagMap,
            mode,
          })
          window.location.reload()
        }
      } catch (error) {
        console.error('Import Failed:', error)
        showAlert('エラー', 'インポートに失敗しました')
      } finally {
        // 途中で失敗しても艦種選択のモーダルが残らないようにする
        if (ambiguousPrompt.value) answerAmbiguous(null)
        loading.value = false
        codeText.value = ''
        csvContent.value = ''
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
      fileInput,
      triggerCsvImport,
      handleFileSelect,
      showDestinationModal,
      showResultModal,
      importResult,
      handleDestinationSelect,
      closeDestinationModal,
      closeResultModal,
      ambiguousPrompt,
      handleAmbiguousSelect,
      handleAmbiguousCancel,
      tooltipState,
      handleMouseEnter,
      handleMouseLeave,
      alertDialog,
      isAnyModalOpen,
      showAlert,
    }
  },
})
</script>
