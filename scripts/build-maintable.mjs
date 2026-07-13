// ルール定義から maintable の全セルを生成し、CSV / Firestore投入用JSON / 検証レポートを出力する。
//   node scripts/fetch-master.mjs      # 先にマスタを取得
//   node scripts/build-maintable.mjs 3 # eventId
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { NATIONALITY_BY_CLASS, NATIONALITY_BY_NAME, SP_GROUP_SPLITS } from '../data/ship-meta.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'out')
const eventId = Number(process.argv[2] ?? 3)

const rules = (await import(`../data/events/event${eventId}.rules.mjs`)).default
const { TYPE_SETS } = await import(`../data/events/event${eventId}.rules.mjs`)
const readMaster = (n) => JSON.parse(readFileSync(join(ROOT, 'data', 'master', `${n}.json`), 'utf8'))
const shiplist = readMaster('shiplist')
const eventmap = readMaster('eventmap')
const maintable = readMaster('maintable')

const warnings = []
const warn = (msg) => warnings.push(msg)

// --- 国籍(形態単位) ---
// shiplist に nationality があればそれを使う。無ければ class 名から推定し、
// 外国艦らしい名前なのに推定できなかったものは警告を出す(黙って JP 扱いにしない)。
const nationalityOf = (ship) => {
  if (ship.nationality) return ship.nationality
  if (NATIONALITY_BY_NAME[ship.name]) return NATIONALITY_BY_NAME[ship.name]
  const hit = Object.keys(NATIONALITY_BY_CLASS).find((c) => (ship.class ?? '').startsWith(c))
  if (hit) return NATIONALITY_BY_CLASS[hit]
  if (/^[A-Za-zÀ-ÿЀ-ӿ]/.test(ship.name)) {
    warn(`【国籍不明】${ship.name}(class: ${ship.class}) を JP として扱った。ship-meta.mjs に追加すること`)
  }
  return 'JP'
}

// --- 特攻グループ(分割案を適用) ---
const splitOf = new Map() // bannerId -> 新spGroupId
for (const [gid, def] of Object.entries(SP_GROUP_SPLITS)) {
  for (const b of def.banners) splitOf.set(b, Number(gid))
}
const groupIdOf = (ship) => splitOf.get(ship.bannerId) ?? ship.spGroupId ?? ship.orig

// spGroupId -> { rep(代表形態), forms[] }。代表は bannerId 最小(useShips.getUniqueOrigs と同じ規則)。
const groups = new Map()
for (const ship of shiplist) {
  const gid = groupIdOf(ship)
  const g = groups.get(gid) ?? { gid, forms: [] }
  g.forms.push(ship)
  groups.set(gid, g)
}
for (const g of groups.values()) {
  g.forms.sort((a, b) => a.bannerId - b.bannerId)
  g.rep = g.forms[0] // 代表形態 = bannerId 最小(useShips.getUniqueOrigs と同じ規則)
  g.nationality = nationalityOf(g.rep)
  g.category = g.rep.shipTypeCategory
  // 表示名は libraryId 最小の形態(=基本形)。代表形態が「◯◯改」になる艦があるため分ける。
  // 分割したグループは、どの形態の行か分かるようにラベルを使う。
  g.name = SP_GROUP_SPLITS[g.gid]?.label ?? [...g.forms].sort((a, b) => a.libraryId - b.libraryId)[0].name
}

// --- 艦名 -> 特攻グループ群 ---
// 出典は「北上」のように基本形の名前で書かれ、改装形態も含意する。よって系統(orig)全体に展開し、
// 分割の結果2グループ以上になった場合は必ずレポートに出して人間が確認できるようにする。
const rowsByName = new Map()
for (const ship of shiplist) {
  if (!rowsByName.has(ship.name)) rowsByName.set(ship.name, [])
  rowsByName.get(ship.name).push(ship)
}
const expansions = []
const resolveShipName = (name, context) => {
  const exact = rowsByName.get(name)
  if (!exact) {
    warn(`【艦名未解決】${context}: 「${name}」は shiplist に存在しない`)
    return []
  }
  const origs = new Set(exact.map((s) => s.orig))
  const gids = new Set()
  for (const ship of shiplist) if (origs.has(ship.orig)) gids.add(groupIdOf(ship))
  if (gids.size > 1) {
    const labels = [...gids].map((g) => `${groups.get(g).name}(${g})`).join(' + ')
    expansions.push(`${context}: 「${name}」→ ${labels}`)
  }
  return [...gids]
}

