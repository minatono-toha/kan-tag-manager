<template>
  <div class="event-select-container p-3 relative min-h-[120px]">
    <!-- 右端の更新履歴(絶対配置 w-64)に潜り込まないよう、行全体に右余白を取る -->
    <div class="flex items-start gap-4 mr-72">
      <!-- イベント選択 -->
      <div class="w-32 flex-none">
        <label for="event-select" class="block text-xs font-medium text-gray-700 mb-1">
          イベント選択
        </label>
        <select
          id="event-select"
          v-model="localSelectedEventId"
          @change="handleEventChange"
          class="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
          :disabled="loading"
        >
          <option :value="null" disabled>イベントを選択してください</option>
          <option v-for="event in sortedEvents" :key="event.eventId" :value="event.eventId">
            {{ event.event_jp }}
          </option>
        </select>
      </div>

      <!-- イベント名。装備特攻ボタンを置くぶん幅を詰めている -->
      <div class="flex-1 min-w-0">
        <div class="block text-xs font-medium text-gray-700 mb-1">イベント名</div>
        <div
          v-if="selectedEvent && !loading"
          class="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm truncate"
          :title="selectedEvent.eventName"
        >
          {{ selectedEvent.eventName }}
        </div>
        <div
          v-else
          class="px-3 py-1 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-500"
        >
          イベントを選択してください
        </div>
      </div>

      <!-- 装備特攻。ラベル分の高さを空けて、入力枠と天地を合わせる -->
      <div class="flex-none">
        <div class="block text-xs font-medium mb-1 invisible" aria-hidden="true">装備特攻</div>
        <button
          type="button"
          class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!selectedEventId || loading"
          @click="eqModalVisible = true"
        >
          装備特攻
        </button>
      </div>
    </div>

    <EquipmentAttackModal
      :visible="eqModalVisible"
      :selectedEventId="selectedEventId"
      :eventName="selectedEvent?.eventName"
      @close="eqModalVisible = false"
    />



    <!-- 更新履歴（入力枠の高さに合わせる） -->
    <div class="absolute top-[33px] right-4 w-64">
      <div class="absolute -top-6 right-0">
        <button
          @click="qaModalVisible = true"
          class="text-xs text-gray-600 hover:text-gray-800 transition-colors bg-white/80 px-2 py-0.5"
        >
          公開QA
        </button>
      </div>
      <ChangelogDisplay />
    </div>

    <QASheetModal
      :visible="qaModalVisible"
      :theme="theme"
      @close="qaModalVisible = false"
    />

    <!-- 期間情報（イベント名の下に配置） -->
    <div class="mt-3 ml-40">
      <div class="flex items-center gap-2">
        <span v-if="selectedEvent && !loading" class="text-sm">
          {{ formatDate(selectedEvent.eventStart) }}
        </span>
        <span v-else class="text-sm text-gray-500">-</span>

        <span class="text-sm text-gray-500">～</span>

        <span v-if="selectedEvent && !loading" class="text-sm">
          {{ formatDate(selectedEvent.eventEnd) }}
        </span>
        <span v-else class="text-sm text-gray-500">-</span>

        <span class="text-sm text-gray-500 mx-2">|</span>

        <span
          v-if="selectedEvent && !loading"
          class="text-sm font-medium"
          :class="statusColorClass"
        >
          {{ eventStatus }}
        </span>
        <span v-else class="text-xs text-gray-500">-</span>
      </div>
    </div>

    <div v-if="loading" class="absolute bottom-2 right-4 text-xs text-gray-400">読み込み中...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, onUnmounted, type PropType } from 'vue'
// import { db } from '@/firebase'
// import { collection, getDocs } from 'firebase/firestore'
import { useEvents } from '@/composables/useEvents'
import ChangelogDisplay from './ChangelogDisplay.vue'
import QASheetModal from '../common/QASheetModal.vue'
import EquipmentAttackModal from '../attack/EquipmentAttackModal.vue'
import { toJsDate } from '@/utils/date'

