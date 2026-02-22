import { ref, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'gradient'

export function useTheme() {
  const theme = ref<Theme>('light')

  const applyThemeToBody = (newTheme: Theme) => {
    // Remove all previous theme classes
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-gradient')
    // Add new theme class
    document.body.classList.add(`theme-${newTheme}`)
  }

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('app-theme') as Theme | null
    if (savedTheme) {
      theme.value = savedTheme
      applyThemeToBody(savedTheme)
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const defaultTheme = isDark ? 'dark' : 'light'
      theme.value = defaultTheme
      applyThemeToBody(defaultTheme)
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('app-theme', newTheme)
    applyThemeToBody(newTheme)
  }

  onMounted(() => {
    loadTheme()
  })

  return {
    theme,
    handleThemeChange,
  }
}
