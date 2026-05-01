// Stage code utilities. Stage codes look like "E-1", "E-2-1", "E-3-2", etc.
// "Area" = first two segments ("E-1", "E-2"); "Stage" = full code.

export interface ParsedStage {
  area: string
  parts: number[]
}

export const parseStage = (stage: string): ParsedStage => {
  const parts = stage.replace('E-', '').split('-').map(Number)
  const head = stage.split('-').slice(0, 2).join('-')
  return { area: head || stage, parts }
}

export const compareStages = (a: string, b: string): number => {
  const aParts = parseStage(a).parts
  const bParts = parseStage(b).parts
  const len = Math.max(aParts.length, bParts.length)
  for (let i = 0; i < len; i++) {
    const av = aParts[i] || 0
    const bv = bParts[i] || 0
    if (av !== bv) return av - bv
  }
  return 0
}

export const compareAreas = (a: string, b: string): number => {
  const an = parseInt(a.replace('E-', '')) || 0
  const bn = parseInt(b.replace('E-', '')) || 0
  return an - bn
}

export const uniqueAreasFromStages = (stages: string[]): string[] => {
  const set = new Set<string>()
  for (const stage of stages) {
    set.add(parseStage(stage).area)
  }
  return Array.from(set).sort(compareAreas)
}
