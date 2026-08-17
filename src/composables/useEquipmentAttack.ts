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

export function useEquipmentAttack(selectedEventId: Ref<number | null>) {
  const items = ref<EqItem[]>([])
  const rates = ref<EqRate[]>([])
  const loading = ref(false)

  const fetchData = async (eventId: number) => {
    if (!eventId) return
    loading.value = true
    try {
      const [itemSnap, rateSnap] = await Promise.all([
        getDocs(query(collection(db, 'eqattack'), where('eventId', '==', eventId))),
        getDocs(query(collection(db, 'eqrate'), where('eventId', '==', eventId))),
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
    } catch (error) {
      console.error('Error fetching equipment attack data:', error)
      items.value = []
      rates.value = []
    } finally {
      loading.value = false
    }
  }

  watch(
    () => selectedEventId.value,
    async (id) => {
      if (id) await fetchData(id)
      else {
        items.value = []
        rates.value = []
      }
    },
    { immediate: true },
  )

  return { items, rates, loading, fetchData }
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
  items.filter((it) => slot.types.includes(typeOfItem(it, slot)) && inSlot(rates, it, slot))

// 積んだ数で倍率が変わる組か(count が2以上定義されているか)。
// ⭕の重複表示や掛け合わせ式の出し方をこれで切り替える。
export const isStackingGroup = (rates: EqRate[], grp: string): boolean =>
  rates.some((r) => r.grp === grp && r.count > 1)
