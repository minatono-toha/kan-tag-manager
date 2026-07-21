<template>
  <Teleport to="body">
    <div
      v-if="show"
      ref="popupRef"
      class="fleet-guide-popup fixed z-[200] rounded border shadow-lg text-sm"
      :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
      role="dialog"
      :aria-label="title"
      @click.stop
      @dblclick.stop
    >
      <div class="fleet-guide-header flex items-start gap-2 px-3 py-2 border-b">
        <span class="font-bold flex-1 break-all">{{ title }}</span>
        <button
          type="button"
          class="fleet-guide-close leading-none px-1"
          aria-label="閉じる"
          @click="emit('close')"
        >
          ×
        </button>
      </div>
      <!-- fc_text と同様、Firestore 側で管理する文言なので <br> 等のHTMLをそのまま描画する。
           whitespace-pre-wrap 併用で、生の改行文字だけの記述でも改行される。 -->
      <div class="fleet-guide-body px-3 py-2 whitespace-pre-wrap break-words" v-html="html"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  /** 表示始点(マウス座標: clientX / clientY) */
  x: number
  y: number
  title: string
  content: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

// whitespace-pre-wrap と併用するため、<br> の直後に生の改行が続く書き方(Firestore の
// 入力欄で改行しつつ <br> も書いた場合)で行間が二重に空かないよう畳んでおく。
const html = computed(() => props.content.replace(/(<br\s*\/?>)\s*\n/gi, '$1'))

const popupRef = ref<HTMLElement | null>(null)
const pos = ref({ x: props.x, y: props.y })

// ビューポート外へはみ出さないよう、実寸を測ってから座標を補正する
const MARGIN = 8
const OFFSET = 4

const clampToViewport = () => {
  const el = popupRef.value
  let x = props.x + OFFSET
  let y = props.y + OFFSET
  if (el) {
    const { width, height } = el.getBoundingClientRect()
    x = Math.max(MARGIN, Math.min(x, window.innerWidth - width - MARGIN))
    y = Math.max(MARGIN, Math.min(y, window.innerHeight - height - MARGIN))
  }
  pos.value = { x, y }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.stopPropagation()
    emit('close')
  }
}

const handleOutsidePointer = (event: MouseEvent) => {
  if (popupRef.value?.contains(event.target as Node)) return
  emit('close')
}

const handleDismiss = () => emit('close')

const addListeners = () => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousedown', handleOutsidePointer)
  // 位置は fixed 固定なので、スクロール/リサイズで起点から離れたら閉じる
  window.addEventListener('scroll', handleDismiss, true)
  window.addEventListener('resize', handleDismiss)
}

const removeListeners = () => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousedown', handleOutsidePointer)
  window.removeEventListener('scroll', handleDismiss, true)
  window.removeEventListener('resize', handleDismiss)
}

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      pos.value = { x: props.x + OFFSET, y: props.y + OFFSET }
      nextTick(clampToViewport)
      addListeners()
    } else {
      removeListeners()
    }
  },
  { immediate: true },
)

// 開いたまま別のボスマスをダブルクリックされた場合の座標追従
watch(
  () => [props.x, props.y, props.content],
  () => {
    if (!props.show) return
    pos.value = { x: props.x + OFFSET, y: props.y + OFFSET }
    nextTick(clampToViewport)
  },
)

onUnmounted(removeListeners)
</script>

<style scoped>
.fleet-guide-popup {
  background-color: var(--bg-popup);
  color: var(--text-popup);
  border-color: var(--border-popup);
  max-width: min(420px, calc(100vw - 16px));
  min-width: 180px;
  max-height: min(50vh, 480px);
  overflow-y: auto;
  /* テーマ側で半透明背景が指定されている場合に備えて背面をぼかす */
  backdrop-filter: blur(2px);
}

.fleet-guide-header {
  border-color: var(--border-popup);
}

.fleet-guide-close {
  color: var(--text-popup);
  opacity: 0.6;
}

.fleet-guide-close:hover {
  opacity: 1;
}

.fleet-guide-body {
  line-height: 1.6;
}
</style>
