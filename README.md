# Astra

![welcoming spaceballs movie frame](https://static1.moviewebimages.com/wordpress/wp-content/uploads/article/8obJdqaaq4cDIkAFJqnL6NpwmemElk.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5)

## Copy + Paste = 🎉

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Classified</title>
        <script src="https://cdn.outerbase.com/astra/latest/astra.bundle.js"></script>
    </head>
    <body>
        <astra-label variant="h1">Are you ready?</astra-label>
        <astra-button>Yes!</astra-button>
    </body>
</html>
```

![](https://github.com/outerbase/cdn/assets/368767/e2128f14-9fec-4f61-afa5-68265c260ca9)

## Usage

You do **not** have to build or compile this project in order to use it. You have the choice:

-   load directly from our CDN
-   host `astra.bundle.js` yourself
-   `npm install` into your project
-   `import` only the components you use; minimize and build to your liking

TypeScript and React support is built-in, **not** required.

### Web Components

#### Demo page

`example.html` (located in the root of this project) illustrates how to use Astra in the most basic of environments. Go ahead and open it in your favorite browser to see what you can do with minimal effort.

#### Adding to your project

##### CDN

We're making Astra available from our CDN. You may simply copy/paste the following snippet onto your site to include all of our components.

```html
<script src="https://cdn.outerbase.com/astra/latest/astra.bundle.js"></script>
```

##### Host it yourself

Place `astra.bundle.js` (found in `dist/web-components/astra.bundle.js`) somewhere accessible to your website. Then update your HTML to include a script tag that references that location:

```html
<script src="/your/path/to/astra.bundle.js"></script>
```

If you want to include our preferred font `Inter`, you can add it to your own site via Google Fonts with the following `style` tag:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap" />
```

We recommend hosting all of your dependencies yourself. See `src/pages/index.astro` for an example including Inter via [NPM](https://www.npmjs.com).

### NPM Modules

#### How to include the prebuilt +bundled version via NPM

_In your terminal, type_

```
pnpm add @outerbase/astra
```

_in your js/ts client-side file(s)_

```
import '@outerbase/dist/web-components/astra.bundle.js'
```

This will include/register all of the Astra copmonents on the page

#### Selectively import the component(s) you use

_In your terminal, type_

```
pnpm add @outerbase/astra
```

_In your `.js`, `.mjs` and `.tsx` files_

```
import  { AstraButton, AstraCard, AstraInput, AstraLabel, AstraSelect, AstraScrollArea }
  from '@outerbase/astra'
```

_Reference `src/pages/index.astro` for an example of using components in this way_

## React Components

We've also packaged Astra for React:

```js
import { AstraReactComponents } from '@outerbase/astra'
const AstraButton = AstraReactComponents.Button

function ArbitraryComponent() {
    return <AstraButton>Click me</AstraButton>
}
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
