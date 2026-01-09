import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import type { QA } from '@/types/interfaces'

export function useQASheet() {
  const qas = ref<QA[]>([])
  const loading = ref(false)
  const searchQuery = ref('')
  const selectedCategory = ref<number | null>(null)

  const fetchQAs = async () => {
    // Only fetch if not already fetched or to refresh
    if (qas.value.length > 0 && !loading.value) return

    try {
      loading.value = true
      const q = query(collection(db, 'qasheet'), orderBy('qa_createDate', 'desc'))
      const snap = await getDocs(q)
      qas.value = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as QA[]
    } catch (error) {
      console.error('Failed to fetch QAs:', error)
    } finally {
      loading.value = false
    }
  }

  const filteredQAs = computed(() => {
    return qas.value.filter((qa) => {
      const matchCategory = selectedCategory.value === null || qa.qa_category === selectedCategory.value
      const matchSearch =
        !searchQuery.value ||
        qa.qa_question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        qa.qa_answer.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchCategory && matchSearch
    })
  })

  const setCategory = (category: number | null) => {
    selectedCategory.value = category
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  return {
    qas,
    loading,
    searchQuery,
    selectedCategory,
    fetchQAs,
    filteredQAs,
    setCategory,
    setSearchQuery,
  }
}
