// 装備マスタ(艦これの api_start2)をローカルにダンプする。
// 装備の一意キー api_slotitem_id と、装備種別・ステータスの正はここ。
//   node scripts/fetch-slotitem.mjs [START2.jsonのパス]
//
// api_start2 は公開APIから直接取れないため、手元にある応答そのままのダンプを入力にする。
// 既定では kc-web(https://github.com/noro6/kc-web) が同梱している public/START2.json を読む。
// ゲーム側の更新で装備が増えたときは、新しいダンプに差し替えてから再実行すること。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'data', 'master')
const SRC = process.argv[2] ?? 'd:/src/kc-web/public/START2.json'

const start2 = JSON.parse(readFileSync(SRC, 'utf8'))
const typeName = new Map(start2.api_mst_slotitem_equiptype.map((t) => [t.api_id, t.api_name]))

// 生成器が使う項目だけに絞る(START2 は 2MB あり、全部は要らない)。
// api_type[2] が装備種別ID、api_type[3] がアイコンID。
// 夜間戦闘機・夜間攻撃機は装備種別が艦上戦闘機/艦上攻撃機のままなので、
// アイコンID(45=夜戦 / 46=夜攻)でしか区別できない。半径は陸上機・水上機にしか無い。
// 項目名は Firestore の eqattack に合わせる(対空=AA, 雷装=Torpedo, 爆装=Bombing,
// 対潜=ASW, 索敵=LoS, 半径=CombatRadius)。
const items = start2.api_mst_slotitem.map((it) => ({
  id: it.api_id,
  name: it.api_name,
  type: typeName.get(it.api_type[2]) ?? '',
  icon: it.api_type[3] ?? 0,
  AA: it.api_tyku ?? 0,
  Torpedo: it.api_raig ?? 0,
  Bombing: it.api_baku ?? 0,
  ASW: it.api_tais ?? 0,
  LoS: it.api_saku ?? 0,
  CombatRadius: it.api_distance ?? 0,
}))

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(join(OUT_DIR, 'slotitem.json'), JSON.stringify(items, null, 1))
console.log(`slotitem: ${items.length} items (from ${SRC})`)
