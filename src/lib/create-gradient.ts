// https://github.com/loganliffick/ficus/blob/main/src/components/PlotBar.tsx#L11-L14 <- modified to use `shadowRoot`

type GradientStop = {
  offset: string
  color: string
}

const createGradient = (id: string, stops: GradientStop[], shadowRoot: ShadowRoot | null) => {
  if (!shadowRoot) throw new Error('unexpectedly missing shadowRoot')

  const svg = `
    <svg width="0" height="0">
      <defs>
        <linearGradient id="${id}" gradientTransform="rotate(90)">
          ${stops.map((stop) => `<stop offset="${stop.offset}" stop-color="${stop.color}" />`).join('')}
        </linearGradient>
      </defs>
    </svg>`
  shadowRoot.innerHTML += svg
}

export default createGradient
