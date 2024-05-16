import { css, html, type PropertyValueMap, type TemplateResult } from 'lit'
import type { DirectiveResult } from 'lit/async-directive.js'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { UnsafeHTMLDirective, unsafeHTML } from 'lit/directives/unsafe-html.js'

import { eventTargetIsPlugin, eventTargetIsPluginEditor } from '../../lib/event-target-is-plugin.js'
import { type MenuSelectedEvent } from '../../lib/events.js'
import { PluginEvent, Theme, type ColumnPlugin, type Serializable } from '../../types.js'
import { JSON_TYPES, MutableElement } from '../mutable-element.js'

import type { CellMenu } from '../menu/cell-menu.js'

import '../menu/cell-menu.js' // <astra-td-menu />

type PluginActionEvent = CustomEvent<{ action: PluginEvent.onEdit | PluginEvent.onStopEdit | PluginEvent.onCancelEdit; value: any }>

const isAlphanumericOrSpecial = (key: string): boolean => {
  // Regular expression to match alphanumeric characters and specified special characters
  return /^[a-zA-Z0-9 \.,]+$/.test(key)
}
const RW_OPTIONS = [
  { label: 'Edit', value: 'edit' },
  { label: 'Copy', value: 'copy' },
  { label: 'Paste', value: 'paste' },
  { label: 'Clear', value: 'clear' },
]

const R_OPTIONS = [{ label: 'Copy', value: 'copy' }]

// tl;dr <td/>, table-cell
@customElement('astra-td')
export class TableData extends MutableElement {
  static override styles = [
    ...MutableElement.styles,
    css`
      .nbsp::after {
        content: '.'; /* Non-breaking space */
        visibility: hidden;
      }
    `,
  ]

  static onClick(event: MouseEvent) {
    const el = event.currentTarget //as HTMLElement
    if (el instanceof TableData && !el.isDisplayingPluginEditor) {
      // only focus on click when NOT displaying a plugin's editor
      el.focus()
    }
  }

  static onContextMenu(event: MouseEvent) {
    const isPluginEditor = eventTargetIsPluginEditor(event)
    if (isPluginEditor) return

    const menu = (event.currentTarget as HTMLElement).shadowRoot?.querySelector('astra-td-menu') as CellMenu | null
    if (menu) {
      event.preventDefault()
      menu.focus()
      menu.open = true
    }
  }

  static onContentEditableKeyDown(event: KeyboardEvent) {
    // our goal here is to prevent the user from engaging with the `contenteditable` component
    const didNotOriginateInsidePluginEditor = event.composedPath().every((v) => {
      return v instanceof HTMLElement && v.id !== 'plugin-editor'
    })
    if (didNotOriginateInsidePluginEditor) event.preventDefault()
  }

  static onDragOver(event: DragEvent) {
    event.preventDefault()
  }

  static onDrop(event: DragEvent) {
    event.preventDefault()
  }

  static onDoubleClick(event: MouseEvent) {
    const self = event.currentTarget as TableData

    if (self.isEditing) return // allow double-clicking to select text while editing
    if (!eventTargetIsPluginEditor(event)) {
      self.isEditing = true
      setTimeout(() => {
        const input = self.shadowRoot?.querySelector('input')

        if (input) {
          input.focus()

          // set cursor to end if writable
          if (!self.readonly) input.setSelectionRange(input.value.length, input.value.length)
        }
      }, 0)
    }
  }

  static copyValueToClipboard(value: Serializable) {
    if (value === null || value === undefined) return navigator.clipboard.writeText('')
    else if (typeof value === 'object') return navigator.clipboard.writeText(JSON.stringify(value))
    else return navigator.clipboard.writeText(value.toString())
  }

