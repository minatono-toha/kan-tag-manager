import { ref, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'gradient'

export function useTheme() {
  const theme = ref<Theme>('light')

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('app-theme') as Theme | null
    if (savedTheme) {
      theme.value = savedTheme
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('app-theme', newTheme)
  }

  onMounted(() => {
    loadTheme()
  })

  return {
    theme,
    handleThemeChange,
  }
}
