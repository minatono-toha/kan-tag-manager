import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ModalTagManagement from './ModalTagManagement.vue'
import type { Ship, TagManagement } from '@/types/interfaces'

const ARRIVE_MESSAGE = '未着任の艦の札割り当てが変更されたため、自動的に着任させます'

const yamato: Ship = {
  libraryId: 1, spGroupId: 500, shipType: '戦艦', shipTypeCategory: '戦艦', speed: '低',
  bannerId: 131, filterId: 1, name: '大和', orig: 500, class: '大和型1番艦',
  filtertype_jp: '', filtertype_en: '', updateLevel: 0,
}

const tagData: TagManagement = {
  eventId: 1, orig: 500, shipIndex: 0,
  assigned: false, preserve: false, targetStage: 'E-1', tagId: 1, comment: '',
}

// 着任(所持数+1)と札の保存の呼ばれ方・順序をまとめて記録する
const mountModal = (isUnowned: boolean) => {
  const log: string[] = []
  const saved: TagManagement[] = []

  const w = mount(ModalTagManagement, {
    props: {
      ship: yamato,
      shipIndex: 0,
      selectedEventId: 1,
      tagManagementData: new Map([['500_0', tagData]]),
      stageOptions: ['E-1'],
      stageTagMap: {},
      tagMap: { 1: { tagId: 1, tagName: '甲', tagColor: '#fff' } },
      updateTagManagement: async (d: TagManagement) => {
        log.push('save')
        saved.push(d)
      },
      arriveShip: async () => {
        log.push('arrive')
      },
      isUnowned,
    },
  })

  return { w, log, saved }
}

const clickPreserve = (w: ReturnType<typeof mountModal>['w']) =>
  w.findAll('span').find((s) => s.text() === '温存')!.trigger('click')

// 確認ダイアログは body へ Teleport されるため、ラッパー経由では引けない
const clickDialogButton = async (label: string) => {
  const button = Array.from(document.body.querySelectorAll('button')).find(
    (b) => b.textContent?.trim() === label,
  )
  button!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await flushPromises()
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('モーダルで未着任の艦の札を変更したら自動着任を確認する', () => {
  it('変更した時点では保存も着任もせず、確認ダイアログを出す', async () => {
    const { w, log } = mountModal(true)

    await clickPreserve(w)

    expect(log).toEqual([])
    expect(document.body.textContent).toContain(ARRIVE_MESSAGE)
  })

  it('OKなら着任(+1隻)させてから札の変更を保存する', async () => {
    const { w, log, saved } = mountModal(true)

    await clickPreserve(w)
    await clickDialogButton('OK')

    expect(log).toEqual(['arrive', 'save'])
    expect(saved).toEqual([{ ...tagData, preserve: true }])
  })

  it('キャンセルなら未着任のままで、札の変更も加えない', async () => {
    const { w, log } = mountModal(true)

    await clickPreserve(w)
    await clickDialogButton('キャンセル')

    expect(log).toEqual([])
  })

  it('着任済の艦は確認なしでそのまま保存する', async () => {
    const { w, log, saved } = mountModal(false)

    await clickPreserve(w)
    await flushPromises()

    expect(log).toEqual(['save'])
    expect(saved).toEqual([{ ...tagData, preserve: true }])
    expect(document.body.textContent).not.toContain(ARRIVE_MESSAGE)
  })
})
