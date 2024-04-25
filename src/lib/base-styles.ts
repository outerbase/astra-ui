import { css } from 'lit'

export default css`
    :host {
        font-size: 14px;
        -webkit-font-smoothing: antialiased;

        --astra-font-family: var(--astra-font-family, 'Inter', sans-serif);
        --astra-font-size: var(--astra-font-size, 14px);

        --astra-neutral-50: var(--astra-neutral-50, #fafafa);
        --astra-neutral-100: var(--astra-neutral-100, #f5f5f5);
        --astra-neutral-200: var(--astra-neutral-200, #e5e5e5);
        --astra-neutral-300: var(--astra-neutral-300, #d4d4d4);
        --astra-neutral-400: var(--astra-neutral-400, #a3a3a3);
        --astra-neutral-500: var(--astra-neutral-500, #737373);
        --astra-neutral-600: var(--astra-neutral-600, #525252);
        --astra-neutral-700: var(--astra-neutral-700, #404040);
        --astra-neutral-800: var(--astra-neutral-800, #262626);
        --astra-neutral-900: var(--astra-neutral-900, #171717);
        --astra-neutral-950: var(--astra-neutral-950, #0a0a0a);

        --astra-red-400: var(--astra-red-400, #f87171);
        --astra-red-600: var(--astra-red-600, #dc2626);
        --astra-red-700: var(--astra-red-700, #b91c1c);
        --astra-red-800: var(--astra-red-800, #991b1b);
        --astra-red-900: var(--astra-red-900, #7f1d1d);
    }
`