  static async onKeyDown(event: KeyboardEvent): Promise<void> {
    // ignore events being fired from a Plugin
    if (eventTargetIsPlugin(event)) return

    const self = event.currentTarget as TableData

    // don't interfere with menu behavior
    const menu = self.shadowRoot?.querySelector('astra-td-menu') as CellMenu | null
    if (menu?.open) {
      return
    }
    if (self.plugin && event.code === 'Enter' && event.target instanceof HTMLElement) {
      MutableElement.moveFocusToNextRow(event.target)
      return
    }

    MutableElement.onKeyDown(event)

    // ignore events fired while editing
    if (self.isEditing) return

    const { code } = event

    let target = event.target
    if (!(target instanceof HTMLElement)) return

    // handle events from a <check-box />
    if (target.tagName.toLowerCase() === 'check-box') {
      const parent = target.parentElement?.parentElement?.parentElement

      if (code === 'ArrowDown') {
        event.preventDefault()
        ;(parent?.nextElementSibling?.querySelector('check-box') as HTMLElement | undefined)?.focus()
      } else if (code === 'ArrowUp') {
        event.preventDefault()
        ;(parent?.previousElementSibling?.querySelector('check-box') as HTMLElement | undefined)?.focus()
      } else if (code === 'ArrowRight') {
        event.preventDefault()
        ;(target.parentElement?.parentElement?.nextElementSibling as HTMLElement | undefined)?.focus()
      }
      return
    }

    // begin editing if keys are ASCII-ish
    const isInputTriggering = event.key.length === 1 && isAlphanumericOrSpecial(event.key)
    const noMetaKeys = !(event.metaKey || event.shiftKey)
    const typeIsNotJSON = !(self.type && JSON_TYPES.includes(self.type))
    if (isInputTriggering && noMetaKeys && typeIsNotJSON) {
      event.preventDefault()

      // toggle editing mode
      self.isEditing = true

      // append this character
      if (self.value === undefined || self.value === null) self.value = event.key
      else self.value += event.key

      // set the cursor input to the end
      setTimeout(() => {
        const input = self.shadowRoot?.querySelector('input')
        input?.focus()
        input?.setSelectionRange(input.value.length, input.value.length)
      }, 0)
    }

    // navigating around the table

    if (code === 'ArrowRight') {
      event.preventDefault()
      ;(target?.nextElementSibling as HTMLElement)?.focus()
      return
    } else if (code === 'ArrowLeft') {
      event.preventDefault()
      const checkbox = target?.previousElementSibling?.querySelector('check-box') as HTMLElement | undefined
      if (checkbox) checkbox.focus()
      else (target?.previousElementSibling as HTMLElement | undefined)?.focus()
      return
    } else if (code === 'ArrowDown') {
      event.preventDefault()
      if (event.target instanceof HTMLElement && !self.isEditing) {
        MutableElement.moveFocusToNextRow(event.target)
        return
      }
    } else if (code === 'ArrowUp') {
      event.preventDefault()
      if (event.target instanceof HTMLElement && !self.isEditing) {
        MutableElement.moveFocusToPreviousRow(event.target)
        return
      }
    }

    // copy focused cells
    if (event.metaKey && code === 'KeyC') {
      event.preventDefault()
      return TableData.copyValueToClipboard(self.value)
    }

    if (!self.readonly && (code === 'Backspace' || code === 'Delete')) {
      event.preventDefault()
      self.value = null
      return
    }
  }

  static onPaste(event: ClipboardEvent) {
    const td = event.composedPath().find((t) => {
      const el = t as HTMLElement
      if (el.tagName?.toLowerCase() === 'astra-td') return true
    }) as TableData | undefined

    if (td) {
      event.preventDefault()
      td.value = event.clipboardData?.getData('text')
    }
  }

  protected override classMap() {
    return {
      ...super.classMap(),
      'table-cell relative focus:z-[1]': true,
      'px-cell-padding-x py-cell-padding-y ': !this.plugin && !this.blank,
      'px-5': this.blank,
      'border-theme-border dark:border-theme-border-dark': true,
      'bg-theme-cell dark:bg-theme-cell-dark text-theme-cell-text dark:text-theme-cell-text-dark': true,
      'bg-theme-cell-dirty dark:bg-theme-cell-dirty-dark': this.dirty && !this.hideDirt, // dirty cells
      'group-hover:bg-theme-row-hover dark:group-hover:bg-theme-row-hover-dark': !this.dirty || this.hideDirt,
      'focus:shadow-ringlet dark:focus:shadow-ringlet-dark focus:rounded-[4px] focus:ring-1 focus:ring-black dark:focus:ring-neutral-300 focus:outline-none':
        !this.isEditing && this.isInteractive,
      'border-r':
        this.isInteractive ||
        (this._drawRightBorder && this.separateCells && this.isLastColumn && this.outerBorder) || // include last column when outerBorder
        (this._drawRightBorder && this.separateCells && !this.isLastColumn), // internal cell walls
      'first:border-l': this.separateCells && this.outerBorder, // left/right borders when the `separate-cells` attribute is set
      'border-b': this.withBottomBorder, // bottom border when the `with-bottom-border` attribute is set
    }
  }

  @property({ attribute: 'plugin-attributes', type: String })
  public pluginAttributes: String = ''

  // allows, for example, <astra-td bottom-border="true" />
  @property({ type: Boolean, attribute: 'bottom-border' })
  public withBottomBorder: boolean = false

  @property({ type: Boolean, attribute: 'odd' })
  public isOdd?: boolean

