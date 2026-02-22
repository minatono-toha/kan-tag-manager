<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[3000]"
      @click.self="$emit('close')"
    >
      <div
        class="rounded-lg shadow-xl w-[900px] h-[700px] flex flex-col overflow-hidden transition-colors duration-200"
        :class="theme !== 'light' ? 'bg-gray-800' : 'bg-white'"
        @click.stop
      >
        <!-- Header -->
        <div
          class="px-6 py-4 border-b flex justify-between items-center flex-none"
          :class="theme !== 'light' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'"
        >
          <h2 class="text-xl font-bold" :class="theme !== 'light' ? 'text-white' : 'text-gray-800'">公開QA</h2>
          <button
            @click="$emit('close')"
            class="transition-colors"
            :class="theme !== 'light' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex flex-1 overflow-hidden">
          <!-- Sidebar: Categories -->
          <div
            class="w-48 border-r p-4 overflow-y-auto"
            :class="theme !== 'light' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'"
          >
            <h3
              class="text-xs font-semibold uppercase tracking-wider mb-3"
              :class="theme !== 'light' ? 'text-gray-400' : 'text-gray-500'"
            >
              カテゴリ
            </h3>
            <div class="space-y-1">
              <button
                v-for="cat in categories"
                :key="cat.id ?? 'all'"
                @click="selectCategory(cat.id)"
                class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors"
                :class="selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-medium'
                  : (theme !== 'light' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200')"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col overflow-hidden">
             <!-- Search Bar Area -->
            <div
              class="px-6 py-3 border-b flex justify-end"
              :class="theme !== 'light' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
            >
              <div class="relative w-[30%] min-w-[200px]">
                <input
                  type="text"
                  v-model="internalSearchQuery"
                  @input="handleSearch"
                  placeholder="検索..."
                  class="w-full pl-8 pr-4 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  :class="theme !== 'light'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'"
                />
                <div class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- QA List -->
            <div
              class="flex-1 p-6 overflow-y-auto"
              :class="theme !== 'light' ? 'bg-gray-900/50' : 'bg-gray-100'"
            >
              <div v-if="loading" class="flex justify-center items-center h-32">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
              <div
                v-else-if="filteredQAs.length === 0"
                class="text-center py-12"
                :class="theme !== 'light' ? 'text-gray-400' : 'text-gray-500'"
              >
                該当するQAが見つかりませんでした
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="qa in filteredQAs"
                  :key="qa.id"
                  class="rounded-lg shadow-sm border overflow-hidden flex flex-col"
                  :class="theme !== 'light' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
                >
                  <!-- Header: Status, Category, Date -->
                  <div
                    class="p-4 pb-2 flex justify-between items-center text-xs"
                    :class="theme !== 'light' ? 'bg-gray-800' : 'bg-white'"
                  >
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded font-medium"
                        :class="theme !== 'light' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'"
                      >
                        {{ getCategoryName(qa.qa_category) }}
                      </span>
                      <span
                        class="px-2 py-0.5 rounded-full font-medium"
                        :class="getStatusStyle(qa.qa_status)"
                      >
                        {{ getStatusName(qa.qa_status) }}
                      </span>
                    </div>
                    <div :class="theme !== 'light' ? 'text-gray-400' : 'text-gray-500'">
                      記載日：{{ formatDate(qa.qa_createDate) }}
                    </div>
                  </div>

                  <!-- Question Row -->
                  <div
                    class="px-4 pb-4 border-b flex items-start gap-3"
                    :class="theme !== 'light' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
                  >
                    <span class="inline-flex flex-shrink-0 items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 font-bold text-xs">Q</span>
                    <div class="flex-1 pt-1">
                      <p
                        class="font-medium whitespace-pre-wrap"
                        :class="theme !== 'light' ? 'text-white' : 'text-gray-900'"
                      >
                        {{ qa.qa_question }}
                      </p>
                    </div>
                  </div>

                  <!-- Answer -->
                  <div
                    class="p-4 flex items-start gap-3 border-t"
                    :class="theme !== 'light' ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-100'"
                  >
                    <span class="inline-flex flex-shrink-0 items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 font-bold text-xs">A</span>
                    <div
                      class="flex-1 pt-1 whitespace-pre-wrap"
                      :class="theme !== 'light' ? 'text-gray-300' : 'text-gray-700'"
                    >
                      {{ qa.qa_answer || '回答をお待ちください' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useQASheet } from '@/composables/useQASheet'

const props = defineProps<{
  visible: boolean
  theme?: 'light' | 'dark' | 'gradient'
}>()

defineEmits<{
  (e: 'close'): void
}>()

const {
  loading,
  fetchQAs,
  filteredQAs,
  selectedCategory,
  setCategory,
  setSearchQuery,
} = useQASheet()

const internalSearchQuery = ref('')

const categories = [
  { id: null, name: 'すべて' },
  { id: 1, name: '艦情報修正' },
  { id: 2, name: '特攻情報修正' },
  { id: 3, name: '改善要望' },
  { id: 4, name: '不具合修正' },
  { id: 5, name: 'その他' },
]

const handleSearch = () => {
  setSearchQuery(internalSearchQuery.value)
}

const selectCategory = (id: number | null) => {
  setCategory(id)
}

const getCategoryName = (id: number) => {
  const cat = categories.find(c => c.id === id)
  return cat ? cat.name : '不明'
}

const getStatusName = (status: number) => {
  const statuses: Record<number, string> = {
    1: '未回答',
    2: '対応中',
    3: '回答済',
    4: '対応保留',
  }
  return statuses[status] || '不明'
}

const getStatusStyle = (status: number) => {
  switch (status) {
    case 1: return 'bg-gray-100 text-gray-600'
    case 2: return 'bg-yellow-100 text-yellow-700'
    case 3: return 'bg-green-100 text-green-700'
    case 4: return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const formatDate = (date: unknown): string => {
  if (!date) return '-'
  let d: Date
  if (date && typeof date === 'object' && 'toDate' in date && typeof (date as { toDate: unknown }).toDate === 'function') {
    d = (date as { toDate: () => Date }).toDate()
  } else {
    d = new Date(date as Date | string | number)
  }
  if (isNaN(d.getTime())) return '-'
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchQAs()
  }
})

onMounted(() => {
  if (props.visible) {
    fetchQAs()
  }
})
</script>

<style scoped>
/* Optional: Add some custom scrollbar styling if needed */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
