// Parse "E-1-1 (TagName)" -> { stage: "E-1-1", tagName: "TagName" }
// Plain "E-1-1" -> { stage: "E-1-1", tagName: null }

export interface ParsedTargetStage {
  stage: string
  tagName: string | null
}

export const parseTagFromTargetStage = (targetStage: string): ParsedTargetStage | null => {
  if (!targetStage) return null
  const match = targetStage.match(/^(.+?)\s*\((.+)\)$/)
  if (match) {
    return { stage: match[1], tagName: match[2] }
  }
  return { stage: targetStage, tagName: null }
}
