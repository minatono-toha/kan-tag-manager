import { describe, it, expect } from 'vitest'
import { GIMMICK_STAGE, collectGimmickTags } from './gimmickTags'

const tag = (tagId: number, tagName: string) => ({ tagId, tagName })

const TAG_MAP = {
  1: tag(1, '第一機動部隊'),
  2: tag(2, '第二遊撃部隊'),
  9: tag(9, 'Force H'),
}

describe('collectGimmickTags', () => {
  it('eventmap の海域に出てこない札だけを集める', () => {
    const stageTagMap = { 'E-1-1': [TAG_MAP[1]], 'E-2-1': [TAG_MAP[1], TAG_MAP[2]] }

    expect(collectGimmickTags(TAG_MAP, stageTagMap)).toEqual([TAG_MAP[9]])
  })

  it('すべての札が海域で使われていれば空になる', () => {
    const stageTagMap = { 'E-1-1': [TAG_MAP[1], TAG_MAP[2], TAG_MAP[9]] }

    expect(collectGimmickTags(TAG_MAP, stageTagMap)).toEqual([])
  })

  it('擬似海域「ギミック用」は集計対象にしない(再計算しても消えない)', () => {
    const stageTagMap = {
      'E-1-1': [TAG_MAP[1], TAG_MAP[2]],
      [GIMMICK_STAGE]: [TAG_MAP[9]],
    }

    expect(collectGimmickTags(TAG_MAP, stageTagMap)).toEqual([TAG_MAP[9]])
  })
})
