// ルール定義から shiplist.ground_atk を生成し、CSV / Firestore投入用JSON / 検証レポートを出力する。
//   node scripts/fetch-master.mjs     # 先にマスタを取得
//   node scripts/build-ground-atk.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SOURCE_ROWS,
  SOURCE_ROWS_BY_BANNER,
  SOURCE_FIXES,
  TYPE_RULES,
  INHERIT_BLOCK,
} from '../data/ground-atk.rules.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'out')

const shiplist = JSON.parse(readFileSync(join(ROOT, 'data', 'master', 'shiplist.json'), 'utf8'))

const warnings = []
const warn = (msg) => warnings.push(msg)

const LABEL = ['-', '大発系のみ', '内火艇のみ', '大発系・内火艇OK']
const encode = ([boat, tank]) => (boat ? 1 : 0) + (tank ? 2 : 0)

// bannerId -> { value, rule, note }。先に入った規則が勝つ(出典の明示行 > 補完 > 継承 > 艦種一括)。
const resolved = new Map()
const assign = (ship, value, rule, note = '') => {
  if (resolved.has(ship.bannerId)) return false
  resolved.set(ship.bannerId, { ship, value, rule, note })
  return true
}

// --- 1. 出典の表(艦名) ---
const byName = new Map()
for (const ship of shiplist) {
  if (!byName.has(ship.name)) byName.set(ship.name, [])
  byName.get(ship.name).push(ship)
}
for (const [name, pair] of Object.entries(SOURCE_ROWS)) {
  const hits = byName.get(name)
  if (!hits) {
    warn(`【艦名未解決】出典の「${name}」が shiplist に存在しない。艦名の表記を確認すること`)
    continue
  }
  if (hits.length > 1) {
    warn(`【艦名が一意でない】「${name}」に ${hits.length} 形態が該当(bannerId: ${hits.map((h) => h.bannerId).join('/')})。SOURCE_ROWS_BY_BANNER で指定すること`)
    continue
  }
  assign(hits[0], encode(pair), '出典')
}

// --- 2. 出典の表(bannerId 指定。同名形態がある艦) ---
for (const [bannerId, pair] of Object.entries(SOURCE_ROWS_BY_BANNER)) {
  const ship = shiplist.find((s) => s.bannerId === Number(bannerId))
  if (!ship) {
    warn(`【bannerId 未解決】SOURCE_ROWS_BY_BANNER の ${bannerId} が shiplist に存在しない`)
    continue
  }
  assign(ship, encode(pair), '出典')
}

// --- 3. 出典の抜けの補完 ---
const fixes = []
for (const [name, def] of Object.entries(SOURCE_FIXES)) {
  const hits = byName.get(name) ?? []
  if (hits.length !== 1) {
    warn(`【補完の対象なし】SOURCE_FIXES の「${name}」が shiplist で一意に解決できない`)
    continue
  }
  if (!assign(hits[0], encode(def.value), '出典の抜けを補完', def.reason)) {
    warn(`【補完が不要】SOURCE_FIXES の「${name}」は出典の表にも載っている。どちらかを消すこと`)
    continue
  }
  fixes.push({ ship: hits[0], value: encode(def.value), reason: def.reason })
}

// --- 4. 改装形態への継承 ---
// 出典は「千歳」「あきつ丸」のように基本形しか載せない艦がある。改装しても艦種が変わらない限り
// 可否は変わらないため、同一系統(orig)・同一艦種(shipType)で updateLevel が真に大きい形態に引き継ぐ。
//  - 艦種が変わる形態(千歳航=軽空母 など)は引き継がない。装備可否は艦種に依存するため。
//  - 出典に自分の行がある形態は 1〜3 で確定済みなので上書きしない(例: 秋津洲=0 は 秋津洲改=3 の影響を受けない)。
//  - updateLevel が同じ分岐(夕張改二特 と 夕張改二丁)には波及しない。
const inherited = []
for (const ship of shiplist) {
  if (resolved.has(ship.bannerId)) continue
  if (INHERIT_BLOCK[ship.bannerId]) continue

  // 継承元の候補: 同一系統・同一艦種で updateLevel が小さく、値が 0 でない形態。最も近いものを採る。
  const source = shiplist
    .filter(
      (s) =>
        s.orig === ship.orig &&
        s.shipType === ship.shipType &&
        s.updateLevel < ship.updateLevel &&
        (resolved.get(s.bannerId)?.value ?? 0) !== 0,
    )
    .sort((a, b) => b.updateLevel - a.updateLevel)[0]
  if (!source) continue

  const { value } = resolved.get(source.bannerId)
  assign(ship, value, '継承', `${source.name} から`)
  inherited.push({ ship, source, value })
}

// --- 5. 艦種一括ルール(出典の本文) ---
const typeRuleHits = []
for (const rule of TYPE_RULES) {
  const value = encode(rule.value)
  const hits = []
  for (const ship of shiplist) {
    if (!rule.shipTypes.includes(ship.shipType)) continue
    if (rule.excludeNames?.includes(ship.name)) continue
    if (assign(ship, value, '艦種一括', rule.reason)) hits.push(ship)
  }
  if (hits.length === 0) warn(`【空ルール】艦種一括ルール「${rule.reason}」に該当艦なし`)
  typeRuleHits.push({ rule, value, hits })
}

