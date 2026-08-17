// ルール定義から装備特攻の全行を生成し、CSV / Firestore投入用JSON / 検証レポートを出力する。
//   node scripts/fetch-master.mjs        # eventmap を取得
//   node scripts/fetch-slotitem.mjs      # 装備マスタを取得
//   node scripts/build-eqtable.mjs 3     # eventId
//
// 出力は2つ。
//   eqattack : 装備1件 = 1行。所属グループ(grp1..3)を持つ。装備種別とステータスは公式マスタから引く。
//   eqrate   : グループ1つ = 1行。maintable と同じ横持ちで、列は mapId_N。
// どちらも eventId 列を持つ単一コレクション想定。イベントが増えても行が増えるだけ。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'out')
const eventId = Number(process.argv[2] ?? 3)

const mod = await import(`../data/events/event${eventId}.equipment.mjs`)
const rules = mod.default
const { EQUIPMENT, GROUND_EQUIPMENT, UNKNOWN_RATE_GROUPS = [] } = mod
const readMaster = (n) => JSON.parse(readFileSync(join(ROOT, 'data', 'master', `${n}.json`), 'utf8'))
const eventmap = readMaster('eventmap')
const slotitem = readMaster('slotitem')

const warnings = []
const warn = (msg) => warnings.push(msg)

// --- 装備マスタの引き当て ---
// 出典(中国語圏の分類表)は全角記号や空白が揺れるため、正規化して突き合わせる。
const norm = (s) =>
  s.normalize('NFKC').toLowerCase().replace(/（/g, '(').replace(/）/g, ')').replace(/[/・\-_\s]/g, '')
const masterByName = new Map()
for (const it of slotitem) if (!masterByName.has(norm(it.name))) masterByName.set(norm(it.name), it)
const lookup = (name, ctx) => {
  const it = masterByName.get(norm(name))
  // 名前が引けないと api_slotitem_id が決まらない。黙って落とさず止める。
  if (!it) throw new Error(`${ctx}: 「${name}」が装備マスタに無い。公式の表記に合わせること`)
  if (it.name !== name) warn(`【表記ゆれ】${ctx}: 「${name}」→ 公式表記「${it.name}」を採用した`)
  return it
}

// --- 装備種別。公式マスタの装備種別から、表示用の分類を決める ---
// 艦上(空母用/空母以外)の種別。基地専用の装備はここが空になる。
const SHIP_TYPE = {
  艦上戦闘機: '艦戦', 艦上攻撃機: '艦攻', 艦上爆撃機: '艦爆', 艦上偵察機: '艦偵',
  水上戦闘機: '水戦', 水上偵察機: '水偵', 水上爆撃機: '水爆',
}
// 夜間戦闘機・夜間攻撃機は装備種別が艦上戦闘機/艦上攻撃機のままなので、
// アイコンID でしか判別できない。夜戦・夜攻として別種別にする。
const NIGHT_TYPE = { 45: '夜戦', 46: '夜攻' }
// 基地に置いたときの種別。陸上/水上 × 攻撃機/戦闘機/偵察機 の6分類に畳む。
const BASE_TYPE = {
  陸上攻撃機: '陸攻', 大型陸上機: '陸攻', 噴式戦闘爆撃機: '陸攻',
  艦上攻撃機: '陸攻', 艦上爆撃機: '陸攻',
  局地戦闘機: '陸戦', 陸軍戦闘機: '陸戦', 艦上戦闘機: '陸戦',
  陸上偵察機: '陸偵', 大型飛行艇: '陸偵', 艦上偵察機: '陸偵',
  水上戦闘機: '水戦', 水上偵察機: '水偵', 水上爆撃機: '水攻',
}
// 列名は Firestore の eqattack に合わせる(対空=AA, 雷装=Torpedo, 爆装=Bombing,
// 対潜=ASW, 索敵=LoS, 半径=CombatRadius)。値は公式マスタから引く。
const STATS = ['AA', 'Torpedo', 'Bombing', 'ASW', 'LoS', 'CombatRadius']

// --- 倍率の計算 ---
// 艦上: A組は全マップ倍率 × 個別マス倍率、B組は個別マス倍率のみ。基地: C組の個別マス倍率のみ。
const round8 = (v) => Number(v.toFixed(8))
const mapsOfEvent = eventmap.filter((m) => m.eventId === eventId).sort((a, b) => a.mapId - b.mapId)
const mapLabel = new Map(mapsOfEvent.map((m) => [m.mapId, `${m.stage}(${m.mapPlace})`]))
const knownMapIds = new Set(mapsOfEvent.map((m) => m.mapId))

