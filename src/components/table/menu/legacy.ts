import { html, type PropertyValueMap } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'

import { MenuCloseEvent, MenuOpenEvent, MenuSelectedEvent } from '../../../lib/events.js'
import { type HeaderMenuOptions } from '../../../types.js'
import { ClassifiedElement } from '../../classified-element.js'

import '../../hans-wormhole.js'
import './item.js'

export class Menu extends ClassifiedElement {
  protected override classMap() {
    return {
      ...super.classMap(),
      'font-medium select-none whitespace-nowrap': true,
    }
  }

  @property({ type: Boolean, attribute: 'open', reflect: true })
  public open = false

  @property({ attribute: 'selection', type: String })
  public selection?: string

  @property({ type: Array, attribute: 'options' })
  public options: HeaderMenuOptions = []

  @property({ type: Object })
  public anchorId: string | null = null

  @state() protected anchor: HTMLElement | null = null
  @state() protected activeOptions: HeaderMenuOptions = []
  @state() protected historyStack: Array<HeaderMenuOptions> = []
  @state() protected focused?: string

  private menuRef: Ref<HTMLElement> = createRef()

  // this function is intended to be overriden in a subclass
  // and not accessed otherwise
  protected get menuPositionClasses() {
    return ''
  }

  // for closing menus when an ousside click occurs
  private outsideClicker: ((event: MouseEvent) => void) | undefined
  private activeEvent: Event | undefined

  constructor() {
    super()
    this.onResize = this.onResize.bind(this)
  }

  // storing this as a variable instead of anonymous function
  // so that the listener can determine if it's the same closer or not
  // for the scenario when the same menu is repeatedly opened
  private close = () => (this.open = false)

  protected get listElement() {
    if (!this.open) return null

    return html`<ul
      tabindex="0"
      class="z-[2] overflow-hidden rounded-xl p-1.5 text-sm font-medium shadow-lg shadow-black/5 border border-neutral-200 dark:border-neutral-800 bg-theme-menu-background-color dark:bg-theme-menu-background-color-dark text-theme-menu-content-color dark:text-theme-menu-content-color-dark backdrop-blur-astra-menu"
      role="menu"
    >
      ${repeat(
        this.activeOptions,
        ({ label }) => label,
        ({ label, value, classes }) =>
          html`<li
            @click=${this.onItemClick}
            data-value=${value}
            role="menuitem"
          >
            <astra-menu-item class="${classes}" ?focused=${value === this.focused} selected=${this.selection === label}>${label}</astra-list-item>
          </li>`
      )}
    </ul>`
  }

  protected onTrigger(event: MouseEvent) {
    // prevent the click from surfacing and triggering column sorting
    event.stopPropagation()

    this.open = !this.open
    this.activeEvent = event
  }

  protected onItemClick(event: MouseEvent) {
    const el = event.target as HTMLElement

    // look for someone with a `data-value`
    // this was necessary when passing in a label that
    // is itself another html element such that the literal thing
    // being clicked does NOT have the value
    let parent = el
    while (parent && !parent.hasAttribute('data-value') && parent.parentElement) {
      parent = parent.parentElement
    }

    const value = parent.getAttribute('data-value')
    if (!value) throw new Error("onItemClick didn't recover a selection value")
    this.onSelection(event, value)
  }

  protected onSelection(event: Event, value: string) {
    const submenu = this.options.find((opt) => opt.value === value)
    if (submenu && submenu.subItems) {
      event.stopPropagation()
      event.preventDefault()
      this.historyStack.push(this.options)
      this.options = submenu.subItems
      return
    }

    if (typeof value === 'string') {
      const selectionEvent = new MenuSelectedEvent({ value: value })
      this.selection = value
      this.dispatchEvent(selectionEvent)
      this.open = false
    }
  }

