import { parseTagFromTargetStage } from '@/utils/tagStage'

export type TagMap = Record<number, { tagId: number; tagName: string; tagColor: string }>

// If tagId is 0 but the targetStage carries a "(TagName)" suffix, infer the
// tagId by looking up the parsed tagName in the provided tagMap. Falls back
// to the original tagId when no match is found.
export const resolveTagId = (
  tagId: number,
  targetStage: string,
  tagMap: TagMap,
): number => {
  if (tagId !== 0 || !targetStage) return tagId
  const parsed = parseTagFromTargetStage(targetStage)
  if (!parsed?.tagName) return tagId
  const entry = Object.values(tagMap).find((t) => t.tagName === parsed.tagName)
  return entry ? entry.tagId : tagId
}
