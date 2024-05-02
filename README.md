<div align="center">
    <h1>Astra UI</h1>
    <a href="https://www.npmjs.com/package/@outerbase/astra-ui"><img src="https://img.shields.io/npm/v/@outerbase/astra-ui.svg?style=flat" /></a>
    <a href="https://github.com/outerbase/astra-ui/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
    <a href="https://github.com/"><img src="https://img.shields.io/badge/license-MIT-blue" /></a>
    <a href="https://discord.gg/4M6AXzGG84"><img alt="Discord" src="https://img.shields.io/discord/1123612147704934400?label=Discord"></a>
    <br />
    <br />
    <a href="https://www.outerbase.com/">Website</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://www.docs.outerbase.com/">Docs</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://www.outerbase.com/blog/">Blog</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://discord.gg/4M6AXzGG84">Discord</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://twitter.com/outerbase">Twitter</a>
    <br />
    <hr />
</div>

## What is Astra UI?

Astra is a lightweight web component UI library usable with any frameworks or no framework at all.

- [**Web Components**](#web-components): Using Astra UI as web components.
- [**NPM Modules**](#npm-modules): Install as an NPM package.

## Usage

You do not need have to build or compile Astra yourself to use it.

- Load directly from our CDN
- Host the astra.js yourself
- `npm install` into your project
- Import only the components you use; minimize and build to your liking

TypeScript support is built-in, **not** required.

Declaring an instance of the editor in your HTML you can do the following:
```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Classified</title>
        <script src="https://cdn.outerbase.com/astra/latest/astra.js"></script>
    </head>
    <body>
        <astra-text variant="h1">Are you ready?</astra-text>
        <astra-button>Yes!</astra-button>
    </body>
</html>
```

### Web Components

#### Demo page

`example.html` (located in the root of this project) illustrates how to use Astra in the most basic of environments. Go ahead and open it in your favorite browser to see what you can do with minimal effort.

#### Adding to your project

##### CDN

We're making Astra available from our CDN. You may simply copy/paste the following snippet onto your site to include all of our components.

```html
<script src="https://cdn.outerbase.com/astra/latest/index.js"></script>
```

##### Host it yourself

Place `astra.js` (found in `dist/web-components/astra.js`) somewhere accessible to your website. Then update your HTML to include a script tag that references that location:

```html
<script src="/your/path/to/astra.js"></script>
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
npm add @outerbase/astra-ui
```

_in your js/ts client-side file(s)_

```
import '@outerbase/astra-ui/bundle'
```

This will include/register all of the Astra copmonents on the page

#### Selectively import the component(s) you use

_In your terminal, type_

```
npm add @outerbase/astra-ui
```

_In your `.js`, `.mjs` and `.tsx` files_

```
import  { Button, Card, Input, Label, ScrollArea, Select, Table }
  from '@outerbase/astra-ui/components'
```

_Reference `src/pages/index.astro` for an example of using components in this way_

<!-- ## React Components

We've also packaged Astra for React:

```js
import { Select, Label, Input, Card, Button } from '@outerbase/astra-ui/react'

function ArbitraryComponent() {
    return <Button>Click me</Button>
}
``` -->

## Missing font?

We do not force you to use/load the Inter font. If you'd like to use it, include the font `Inter` on your page. You can see examples of how to do this in the following files of this repo:

- `example.html` via Google Fonts
- `src/pages/index.astro` via the [@fontsource/inter](https://www.npmjs.com/package/@fontsource/inter) NPM module

## Developing locally

```
npm install --frozen-lockfile
npm dev
```

## Contributing

If you want to add contributions to this repository, please follow the instructions [here](contributing.md).

## Support

For support join our community on [Discord](https://discord.gg/4M6AXzGG84). For enterprise solutions contact us at [support@outerbase.com](mailto:support@outerbase.com)

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE.txt) file for more info.

## Our Contributors

<img align="left" src="https://contributors-img.web.app/image?repo=outerbase/astra-ui"/>
