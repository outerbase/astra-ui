var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import baseStyles from '../lib/base-styles.js';
var LabelVariant;
(function (LabelVariant) {
    LabelVariant["unspecified"] = "";
    LabelVariant["label"] = "label";
    LabelVariant["h1"] = "h1";
    LabelVariant["h2"] = "h2";
    LabelVariant["h3"] = "h3";
    LabelVariant["h4"] = "h4";
})(LabelVariant || (LabelVariant = {}));
let AstraLabel = class AstraLabel extends LitElement {
    constructor() {
        super(...arguments);
        this.variant = LabelVariant.unspecified;
    }
    render() {
        return html `<label class=${this.variant}><slot></slot></label>`;
    }
};
AstraLabel.styles = [
    baseStyles,
    css `
      label {
        display: block;
        font-weight: 500;
        font-family: var(--astra-font-family);
        color: black;
        opacity: 0.8;
        cursor: text;
      }

      .label {
        font-weight: 700;
        font-size: 12px;
        font-family: var(--astra-font-family);
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
    `,
];
__decorate([
    property({ attribute: 'variant' })
], AstraLabel.prototype, "variant", void 0);
AstraLabel = __decorate([
    customElement('astra-label')
], AstraLabel);
export default AstraLabel;