// 積んだ数で倍率が変わる組があるため、倍率は (組, 個数) 単位で持つ。
// A/B/C 組のように「同組は重複しない」ものは count=1 の1行だけになる。
const rateOf = new Map() // grp -> { count -> { mapId -> 倍率 } }
const slotOf = new Map() // grp -> '艦上' | '基地'
const put = (grp, slot, mapId, value, count = 1) => {
  if (!rateOf.has(grp)) rateOf.set(grp, {})
  const byCount = rateOf.get(grp)
  if (!byCount[count]) byCount[count] = {}
  byCount[count][mapId] = round8(value)
  slotOf.set(grp, slot)
}
const rateAt = (grp, mapId, count = 1) => rateOf.get(grp)?.[count]?.[mapId]

for (const stage of rules.stages) {
  for (const node of stage.nodes) {
    for (const mapId of node.mapIds) {
      if (!knownMapIds.has(mapId)) warn(`【地点不明】${stage.stage}/${node.place}: mapId ${mapId} は eventmap に無い`)
      for (const [grp, rate] of Object.entries(node.ship ?? {})) {
        // 全マップ倍率を持つのは A組だけ。持たない組は個別マス倍率がそのまま総倍率。
        put(grp, '艦上', mapId, (stage.mapWide?.[grp] ?? 1) * rate)
      }
      for (const [grp, rate] of Object.entries(node.base ?? {})) put(grp, '基地', mapId, rate)
      // 機数倍率。個数ごとに倍率が違うので、そのまま個数別の行にする。
      for (const [grp, table] of Object.entries(node.countRates ?? {})) {
        for (const [count, rate] of Object.entries(table)) {
          put(grp, '艦上', mapId, rate, Number(count))
        }
      }
    }
  }
  // 個別マス倍率が無いマスでも、全マップ倍率だけは効く(A組)
  for (const [grp, wide] of Object.entries(stage.mapWide ?? {})) {
    for (const node of stage.nodes) {
      for (const mapId of node.mapIds) {
        if (rateAt(grp, mapId) == null) put(grp, '艦上', mapId, wide)
      }
    }
  }
  if (stage.unresolvedMapWide) {
    const g = Object.entries(stage.unresolvedMapWide).map(([k, v]) => `${k}=${v}`).join(', ')
    warn(`【出典の解釈】${stage.stage}: 全マップ有効の ${g} は個別マス倍率と積算していない(個別マス値=総倍率とみなした)`)
  }
}
for (const node of rules.ground?.nodes ?? []) {
  for (const mapId of node.mapIds) {
    for (const [grp, rate] of Object.entries(node.rates)) put(grp, '艦上', mapId, rate)
  }
}
for (const grp of UNKNOWN_RATE_GROUPS) {
  if (!rateOf.has(grp)) {
    rateOf.set(grp, { 1: {} })
    slotOf.set(grp, grp.startsWith('C') ? '基地' : '艦上')
  }
}

// (組, 個数) の行を出力順に並べる。個数が2以上ある組は機数倍率。
const rateRows = []
for (const grp of [...rateOf.keys()].sort()) {
  for (const count of Object.keys(rateOf.get(grp)).map(Number).sort((a, b) => a - b)) {
    rateRows.push({ grp, count })
  }
}
const maxCountOf = (grp) => Math.max(...Object.keys(rateOf.get(grp)).map(Number))

// --- 装備行 ---
const rows = []
const buildRow = (name, groups, ctx) => {
  const m = lookup(name, ctx)
  const isGround = groups.every((g) => g.startsWith('G'))
  const shipType = isGround ? '対地' : NIGHT_TYPE[m.icon] ?? SHIP_TYPE[m.type] ?? ''
  const baseType = isGround ? '' : BASE_TYPE[m.type] ?? ''
  if (!isGround && !shipType && !baseType) warn(`【種別不明】${name}: 公式の装備種別「${m.type}」に対応する分類が無い`)
  for (const g of groups) {
    if (!rateOf.has(g)) warn(`【倍率なし】${name}: グループ ${g} はどの地点にも倍率が無い`)
  }
  if (groups.length > 3) warn(`【所属が4組以上】${name}: ${groups.join('/')} — grp列を増やす必要がある`)
  rows.push({
    eventId,
    eqId: m.id,
    name: m.name,
    officialType: m.type,
    eqType: shipType,
    baseType,
    stats: Object.fromEntries(STATS.map((s) => [s, isGround ? '' : m[s]])),
    groups: [...groups].sort(),
  })
}
for (const [name, groups] of Object.entries(EQUIPMENT)) buildRow(name, groups, '航空機')
for (const [name, groups] of Object.entries(GROUND_EQUIPMENT)) buildRow(name, groups, '対地装備')

const dupIds = rows.map((r) => r.eqId).filter((v, i, a) => a.indexOf(v) !== i)
if (dupIds.length) warn(`【eqId重複】${[...new Set(dupIds)].join(',')} — 同じ装備が2回定義されている`)

