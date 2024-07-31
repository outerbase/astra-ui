# Sequence Diagram (Universe)

```mermaid
sequenceDiagram
    participant User
    participant EditorComponent
    participant Renderer

    EditorComponent->>EditorComponent: Initialize Editor
    EditorComponent->>EditorComponent: Compute Initial Line Heights
    EditorComponent->>EditorComponent: Update Line Cache
    EditorComponent->>Renderer: Initial Render
    Renderer->>Renderer: Render Editor UI

    User->>EditorComponent: Input Text
    EditorComponent->>EditorComponent: Handle Input Event
    EditorComponent->>EditorComponent: Update Text Property
    EditorComponent->>EditorComponent: Update Line Heights
    EditorComponent->>EditorComponent: Update Line Cache
    EditorComponent->>Renderer: Update Displayed Lines
    Renderer->>Renderer: Highlight Code with Prism
    Renderer->>Renderer: Generate Line Numbers
    Renderer->>EditorComponent: Render Updated UI

    User->>EditorComponent: Resize Window
    EditorComponent->>EditorComponent: Update Line Heights
    EditorComponent->>EditorComponent: Update Line Cache
    EditorComponent->>Renderer: Update Line Numbers
    Renderer->>EditorComponent: Render Updated UI

    User->>EditorComponent: Scroll Textarea
    EditorComponent->>EditorComponent: Sync Scroll Positions
    EditorComponent->>Renderer: Sync Scroll of Code Display and Line Numbers
    Renderer->>EditorComponent: Adjust Scroll Position

    User->>EditorComponent: Scroll Code Display
    EditorComponent->>EditorComponent: Sync Scroll Positions
    EditorComponent->>Renderer: Sync Scroll of Textarea and Line Numbers
    Renderer->>EditorComponent: Adjust Scroll Position

    User->>EditorComponent: Scroll Line Numbers
    EditorComponent->>EditorComponent: Sync Scroll Positions
    EditorComponent->>Renderer: Sync Scroll of Textarea and Code Display
    Renderer->>EditorComponent: Adjust Scroll Position

User->>EditorComponent: Close the editor
    EditorComponent->>EditorComponent: Cleanup
    EditorComponent->>EditorComponent: Remove Event Listeners
```

# Architecture Diagram (Universe + Plugins)

```mermaid
graph TD
    A[TextEditor] -->|Includes| B[Textarea]
    A -->|Includes| C[Line Numbers]
    A -->|Includes| D[Displayed Code]
    A --> E[KeyboardShortcutsPlugin]
    A --> F[UndoPlugin]

    F -->|Listens for| N["KeyDown Event"]
    N -->|Meta+Z| BB[Undo Last Change]
    BB --> |Pop Until 𝚫 > 500ms| BB
    N -->|Meta+Shift+Z| DD[Redo Last Change]
    N -->|Meta+Y| DD

    F -->|Listens for| M["Input Event"]
    M -->|Calls| P[Push New Record into Undo Stack]

    B -->|On Input| Q[Recalculate Line Numbers]
    C -->|On Scroll| R[Sync Scroll Position]
    D -->|On Scroll| R
    D -->|On Mouse Up| S[Update Active Line Highlight]
    D -->|On Key Down| S
    D -->|On Blur| T[Remove Line Highlight]
    D -->|On Text Select| U[Update Selection State]
    U -->|No Selection| S
    U -->|Has Selection| V[Remove Line Highlight]

    E -->|"Meta+/"| W[Toggle Line Comments]
    E -->|Tab| X[Insert 4 Spaces]
    E -->|"Meta+["| Y[Outdent Line Left]
    E -->|"Shift+Tab"| Y[Outdent Line Left]
    E -->|"Meta+]"| Z[Indent Line Right]
    E -->|"Meta+Enter"| AA[Dispatch `universe:submit` Event]
    E -->|"Meta+X"| MM[Cut Line]

    W -->|Updates Content| M
    X -->|Updates Content| M
    Y -->|Updates Content| M
    Z -->|Updates Content| M
    MM -->|Removes Line| M
    MM -->|Copies Content| NN["To Clipboard"]

    B -->|Formatting| HH{Has Word Wrap?}
    HH -->|Yes| II[Lines Wrap Without Horizontal Scrolling] --> III[Line Numbers Are Padded For Alignment]
    HH -->|No| JJ[Long Lines Cause Horizontal Scrolling] --> JJJ[Line Numbers Are Strictly Monotonically Increasing]

    BB -->|Dispatch| FF[universe:undo Event]
    BB -->|Update Editor Content| A
    DD -->|Dispatch| GG[universe:redo Event]
    DD -->|Update Editor Content| A

    A -->|Content Change| KK[PrismJS Highlighting]
    KK -->|Generate Styled Lines| LL[Render Styled Lines]
```

## Explanation

The `Universe` component is a custom web component using the Lit library for building and rendering a text editor with syntax highlighting.

### Key Features and Behavior

1. **Initialization and Styling**

   - It includes specific styles to hide scrollbars and apply syntax highlighting (via PrismJS)

2. **Properties and State**

   - `wrap`: A Boolean property to enable or disable word wrapping in the editor.
   - `text`: A property containing the SQL code displayed in the editor.
   - `activeLineNumber`: Indicates which line has focus for displaying visual emphasis.
   - `hasSelectedText`: When true, disables active line highlighting.
   - `highlightedCode`, `cache`, `lines`: Internal states used to manage syntax highlighting, line heights, and ultimately what is visible to the user.

3. **Lifecycle Methods**

   - `connectedCallback()`: Sets up event listeners for dealing with resizing.
   - `disconnectedCallback()`: Cleans up event listeners when the component is removed from the DOM.
   - `firstUpdated()`: Updates the line cache after the initial render to ensure proper line number formatting.

4. **Rendering**

   - The `render()` method defines the structure of the editor, including the line numbers, code display area, and textarea.
   - The `<textarea />`, `<div id="displayed-code" />` and `<div id="line-numbers" />` are synchronized to scroll in-sync.
   - Omits active line when there is a text selection.

5. **Handling Input and Updates**

   - `onInput()`: Updates the `text` property and refreshes the line cache whenever the user types into the textarea.
   - `updateLineCache()`: Processes the input text, applies syntax highlighting with Prism.js, and updates the line heights.
   - `handleResize()`: Updates the line cache / ensures proper formatting

6. **Line Number Calculation**

   - `getLineNumbers()`: Computes and returns the line numbers, taking into account wrapped content and line heights.
   - `handleSelectionChange()`: Toggles `hasSelectedText`'s value
   - `handleScrollEnd()`: Syncs the `<textarea />` with `<div id="displayed-code" />` _after scrolling_ has completed; preserves smooth momentum scrolling

7. **Helper Methods**
   - `computeLineHeight()`: Determines the height of a single line of text by creating a temporary element.
   - `highlightedCode`: Uses Prism.js to apply syntax highlighting to the SQL code.
