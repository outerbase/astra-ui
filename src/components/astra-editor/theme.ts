import { HighlightStyle, type TagStyle, syntaxHighlighting } from '@codemirror/language'
import { type Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import { tags as t } from '@lezer/highlight'

interface ThemeSetting {
  theme: 'dark' | 'light'
  foreground?: string
  gutterBackground?: string
  gutterForeground?: string
  gutterActiveForeground?: string
  gutterBorder?: string
  lineHighlight?: string
  selection?: string
  selectionMatch?: string
}

function createCodeMirrorTheme(styles: TagStyle[], settings: ThemeSetting): Extension {
  const highlightStyle = HighlightStyle.define(styles)

  const themeStyles: Record<string, Record<string, string>> = {
    '&': {},
    '.cm-gutters': {
      paddingRight: '10px',
      paddingLeft: '5px',
    },
    '.cm-activeLineGutter': {},
    '.cm-activeLine': {},
    '.cm-focused': { outline: 'none' },
  }

  if (settings.foreground) {
    themeStyles['&'].color = settings.foreground
  }

  if (settings.lineHighlight) {
    themeStyles['.cm-activeLine'].background = settings.lineHighlight
  }

  if (settings.selection) {
    themeStyles[
      '&.cm-focused .cm-selectionBackground, & .cm-line::selection, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection'
    ] = {
      background: settings.selection + ' !important',
    }
  }
  if (settings.selectionMatch) {
    themeStyles['& .cm-selectionMatch'] = {
      backgroundColor: settings.selectionMatch,
    }
  }

  if (settings.gutterBackground) {
    themeStyles['.cm-gutters'].backgroundColor = settings.gutterBackground
  }

  if (settings.gutterForeground) {
    themeStyles['.cm-gutters'].color = settings.gutterForeground
  }

  if (settings.gutterBorder) {
    themeStyles['.cm-gutters'].borderRightColor = settings.gutterBorder
  }

  if (settings.gutterActiveForeground) {
    themeStyles['.cm-activeLineGutter'].color = settings.gutterActiveForeground
  }

  const themeExtension = EditorView.theme(themeStyles, {
    dark: settings.theme === 'dark',
  })

  return [themeExtension, syntaxHighlighting(highlightStyle)]
}

function createMoondustTheme(theme: 'dark' | 'light'): Extension {
  if (theme === 'light') {
    return createCodeMirrorTheme(
      [
        { tag: [t.keyword, t.typeName, t.standard(t.name)], color: '#737373' },
        { tag: [t.string], color: '#737373' },
        {
          tag: [t.number],
          color: 'indigo',
        },
        { tag: [t.operator, t.operatorKeyword], color: 'indigo' },
        { tag: [t.lineComment, t.blockComment, t.comment], color: '#737373' },
        { tag: [t.null, t.bool], color: '#111111' },
      ],
      {
        theme,
        foreground: '#111111',
        selection: '#ccc',
        lineHighlight: '#eee',
        gutterForeground: '#737373',
        gutterBackground: '#FAFAFA',
        gutterActiveForeground: '#000',
        gutterBorder: 'transparent',
      }
    )
  } else {
    return createCodeMirrorTheme(
      [
        { tag: [t.keyword, t.typeName, t.standard(t.name)], color: 'white' },
        { tag: [t.string], color: '#9ca3af' },
        {
          tag: [t.number],
          color: '#8be9fd',
        },
        { tag: [t.operator, t.operatorKeyword], color: 'white' },
        { tag: [t.lineComment, t.blockComment, t.comment], color: '#737373' },
        { tag: [t.null, t.bool], color: 'white' },
      ],
      {
        theme,
        foreground: '#9ca3af',
        selection: '#333',
        lineHighlight: '#151515',
        gutterForeground: '#737373',
        gutterBackground: '#0A0A0A',
        gutterActiveForeground: '#fff',
        gutterBorder: 'transparent',
      }
    )
  }
}

function createInvasionTheme(theme: 'dark' | 'light'): Extension {
  if (theme === 'light') {
    return createCodeMirrorTheme(
      [
        { tag: [t.keyword, t.typeName, t.standard(t.name)], color: '#7f00ff' },
        { tag: [t.string], color: '#228b22' },
        {
          tag: [t.number],
          color: '#0000ff',
        },
        { tag: [t.operator, t.operatorKeyword], color: '#24292e' },
        { tag: [t.lineComment, t.blockComment, t.comment], color: '#a3a3a3' },
        { tag: [t.null, t.bool], color: '#7f00ff' },
      ],
      {
        theme,
        foreground: '#000000',
        selection: '#ccc',
        lineHighlight: '#eee',
        gutterForeground: '#737373',
        gutterBackground: '#FAFAFA',
        gutterActiveForeground: '#000',
        gutterBorder: 'transparent',
      }
    )
  } else {
    return createCodeMirrorTheme(
      [
        { tag: [t.keyword, t.typeName, t.standard(t.name)], color: '#bd93f9' },
        { tag: [t.string], color: '#50fa7b' },
        {
          tag: [t.number],
          color: '#8be9fd',
        },
        { tag: [t.operator, t.operatorKeyword], color: '#f6f8fa' },
        { tag: [t.lineComment, t.blockComment, t.comment], color: '#525252' },
        { tag: [t.null, t.bool], color: '#bd93f9' },
      ],
      {
        theme,
        foreground: '#f8f8f2',
        selection: '#333',
        lineHighlight: '#151515',
        gutterForeground: '#737373',
        gutterBackground: '#0A0A0A',
        gutterActiveForeground: '#fff',
        gutterBorder: 'transparent',
      }
    )
  }
}

function createFreedomTheme(theme: 'dark' | 'light'): Extension {
  if (theme === 'light') {
    return createCodeMirrorTheme(
      [
        { tag: [t.keyword, t.typeName, t.standard(t.name)], color: '#1d4ed8' },
        { tag: [t.string], color: 'black' },
        {
          tag: [t.number],
          color: '#0000ff',
        },
        { tag: [t.operator, t.operatorKeyword], color: '#e11d48' },
        { tag: [t.lineComment, t.blockComment, t.comment], color: '#a3a3a3' },
        { tag: [t.null, t.bool], color: 'normal' },
      ],
      {
        theme,
        foreground: '#000000',
        selection: '#ccc',
        lineHighlight: '#eee',
        gutterForeground: '#737373',
        gutterBackground: '#FAFAFA',
        gutterActiveForeground: '#000',
        gutterBorder: 'transparent',
      }
    )
  } else {
    return createCodeMirrorTheme(
      [
        { tag: [t.keyword, t.typeName, t.standard(t.name)], color: '#60a5fa' },
        { tag: [t.string], color: 'normal' },
        {
          tag: [t.number],
          color: '#60a5fa',
        },
        { tag: [t.operator, t.operatorKeyword], color: '#fb7185' },
        { tag: [t.lineComment, t.blockComment, t.comment], color: '#737373' },
        { tag: [t.null, t.bool], color: 'normal' },
      ],
      {
        theme,
        foreground: 'white',
        selection: '#333',
        lineHighlight: '#151515',
        gutterForeground: '#737373',
        gutterBackground: '#0A0A0A',
        gutterActiveForeground: '#fff',
        gutterBorder: 'transparent',
      }
    )
  }
}

export function getPredefineTheme(color: 'dark' | 'light', themeName: string) {
  if (themeName === 'invasion') return createInvasionTheme(color)
  if (themeName === 'freedom') return createFreedomTheme(color)
  return createMoondustTheme(color)
}
