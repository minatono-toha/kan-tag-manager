<template>
  <div class="event-select-container p-3 relative min-h-[120px]">
    <div class="flex items-start gap-6">
      <!-- イベント選択 -->
      <div class="w-32">
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

      <!-- イベント名 -->
      <div class="flex-1 mr-72">
        <div class="block text-xs font-medium text-gray-700 mb-1">イベント名</div>
        <div
          v-if="selectedEvent && !loading"
          class="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm"
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
    </div>

    <!-- ご意見・ご要望リンク（ラベルの高さに合わせる） -->
    <div class="absolute top-3 right-4 w-64 text-right">
      <a
        href="https://tally.so/r/2EaBrD"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xxs text-blue-600 hover:text-blue-800"
      >
        ご意見・ご要望はコチラ
      </a>
    </div>

    <!-- 更新履歴（入力枠の高さに合わせる） -->
    <div class="absolute top-[33px] right-4 w-64">
      <ChangelogDisplay />
    </div>

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
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { EventInfo } from '@/types/interfaces'
import ChangelogDisplay from './ChangelogDisplay.vue'

export default defineComponent({
  name: 'EventSelect',
  components: { ChangelogDisplay },
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
    const events = ref<EventInfo[]>([])
    const localSelectedEventId = ref<number | null>(props.selectedEventId)
    const loading = ref(true)
    const currentTime = ref(new Date())
    let timer: number | null = null

    // eventId降順でソート
    const sortedEvents = computed(() => {
      return [...events.value].sort((a, b) => b.eventId - a.eventId)
    })

    // 選択されたイベント
    const selectedEvent = computed(() => {
      if (!localSelectedEventId.value) return null
      return events.value.find((event) => event.eventId === localSelectedEventId.value)
    })

    // 日付フォーマット関数
    const formatDate = (date: unknown) => {
      if (!date) return '未設定'

      let d: Date
      // Firestore Timestampの場合
      if (date && typeof (date as { toDate?: () => Date }).toDate === 'function') {
        d = (date as { toDate: () => Date }).toDate()
      } else if (date instanceof Date) {
        d = date
      } else {
        d = new Date(date as string | number | Date)
      }

      // 無効な日付の場合は未設定を返す
      if (isNaN(d.getTime())) {
        return '未設定'
      }

      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
      return `${year}/${month}/${day} (${dayOfWeek})`
    }

    // 日付をDateオブジェクトに変換するヘルパー関数
    const convertToDate = (date: unknown): Date | null => {
      if (!date) return null

      // Firestore Timestampの場合
      if (date && typeof (date as { toDate?: () => Date }).toDate === 'function') {
        return (date as { toDate: () => Date }).toDate()
      } else if (date instanceof Date) {
        return date
      } else {
        const d = new Date(date as string | number | Date)
        return isNaN(d.getTime()) ? null : d
      }
    }

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

    const fetchEvents = async () => {
      try {
        loading.value = true
        const snap = await getDocs(collection(db, 'eventinfo'))
        events.value = snap.docs.map((doc) => doc.data() as EventInfo)

        // 最大のeventIdを自動的にセット
        if (events.value.length > 0) {
          const maxEventId = Math.max(...events.value.map((event) => event.eventId))
          localSelectedEventId.value = maxEventId
          emit('event-selected', maxEventId)
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        loading.value = false
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
      fetchEvents()

      // 1分ごとに時間を更新（開催中のイベントの残り時間をリアルタイム更新）
      timer = window.setInterval(() => {
        currentTime.value = new Date()
      }, 60000) // 1分 = 60000ms
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
    }
  },
})
</script>

<style scoped>
.event-select-container {
  min-width: 800px;
}
</style>
