import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

import { classMap } from 'lit/directives/class-map.js'
import { MenuSelectedEvent } from '../../../types.js'
import { ClassifiedElement } from '../../classified-element.js'
import '../../hans-wormhole.js'
import '../../scroll2.js'

export interface MenuItem {
  label?: string
  value: string
  subItems?: MenuItem[]
  scrollSubItems?: Boolean
}

@customElement('astra-menu')
export class Menu extends ClassifiedElement {
  @property({ type: Array }) items: MenuItem[] = []
  @property({ attribute: 'open', type: Boolean }) isOpen = false

  protected nestedMenu = createRef<NestedMenu>()

  static styles = [
    ...ClassifiedElement.styles,
    css`
      :host {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `,
  ]

  constructor() {
    super()
    this.onResize = this.onResize.bind(this)
    this.onOutsideClick = this.onOutsideClick.bind(this)
    this.onMenuSelection = this.onMenuSelection.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    // set accessibility attributes
    if (changedProperties.has('isOpen') && changedProperties.get('isOpen') !== undefined) {
      if (this.isOpen) this.setAttribute('aria-expanded', '')
      else this.removeAttribute('aria-expanded')
    }

    // close on outside click
    if (changedProperties.has('isOpen') && changedProperties.get('isOpen') !== undefined) {
      if (this.isOpen) {
        window.addEventListener('click', this.onOutsideClick)
        window.addEventListener('mousedown', this.onMouseDown)
      } else {
        window.removeEventListener('click', this.onOutsideClick)
        window.removeEventListener('mousedown', this.onMouseDown)
      }
    }

    // close on window resize
    if (changedProperties.has('isOpen') && changedProperties.get('isOpen') !== undefined) {
      if (this.isOpen) window.addEventListener('resize', this.onResize)
      else window.removeEventListener('resize', this.onResize)
    }

    // close on Escape key
    if (changedProperties.has('isOpen') && changedProperties.get('isOpen') !== undefined) {
      if (this.isOpen) window.addEventListener('keydown', this.onKeyDown)
      else window.removeEventListener('keydown', this.onKeyDown)
    }
  }

  render() {
    return html`
      <span @click="${this.toggleMenu}"><slot></slot></span>
      <div id="asdf">
        <hans-wormhole .open=${this.isOpen} anchorId="asdf">
          <astra-nested-menu
            ?open=${this.isOpen}
            .items="${this.items}"
            .depth="${1}"
            .theme="${this.theme}"
            @menu-selection="${this.onMenuSelection}"
            @closed="${() => {
              this.isOpen = false
              this.dispatchEvent(new Event('closed'))
            }}"
            ${ref(this.nestedMenu)}
          />
        </hans-wormhole>
      </div>
    `
  }

  public toggleMenu(_event?: Event) {
    this.isOpen = !this.isOpen
  }

  protected onResize() {
    if (this.isOpen) this.isOpen = false
  }

  protected onOutsideClick = (event: MouseEvent) => {
    if (this.isOpen && !this.contains(event.target as Node)) {
      this.isOpen = false
    }
  }

  protected onMouseDown = (event: MouseEvent) => {
    // closes the menu on any outside click, including double click and contextmenu
    const path = event.composedPath()
    const isWithinComponent = path.some((element) => {
      return element instanceof Node && (this.contains(element) || element === this)
    })
    if (!isWithinComponent) this.isOpen = false
  }

  protected onMenuSelection(_event: MenuSelectedEvent) {
    this.isOpen = false
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.isOpen = false
  }
}

// ---------------

@customElement('astra-nested-menu')
export class NestedMenu extends ClassifiedElement {
  @property({ type: Array }) items: MenuItem[] = []
  @property({ type: Object }) parentMenu: NestedMenu | null = null
  @property({ type: Number }) depth = 0
  @property({ type: Boolean, attribute: 'open' }) isOpen = false
  @property({ type: Boolean, attribute: 'scroll' }) scrollSubItems = false

  @state() private activeIndex: number | null = null

  get isSubmenu() {
    return Boolean(this.parentMenu)
  }