// --- 出力 ---
mkdirSync(OUT_DIR, { recursive: true })
// Excel で CSV を開いたままだと書き込めない。1ファイルの失敗で全体を止めない。
const write = (file, content) => {
  try {
    writeFileSync(join(OUT_DIR, file), content)
  } catch (e) {
    if (e.code !== 'EBUSY' && e.code !== 'EPERM') throw e
    warn(`【出力できず】out/${file} がロックされている(Excel等で開いていないか)`)
    console.error(`! out/${file} はロックされているためスキップした`)
  }
}
const csvCell = (v) => (typeof v === 'string' && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
const toCsv = (r) => '﻿' + r.map((x) => x.map(csvCell).join(',')).join('\r\n') + '\r\n'

// 1. eqattack
const attackHeader = ['eventId', 'eqId', 'name', 'officialType', 'eqType', 'baseType',
  ...STATS, 'grp1', 'grp2', 'grp3']
const attackCsv = [attackHeader]
for (const r of rows) {
  attackCsv.push([r.eventId, r.eqId, r.name, r.officialType, r.eqType, r.baseType,
    ...STATS.map((s) => r.stats[s]), r.groups[0] ?? '', r.groups[1] ?? '', r.groups[2] ?? ''])
}
write(`eqattack_event${eventId}.csv`, toCsv(attackCsv))
write(`eqattack_event${eventId}.json`, JSON.stringify(rows.map((r) => {
  const doc = { eventId: r.eventId, eqId: r.eqId, name: r.name, eqType: r.eqType, baseType: r.baseType }
  for (const s of STATS) if (r.stats[s] !== '' && r.stats[s] !== 0) doc[s] = r.stats[s]
  r.groups.forEach((g, i) => { doc[`grp${i + 1}`] = g })
  return doc
}), null, 1))

// 2. eqrate
const grps = [...rateOf.keys()].sort()
const rateHeader = ['eventId', 'grp', 'slot', 'count', ...mapsOfEvent.map((m) => `mapId_${m.mapId}`)]
const rateCsv = [rateHeader]
for (const { grp, count } of rateRows) {
  rateCsv.push([eventId, grp, slotOf.get(grp), count,
    ...mapsOfEvent.map((m) => rateAt(grp, m.mapId, count) ?? '')])
}
write(`eqrate_event${eventId}.csv`, toCsv(rateCsv))
write(`eqrate_event${eventId}.json`, JSON.stringify(rateRows.map(({ grp, count }) => {
  const doc = { eventId, grp, slot: slotOf.get(grp), count }
  for (const m of mapsOfEvent) {
    const v = rateAt(grp, m.mapId, count)
    if (v != null) doc[`mapId_${m.mapId}`] = v
  }
  return doc
}), null, 1))

// 3. レポート
const byType = {}
for (const r of rows) {
  const k = r.eqType || `(基地専用/${r.baseType})`
  byType[k] = (byType[k] ?? 0) + 1
}
const inSlot = (r, pre) => r.groups.some((g) => pre.includes(g[0]))
const report = [
  `# 装備特攻テーブル 生成レポート (eventId=${eventId})`,
  '',
  `- 装備: ${rows.length}件 (航空機 ${Object.keys(EQUIPMENT).length} / 対地 ${Object.keys(GROUND_EQUIPMENT).length})`,
  `- グループ: ${grps.length} (${grps.map((g) => (maxCountOf(g) > 1 ? `${g}(機数${maxCountOf(g)}まで)` : g)).join(' / ')})`,
  `- eqrate の行数: ${rateRows.length} (組 × 個数)`,
  `- 列: ${mapsOfEvent.length} (${mapsOfEvent.map((m) => mapLabel.get(m.mapId)).join(' / ')})`,
  `- 艦上で特効が付く装備: ${rows.filter((r) => inSlot(r, 'AB')).length}`,
  `- 基地で特効が付く装備: ${rows.filter((r) => inSlot(r, 'C')).length}`,
  `- 対地: ${rows.filter((r) => inSlot(r, 'G')).length}`,
  '',
  '## 種別ごとの件数',
  '',
  ...Object.entries(byType).map(([k, v]) => `- ${k}: ${v}`),
  '',
  '## グループ倍率',
  '',
  '| 組 | 搭載先 | 個数 | ' + mapsOfEvent.map((m) => mapLabel.get(m.mapId)).join(' | ') + ' |',
  '|---|---|---|' + mapsOfEvent.map(() => '---|').join(''),
  ...rateRows.map(({ grp, count }) => `| ${grp} | ${slotOf.get(grp)} | ${count} | ` +
    mapsOfEvent.map((m) => rateAt(grp, m.mapId, count) ?? '').join(' | ') + ' |'),
  '',
  '## 警告',
  ...(warnings.length ? warnings.map((w) => `- ${w}`) : ['- なし']),
]
write('eq_report.md', report.join('\n') + '\n')

console.log(`out/eqattack_event${eventId}.csv   ${rows.length}行`)
console.log(`out/eqrate_event${eventId}.csv     ${rateRows.length}行(${grps.length}組) x ${mapsOfEvent.length}列`)
console.log(`out/eq_report.md                  警告 ${warnings.length}件`)