  protected onKeyDown(event: KeyboardEvent & { didCloseMenu: boolean }) {
    const { code } = event

    if (code === 'Escape') {
      this.open = false
    } else if (code === 'Space' || code === 'Enter') {
      event.preventDefault()
      this.open = !this.open
      event.didCloseMenu = true

      if (!this.open && this.focused) this.onSelection(event, this.focused)
    } else if (code === 'ArrowDown' || code === 'ArrowRight') {
      event.preventDefault()
      if (!this.focused) this.focused = this.activeOptions[0]?.value
      else {
        const idx = this.activeOptions.findIndex(({ value }, _idx) => value === this.focused)
        if (idx > -1 && idx < this.activeOptions.length - 1) this.focused = this.activeOptions[idx + 1].value
        else if (idx === this.activeOptions.length - 1) this.focused = this.activeOptions[0].value
      }
    } else if (code === 'ArrowUp' || code === 'ArrowLeft') {
      event.preventDefault()
      if (!this.focused) this.focused = this.activeOptions[this.activeOptions.length - 1]?.value
      else {
        const idx = this.activeOptions.findIndex(({ value }, _idx) => value === this.focused)
        if (idx > 0) this.focused = this.activeOptions[idx - 1].value
        else if (idx === 0) this.focused = this.activeOptions[this.activeOptions.length - 1].value
      }
    } else if (code === 'Tab') {
      // prevent tabbing focus away from an open menu
      if (this.open) event.preventDefault()
    }
  }

  private onResize() {
    this.open = false
  }

  public override connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('resize', this.onResize)
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback()
    window.removeEventListener('resize', this.onResize)
  }

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)
    // when the menu is being opened
    if (changedProperties.has('open') && this.open) {
      this.setAttribute('aria-expanded', '')
      this.outsideClicker = ((event: MouseEvent) => {
        if (event !== this.activeEvent) {
          this.open = false
          delete this.activeEvent
          if (this.outsideClicker) document.removeEventListener('click', this.outsideClicker)
        }
      }).bind(this)
      document.addEventListener('click', this.outsideClicker)

      this.dispatchEvent(new MenuOpenEvent(this.close))
    }
    // when the menu is being closed
    else if (changedProperties.has('open') && changedProperties.get('open') !== undefined && !this.open) {
      this.removeAttribute('aria-expanded')

      // reset history; restore root menu ietms
      if (this.historyStack.length > 0) {
        this.options = this.historyStack[0]
        this.historyStack = []
      }

      if (this.outsideClicker) {
        delete this.activeEvent
        document.removeEventListener('click', this.outsideClicker)
      }

      this.dispatchEvent(new MenuCloseEvent())
    }

    if (changedProperties.has('options')) {
      // reset the menu to it's root
      this.activeOptions = this.options
    }
  }

  public override updated(changedProperties: PropertyValueMap<this>): void {
    super.updated(changedProperties)

    // when closing
    if (changedProperties.has('open') && !this.open) {
      this.focused = undefined
    }

    // when opening
    else if (this.open) {
      // wait until it renders
      setTimeout(() => {
        if (this.open) {
          // set focus so keyboard can navigate the menu
          const list = this.menuRef.value?.firstElementChild as HTMLElement
          list?.focus()
        }
      })
    }
  }

  public override render() {
    // @dblclick prevents parent's dblclick
    // @keydown navigates the menu
    if (typeof window === 'undefined') return html``

    const content = html`<span
      ${ref(this.menuRef)}
      aria-haspopup="menu"
      class=${classMap({ dark: this.theme === 'dark' })}
      @dblclick=${(e: MouseEvent) => e.stopPropagation()}
      @keydown=${this.onKeyDown}
    >
      ${this.listElement}
    </span>`

    if (this.anchorId) return html`<hans-wormhole .open=${this.open} .anchorId=${this.anchorId}>${content}</hans-wormhole>`
    return html`<hans-wormhole .open=${this.open}>${content}</hans-wormhole>`
  }
}
