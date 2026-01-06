<template>
  <div class="dataset-tabs-container bg-gray-100 border-t border-gray-300 flex items-center px-4 pt-1 select-none">
    <!-- Tabs List -->
    <div class="flex items-end overflow-x-auto w-full no-scrollbar">
      <div
        v-for="ds in datasetStore.datasets"
        :key="ds.id"
        class="tab-item px-3 py-0.5 -ml-px rounded-t-md text-sm cursor-pointer border-t border-l border-r border-gray-300 relative group flex items-center justify-between gap-2"
        :class="[
          ds.id === datasetStore.activeDatasetId
            ? 'bg-white font-medium z-10 -mb-[1px] border-b-white pb-1'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-50'
        ]"
        @click="switchDataset(ds.id)"
      >
        <span class="truncate max-w-[100px] flex-1 text-left" :title="ds.name">{{ ds.name }}</span>

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
    />

    <DatasetDeleteModal
      :visible="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="handleDeleteDataset"
    />

    <DatasetSwitchModal
      :visible="showSwitchModal"
      @close="showSwitchModal = false"
      @confirm="handleSwitchDataset"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useDatasetStore } from '@/stores/datasetStore'
import DatasetNameModal from './DatasetNameModal.vue'
import DatasetDeleteModal from './DatasetDeleteModal.vue'
import DatasetSwitchModal from './DatasetSwitchModal.vue'

export default defineComponent({
  name: 'DatasetTabs',
  components: { DatasetNameModal, DatasetDeleteModal, DatasetSwitchModal },
  setup() {
    const datasetStore = useDatasetStore()
    const showNameModal = ref(false)
    const showDeleteModal = ref(false)
    const showSwitchModal = ref(false)
    const deleteTargetId = ref<string | null>(null)
    const switchTargetId = ref<string | null>(null)

    onMounted(() => {
       datasetStore.loadDatasets()
    })

    const switchDataset = (id: string) => {
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
      handleSwitchDataset
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
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
