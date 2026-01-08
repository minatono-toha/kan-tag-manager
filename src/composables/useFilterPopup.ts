import { ref, type Ref } from 'vue'

export interface FilterPopupState {
  show: Ref<boolean>
  position: Ref<{ x: number; y: number }>
  iconRef: Ref<HTMLElement | null>
  popupRef: Ref<HTMLElement | null>
  toggle: (event: MouseEvent) => void
  close: () => void
}

/**
 * Composable for managing filter popup state and positioning
 * Provides common functionality for filter popups in table headers
 */
export function useFilterPopup(options: {
  /**
   * Callback to close all other popups before opening this one
   */
  closeOthers?: () => void
} = {}): FilterPopupState {
  const { closeOthers } = options

  const show = ref(false)
  const position = ref({ x: 0, y: 0 })
  const iconRef = ref<HTMLElement | null>(null)
  const popupRef = ref<HTMLElement | null>(null)

  const toggle = (event: MouseEvent) => {
    const willOpen = !show.value

    if (willOpen && closeOthers) {
      closeOthers()
    }

    show.value = willOpen

    if (show.value) {
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      position.value = {
        x: rect.left,
        y: rect.bottom + 5
      }
    }
  }

  const close = () => {
    show.value = false
  }

  return {
    show,
    position,
    iconRef,
    popupRef,
    toggle,
    close
  }
}

/**
 * Manager for coordinating multiple filter popups
 * Ensures only one popup is open at a time
 */
export function useFilterPopupManager() {
  const popups: FilterPopupState[] = []

  const closeAll = () => {
    popups.forEach(popup => popup.close())
  }

  const register = (): FilterPopupState => {
    const popup = useFilterPopup({ closeOthers: closeAll })
    popups.push(popup)
    return popup
  }

  return {
    register,
    closeAll
  }
}
