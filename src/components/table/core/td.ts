import { css, html, nothing, type PropertyValueMap, type PropertyValues, type TemplateResult } from 'lit'
import type { DirectiveResult } from 'lit/async-directive.js'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { UnsafeHTMLDirective, unsafeHTML } from 'lit/directives/unsafe-html.js'

import { eventTargetIsPlugin, eventTargetIsPluginEditor } from '../../../lib/event-target-is-plugin.js'
import { type MenuSelectedEvent } from '../../../lib/events.js'
import { PluginEvent, type ColumnPlugin, type Serializable } from '../../../types.js'
import '../../table/menu/cell-menu.js' // <astra-td-menu />
import type { CellMenu } from '../../table/menu/cell-menu.js'
import { JSON_TYPES, MutableElement } from '../mutable-element.js'

type PluginActionEvent = CustomEvent<{ action: PluginEvent.onEdit | PluginEvent.onStopEdit | PluginEvent.onCancelEdit; value: any }>

const isAlphanumericOrSpecial = (key: string): boolean => {
  // Regular expression to match alphanumeric characters and specified special characters
  return /^[a-zA-Z0-9 \.,]+$/.test(key)
}
// const returnCharacterPlaceholderRead = '↩'
const returnCharacterPlaceholderRead = ' '

const RW_OPTIONS = [
  { label: 'Edit', value: 'edit' },
  { label: 'Copy', value: 'copy' },
  { label: 'Paste', value: 'paste' },
  { label: 'Clear', value: 'clear' },
]

const R_OPTIONS = [{ label: 'Copy', value: 'copy' }]

