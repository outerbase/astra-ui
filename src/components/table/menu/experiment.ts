import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

export interface MenuItem {
  label: string
  action?: () => void
  subItems?: MenuItem[]
}

@customElement('astra-menu')
export class Menu extends LitElement {
  @property({ type: Array }) items: MenuItem[] = []
  @state() private isOpen = false

  protected nestedMenu = createRef<NestedMenu>()

  static styles = css`
    :host {
      position: relative;
      display: inline-block;
      margin-top: -2px;
    }
    button {
      cursor: pointer;
      border-radius: 2px;
      border: none;
      background-color: rgba(255, 255, 255, 0.2);
    }
    .menu-wrapper {
      position: absolute;
      top: 100%;
      left: 0;
      margin: 0;
      padding: 0;
    }
  `

  render() {
    return html`
      <button @click="${this.toggleMenu}">Toggle Menu</button>

      <div class="menu-wrapper" ?open="${this.isOpen}">
        <astra-nested-menu .items="${this.items}" .depth="${3}" ${ref(this.nestedMenu)}></astra-nested-menu>
      </div>
    `
  }

  private toggleMenu(e: Event) {
    e.stopPropagation()
    this.isOpen = true
    this.nestedMenu.value?._toggleMenu(e)
  }
}

@customElement('astra-nested-menu')
export class NestedMenu extends LitElement {
  @property({ type: Array }) items: MenuItem[] = []
  @property({ type: Object }) parentMenu: NestedMenu | null = null
  @property({ type: Number }) depth = 0
  @property() private isOpen = false
  @state() private activeIndex: number | null = null
  @state() private isSubmenu = false

  static styles = css`
    :host {
      display: block;
      z-index: 0;
    }
    ul {
      display: none;
      list-style: none;
      padding: 0;
      margin: 0;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(127, 127, 127, 0.1);
      border-radius: 2px;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
    ul.open {
      display: block;
    }
    li {
      padding: 8px 16px;
      margin: 0;
      cursor: pointer;
      position: relative;
      white-space: nowrap;
    }
    li:hover,
    li:focus {
      background: #f0f0f0;
    }
    .submenu {
      display: none;
      position: absolute;
      top: 0;
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
  `

  connectedCallback() {
    super.connectedCallback()
    this.isSubmenu = Boolean(this.parentMenu)
    if (!this.isSubmenu) {
      document.addEventListener('click', this._handleOutsideClick)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (!this.isSubmenu) {
      document.removeEventListener('click', this._handleOutsideClick)
    }
  }

  render() {
    return html`
      <ul class="${this.isOpen || this.isSubmenu ? 'open' : ''}" @keydown="${this._handleKeyDown}" role="menu">
        ${this.items.map(
          (item, index) => html`
            <li
              @mouseenter="${() => this._handleMouseEnter(index)}"
              @mouseleave="${this._handleMouseLeave}"
              @click="${(e: MouseEvent) => this._handleClick(e, item)}"
              @focus="${() => this._setActiveIndex(index)}"
              tabindex="${index === 0 ? '0' : '-1'}"
              role="menuitem"
              aria-haspopup="${item.subItems ? 'true' : 'false'}"
              aria-expanded="${this.activeIndex === index ? 'true' : 'false'}"
            >
              ${item.label}
              ${item.subItems
                ? html`
                    <div class="submenu ${this._getSubmenuSide(index)}" style="z-index: ${this.depth};">
                      <astra-nested-menu .items="${item.subItems}" .parentMenu="${this}" .depth="${this.depth + 1}"></astra-nested-menu>
                    </div>
                  `
                : ''}
            </li>
          `
        )}
      </ul>
    `
  }

  private _getSubmenuSide(index: number): string {
    if (!this.shadowRoot) return 'right'

    const listItem = this.shadowRoot.querySelectorAll('li')[index]
    if (!listItem) return 'right'

    const rect = listItem.getBoundingClientRect()
    const rightSpace = window.innerWidth - rect.right

    // Assuming 200px as a minimum width for the submenu
    const minSubmenuWidth = 200

    return rightSpace >= minSubmenuWidth ? 'right' : 'left'
  }

  public _toggleMenu = (e?: Event) => {
    e?.stopPropagation()
    this.isOpen = !this.isOpen
    if (this.isOpen) {
      this.updateComplete.then(() => this._focusItem(0))
    }
  }

  focus() {
    this._focusItem(0)
  }

  _handleOutsideClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node)) {
      this._closeAllMenusNonRecursive()
    }
  }

  _handleMouseEnter(index: number) {
    this._setActiveIndex(index)
  }

  _handleMouseLeave = () => {
    if (this.isSubmenu) {
      this.activeIndex = null
    }
  }

  _setActiveIndex(index: number) {
    this.activeIndex = index
  }

  _handleClick(e: MouseEvent, item: MenuItem) {
    e.stopPropagation()
    if (!item.subItems && item.action) {
      item.action()
      this._closeAllMenusNonRecursive()
    }
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
      case 'Escape':
        e.preventDefault()
        this._handleEscape()
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        this._activateItem()
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

  _handleEscape() {
    if (this.isSubmenu) {
      this._closeCurrentSubmenu()
    } else {
      this._closeAllMenusNonRecursive()
    }
  }

  _closeAllMenusNonRecursive() {
    let rootMenu: NestedMenu = this
    while (rootMenu.parentMenu) {
      rootMenu = rootMenu.parentMenu
    }

    const closeMenu = (menu: NestedMenu) => {
      menu.activeIndex = null
      menu.isOpen = false
      menu.requestUpdate()
      const submenus = menu.shadowRoot!.querySelectorAll('astra-nested-menu') as NodeListOf<NestedMenu>
      submenus.forEach((submenu) => {
        submenu.activeIndex = null
        submenu.isOpen = false
        submenu.requestUpdate()
        closeMenu(submenu)
      })
    }

    closeMenu(rootMenu)
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

  _activateItem() {
    if (this.activeIndex !== null) {
      const item = this.items[this.activeIndex]
      if (item.subItems) {
        this._handleArrowRight()
      } else if (item.action) {
        item.action()
        this._closeAllMenusNonRecursive()
      }
    }
  }
}
