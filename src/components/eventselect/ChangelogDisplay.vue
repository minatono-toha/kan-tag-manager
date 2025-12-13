<template>
  <div class="changelog-container bg-gray-100 border-2 border-dotted border-gray-400 px-3 py-2 relative z-[60]" ref="changelogRef">
    <!-- Header (always visible) -->
    <div
      @click="toggleExpand"
      class="cursor-pointer"
    >
      <div class="text-xs text-gray-700 mb-1">更新履歴</div>
      <div v-if="loading" class="text-xs text-gray-500">読み込み中...</div>
      <div v-else-if="changelogs.length === 0" class="text-xs text-gray-500">履歴なし</div>
      <div v-else>
        <!-- Collapsed View (Fixed 2 lines, no scroll) -->
        <div v-if="!isExpanded" class="space-y-1">
          <div
            v-for="log in displayedLogs"
            :key="log.c_logId"
            class="flex items-start gap-2 text-xs"
          >
            <span class="text-gray-600 whitespace-nowrap">{{ formatDate(log.c_logDate) }}</span>
            <span class="text-gray-800 line-clamp-1">{{ log.c_logStr }}</span>
          </div>
        </div>

        <!-- Expanded View (Scrollable all lines) -->
        <div v-else class="space-y-1 max-h-[7rem] overflow-y-auto">
          <div
            v-for="log in changelogs"
            :key="log.c_logId"
            class="flex items-start gap-2 text-xs"
          >
            <span class="text-gray-600 whitespace-nowrap">{{ formatDate(log.c_logDate) }}</span>
            <span class="text-gray-800">{{ log.c_logStr }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import type { Changelog } from '@/types/interfaces'

/*
Scrolling unification plan:
- [x] Split Feedback Link and Changelog into separate absolute/relative containers for better alignment.
- [x] Align Changelog top edge with Event Selection input top edge (~33px).
- [x] Remove internal separator in Changelog when expanded.
- [ ] Refactor Changelog scrolling to scroll the entire list (items 1-N) when expanded, instead of separate scroll for items 3-N.
  - Use a single `v-for` for all logs.
  - Apply `max-height` and `overflow-y-auto` to the list container when expanded.
  - Keep Title static.
*/
const changelogs = ref<Changelog[]>([])
const loading = ref(true)
const isExpanded = ref(false)
const changelogRef = ref<HTMLElement | null>(null)

// Display only the latest 2 logs initially
const displayedLogs = computed(() => {
  return changelogs.value.slice(0, 2)
})

// Remaining logs to show when expanded
const remainingLogs = computed(() => {
  return changelogs.value.slice(2)
})

// Format date as yyyy/mm/dd
const formatDate = (date: any): string => {
  if (!date) return '-'

  let d: Date
  // Firestore Timestamp
  if (date && typeof date.toDate === 'function') {
    d = date.toDate()
  } else if (date instanceof Date) {
    d = date
  } else {
    // Try to parse string or number
    d = new Date(date)
  }

  if (isNaN(d.getTime())) {
    return '-'
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

const fetchChangelogs = async () => {
  try {
    loading.value = true
    const q = query(collection(db, 'changelogs'), orderBy('c_logId', 'desc'))
    const snap = await getDocs(q)
    changelogs.value = snap.docs.map((doc) => doc.data() as Changelog)
  } catch (error) {
    console.error('Failed to fetch changelogs:', error)
  } finally {
    loading.value = false
  }
}

const toggleExpand = () => {
  if (changelogs.value.length > 2) {
    isExpanded.value = !isExpanded.value
  }
}

// Close expanded view when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (isExpanded.value && changelogRef.value) {
    const target = event.target as HTMLElement
    if (!changelogRef.value.contains(target)) {
      isExpanded.value = false
    }
  }
}

onMounted(() => {
  fetchChangelogs()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>


<style scoped>
/* Force specific colors to ignore global theme settings */
.changelog-container {
  background-color: #f3f4f6 !important; /* bg-gray-100 */
  border-color: #9ca3af !important; /* border-gray-400 */
  color: #374151 !important; /* text-gray-700 base */
}

/* Text colors */
.text-gray-700 {
  color: #374151 !important;
}
.text-gray-500 {
  color: #6b7280 !important;
}
.text-gray-600 {
  color: #4b5563 !important;
}
.text-gray-800 {
  color: #1f2937 !important;
}

/* Borders */
.border-gray-300 {
  border-color: #d1d5db !important;
}
.border-gray-400 {
  border-color: #9ca3af !important;
}

/* Backgrounds */
.bg-gray-100 {
  background-color: #f3f4f6 !important;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}
</style>