  @property({ type: Boolean, attribute: 'draw-right-border' })
  public _drawRightBorder = false

  @property({ type: Boolean, attribute: 'row-selector' })
  public isRowSelector = false

  @property({ attribute: 'row', type: Number })
  public row = undefined

  @property({ attribute: 'column', type: Number })
  public column = undefined

  @property({ attribute: 'hide-dirt', type: Boolean })
  public hideDirt = false

  @property({ attribute: 'plugin', type: String })
  public plugin?: ColumnPlugin

  @property({ attribute: 'is-displaying-plugin-editor', type: Boolean })
  public isDisplayingPluginEditor = false

  @property({ attribute: 'is-first-row', type: Boolean })
  public isFirstRow = false

  // @property({ attribute: 'is-last-row', type: Boolean })
  // public isLastRow = false

  @state() protected options = RW_OPTIONS

  private _interstitialValue: Serializable

  constructor() {
    super()

    this.onDisplayEditor = this.onDisplayEditor.bind(this)
    this.onPluginChangeEvent = this.onPluginChangeEvent.bind(this)
    this.onMenuSelection = this.onMenuSelection.bind(this)
    this.focus = this.focus.bind(this)
  }

  protected onDisplayEditor(event: MouseEvent) {
    const path = event.composedPath()
    const didClickInsidePluginEditor = path.some((v) => {
      return v instanceof HTMLElement && v.id === 'plugin-editor'
    })
    if (!didClickInsidePluginEditor) {
      this.isDisplayingPluginEditor = false
    }
  }

  protected onPluginChangeEvent({ detail: { action, value } }: PluginActionEvent) {
    // TODO not `.toLowerCase()`? update the enum to match what is emitted?
    const eventName = action.toLowerCase()
    if (eventName === PluginEvent.onEdit) {
      this.isDisplayingPluginEditor = true
    } else if (eventName === PluginEvent.onStopEdit) {
      this.isDisplayingPluginEditor = false
      // TODO update our value to match the one from the editor
    } else if (eventName === PluginEvent.onCancelEdit) {
      this.isDisplayingPluginEditor = false
    } else if (eventName === PluginEvent.updateCell) {
      this._interstitialValue = value
    }
  }

  protected async onMenuSelection(event: MenuSelectedEvent) {
    switch (event.value) {
      case 'edit':
        return (this.isEditing = true)
      case 'copy':
        return TableData.copyValueToClipboard(this.value)
      case 'paste':
        this.value = await navigator.clipboard.readText()
        this.dispatchChangedEvent()
        return
      case 'clear':
        this.value = null
        this.dispatchChangedEvent()
        return
      case 'reset':
        this.value = this.originalValue
        this.dispatchChangedEvent()
        return
    }
  }

  public override focus() {
    this.shadowRoot?.querySelector<HTMLElement>('[contenteditable]')?.focus()
  }

  public override connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('contextmenu', TableData.onContextMenu)
    this.addEventListener('keydown', TableData.onKeyDown)
    this.addEventListener('click', TableData.onClick)

    // @ts-ignore insists on `Event` instead of `PluginActionEvent`
    this.addEventListener('custom-change', this.onPluginChangeEvent) // deprecated?
    // @ts-ignore insists on `Event` instead of `PluginActionEvent`
    this.addEventListener('plugin-change', this.onPluginChangeEvent)

    if (this.isInteractive) {
      this.addEventListener('dblclick', TableData.onDoubleClick)
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('contextmenu', TableData.onContextMenu)
    this.removeEventListener('keydown', TableData.onKeyDown)
    this.removeEventListener('click', TableData.onClick)
    this.removeEventListener('dblclick', TableData.onDoubleClick)

    // @ts-ignore insists on `Event` instead of `PluginActionEvent`
    this.removeEventListener('plugin-change', this.onPluginChangeEvent)
    // @ts-ignore insists on `Event` instead of `PluginActionEvent`
    this.removeEventListener('custom-change', this.onPluginChangeEvent) // deprecated?
  }

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    if (changedProperties.has('isDisplayingPluginEditor')) {
      if (typeof document === 'undefined') return
      if (this.isDisplayingPluginEditor) {
        // setTimeout is necessary or else it receives the current click event (?!)
        setTimeout(() => {
          document.addEventListener('click', this.onDisplayEditor)
        }, 0)
      } else {
        document.removeEventListener('click', this.onDisplayEditor)
      }
    }

