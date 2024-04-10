import { AstraBase } from "./base.js";

var templateCard = document.createElement("template");
templateCard.innerHTML = `
<style>
    div {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-weight: 500;
        font-family: var(--astra-font-family);
        -webkit-font-smoothing: antialiased;
        color: black;
        background: var(--astra-neutral-100);
        border: 1px solid var(--astra-neutral-200);
        border-radius: 6px;
    }

    .size-base {
        padding: 12px;
        gap: 8px;
    }

    .size-small {
        padding: 8px;
        gap: 4px;
    }

    .size-compact {
        padding: 4px;
        gap: 2px;
    }
    
    @media (prefers-color-scheme: dark) {
        div {
            background: var(--astra-neutral-900);
            border: 1px solid var(--astra-neutral-800);
            color: white;
        }
    }
</style>

<div></div>
`;

class AstraCard extends AstraBase {
    static get observedAttributes() {
        return [
            "size"
        ]
    }

    constructor() {
        super();
        
        this.attachShadow({ mode: "open" })
        this.shadowRoot.appendChild(templateCard.content.cloneNode(true));
    }

    connectedCallback() {
        // Get children and put them all in the div
        // const div = this.shadowRoot.querySelector("div");
        // const slot = this.shadowRoot.querySelector("slot");
        // const children = slot.assignedNodes();
        // children.forEach(child => div.appendChild(child));

        const children = this.children;
        const div = this.shadowRoot.querySelector("div");
        for (let i = 0; i < children.length; i++) {
            console.log('Child: ', children[i])
            div.appendChild(children[i]);
        }
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === "size") {
            const div = this.shadowRoot.querySelector("div");
            div.classList.remove("size-base", "size-small", "size-compact");
            div.classList.add(`size-${newValue}`);
        }
    }
}

customElements.define('astra-card', AstraCard);