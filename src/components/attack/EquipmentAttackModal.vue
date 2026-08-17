<template>
  <Teleport to="body">
    <!-- 大きい表を出すので、画面中央に上下左右そろえて開く -->
    <div
      v-if="visible"
      class="fixed inset-0 z-[1200] bg-black/50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <div class="eq-modal flex flex-col rounded-lg shadow-xl overflow-hidden">
        <!-- ヘッダ -->
        <div class="eq-bar flex items-center gap-3 px-4 py-2 border-b">
          <span class="font-bold text-sm">装備特攻</span>
          <span class="eq-muted text-xs">{{ eventLabel }}</span>
          <button
            class="ml-auto eq-muted hover:opacity-70 leading-none text-lg"
            aria-label="閉じる"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>

        <div v-if="loading" class="p-8 text-center eq-muted text-sm">読み込み中...</div>

        <template v-else>
          <!-- 装備種別(複数選択) と 搭載先(3択) -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 border-b">
            <span class="eq-label">装備種別</span>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="t in slotTypes"
                :key="t.name"
                type="button"
                class="eq-chip"
                :aria-selected="selectedTypes.includes(t.name)"
                :disabled="t.count === 0"
                :title="t.count === 0 ? 'この搭載先に該当する装備がない' : undefined"
                @click="toggleType(t.name)"
              >
                <span class="eq-swatch" :style="{ background: typeColor(t.name) }"></span>
                {{ t.label }}<span class="eq-count">{{ t.count }}</span>
              </button>
            </div>

            <span class="eq-label ml-auto">搭載先</span>
            <div class="eq-seg">
              <button
                v-for="s in EQ_SLOTS"
                :key="s.id"
                type="button"
                class="eq-chip"
                :aria-selected="slotId === s.id"
                @click="setSlot(s.id)"
              >
                {{ s.label }}
              </button>
            </div>
          </div>

          <!-- 掛け合わせ。上段が装備名、下段がグループ式 -->
          <div class="eq-calc flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 border-b">
            <span class="eq-label">掛け合わせ</span>
            <div class="flex-1 min-w-0 flex flex-col gap-1">
              <input
                type="text"
                readonly
                class="eq-input"
                :value="pickedNamesExpr"
                placeholder="装備をチェックすると、選んだ装備名が並びます（最大5つ）"
              />
              <input
                type="text"
                readonly
                class="eq-input"
                :value="groupExpr"
                placeholder="重複を除いたグループの掛け合わせ式が出ます"
              />
            </div>
            <span class="eq-num text-xs whitespace-nowrap">
              選択 <b>{{ picked.length }}</b> / {{ MAX_PICK }}
              <span v-if="picked.length >= MAX_PICK" class="eq-full">（上限）</span>
            </span>
            <button type="button" class="eq-link" :disabled="picked.length === 0" @click="clearPicked">
              選択解除
            </button>
          </div>

          <!-- 本体 -->
          <div class="flex-1 overflow-auto">
            <div v-if="selectedTypes.length === 0" class="p-10 text-center eq-muted text-sm">
              装備種別を1つ以上選んでください。
            </div>
            <table v-else class="eq-table text-xs">
              <thead>
                <tr>
                  <th rowspan="2" class="eq-chk"></th>
                  <th rowspan="2" class="eq-sortable eq-type-col" tabindex="0"
                      @click="cycleSort('type')" @keydown.enter="cycleSort('type')">
                    種別<span v-if="sortKey === 'type'" class="eq-arrow">{{ arrow }}</span>
                  </th>
                  <th rowspan="2" class="eq-sortable eq-name" tabindex="0"
                      @click="cycleSort('name')" @keydown.enter="cycleSort('name')">
                    装備名<span v-if="sortKey === 'name'" class="eq-arrow">{{ arrow }}</span>
                  </th>
                  <th v-for="s in statCols" :key="s.key" rowspan="2" class="eq-sortable eq-num" tabindex="0"
                      @click="cycleSort('stat:' + s.key)" @keydown.enter="cycleSort('stat:' + s.key)">
                    {{ s.label }}<span v-if="sortKey === 'stat:' + s.key" class="eq-arrow">{{ arrow }}</span>
                  </th>
                  <th v-for="(g, i) in visibleGroups" :key="g" rowspan="2"
                      class="eq-sortable eq-grp" :class="{ 'eq-sep': i === 0 }"
                      :data-covered="coveredSet.has(g) ? '1' : null" tabindex="0"
                      @click="cycleSort('grp:' + g)" @keydown.enter="cycleSort('grp:' + g)">
                    {{ g }}<span v-if="sortKey === 'grp:' + g" class="eq-arrow">{{ arrow }}</span>
                  </th>
                  <!-- 海域は E-3 / E-4 のように束ね、見出しクリックで展開・格納する -->
                  <th v-for="ng in nodeGroups" :key="ng.area" :colspan="ng.maps.length"
                      class="eq-areahead eq-sep" tabindex="0"
                      @click="toggleArea(ng.area)" @keydown.enter="toggleArea(ng.area)">
                    {{ ng.area }}<span class="eq-caret">{{ isAreaOpen(ng.area) ? '▾' : '▸' }}</span>
                  </th>
                </tr>
                <tr>
                  <template v-for="ng in nodeGroups" :key="ng.area">
                    <template v-if="isAreaOpen(ng.area)">
                      <th v-for="(m, i) in ng.maps" :key="m.mapId" class="eq-sortable eq-num"
                          :class="{ 'eq-sep': i === 0 }" tabindex="0"
                          @click="cycleSort('map:' + m.mapId)" @keydown.enter="cycleSort('map:' + m.mapId)">
                        {{ m.stage }}({{ m.mapPlace }})
                        <span v-if="sortKey === 'map:' + m.mapId" class="eq-arrow">{{ arrow }}</span>
                      </th>
                    </template>
                    <th v-else :colspan="ng.maps.length" class="eq-collapsed eq-sep"></th>
                  </template>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in sortedItems"
                  :key="item.eqId"
                  :aria-selected="isPicked(item) || undefined"
                  :class="{ 'eq-rowfull': isFull(item) }"
                  @click="togglePick(item)"
                >
                  <td class="eq-chk">
                    <input
                      type="checkbox"
                      :checked="isPicked(item)"
                      :disabled="isFull(item)"
                      :aria-label="item.name"
                      @click.stop
                      @change="togglePick(item)"
                    />
                  </td>
                  <td class="eq-type-col" :style="typeCellStyle(item)">{{ typeOfItem(item, slotDef) }}</td>
                  <td class="eq-name">{{ item.name }}</td>
                  <td v-for="s in statCols" :key="s.key" class="eq-num">
                    {{ item.stats[s.key] || '' }}
                  </td>
                  <td v-for="(g, i) in visibleGroups" :key="g" class="eq-grp" :class="{ 'eq-sep': i === 0 }">
                    <span v-if="!item.groups.includes(g)" class="eq-dash">·</span>
                    <!-- 機数で伸びる組は2つ目以降も効くので淡色にしない -->
                    <span v-else-if="isDuplicate(item, g)" class="eq-mark eq-dup">(⭕)</span>
                    <span v-else class="eq-mark">⭕</span>
                  </td>
                  <template v-for="ng in nodeGroups" :key="ng.area">
                    <template v-if="isAreaOpen(ng.area)">
                      <td v-for="(m, i) in ng.maps" :key="m.mapId" class="eq-num eq-heat"
                          :class="{ 'eq-sep': i === 0 }" :style="heatStyle(soloOf(item, m.mapId))">
                        {{ fmt(soloOf(item, m.mapId)) }}
                      </td>
                    </template>
                    <td v-else :colspan="ng.maps.length" class="eq-collapsed eq-sep"></td>
                  </template>
                </tr>
                <tr v-if="sortedItems.length === 0">
                  <td :colspan="totalCols" class="eq-empty">該当する装備がありません</td>
                </tr>
              </tbody>

              <!-- 合計行。列が本体と揃っているので単体倍率と読み比べられる -->
              <tfoot>
                <tr>
                  <td class="eq-chk"></td>
                  <td class="eq-type-col"></td>
                  <td class="eq-name" :class="{ 'eq-muted': picked.length === 0 }">
                    {{ picked.length ? `選択中の合計 (${picked.length}件)` : '選択中の合計' }}
                  </td>
                  <td v-for="s in statCols" :key="s.key" class="eq-num"></td>
                  <td v-for="(g, i) in visibleGroups" :key="g" class="eq-grp" :class="{ 'eq-sep': i === 0 }">
                    <span v-if="coveredSet.has(g)" class="eq-mark">
                      ⭕<span v-if="groupCount(g) > 1" class="eq-times">×{{ groupCount(g) }}</span>
                    </span>
                    <span v-else class="eq-dash">·</span>
                  </td>
                  <template v-for="ng in nodeGroups" :key="ng.area">
                    <template v-if="isAreaOpen(ng.area)">
                      <td v-for="(m, i) in ng.maps" :key="m.mapId" class="eq-num eq-heat"
                          :class="{ 'eq-sep': i === 0 }" :style="heatStyle(totalOf(m.mapId))">
                        {{ fmt(totalOf(m.mapId)) }}
                      </td>
                    </template>
                    <td v-else :colspan="ng.maps.length" class="eq-collapsed eq-sep"></td>
                  </template>
                </tr>
              </tfoot>
            </table>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import {
  useEquipmentAttack, EQ_SLOTS, typeOfItem, totalRate, soloRate,
  itemsForSlot, isStackingGroup, type EqItem, type EqSlotDef,
} from '@/composables/useEquipmentAttack'

