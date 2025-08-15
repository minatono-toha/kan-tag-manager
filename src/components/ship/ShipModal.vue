<template>
  <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ selectedShip?.name }} 詳細</h2>

      <!-- 艦船ごとの詳細情報を表示 -->
      <ul class="ship-list">
        <li v-for="ship in filteredShips" :key="ship.id" class="ship-item">
          <div class="ship-banner">
            <ShipCard
              :ship="ship"
              :showBanner="true"
              @select="() => {}"
              @openCard="openCardModal"
            />
          </div>
          <div class="ship-info">
            <p><strong>艦名:</strong> {{ ship.name }}</p>
            <p><strong>艦型・艦番:</strong> {{ ship.class }} {{ ship.shipType }}</p>
            <p><strong>速力:</strong> {{ ship.speed }}</p>
            <p><strong>改造段階:</strong> {{ ship.updateLevel ?? '未設定' }}</p>
          </div>
        </li>
      </ul>

      <button @click="closeModal">閉じる</button>
    </div>

    <!-- 子モーダル -->
    <div v-if="cardModalVisible" class="card-modal-overlay" @click.self="closeCardModal">
      <div class="card-modal-content">
        <img :src="`${baseUrl}img/ship/card/${cardBannerId}.png`" alt="カード画像" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ship } from '@/types/interfaces'
import ShipCard from './ShipCard.vue'

const props = defineProps<{
  ships: Ship[]
  modalVisible: boolean
  selectedShipOrig: number | null
}>()

const emit = defineEmits(['close'])

const selectedShip = ref<Ship | null>(null)
const filteredShips = ref<Ship[]>([])

// 子モーダル用
const cardModalVisible = ref(false)
const cardBannerId = ref<number | null>(null)

const openCardModal = (bannerId: number) => {
  cardBannerId.value = bannerId
  cardModalVisible.value = true
}

const closeCardModal = () => {
  cardModalVisible.value = false
  cardBannerId.value = null
}
const baseUrl = import.meta.env.BASE_URL
watch(
  () => props.selectedShipOrig,
  (newOrig) => {
    if (newOrig === null) {
      selectedShip.value = null
      filteredShips.value = []
      return
    }

    const filtered = props.ships.filter((s) => s.orig === newOrig)
    if (filtered.length > 0) {
      selectedShip.value = filtered[0]
      filteredShips.value = filtered.sort((a, b) => (a.updateLevel ?? 0) - (b.updateLevel ?? 0))
    } else {
      selectedShip.value = null
      filteredShips.value = []
    }
  },
  { immediate: true },
)

const closeModal = () => {
  selectedShip.value = null
  filteredShips.value = []
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
}

.ship-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.ship-item {
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: flex-start;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.ship-info {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

button {
  margin-top: 20px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #4a90e2;
  color: white;
  border: none;
  cursor: pointer;
}

/* 子モーダルのスタイル */
.card-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.card-modal-content {
  background-color: white;
  padding: 2px;
  border-radius: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  max-height: 90vh;
}

.card-modal-content img {
  max-width: 100%;
  max-height: 100%;
}
</style>
