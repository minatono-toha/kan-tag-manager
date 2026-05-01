import { ref } from 'vue'

export interface TooltipState {
  show: boolean
  content: string
  x: number
  y: number
}

// Positions a tooltip just above the centered top edge of the hovered element.
export function useTooltip() {
  const state = ref<TooltipState>({ show: false, content: '', x: 0, y: 0 })

  const show = (event: MouseEvent | { currentTarget: EventTarget | null }, content: string) => {
    const target = event.currentTarget as HTMLElement | null
    if (!target) return
    const rect = target.getBoundingClientRect()
    state.value = {
      show: true,
      content,
      x: rect.left + rect.width / 2,
      y: rect.top - 5,
    }
  }

  const hide = () => {
    state.value.show = false
  }

  return { state, show, hide }
}