const props = defineProps<{
  visible: boolean
  selectedEventId: number | null
  eventName?: string
}>()
defineEmits<{ (e: 'close'): void }>()

// 艦これの装備スロットは最大5
const MAX_PICK = 5

const active = computed(() => props.visible)
const { items, rates, maps, loading } = useEquipmentAttack(
  computed(() => props.selectedEventId),
  active,
)

const eventLabel = computed(() => props.eventName ?? '')

// 数値列。索敵・対潜は出さない方針なので、この4つだけを候補にする。
const STAT_COLS = [
  { key: 'AA', label: '対空' },
  { key: 'Torpedo', label: '雷装' },
  { key: 'Bombing', label: '爆装' },
  { key: 'CombatRadius', label: '半径' },
]

// 種別の識別色。戦闘機=緑 / 攻撃機=水色 / 爆撃機=紅 / 偵察機=黄 / 水上機=黄緑 / 対地=灰
const TYPE_COLOR: Record<string, string> = {
  艦戦: 'var(--eq-fighter)', 陸戦: 'var(--eq-fighter)',
  艦攻: 'var(--eq-attacker)', 陸攻: 'var(--eq-attacker)',
  艦爆: 'var(--eq-bomber)',
  艦偵: 'var(--eq-recon)', 陸偵: 'var(--eq-recon)',
  水戦: 'var(--eq-sea)', 水偵: 'var(--eq-sea)', 水爆: 'var(--eq-sea)', 水攻: 'var(--eq-sea)',
  対地: 'var(--eq-ground)',
}
const TYPE_INK: Record<string, string> = {
  艦戦: 'var(--eq-fighter-ink)', 陸戦: 'var(--eq-fighter-ink)',
  艦攻: 'var(--eq-attacker-ink)', 陸攻: 'var(--eq-attacker-ink)',
  艦爆: 'var(--eq-bomber-ink)',
  艦偵: 'var(--eq-recon-ink)', 陸偵: 'var(--eq-recon-ink)',
  水戦: 'var(--eq-sea-ink)', 水偵: 'var(--eq-sea-ink)', 水爆: 'var(--eq-sea-ink)', 水攻: 'var(--eq-sea-ink)',
  対地: 'var(--eq-ground-ink)',
}
const typeColor = (t: string) => TYPE_COLOR[t] ?? 'transparent'

