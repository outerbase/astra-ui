import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

interface MenuItem {
  label: string
  action?: () => void
  subItems?: MenuItem[]
}

@customElement('nested-menu')
export class NestedMenu extends LitElement {
  @property({ type: Array }) items: MenuItem[] = []
  @property({ type: Object }) parentMenu: NestedMenu | null = null
  @state() private activeIndex: number | null = null
  @state() private isSubmenu = false
  @state() private isOpen = false
  @state() private submenuDimensions: Map<number, { width: number; height: number }> = new Map()

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }
    button {
      // padding: 8px 16px;
      cursor: pointer;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      background: rgba(255, 255, 255, 0.7);
      // border: 1px solid rgba(127, 127, 127, 0.1);
      position: absolute;
      // top: calc(100% - 1px); // this 1px fixes list item alignment / shifts the border up
      // left: 0;
      z-index: 1000;
      display: none;
      // border-radius: 2px;
      // backdrop-filter: blur(5px);
      // -webkit-backdrop-filter: blur(5px);
    }
    ul.open {
      display: block;
    }
    li {
      padding: 8px 16px;
      margin: 0;
      cursor: pointer;
      position: relative;
      // white-space: nowrap;
    }
    li:hover,
    li:focus {
      background: #f0f0f0;
    }
    .submenu {
      position: absolute;
      display: none;
      top: 0;
      left: 100%;
    }
    .submenu.left {
      left: unset;
      right: 100%;
    }
    li:hover > .submenu,
    li:focus-within > .submenu {
      display: block;
    }
    .measure-submenu {
      position: absolute;
      visibility: hidden;
      pointer-events: none;
    }
  `

  connectedCallback() {
    super.connectedCallback()
    this.isSubmenu = Boolean(this.parentMenu)
    if (!this.isSubmenu) {
      document.addEventListener('click', this._handleOutsideClick)
    }
    this.measureSubmenus()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (!this.isSubmenu) {
      document.removeEventListener('click', this._handleOutsideClick)
    }
  }

  async firstUpdated() {
    await this.measureSubmenus()
  }

  async measureSubmenus() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].subItems) {
        const submenu = document.createElement('nested-menu') as NestedMenu
        submenu.items = this.items[i].subItems!
        submenu.classList.add('measure-submenu')
        this.shadowRoot!.appendChild(submenu)

        await submenu.updateComplete
        const rect = submenu.getBoundingClientRect()
        this.submenuDimensions.set(i, { width: rect.width, height: rect.height })

        this.shadowRoot!.removeChild(submenu)
      }
    }
    this.requestUpdate()
  }

  render() {
    return html`
      ${this.isSubmenu ? '' : html`<button @click="${this._toggleMenu}">Menu</button>`}
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
                    <nested-menu
                      class="submenu"
                      .items="${item.subItems}"
                      .parentMenu="${this}"
                      style="${this._getSubmenuStyle(index)}"
                    ></nested-menu>
                  `
                : ''}
            </li>
          `
        )}
      </ul>
    `
  }

  private _getSubmenuStyle(index: number): string {
    const dimensions = this.submenuDimensions.get(index)
    return dimensions ? `width: ${dimensions.width}px; height: ${dimensions.height}px;` : ''
  }

  _toggleMenu = (e: Event) => {
    e.stopPropagation()
    this.isOpen = !this.isOpen
    if (this.isOpen) {
      this.updateComplete.then(() => this._focusItem(0)) // Set focus to the first item after the menu opens
    }
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
        const submenu = activeItem.querySelector('nested-menu') as NestedMenu
        if (submenu) {
          submenu.isOpen = true
          submenu.requestUpdate()
          submenu.updateComplete.then(() => submenu._focusItem(0)) // Focus the first item in the submenu
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
      const submenus = menu.shadowRoot!.querySelectorAll('nested-menu') as NodeListOf<NestedMenu>
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

  focus() {
    this._focusItem(0)
  }
}
