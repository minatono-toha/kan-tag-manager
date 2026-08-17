import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

// 装備1件。Firestore の eqattack 1ドキュメントに対応する。
export interface EqItem {
  eqId: number
  name: string
  officialType: string
  // 艦上での種別(艦戦/艦攻/艦爆/艦偵/水戦/水偵/水爆/対地)。基地専用の装備は空。
  eqType: string
  // 基地に置いたときの種別(陸攻/陸戦/陸偵/水攻/水戦/水偵)。対地装備は空。
  baseType: string
  groups: string[]
  stats: Record<string, number>
}

// グループの倍率。同じ組でも積んだ数(count)で値が変わるため、行は (組, 個数) 単位。
export interface EqRate {
  grp: string
  slot: string // '艦上' | '基地'
  count: number
  byMapId: Record<number, number>
}

export const EQ_STATS = ['AA', 'Torpedo', 'Bombing', 'ASW', 'LoS', 'CombatRadius'] as const

export interface EqSlotDef {
  id: 'cv' | 'noncv' | 'base'
  label: string
  rateSlot: string
  types: string[]
}

// 搭載先。選べる装備種別と、有効になるグループ(eqrate.slot)がここで決まる。
export const EQ_SLOTS: EqSlotDef[] = [
  { id: 'cv', label: '空母用', rateSlot: '艦上', types: ['艦戦', '艦攻', '艦爆', '艦偵'] },
  { id: 'noncv', label: '空母以外', rateSlot: '艦上', types: ['水戦', '水偵', '水爆', '対地'] },
  { id: 'base', label: '基地', rateSlot: '基地', types: ['陸攻', '陸戦', '陸偵', '水攻', '水戦', '水偵'] },
]

// 基地は艦上と分類の切り口が違う(陸上/水上 × 攻/戦/偵)ので、見る列を切り替える。
export const typeOfItem = (item: EqItem, slot: EqSlotDef): string =>
  slot.id === 'base' ? item.baseType : item.eqType

// 装備種別チップ上の分類。夜戦・夜攻は昼の相方のチップに含める
// (表の種別列では夜戦・夜攻のまま出し分ける)。
const CHIP_TYPE: Record<string, string> = { 夜戦: '艦戦', 夜攻: '艦攻' }
export const chipTypeOf = (item: EqItem, slot: EqSlotDef): string => {
  const t = typeOfItem(item, slot)
  return CHIP_TYPE[t] ?? t
}

export interface EqMap {
  mapId: number
  stage: string
  mapPlace: string
  stageNum: number
}

// active を渡すと、モーダルを開くまで読み込まない(装備特攻はモーダルでしか使わないため)。
export function useEquipmentAttack(selectedEventId: Ref<number | null>, active?: Ref<boolean>) {
  const items = ref<EqItem[]>([])
  const rates = ref<EqRate[]>([])
  const maps = ref<EqMap[]>([])
  const loading = ref(false)
  const loadedEventId = ref<number | null>(null)

  const fetchData = async (eventId: number) => {
    if (!eventId) return
    loading.value = true
    try {
      const [itemSnap, rateSnap, mapSnap] = await Promise.all([
        getDocs(query(collection(db, 'eqattack'), where('eventId', '==', eventId))),
        getDocs(query(collection(db, 'eqrate'), where('eventId', '==', eventId))),
        getDocs(query(collection(db, 'eventmap'), where('eventId', '==', eventId))),
      ])

      items.value = itemSnap.docs.map((doc) => {
        const d = doc.data()
        const stats: Record<string, number> = {}
        for (const s of EQ_STATS) if (typeof d[s] === 'number') stats[s] = d[s]
        return {
          eqId: Number(d.eqId),
          name: d.name ?? '',
          officialType: d.officialType ?? '',
          eqType: d.eqType ?? '',
          baseType: d.baseType ?? '',
          // grp1〜grp3 の空きを詰めて配列にする
          groups: [d.grp1, d.grp2, d.grp3].filter((g): g is string => !!g),
          stats,
        }
      })

      rates.value = rateSnap.docs.map((doc) => {
        const d = doc.data()
        const byMapId: Record<number, number> = {}
        for (const [k, v] of Object.entries(d)) {
          const m = /^mapId_(\d+)$/.exec(k)
          if (m && typeof v === 'number') byMapId[Number(m[1])] = v
        }
        return { grp: d.grp ?? '', slot: d.slot ?? '', count: Number(d.count ?? 1), byMapId }
      })

      maps.value = mapSnap.docs
        .map((doc) => doc.data() as EqMap)
        .sort((a, b) => a.mapId - b.mapId)

      loadedEventId.value = eventId
    } catch (error) {
      console.error('Error fetching equipment attack data:', error)
      items.value = []
      rates.value = []
      maps.value = []
      loadedEventId.value = null
    } finally {
      loading.value = false
    }
  }

  watch(
    [() => selectedEventId.value, () => active?.value ?? true],
    async ([id, on]) => {
      if (!id) {
        items.value = []
        rates.value = []
        maps.value = []
        loadedEventId.value = null
        return
      }
      // 同じイベントを開き直したときに読み直さない
      if (on && loadedEventId.value !== id) await fetchData(id)
    },
    { immediate: true },
  )

  return { items, rates, maps, loading, fetchData }
}

