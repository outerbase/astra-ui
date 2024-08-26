//  wraps LitElement components as React components for better DevEx

import { createComponent } from '@lit/react'

import { AstraEditor } from './components/astra-editor/index.js'
import { AstraEditorHandlerbarPlugin } from './components/astra-editor/plugins/handlebar.js'
import { AstraEditorSqlPlugin } from './components/astra-editor/plugins/sql.js'
import AstraButton from './components/button.js'
import AstraCalendar from './components/calendar/calendar.js'
import AstraCard from './components/card.js'
import AstraChart from './components/charts/chart.js'
import AstraComposedChart from './components/charts/composed.js'
import AstraInput from './components/input.js'
import AstraScrollArea from './components/scroll-area.js'
import AstraSelect from './components/select.js'
import AstraTable from './components/table/core/index.js'
import AstraText from './components/text.js'

export default function LitComponents(React: any) {
  // If window is not defined, we are not in a browser environment
  if (typeof window === 'undefined') {
    return {}
  }

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
    ComposedChart: createComponent({
      tagName: 'astra-composed-chart',
      elementClass: AstraComposedChart,
      react: React,
    }),
    Chart: createComponent({
      tagName: 'astra-chart',
      elementClass: AstraChart,
      react: React,
    }),
    Calendar: createComponent({
      tagName: 'astra-calendar',
      elementClass: AstraCalendar,
      react: React,
    }),
    Editor: createComponent({
      tagName: 'astra-editor',
      elementClass: AstraEditor,
      react: React,
    }),
    EditorSql: createComponent({
      tagName: 'astra-editor-sql',
      elementClass: AstraEditorSqlPlugin,
      react: React,
    }),
    EditorHandlebars: createComponent({
      tagName: 'astra-editor-handlebar',
      elementClass: AstraEditorHandlerbarPlugin,
      react: React,
    }),
  }
}
