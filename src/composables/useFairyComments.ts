import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { FairyComment } from '@/types/interfaces'

// Singleton State
const comments = ref<FairyComment[]>([])
const loading = ref(false)
const loaded = ref(false)

export function useFairyComments() {
  // 妖精さんは初回クリック時にのみ取得する(クリックしないユーザーの読み取りを発生させない)
  const fetchComments = async (force = false) => {
    if (!force && loaded.value) return

    loading.value = true
    try {
      const snap = await getDocs(collection(db, 'fairy_comment'))
      comments.value = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as FairyComment)
        .filter((c) => c.fc_status === 1)
        .sort((a, b) => a.fc_id - b.fc_id)
      loaded.value = true
    } catch (error) {
      console.error('Failed to fetch fairy comments:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const tips = computed(() =>
    comments.value.filter((c) => c.fc_type === 'tips').map((c) => c.fc_text),
  )

  const tweets = computed(() =>
    comments.value.filter((c) => c.fc_type === 'tweet').map((c) => c.fc_text),
  )

  return {
    tips,
    tweets,
    loading,
    loaded,
    fetchComments,
  }
}
