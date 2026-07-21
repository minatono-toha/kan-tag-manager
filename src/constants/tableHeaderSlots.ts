// src/constants/tableHeaderSlots.ts

// 3つの表は「ヘッダ行」と「表本体」を別のテーブルに分け、ヘッダだけを
// 縦スクロール領域の外にある帯（ヘッダ帯）へ Teleport する。
// これにより
//   ・3表のヘッダは同じ flex 行に並ぶので、高さがブラウザ側で自動的に揃う
//     （実測して配り直す必要がないので、原理的に縦位置がずれない）
//   ・縦スクロールしてもヘッダ帯は動かない（position:sticky が不要）
// を同時に満たす。
//
// Teleport 先の id。App.vue がこの id を持つ空要素をヘッダ帯に置く。
export const HEADER_SLOT_IDS = {
  tagManage: 'tag-manage-header-slot',
  shipList: 'ship-list-header-slot',
  attack: 'attack-header-slot',
} as const

export const headerSlotSelector = (key: keyof typeof HEADER_SLOT_IDS): string =>
  `#${HEADER_SLOT_IDS[key]}`
