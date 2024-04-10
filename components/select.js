import { AstraBase } from "./base.js";

var templateSelect = document.createElement("template");
templateSelect.innerHTML = `
<style>
    #container {
        display: flex;
        gap: 8px;
        position: relative;
        cursor: pointer;
        padding: 10px 12px;
        border: 1px solid var(--astra-neutral-200);
        border-radius: 6px;
        background: white;
        font-family: var(--astra-font-family);
        user-select: none;
        -webkit-user-select: none;
    }

    #options {
        display: none;
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        width: 100%;
        z-index: 1;
        background: white;
        border: 1px solid var(--astra-neutral-200);
        border-radius: 6px;
    }

    .option {
        padding: 10px 12px;
        cursor: pointer;
        color: black;
    }

    .option:hover {
        background: var(--astra-neutral-200);
    }

    #placeholder {
        flex: 1;
        opacity: 0.5;
    }

    #selection {
        flex: 1;
        display: none;
    }
    
    @media (prefers-color-scheme: dark) {
        #container {
            background: var(--astra-neutral-900);
            border: 1px solid var(--astra-neutral-800);
            color: white;
        }

        #options {
            background: var(--astra-neutral-900);
            border: 1px solid var(--astra-neutral-800);
            border-radius: 6px;
        }

        .option {
            color: white;
        }

        .option:hover {
            background: var(--astra-neutral-800);
        }
    }
</style>

<div id="container">
    <div id="placeholder"></div>
    <div id="selection"></div>

    <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
    </div>

    <div id="options">

    </div>
</div>
`;

class AstraSelect extends AstraBase {
    static get observedAttributes() {
        return [
            "placeholder",
            "value"
        ]
    }

    constructor() {
        super();
        
        this.attachShadow({ mode: "open" })
        this.shadowRoot.appendChild(templateSelect.content.cloneNode(true));
    }

    connectedCallback() {
        const container = this.shadowRoot.getElementById("container");
        const options = this.shadowRoot.getElementById("options");
        const selection = this.shadowRoot.getElementById("selection");

        // Toggle options visibility when clicking on container
        container.addEventListener("click", (event) => {
            event.stopPropagation(); // Stop event propagation
            options.style.display = options.style.display === "block" ? "none" : "block";

            if (options.style.display === "block") {
                options.focus(); // Add focus to options menu when it's displayed
            }
        });
    
        // Hide options when clicking outside of it
        document.addEventListener("click", (event) => {
            if (options.style.display === "block" && !container.contains(event.target) && !options.contains(event.target)) {
                options.style.display = "none";
            }
        });

        // Add event listener to each option
        options.addEventListener("click", (event) => {
            const selectedOption = event.target;
            if (selectedOption.classList.contains("option")) {
                this.selectValue(selectedOption.innerText);

                setTimeout(() => {
                    options.style.display = "none";
                }, 0);
            }
        });

        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            options.appendChild(this.renderOption(children[i].innerText, children[i].value));
        }
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === "placeholder") {
            this.shadowRoot.getElementById("placeholder").textContent = newValue;
        } else if (name === "value") {
            this.selectValue(newValue);
        }
    }

    renderOption(text, value) {
        const option = document.createElement("div");
        option.className = "option";
        option.innerText = text;
        option.value = value;
        return option;
    }

    selectValue(value) {
        this.shadowRoot.getElementById("selection").textContent = value;
        this.shadowRoot.getElementById("selection").style.display = value.length ? "block" : "none";
        this.shadowRoot.getElementById("placeholder").style.display = value.length ? "none" : "block";
    }
}

customElements.define('astra-select', AstraSelect);