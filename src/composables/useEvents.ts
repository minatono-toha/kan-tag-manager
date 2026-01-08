import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { EventInfo } from '@/types/interfaces'

// Singleton State
const events = ref<EventInfo[]>([])
const loading = ref(false)
const loaded = ref(false)

export function useEvents() {

  const fetchEvents = async (force = false) => {
    if (!force && loaded.value) return

    loading.value = true
    try {
      const snap = await getDocs(collection(db, 'eventinfo'))
      events.value = snap.docs.map((doc) => doc.data() as EventInfo)
      loaded.value = true
    } catch (error) {
      console.error('Failed to fetch events:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const sortedEvents = computed(() => {
    return [...events.value].sort((a, b) => b.eventId - a.eventId)
  })

  return {
    events,
    sortedEvents,
    loading,
    fetchEvents
  }
}
