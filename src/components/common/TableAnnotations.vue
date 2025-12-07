<template>
  <div class="mt-2 mb-2 text-s text-gray-500 space-y-1">
    <p v-if="type === 'ship'">
      ・ 艦種は上部の艦種選択ボタンから選択してください。<br>
      ・ 🔍アイコンをクリックすると艦名、艦種・艦番、速力の各列でフィルタができます。
    </p>
    <p v-if="type === 'attack'">
      ・ 海域名をクリックすると特攻情報を展開し、ボスマス名をクリックすると降順⇒昇順⇒リセットの順にソートできます。<br>
      ・ 『並べ替え』ボタンをクリックすると、海域ごと・出撃制限札ごとに並べ替えが可能です。
    </p>
    <p v-if="type === 'tag'">
      ・ 割当済の艦はグレーに、温存する艦は水色に表示されます。<br>
      ・ コメント行は自由表記で、札管理情報とともにブラウザ側に保存されます
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'ship' | 'attack' | 'tag'
}>()
</script>
