<template>
  <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="mb-4 text-left">
        <span
          @click="showOnlySelected = !showOnlySelected"
          class="cursor-pointer text-sm text-blue-600 hover:underline select-none"
        >
          {{ showOnlySelected ? 'すべての改装段階を表示' : '選択された改装段階を表示' }}
        </span>
      </div>

      <!-- 艦船ごとの詳細情報を表示 -->
      <ul class="ship-list">
        <li
          v-for="ship in displayShips"
          :key="ship.id"
          class="ship-item cursor-pointer"
          :class="[
            shipItemClass,
            {
              'selected-variant': ship.id === currentVariantId,
              'opacity-50 cursor-not-allowed': selectedShip && isVariantDisabled(selectedShip.name, ship.name)
            }
          ]"
          :title="selectedShip && isVariantDisabled(selectedShip.name, ship.name) ? '改装元と特攻倍率が異なるため、改装後の行を参照してください' : ''"
          @click="handleShipItemClick(ship, $event)"
        >
          <a
            v-if="ship.wiki_url"
            :href="ship.wiki_url"
            target="_blank"
            rel="noopener noreferrer"
            class="ship-banner-link"
            @click="handleBannerClick($event, ship)"
          >
            <div class="ship-banner">
              <ShipCard
                :ship="ship"
                :showBanner="true"
                @select="() => {}"
                @openCard="handleCardOpen"
              />
            </div>
          </a>
          <div v-else class="ship-banner">
            <ShipCard
              :ship="ship"
              :showBanner="true"
              @select="() => {}"
              @openCard="openCardModal"
            />
          </div>
          <div class="ship-info">
            <p>
              <strong>艦名:</strong>
              <a
                v-if="ship.wiki_url"
                :href="ship.wiki_url"
                target="_blank"
                rel="noopener noreferrer"
                class="wiki-link"
              >
                {{ ship.name }}
              </a>
              <span v-else>{{ ship.name }}</span>
            </p>
            <p><strong>艦型・艦番:</strong> {{ ship.class }} {{ ship.shipType }}</p>
            <p><strong>速力:</strong> {{ ship.speed }}</p>
            <p><strong>改造段階:</strong> {{ ship.updateLevel ?? '未設定' }}</p>
          </div>
        </li>
      </ul>

      <!-- Tag Management Section -->
      <div v-if="selectedEventId && filteredShips.length > 0" class="mt-4">
        <ModalTagManagement
          :ship="filteredShips[0]"
          :shipIndex="modalShipIndex"
          :selectedEventId="selectedEventId"
          :tagManagementData="tagManagementData"
          :stageOptions="stageOptions"
          :stageTagMap="stageTagMap"
          :tagMap="tagMap"
          :updateTagManagement="updateTagManagement"
        />
      </div>

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
import { ref, watch, computed } from 'vue'
import type { Ship, TagManagement } from '@/types/interfaces'
import ShipCard from './ShipCard.vue'
import ModalTagManagement from './ModalTagManagement.vue'
import { SP_ATTACK_EXCEPTION_SHIPS } from '@/components/attack/SPAttackException'
import { useTheme } from '@/composables/useTheme'

const props = withDefaults(defineProps<{
  ships: Ship[]
  modalVisible: boolean
  selectedShipOrig: number | null
  modalShipIndex: number
  currentVariantId: number | null
  selectedEventId: number | null
  tagManagementData: Map<string, TagManagement>
  stageOptions: string[]
  stageTagMap: Record<string, { tagId: number; tagName: string; tagColor: string }[]>
  tagMap: Record<number, { tagId: number; tagName: string; tagColor: string }>
  updateTagManagement: (data: TagManagement) => Promise<void>
}>(), {})

const { theme } = useTheme()

const isVariantDisabled = (rowShipName: string, variantName: string): boolean => {
  // 例外リストに含まれる艦の場合、名称が部分一致しないバリエーションは選択不可とする
  if (SP_ATTACK_EXCEPTION_SHIPS.some(ex => rowShipName.includes(ex))) {
    return !variantName.includes(rowShipName)
  }
  return false
}

const emit = defineEmits(['close', 'select-variant'])

const selectedShip = ref<Ship | null>(null)
const filteredShips = ref<Ship[]>([])

// 子モーダル用
const cardModalVisible = ref(false)
const cardBannerId = ref<number | null>(null)
const showOnlySelected = ref(true)

const shipItemClass = computed(() => {
  if (theme.value === 'dark' || theme.value === 'gradient') {
    return 'hover:bg-gray-700 text-gray-100 border-gray-600'
  }
  return 'hover:bg-blue-50 border-gray-200'
})

const displayShips = computed(() => {
  if (showOnlySelected.value && props.currentVariantId !== null) {
    return filteredShips.value.filter((s) => s.id === props.currentVariantId)
  }
  return filteredShips.value
})

const openCardModal = (bannerId: number) => {
  cardBannerId.value = bannerId
  cardModalVisible.value = true
}

const closeCardModal = () => {
  cardModalVisible.value = false
  cardBannerId.value = null
}

const handleCardOpen = (bannerId: number) => {
  // When the image is clicked, we want to open the modal, not navigate to the wiki
  openCardModal(bannerId)
}

const handleBannerClick = (event: MouseEvent, ship: Ship) => {
  // Check if disabled (for variant selection logic via frame click)
  const target = event.target as HTMLElement

  if (target.tagName === 'IMG') {
    // Prevent the link from navigating when clicking the image
    event.preventDefault()
    // Image click (card open) is allowed even if disabled?
    // Usually only variant switching is the issue.
    // If we want to allow viewing card of disabling ship, we can proceed.
    // The user said "selectable from modal", so variant switching is the main concern.
    return
  }

  // Clicking the frame (outside the image) - select variant
  event.preventDefault()

  if (selectedShip.value && isVariantDisabled(selectedShip.value.name, ship.name)) {
    return
  }

  emit('select-variant', ship.orig, ship.id)
}

const handleShipItemClick = (ship: Ship, event: MouseEvent) => {
  // Check if disabled
  if (selectedShip.value && isVariantDisabled(selectedShip.value.name, ship.name)) {
    return
  }

  // Check if the click originated from the banner area (image or link)
  const target = event.target as HTMLElement
  const isBannerClick = target.closest('.ship-banner') !== null

  if (!isBannerClick) {
    // Clicked on the ship info area - update the variant in the ship list table
    emit('select-variant', ship.orig, ship.id)
  }
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
  background-color: var(--bg-modal);
  color: var(--text-modal);
  padding: 20px;
  border-radius: 8px;
  width: fit-content;
  min-width: 500px;
  max-width: 90vw;
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
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  transition: all 0.2s ease;
}

.ship-item.selected-variant {
  border-color: #4a90e2;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
  background-color: var(--hover-bg);
}

.ship-info {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ship-banner-link {
  display: block;
  text-decoration: none;
  color: inherit;
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
  background-color: var(--bg-modal);
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

.wiki-link {
  color: #4a90e2;
  text-decoration: none;
  cursor: pointer;
}

.wiki-link:hover {
  text-decoration: underline;
}
</style>