// --- グループ定義 -> 所属spGroupId集合 ---
const resolveGroup = (stage, gname, def) => {
  const ctx = `${stage.stage}/${gname}`
  const members = new Set()
  for (const name of def.ships ?? []) for (const gid of resolveShipName(name, ctx)) members.add(gid)
  if (def.types || def.nationality) {
    const cats = new Set((def.types ?? []).flatMap((t) => TYPE_SETS[t] ?? [t]))
    for (const g of groups.values()) {
      if (cats.size > 0 && !cats.has(g.category)) continue
      if (def.nationality && g.nationality !== def.nationality) continue
      members.add(g.gid)
    }
  }
  for (const name of def.excludeShips ?? []) {
    for (const g of groups.values()) if (g.name === name || g.rep.name === name) members.delete(g.gid)
  }
  if (members.size === 0) warn(`【空グループ】${ctx}: 該当艦なし`)
  return members
}

// --- 倍率計算 ---
// 同一スコープ(全図/地点)内で艦種倍率が2つ以上該当したらルールの書き方が曖昧 → 即エラー
const typeRate = (types, category, ctx) => {
  const hits = Object.entries(types ?? {}).filter(([t]) => (TYPE_SETS[t] ?? [t]).includes(category))
  if (hits.length > 1) {
    throw new Error(`${ctx}: 艦種 ${category} に ${hits.map((h) => h[0]).join('/')} が同時該当。定義を分けること`)
  }
  return hits.length ? hits[0][1] : 1
}
const groupRate = (rates, memberOf, gid) => {
  let r = 1
  for (const [gname, rate] of Object.entries(rates ?? {})) {
    if (memberOf.get(gname)?.has(gid)) r *= rate
  }
  return r
}
const round8 = (v) => Number(v.toFixed(8))

const mapsOfEvent = eventmap.filter((m) => m.eventId === eventId).sort((a, b) => a.mapId - b.mapId)
const mapLabel = new Map(mapsOfEvent.map((m) => [m.mapId, `${m.stage}(${m.mapPlace})`]))

const cells = new Map() // gid -> { mapId -> value }
const mapWideByStage = new Map() // gid -> { stage -> value }
for (const g of groups.values()) {
  cells.set(g.gid, {})
  mapWideByStage.set(g.gid, {})
}

// グループ内に艦種の違う形態が混在し、かつ倍率が割れる艦を検出する。
// (例: 千歳は水母形態と軽空母形態で全図倍率が変わる → 別グループに分けないと表現できない)
const rateSignature = (category) =>
  rules.stages
    .flatMap((s) => [
      typeRate(s.mapWide.types, category, `${s.stage}/全図`),
      ...s.nodes.map((n) => typeRate(n.types, category, `${s.stage}/${n.mapIds.join(',')}`)),
    ])
    .join(',')
for (const g of groups.values()) {
  const cats = [...new Set(g.forms.map((f) => f.shipTypeCategory))]
  if (cats.length < 2) continue
  if (new Set(cats.map(rateSignature)).size < 2) continue // 同じ倍率区分なら問題なし(例: 伊勢=戦艦/航空戦艦)
  const detail = cats.map((c) => `${c}: ${g.forms.filter((f) => f.shipTypeCategory === c).map((f) => f.name).join('/')}`)
  warn(`【形態で倍率が割れる】${g.name}(${g.gid}) — ${detail.join(' / ')}。SP_GROUP_SPLITS での分割を検討`)
}

for (const stage of rules.stages) {
  const memberOf = new Map()
  for (const [gname, def] of Object.entries(stage.groups)) {
    memberOf.set(gname, resolveGroup(stage, gname, def))
  }
  for (const g of groups.values()) {
    const wide =
      typeRate(stage.mapWide.types, g.category, `${stage.stage}/全図`) *
      groupRate(stage.mapWide.groups, memberOf, g.gid)
    mapWideByStage.get(g.gid)[stage.stage] = round8(wide)
    for (const node of stage.nodes) {
      const rate =
        wide *
        typeRate(node.types, g.category, `${stage.stage}/${node.mapIds.join(',')}`) *
        groupRate(node.groups, memberOf, g.gid)
      for (const mapId of node.mapIds) cells.get(g.gid)[mapId] = round8(rate)
    }
  }
}

