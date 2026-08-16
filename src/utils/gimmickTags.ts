// 攻略(出撃)には使われないが、ギミック解除などで付与される札を扱う。
// tags には登録されているのに eventmap のどの海域の tagId にも現れない札がそれにあたる。
// 海域を持たないので、割当先としては「ギミック用」という擬似海域に属させる。

export const GIMMICK_STAGE = 'ギミック用'

type TagLike = { tagId: number }

// eventmap 由来の海域(stageTagMap)にひとつも現れない札を集める。
// stageTagMap 側に既に入っているギミック用の擬似海域は集計から除く(自分自身を消さないため)。
export const collectGimmickTags = <T extends TagLike>(
  tagMap: Record<number, T>,
  stageTagMap: Record<string, T[]>,
): T[] => {
  const usedTagIds = new Set<number>()
  for (const [stage, tags] of Object.entries(stageTagMap)) {
    if (stage === GIMMICK_STAGE) continue
    for (const tag of tags) usedTagIds.add(tag.tagId)
  }
  return Object.values(tagMap).filter((tag) => !usedTagIds.has(tag.tagId))
}