// --- 6. 残りは 0 ---
for (const ship of shiplist) assign(ship, 0, '既定(対象外)')

// --- 出力 ---
mkdirSync(OUT_DIR, { recursive: true })
const write = (file, content) => {
  try {
    writeFileSync(join(OUT_DIR, file), content)
  } catch (e) {
    if (e.code !== 'EBUSY' && e.code !== 'EPERM') throw e
    warn(`【出力できず】out/${file} がロックされている(Excel等で開いていないか)。他のファイルは更新済み`)
    console.error(`! out/${file} はロックされているためスキップした`)
  }
}
const csvCell = (v) => (typeof v === 'string' && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
const toCsv = (rows) => '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n'

const rows = [...resolved.values()].sort(
  (a, b) => a.ship.libraryId - b.ship.libraryId || a.ship.updateLevel - b.ship.updateLevel,
)
const nonZero = rows.filter((r) => r.value !== 0)

// 1. スプレッドシート貼り付け用。docId で既存行に突き合わせる(新規作成にならないよう必ず sync してから貼る)。
write(
  'shiplist_ground_atk.csv',
  toCsv([
    ['docId', 'bannerId', '艦名', '艦種', 'ground_atk', '表示', '根拠', '備考'],
    ...rows.map((r) => [
      r.ship._id,
      r.ship.bannerId,
      r.ship.name,
      r.ship.shipType,
      r.value,
      LABEL[r.value],
      r.rule,
      r.note,
    ]),
  ]),
)

// 2. Firestore 投入用(既存 shiplist ドキュメントへの ground_atk 追加)
write(
  'shiplist_ground_atk.json',
  JSON.stringify(
    rows.map((r) => ({ _id: r.ship._id, bannerId: r.ship.bannerId, name: r.ship.name, ground_atk: r.value })),
    null,
    1,
  ),
)

// 3. 検証レポート
const byRule = (name) => rows.filter((r) => r.rule === name).length
const dist = [0, 1, 2, 3].map((v) => rows.filter((r) => r.value === v).length)
const report = [
  '# ground_atk 生成レポート',
  '',
  '出典: <https://kannagi35.com/content/kantai-collection-anti-ground>',
  '',
  `- 対象形態(bannerId): ${rows.length}`,
  `- 対地装備あり: ${nonZero.length}`,
  ...[0, 1, 2, 3].map((v) => `  - ${v} (${LABEL[v]}): ${dist[v]}`),
  '',
  '## 根拠の内訳',
  '',
  '| 根拠 | 件数 |',
  '|---|---|',
  ...['出典', '出典の抜けを補完', '継承', '艦種一括', '既定(対象外)'].map(
    (n) => `| ${n} | ${byRule(n)} |`,
  ),
  '',
  '## 出典に行が無く、こちらで補完した形態',
  '',
  '出典の表に載っていないが、装備可能と確認できたもの。**出典を直接転記していない唯一の箇所なので要確認**。',
  '',
  ...(fixes.length
    ? [
        '| 艦 | ground_atk | 根拠 |',
        '|---|---|---|',
        ...fixes.map((f) => `| ${f.ship.name}(${f.ship.bannerId}) | ${f.value} (${LABEL[f.value]}) | ${f.reason} |`),
      ]
    : ['- なし']),
  '',
  '## 改装形態に引き継いだもの(意図どおりか確認)',
  '',
  '出典が基本形しか載せていない艦の、同一艦種の改装形態。艦種が変わる形態(千歳航など)は引き継いでいない。',
  '',
  ...(inherited.length
    ? [
        '| 艦 | 艦種 | 継承元 | ground_atk |',
        '|---|---|---|---|',
        ...inherited.map(
          (i) =>
            `| ${i.ship.name}(${i.ship.bannerId}) | ${i.ship.shipType} | ${i.source.name} | ${i.value} (${LABEL[i.value]}) |`,
        ),
      ]
    : ['- なし']),
  '',
  '## 艦種一括ルールの適用',
  '',
  ...typeRuleHits.flatMap(({ rule, value, hits }) => [
    `- ${rule.reason}`,
    `  - ground_atk=${value} (${LABEL[value]}) を ${hits.length} 形態に付与`,
    `  - 除外: ${rule.excludeNames?.join(' / ') ?? 'なし'}`,
  ]),
  '',
  '## 警告',
  '',
  ...(warnings.length ? warnings.map((w) => `- ${w}`) : ['- なし']),
  '',
  '## 対地装備ありの形態(生成結果)',
  '',
  '| 艦 | bannerId | 艦種 | ground_atk | 表示 | 根拠 |',
  '|---|---|---|---|---|---|',
  ...nonZero.map(
    (r) => `| ${r.ship.name} | ${r.ship.bannerId} | ${r.ship.shipType} | ${r.value} | ${LABEL[r.value]} | ${r.rule} |`,
  ),
]
write('ground_atk_report.md', report.join('\n') + '\n')

console.log(`out/shiplist_ground_atk.csv   ${rows.length}行(対地装備あり ${nonZero.length})`)
console.log(`out/shiplist_ground_atk.json  Firestore投入用`)
console.log(`out/ground_atk_report.md      警告 ${warnings.length}件 / 継承 ${inherited.length}件`)
