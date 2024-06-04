import { BarChart } from './bundle.js'
import Button from './components/button.js'
import Card from './components/card.js'
import Input from './components/input.js'
import ScrollArea from './components/scroll-area.js'
import Select from './components/select.js'
import Table from './components/table/index.js'
import Text from './components/text.js'

// export * as Types from './types'
export { BarChart, Button, Card, Input, ScrollArea, Select, Table, Text }

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
    }
  }
}
