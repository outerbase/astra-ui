# Architecture Overview

### &lt;astra-button /&gt;

```mermaid
classDiagram
    class AstraButton {
        - Boolean disabled = false
        - Size size = Size.base
        - Shape shape = Shape.default
        - Variant variant = Variant.primary
        + onKeyDown(event: KeyboardEvent): void
    }

    class Variant {
        <<enumeration>>
        + primary = 'primary'
        + secondary = 'secondary'
        + transparent = 'transparent'
    }

    class Size {
        <<enumeration>>
        + base = 'base'
        + small = 'small'
        + compact = 'compact'
    }

    class Shape {
        <<enumeration>>
        + default = 'default'
        + square = 'square'
        + circle = 'circle'
    }

    AstraButton --> Variant
    AstraButton --> Size
    AstraButton --> Shape
```

### &lt;astra-card /&gt;

```mermaid
classDiagram
    class AstraCard {
        - Size size = Size.base
    }

    class Size {
        <<enumeration>>
        + base = 'base'
        + small = 'small'
        + compact = 'compact'
    }

    AstraCard --> Size

```

### &lt;astra-input /&gt;

```mermaid
classDiagram
    class AstraInput {
        - String placeholder = ''
        - String value = ''
        - String label
        + onInput(event: Event): void
    }
```

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant AstraInput
    participant InputElement

    User ->> AstraInput: Loads the component
    AstraInput ->> AstraInput: Initializes properties
    AstraInput ->> AstraInput: Applies initial styles
    AstraInput ->> InputElement: Renders the input element

    User ->> InputElement: Enters text
    InputElement ->> AstraInput: Emits 'input' event
    AstraInput ->> AstraInput: Updates value property
    AstraInput ->> InputElement: Re-renders input with new value

    User ->> InputElement: Focuses on input
    InputElement ->> AstraInput: Emits 'focus' event
    AstraInput ->> AstraInput: Applies focus styles

    User ->> InputElement: Unfocuses input
    InputElement ->> AstraInput: Emits 'blur' event
    AstraInput ->> AstraInput: Removes focus styles

    User ->> InputElement: Uses mouse or keyboard
    InputElement ->> AstraInput: Emits 'input', 'focus', or 'blur' events as appropriate
    AstraInput ->> AstraInput: Updates styles and properties based on events
```

### &lt;astra-scroll-area /&gt;

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant ScrollArea
    participant Scroller

    User ->> ScrollArea: Scrolls Content
    ScrollArea ->> Scroller: Listens for scroll events to update position and size
    ScrollArea ->> Scroller: Listens for scroll events to trigger virtualized content rendering
    ScrollArea ->> Scroller: Updates scroller size and position
    ScrollArea ->> Scroller: Determines which content to render based on scroll position

    User ->> ScrollArea: Clicks and holds Scroll Handle
    ScrollArea ->> ScrollArea: Prepares to track dragging
    ScrollArea ->> ScrollArea: Adds listeners for mouse move and mouse up events

    User ->> ScrollArea: Drags Scroll Handle
    ScrollArea ->> Scroller: Adjusts scroll position

    User ->> ScrollArea: Releases Scroll Handle
    ScrollArea ->> ScrollArea: Stops tracking dragging
    ScrollArea ->> ScrollArea: Removes listeners for mouse move and mouse up events

    User ->> ScrollArea: Uses mouse wheel on Scroll Zone
    ScrollArea ->> Scroller: Adjusts scroll based on wheel input
    ScrollArea ->> Scroller: Updates scroll position

    User ->> ScrollArea: Scrolls using keyboard or other means
    ScrollArea ->> ScrollArea: Events bubble up
    ScrollArea ->> Scroller: Updates scroll position accordingly
```

### &lt;astra-select /&gt;

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant AstraSelect
    participant OptionsList

    User ->> AstraSelect: Clicks on Select Box
    AstraSelect ->> AstraSelect: Toggles options list visibility
    AstraSelect ->> OptionsList: Displays or hides options based on current state

    User ->> AstraSelect: Clicks outside Select Box
    AstraSelect ->> AstraSelect: Hides options list
    AstraSelect ->> OptionsList: Hides options

    User ->> AstraSelect: Clicks on Option
    AstraSelect ->> AstraSelect: Sets selected value
    AstraSelect ->> OptionsList: Updates displayed value

    User ->> AstraSelect: Uses keyboard (Space/Enter)
    AstraSelect ->> AstraSelect: Toggles options list visibility
    AstraSelect ->> OptionsList: Displays or hides options based on current state
```

### &lt;astra-text /&gt;

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant AstraLabel

    User ->> AstraLabel: Loads the component
    AstraLabel ->> AstraLabel: Initializes properties
    AstraLabel ->> AstraLabel: Applies styles based on variant
    AstraLabel ->> AstraLabel: Renders the appropriate text style

    User ->> AstraLabel: Changes the variant property
    AstraLabel ->> AstraLabel: Re-applies styles based on new variant
    AstraLabel ->> AstraLabel: Re-renders the text with updated styles
```

### &lt;astra-calendar /&gt;

[Click to see notes](calendar/README.md)

### &lt;astra-charts /&gt;

[Click to see notes](charts/README.md)

### &lt;universe-editor /&gt;

[Click to see notes](universe/README.md)