const slotId = ref<EqSlotDef['id']>('cv')
const selectedTypes = ref<string[]>([])
const pickedIds = ref<number[]>([])
const openAreas = ref<string[]>([])
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('desc')

const slotDef = computed(() => EQ_SLOTS.find((s) => s.id === slotId.value) ?? EQ_SLOTS[0])

// その搭載先で選べる装備(有効なグループを持つものだけ)。件数はチップに出す。
const slotItems = computed(() => itemsForSlot(items.value, rates.value, slotDef.value))
const slotTypes = computed(() =>
  slotDef.value.types.map((name) => ({
    name,
    label: TYPE_LABEL[name] ?? name,
    count: slotItems.value.filter((it) => typeOfItem(it, slotDef.value) === name).length,
  })),
)
const TYPE_LABEL: Record<string, string> = {
  艦戦: '艦戦', 艦攻: '艦攻', 艦爆: '艦爆', 艦偵: '艦偵',
  水戦: '水上戦闘機', 水偵: '水上偵察機', 水爆: '水上爆撃機', 対地: '対地装備',
  陸攻: '陸上攻撃機', 陸戦: '陸上戦闘機', 陸偵: '陸上偵察機', 水攻: '水上攻撃機',
}

const visibleItems = computed(() =>
  slotItems.value.filter((it) => selectedTypes.value.includes(typeOfItem(it, slotDef.value))),
)

