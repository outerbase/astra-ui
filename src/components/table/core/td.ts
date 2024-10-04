import { css, html, nothing, type PropertyValueMap, type PropertyValues, type TemplateResult } from 'lit'
import type { DirectiveResult } from 'lit/async-directive.js'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { UnsafeHTMLDirective, unsafeHTML } from 'lit/directives/unsafe-html.js'
import { v4 as uuid } from 'uuid'
import { eventTargetIsPlugin, eventTargetIsPluginEditor } from '../../../lib/event-target-is-plugin.js'
import { type MenuSelectedEvent } from '../../../lib/events.js'
import { PluginEvent, type ColumnPlugin, type Serializable } from '../../../types.js'
import '../../table/menu/cell-menu.js' // <astra-td-menu />
import type { CellMenu } from '../../table/menu/cell-menu.js'
import { JSON_TYPES, MutableElement } from '../mutable-element.js'

import '../../hans-wormhole.js'
import type { MenuItem } from '../menu/index.js'

type PluginActionEvent = CustomEvent<{ action: PluginEvent.onEdit | PluginEvent.onStopEdit | PluginEvent.onCancelEdit; value: any }>

const isAlphanumericOrSpecial = (key: string): boolean => {
  // Regular expression to match alphanumeric characters and specified special characters
  return /^[a-zA-Z0-9 \.,]+$/.test(key)
}
// const returnCharacterPlaceholderRead = '↩'
const returnCharacterPlaceholderRead = ' '

const RW_OPTIONS: MenuItem[] = [
  {
    label: 'Insert Value',
    id: 'insert-value',
    subItems: [
      { id: 'null', label: 'NULL', value: null, monospaced: true },
      { id: 'default', label: 'DEFAULT', value: undefined, monospaced: true },
      { separator: true },
      { id: 'timestamp', label: Date.now().toString(), suplabel: 'Unix Timestamp', value: Date.now(), monospaced: true },
      { separator: true },
      { id: 'uuid', label: uuid(), suplabel: 'UUID', value: uuid(), monospaced: true },
    ],
    // TODO generate this when the menu is opened so that time/uuid is proper
    // TODO add icon
  },

  { separator: true },

  { label: 'Edit', id: 'edit' },
  { label: 'Copy', id: 'copy' },
  { label: 'Paste', id: 'paste' },
  { label: 'Clear', id: 'clear' },
]