// --- 倍率の計算(Firestore に依存しない純関数。テストしやすいよう composable の外に置く) ---

// その組をその地点で引いたときの倍率。n 個積んだときに効くのは
// 「count <= n かつその地点に値がある行のうち count が最大のもの」。
// A/B/C 組は count=1 の行しか無いので、何個積んでも1回しか掛からない。
export const rateFor = (rates: EqRate[], grp: string, count: number, mapId: number): number | null => {
  let best: number | null = null
  let bestCount = 0
  for (const r of rates) {
    if (r.grp !== grp || r.count > count || r.count < bestCount) continue
    const v = r.byMapId[mapId]
    if (v == null) continue
    if (r.count >= bestCount) {
      best = v
      bestCount = r.count
    }
  }
  return best
}

// 選択中の装備がその地点で得る合計倍率。効く組が1つも無ければ null(特攻なし)。
export const totalRate = (
  rates: EqRate[],
  picked: EqItem[],
  mapId: number,
  slot: EqSlotDef,
): number | null => {
  const counts = new Map<string, number>()
  for (const item of picked) {
    for (const g of item.groups) counts.set(g, (counts.get(g) ?? 0) + 1)
  }
  let total: number | null = null
  for (const [grp, n] of counts) {
    if (!rates.some((r) => r.grp === grp && r.slot === slot.rateSlot)) continue
    const v = rateFor(rates, grp, n, mapId)
    if (v == null) continue
    total = (total ?? 1) * v
  }
  return total == null ? null : Number(total.toFixed(8))
}

// 装備1つだけを積んだときの倍率(表の各行に出す単体倍率)。
export const soloRate = (
  rates: EqRate[],
  item: EqItem,
  mapId: number,
  slot: EqSlotDef,
): number | null => totalRate(rates, [item], mapId, slot)

// その搭載先で有効なグループを1つでも持つか。持たない装備は表に出さない
// (基地に艦戦を置くことはできるが、C組に居なければ倍率が付かず全マス空になる)。
export const inSlot = (rates: EqRate[], item: EqItem, slot: EqSlotDef): boolean =>
  item.groups.some((g) => rates.some((r) => r.grp === g && r.slot === slot.rateSlot))

// 表に出す装備。搭載先で種別を絞り、さらに有効なグループを持つものだけにする。
export const itemsForSlot = (items: EqItem[], rates: EqRate[], slot: EqSlotDef): EqItem[] =>
  items.filter((it) => slot.types.includes(chipTypeOf(it, slot)) && inSlot(rates, it, slot))

// 積んだ数で倍率が変わる組か(count が2以上定義されているか)。
// ⭕の重複表示や掛け合わせ式の出し方をこれで切り替える。
export const isStackingGroup = (rates: EqRate[], grp: string): boolean =>
  rates.some((r) => r.grp === grp && r.count > 1)

// 特攻の系統。倍率を持つマスが重ならない組は、別物として分けて扱う。
// E-3 の KA(艦載機A組)と E-4/E-5 の A/B/C 組は同じマスに同居しないため、
// 混ぜて出すと「E-4 で KA を積む」ような誤読を招く。
export interface EqFamily {
  label: string
  areas: string[]
  groups: Set<string>
}

// 同じ海域に倍率を持つ組同士を繋ぎ、繋がった海域のまとまりを1系統とする。
// (C3 は E-4 だけ、A1 は E-4/E-5 → A1 経由で E-4 と E-5 が同じ系統になる)
export const buildFamilies = (rates: EqRate[], areaOf: (mapId: number) => string): EqFamily[] => {
  const areasOfGroup = new Map<string, Set<string>>()
  for (const r of rates) {
    for (const mapId of Object.keys(r.byMapId)) {
      if (!areasOfGroup.has(r.grp)) areasOfGroup.set(r.grp, new Set())
      areasOfGroup.get(r.grp)!.add(areaOf(Number(mapId)))
    }
  }

  // 海域を頂点にした union-find。同じ組が跨いでいる海域を1つに束ねる。
  const parent = new Map<string, string>()
  const find = (a: string): string => {
    if (!parent.has(a)) parent.set(a, a)
    const p = parent.get(a)!
    if (p === a) return a
    const root = find(p)
    parent.set(a, root)
    return root
  }
  const union = (a: string, b: string) => {
    const [ra, rb] = [find(a), find(b)]
    if (ra !== rb) parent.set(rb, ra)
  }
  for (const areas of areasOfGroup.values()) {
    const list = [...areas]
    for (let i = 1; i < list.length; i++) union(list[0], list[i])
  }

  const byRoot = new Map<string, EqFamily>()
  for (const [grp, areas] of areasOfGroup) {
    const root = find([...areas][0])
    if (!byRoot.has(root)) byRoot.set(root, { label: '', areas: [], groups: new Set() })
    const fam = byRoot.get(root)!
    fam.groups.add(grp)
    for (const a of areas) if (!fam.areas.includes(a)) fam.areas.push(a)
  }
  const families = [...byRoot.values()]
  for (const f of families) {
    f.areas.sort()
    f.label = f.areas.join('・')
  }
  return families.sort((a, b) => a.areas[0].localeCompare(b.areas[0]))
}
