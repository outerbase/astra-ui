import { css } from 'lit'

export default css`
  :host {
    --font-family-mono: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    --font-size: 13px;
    --line-height: 18px;
    --padding-horizontal: 0 10px;

    --color-neutral-50: #fafafa;
    --color-neutral-100: #f5f5f5;
    --color-neutral-200: #e5e5e5;
    --color-neutral-300: #d4d4d4;
    --color-neutral-400: #a3a3a3;
    --color-neutral-500: #737373;
    --color-neutral-600: #525252;
    --color-neutral-700: #404040;
    --color-neutral-800: #262626;
    --color-neutral-900: #171717;
    --color-neutral-950: #0a0a0a;
    --color-primary-dark: white;
    --color-primary-light: black;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #container {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  #layout-container {
    position: relative;
    height: 100%;
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: row;
  }

  #left {
    position: relative;
    display: flex;
  }

  #center {
    display: flex;
    flex: 1;
    position: relative;
  }

  #right {
    position: relative;
    display: flex;
  }
`
