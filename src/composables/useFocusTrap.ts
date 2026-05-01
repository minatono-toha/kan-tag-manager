import { watch, onMounted, onUnmounted, type Ref } from 'vue'

interface FocusTrapOptions {
  // Returns the focusable elements in tab order. Called fresh on each Tab keypress.
  getFocusable: () => HTMLElement[]
  // Called when Escape is pressed.
  onEscape?: () => void
  // Called when Enter is pressed and no focusable element is focused.
  onEnter?: () => void
}

// Constrains Tab/Shift-Tab to elements returned by getFocusable while `active` is true.
// The host component owns Esc/Enter via callbacks; this composable handles only key wiring.
export function useFocusTrap(active: Ref<boolean>, options: FocusTrapOptions) {
  const handleKeydown = (event: KeyboardEvent) => {
    if (!active.value) return

    if (event.key === 'Escape') {
      if (options.onEscape) {
        event.preventDefault()
        options.onEscape()
      }
      return
    }

    if (event.key === 'Enter' && options.onEnter) {
      const focusable = options.getFocusable()
      if (!focusable.includes(document.activeElement as HTMLElement)) {
        event.preventDefault()
        options.onEnter()
      }
      return
    }

    if (event.key !== 'Tab') return
    const focusable = options.getFocusable()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(active, (isActive) => {
    if (isActive) document.addEventListener('keydown', handleKeydown)
    else document.removeEventListener('keydown', handleKeydown)
  })

  onMounted(() => {
    if (active.value) document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
