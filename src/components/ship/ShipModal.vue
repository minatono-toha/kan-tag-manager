<template>
  <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="mb-4 text-left">
        <div
          v-if="isUnowned"
          class="bg-red-500/60 text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-2 w-fit"
        >
          未着任
        </div>
        <div
          v-else
          class="bg-blue-500/60 text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-2 w-fit"
        >
          着任済({{ modalShipIndex + 1 }}隻目)
        </div>
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
          :key="ship.bannerId"
          class="ship-item cursor-pointer"
          :class="[
            shipItemClass,
            {
              'selected-variant': ship.bannerId === currentVariantId,
              'opacity-50 cursor-not-allowed': selectedShip && isVariantDisabled(selectedShip.name, ship.name)
            }
          ]"
          :title="selectedShip && isVariantDisabled(selectedShip.name, ship.name) ? '改装元と特攻倍率が異なるため、改装後の行を参照してください' : ''"
          @click="handleShipItemClick(ship, $event)"
        >
          <a
            v-if="safeWikiUrl(ship.wiki_url)"
            :href="safeWikiUrl(ship.wiki_url)"
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
                v-if="safeWikiUrl(ship.wiki_url)"
                :href="safeWikiUrl(ship.wiki_url)"
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
import { isVariantDisabled } from '@/components/attack/SPAttackException'
import { useTheme } from '@/composables/useTheme'

const props = withDefaults(defineProps<{
  ships: Ship[]
  modalVisible: boolean
  isUnowned?: boolean
  selectedShipOrig: number | null
  modalShipIndex: number
  currentVariantId: number | null
  selectedEventId: number | null
  tagManagementData: Map<string, TagManagement>
  stageOptions: string[]
  stageTagMap: Record<string, { tagId: number; tagName: string; tagColor: string }[]>
  tagMap: Record<number, { tagId: number; tagName: string; tagColor: string }>
  updateTagManagement: (data: TagManagement) => Promise<void>
}>(), {
  isUnowned: false
})

const { theme } = useTheme()

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

// Firestore由来のURLをそのままhrefに束縛しない(javascript:等のスキームを排除)
const safeWikiUrl = (url?: string): string | undefined => {
  if (url && /^https?:\/\//i.test(url)) {
    return url
  }
  return undefined
}

const displayShips = computed(() => {
  if (showOnlySelected.value && props.currentVariantId !== null) {
    return filteredShips.value.filter((s) => s.bannerId === props.currentVariantId)
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
    // Single click on image - don't open card, just select variant
    // We used @dblclick on ShipCard, so click event reaches here.
    event.preventDefault()
  }

  // Clicking the frame (outside the image) - select variant
  event.preventDefault()

  if (selectedShip.value && isVariantDisabled(selectedShip.value.name, ship.name)) {
    return
  }

  emit('select-variant', ship.spGroupId, ship.bannerId)
}

const handleShipItemClick = (ship: Ship, event: MouseEvent) => {
  if (selectedShip.value && isVariantDisabled(selectedShip.value.name, ship.name)) {
    return
  }

  const target = event.target as HTMLElement
  const isBannerClick = target.closest('.ship-banner') !== null

  if (!isBannerClick) {
    emit('select-variant', ship.spGroupId, ship.bannerId)
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

    const filtered = props.ships.filter((s) => s.spGroupId === newOrig)
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
