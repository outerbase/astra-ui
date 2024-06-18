export function getRandomContrastingColor(bgColor: string): string {
  const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
  const contrastThreshold = 128 // Threshold for determining light/dark background
  const contrastFactor = 0.5 // Factor for adjusting contrast

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.substring(1), 16)
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    }
  }

  const rgbToHex = (r: number, g: number, b: number) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

  const bgRgb = hexToRgb(bgColor)
  const bgLum = lum(bgRgb.r, bgRgb.g, bgRgb.b)
  const isDark = bgLum < contrastThreshold

  let newColor
  let lumDiff
  do {
    newColor =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0') // Generate random color
    const newRgb = hexToRgb(newColor)
    const newLum = lum(newRgb.r, newRgb.g, newRgb.b)
    lumDiff = Math.abs(newLum - bgLum)
    const contrast = Math.abs(newLum - bgLum) / Math.max(newLum, bgLum)
    const contrastAdjustment = contrast * contrastFactor
    if ((isDark && newLum > bgLum) || (!isDark && newLum < bgLum)) {
      newColor = rgbToHex(
        Math.round(newRgb.r + contrastAdjustment * (newRgb.r > bgRgb.r ? -1 : 1)),
        Math.round(newRgb.g + contrastAdjustment * (newRgb.g > bgRgb.g ? -1 : 1)),
        Math.round(newRgb.b + contrastAdjustment * (newRgb.b > bgRgb.b ? -1 : 1))
      )
    }
  } while (Math.abs(lum(hexToRgb(newColor).r, hexToRgb(newColor).g, hexToRgb(newColor).b) - bgLum) < lumDiff)

  return newColor
}
