import { AstraEditor } from './components/astra-editor/index.js'
import { AstraEditorHandlerbarPlugin } from './components/astra-editor/plugins/handlebar.js'
import { AstraEditorJavascriptPlugin } from './components/astra-editor/plugins/javascript.js'
import AstraEditorPromptDialog from './components/astra-editor/plugins/prompt-dialog.js'
import { AstraEditorPromptPlugin } from './components/astra-editor/plugins/prompt.js'
import { AstraEditorSqlPlugin } from './components/astra-editor/plugins/sql.js'
import Button from './components/button.js'
import Calendar from './components/calendar/calendar.js'
import Card from './components/card.js'
import Chart from './components/charts/chart.js'
import ComposedChart from './components/charts/composed.js'
import Input from './components/input.js'
import ScrollArea from './components/scroll-area.js'
import Select from './components/select.js'
import Table from './components/table/core/index.js'
import OuterbaseTable from './components/table/outerbase-table.js'
import Text from './components/text.js'

// export * as Types from './types'
export {
  AstraEditor,
  AstraEditorHandlerbarPlugin,
  AstraEditorJavascriptPlugin,
  AstraEditorPromptDialog,
  AstraEditorPromptPlugin,
  AstraEditorSqlPlugin,
  Button,
  Calendar,
  Card,
  Chart,
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
      'astra-editor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string
        placeholder?: string
        theme?: string
        readonly?: boolean
      }
      'astra-editor-sql': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { dialect?: string; schema?: string }
      'astra-editor-javascript': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { typescript?: boolean }
      'astra-editor-handlebar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { variables?: string }
      'astra-editor-prompt': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { token?: string }
      'astra-editor-prompt-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}
