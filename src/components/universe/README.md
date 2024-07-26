# Universe Sequence

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

## Explanation

The `Universe` component is a custom web component using the Lit library for building and rendering a text editor with syntax highlighting.

### Key Features and Behavior

1. **Initialization and Styling**

   - The component initializes with default styles and handles its layout and appearance using CSS.
   - It includes specific styles to hide scrollbars and apply syntax highlighting.

2. **Properties and State**

   - `wordWrap`: A Boolean property to enable or disable word wrapping in the editor.
   - `text`: A property containing the SQL code displayed in the editor.
   - `highlightedCode`, `cache`, `lines`: Internal states used to manage syntax highlighting, line heights, and rendered lines.

3. **Lifecycle Methods**

   - `connectedCallback()`: Sets up event listeners for resizing the window and updating line cache.
   - `disconnectedCallback()`: Cleans up event listeners when the component is removed from the DOM.
   - `firstUpdated()`: Updates the line cache after the initial render to ensure proper line number handling.

4. **Rendering**

   - The `render()` method defines the structure of the editor, including the line numbers, code display area, and textarea.
   - The `textarea` and code display are synchronized to scroll together.

5. **Handling Input and Updates**

   - `onInput()`: Updates the `text` property and refreshes the line cache whenever the user types into the textarea.
   - `updateLineCache()`: Processes the input text, applies syntax highlighting with Prism.js, and updates the line heights.

6. **Line Number Calculation**

   - `getLineNumbers()`: Computes and returns the line numbers, taking into account wrapped content and line heights.

7. **Helper Methods**
   - `computeLineHeight()`: Determines the height of a single line of text by creating a temporary element.
   - `highlightedCode`: Uses Prism.js to apply syntax highlighting to the SQL code.
