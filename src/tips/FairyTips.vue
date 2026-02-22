<template>
  <div class="fairy-tips-container">
    <!-- フキダシ -->
    <transition name="fade">
      <div v-if="isVisible" class="speech-bubble" :class="{ 'tweet-mode': isTweetMode }" v-html="activeTip">
      </div>
    </transition>

    <!-- キャラクター本体（左クリックで表示、右クリックでモード切替） -->
    <div
      class="fairy-character"
      @click="handleCharacterClick"
      @contextmenu.prevent="handleRightClick"
    >
      <img src="/img/fairy/503_fairy.png" alt="fairy" class="fairy-image" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { TIPS_DATA, EXHAUSTED_MESSAGE, PRE_EXHAUSTED_MESSAGE } from './tipsData';
import { TWEET_DATA } from './tweetData';

export default defineComponent({
  name: 'FairyTips',
  setup() {
    const isTweetMode = ref(false);
    const shownTipsIndices = ref<Set<number>>(new Set());
    const shownTweetsIndices = ref<Set<number>>(new Set());

    const activeTip = ref('');
    const isVisible = ref(false);
    const lastClickTime = ref(0);
    const CLICK_COOLDOWN = 500;
    let timer: number | null = null;

    const showNextTip = (forceMessage?: string) => {
      if (forceMessage) {
        activeTip.value = forceMessage;
      } else {
        const dataSource = isTweetMode.value ? TWEET_DATA : TIPS_DATA;
        const shownSet = isTweetMode.value ? shownTweetsIndices.value : shownTipsIndices.value;

        // 未表示のチップを選択
        const availableIndices = dataSource.map((_, i) => i).filter(i => !shownSet.has(i));

        if (availableIndices.length > 0) {
          // If we are in regular (TIPS_DATA) mode and exactly 1 tip remains unshown:
          if (!isTweetMode.value && availableIndices.length === 1) {
            const lastIndex = availableIndices[0];
            activeTip.value = PRE_EXHAUSTED_MESSAGE;
            // Mark the last real tip as shown so next click shows EXHAUSTED_MESSAGE
            shownSet.add(lastIndex);
          } else {
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            activeTip.value = dataSource[randomIndex];
            shownSet.add(randomIndex);
          }
        } else {
          activeTip.value = EXHAUSTED_MESSAGE;
        }
      }

      isVisible.value = true;

      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        isVisible.value = false;
        timer = null;
      }, 3000);
    };

    const handleCharacterClick = () => {
      const now = Date.now();
      if (now - lastClickTime.value < CLICK_COOLDOWN) return;
      lastClickTime.value = now;
      showNextTip();
    };

    const handleRightClick = () => {
      isTweetMode.value = !isTweetMode.value;
      // モード切り替えを知らせる
      showNextTip(`管理人つぶやきモード: ${isTweetMode.value ? 'ON' : 'OFF'}`);
    };

    return {
      activeTip,
      isVisible,
      isTweetMode,
      handleCharacterClick,
      handleRightClick
    };
  }
});
</script>

<style scoped>
.fairy-tips-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
}

.fairy-character {
  width: 72px;
  height: 72px;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fairy-character:hover {
  transform: scale(1.1);
}

.fairy-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.speech-bubble {
  margin-bottom: 8px;
  padding: 10px 14px;
  max-width: 350px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  color: #111827;
  font-size: 0.8rem;
  line-height: 1.4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  pointer-events: auto;
  word-wrap: break-word;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* つぶやきモード時の視覚的変化（オプション：少し色味を変える） */
.speech-bubble.tweet-mode {
  background: rgba(230, 245, 255, 0.9);
  border-color: rgba(59, 130, 246, 0.3);
}

/* フキダシの角 */
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 15px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(255, 255, 255, 0.85);
  transition: border-top-color 0.3s ease;
}

.speech-bubble.tweet-mode::after {
  border-top-color: rgba(230, 245, 255, 0.9);
}

/* アニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* ダークテーマ系の調整 */
:global(.theme-dark) .speech-bubble,
:global(.theme-gradient) .speech-bubble {
  background: rgba(31, 41, 55, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
  color: #f9fafb;
}

:global(.theme-dark) .speech-bubble::after,
:global(.theme-gradient) .speech-bubble::after {
  border-top-color: rgba(31, 41, 55, 0.9);
}

/* ダークテーマかつツイートモード */
:global(.theme-dark) .speech-bubble.tweet-mode,
:global(.theme-gradient) .speech-bubble.tweet-mode {
  background: rgba(30, 58, 138, 0.9);
  border-color: rgba(99, 102, 241, 0.4);
}

:global(.theme-dark) .speech-bubble.tweet-mode::after,
:global(.theme-gradient) .speech-bubble.tweet-mode::after {
  border-top-color: rgba(30, 58, 138, 0.9);
}
</style>
