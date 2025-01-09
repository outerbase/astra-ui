/** @type {import('tailwindcss').build} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  mode: 'jit',
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        sm: ['12px', '18px'],
        base: ['14px', '21px'],
        lg: ['16px', '24px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '40px'],
      },
      spacing: {
        'cell-padding-x': 'var(--astra-cell-padding-x, 12px)',
        'cell-padding-y': 'var(--astra-cell-padding-y, 8px)',
      },
      colors: {
        theme: {
          primary: 'var(--astra-primary-color, indigo)',
          secondary: 'var(--astra-secondary-color, white)',
          tertiary: 'var(--astra-tertiary-color, purple)',
          success: 'var(--astra-success-color, green)',
          warning: 'var(--astra-warning-color, yellow)',
          error: 'var(--astra-error-color, red)',

          // SECONDARY
          'secondary-content': 'var(--astra-secondary-content-color, rgb(42, 42, 42))',
          'secondary-content-dark': 'var(--astra-secondary-content-color, rgb(213, 213, 213))',

          // TABLE
          // background
          table: 'var(--astra-table-background-color, rgba(255,255,255, 1))',
          'table-dark': 'var(--astra-table-background-color-dark, rgba(0, 0, 0, 1))',
          'table-row': 'var(--astra-table-row-background-color, rgba(255,255,255, 1))',
          'table-row-dark': 'var(--astra-table-row-background-color-dark, rgba(0, 0, 0, 1))',

          // text
          'table-content': 'var(--astra-table-content-color, #000000)',
          'table-content-dark': 'var(--astra-table-content-color-dark, #ffffff)',

          // borders
          'table-border': 'var(--astra-table-border-color, #e5e7eb)',
          'table-border-dark': 'var(--astra-table-border-color-dark, rgb(52,52,56))',

          // column headers
          'table-column': 'var(--astra-table-column-header-background-color, rgba(255,255,255,1))',
          'table-column-dark': 'var(--astra-table-column-header-background-color-dark, rgba(0,0,0,1))',
          'table-column-content': 'var(--astra-table-column-header-content-color, #000000)',
          'table-column-content-dark': 'var(--astra-table-column-header-content-color-dark, #ffffff)',

          // rows
          'table-row-new': 'var(--astra-table-row-new-background-color, #DDF0DF)',
          'table-row-new-dark': 'var(--astra-table-row-new-background-color-dark, #14532D)',
          'table-row-hover': 'var(--astra-table-row-hover-background-color, rgba(0,0,0,0.03))',
          'table-row-hover-dark': 'var(--astra-table-row-hover-background-color-dark, rgb(30,30,30))',
          'table-row-selected': 'var(--astra-table-row-selected-background-color, rgba(245, 245, 245, 1))',
          'table-row-selected-dark': 'var(--astra-table-row-selected-background-color-dark, rgb(23, 23, 23))',
          'table-row-selected-hover': 'var(--astra-table-row-selected-hover-background-color, rgba(229, 229, 229, 1))',
          'table-row-selected-hover-dark': 'var(--astra-table-row-selected-hover-background-color-dark, rgb(38, 38, 38))',

          // editing cells
          'table-cell-mutating-background': 'var(--astra-cell-mutating-background-color, rgb(239 246 255))',
          'table-cell-mutating-background-dark': 'var(--astra-cell-mutating-background-color-dark, rgb(23 37 84))',
          'table-cell-mutating-content': 'var(--astra-cell-mutating-content-color, rgb(0,0,0))',
          'table-cell-mutating-content-dark': 'var(--astra-cell-mutating-content-color-dark, rgb(255,255,255))',

          // dirty cells
          'table-cell-dirty': 'var(--astra-cell-dirty-background-color, rgb(253 230 138))',
          'table-cell-dirty-dark': 'var(--astra-cell-dirty-background-color, rgba(234, 179, 8, .6))',

          // SIDEBAR
          'sidebar-li-active': 'var(--astra-sidebar-li-active-content-color, rgb(59 130 246))',
          'sidebar-li-active-dark': 'var(--astra-sidebar-li-active-content-color-dark, pink)',
          'sidebar-li-hover': 'var(--astra-hover-sidebar-li-background-color, rgba(0,0,0,0.03))',
          'sidebar-li-hover-dark': 'var(--astra-hover-sidebar-li-background-color-dark, rgba(255,255,255,0.03))',
          'sidebar-li-content': 'var(--astra-sidebar-li-content-color, #000000)',
          'sidebar-li-content-dark': 'var(--astra-sidebar-li-content-color-dark, #ffffff)',
          'sidebar-header-content': 'var(--astra-header-content-color, #000000)',
          'sidebar-header-content-dark': 'var(--astra-header-content-color-dark, #ffffff)',
          'sidebar-subheader-content': 'var(--astra-sidebar-subheader-content-color, #eeeee)',
          'sidebar-subheader-content-dark': 'var(--astra-sidebar-subheader-content-color-dark, #eeeeee)',

          // MENUS
          'menu-background-color': 'var(--astra-menu-background-color, #fff)',
          'menu-background-color-dark': 'var(--astra-menu-background-color-dark, #000)',
          'menu-content-color': 'var(--astra-menu-content-color, #000)',
          'menu-content-color-dark': 'var(--astra-menu-content-color-dark, #fff)',
          'menu-content-color-active': 'var(--astra-menu-content-color-active, #fff)',
          'menu-content-color-active-dark': 'var(--astra-menu-content-color-active-dark, #000)',
          'menu-background-color-active': 'var(--astra-menu-background-color-active, #000)',
          'menu-background-color-active-dark': 'var(--astra-menu-background-color-active-dark, #fff)',

          'menu-toggle-color-hover': 'var(--astra-toggle-color-hover, #fafafa)',
          'menu-toggle-color-hover-dark': 'var(--astra-toggle-color-hover-dark, #262626)',
          'menu-toggle-color-active': 'var(--astra-toggle-color-active, #f5f5f5)',
          'menu-toggle-color-active-dark': 'var(--astra-toggle-color-active-dark, #404040)',
        },

        light: {
          primary: {
            400: '#834FF8',
            500: '#A27BFA',
            600: '#C1A7FC',
            700: '#E0D3FD',
          },
          feedback: {
            success: '#32D583',
            warning: '#FDB022',
            error: '#F0384E',
          },
          gray: {
            100: '#FFFFFF',
            200: '#F9F9F9',
            300: '#EEEEEE',
            400: '#D0D0D0',
            500: '#959497',
            600: '#5E5D61',
            700: '#343438',
            800: '#05040D',
          },
        },
        dark: {
          primary: {
            400: '#834FF8',
            500: '#633CBD',
            600: '#442982',
            700: '#2F1D5B',
          },
          feedback: {
            success: '#32D583',
            warning: '#FDB022',
            error: '#F0384E',
          },

          gray: {
            100: '#05040D',
            200: '#121119',
            300: '#1E1F24',
            400: '#343438',
            500: '#5E5D61',
            600: '#959497',
            700: '#C0C0C0',
            800: '#FFFFFF',
          },
        },
        canonical: {
          purple: '#6B57E8',
          yellow: '#FBE67F',
          orange: '#F09252;',
          red: '#EB4E43',
          blue: '#70B6F9',
          pink: '#E4AEFA',
          green: '#79E2BE',
          ycombinator: '#FB651E',
        },
        neutral: {
          ...defaultTheme.colors.neutral,
          925: '#121212',
        },
      },
      keyframes: {
        swirl: {
          '0%': {
            boxShadow: '-1px -1px 1px rgba(255, 255, 255, 0.5)',
          },
          '25%': {
            boxShadow: '1px -1px 1px rgba(255, 255, 255, 0.5)',
          },
          '50%': {
            boxShadow: '1px 1px 1px rgba(255, 255, 255, 0.5)',
          },
          '75%': {
            boxShadow: '-1px 1px 1px rgba(255, 255, 255, 0.5)',
          },
          '100%': {
            boxShadow: '-1px -1px 1px rgba(255, 255, 255, 0.5)',
          },
        },
        shine: {
          '0%': {
            opacity: 0,
          },
          '25%': {
            opacity: 0.3,
          },
          '50%': {
            opacity: 0,
          },
          '100%': {
            opacity: 0,
          },
        },
      },
      boxShadow: {
        primary: '0px 2px 8px rgba(5, 4, 13, 0.15)',
        flat: '6px 6px 1px 0px #FFF;',
        checkbox: 'inset 1em 1em',
        ringlet: '0px 0px 0px 3px #d4d4d4;',
        'ringlet-dark': '0px 0px 0px 3px #525252;',
      },
      backdropBlur: {
        'astra-table': 'var(--astra-table-backdrop-blur, 4px)',
        'astra-menu': 'var(--astra-table-menu-backdrop-blur, 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', ...defaultTheme.fontFamily.sans],
        Helvetica: ['Helvetica', 'sans-serif'],
        table: ['var(--astra-font-family, Inter)', 'sans-serif'],
      },
    },
    // fontFamily: {
    //   ...defaultTheme.fontFamily,
    //   sans: ['Inter', 'Helvetica', ...defaultTheme.fontFamily.sans],
    //   Helvetica: ['Helvetica', 'sans-serif'],
    //   table: ['var(--astra-font-family, Inter)', 'sans-serif'],
    // },
  },
}
