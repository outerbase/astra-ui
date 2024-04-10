import { AstraBase } from "./base.js";

var templateLabel = document.createElement("template");
templateLabel.innerHTML = `
<style>
    label {
        display: block;
        font-weight: 500;
        font-family: var(--astra-font-family);
        -webkit-font-smoothing: antialiased;
        color: black;
        opacity: 0.8;
        cursor: text;
    }

    .label {
        font-weight: 700;
        font-size: 12px;
        font-family: var(--astra-font-family);
        -webkit-font-smoothing: antialiased;
        opacity: 0.6;
    }

    .h1 {
        opacity: 1;
        font-size: 36px;
        line-height: 40px;
        font-weight: 600;
        margin-bottom: 4px;
    }
    
    .h2 {
        opacity: 1;
        font-size: 24px;
        line-height: 32px;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .h3 {
        opacity: 1;
        font-size: 20px;
        line-height: 28px;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .h4 {
        opacity: 1;
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        margin-bottom: 4px;
    }
    
    @media (prefers-color-scheme: dark) {
        label {
            color: white;
        }
    }
</style>

<label><slot></slot></label>
`;

class AstraLabel extends AstraBase {
    static get observedAttributes() {
        return [
            // h1, h2, h3, h4, h5, label, p. Defaults to label.
            "type"
        ]
    }

    constructor() {
        super();
        
        this.attachShadow({ mode: "open" })
        this.shadowRoot.appendChild(templateLabel.content.cloneNode(true));
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === "type") {
            this.shadowRoot.querySelector("label").classList.add(newValue);
        }
    }
}

customElements.define('astra-label', AstraLabel);