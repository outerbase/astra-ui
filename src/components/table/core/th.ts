import { html, type PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'

// import subcomponents
import {
  ColumnHiddenEvent,
  ColumnPinnedEvent,
  ColumnPluginActivatedEvent,
  ColumnPluginDeactivatedEvent,
  ColumnRemovedEvent,
  ColumnRenameEvent,
  ColumnUpdatedEvent,
  MenuSelectedEvent,
  ResizeEvent,
} from '../../../lib/events.js'
import type { ColumnPlugin, HeaderMenuOptions, PluginWorkspaceInstallationId } from '../../../types.js'
import '../../table/menu/column-menu.js' // <astra-th-menu />
import '../column-resizer-element.js'
import type { ColumnMenu } from '../menu/column-menu.js'
import { MutableElement } from '../mutable-element.js'

// tl;dr <th/>, table-cell
@customElement('astra-th')
export class TH extends MutableElement {
  protected override classMap() {
    return {
      ...super.classMap(),
      'relative whitespace-nowrap': true,
      'h-9 flex items-center': true,
      'cursor-pointer': true,
      'border-b border-theme-table-border dark:border-theme-table-border-dark': true,
      'first:border-l border-t': this.outerBorder,
      'px-cell-padding-x align-middle': true,
      'whitespace-nowrap truncate': true,
      // 'py-cell-padding-y': true,
      // 'h-full absolute top-0 bottom-0 left-0 right-0': true,
      // 'h-full': true,
      'text-theme-table-column-content dark:text-theme-table-column-content-dark': true,
      'bg-theme-table-column dark:bg-theme-table-column-dark': !this.dirty && !this.isActive,
      'bg-theme-table-row-selected dark:bg-theme-table-row-selected-dark': !this.dirty && this.isActive, // i.e. this is the column being sorted
      'bg-theme-table-cell-dirty dark:bg-theme-table-cell-dirty-dark': this.dirty,
      'select-none': this.hasMenu, // this is really about handling SSR without hydration; TODO use a better flag?
      // prevent double borders
      'border-r':
        (!this.withResizer && this.isLastColumn && this.outerBorder) || (!this.withResizer && this.separateCells && !this.isLastColumn),
    }
  }

  public override readonly = true

  @property({ attribute: 'table-height', type: Number })
  public tableHeight?: number

  @property({ attribute: 'with-resizer', type: Boolean })
  public withResizer = false

  @property({ attribute: 'plugins', type: Array })
  public plugins?: Array<ColumnPlugin>

  @property({ attribute: 'installed-plugins', type: Object })
  public installedPlugins: Record<string, PluginWorkspaceInstallationId | undefined> = {}

  @property({ attribute: 'options', type: Array })
  public options: HeaderMenuOptions = []

  @property({ attribute: 'value', type: String })
  override get value(): string | undefined {
    return this._value?.toString()
  }
  override set value(newValue: string) {
    const oldValue = this._value
    this._value = newValue
    this.requestUpdate('value', oldValue)
  }

  @property({ attribute: 'original-value', type: String })
  override get originalValue(): string | undefined {
    return this._originalValue?.toString()
  }
  override set originalValue(newValue: string) {
    const oldValue = this._originalValue
    this._originalValue = newValue
    this.requestUpdate('value', oldValue)
  }

  @state() private _previousWidth = 0
  @state() protected _options: HeaderMenuOptions = []
  @state() protected _pluginOptions: HeaderMenuOptions = []

  protected override dispatchChangedEvent() {
    if (typeof this.originalValue !== 'string') return

    this.dispatchEvent(
      new ColumnRenameEvent({
        name: this.originalValue,
        data: { name: this.value },
      })
    )
  }

  protected onMenuSelection(event: MenuSelectedEvent) {
    event.stopPropagation()
    let dispatchColumnUpdateEvent = false

    const columnName = this.originalValue ?? this.value ?? ''

    // handle (potential) plugin selection
    const plugin = this.plugins?.find(({ tagName }) => event.value.value === tagName)
    if (plugin) {
      return this.dispatchEvent(new ColumnPluginActivatedEvent(columnName, { ...plugin, columnName }))
    }

    // look for the 'none' plugin and delete installed column plugin as a result when chosen
    if (event.value.value === 'uninstall-column-plugin') {
      // starboard can immediately update it's state
      // dashboard will also receive this event

      const installedPlugin = this.installedPlugins[columnName]
      if (!installedPlugin) throw new Error(`Attempting to uninstall a non-existent plugin on ${columnName}`)

      this.dispatchEvent(new ColumnPluginDeactivatedEvent(columnName, installedPlugin))
    }

    switch (event.value.value) {
      case 'hide':
        return this.hideColumn()
      case 'rename':
        return (this.isEditing = true)
      case 'delete':
        return this.removeColumn()
      case 'reset':
        this.dispatchEvent(
          new ColumnRenameEvent({
            name: this.originalValue ?? '',
            data: { value: this.value },
          })
        )
        return (this.value = this.originalValue ?? '')
      case 'pin':
        this.dispatchPinnedEvent(true)
        return
      default:
        // intentionally let other (e.g. sorting) events pass-through to parent
        dispatchColumnUpdateEvent = true
    }

    if (dispatchColumnUpdateEvent) {
      this.dispatchEvent(
        new ColumnUpdatedEvent({
          name: this.originalValue ?? this.value ?? '',
          data: { action: event.value.value },
        })
      )
    }
  }

  protected dispatchPinnedEvent(pinned: boolean) {
    const name = this.originalValue ?? this.value

    if (!name) {
      throw new Error('Column has no value or original value to identify it')
    }

    this.dispatchEvent(
      new ColumnPinnedEvent({
        name,
        data: {
          previousValue: this.originalValue,
          value: this.value,
          pinned,
        },
      })
    )
  }

  protected onContextMenu(event: MouseEvent) {
    const menu = this.shadowRoot?.querySelector('astra-th-menu') as ColumnMenu | null
    if (menu) {
      event.preventDefault()
      menu.isOpen = true
    }
  }

  protected onClick(event: MouseEvent) {
    const path = event.composedPath() as Array<HTMLElement>
    const hasTrigger = path.some((p) => p.getAttribute?.('id') === 'wormhole')
    const name = this.originalValue ?? this.value
    const isNotResizer = !path.some((p) => p.tagName?.toLowerCase() === 'column-resizer')

    // we check for the 'trigger' which is the button inside this cell
    // if it's being clicked we don't want to interfere with it's operation / trigger sorting
    if (!hasTrigger && name && isNotResizer) {
      this.dispatchEvent(
        new ColumnUpdatedEvent({
          name,
          data: { action: 'sort' },
        })
      )
    } else {
      // ignore
    }
  }

  public removeColumn() {
    if (!this.originalValue) throw new Error('missing OG value')

    this.dispatchEvent(
      new ColumnRemovedEvent({
        name: this.originalValue,
      })
    )
  }

  public hideColumn() {
    if (!this.originalValue) throw new Error('missing column name (i.e. this.originalValue)')

    this.dispatchEvent(
      new ColumnHiddenEvent({
        name: this.originalValue,
      })
    )
  }

  public override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('contextmenu', this.onContextMenu)
    this.addEventListener('click', this.onClick)
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('contextmenu', this.onContextMenu)
    this.removeEventListener('click', this.onClick)
  }

  public override firstUpdated(changedProperties: PropertyValueMap<this>): void {
    super.firstUpdated(changedProperties)

    if (this.width && this.style) {
      this.style.width = this.width
    }
  }

  public override willUpdate(changedProperties: PropertyValueMap<this>) {
    super.willUpdate(changedProperties)

    if (changedProperties.has('plugins')) {
      this._pluginOptions =
        this.plugins?.map((plugin) => ({
          label: plugin.displayName,
          value: plugin.tagName,
        })) ?? []
    }

    if (changedProperties.has('width') && this.width && this.style) {
      this.style.width = this.width
    }

    if (changedProperties.has('readonly')) {
      if (this.readonly) {
        this.options = [
          { label: 'Pin Column', value: 'pin' },
          {
            label: 'Sort A-Z',
            value: 'sort:alphabetical:ascending',
          },
          {
            label: 'Sort Z-A',
            value: 'sort:alphabetical:descending',
          },
          {
            label: 'Hide Column',
            value: 'hide',
          },
          {
            label: 'Delete Column',
            value: 'delete',
            classes:
              'text-red-500 dark:text-red-400/90 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
          },
        ]
      } else {
        this.options = [
          { label: 'Pin Column', value: 'pin' },
          {
            label: 'Sort A-Z',
            value: 'sort:alphabetical:ascending',
          },
          {
            label: 'Sort Z-A',
            value: 'sort:alphabetical:descending',
          },
          {
            label: 'Hide Column',
            value: 'hide',
          },
          {
            label: 'Rename Column',
            value: 'rename',
          },
          {
            label: 'Delete Column',
            value: 'delete',
            classes:
              'text-red-500 dark:text-red-400/90 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
          },
        ]
      }
    }

    // set id=first-cell on the first row, first column
    if (changedProperties.has('isFirstColumn') || changedProperties.has('isFirstColumn')) {
      if (this.isFirstColumn) {
        this.setAttribute('first-cell', 'true')
      }
    }
  }

  public override render() {
    const name = this.originalValue ?? this.value ?? ''
    const hasPlugin = typeof this.installedPlugins?.[name] !== 'undefined' && !this.installedPlugins?.[name]?.isDefaultPlugin
    const options = this.dirty
      ? [
          ...this.options,
          {
            label: html`Revert to <span class="pointer-events-none italic whitespace-nowrap">${this.originalValue}</span>`,
            value: this.originalValue,
            id: 'reset',
          },
        ]
      : [...this.options]

    if (this._pluginOptions.length > 0) {
      options.splice(
        3,
        0,
        hasPlugin
          ? {
              label: html`<span class="">Remove Plugin</span> `,
              value: 'uninstall-column-plugin',
            }
          : {
              label: html`<div class="flex items-center justify-between">Plugins</div>`,
              value: 'plugins',
              subItems: this._pluginOptions,
              scrollSubItems: true,
            }
      )
    }

    const blankElementClasses = {
      // 'absolute top-0 bottom-0 right-0 left-0': true,
      dark: this.theme == 'dark',
    }
    const resultContainerClasses = {
      dark: this.theme == 'dark',
      'flex-auto': true,
    }

    if (this.blank) {
      // an element to preserve the right-border
      return html`<div class=${classMap(blankElementClasses)}><slot></slot></div> `
    } else {
      const body = this.isEditing
        ? html`<input .value=${this.value} @input=${this.onChange} @keydown=${MutableElement.onKeyDown} class="z-[1] absolute top-0 bottom-0 right-0 left-0 bg-blue-50 dark:bg-blue-950 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 px-cell-padding-x font-normal" @blur=${this.onBlur}></input>`
        : this.hasMenu
          ? html`<astra-th-menu theme=${this.theme} .items=${options} @menu-selection=${this.onMenuSelection}
              ><span class="font-normal truncate">${this.value}</span></astra-th-menu
            >`
          : html`<span class="font-normal truncate">${this.value}</span>`

      return this.withResizer
        ? html`<span class=${classMap(resultContainerClasses)}
            ><slot></slot>
            ${body}
            <column-resizer
              .column=${this}
              height="${ifDefined(this.tableHeight)}"
              theme=${this.theme}
              @resize-start=${() => {
                // remove the suffix `px` from width and convert to a number
                // JOHNNY probably revert to storing the number??
                this._previousWidth = this.width ? +this.width.slice(0, -2) : 0
              }}
              @resize=${({ delta }: ResizeEvent) => {
                this.width = `${this._previousWidth + delta}px`
              }}
            ></column-resizer
          ></span>`
        : html`<div class=${classMap(resultContainerClasses)}><slot></slot>${body}</div>`
    }
  }
}