// --- 検算(画像から読み取った期待値との突き合わせ) ---
const byName = new Map([...groups.values()].map((g) => [g.name, g]))
const checkResults = []
for (const c of rules.checks ?? []) {
  const gid = c.gid ?? byName.get(c.ship)?.gid
  if (gid == null) {
    warn(`【検算対象なし】${c.ship}`)
    continue
  }
  const actual = cells.get(gid)[c.mapId] ?? 1
  checkResults.push({
    label: `${groups.get(gid).name}(${gid}) ${mapLabel.get(c.mapId) ?? c.mapId}`,
    expect: c.expect,
    actual,
    ok: Math.abs(actual - c.expect) < 1e-8,
    note: c.note ?? '',
  })
}
const failed = checkResults.filter((c) => !c.ok)

// --- 出力 ---
mkdirSync(OUT_DIR, { recursive: true })
// Excel で CSV を開いたままだと書き込めない。1ファイルの失敗で全体を止めない。
const write = (file, content) => {
  try {
    writeFileSync(join(OUT_DIR, file), content)
  } catch (e) {
    if (e.code !== 'EBUSY' && e.code !== 'EPERM') throw e
    warn(`【出力できず】out/${file} がロックされている(Excel等で開いていないか)。他のファイルは更新済み`)
    console.error(`! out/${file} はロックされているためスキップした`)
  }
}
const sorted = [...groups.values()].sort((a, b) => a.rep.libraryId - b.rep.libraryId)
const stageNames = rules.stages.map((s) => s.stage)
const csvCell = (v) => (typeof v === 'string' && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
const toCsv = (rows) => '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n'

// 1. スプレッドシート用の一覧
const header = [
  'spGroupId', '艦名(代表形態)', '艦種', '国籍', '形態',
  ...stageNames.map((s) => `${s}全図`),
  ...mapsOfEvent.map((m) => mapLabel.get(m.mapId)),
]
const csvRows = [header]
for (const g of sorted) {
  csvRows.push([
    g.gid,
    g.name,
    g.category,
    g.nationality,
    g.forms.map((f) => f.name).join('/'),
    ...stageNames.map((s) => mapWideByStage.get(g.gid)[s] ?? 1),
    ...mapsOfEvent.map((m) => cells.get(g.gid)[m.mapId] ?? 1),
  ])
}
write(`maintable_event${eventId}.csv`, toCsv(csvRows))

// 2. Firestore 投入用。orig は互換のため spGroupId と同値で入れる。
// shipTypeCategory は shiplist から引けるうえ SPA も参照していないため、二重管理を避けて持たせない。
// name は Firestore コンソールで行を判別するためのラベル(こちらも SPA は参照していない)。
const docs = sorted.map((g) => {
  const doc = {
    eventId,
    orig: g.gid,
    spGroupId: g.gid,
    name: g.name,
  }
  for (const m of mapsOfEvent) doc[`mapId_${m.mapId}`] = cells.get(g.gid)[m.mapId] ?? 1
  return doc
})
write(`maintable_event${eventId}.json`, JSON.stringify(docs, null, 1))

// 3. shiplist パッチ案(spGroupId / nationality)。CSV は目視確認用、JSON は投入用。
// nationality は shiplist に入れなくても生成はできる(ship-meta.mjs で代替)。入れる場合は形態(bannerId)単位。
const patch = [['docId', 'bannerId', '艦名', '現spGroupId', '新spGroupId', 'nationality', '分割理由']]
const patchDocs = []
for (const ship of shiplist) {
  const gid = groupIdOf(ship)
  const cur = ship.spGroupId ?? null
  const nat = nationalityOf(ship)
  const gidChanged = cur !== gid && gid !== ship.orig
  const natMissing = ship.nationality !== nat
  if (!gidChanged && !natMissing) continue
  patch.push([
    ship._id, ship.bannerId, ship.name, cur ?? '(なし)', gidChanged ? gid : '',
    nat, gidChanged ? SP_GROUP_SPLITS[gid]?.reason ?? '' : '',
  ])
  const fields = { nationality: nat }
  if (gidChanged) fields.spGroupId = gid
  patchDocs.push({ _id: ship._id, name: ship.name, bannerId: ship.bannerId, ...fields })
}
write('shiplist_patch.csv', toCsv(patch))
write('shiplist_patch.json', JSON.stringify(patchDocs, null, 1))

// 4. 分割で新設したグループの、過去イベント行の補完。
// legacyId のある艦(龍鳳/Glorious)は、別採番で手入力済みの行が既にあるのでその値を引き継ぐ。
// それ以外は分割元グループの値をコピーする(過去イベントでは同一行だったため)。
const backfill = []
const orphans = []
for (const [gid, def] of Object.entries(SP_GROUP_SPLITS)) {
  const parentOrig = shiplist.find((s) => s.bannerId === def.banners[0])?.orig
  const sourceId = def.legacyId ?? parentOrig
  for (const old of maintable.filter((d) => (d.spGroupId ?? d.orig) === sourceId && d.eventId !== eventId)) {
    const { _id, shipTypeCategory, ...rest } = old
    backfill.push({ ...rest, orig: Number(gid), spGroupId: Number(gid), name: def.label })
    if (def.legacyId) orphans.push({ _id, eventId: old.eventId, orig: old.orig, name: old.name, 置換後: Number(gid) })
  }
}
write('maintable_backfill.json', JSON.stringify(backfill, null, 1))
// 上の backfill で置き換わる、旧採番の行(削除対象)
write('maintable_orphans.json', JSON.stringify(orphans, null, 1))

// 5. 検証レポート
const nonTrivial = docs.filter((d) => mapsOfEvent.some((m) => d[`mapId_${m.mapId}`] !== 1))
const existing = maintable.filter((d) => d.eventId === eventId)
const report = [
  `# maintable 生成レポート (eventId=${eventId})`,
  '',
  `- 生成行数: ${docs.length} (うち特攻あり ${nonTrivial.length})`,
  `- 列数: ${mapsOfEvent.length} (${mapsOfEvent.map((m) => mapLabel.get(m.mapId)).join(' / ')})`,
  `- 生成セル数: ${docs.length * mapsOfEvent.length}`,
  `- Firestore の既存行: ${existing.length}`,
  `- 検算(画像との突き合わせ): ${checkResults.length - failed.length}/${checkResults.length} 一致`,
  '',
  '## 画像と食い違うセル(出典ドキュメントを優先して採用済み)',
  '',
  'X投稿の画像から読み取った値と生成値が違うもの。方針として出典(Googleドキュメント)を正とするため、',
  '生成値をそのまま採用している。画像側が正しいと判明した場合はルール定義を直して再生成する。',
  '',
  ...(failed.length
    ? [
        '| セル | 生成値(出典) | 画像 | 備考 |',
        '|---|---|---|---|',
        ...failed.map((c) => `| ${c.label} | ${c.actual} | ${c.expect} | ${c.note} |`),
      ]
    : ['- なし(全て一致)']),
  '',
  '## 艦名が複数グループに展開されたもの(意図どおりか確認)',
  ...(expansions.length ? expansions.map((e) => `- ${e}`) : ['- なし']),
  '',
  '## 警告',
  ...(warnings.length ? warnings.map((w) => `- ${w}`) : ['- なし']),
  '',
  '## 特攻ありの艦(生成結果)',
  '',
  '| 艦 | 艦種 | ' + mapsOfEvent.map((m) => mapLabel.get(m.mapId)).join(' | ') + ' |',
  '|---|---|' + mapsOfEvent.map(() => '---|').join(''),
  ...nonTrivial.map(
    (d) =>
      `| ${d.name} | ${groups.get(d.spGroupId).category} | ` +
      mapsOfEvent.map((m) => (d[`mapId_${m.mapId}`] === 1 ? '' : d[`mapId_${m.mapId}`])).join(' | ') +
      ' |',
  ),
]
write('report.md', report.join('\n') + '\n')

console.log(`out/maintable_event${eventId}.csv  ${docs.length}行 x ${mapsOfEvent.length}列`)
console.log(`out/maintable_event${eventId}.json  Firestore投入用`)
console.log(`out/shiplist_patch.csv            ${patch.length - 1}件`)
console.log(`out/maintable_backfill.json       ${backfill.length}件(過去イベントの分割行)`)
console.log(`out/report.md                     警告 ${warnings.length}件 / 展開確認 ${expansions.length}件`)
