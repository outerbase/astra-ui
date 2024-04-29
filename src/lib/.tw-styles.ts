
  import { css } from "lit";
  export const TWStyles = css` /* THIS FILE IS GENERATED; DO NOT EDIT. */ /* this file yields the Tailwind classes that are used in the codebase */

/* ! tailwindcss v3.4.3 | MIT License | https://tailwindcss.com */

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured sans font-family by default.
5. Use the user's configured sans font-feature-settings by default.
6. Use the user's configured sans font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  -moz-tab-size: 4;
  /* 3 */
  -o-tab-size: 4;
     tab-size: 4;
  /* 3 */
  font-family: Inter, Helvetica, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
  font-feature-settings: normal;
  /* 5 */
  font-variation-settings: normal;
  /* 6 */
  -webkit-tap-highlight-color: transparent;
  /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from html so users can set them as a class directly on the html element.
*/

body {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0;
  /* 1 */
  color: inherit;
  /* 2 */
  border-top-width: 1px;
  /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured mono font-family by default.
2. Use the user's configured mono font-feature-settings by default.
3. Use the user's configured mono font-variation-settings by default.
4. Correct the odd em font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* 1 */
  font-feature-settings: normal;
  /* 2 */
  font-variation-settings: normal;
  /* 3 */
  font-size: 1em;
  /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent sub and sup elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0;
  /* 1 */
  border-color: inherit;
  /* 2 */
  border-collapse: collapse;
  /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-feature-settings: inherit;
  /* 1 */
  font-variation-settings: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  font-weight: inherit;
  /* 1 */
  line-height: inherit;
  /* 1 */
  letter-spacing: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional :invalid styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to inherit in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/

dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements display: block by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add vertical-align: middle to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */

[hidden] {
  display: none;
}

*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

.pointer-events-none {
  pointer-events: none;
}

.visible {
  visibility: visible;
}

.invisible {
  visibility: hidden;
}

.collapse {
  visibility: collapse;
}

.static {
  position: static;
}

.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.sticky {
  position: sticky;
}

.-right-\\[7px\\] {
  right: -7px;
}

.bottom-0 {
  bottom: 0px;
}

.left-0 {
  left: 0px;
}

.left-2 {
  left: 0.5rem;
}

.right-0 {
  right: 0px;
}

.right-1 {
  right: 0.25rem;
}

.top-0 {
  top: 0px;
}

.top-8 {
  top: 2rem;
}

.top-9 {
  top: 2.25rem;
}

.z-50 {
  z-index: 50;
}

.z-\\[1\\] {
  z-index: 1;
}

.z-\\[2\\] {
  z-index: 2;
}

.m-0 {
  margin: 0px;
}

.m-0\\.5 {
  margin: 0.125rem;
}

.-mr-1 {
  margin-right: -0.25rem;
}

.ml-\\[1px\\] {
  margin-left: 1px;
}

.block {
  display: block;
}

.inline-block {
  display: inline-block;
}

.flex {
  display: flex;
}

.\\!table {
  display: table !important;
}

.table {
  display: table;
}

.table-cell {
  display: table-cell;
}

.table-header-group {
  display: table-header-group;
}

.table-row-group {
  display: table-row-group;
}

.table-row {
  display: table-row;
}

.contents {
  display: contents;
}

.hidden {
  display: none;
}

.h-1 {
  height: 0.25rem;
}

.h-1\\.5 {
  height: 0.375rem;
}

.h-4 {
  height: 1rem;
}

.h-\\[38px\\] {
  height: 38px;
}

.h-full {
  height: 100%;
}

.w-1 {
  width: 0.25rem;
}

.w-1\\.5 {
  width: 0.375rem;
}

.w-4 {
  width: 1rem;
}

.w-40 {
  width: 10rem;
}

.w-\\[1px\\] {
  width: 1px;
}

.w-full {
  width: 100%;
}

.min-w-full {
  min-width: 100%;
}

.flex-1 {
  flex: 1 1 0%;
}

.table-fixed {
  table-layout: fixed;
}

.border-collapse {
  border-collapse: collapse;
}

.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.cursor-auto {
  cursor: auto;
}

.cursor-col-resize {
  cursor: col-resize;
}

.cursor-pointer {
  cursor: pointer;
}

.select-none {
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}

.resize {
  resize: both;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-1 {
  gap: 0.25rem;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-3\\.5 {
  gap: 0.875rem;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-scroll {
  overflow: scroll;
}

.overflow-x-hidden {
  overflow-x: hidden;
}

.overflow-y-hidden {
  overflow-y: hidden;
}

.overflow-x-scroll {
  overflow-x: scroll;
}

.overflow-y-scroll {
  overflow-y: scroll;
}

.text-ellipsis {
  text-overflow: ellipsis;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.text-wrap {
  text-wrap: wrap;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.border {
  border-width: 1px;
}

.border-b {
  border-bottom-width: 1px;
}

.border-l {
  border-left-width: 1px;
}

.border-r {
  border-right-width: 1px;
}

.border-t {
  border-top-width: 1px;
}

.border-neutral-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 229 229 / var(--tw-border-opacity));
}

.border-neutral-300 {
  --tw-border-opacity: 1;
  border-color: rgb(212 212 212 / var(--tw-border-opacity));
}

.border-neutral-400 {
  --tw-border-opacity: 1;
  border-color: rgb(163 163 163 / var(--tw-border-opacity));
}

.border-neutral-500 {
  --tw-border-opacity: 1;
  border-color: rgb(115 115 115 / var(--tw-border-opacity));
}

.border-neutral-600 {
  --tw-border-opacity: 1;
  border-color: rgb(82 82 82 / var(--tw-border-opacity));
}

.border-neutral-800 {
  --tw-border-opacity: 1;
  border-color: rgb(38 38 38 / var(--tw-border-opacity));
}

.border-theme-border {
  border-color: var(--border-color, #e5e7eb);
}

.border-theme-border-dark {
  border-color: var(--border-color-dark, rgb(52,52,56));
}

.border-transparent {
  border-color: transparent;
}

.bg-black {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
}

.bg-blue-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(96 165 250 / var(--tw-bg-opacity));
}

.bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity));
}

.bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}

.bg-neutral-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}

.bg-neutral-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(229 229 229 / var(--tw-bg-opacity));
}

.bg-neutral-200\\/60 {
  background-color: rgb(229 229 229 / 0.6);
}

.bg-neutral-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(250 250 250 / var(--tw-bg-opacity));
}

.bg-neutral-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(82 82 82 / var(--tw-bg-opacity));
}

.bg-neutral-700 {
  --tw-bg-opacity: 1;
  background-color: rgb(64 64 64 / var(--tw-bg-opacity));
}

.bg-neutral-700\\/50 {
  background-color: rgb(64 64 64 / 0.5);
}

.bg-neutral-800 {
  --tw-bg-opacity: 1;
  background-color: rgb(38 38 38 / var(--tw-bg-opacity));
}

.bg-neutral-900 {
  --tw-bg-opacity: 1;
  background-color: rgb(23 23 23 / var(--tw-bg-opacity));
}

.bg-neutral-950 {
  --tw-bg-opacity: 1;
  background-color: rgb(10 10 10 / var(--tw-bg-opacity));
}

.bg-red-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
}

.bg-theme-border {
  background-color: var(--border-color, #e5e7eb);
}

.bg-theme-cell-dirty {
  background-color: var(--cell-dirty-background-color, rgb(253 230 138));
}

.bg-theme-cell-dirty-dark {
  background-color: var(--cell-dirty-background-color, rgba(234, 179, 8, .6));
}

.bg-theme-column {
  background-color: var(--column-header-background-color, rgba(255,255,255,0.9));
}

.bg-theme-column-dark {
  background-color: var(--column-header-background-color-dark, rgba(0,0,0,0.9));
}

.bg-theme-row-even-dark {
  background-color: var(--table-row-even-background-color-dark, rgba(0,0,0));
}

.bg-theme-row-hover {
  background-color: var(--hover-background-color, rgba(0,0,0,0.03));
}

.bg-theme-row-hover-dark {
  background-color: var(--hover-background-color-dark, rgba(255,255,255,0.03));
}

.bg-theme-row-new {
  background-color: var(--table-row-new, rgba(22, 163, 74, 0.33));
}

.bg-theme-row-new-dark {
  background-color: var(--table-row-new-dark, rgba(21, 128, 61, 0.5));
}

.bg-theme-row-selected {
  background-color: var(--table-row-selected-background-color, rgba(245, 245, 245, 1));
}

.bg-theme-row-selected-hover-dark {
  background-color: var(--table-row-selected-hover-background-color-dark, rgb(38 38 38));
}

.bg-theme-table {
  background-color: var(--table-background-color, rgba(255,255,255, 0));
}

.bg-theme-table-dark {
  background-color: var(--table-background-color, rgba(10,10,10, 0));
}

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.p-0 {
  padding: 0px;
}

.p-0\\.5 {
  padding: 0.125rem;
}

.p-1 {
  padding: 0.25rem;
}

.p-1\\.5 {
  padding: 0.375rem;
}

.p-2 {
  padding: 0.5rem;
}

.p-2\\.5 {
  padding: 0.625rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-3\\.5 {
  padding: 0.875rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.px-cell-padding-x {
  padding-left: var(--cell-padding-x, 12px);
  padding-right: var(--cell-padding-x, 12px);
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.py-1\\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

.py-cell-padding-y {
  padding-top: var(--cell-padding-y, 8px);
  padding-bottom: var(--cell-padding-y, 8px);
}

.text-\\[8px\\] {
  font-size: 8px;
}

.text-sm {
  font-size: 12px;
  line-height: 18px;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-medium {
  font-weight: 500;
}

.font-normal {
  font-weight: 400;
}

.italic {
  font-style: italic;
}

.leading-\\[9\\.6px\\] {
  line-height: 9.6px;
}

.text-black {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity));
}

.text-neutral-300 {
  --tw-text-opacity: 1;
  color: rgb(212 212 212 / var(--tw-text-opacity));
}

.text-neutral-400 {
  --tw-text-opacity: 1;
  color: rgb(163 163 163 / var(--tw-text-opacity));
}

.text-neutral-50 {
  --tw-text-opacity: 1;
  color: rgb(250 250 250 / var(--tw-text-opacity));
}

.text-neutral-700 {
  --tw-text-opacity: 1;
  color: rgb(64 64 64 / var(--tw-text-opacity));
}

.text-neutral-900 {
  --tw-text-opacity: 1;
  color: rgb(23 23 23 / var(--tw-text-opacity));
}

.text-neutral-950 {
  --tw-text-opacity: 1;
  color: rgb(10 10 10 / var(--tw-text-opacity));
}

.text-red-400 {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity));
}

.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}

.text-theme-column-text {
  color: var(--column-header-text-color, #000000);
}

.text-theme-column-text-dark {
  color: var(--column-header-text-color-dark, #ffffff);
}

.text-theme-text {
  color: var(--text-color, #000000);
}

.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.underline {
  text-decoration-line: underline;
}

.placeholder-neutral-400::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(163 163 163 / var(--tw-placeholder-opacity));
}

.placeholder-neutral-400::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(163 163 163 / var(--tw-placeholder-opacity));
}

.placeholder-neutral-600::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(82 82 82 / var(--tw-placeholder-opacity));
}

.placeholder-neutral-600::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(82 82 82 / var(--tw-placeholder-opacity));
}

.caret-current {
  caret-color: currentColor;
}

.caret-transparent {
  caret-color: transparent;
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.opacity-50 {
  opacity: 0.5;
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-black {
  --tw-shadow-color: #000;
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-black\\/5 {
  --tw-shadow-color: rgb(0 0 0 / 0.05);
  --tw-shadow: var(--tw-shadow-colored);
}

.outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.outline {
  outline-style: solid;
}

.ring-blue-700 {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(29 78 216 / var(--tw-ring-opacity));
}

.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.container {
  width: 100%;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}

.first\\:border-l:first-child {
  border-left-width: 1px;
}

.odd\\:bg-theme-row-odd:nth-child(odd) {
  background-color: var(--table-row-even-background-color, rgba(255,255,255));
}

.even\\:bg-theme-row-even:nth-child(even) {
  background-color: var(--table-row-even-background-color, rgba(255,255,255));
}

.hover\\:bg-neutral-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}

.hover\\:bg-neutral-300:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(212 212 212 / var(--tw-bg-opacity));
}

.hover\\:bg-neutral-800:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(38 38 38 / var(--tw-bg-opacity));
}

.hover\\:bg-red-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity));
}

.hover\\:bg-theme-row-hover:hover {
  background-color: var(--hover-background-color, rgba(0,0,0,0.03));
}

.hover\\:bg-theme-row-selected-hover:hover {
  background-color: var(--table-row-selected-hover-background-color, rgba(229, 229, 229, 1));
}

.hover\\:text-red-600:hover {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity));
}

.focus\\:z-\\[1\\]:focus {
  z-index: 1;
}

.focus\\:rounded-\\[4px\\]:focus {
  border-radius: 4px;
}

.focus\\:rounded-md:focus {
  border-radius: 0.375rem;
}

.focus\\:shadow-ringlet:focus {
  --tw-shadow: 0px 0px 0px 3px #d4d4d4;;
  --tw-shadow-colored: 0px 0px 0px 3px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\\:ring-1:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-black:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(0 0 0 / var(--tw-ring-opacity));
}

.focus\\:ring-blue-300:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(147 197 253 / var(--tw-ring-opacity));
}

.focus\\:ring-neutral-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(115 115 115 / var(--tw-ring-opacity));
}

.focus\\:ring-neutral-950:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(10 10 10 / var(--tw-ring-opacity));
}

.active\\:border-neutral-200:active {
  --tw-border-opacity: 1;
  border-color: rgb(229 229 229 / var(--tw-border-opacity));
}

.active\\:bg-neutral-300:active {
  --tw-bg-opacity: 1;
  background-color: rgb(212 212 212 / var(--tw-bg-opacity));
}

.disabled\\:bg-neutral-400:disabled {
  --tw-bg-opacity: 1;
  background-color: rgb(163 163 163 / var(--tw-bg-opacity));
}

.group:hover .group-hover\\:w-1 {
  width: 0.25rem;
}

.group:hover .group-hover\\:bg-blue-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(96 165 250 / var(--tw-bg-opacity));
}

.group:hover .group-hover\\:bg-theme-row-hover {
  background-color: var(--hover-background-color, rgba(0,0,0,0.03));
}

.group:hover .group-hover\\:bg-theme-row-hover-dark {
  background-color: var(--hover-background-color-dark, rgba(255,255,255,0.03));
}

.group:active .group-active\\:w-1 {
  width: 0.25rem;
}

.group:active .group-active\\:bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}

.dark\\:border-neutral-600:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(82 82 82 / var(--tw-border-opacity));
}

.dark\\:border-neutral-800:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(38 38 38 / var(--tw-border-opacity));
}

.dark\\:border-theme-border-dark:is(.dark *) {
  border-color: var(--border-color-dark, rgb(52,52,56));
}

.dark\\:bg-blue-950:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(23 37 84 / var(--tw-bg-opacity));
}

.dark\\:bg-neutral-50:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(250 250 250 / var(--tw-bg-opacity));
}

.dark\\:bg-neutral-700\\/50:is(.dark *) {
  background-color: rgb(64 64 64 / 0.5);
}

.dark\\:bg-neutral-800:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(38 38 38 / var(--tw-bg-opacity));
}

.dark\\:bg-neutral-900:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(23 23 23 / var(--tw-bg-opacity));
}

.dark\\:bg-neutral-950:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(10 10 10 / var(--tw-bg-opacity));
}

.dark\\:bg-theme-border-dark:is(.dark *) {
  background-color: var(--border-color-dark, rgb(52,52,56));
}

.dark\\:bg-theme-cell-dirty-dark:is(.dark *) {
  background-color: var(--cell-dirty-background-color, rgba(234, 179, 8, .6));
}

.dark\\:bg-theme-column-dark:is(.dark *) {
  background-color: var(--column-header-background-color-dark, rgba(0,0,0,0.9));
}

.dark\\:bg-theme-row-new-dark:is(.dark *) {
  background-color: var(--table-row-new-dark, rgba(21, 128, 61, 0.5));
}

.dark\\:bg-theme-row-selected-dark:is(.dark *) {
  background-color: var(--table-row-selected-background-color-dark, rgb(23 23 23));
}

.dark\\:bg-theme-table-dark:is(.dark *) {
  background-color: var(--table-background-color, rgba(10,10,10, 0));
}

.dark\\:bg-white:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.dark\\:text-black:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity));
}

.dark\\:text-neutral-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(212 212 212 / var(--tw-text-opacity));
}

.dark\\:text-neutral-50:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(250 250 250 / var(--tw-text-opacity));
}

.dark\\:text-neutral-500:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(115 115 115 / var(--tw-text-opacity));
}

.dark\\:text-neutral-950:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(10 10 10 / var(--tw-text-opacity));
}

.dark\\:text-red-400\\/90:is(.dark *) {
  color: rgb(248 113 113 / 0.9);
}

.dark\\:text-theme-column-text-dark:is(.dark *) {
  color: var(--column-header-text-color-dark, #ffffff);
}

.dark\\:text-theme-text-dark:is(.dark *) {
  color: var(--text-color-dark, #ffffff);
}

.dark\\:text-white:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.dark\\:placeholder-neutral-400:is(.dark *)::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(163 163 163 / var(--tw-placeholder-opacity));
}

.dark\\:placeholder-neutral-400:is(.dark *)::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(163 163 163 / var(--tw-placeholder-opacity));
}

.dark\\:placeholder-neutral-600:is(.dark *)::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(82 82 82 / var(--tw-placeholder-opacity));
}

.dark\\:placeholder-neutral-600:is(.dark *)::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(82 82 82 / var(--tw-placeholder-opacity));
}

.dark\\:odd\\:bg-theme-row-odd-dark:nth-child(odd):is(.dark *) {
  background-color: var(--table-row-even-background-color-dark, rgba(0,0,0));
}

.dark\\:even\\:bg-theme-row-even-dark:nth-child(even):is(.dark *) {
  background-color: var(--table-row-even-background-color-dark, rgba(0,0,0));
}

.dark\\:hover\\:bg-neutral-700:hover:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(64 64 64 / var(--tw-bg-opacity));
}

.dark\\:hover\\:bg-neutral-800:hover:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(38 38 38 / var(--tw-bg-opacity));
}

.dark\\:hover\\:bg-neutral-900:hover:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(23 23 23 / var(--tw-bg-opacity));
}

.dark\\:hover\\:bg-red-500\\/10:hover:is(.dark *) {
  background-color: rgb(239 68 68 / 0.1);
}

.dark\\:hover\\:bg-theme-row-hover-dark:hover:is(.dark *) {
  background-color: var(--hover-background-color-dark, rgba(255,255,255,0.03));
}

.dark\\:hover\\:bg-theme-row-selected-hover-dark:hover:is(.dark *) {
  background-color: var(--table-row-selected-hover-background-color-dark, rgb(38 38 38));
}

.hover\\:dark\\:bg-neutral-200:is(.dark *):hover {
  --tw-bg-opacity: 1;
  background-color: rgb(229 229 229 / var(--tw-bg-opacity));
}

.dark\\:hover\\:text-red-400:hover:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity));
}

.focus\\:dark\\:border-neutral-300:is(.dark *):focus {
  --tw-border-opacity: 1;
  border-color: rgb(212 212 212 / var(--tw-border-opacity));
}

.dark\\:focus\\:shadow-ringlet-dark:focus:is(.dark *) {
  --tw-shadow: 0px 0px 0px 3px #525252;;
  --tw-shadow-colored: 0px 0px 0px 3px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.dark\\:focus\\:ring-blue-700:focus:is(.dark *) {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(29 78 216 / var(--tw-ring-opacity));
}

.dark\\:focus\\:ring-neutral-300:focus:is(.dark *) {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(212 212 212 / var(--tw-ring-opacity));
}

.dark\\:focus\\:ring-neutral-50:focus:is(.dark *) {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(250 250 250 / var(--tw-ring-opacity));
}

.dark\\:active\\:border-neutral-800:active:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(38 38 38 / var(--tw-border-opacity));
}

.dark\\:active\\:bg-neutral-700:active:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(64 64 64 / var(--tw-bg-opacity));
}

.disabled\\:dark\\:bg-neutral-600:is(.dark *):disabled {
  --tw-bg-opacity: 1;
  background-color: rgb(82 82 82 / var(--tw-bg-opacity));
}

.group:hover .dark\\:group-hover\\:bg-blue-900:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(30 58 138 / var(--tw-bg-opacity));
}

.group:hover .dark\\:group-hover\\:bg-theme-row-hover-dark:is(.dark *) {
  background-color: var(--hover-background-color-dark, rgba(255,255,255,0.03));
}

.group:active .dark\\:group-active\\:bg-blue-800:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(30 64 175 / var(--tw-bg-opacity));
}
 `
  