// 既定は「その搭載先で中身がある種別すべて」
const defaultTypes = () => slotTypes.value.filter((t) => t.count > 0).map((t) => t.name)
const resetTypes = () => { selectedTypes.value = defaultTypes() }

const setSlot = (id: EqSlotDef['id']) => {
  slotId.value = id
  // 搭載先で有効なグループが入れ替わるため、選択と並べ替えは持ち越さない
  resetTypes()
  pickedIds.value = []
  sortKey.value = null
}
const toggleType = (name: string) => {
  selectedTypes.value = selectedTypes.value.includes(name)
    ? selectedTypes.value.filter((t) => t !== name)
    : [...selectedTypes.value, name]
  // 表から消えた行の選択は落とす
  const live = new Set(visibleItems.value.map((i) => i.eqId))
  pickedIds.value = pickedIds.value.filter((id) => live.has(id))
}

// 海域は E-3 / E-4 のように束ねる。特攻が1つも無い海域(E-1/E-2)は列ごと出さない。
const nodeGroups = computed(() => {
  const hasRate = (mapId: number) => rates.value.some((r) => r.byMapId[mapId] != null)
  const groups: { area: string; maps: typeof maps.value }[] = []
  for (const m of maps.value) {
    const area = `E-${m.stageNum}`
    const last = groups[groups.length - 1]
    if (last && last.area === area) last.maps.push(m)
    else groups.push({ area, maps: [m] })
  }
  return groups.filter((g) => g.maps.some((m) => hasRate(m.mapId)))
})
const isAreaOpen = (area: string) => openAreas.value.includes(area)
const toggleArea = (area: string) => {
  openAreas.value = isAreaOpen(area)
    ? openAreas.value.filter((a) => a !== area)
    : [...openAreas.value, area]
  // 格納した海域で並べ替えたままだと、基準が見えないのに並びだけ変わる
  const m = /^map:(\d+)$/.exec(sortKey.value ?? '')
  if (m && !visibleMapIds.value.has(Number(m[1]))) sortKey.value = null
}
const visibleMapIds = computed(() => {
  const s = new Set<number>()
  for (const g of nodeGroups.value) if (isAreaOpen(g.area)) for (const m of g.maps) s.add(m.mapId)
  return s
})

// 列として出すグループ。倍率があるか、表に出ている装備が所属しているもの。
const visibleGroups = computed(() => {
  const all = [...new Set(rates.value.filter((r) => r.slot === slotDef.value.rateSlot).map((r) => r.grp))]
  return all
    .filter((g) =>
      rates.value.some((r) => r.grp === g && Object.keys(r.byMapId).length > 0) ||
      visibleItems.value.some((it) => it.groups.includes(g)),
    )
    .sort()
})

