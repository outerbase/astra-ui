import { AstraBase } from "./base.js";

var templateButton = document.createElement("template");
templateButton.innerHTML = `
<style>
    button {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: none;
        font-weight: 500;
        font-family: var(--astra-font-family);
        -webkit-font-smoothing: antialiased;
        line-height: 20px;
        border-radius: 6px;
        user-select: none;
        -webkit-user-select: none;
    }

    button:active {
        opacity: 0.75;
    }

    .disabled {
        opacity: 0.4;
        pointer-events: none;
    }

    .shape-default {
        padding: 8px 10px;
        font-size: 14px;
    }

    .shape-square {
        padding: 0 !important;
    }

    .shape-circle {
        padding: 0 !important;
        border-radius: 50%;
        overflow: hidden;
    }

    .size-base.shape-square, .size-base.shape-circle {
        width: 40px;
        height: 40px;
    }

    .size-small.shape-square, .size-small.shape-circle {
        width: 36px;
        height: 36px;
    }

    .size-compact.shape-square, .size-compact.shape-circle {
        width: 32px;
        height: 32px;
    }

    .size-base {
        padding: 10px 16px;
        font-size: 14px;
    }

    .size-small {
        padding: 8px 12px;
        font-size: 14px;
    }

    .size-compact {
        padding: 8px 10px;
        font-size: 12px;
        line-height: 16px;
    }

    .variant-primary {
        background: var(--astra-neutral-700);
        color: white;
    }

    .variant-primary:hover {
        background: var(--astra-neutral-900);
    }

    .variant-secondary {
        background: var(--astra-neutral-100);
        color: var(--astra-neutral-900);
    }

    .variant-secondary:hover {
        background: var(--astra-neutral-200);
    }

    .variant-transparent {
        background: transparent;
        color: var(--astra-neutral-900);
    }

    .variant-transparent:hover {
        background: var(--astra-neutral-100);
    }

    .variant-destructive {
        background: var(--astra-red-600);
        color: white !important;
    }

    .variant-destructive:hover {
        background: var(--astra-red-700);
    }

    @media (prefers-color-scheme: dark) {
        .variant-primary {
            background: var(--astra-neutral-200);
            color: black;
        }

        .variant-primary:hover {
            background: white;
        }

        .variant-secondary {
            background: var(--astra-neutral-800);
            color: var(--astra-neutral-200);
        }

        .variant-secondary:hover {
            background: var(--astra-neutral-700);
        }

        .variant-transparent {
            background: transparent;
            color: var(--astra-neutral-200);
        }
    
        .variant-transparent:hover {
            background: var(--astra-neutral-800);
        }

        .variant-destructive {
            background: var(--astra-red-900);
        }

        .variant-destructive:hover {
            background: var(--astra-red-800);
        }
    }
</style>

<button class="variant-primary size-base"><slot></slot></button>
`;

class AstraButton extends AstraBase {
    static get observedAttributes() {
        return [
            "disabled",
            // Default, Square, Circle
            "shape",
            // Base, Small, Compact
            "size",
            // Primary, Secondary, Transparent, Destructive
            "variant",
        ]
    }

    constructor() {
        super();
        
        this.attachShadow({ mode: "open" })
        // this.shadowRoot.innerHTML = templateButton.innerHTML;
        this.shadowRoot.appendChild(templateButton.content.cloneNode(true));
    }
    
    connectedCallback() {
        this.shadowRoot.querySelector("button").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("onclick", { bubbles: true }));
        });


        
        // // Apply classes based on attributes
        // this.shadowRoot.querySelector("button").classList.add("shape-default");

        // // Apply inline styles passed via the style attribute
        const styleAttribute = this.getAttribute("style");
        if (styleAttribute) {
            this.shadowRoot.querySelector("button").style.cssText = styleAttribute;
        }

        // // Append the cssText to the button element
        // let cssText = this.shadowRoot.querySelector("button").style.cssText;

        // // Append `styleAttribute` to `cssText`
        // cssText += styleAttribute;

        // this.shadowRoot.querySelector("button").setAttribute("style", cssText);
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === "shape") {
            this.updateShape(newValue);
        } else if (name === "size") {
            this.updateSize(newValue);
        } else if (name === "variant") {
            this.shadowRoot.querySelector("button").classList.add(`variant-${newValue}`);
        } else if (name === "disabled") {
            if (newValue.length === 0) {
                // The `disabled` attribute exists without a value, default to true
                newValue = "true"
            }

            if (newValue === "true") {
                this.shadowRoot.querySelector("button").classList.add("disabled");
            } else {
                this.shadowRoot.querySelector("button").classList.remove("disabled");
            }
        }
    }

    updateShape(shape) {
        if (shape === "square") {
            this.shadowRoot.querySelector("button").classList.add("shape-square");
        } else if (shape === "circle") {
            this.shadowRoot.querySelector("button").classList.add("shape-circle");
        }
    }

    updateSize(size) {
        if (size === "small") {
            this.shadowRoot.querySelector("button").classList.add("size-small");
        } else if (size === "compact") {
            this.shadowRoot.querySelector("button").classList.add("size-compact");
        }
    }

    updateVariant(variant) {
        this.shadowRoot.querySelector("button").classList.add(`variant-${variant}`);
    }
}

customElements.define('astra-button', AstraButton);