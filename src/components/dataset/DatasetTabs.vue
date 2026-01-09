<template>
  <div
    class="dataset-tabs-container border-b flex items-center px-4 pb-1 select-none transition-colors duration-300"
    :class="[
      theme === 'light' ? 'bg-gray-100 border-gray-300' :
      theme === 'dark' ? 'bg-[#111827] border-gray-600' :
      'bg-[rgba(30,58,138,0.8)] border-indigo-400/50'
    ]"
  >
    <!-- Tabs List -->
    <div class="flex items-end overflow-x-auto w-full no-scrollbar">
      <div
        v-for="ds in datasetStore.datasets"
        :key="ds.id"
        class="tab-item px-3 py-0.5 -ml-px rounded-b-md text-sm cursor-pointer border-b border-l border-r relative group flex items-center justify-between gap-2 transition-all duration-200"
        :class="[
          theme === 'light' ? 'border-gray-300' :
          theme === 'dark' ? 'border-gray-600' :
          'border-indigo-400/50',
          ds.id === datasetStore.activeDatasetId
            ? (theme === 'light' ? 'bg-white font-medium z-10 -mt-[1px] border-t-white pt-1' :
               theme === 'dark' ? 'bg-[#1f2937] font-medium z-10 -mt-[1px] border-t-[#1f2937] pt-1 text-white' :
               'bg-[rgba(30,58,138,0.5)] font-medium z-10 -mt-[1px] border-t-[rgba(30,58,138,0.5)] pt-1 text-white')
            : (theme === 'light' ? 'bg-gray-200 text-gray-600 hover:bg-gray-50' :
               theme === 'dark' ? 'bg-gray-800/40 text-gray-400 hover:bg-gray-700/60' :
               'bg-gray-800/40 text-gray-300 hover:bg-gray-700/60')
        ]"
        @click="switchDataset(ds.id)"
      >
        <span
          v-if="editingDatasetId !== ds.id"
          class="truncate max-w-[100px] flex-1 text-left"
          :title="ds.name"
          @dblclick.stop="startEditing(ds)"
        >
          {{ ds.name }}
        </span>
        <input
          v-else
          :ref="el => { if (el) editInputRefs[ds.id] = el as HTMLInputElement }"
          v-model="editingName"
          class="flex-1 min-w-0 px-1 py-0 text-sm border border-blue-400 rounded outline-none bg-white text-gray-900"
          @keydown.enter="saveEdit"
          @keydown.esc="cancelEdit"
          @blur="cancelEdit"
          @click.stop
        />

        <!-- Delete Button (always visible if more than 1 dataset) -->
        <button
           v-if="datasetStore.datasets.length > 1"
           @click.stop="confirmDelete(ds.id)"
           class="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors rounded-full p-0.5 hover:bg-gray-200 bg-transparent"
           title="削除"
        >
           <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>

      <!-- Add Button -->
      <button
        @click="openAddModal"
        class="ml-1 p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full"
        title="新規作成"
      >
         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <DatasetNameModal
      :visible="showNameModal"
      @close="showNameModal = false"
      @confirm="handleCreateDataset"
      :theme="theme"
    />

    <DatasetDeleteModal
      :visible="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="handleDeleteDataset"
      :theme="theme"
    />

    <DatasetSwitchModal
      :visible="showSwitchModal"
      @close="showSwitchModal = false"
      @confirm="handleSwitchDataset"
      :theme="theme"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, nextTick } from 'vue'
import { useDatasetStore } from '@/stores/datasetStore'
import DatasetNameModal from './DatasetNameModal.vue'
import DatasetDeleteModal from './DatasetDeleteModal.vue'
import DatasetSwitchModal from './DatasetSwitchModal.vue'

interface Dataset {
  id: string
  name: string
  createdAt: number
}

export default defineComponent({
  name: 'DatasetTabs',
  components: { DatasetNameModal, DatasetDeleteModal, DatasetSwitchModal },
  props: {
    theme: {
      type: String,
      default: 'light'
    }
  },
  setup() {
    const datasetStore = useDatasetStore()
    const showNameModal = ref(false)
    const showDeleteModal = ref(false)
    const showSwitchModal = ref(false)
    const deleteTargetId = ref<string | null>(null)
    const switchTargetId = ref<string | null>(null)

    const editingDatasetId = ref<string | null>(null)
    const editingName = ref('')
    const editInputRefs = ref<Record<string, HTMLInputElement>>({})

    // Guard to prevent multiple modals
    const isAnyModalOpen = computed(() => showNameModal.value || showDeleteModal.value || showSwitchModal.value)

    onMounted(() => {
       datasetStore.loadDatasets()
    })

    const switchDataset = (id: string) => {
      if (isAnyModalOpen.value) return
      if (id === datasetStore.activeDatasetId) return
      switchTargetId.value = id
      showSwitchModal.value = true
    }

    const handleSwitchDataset = async () => {
      if (switchTargetId.value) {
        await datasetStore.switchDataset(switchTargetId.value)
        showSwitchModal.value = false
        switchTargetId.value = null
      }
    }

    const openAddModal = () => {
      if (isAnyModalOpen.value) return
      showNameModal.value = true
    }

    // Creating a new dataset automatically switches to it.
    // We can reuse handleSwitchLogic or call store directly.
    const handleCreateDataset = (name: string) => {
      const id = datasetStore.addDataset(name)
      showNameModal.value = false
      // Auto switch
      switchDataset(id)
    }

    const confirmDelete = (id: string) => {
      if (isAnyModalOpen.value) return
      deleteTargetId.value = id
      showDeleteModal.value = true
    }

    const handleDeleteDataset = async () => {
      if (deleteTargetId.value) {
        await datasetStore.deleteDataset(deleteTargetId.value)
        showDeleteModal.value = false
        deleteTargetId.value = null
      }
    }

    const startEditing = (ds: Dataset) => {
      editingDatasetId.value = ds.id
      editingName.value = ds.name
      nextTick(() => {
        const input = editInputRefs.value[ds.id]
        if (input) {
          input.focus()
          input.select()
        }
      })
    }

    const saveEdit = () => {
      if (!editingDatasetId.value) return
      const name = editingName.value.trim()
      if (name && name !== datasetStore.datasets.find(d => d.id === editingDatasetId.value)?.name) {
        datasetStore.renameDataset(editingDatasetId.value, name)
      }
      editingDatasetId.value = null
    }

    const cancelEdit = () => {
      editingDatasetId.value = null
    }

    return {
      datasetStore,
      switchDataset,
      openAddModal,
      confirmDelete,
      showNameModal,
      handleCreateDataset,
      showDeleteModal,
      handleDeleteDataset,
      showSwitchModal,
      handleSwitchDataset,
      isAnyModalOpen,
      editingDatasetId,
      editingName,
      editInputRefs,
      startEditing,
      saveEdit,
      cancelEdit
    }
  }
})
</script>

<style scoped>
.dataset-tabs-container {
  box-shadow: 0 -1px 3px rgba(0,0,0,0.05);
  z-index: 200;
}
.tab-item {
  transition: all 0.2s;
  white-space: nowrap;
  min-width: 100px;
  justify-content: center;
  align-self: flex-start;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
