// src/constants/attackSource.ts

// 特攻倍率の出典。data/events/*.rules.mjs はこのドキュメントだけを根拠に書く。
// zekamashi.net / X の特効まとめ画像は検証用の位置づけで、値の採用はしない
// (食い違いは scripts/build-maintable.mjs の checks 経由で out/report.md に出す)。
//
// 出典を読み直したら checkedAt を書き換える。
export const ATTACK_SOURCE = {
  name: '2026年夏活信息搬运贴备份档',
  url: 'https://x.com/yukicacoon',
  checkedAt: '7/17 13:00',
}

// 「◯◯ から引用(◯◯時点)」
export const ATTACK_SOURCE_LABEL = `${ATTACK_SOURCE.name} から引用(${ATTACK_SOURCE.checkedAt}時点)`
