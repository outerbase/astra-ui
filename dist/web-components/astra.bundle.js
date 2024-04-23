var Astra=function(t){"use strict";
/**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const e=globalThis,r=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let s=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(r&&void 0===t){const r=void 0!==e&&1===e.length;r&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const r=1===t.length?t[0]:e.reduce(((e,r,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[i+1]),t[0]);return new s(r,t,i)},a=r?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,f=globalThis,v=f.trustedTypes,g=v?v.emptyScript:"",b=f.reactiveElementPolyfillSupport,m=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},w=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;class S extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){const{get:i,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return i?.call(this)},set(e){const s=i?.call(this);o.call(this,e),this.requestUpdate(t,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const r of e)this.createProperty(r,t[r])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const r=this._$Eu(t,e);void 0!==r&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(r)t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const r of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=r.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(void 0!==i&&!0===r.reflect){const o=(void 0!==r.converter?.toAttribute?r.converter:y).toAttribute(e,r.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const r=this.constructor,i=r._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=r.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i,this[i]=o.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,r){if(void 0!==t){if(r??=this.constructor.getPropertyOptions(t),!(r.hasChanged??w)(this[t],e))return;this.P(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),!0===r.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,r]of t)!0!==r.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],r)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[m("elementProperties")]=new Map,S[m("finalized")]=new Map,b?.({ReactiveElement:S}),(f.reactiveElementVersions??=[]).push("2.0.4");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
const x=globalThis,_=x.trustedTypes,A=_?_.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",E=`lit$${(Math.random()+"").slice(9)}$`,z="?"+E,C=`<${z}>`,P=document,H=()=>P.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,L=Array.isArray,M=t=>L(t)||"function"==typeof t?.[Symbol.iterator],U="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,T=/>/g,D=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,I=/"/g,W=/^(?:script|style|textarea|title)$/i,Y=(t=>(e,...r)=>({_$litType$:t,strings:e,values:r}))(1),B=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),Z=new WeakMap,F=P.createTreeWalker(P,129);function X(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const q=(t,e)=>{const r=t.length-1,i=[];let o,s=2===e?"<svg>":"",n=R;for(let e=0;e<r;e++){const r=t[e];let a,l,c=-1,h=0;for(;h<r.length&&(n.lastIndex=h,l=n.exec(r),null!==l);)h=n.lastIndex,n===R?"!--"===l[1]?n=j:void 0!==l[1]?n=T:void 0!==l[2]?(W.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=D):void 0!==l[3]&&(n=D):n===D?">"===l[0]?(n=o??R,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?D:'"'===l[3]?I:N):n===I||n===N?n=D:n===j||n===T?n=R:(n=D,o=void 0);const d=n===D&&t[e+1].startsWith("/>")?" ":"";s+=n===R?r+C:c>=0?(i.push(a),r.slice(0,c)+k+r.slice(c)+E+d):r+E+(-2===c?e:d)}return[X(t,s+(t[r]||"<?>")+(2===e?"</svg>":"")),i]};class J{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let o=0,s=0;const n=t.length-1,a=this.parts,[l,c]=q(t,e);if(this.el=J.createElement(l,r),F.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=F.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(k)){const e=c[s++],r=i.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:r,ctor:"."===n[1]?et:"?"===n[1]?rt:"@"===n[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(W.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=_?_.emptyScript:"";for(let r=0;r<e;r++)i.append(t[r],H()),F.nextNode(),a.push({type:2,index:++o});i.append(t[e],H())}}}else if(8===i.nodeType)if(i.data===z)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const r=P.createElement("template");return r.innerHTML=t,r}}function K(t,e,r=t,i){if(e===B)return e;let o=void 0!==i?r._$Co?.[i]:r._$Cl;const s=O(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(t),o._$AT(t,r,i)),void 0!==i?(r._$Co??=[])[i]=o:r._$Cl=o),void 0!==o&&(e=K(t,o._$AS(t,e.values),o,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);F.currentNode=i;let o=F.nextNode(),s=0,n=0,a=r[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new G(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=r[++n]}s!==a?.index&&(o=F.nextNode(),s++)}return F.currentNode=P,i}p(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),O(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):M(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==V&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,i="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=J.createElement(X(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),r=t.u(this.options);t.p(e),this.T(r),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new J(t)),e}k(t){L(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,i=0;for(const o of t)i===e.length?e.push(r=new G(this.S(H()),this.S(H()),this,this.options)):r=e[i],r._$AI(o),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=V}_$AI(t,e=this,r,i){const o=this.strings;let s=!1;if(void 0===o)t=K(this,t,e,0),s=!O(t)||t!==this._$AH&&t!==B,s&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=K(this,i[r+n],e,n),a===B&&(a=this._$AH[n]),s||=!O(a)||a!==this._$AH[n],a===V?t=V:t!==V&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}s&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class rt extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class it extends tt{constructor(t,e,r,i,o){super(t,e,r,i,o),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??V)===B)return;const r=this._$AH,i=t===V&&r!==V||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==V&&(r===V||i);i&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const st={P:k,A:E,C:z,M:1,L:q,R:Q,D:M,V:K,I:G,H:tt,N:rt,U:it,B:et,F:ot},nt=x.litHtmlPolyfillSupport;nt?.(J,G),(x.litHtmlVersions??=[]).push("3.1.2");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
let at=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{const i=r?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=r?.renderBefore??null;i._$litPart$=o=new G(e.insertBefore(H(),t),t,void 0,r??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};at._$litElement$=!0,at.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:at});const lt=globalThis.litElementPolyfillSupport;lt?.({LitElement:at}),(globalThis.litElementVersions??=[]).push("4.0.4");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
const ct=t=>(e,r)=>{void 0!==r?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)}
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */,ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:w},dt=(t=ht,e,r)=>{const{kind:i,metadata:o}=r;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),s.set(r.name,t),"accessor"===i){const{name:i}=r;return{set(r){const o=e.get.call(this);e.set.call(this,r),this.requestUpdate(i,o,t)},init(e){return void 0!==e&&this.P(i,void 0,t),e}}}if("setter"===i){const{name:i}=r;return function(r){const o=this[i];e.call(this,r),this.requestUpdate(i,o,t)}}throw Error("Unsupported decorator location: "+i)};function ut(t){return(e,r)=>"object"==typeof r?dt(t,e,r):((t,e,r)=>{const i=e.hasOwnProperty(r);return e.constructor.createProperty(r,i?{...t,wrapped:!0}:t),i?Object.getOwnPropertyDescriptor(e,r):void 0})(t,e,r)
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */}function pt(t){return ut({...t,state:!0,attribute:!1})}
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const ft=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,r),r)
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */;var vt=n`
    :host {
        --astra-font-family: 'Inter', sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;

        --astra-neutral-50: #fafafa;
        --astra-neutral-100: #f5f5f5;
        --astra-neutral-200: #e5e5e5;
        --astra-neutral-300: #d4d4d4;
        --astra-neutral-400: #a3a3a3;
        --astra-neutral-500: #737373;
        --astra-neutral-600: #525252;
        --astra-neutral-700: #404040;
        --astra-neutral-800: #262626;
        --astra-neutral-900: #171717;
        --astra-neutral-950: #0a0a0a;

        --astra-red-400: #f87171;
        --astra-red-600: #dc2626;
        --astra-red-700: #b91c1c;
        --astra-red-800: #991b1b;
        --astra-red-900: #7f1d1d;
    }
`,gt=function(t,e,r,i){var o,s=arguments.length,n=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(s<3?o(n):s>3?o(e,r,n):o(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let bt=class extends at{constructor(){super(...arguments),this.disabled="",this.shape="default",this.size="base",this.variant="primary"}render(){return Y`
            <button class="variant-${this.variant} size-${this.size} shape-${this.shape} ${this.disabled?"disabled":""}">
                <slot></slot>
            </button>
        `}};bt.styles=[vt,n`
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

            .size-base.shape-square,
            .size-base.shape-circle {
                width: 40px;
                height: 40px;
            }

            .size-small.shape-square,
            .size-small.shape-circle {
                width: 36px;
                height: 36px;
            }

            .size-compact.shape-square,
            .size-compact.shape-circle {
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
        `],gt([ut({type:String})],bt.prototype,"disabled",void 0),gt([ut({type:String})],bt.prototype,"shape",void 0),gt([ut({type:String})],bt.prototype,"size",void 0),gt([ut({type:String})],bt.prototype,"variant",void 0),bt=gt([ct("astra-button")],bt);var mt,yt=bt,wt=function(t,e,r,i){var o,s=arguments.length,n=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(s<3?o(n):s>3?o(e,r,n):o(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};!function(t){t.base="base",t.small="small",t.compact="compact"}(mt||(mt={}));let $t=class extends at{constructor(){super(...arguments),this.size=mt.base}render(){return Y`
            <div class="size-${this.size}">
                <slot></slot>
            </div>
        `}};$t.styles=[vt,n`
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
        `],wt([ut({type:String})],$t.prototype,"size",void 0),$t=wt([ct("astra-card")],$t);var St=$t,xt=function(t,e,r,i){var o,s=arguments.length,n=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(s<3?o(n):s>3?o(e,r,n):o(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let _t=class extends at{constructor(){super(...arguments),this.placeholder="",this.value=""}onInput(t){this.value=t.target.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:this.value}))}render(){return Y`
            <div>
                <slot name="left"></slot>
                <input type="text" .placeholder=${this.placeholder} .value=${this.value} @input=${this.onInput} />
                <slot name="right"></slot>
            </div>
        `}};_t.styles=[vt,n`
            :host {
                display: block;
            }

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
        `],xt([ut({type:String})],_t.prototype,"placeholder",void 0),xt([ut({type:String})],_t.prototype,"value",void 0),_t=xt([ct("astra-input")],_t);var At,kt=_t,Et=function(t,e,r,i){var o,s=arguments.length,n=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(s<3?o(n):s>3?o(e,r,n):o(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};!function(t){t.unspecified="",t.label="label",t.h1="h1",t.h2="h2",t.h3="h3",t.h4="h4"}(At||(At={}));let zt=class extends at{constructor(){super(...arguments),this.variant=At.unspecified}render(){return Y`<label class=${this.variant}><slot></slot></label>`}};zt.styles=[vt,n`
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
        `],Et([ut({attribute:"variant"})],zt.prototype,"variant",void 0),zt=Et([ct("astra-label")],zt);var Ct=zt;
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const Pt=1,Ht=2,Ot=t=>(...e)=>({_$litDirective$:t,values:e});let Lt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
     * @license
     * Copyright 2018 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const Mt=Ot(class extends Lt{constructor(t){if(super(t),t.type!==Pt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const r=t.element.classList;for(const t of this.st)t in e||(r.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(r.add(t),this.st.add(t)):(r.remove(t),this.st.delete(t)))}return B}}),{I:Ut}=st,Rt=()=>document.createComment(""),jt=(t,e,r)=>{const i=t._$AA.parentNode,o=void 0===e?t._$AB:e._$AA;if(void 0===r){const e=i.insertBefore(Rt(),o),s=i.insertBefore(Rt(),o);r=new Ut(e,s,t,t.options)}else{const e=r._$AB.nextSibling,s=r._$AM,n=s!==t;if(n){let e;r._$AQ?.(t),r._$AM=t,void 0!==r._$AP&&(e=t._$AU)!==s._$AU&&r._$AP(e)}if(e!==o||n){let t=r._$AA;for(;t!==e;){const e=t.nextSibling;i.insertBefore(t,o),t=e}}}return r},Tt=(t,e,r=t)=>(t._$AI(e,r),t),Dt={},Nt=t=>{t._$AP?.(!1,!0);let e=t._$AA;const r=t._$AB.nextSibling;for(;e!==r;){const t=e.nextSibling;e.remove(),e=t}},It=(t,e)=>{const r=t._$AN;if(void 0===r)return!1;for(const t of r)t._$AO?.(e,!1),It(t,e);return!0},Wt=t=>{let e,r;do{if(void 0===(e=t._$AM))break;r=e._$AN,r.delete(t),t=e}while(0===r?.size)},Yt=t=>{for(let e;e=t._$AM;t=e){let r=e._$AN;if(void 0===r)e._$AN=r=new Set;else if(r.has(t))break;r.add(t),Zt(e)}};
/**
     * @license
     * Copyright 2020 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function Bt(t){void 0!==this._$AN?(Wt(this),this._$AM=t,Yt(this)):this._$AM=t}function Vt(t,e=!1,r=0){const i=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(e)if(Array.isArray(i))for(let t=r;t<i.length;t++)It(i[t],!1),Wt(i[t]);else null!=i&&(It(i,!1),Wt(i));else It(this,t)}const Zt=t=>{t.type==Ht&&(t._$AP??=Vt,t._$AQ??=Bt)};class Ft extends Lt{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),Yt(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(It(this,t),Wt(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}
/**
     * @license
     * Copyright 2020 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const Xt=()=>new qt;class qt{}const Jt=new WeakMap,Kt=Ot(class extends Ft{render(t){return V}update(t,[e]){const r=e!==this.Y;return r&&void 0!==this.Y&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.Y=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),V}rt(t){if("function"==typeof this.Y){const e=this.ht??globalThis;let r=Jt.get(e);void 0===r&&(r=new WeakMap,Jt.set(e,r)),void 0!==r.get(this.Y)&&this.Y.call(this.ht,void 0),r.set(this.Y,t),void 0!==t&&this.Y.call(this.ht,t)}else this.Y.value=t}get lt(){return"function"==typeof this.Y?Jt.get(this.ht??globalThis)?.get(this.Y):this.Y?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),Qt="important",Gt=" !"+Qt,te=Ot(class extends Lt{constructor(t){if(super(t),t.type!==Pt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,r)=>{const i=t[r];return null==i?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`}),"")}update(t,[e]){const{style:r}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?r.removeProperty(t):r[t]=null);for(const t in e){const i=e[t];if(null!=i){this.ft.add(t);const e="string"==typeof i&&i.endsWith(Gt);t.includes("-")||e?r.setProperty(t,e?i.slice(0,-11):i,e?Qt:""):r[t]=i}}return B}});
/**
     * @license
     * Copyright 2018 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function ee(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}var re="object"==typeof global&&global&&global.Object===Object&&global,ie="object"==typeof self&&self&&self.Object===Object&&self,oe=re||ie||Function("return this")(),se=function(){return oe.Date.now()},ne=/\s/;var ae=/^\s+/;function le(t){return t?t.slice(0,function(t){for(var e=t.length;e--&&ne.test(t.charAt(e)););return e}(t)+1).replace(ae,""):t}var ce=oe.Symbol,he=Object.prototype,de=he.hasOwnProperty,ue=he.toString,pe=ce?ce.toStringTag:void 0;var fe=Object.prototype.toString;var ve="[object Null]",ge="[object Undefined]",be=ce?ce.toStringTag:void 0;function me(t){return null==t?void 0===t?ge:ve:be&&be in Object(t)?function(t){var e=de.call(t,pe),r=t[pe];try{t[pe]=void 0;var i=!0}catch(t){}var o=ue.call(t);return i&&(e?t[pe]=r:delete t[pe]),o}(t):function(t){return fe.call(t)}(t)}var ye="[object Symbol]";var we=NaN,$e=/^[-+]0x[0-9a-f]+$/i,Se=/^0b[01]+$/i,xe=/^0o[0-7]+$/i,_e=parseInt;function Ae(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return null!=t&&"object"==typeof t}(t)&&me(t)==ye}(t))return we;if(ee(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=ee(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=le(t);var r=Se.test(t);return r||xe.test(t)?_e(t.slice(2),r?2:8):$e.test(t)?we:+t}var ke=Math.max,Ee=Math.min;function ze(t,e,r){var i,o,s,n,a,l,c=0,h=!1,d=!1,u=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function p(e){var r=i,s=o;return i=o=void 0,c=e,n=t.apply(s,r)}function f(t){var r=t-l;return void 0===l||r>=e||r<0||d&&t-c>=s}function v(){var t=se();if(f(t))return g(t);a=setTimeout(v,function(t){var r=e-(t-l);return d?Ee(r,s-(t-c)):r}(t))}function g(t){return a=void 0,u&&i?p(t):(i=o=void 0,n)}function b(){var t=se(),r=f(t);if(i=arguments,o=this,l=t,r){if(void 0===a)return function(t){return c=t,a=setTimeout(v,e),h?p(t):n}(l);if(d)return clearTimeout(a),a=setTimeout(v,e),p(l)}return void 0===a&&(a=setTimeout(v,e)),n}return e=Ae(e)||0,ee(r)&&(h=!!r.leading,s=(d="maxWait"in r)?ke(Ae(r.maxWait)||0,e):s,u="trailing"in r?!!r.trailing:u),b.cancel=function(){void 0!==a&&clearTimeout(a),c=0,i=l=o=a=void 0},b.flush=function(){return void 0===a?n:g(se())},b}const Ce=n` /* this file yields the Tailwind classes that are used in the codebase */

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

.visible {
  visibility: visible;
}

.collapse {
  visibility: collapse;
}

.static {
  position: static;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.bottom-0 {
  bottom: 0px;
}

.left-0 {
  left: 0px;
}

.right-0 {
  right: 0px;
}

.top-0 {
  top: 0px;
}

.z-50 {
  z-index: 50;
}

.m-0 {
  margin: 0px;
}

.m-0\\.5 {
  margin: 0.125rem;
}

.block {
  display: block;
}

.flex {
  display: flex;
}

.table {
  display: table;
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

.w-1 {
  width: 0.25rem;
}

.w-1\\.5 {
  width: 0.375rem;
}

.w-full {
  width: 100%;
}

.border-collapse {
  border-collapse: collapse;
}

.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.resize {
  resize: both;
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

.rounded-md {
  border-radius: 0.375rem;
}

.border {
  border-width: 1px;
}

.bg-neutral-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(229 229 229 / var(--tw-bg-opacity));
}

.bg-neutral-200\\/60 {
  background-color: rgb(229 229 229 / 0.6);
}

.bg-neutral-700 {
  --tw-bg-opacity: 1;
  background-color: rgb(64 64 64 / var(--tw-bg-opacity));
}

.bg-neutral-700\\/50 {
  background-color: rgb(64 64 64 / 0.5);
}

.underline {
  text-decoration-line: underline;
}

.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.outline {
  outline-style: solid;
}

.grayscale {
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
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

.hover\\:bg-neutral-300:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(212 212 212 / var(--tw-bg-opacity));
}

.active\\:bg-neutral-300:active {
  --tw-bg-opacity: 1;
  background-color: rgb(212 212 212 / var(--tw-bg-opacity));
}

.dark\\:bg-neutral-700\\/50:is(.dark *) {
  background-color: rgb(64 64 64 / 0.5);
}

.dark\\:hover\\:bg-neutral-700:hover:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(64 64 64 / var(--tw-bg-opacity));
}

.dark\\:active\\:bg-neutral-700:active:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(64 64 64 / var(--tw-bg-opacity));
}
 `;var Pe,He;!function(t){t[t.light=0]="light",t[t.dark=1]="dark"}(Pe||(Pe={})),function(t){t.horizontal="horizontal",t.vertical="vertical",t.both="both"}(He||(He={}));var Oe=function(t,e,r,i){var o,s=arguments.length,n=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(s<3?o(n):s>3?o(e,r,n):o(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};class Le extends at{constructor(){super(...arguments),this.theme=Pe.light,this._class=this.theme==Pe.dark?"dark":""}willUpdate(t){super.willUpdate(t),t.has("theme")&&(this._class=this.theme==Pe.dark?"dark":"")}}Le.styles=[Ce],Oe([ut({attribute:"theme",type:String})],Le.prototype,"theme",void 0),Oe([ut({reflect:!0,attribute:"class",type:String})],Le.prototype,"_class",void 0);var Me=function(t,e,r,i){var o,s=arguments.length,n=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(s<3?o(n):s>3?o(e,r,n):o(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let Ue=class extends Le{constructor(){super(),this.threshold=0,this.scroller=Xt(),this.rightScrollZone=Xt(),this.rightScrollHandle=Xt(),this.bottomScrollZone=Xt(),this.bottomScrollHandle=Xt(),this.hasHoveringCursor=!1,this.axis=He.both,this.isDragging=!1,this.verticalScrollPosition=0,this.horizontalScrollPosition=0,this.verticalScrollSize=0,this.horizontalScrollSize=0,this.horizontalScrollProgress=0,this.verticalScrollProgress=0,this.startX=0,this.startY=0,this.scrollStartX=0,this.scrollStartY=0,this._onScroll=this._onScroll?ze(this._onScroll,10).bind(this):this._onScroll.bind(this),this.updateScrollerSizeAndPosition=this.updateScrollerSizeAndPosition.bind(this),this.onWheelVerticalScroller=this.onWheelVerticalScroller.bind(this),this.onWheelHorizontalScroller=this.onWheelHorizontalScroller.bind(this),this.onHorizontalScrollerHandleMouseDown=this.onHorizontalScrollerHandleMouseDown.bind(this),this.onVerticalScrollerHandleMouseDown=this.onVerticalScrollerHandleMouseDown.bind(this)}updateScrollerSizeAndPosition(t){if([He.both,He.vertical].includes(this.axis)){const t=this.scroller.value?.scrollTop??0,e=this.scroller.value?.scrollHeight??0,r=(this.scroller.value?.clientHeight??0)/e;this.verticalScrollSize=1===r?0:(this.scroller.value?.clientHeight??0)*r,this.verticalScrollProgress=t/e,this.verticalScrollPosition=this.verticalScrollProgress*(this.scroller.value?.clientHeight??0)}if([He.both,He.horizontal].includes(this.axis)){const t=this.scroller.value?.scrollWidth??0,e=this.scroller.value?.scrollLeft??0,r=(this.scroller.value?.clientWidth??0)/t,i=1===r?0:(this.scroller.value?.clientWidth??0)*r;this.horizontalScrollProgress=e/t,this.horizontalScrollSize=i,this.horizontalScrollPosition=this.horizontalScrollProgress*(this.scroller.value?.clientWidth??0)}}_onScroll(t){const e=this.previousScrollPosition??0,r=this.scroller.value?.scrollTop??0;Math.abs(e-r)>this.threshold&&(this.previousScrollPosition=r,"function"==typeof this.onScroll&&this.onScroll())}onClickVerticalScroller(t){if(this.scroller.value){const e=(t.clientY-this.getBoundingClientRect().top)/this.scroller.value?.clientHeight;this.scroller.value.scrollTop=e*(this.scroller.value?.scrollHeight??0)-this.verticalScrollSize}}onClickHorizontalScroller(t){if(this.scroller.value){const e=(t.clientX-this.getBoundingClientRect().left)/this.scroller.value?.clientWidth;this.scroller.value.scrollLeft=e*(this.scroller.value?.scrollWidth??0)-this.horizontalScrollSize}}onWheelHorizontalScroller(t){this.scroller.value&&(this.scroller.value.scrollLeft+=t.deltaX)}onWheelVerticalScroller(t){this.scroller.value&&(this.scroller.value.scrollTop+=t.deltaY)}onHorizontalScrollerHandleMouseDown(t){t.preventDefault(),this.startX=t.pageX,this.scrollStartX=this.scroller.value?.scrollLeft??0;const e=t=>{const e=t.pageX-this.startX,r=this.scroller.value?.scrollWidth??0,i=(this.scroller.value?.clientWidth??0)/r;this.scroller.value&&(this.scroller.value.scrollLeft=this.scrollStartX+e/i)},r=t=>{document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",r)};document.addEventListener("mouseup",r),document.addEventListener("mousemove",e)}preventDefault(t){t.preventDefault()}onVerticalScrollerHandleMouseDown(t){t.preventDefault(),this.startY=t.pageY,this.scrollStartY=this.scroller.value?.scrollTop??0;const e=t=>{t.preventDefault();const e=t.pageY-this.startY,r=this.scroller.value?.scrollHeight??0,i=(this.scroller.value?.clientHeight??0)/r;this.scroller.value&&(this.scroller.value.scrollTop=this.scrollStartY+e/i)},r=t=>{document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",r)};document.addEventListener("mouseup",r),document.addEventListener("mousemove",e)}connectedCallback(){super.connectedCallback(),setTimeout((()=>{this.scroller.value?.addEventListener("scroll",this.updateScrollerSizeAndPosition,{passive:!0}),this.scroller.value?.addEventListener("scroll",this._onScroll,{passive:!0}),this.scroller.value?.addEventListener("scrollend",this._onScroll,{passive:!0}),this.rightScrollZone.value?.addEventListener("wheel",this.onWheelVerticalScroller,{passive:!0}),this.bottomScrollZone.value?.addEventListener("wheel",this.onWheelHorizontalScroller,{passive:!0}),this.bottomScrollHandle.value?.addEventListener("mousedown",this.onHorizontalScrollerHandleMouseDown),this.rightScrollHandle.value?.addEventListener("mousedown",this.onVerticalScrollerHandleMouseDown),this.rightScrollZone.value?.addEventListener("contextmenu",this.preventDefault),this.bottomScrollZone.value?.addEventListener("contextmenu",this.preventDefault),this.bottomScrollHandle.value?.addEventListener("contextmenu",this.preventDefault),this.rightScrollHandle.value?.addEventListener("contextmenu",this.preventDefault)}),0)}disconnectedCallback(){super.disconnectedCallback(),this.scroller.value?.removeEventListener("scroll",this.updateScrollerSizeAndPosition),this.scroller.value?.removeEventListener("scroll",this._onScroll),this.scroller.value?.removeEventListener("scrollend",this._onScroll),this.rightScrollZone.value?.removeEventListener("wheel",this.onWheelVerticalScroller),this.bottomScrollZone.value?.removeEventListener("wheel",this.onWheelHorizontalScroller),this.bottomScrollHandle.value?.removeEventListener("mousedown",this.onHorizontalScrollerHandleMouseDown),this.rightScrollHandle.value?.removeEventListener("mousedown",this.onVerticalScrollerHandleMouseDown),this.rightScrollZone.value?.removeEventListener("contextmenu",this.preventDefault),this.bottomScrollZone.value?.removeEventListener("contextmenu",this.preventDefault),this.bottomScrollHandle.value?.removeEventListener("contextmenu",this.preventDefault),this.rightScrollHandle.value?.removeEventListener("contextmenu",this.preventDefault)}willUpdate(t){super.willUpdate(t),t.has("theme")&&this.requestUpdate("class"),t.has("hasHoveringCursor")&&this.hasHoveringCursor&&this.updateScrollerSizeAndPosition()}render(){const t={"w-full rounded-md":!0,"bg-neutral-200/60 dark:bg-neutral-700/50":!0,"hover:bg-neutral-300 dark:hover:bg-neutral-700":!0,"active:bg-neutral-300 dark:active:bg-neutral-700":!0},e={"z-50 absolute right-0 bottom-0 m-0.5":!0,"transition-opacity duration-300":!0,"opacity-0":!this.hasHoveringCursor,"opacity-100":this.hasHoveringCursor},r={transform:`translateY(${this.verticalScrollPosition}px)`,height:`${this.verticalScrollSize}px`},i={transform:`translateX(${this.horizontalScrollPosition}px)`,width:`${this.horizontalScrollSize}px`},o={"absolute bottom-0 left-0 right-0 top-0":!0,"overflow-scroll":this.axis===He.both,"overflow-x-scroll overflow-y-hidden":this.axis===He.horizontal,"overflow-y-scroll overflow-x-hidden":this.axis===He.vertical};return Y`<!-- this comment exists to force the next line onto the next line -->
            <div
                @mouseleave=${()=>{this.pendingMouseLeave=setTimeout((()=>{this.hasHoveringCursor=!1,delete this.pendingMouseLeave}),1e3)}}
                @mouseenter=${()=>{this.hasHoveringCursor=!0,clearTimeout(this.pendingMouseLeave),delete this.pendingMouseLeave}}
                class=${Mt({dark:this.theme==Pe.dark})}
            >
                <div
                    class=${Mt({...e,"top-0 w-1.5":!0})}
                    ${Kt(this.rightScrollZone)}
                    @click=${this.onClickVerticalScroller}
                >
                    <div
                        style=${te(r)}
                        class=${Mt(t)}
                        ${Kt(this.rightScrollHandle)}
                    ></div>
                </div>

                <div
                    class=${Mt({...e,"left-0":!0})}
                    ${Kt(this.bottomScrollZone)}
                    @click=${this.onClickHorizontalScroller}
                >
                    <div
                        style=${te(i)}
                        class=${Mt({...t,"h-1.5":!0})}
                        ${Kt(this.bottomScrollHandle)}
                    ></div>
                </div>

                <div class=${Mt(o)} ${Kt(this.scroller)}>
                    <slot></slot>
                </div>
            </div>`}};Ue.styles=[...Le.styles,n`
            /* Hide scrollbar for Chrome, Safari and Opera */
            ::-webkit-scrollbar {
                display: none; /* for Chrome, Safari, and Opera */
            }

            /* Hide scrollbar for IE, Edge, and Firefox */
            :host {
                -ms-overflow-style: none; /* for Internet Explorer and Edge */
                scrollbar-width: none; /* for Firefox */
            }
        `],Me([ut()],Ue.prototype,"onScroll",void 0),Me([ut({type:Number})],Ue.prototype,"threshold",void 0),Me([ut()],Ue.prototype,"scroller",void 0),Me([ut()],Ue.prototype,"rightScrollZone",void 0),Me([ut()],Ue.prototype,"rightScrollHandle",void 0),Me([ut()],Ue.prototype,"bottomScrollZone",void 0),Me([ut()],Ue.prototype,"bottomScrollHandle",void 0),Me([ut()],Ue.prototype,"hasHoveringCursor",void 0),Me([ut()],Ue.prototype,"axis",void 0),Me([pt()],Ue.prototype,"isDragging",void 0),Me([pt()],Ue.prototype,"verticalScrollPosition",void 0),Me([pt()],Ue.prototype,"horizontalScrollPosition",void 0),Me([pt()],Ue.prototype,"verticalScrollSize",void 0),Me([pt()],Ue.prototype,"horizontalScrollSize",void 0),Ue=Me([ct("astra-scroll-area")],Ue);var Re=Ue;
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const je=(t,e,r)=>{const i=new Map;for(let o=e;o<=r;o++)i.set(t[o],o);return i},Te=Ot(class extends Lt{constructor(t){if(super(t),t.type!==Ht)throw Error("repeat() can only be used in text expressions")}dt(t,e,r){let i;void 0===r?r=e:void 0!==e&&(i=e);const o=[],s=[];let n=0;for(const e of t)o[n]=i?i(e,n):n,s[n]=r(e,n),n++;return{values:s,keys:o}}render(t,e,r){return this.dt(t,e,r).values}update(t,[e,r,i]){const o=(t=>t._$AH)(t),{values:s,keys:n}=this.dt(e,r,i);if(!Array.isArray(o))return this.ut=n,s;const a=this.ut??=[],l=[];let c,h,d=0,u=o.length-1,p=0,f=s.length-1;for(;d<=u&&p<=f;)if(null===o[d])d++;else if(null===o[u])u--;else if(a[d]===n[p])l[p]=Tt(o[d],s[p]),d++,p++;else if(a[u]===n[f])l[f]=Tt(o[u],s[f]),u--,f--;else if(a[d]===n[f])l[f]=Tt(o[d],s[f]),jt(t,l[f+1],o[d]),d++,f--;else if(a[u]===n[p])l[p]=Tt(o[u],s[p]),jt(t,o[d],o[u]),u--,p++;else if(void 0===c&&(c=je(n,p,f),h=je(a,d,u)),c.has(a[d]))if(c.has(a[u])){const e=h.get(n[p]),r=void 0!==e?o[e]:null;if(null===r){const e=jt(t,o[d]);Tt(e,s[p]),l[p]=e}else l[p]=Tt(r,s[p]),jt(t,o[d],r),o[e]=null;p++}else Nt(o[u]),u--;else Nt(o[d]),d++;for(;p<=f;){const e=jt(t,l[f+1]);Tt(e,s[p]),l[p++]=e}for(;d<=u;){const t=o[d++];null!==t&&Nt(t)}return this.ut=n,((t,e=Dt)=>{t._$AH=e})(t,l),B}});var De=function(t,e,r,i){var o,s=arguments.length,n=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(s<3?o(n):s>3?o(e,r,n):o(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};const Ne=Y`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
</svg>`;let Ie=class extends at{constructor(){super(...arguments),this.placeholder="",this.value="",this.options=[],this.isOpen=!1}shouldDisplayOptions(t){t?(this.optionsListElement.style.display="block",setTimeout(this.optionsListElement.focus.bind(this.optionsListElement),0)):this.optionsListElement.style.display="none",this.isOpen=t}onClickOutside(t){"undefined"!=typeof document&&t.target!==this&&(this.shouldDisplayOptions(!1),document.removeEventListener("click",this.onClickOutside))}onClickInside(t){"undefined"!=typeof document&&(this.isOpen?document.removeEventListener("click",this.onClickOutside):document.addEventListener("click",this.onClickOutside),this.shouldDisplayOptions(!this.isOpen))}renderOption(t,e){return Y`<div class="option" @click="${()=>this.value=e}">${t}</div>`}connectedCallback(){super.connectedCallback(),this.onClickOutside=this.onClickOutside.bind(this)}render(){return Y`
            <div id="container" @click="${this.onClickInside}">
                <div id="placeholder">${this.placeholder}</div>
                <div id="selection">${this.value}</div>

                ${Ne}

                <div id="options-list">
                    ${Te(this.options,(({label:t})=>t),(({label:t,value:e})=>this.renderOption(t,e)))}
                </div>
            </div>
        `}};Ie.styles=[vt,n`
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

            #options-list {
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

                #options-list {
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
        `],De([ut({attribute:"placeholder"})],Ie.prototype,"placeholder",void 0),De([ut({attribute:"value"})],Ie.prototype,"value",void 0),De([ut({attribute:"options",type:Array})],Ie.prototype,"options",void 0),De([pt()],Ie.prototype,"isOpen",void 0),De([function(t,e){return(r,i,o)=>{const s=e=>e.renderRoot?.querySelector(t)??null;if(e){const{get:t,set:e}="object"==typeof i?r:o??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return ft(r,i,{get(){let r=t.call(this);return void 0===r&&(r=s(this),(null!==r||this.hasUpdated)&&e.call(this,r)),r}})}return ft(r,i,{get(){return s(this)}})}}("#options-list")],Ie.prototype,"optionsListElement",void 0),Ie=De([ct("astra-select")],Ie);var We=Ie;return t.AstraButton=yt,t.AstraCard=St,t.AstraInput=kt,t.AstraLabel=Ct,t.AstraScrollArea=Re,t.AstraSelect=We,t}({});
