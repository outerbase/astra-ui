//  wraps LitElement components as React components for better DevEx

import { createComponent } from '@lit/react'

import AstraButton from './components/button.js'
import AstraCard from './components/card.js'
import AstraInput from './components/input.js'
import AstraScrollArea from './components/scroll-area.js'
import AstraSelect from './components/select.js'
import AstraTable from './components/table/core/index.js'
import AstraText from './components/text.js'

export default function LitComponents(React: any) {
  return {
    Button: createComponent({
      tagName: 'astra-button',
      elementClass: AstraButton,
      react: React,
    }),
    Card: createComponent({
      tagName: 'astra-card',
      elementClass: AstraCard,
      react: React,
    }),
    Input: createComponent({
      tagName: 'astra-input',
      elementClass: AstraInput,
      react: React,
    }),
    Text: createComponent({
      tagName: 'astra-text',
      elementClass: AstraText,
      react: React,
    }),
    Select: createComponent({
      tagName: 'astra-select',
      elementClass: AstraSelect,
      react: React,
    }),
    ScrollArea: createComponent({
      tagName: 'astra-scroll-area',
      elementClass: AstraScrollArea,
      react: React,
    }),
    Table: createComponent({
      tagName: 'astra-table',
      elementClass: AstraTable,
      react: React,
    }),
  }
}