const R_OPTIONS = [{ label: 'Copy', id: 'copy' }]

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

        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
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

      this.menuIsOpen = true
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

    if (self.blank) {
      return
    }

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
    if (menu?.isOpen) {
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
    const noMetaKeys = !event.metaKey
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

    if (code === 'ArrowDown') {
      event.preventDefault()
      ;(target?.nextElementSibling as HTMLElement)?.focus()
      return
    } else if (code === 'ArrowUp') {
      event.preventDefault()
      const checkbox = target?.previousElementSibling?.querySelector('check-box') as HTMLElement | undefined
      if (checkbox) checkbox.focus()
      else (target?.previousElementSibling as HTMLElement | undefined)?.focus()
      return
    } else if (code === 'ArrowRight') {
      event.preventDefault()
      if (event.target instanceof HTMLElement && !self.isEditing) {
        MutableElement.moveFocusToNextRow(event.target)
        return
      }
    } else if (code === 'ArrowLeft') {
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
      'relative focus:z-[1]': true,
      'h-8 flex items-center justify-center': true,
      'border-theme-table-border dark:border-theme-table-border-dark': true,
      // TODO support odd vs even again
      'text-theme-table-column-content dark:text-theme-table-column-content-dark': true,
      'bg-theme-table-row-new dark:bg-theme-table-row-new-dark': this.rowIsNew,
      // 'hover:bg-theme-table-row-selected-hover dark:hover:bg-theme-row-selected-hover-dark': this.isActive,
      'bg-theme-table-row-even dark:bg-theme-table-row-even-dark': !this.rowIsNew && !this.isActive && (!this.dirty || this.hideDirt),
      'bg-theme-table-row-selected dark:bg-theme-table-row-selected-dark':
        !this.rowIsNew && this.isActive && (!this.dirty || this.hideDirt), // i.e. this is the column being sorted
      'bg-theme-table-cell-dirty dark:bg-theme-table-cell-dirty-dark': !this.rowIsNew && this.dirty && !this.hideDirt, // dirty cells
      'group-hover:bg-theme-table-row-hover dark:group-hover:bg-theme-table-row-hover-dark': !this.dirty || this.hideDirt,
      'focus:shadow-ringlet dark:focus:shadow-ringlet-dark focus:rounded-[4px] focus:ring-1 focus:ring-black dark:focus:ring-neutral-300 focus:outline-none':
        !this.isEditing && this.isInteractive,
      'border-r':
        this.resizable || // include or it looks funny that a resize handler is above it
        (this.separateCells && this.isLastColumn && this.outerBorder) || // include last column when outerBorder
        (this.separateCells && !this.isLastColumn), // internal cell walls
      // 'first:border-l': this.separateCells && this.outerBorder, // left/right borders when the `separate-cells` attribute is set
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

  @property({ attribute: 'menu', type: Boolean })
  public hasMenu = false

  @property({ attribute: 'row-is-new', type: Boolean })
  public rowIsNew = false

  @state() menuIsOpen = false
  @state() isContentEditable = true // this property is to toggle off the contenteditableness of to resolve quirky focus and text selection that can happen when, say, right-clicking to trigger the context menu
  @state() protected options = RW_OPTIONS
  @state() isHoveringCell = false
  @state() displayValue?: Serializable
  @state() valueEscaped?: Serializable
  @state() cellContents?: TemplateResult<1>
  @state() cellEditorContents?: DirectiveResult<typeof UnsafeHTMLDirective>
  @state() pluginAccessory?: DirectiveResult<typeof UnsafeHTMLDirective> | typeof nothing = nothing

  private contentEditableWrapper: Ref<HTMLDivElement> = createRef()
  private _interstitialValue: Serializable

  constructor() {
    super()

    this.onDisplayEditor = this.onDisplayEditor.bind(this)
    this.onPluginChangeEvent = this.onPluginChangeEvent.bind(this)
    this.onMenuSelection = this.onMenuSelection.bind(this)
    this.onPaste = this.onPaste.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onContextMenu = this.onContextMenu.bind(this)
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
    switch (event.value?.id) {
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
      case 'null':
        this.value = event.value.value
        this.dispatchChangedEvent()
        return
      case 'timestamp':
        this.value = Date.now()
        this.dispatchChangedEvent()
        return
      case 'uuid':
        this.value = uuid()
        this.dispatchChangedEvent()
        return
      case 'default': // as in the database value DEFAULT
      default: // this also handles `reset`
        this.value = event.value.value // `undefined` is "default"
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

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('contextmenu', this.onContextMenu)
    this.removeEventListener('keydown', TableData.onKeyDown)
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
    const has = changedProperties.has.bind(changedProperties)

    if (has('blank')) {
      if (!this.blank) this.tabIndex = 0
      // setting `-1` or `0` seems to have the same result
      // i.e. if we ever set it, we can't unset it
      // but if it's initially set to `-1` it works properly
      // but if _we_ set it to `-1`, it act like its `0`
    }

    if (has('value')) {
      let value = this.value

      if (typeof value === 'object') value = JSON.stringify(this.value)
      if (typeof value === 'string') value = value.replace(/'/g, '&#39;').replace(/"/g, '&quot;').replace(/`/g, '&#96;')

      this.valueEscaped = value
      this.displayValue = value
      if (this.displayValue && typeof this.displayValue === 'string') {
        // Replace single, double, and backticks with their HTML entity equivalents
        this.displayValue = this.displayValue.replace(/&quot;/g, '"')?.replace(/&#39;/g, "'")
      }
    }

    if (
      has('plugin') ||
      has('valueEscaped') ||
      has('displayValue') ||
      has('column') ||
      has('pluginAttributes') ||
      has('isHoveringCell') ||
      has('value') ||
      has('isDisplayingPluginEditor')
    ) {
      const placeholderTextColorClass = 'text-neutral-400 dark:text-white/50'
      const classes =
        this.valueEscaped === null || this.valueEscaped === undefined ? placeholderTextColorClass : 'overflow-hidden text-ellipsis'
      const commonCellContents = html`<div class="${classes}">
        ${this.displayValue === null
          ? 'NULL'
          : this.displayValue === undefined
            ? 'DEFAULT'
            : typeof this.displayValue === 'string'
              ? this.displayValue.replace(/\n/g, returnCharacterPlaceholderRead)
              : this.displayValue}
      </div>`

      if (this.plugin) {
        const { config, tagName } = this.plugin

        // TODO the plugin receives `null` as a string 'null' since params are always stringified
        //      we can resolve this by omitting `cellvalue` to represent null, but as of today, that renders `undefined` in our plugins
        //      `<${tagName} ${value !== null ? `cellvalue='${value}` : ''} configuration='${config}' ${this.pluginAttributes}></${tagName}>`
        const pluginAsString = unsafeHTML(
          `<${tagName} cellvalue='${this.value}' columnName='${this.column}' configuration='${config}' ${this.pluginAttributes}></${tagName}>`
        )
        this.cellContents = html`${pluginAsString}`

        const pluginAccessoryTag = tagName.replace('outerbase-plugin-cell', 'outerbase-plugin-cell-accessory')
        this.pluginAccessory = customElements.get(pluginAccessoryTag)
          ? unsafeHTML(
              `<${pluginAccessoryTag} ishoveringcell='${this.isHoveringCell}' cellvalue='${this.value}' columnName='${this.column}' configuration='${config}' ${this.pluginAttributes}></${pluginAccessoryTag}>`
            )
          : nothing

        if (this.isDisplayingPluginEditor) {
          this.cellEditorContents = unsafeHTML(
            `<${tagName
              .replace('outerbase-plugin-cell', 'outerbase-plugin-editor') // state of affairs May 3 2024
              .replace(
                // possible future migration
                'astra-plugin-cell',
                'astra-plugin-editor'
              )} cellvalue='${this.value}' columnName='${this.column}' configuration='${config}' ${this.pluginAttributes}></${tagName}>`
          )
        }
        this.requestUpdate('cellContents')
      } else {
        this.cellContents = commonCellContents
        this.requestUpdate('cellContents')
      }
    }
  }

  public override render() {
    const themeClass = this.theme === 'dark' ? 'dark' : ''
    const inputEl = this.isEditing // &nbsp; prevents the row from collapsing (in height) when there is only 1 column
      ? html`<div class="${themeClass}">&nbsp;<input .value=${typeof this.displayValue === 'string' ? this.displayValue : (this.displayValue ?? '')} ?readonly=${this.readonly} @input=${this.onChange} class="z-[2] absolute top-0 bottom-0 right-0 left-0 bg-theme-table-cell-mutating-background dark:bg-theme-table-cell-mutating-background-dark outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 px-3 focus:rounded-[4px]" @blur=${this.onBlur}></input></div>`
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
            value: this.originalValue,
            id: 'reset',
          },
        ]
      : this.options
    const editorViaWormhole = html`
      <hans-wormhole .open=${this.isDisplayingPluginEditor} .anchorId=${this.id} modal>
        <span id="plugin-editor" class="caret-current cursor-auto z-10">${this.cellEditorContents}</span>
      </hans-wormhole>
    `
    const contents = html`
      <div class="flex items-center px-cell-padding-x ${this.blank ? 'justify-center' : null}">
        <span class="flex-auto truncate ${this.theme === 'dark' ? 'dark' : ''}">${this.cellContents}</span>
        ${this.pluginAccessory}
      </div>
    `

    // the outer div is contenteditable, allowing us to get the `paste` event that an arbitrary element cannot otherwise receive
    // astra-td-menu wraps our content and provides a right-click menu
    const menuEl =
      this.isEditing || this.blank
        ? nothing
        : html`<div
            ${ref(this.contentEditableWrapper)}
            class="outline-none caret-transparent select-none truncate flex-auto"
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
            ${this.hasMenu
              ? html`<astra-td-menu
                  theme=${this.theme}
                  .items=${menuOptions}
                  ?open="${this.menuIsOpen}"
                  @closed=${() => {
                    this.menuIsOpen = false
                  }}
                  @menu-selection=${this.onMenuSelection}
                >
                  ${contents} ${editorViaWormhole}
                </astra-td-menu>`
              : html`${contents} ${editorViaWormhole}`}
          </div>`

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
