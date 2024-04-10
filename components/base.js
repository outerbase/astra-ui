
const resourceRegistry = new Map();

const css = `
    :root {
        --astra-font-family: 'Inter', sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;

        --astra-neutral-50: #FAFAFA;
        --astra-neutral-100: #F5F5F5;
        --astra-neutral-200: #E5E5E5;
        --astra-neutral-300: #D4D4D4;
        --astra-neutral-400: #A3A3A3;
        --astra-neutral-500: #737373;
        --astra-neutral-600: #525252;
        --astra-neutral-700: #404040;
        --astra-neutral-800: #262626;
        --astra-neutral-900: #171717;
        --astra-neutral-950: #0A0A0A;

        --astra-red-400: #F87171;
        --astra-red-600: #DC2626;
        --astra-red-700: #B91C1C;
        --astra-red-800: #991B1B;
        --astra-red-900: #7F1D1D;
    }
`;

export class AstraBase extends HTMLElement {
    constructor() {
        super();

        // Load shared dependencies only if not already loaded
        if (!resourceRegistry.has('astra-ui')) {
            this.loadStyles();
            resourceRegistry.set('astra-base', true);
        }
    }

    loadStyles() {
        // Add the `css` to the head
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // Import Inter font
        const font = document.createElement("link");
        font.href = 'https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap';
        font.rel = "stylesheet"
        document.head.appendChild(font);
    
        // Mark this class as loaded
        resourceRegistry.set('astra-ui', true);
    }
}

customElements.define('astra-ui', AstraBase);