if (customElements.get('astra-td')) {
  // System has already registered `astra-td`
}

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

      :host {
        backdrop-filter: blur(var(--astra-table-backdrop-blur));
        -webkit-backdrop-filter: blur(var(--astra-table-backdrop-blur));
        -moz-backdrop-filter: blur(var(--astra-table-backdrop-blur));
        -o-backdrop-filter: blur(var(--astra-table-backdrop-blur));
        -ms-backdrop-filter: blur(var(--astra-table-backdrop-blur));
      }
    `,
  ]

  onContextMenu(event: MouseEvent) {
    const isPluginEditor = eventTargetIsPluginEditor(event)
    if (isPluginEditor) return
    this.isContentEditable = false

    const menu = (event.currentTarget as HTMLElement).shadowRoot?.querySelector('astra-td-menu') as CellMenu | null
    if (menu) {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()

      menu.open = true

      const onMenuClose = () => {
        this.isContentEditable = true
        menu.removeEventListener('menuclose', onMenuClose)
      }

      menu.addEventListener('menuclose', onMenuClose)
    }
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

      if (!self.readonly) {
        // toggle editing mode
        self.isEditing = true

        // replace the contents
        self.value = event.key

        // set the cursor input to the end
        setTimeout(() => {
          const input = self.shadowRoot?.querySelector('input')
          input?.focus()
          input?.setSelectionRange(input.value.length, input.value.length)
        }, 0)
      }
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

  protected onClick(_event: MouseEvent) {
    if (this.isDisplayingPluginEditor || this.plugin) return // yield to plugin

    this.contentEditableWrapper.value?.focus()
  }

  protected onPaste(event: ClipboardEvent) {
    if (this.isDisplayingPluginEditor || this.plugin) return // yield to plugin
    event.preventDefault()
    this.value = event.clipboardData?.getData('text')
  }

  protected override classMap() {
    return {
      ...super.classMap(),
      'table-cell relative focus:z-[1]': true,
      'px-5': this.blank,
      'border-theme-table-border dark:border-theme-table-border-dark': true,
      'bg-theme-table-row-selected dark:bg-theme-table-row-selected-dark': this.isActive && (!this.dirty || this.hideDirt), // i.e. this is the column being sorted
      'bg-theme-table-cell-dirty dark:bg-theme-table-cell-dirty-dark': this.dirty && !this.hideDirt, // dirty cells
      'group-hover:bg-theme-table-row-hover dark:group-hover:bg-theme-table-row-hover-dark': !this.dirty || this.hideDirt,
      'focus:shadow-ringlet dark:focus:shadow-ringlet-dark focus:rounded-[4px] focus:ring-1 focus:ring-black dark:focus:ring-neutral-300 focus:outline-none':
        !this.isEditing && this.isInteractive,
      'border-r':
        this.resizable || // include or it looks funny that a resize handler is above it
        (this.separateCells && this.isLastColumn && this.outerBorder) || // include last column when outerBorder
        (this.separateCells && !this.isLastColumn), // internal cell walls
      'first:border-l': this.separateCells && this.outerBorder, // left/right borders when the `separate-cells` attribute is set
      'border-b': !this.isLastRow || (this.isLastRow && this.outerBorder) || (this.isLastRow && this.bottomBorder), // bottom border unless last row
    }
  }

  @property({ attribute: 'plugin-attributes', type: String })
  public pluginAttributes: String = ''

  @property({ type: Boolean, attribute: 'odd' })
  public isOdd?: boolean

  @property({ type: Boolean, attribute: 'row-selector' })
  public isRowSelector = false

  @property({ attribute: 'row', type: Number })
  public row = undefined

  @property({ attribute: 'column', type: String })
  public column = undefined

  @property({ attribute: 'hide-dirt', type: Boolean })
  public hideDirt = false

  @property({ attribute: 'plugin', type: Object })
  public plugin?: ColumnPlugin

  @property({ attribute: 'is-displaying-plugin-editor', type: Boolean })
  public isDisplayingPluginEditor = false

  @property({ attribute: 'is-first-row', type: Boolean })
  public isFirstRow = false

  @property({ attribute: 'resizable', type: Boolean })
  public resizable = false

  @state() isContentEditable = true // this property is to toggle off the contenteditableness of to resolve quirky focus and text selection that can happen when, say, right-clicking to trigger the context menu
  @state() protected options = RW_OPTIONS
  @state() protected isHoveringCell = false

  private contentEditableWrapper: Ref<HTMLDivElement> = createRef()
  private _interstitialValue: Serializable

  constructor() {
    super()

    this.onDisplayEditor = this.onDisplayEditor.bind(this)
    this.onPluginChangeEvent = this.onPluginChangeEvent.bind(this)
    this.onMenuSelection = this.onMenuSelection.bind(this)
    this.onPaste = this.onPaste.bind(this)
    this.onClick = this.onClick.bind(this)
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
      delete this._interstitialValue
    } else if (eventName === PluginEvent.updateCell) {
      this._interstitialValue = value
      this.value = value
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

  public override connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('contextmenu', this.onContextMenu)
    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', TableData.onKeyDown)

    // @ts-ignore insists on `Event` instead of `PluginActionEvent`
    this.addEventListener('custom-change', this.onPluginChangeEvent) // deprecated?
    // @ts-ignore insists on `Event` instead of `PluginActionEvent`
    this.addEventListener('plugin-change', this.onPluginChangeEvent)

    if (this.isInteractive) {
      this.addEventListener('dblclick', TableData.onDoubleClick)
    }

    this.id = 'td'
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback()

    this.stopHoverCheck()

    this.removeEventListener('contextmenu', this.onContextMenu)
    this.removeEventListener('keydown', TableData.onKeyDown)
    this.removeEventListener('click', this.onClick)
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

  public override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties)
    if (changedProperties.has('blank')) {
      this.tabIndex = this.blank ? -1 : 0
    }
  }

  public override render() {
    let value = this.value === null ? null : typeof this.value === 'object' ? JSON.stringify(this.value) : this.value
    let displayValue = value
    let pluginAccessory: DirectiveResult<typeof UnsafeHTMLDirective> | typeof nothing = nothing
    if (value && typeof value === 'string') {
      // Replace single, double, and backticks with their HTML entity equivalents
      value = value.replace(/'/g, '&#39;').replace(/"/g, '&quot;').replace(/`/g, '&#96;')
      displayValue = value?.replace(/&quot;/g, '"')?.replace(/&#39;/g, "'")
    }

    let cellContents: TemplateResult<1>
    let cellEditorContents: DirectiveResult<typeof UnsafeHTMLDirective> | undefined

    const classes =
      value === null || value === undefined ? 'nbsp text-neutral-400 dark:text-neutral-600' : 'nbsp overflow-hidden text-ellipsis'

    const commonCellContents = html`<div class=${classes} style="line-height: 34px;">
      ${displayValue === null
        ? 'NULL'
        : displayValue === undefined
          ? 'DEFAULT'
          : typeof displayValue === 'string'
            ? displayValue.replace(/\n/g, returnCharacterPlaceholderRead)
            : displayValue}
    </div>`

    if (this.plugin) {
      const { config, tagName } = this.plugin

      // TODO the plugin receives `null` as a string 'null' since params are always stringified
      //      we can resolve this by omitting `cellvalue` to represent null, but as of today, that renders `undefined` in our plugins
      //      `<${tagName} ${value !== null ? `cellvalue='${value}` : ''} configuration='${config}' ${this.pluginAttributes}></${tagName}>`
      const pluginAsString = unsafeHTML(
        `<${tagName} cellvalue='${value}' columnName='${this.column}' configuration='${config}' ${this.pluginAttributes}></${tagName}>`
      )

      const pluginAccessoryTag = tagName.replace('outerbase-plugin-cell', 'outerbase-plugin-cell-accessory')

      pluginAccessory = customElements.get(pluginAccessoryTag)
        ? unsafeHTML(
            `<${pluginAccessoryTag} ishoveringcell='${this.isHoveringCell}' cellvalue='${value}' columnName='${this.column}' configuration='${config}' ${this.pluginAttributes}></${pluginAccessoryTag}>`
          )
        : nothing

      cellContents = customElements.get(tagName) ? html`${pluginAsString}` : commonCellContents

      if (this.isDisplayingPluginEditor) {
        cellEditorContents = unsafeHTML(
          `<${tagName
            .replace('outerbase-plugin-cell', 'outerbase-plugin-editor') // state of affairs May 3 2024
            .replace(
              // possible future migration
              'astra-plugin-cell',
              'astra-plugin-editor'
            )} cellvalue='${value}' columnName='${this.column}' configuration='${config}' ${this.pluginAttributes}></${tagName}>`
        )
      }
    } else {
      cellContents = commonCellContents
    }

    const themeClass = this.theme === 'dark' ? 'dark' : ''
    const inputEl = this.isEditing // &nbsp; prevents the row from collapsing (in height) when there is only 1 column
      ? html`<div class="${themeClass}" style="line-height: 34px;">&nbsp;<input .value=${typeof displayValue === 'string' ? displayValue : (displayValue ?? '')} ?readonly=${this.readonly} @input=${this.onChange} class="z-[2] absolute top-0 bottom-0 right-0 left-0 bg-theme-table-cell-mutating-background dark:bg-theme-table-cell-mutating-background-dark outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 px-3 focus:rounded-[4px]" @blur=${this.onBlur}></input></div>`
      : html``
    const emptySlot = this.blank ? html`<slot></slot>` : html``
    const menuOptions = this.dirty
      ? [
          ...this.options,
          {
            label:
              this.originalValue !== null && typeof this.originalValue === 'object'
                ? 'Revert'
                : html`Revert to
                    <span class="pointer-events-none italic whitespace-nowrap">
                      ${this.originalValue === null ? 'NULL' : this.originalValue === undefined ? 'DEFAULT' : this.originalValue}
                    </span>`,
            value: 'reset',
          },
        ]
      : this.options

    this.tabIndex = this.blank ? -1 : 0
    // the outer div is contenteditable, allowing us to get the `paste` event that an arbitrary element cannot otherwise receive
    // astra-td-menu wraps our content and provides a right-click menu
    const menuEl =
      !this.isEditing && !this.blank
        ? html`<span
            ${ref(this.contentEditableWrapper)}
            class="outline-none caret-transparent select-none"
            contenteditable="${this.isContentEditable}"
            spellcheck="false"
            autocorrect="off"
            @dragover=${TableData.onDragOver}
            @drop=${TableData.onDrop}
            @paste=${this.onPaste}
            @pointerenter=${this.onPointerEnter}
            @pointerleave=${this.onPointerLeave}
            tabindex="-1"
          >
            <astra-td-menu theme=${this.theme} .options=${menuOptions} @menu-selection=${this.onMenuSelection}>
              <div class="flex items-center px-cell-padding-x">
                <span class="flex-auto truncate ${this.theme === 'dark' ? 'dark' : ''}">${cellContents}</span>
                ${pluginAccessory}
              </div>

              <hans-wormhole .open=${this.isDisplayingPluginEditor} .anchorId=${this.id}>
                <span id="plugin-editor" class="caret-current cursor-auto z-10">${cellEditorContents}</span>
              </hans-wormhole>
            </astra-td-menu>
          </span>`
        : html``

    return this.isEditing ? inputEl : this.blank ? emptySlot : menuEl
  }

  protected onPointerEnter() {
    this.isHoveringCell = true
    this.startHoverCheck()
  }

  protected onPointerLeave() {
    this.isHoveringCell = false
    this.stopHoverCheck()
  }

  protected startHoverCheck() {
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  protected stopHoverCheck() {
    document.removeEventListener('mousemove', this.handleMouseMove)
  }

  private handleMouseMove = (event: MouseEvent) => {
    const rect = this.getBoundingClientRect()
    const mouseX = event.clientX
    const mouseY = event.clientY

    if (mouseX < rect.left || mouseX > rect.right || mouseY < rect.top || mouseY > rect.bottom) {
      this.isHoveringCell = false
      this.stopHoverCheck()
    }
  }
}