const statCols = computed(() =>
  STAT_COLS.filter((s) => visibleItems.value.some((it) => (it.stats[s.key] ?? 0) !== 0)),
)
const totalCols = computed(
  () => 3 + statCols.value.length + visibleGroups.value.length + visibleMapIds.value.size,
)

// --- 選択 ---
const picked = computed(() => visibleItems.value.filter((it) => pickedIds.value.includes(it.eqId)))
const isPicked = (item: EqItem) => pickedIds.value.includes(item.eqId)
const isFull = (item: EqItem) => !isPicked(item) && picked.value.length >= MAX_PICK
const togglePick = (item: EqItem) => {
  if (isPicked(item)) pickedIds.value = pickedIds.value.filter((id) => id !== item.eqId)
  else if (picked.value.length < MAX_PICK) pickedIds.value = [...pickedIds.value, item.eqId]
}
const clearPicked = () => { pickedIds.value = [] }

// 組ごとの選択数。機数倍率の組はここが2以上になると倍率が上がる。
const groupCount = (grp: string) => picked.value.filter((it) => it.groups.includes(grp)).length
const coveredSet = computed(() => {
  const s = new Set<string>()
  for (const it of picked.value) for (const g of it.groups) s.add(g)
  return s
})
// 同組の2つ目以降。重複しない組だけ「足しても増えない」ことを淡色で示す。
const isDuplicate = (item: EqItem, grp: string) =>
  !isPicked(item) && coveredSet.value.has(grp) && !isStackingGroup(rates.value, grp)

const pickedNamesExpr = computed(() =>
  pickedIds.value
    .map((id) => visibleItems.value.find((it) => it.eqId === id)?.name)
    .filter(Boolean)
    .join(' × '),
)
const groupExpr = computed(() =>
  visibleGroups.value
    .filter((g) => coveredSet.value.has(g))
    .map((g) => (groupCount(g) > 1 && isStackingGroup(rates.value, g) ? `${g}×${groupCount(g)}` : g))
    .join(' × '),
)

// --- 倍率 ---
const soloOf = (item: EqItem, mapId: number) => soloRate(rates.value, item, mapId, slotDef.value)
const totalOf = (mapId: number) => totalRate(rates.value, picked.value, mapId, slotDef.value)
const fmt = (v: number | null) => (v == null ? '-' : v.toFixed(3))
const heatStyle = (v: number | null): CSSProperties => {
  if (v == null) return {}
  const heat = Math.max(0, Math.min(1, (v - 1) / 0.5))
  return { '--eq-heat': String(heat) } as CSSProperties
}
const typeCellStyle = (item: EqItem): CSSProperties => {
  const t = typeOfItem(item, slotDef.value)
  return { backgroundColor: TYPE_COLOR[t] ?? 'transparent', color: TYPE_INK[t] ?? 'inherit' }
}

