import { AstraBase } from "./base.js";

var templateInput = document.createElement("template");
templateInput.innerHTML = `
<style>
    div {
        display: flex;
        gap: 8px;
        padding: 0 12px;
        border: 1px solid var(--astra-neutral-200);
        border-radius: 6px;
        background: white;
        align-items: center;
        font-family: var(--astra-font-family);
    }

    div:focus-within {
        border-color: var(--astra-neutral-400);
    }

    input {
        flex: 1;
        padding: 10px 0;
        background: transparent;
        border: none;
        color: var(--astra-neutral-900);
        font-family: var(--astra-font-family);
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 20px;
    }

    input:focus {
        outline: none;
    }

    ::placeholder {
        color: var(--astra-neutral-500);
        opacity: 1; /* Firefox */
    }
      
    ::-ms-input-placeholder {
        color: var(--astra-neutral-500);
    }
    
    @media (prefers-color-scheme: dark) {
        div {
            background: var(--astra-neutral-900);
            border: 1px solid var(--astra-neutral-800);
        }

        input {
            color: var(--astra-neutral-100);
        }

        div:focus-within {
            border-color: var(--astra-neutral-600);
        }
    }
</style>

<div>
    <slot name="left"></slot>
    <input type="text" />
    <slot name="right"></slot>
</div>
`;

class AstraInput extends AstraBase {
    static get observedAttributes() {
        return [
            "placeholder",
            "value"
        ]
    }

    constructor() {
        super();
        
        this.attachShadow({ mode: "open" })
        this.shadowRoot.appendChild(templateInput.content.cloneNode(true));
    }
    
    connectedCallback() {
        const styleAttribute = this.getAttribute("style");
        if (styleAttribute) {
            this.shadowRoot.querySelector("div").style.cssText = styleAttribute;
        }
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === "placeholder") {
            this.shadowRoot.querySelector("input").setAttribute("placeholder", newValue);
        } else if (name === "value") {
            this.shadowRoot.querySelector("input").setAttribute("value", newValue);
        }
    }
}

customElements.define('astra-input', AstraInput);