import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Composable for handling click-outside behavior
 * Calls the callback when user clicks outside the specified element
 */
export function useClickOutside(
  elementRef: Ref<HTMLElement | null>,
  callback: () => void,
  options: {
    /**
     * Additional refs to check (e.g., trigger button)
     * Clicking these elements will NOT trigger the callback
     */
    excludeRefs?: Ref<HTMLElement | null>[]
  } = {}
) {
  const { excludeRefs = [] } = options

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    // Check if click is on the main element
    if (elementRef.value?.contains(target)) {
      return
    }

    // Check if click is on any excluded elements
    for (const excludeRef of excludeRefs) {
      if (excludeRef.value?.contains(target)) {
        return
      }
    }

    // Click was outside all specified elements
    callback()
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClick)
  })

  return {
    handleClick
  }
}