// --- 並べ替え。降順 → 昇順 → 解除 の3状態(本体の特攻表と同じ) ---
const arrow = computed(() => (sortOrder.value === 'asc' ? '▲' : '▼'))
const cycleSort = (key: string) => {
  if (sortKey.value === key) {
    if (sortOrder.value === 'desc') sortOrder.value = 'asc'
    else sortKey.value = null
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}
const TYPE_ORDER = ['艦戦', '艦攻', '艦爆', '艦偵', '水戦', '水偵', '水爆', '対地', '陸攻', '陸戦', '陸偵', '水攻']
const sortValue = (item: EqItem, key: string): string | number | null => {
  const [kind, arg] = key.split(':')
  if (kind === 'name') return item.name
  if (kind === 'type') return TYPE_ORDER.indexOf(typeOfItem(item, slotDef.value))
  if (kind === 'stat') return item.stats[arg] ?? null
  if (kind === 'grp') return item.groups.includes(arg) ? 1 : 0
  if (kind === 'map') return soloOf(item, Number(arg))
  return null
}
const sortedItems = computed(() => {
  const rows = visibleItems.value.slice()
  const key = sortKey.value
  if (!key) return rows
  const dir = sortOrder.value === 'asc' ? 1 : -1
  return rows
    .map((item, i) => ({ item, i, v: sortValue(item, key) }))
    .sort((a, b) => {
      // 値なしは並び順によらず末尾へ
      if (a.v == null && b.v == null) return a.i - b.i
      if (a.v == null) return 1
      if (b.v == null) return -1
      const c = typeof a.v === 'string' ? a.v.localeCompare(String(b.v), 'ja') : a.v - Number(b.v)
      return c !== 0 ? c * dir : a.i - b.i
    })
    .map((x) => x.item)
})

// 開いたときと、海域が揃ったときに初期状態を作る
watch(
  () => [props.visible, items.value.length, nodeGroups.value.length] as const,
  ([vis]) => {
    if (!vis) return
    if (selectedTypes.value.length === 0) resetTypes()
    if (openAreas.value.length === 0) openAreas.value = nodeGroups.value.map((g) => g.area)
  },
  { immediate: true },
)
</script>

<style scoped>
.eq-modal {
  width: min(1180px, 96vw);
  max-height: 90vh;
  background: var(--bg-popup, #fff);
  color: var(--text-popup, #141a1f);

  --eq-line: var(--table-border, #e5e7eb);
  --eq-panel: var(--bg-tertiary, #f5f7f8);
  --eq-accent: #0e5a61;
  --eq-heat-tint: #e0a03a;
  --eq-fighter: #d3e7d2; --eq-fighter-ink: #24552c;
  --eq-attacker: #cfe4f0; --eq-attacker-ink: #15506a;
  --eq-bomber: #f2d6da;   --eq-bomber-ink: #8b2333;
  --eq-recon: #f3e6bd;    --eq-recon-ink: #6b5210;
  --eq-sea: #e0eab8;      --eq-sea-ink: #4a6013;
  --eq-ground: #dfe3e6;   --eq-ground-ink: #3d4952;
}
.eq-bar { background: var(--eq-panel); border-color: var(--eq-line); }
.eq-calc { background: var(--eq-panel); }
.eq-modal .border-b { border-color: var(--eq-line); }
.eq-muted { color: var(--text-secondary, #6a7681); }
.eq-label {
  font-size: 10.5px; letter-spacing: .1em; font-weight: 700;
  color: var(--text-secondary, #6a7681); white-space: nowrap;
}

.eq-chip {
  font-size: 12px; line-height: 1.5; padding: 3px 10px; border-radius: 3px;
  border: 1px solid var(--eq-line); background: var(--bg-popup, #fff);
  color: inherit; cursor: pointer; white-space: nowrap;
}
.eq-chip:hover:not([disabled]) { border-color: var(--eq-accent); }
.eq-chip[aria-selected='true'] {
  background: var(--eq-accent); border-color: var(--eq-accent); color: #fff; font-weight: 700;
}
.eq-chip[disabled] { opacity: .45; cursor: default; }
.eq-chip:focus-visible { outline: 2px solid var(--eq-accent); outline-offset: 2px; }
.eq-seg { display: inline-flex; border: 1px solid var(--eq-line); border-radius: 3px; overflow: hidden; }
.eq-seg .eq-chip { border: 0; border-radius: 0; }
.eq-seg .eq-chip + .eq-chip { border-left: 1px solid var(--eq-line); }
/* チップの丸が表の種別列と同じ色なので、チップ列がそのまま凡例になる */
.eq-swatch {
  display: inline-block; width: 8px; height: 8px; margin-right: 6px; border-radius: 2px;
  box-shadow: 0 0 0 1px currentColor; vertical-align: baseline;
}
.eq-count { font-size: 10px; opacity: .6; margin-left: 5px; }

.eq-input {
  width: 100%; font-size: 12.5px; padding: 4px 9px; border-radius: 3px;
  border: 1px solid var(--eq-line); background: var(--bg-popup, #fff); color: inherit;
}
.eq-full { color: #8a5a12; font-weight: 700; }
.eq-link {
  font-size: 11.5px; background: none; border: 0; color: var(--eq-accent);
  cursor: pointer; padding: 2px 4px; white-space: nowrap;
}
.eq-link[disabled] { color: var(--text-secondary, #6a7681); opacity: .6; cursor: default; }

table.eq-table { border-collapse: separate; border-spacing: 0; width: 100%; }
.eq-table th, .eq-table td {
  padding: 4px 8px; text-align: left; white-space: nowrap;
  border-bottom: 1px solid var(--eq-line); border-right: 1px solid var(--eq-line);
}
.eq-table thead th {
  position: sticky; top: 0; z-index: 2; background: var(--eq-panel);
  font-weight: 700; font-size: 11px; vertical-align: bottom;
}
/* 2段目は1段目の下に貼り付く。1段目は rowspan で2段ぶち抜くので top:0 のままでよい */
.eq-table thead tr:nth-child(2) th { top: 27px; z-index: 1; }
.eq-sortable { cursor: pointer; user-select: none; }
.eq-sortable:hover { background: var(--bg-popup-hover, #e4e9ec); }
.eq-arrow { font-size: 9px; margin-left: 2px; color: var(--eq-accent); }
.eq-areahead { text-align: center; cursor: pointer; user-select: none; }
.eq-areahead:hover { background: var(--bg-popup-hover, #e4e9ec); }
.eq-caret { font-size: 9px; margin-left: 5px; color: var(--eq-accent); }
.eq-collapsed { padding: 0; min-width: 30px; }

.eq-chk { width: 30px; text-align: center; padding-left: 6px; padding-right: 6px; }
.eq-name { width: 100%; }
.eq-num { text-align: right; font-variant-numeric: tabular-nums; }
.eq-grp { text-align: center; width: 44px; }
.eq-type-col { width: 58px; text-align: center; }
.eq-sep { border-left: 1px solid var(--eq-line); }
.eq-empty { text-align: center; padding: 24px; color: var(--text-secondary, #6a7681); }

.eq-table tbody tr { cursor: pointer; }
.eq-table tbody tr:hover td { background: var(--bg-popup-hover, #e4e9ec); }
.eq-table tbody tr[aria-selected='true'] td { background: color-mix(in srgb, var(--eq-accent) 12%, transparent); }
.eq-table tbody tr[aria-selected='true'] td.eq-name { font-weight: 700; }
.eq-table tbody tr.eq-rowfull { cursor: default; }
.eq-table tbody tr.eq-rowfull td.eq-name, .eq-table tbody tr.eq-rowfull td.eq-num { opacity: .5; }
/* 種別セルの塗りは行ホバーや選択でも消さない(混在した表で種別を見失わないため) */
.eq-table tbody tr td.eq-type-col,
.eq-table tbody tr:hover td.eq-type-col,
.eq-table tbody tr[aria-selected='true'] td.eq-type-col { font-weight: 700; font-size: 11px; }

.eq-heat { background: color-mix(in srgb, var(--eq-heat-tint) calc(var(--eq-heat, 0) * 100%), transparent); }
.eq-mark { color: var(--eq-accent); font-weight: 700; }
.eq-mark.eq-dup { color: var(--text-secondary, #6a7681); opacity: .45; font-weight: 400; }
.eq-times { font-size: 10px; margin-left: 1px; }
.eq-dash { color: var(--text-secondary, #6a7681); opacity: .4; }
.eq-table th.eq-grp[data-covered='1'] { background: var(--eq-accent); color: #fff; }

.eq-table tfoot td {
  position: sticky; bottom: 0; z-index: 3; background: var(--eq-panel);
  border-top: 2px solid var(--eq-accent); border-bottom: 0; font-weight: 700;
}
.eq-table input[type='checkbox'] { accent-color: var(--eq-accent); cursor: pointer; margin: 0; vertical-align: middle; }
</style>
