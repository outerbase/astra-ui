# Astra

![welcoming spaceballs movie frame](https://static1.moviewebimages.com/wordpress/wp-content/uploads/article/8obJdqaaq4cDIkAFJqnL6NpwmemElk.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5)

## Usage

You do **not** have to build or compile this project in order to use it.
However, we provide you with every option to do so. We believe this provides the best integration into your existing build/bundle processe(s).

### Generic Web Components

#### Quick Demo

`example.html` in the root of this project is a raw, buildless HTML file that utilizes these Astra components. **You can open this file in any browser for a peek at the Astra library.**

#### Add to your project

Place `astra.bundle.js` (found in `dist/web-components/astra.bundle.js`) somewhere accessible to your website. Then update your HTML to include the following:

```html
<script src="/path/to/astra.bundle.js"></script>
```

If you want to include our preferred font `Inter`, you can add it to your own site via Google Fonts with the following `style` tag:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap" />
```

_We recommend hosting this file yourself, however._

### NPM Modules

#### Include the prebuilt + bundled version via NPM

_In your terminal, type_

```
pnpm add @outerbase/astra
```

_in your js/ts file(s)_

```
import '@outerbase/dist/web-components/astra.bundle.js'
```

#### Selectively import only the component(s) you want

_In your terminal, type_

```
pnpm add @outerbase/astra
```

_In your `.js`, `.mjs` and `.tsx` files_

```
import  { AstraButton, AstraCard, AstraInput, AstraLabel, AstraSelect }
  from '@outerbase/astra'
```

_Reference `src/pages/index.astro` for an example of using components this way_

## React Components

You may also use these components as React components.

```ts
import * as React from 'react'
import { createComponent } from '@lit/react'
import { AstraButton } from '@outerbase/astra'

export const Button = createComponent({
    tagName: 'astra-button',
    elementClass: AstraButton,
    react: React,

    events: {
        onClick: 'click' as EventName<MouseEvent>,
    },
})
```

## Missing font?

We do not force you to use/load the Inter font. If you'd like to use it, include the font `Inter` on your page. You can see examples of how to do this in the following files of this repo:

-   `example.html` via Google Fonts
-   `src/pages/index.astro` via the [@fontsource/inter](https://www.npmjs.com/package/@fontsource/inter) NPM module

## Developing locally

```
pnpm install --frozen-lockfile
pnpm dev
```
