// Returns "#fff" or "#000" for best contrast against the given background color.
// Accepts "rgb(r,g,b)", "#rgb" or "#rrggbb"; falls back to black for any other shape.

const luminance = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b

export const contrastingTextColor = (bgColor: string | undefined | null): string => {
  if (!bgColor) return '#000'

  const rgbMatch = bgColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10)
    const g = parseInt(rgbMatch[2], 10)
    const b = parseInt(rgbMatch[3], 10)
    return luminance(r, g, b) < 128 ? '#fff' : '#000'
  }

  const hexMatch = bgColor.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  if (hexMatch) {
    const hex =
      hexMatch[1].length === 3
        ? hexMatch[1]
            .split('')
            .map((c) => c + c)
            .join('')
        : hexMatch[1]
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return luminance(r, g, b) < 128 ? '#fff' : '#000'
  }

  return '#000'
}
