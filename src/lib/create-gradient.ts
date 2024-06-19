// https://github.com/loganliffick/ficus/blob/main/src/components/PlotBar.tsx#L11-L14 <- modified to use `shadowRoot`

import { svg } from 'lit'

type GradientStop = {
  offset: string
  color: string
}

const createGradient = (id: string, stops: GradientStop[]) => {
  return svg`
    <svg width="0" height="0">
      <defs>
        <linearGradient id="${id}" gradientTransform="rotate(90)">${stops.map((stop) => svg`<stop offset="${stop.offset}" stop-color="${stop.color}" />`)}</linearGradient>
      </defs>
    </svg>
  `
}

export default createGradient
