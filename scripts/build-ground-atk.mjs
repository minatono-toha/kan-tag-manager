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

// 1〜3 は「今の形態で装備できる」、4〜6 は「今は不可だが、改装を進めれば装備できる」。
// 4〜6 は (3 + 改装後に装備できるもの) なので、値から 3 を引けば何が解禁されるか分かる。
const LABEL = [
  '-',
  '大発系のみ',
  '内火艇のみ',
  '大発系・内火艇OK',
  '(改造後)大発系のみ',
  '(改造後)内火艇のみ',
  '(改造後)大発系・内火艇OK',
]
const FUTURE_OFFSET = 3
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

// --- 7. 「改造後に装備できる」形態(4〜6) ---
// 対地装備は改装で解禁される艦が大半なので、今 0 の形態でも改装先が装備できるなら区別する。
// 改装の系統は orig で辿る。spGroupId は特攻用の分割で改装経路をまたぐことがあるため使えない
// (三隈 → 三隈改二特(9507)、神威 → 神威改(9499) が別グループになっている)。
// 分岐改装は「最終的にどれかの形態で装備できるようになるもの」を OR で束ねる。
const formsByOrig = new Map()
for (const ship of shiplist) {
  if (!formsByOrig.has(ship.orig)) formsByOrig.set(ship.orig, [])
  formsByOrig.get(ship.orig).push(ship)
}
const nowValue = new Map([...resolved].map(([b, r]) => [b, r.value]))
const futures = []
const branchConflicts = []
for (const ship of shiplist) {
  if (nowValue.get(ship.bannerId) !== 0) continue

  // 自分より改装段階が進んだ形態のうち、実際に装備できるもの
  const later = formsByOrig
    .get(ship.orig)
    .filter((s) => s.updateLevel > ship.updateLevel && nowValue.get(s.bannerId) !== 0)
  if (later.length === 0) continue

  const unlocked = later.reduce((acc, s) => acc | nowValue.get(s.bannerId), 0)

  // OR を満たす単一の形態が無い場合だけ問題になる。つまり「大発だけ解禁する改装」と
  // 「内火艇だけ解禁する別の改装」に分岐していて、両立する形態が存在しないケース。
  // OR で束ねると「両方いける」と誤読されるため、実在したらレポートに出して人間が判断する。
  // (早潮改=大発のみ → 早潮改二=両方 のような一本道は、改二が OR を満たすので問題ない)
  if (!later.some((s) => nowValue.get(s.bannerId) === unlocked)) {
    branchConflicts.push(
      `${ship.name}(${ship.bannerId}): 単独で ${LABEL[unlocked]} になる改装先が無い → ` +
        later.map((s) => `${s.name}=${LABEL[nowValue.get(s.bannerId)]}`).join(' / ') +
        ` → OR して ${LABEL[FUTURE_OFFSET + unlocked]} とした`,
    )
  }

  const r = resolved.get(ship.bannerId)
  r.value = FUTURE_OFFSET + unlocked
  r.rule = '改装後に解禁'
  r.note = later.map((s) => s.name).join('/')
  futures.push({ ship, value: r.value, later })
}

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
const VALUES = [0, 1, 2, 3, 4, 5, 6]
const dist = VALUES.map((v) => rows.filter((r) => r.value === v).length)
const report = [
  '# ground_atk 生成レポート',
  '',
  '出典: <https://kannagi35.com/content/kantai-collection-anti-ground>',
  '',
  `- 対象形態(bannerId): ${rows.length}`,
  `- 今の形態で装備できる(1〜3): ${rows.filter((r) => r.value >= 1 && r.value <= 3).length}`,
  `- 改装後に装備できる(4〜6): ${rows.filter((r) => r.value >= 4).length}`,
  ...VALUES.map((v) => `  - ${v} (${LABEL[v]}): ${dist[v]}`),
  '',
  '## 根拠の内訳',
  '',
  '| 根拠 | 件数 |',
  '|---|---|',
  ...['出典', '出典の抜けを補完', '継承', '艦種一括', '改装後に解禁', '既定(対象外)'].map(
    (n) => `| ${n} | ${byRule(n)} |`,
  ),
  '',
  '## 分岐改装で解禁されるものが食い違う形態(要確認)',
  '',
  '改装先が複数あり、装備できるようになるものが分岐で違うもの。OR で束ねているため、',
  '「どちらの分岐でも両方いける」と誤読されうる。',
  '',
  ...(branchConflicts.length ? branchConflicts.map((c) => `- ${c}`) : ['- なし']),
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
  '## 改装後に解禁される形態(生成結果)',
  '',
  `今は装備できないが、改装を進めれば装備できるようになる形態。${futures.length} 件。`,
  '',
  '| 艦 | bannerId | ground_atk | 表示 | 解禁される形態 |',
  '|---|---|---|---|---|',
  ...futures.map(
    (f) =>
      `| ${f.ship.name} | ${f.ship.bannerId} | ${f.value} | ${LABEL[f.value]} | ${f.later.map((s) => s.name).join(' / ')} |`,
  ),
  '',
  '## 今の形態で装備できるもの(生成結果)',
  '',
  '| 艦 | bannerId | 艦種 | ground_atk | 表示 | 根拠 |',
  '|---|---|---|---|---|---|',
  ...rows
    .filter((r) => r.value >= 1 && r.value <= 3)
    .map(
      (r) => `| ${r.ship.name} | ${r.ship.bannerId} | ${r.ship.shipType} | ${r.value} | ${LABEL[r.value]} | ${r.rule} |`,
    ),
]
write('ground_atk_report.md', report.join('\n') + '\n')

console.log(`out/shiplist_ground_atk.csv   ${rows.length}行(対地装備あり ${nonZero.length})`)
console.log(`out/shiplist_ground_atk.json  Firestore投入用`)
console.log(`out/ground_atk_report.md      警告 ${warnings.length}件 / 継承 ${inherited.length}件`)
