import Button from './components/button.js'
import Calendar from './components/calendar/calendar.js'
import Card from './components/card.js'
import Chart from './components/charts/chart.js'
import ComposedChart from './components/charts/composed.js'
import { CodeMirror } from './components/codemirror/index.js'
import { CodeMirrorSqlPlugin } from './components/codemirror/plugins/sql.js'
import Input from './components/input.js'
import ScrollArea from './components/scroll-area.js'
import Select from './components/select.js'
import Table from './components/table/core/index.js'
import OuterbaseTable from './components/table/outerbase-table.js'
import Text from './components/text.js'

// export * as Types from './types'
export {
  Button,
  Calendar,
  Card,
  Chart,
  CodeMirror,
  CodeMirrorSqlPlugin,
  ComposedChart,
  Input,
  OuterbaseTable,
  ScrollArea,
  Select,
  Table,
  Text,
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'astra-scroll-area': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'astra-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'astra-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'astra-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'astra-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'astra-text': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'astra-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'astra-calendar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'outerbase-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'code-mirror': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'code-mirror-sql': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}
