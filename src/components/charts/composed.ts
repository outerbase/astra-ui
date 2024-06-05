import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ClassifiedElement } from '../classified-element.js'

@customElement('composed-chart')
export default class ComposedChart extends ClassifiedElement {
  render() {
    return html`<div class="${classMap({ dark: this.theme === 'dark' })}">
      <div
        id="composed-chart"
        class="dark:text-neutral-50 text-neutral-950 flex flex-col p-4 gap-2 rounded-lg border bg-neutral-50 dark:bg-neutral-950 group"
      >
        <div id="header" class=" flex justify-between w-full">
          <div id="header-labels" class="flex flex-col gap-2">
            <h1 class="text-xl font-semibold">Blah blah blah</h1>
            <h2 class="text-md">Yadda yadda yadda</h2>
          </div>

          <div id="actions" class="hidden group-hover:block">
            <a href="#" class="bg-neutral-100 dark:bg-neutral-900 rounded-md border p-1 text-xs">---</a>
          </div>
        </div>

        <div id="quickies" class="flex items-center justify-between">
          <span class="bg-neutral-200 dark:bg-neutral-800 p-1 border px-8 rounded-md">widget-1</span>
          <span class="bg-neutral-200 dark:bg-neutral-800 p-1 border px-8 rounded-md">widget-2</span>
          <span class="bg-neutral-200 dark:bg-neutral-800 p-1 border px-8 rounded-md">widget-3</span>
          <span class="bg-neutral-200 dark:bg-neutral-800 p-1 border px-8 rounded-md">widget-4</span>
        </div>

        <div
          id="chart"
          class="bg-neutral-200 dark:bg-neutral-800 flex-1 p-2 flex items-center justify-center min-h-96 border-dashed border rounded-lg"
        >
          This is a chart.
        </div>
      </div>
    </div>`
  }
}