  static styles = [
    ...ClassifiedElement.styles,
    css`
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        border: 1px solid rgba(127, 127, 127, 0.1);
        border-radius: 4px;
      }
      li {
        padding: 8px 16px;
        margin: 0;
        cursor: pointer;
        position: relative;
        white-space: nowrap;

        font-weight: 500;
        font-size: 12px;
      }
      li:first-child {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
      }
      li:last-child {
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .submenu {
        display: none;
        position: absolute;
        top: -1px;
      }
      .submenu.right {
        left: 100%;
      }
      .submenu.left {
        right: 100%;
      }
      li:hover > .submenu,
      li:focus-within > .submenu {
        display: block;
      }
    `,
  ]

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)
    // accessibility
    if (changedProperties.has('isOpen')) {
      if (this.isOpen) this.setAttribute('aria-expanded', '')
      else this.removeAttribute('aria-expanded')
    }

    // isOpen changed, and is not the initial rendering (i.e. undefined)
    if (changedProperties.has('isOpen') && changedProperties.get('isOpen') !== undefined && this.isOpen === false) {
      this.dispatchEvent(new Event('closed'))
    }
  }

  public override render() {
    const list = html`<ul @keydown="${this._handleKeyDown}" role="menu" class=" bg-white text-black dark:bg-black dark:text-white">
      ${this.items.map((item, index) => {
        return html`
          <li
            tabindex="${index === 0 ? '0' : '-1'}"
            role="menuitem"
            aria-haspopup="${item.subItems ? 'true' : 'false'}"
            aria-expanded="${item.subItems && this.activeIndex === index ? 'true' : 'false'}"
            class="hover:bg-neutral-200 focus:bg-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            @click="${(e: MouseEvent) => this._onClickMenuItem(e, item)}"
          >
            ${item.label}
            ${item.subItems
              ? html`
                  <div class="submenu ${this._getSubmenuSide(index)}" style="z-index: ${this.depth};">
                    <astra-nested-menu
                      .items="${item.subItems}"
                      .parentMenu="${this}"
                      .depth="${this.depth + 1}"
                      .theme="${this.theme}"
                      ?scroll="${item.scrollSubItems}"
                      @closed="${() => {
                        this.isOpen = false
                      }}"
                    ></astra-nested-menu>
                  </div>
                `
              : ''}
          </li>
        `
      })}
    </ul>`

    return html`
      <div class="${classMap({ dark: this.theme === 'dark' })}">
        ${this.scrollSubItems ? html`<custom-scrollbar><div style="max-height: 180px;">${list}</div></custom-scrollbar>` : list}
      </div>
    `
  }

  public override focus() {
    this._focusItem(0)
  }

  _getSubmenuSide(index: number): string {
    if (!this.shadowRoot) return 'right'

    const listItem = this.shadowRoot.querySelectorAll('li')[index]
    if (!listItem) return 'right'

    const rect = listItem.getBoundingClientRect()
    const rightSpace = window.innerWidth - rect.right

    // Assuming 200px as a minimum width for the submenu
    const minSubmenuWidth = 200

    return rightSpace >= minSubmenuWidth ? 'right' : 'left'
  }

  _onClickMenuItem(e: MouseEvent, item: MenuItem) {
    e.stopPropagation()
    if (!item.subItems) {
      this._onSelection(item)
    }
  }

  _onSelection(item: MenuItem) {
    const selectionEvent = new MenuSelectedEvent(item)
    this.dispatchEvent(selectionEvent)
  }

  _handleKeyDown(e: KeyboardEvent) {
    e.stopPropagation()

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        this._focusNextItem(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        this._focusNextItem(-1)
        break
      case 'ArrowRight':
        e.preventDefault()
        this._handleArrowRight()
        break
      case 'ArrowLeft':
        e.preventDefault()
        this._handleArrowLeft()
        break

      case 'Enter':
      case ' ':
        e.preventDefault()
        this._selectActiveItem()
        break
    }
  }

  _handleArrowRight() {
    if (this.activeIndex !== null) {
      const items = this.shadowRoot?.querySelectorAll('li')
      if (items) {
        const activeItem = items[this.activeIndex] as HTMLElement
        const submenu = activeItem.querySelector('astra-nested-menu') as NestedMenu
        if (submenu) {
          submenu.isOpen = true
          submenu.requestUpdate()
          submenu.updateComplete.then(() => submenu._focusItem(0))
        }
      }
    }
  }

  _handleArrowLeft() {
    if (this.isSubmenu && this.parentMenu) {
      this._closeCurrentSubmenu()
    }
  }

  _focusNextItem(direction: 1 | -1) {
    const itemCount = this.items.length
    let newIndex = this.activeIndex !== null ? this.activeIndex + direction : 0
    if (newIndex < 0) newIndex = itemCount - 1
    if (newIndex >= itemCount) newIndex = 0
    this._focusItem(newIndex)
  }

  _focusItem(index: number) {
    this.activeIndex = index
    const items = this.shadowRoot?.querySelectorAll('li')
    if (items) {
      const targetItem = items[index] as HTMLElement
      targetItem.focus()
    }
  }

  _closeCurrentSubmenu() {
    if (this.isSubmenu && this.parentMenu) {
      this.activeIndex = null
      this.isOpen = false
      this.requestUpdate()
      const parentIndex = this.parentMenu.items.findIndex((item) => item.subItems === this.items)
      if (parentIndex !== -1) {
        this.parentMenu._focusItem(parentIndex)
      }
    }
  }

  _selectActiveItem() {
    if (this.activeIndex !== null) {
      const item = this.items[this.activeIndex]
      if (item.subItems) {
        this._handleArrowRight()
      }
      this._onSelection(item)
    }
  }
}