    if (!changedProperties.has('isDisplayingPluginEditor') && this.isDisplayingPluginEditor) {
      // when a plugin editor IS displayed and it is NOT being removed
      return
    } else if (changedProperties.has('isDisplayingPluginEditor') && !this.isDisplayingPluginEditor && this._interstitialValue) {
      // when a plugin editor WAS displaying and set an intersititial value
      // we "commit" it to our `value` when the editor is dismissed
      this.value = this._interstitialValue
      delete this._interstitialValue
    }

    if (changedProperties.has('readonly')) {
      if (this.readonly) {
        this.options = R_OPTIONS
      } else {
        this.options = RW_OPTIONS
      }
    }

    // set id=first-cell on the first row, first column
    if (changedProperties.has('isFirstRow') || changedProperties.has('isFirstColumn')) {
      if (this.isFirstColumn && this.isFirstRow) {
        this.setAttribute('first-cell', 'true')
      } else {
        this.removeAttribute('first-cell')
      }
    }
  }

  public override render() {
    const value = this.value === null ? null : typeof this.value === 'object' ? JSON.stringify(this.value) : this.value
    const editorValue = this.value === null ? null : typeof this.value === 'object' ? JSON.stringify(this.value, null, 2) : this.value
    const contentWrapperClass = classMap({ 'font-normal': true, dark: this.theme == Theme.dark })

    let cellContents: TemplateResult<1>
    let cellEditorContents: DirectiveResult<typeof UnsafeHTMLDirective> | undefined

    if (this.plugin) {
      const { config, tagName } = this.plugin
      // TODO the plugin receives `null` as a string 'null' since params are always stringified
      //      we can resolve this by omitting `cellvalue` to represent null, but as of today, that renders `undefined` in our plugins
      //      `<${tagName} ${value !== null ? `cellvalue='${value}` : ''} configuration='${config}' ${this.pluginAttributes}></${tagName}>`
      const pluginAsString = unsafeHTML(`<${tagName} cellvalue='${value}' configuration='${config}' ${this.pluginAttributes}></${tagName}>`)
      cellContents = html`${pluginAsString}`

      if (this.isDisplayingPluginEditor) {
        cellEditorContents = unsafeHTML(
          `<${tagName
            .replace('outerbase-plugin-cell', 'outerbase-plugin-editor') // state of affairs May 3 2024
            .replace(
              // possible future migration
              'astra-plugin-cell',
              'astra-plugin-editor'
            )} cellvalue='${editorValue}' configuration='${config}' ${this.pluginAttributes}></${tagName}>`
        )
      }
    } else {
      const classes = value === null ? 'nbsp text-neutral-400 dark:text-neutral-600' : 'nbsp'
      cellContents = html`<span class=${classes}>${value ?? 'NULL'}</span>`
    }

    const inputEl = this.isEditing // &nbsp; prevents the row from collapsing (in height) when there is only 1 column
      ? html`<span class=${contentWrapperClass}>&nbsp;<input .value=${value ?? ''}
                ?readonly=${this.readonly}
                @input=${this.onChange}
                class=${classMap({
                  'z-[2] absolute top-0 bottom-0 right-0 left-0': true,
                  'bg-blue-50 dark:bg-blue-950 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700': true,
                  'px-3 font-normal focus:rounded-[4px]': true,
                })} @blur=${this.onBlur}></input></span>`
      : html``

    const emptySlot = this.blank ? html`<slot></slot>` : html``

    const menuOptions = this.dirty
      ? [
          ...this.options,
          {
            label:
              this.originalValue !== null && typeof this.originalValue === 'object'
                ? 'Revert'
                : html`Revert to <span class="pointer-events-none italic whitespace-nowrap">${this.originalValue ?? 'NULL'}</span>`,
            value: 'reset',
          },
        ]
      : this.options

    // note: contenteditable is all so we can get the `paste` event that an arbitrary htmleelement does not otherwise receive
    const menuEl =
      !this.isEditing && !this.blank
        ? html`<span
            class="outline-none caret-transparent"
            contenteditable="true"
            spellcheck="false"
            autocorrect="off"
            @paste=${TableData.onPaste}
            @keydown=${TableData.onContentEditableKeyDown}
            @dragover=${TableData.onDragOver}
            @drop=${TableData.onDrop}
            ><astra-td-menu
              theme=${this.theme}
              .options=${menuOptions}
              ?without-padding=${!!this.plugin}
              ?selectable-text=${!this.isInteractive}
              @menu-selection=${this.onMenuSelection}
              ><span class=${contentWrapperClass}>${cellContents}</span
              ><span id="plugin-editor" class="absolute top-8 caret-current cursor-auto">${cellEditorContents}</span></astra-td-menu
            ></span
          >`
        : html``

    return this.isEditing ? inputEl : this.blank ? emptySlot : menuEl
  }
}