export default defineComponent({
  name: 'EventSelect',
  components: { ChangelogDisplay, QASheetModal, EquipmentAttackModal },
  props: {
    selectedEventId: {
      type: Number as PropType<number | null>,
      default: null,
    },
    theme: {
      type: String as PropType<'light' | 'dark' | 'gradient'>,
      default: 'light',
    },
  },
  emits: ['event-selected', 'theme-change'],
  setup(props, { emit }) {
    const { events, sortedEvents, loading, fetchEvents } = useEvents()
    // const events = ref<EventInfo[]>([])
    const localSelectedEventId = ref<number | null>(props.selectedEventId)
    const qaModalVisible = ref(false)
    const eqModalVisible = ref(false)
    // const loading = ref(true)
    const currentTime = ref(new Date())
    let timer: number | null = null

    // eventId降順でソート
    // const sortedEvents = computed(() => {
    //   return [...events.value].sort((a, b) => b.eventId - a.eventId)
    // })

    // 選択されたイベント
    const selectedEvent = computed(() => {
      if (!localSelectedEventId.value) return null
      return events.value.find((event) => event.eventId === localSelectedEventId.value)
    })

    const formatDate = (date: unknown) => {
      const d = toJsDate(date)
      if (!d) return '未設定'
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
      return `${year}/${month}/${day} (${dayOfWeek})`
    }

    const convertToDate = toJsDate

    // イベントステータス
    const eventStatus = computed(() => {
      if (!selectedEvent.value) return ''

      const now = currentTime.value
      const startDate = convertToDate(selectedEvent.value.eventStart)
      const endDate = convertToDate(selectedEvent.value.eventEnd)

      if (!startDate) {
        return '日付未設定'
      }

      if (!endDate) {
        const elapsedMs = now.getTime() - startDate.getTime()
        const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24))
        return `終了日未定 (開始から${elapsedDays}日経過)`
      }

      if (now < startDate) {
        return '開始前'
      } else if (now >= startDate && now <= endDate) {
        const remainingMs = endDate.getTime() - now.getTime()
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24))
        const remainingHours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))
        return `開催中(残り${remainingDays}日 ${String(remainingHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')})`
      } else {
        return '終了済'
      }
    })

    // ステータスに応じた色クラス
    const statusColorClass = computed(() => {
      if (!selectedEvent.value) return ''

      const now = currentTime.value
      const startDate = convertToDate(selectedEvent.value.eventStart)
      const endDate = convertToDate(selectedEvent.value.eventEnd)

      if (!startDate || !endDate) {
        return 'text-gray-500'
      }

      if (now < startDate) {
        return 'text-blue-600'
      } else if (now >= startDate && now <= endDate) {
        const remainingMs = endDate.getTime() - now.getTime()
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24))

        if (remainingDays < 7) {
          return 'text-red-600'
        } else if (remainingDays < 14) {
          return 'text-orange-500'
        } else {
          return 'text-green-600'
        }
      } else {
        return 'text-gray-500'
      }
    })

    const handleFetchEvents = async () => {
      await fetchEvents()
      // 最大のeventIdを自動的にセット
      if (events.value.length > 0 && !localSelectedEventId.value) {
        const maxEventId = Math.max(...events.value.map((event) => event.eventId))
        localSelectedEventId.value = maxEventId
        emit('event-selected', maxEventId)
      } else if (events.value.length > 0 && localSelectedEventId.value) {
           // Ensure localSelectedEventId is valid
           if (!events.value.find(e => e.eventId === localSelectedEventId.value)) {
                // If invalid, reset to max
                const maxEventId = Math.max(...events.value.map((event) => event.eventId))
                localSelectedEventId.value = maxEventId
                emit('event-selected', maxEventId)
           }
      }
    }

    const handleEventChange = () => {
      if (localSelectedEventId.value !== null) {
        emit('event-selected', localSelectedEventId.value)
      }
    }

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'gradient') => {
      emit('theme-change', newTheme)
    }

    // propsの変更を監視してローカル状態を更新
    watch(
      () => props.selectedEventId,
      (newValue) => {
        localSelectedEventId.value = newValue
      },
    )

    onMounted(() => {
      handleFetchEvents()

      // 1分ごとに時間を更新（開催中のイベントの残り時間をリアルタイム更新）
      timer = window.setInterval(() => {
        currentTime.value = new Date()
      }, 60000) // 1分 = 60000ms

      // クエリパラメータのチェック (?qa=true であればモーダルを表示)
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('qa') === 'true') {
        qaModalVisible.value = true
      }
    })

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
    })

    return {
      events,
      localSelectedEventId,
      sortedEvents,
      loading,
      handleEventChange,
      selectedEvent,
      formatDate,
      eventStatus,
      statusColorClass,
      handleThemeChange,
      qaModalVisible,
      eqModalVisible,
    }
  },
})
</script>

<style scoped>
.event-select-container {
  min-width: 800px;
}
</style>
