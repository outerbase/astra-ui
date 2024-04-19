var Astra=function(t){"use strict";
/**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),i=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=i.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&i.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,s,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[r+1]),t[0]);return new n(s,t,r)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,r))(e)})(t):t
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,v=f.trustedTypes,g=v?v.emptyScript:"",$=f.reactiveElementPolyfillSupport,y=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},m=(t,e)=>!l(t,e),_={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:m};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);void 0!==r&&c(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:i}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return r?.call(this)},set(e){const n=r?.call(this);i.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,r)=>{if(s)t.adoptedStyleSheets=r.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const s of r){const r=document.createElement("style"),i=e.litNonce;void 0!==i&&r.setAttribute("nonce",i),r.textContent=s.cssText,t.appendChild(r)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(void 0!==r&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==i?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=s.getPropertyOptions(r),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=r,this[r]=i.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){if(s??=this.constructor.getPropertyOptions(t),!(s.hasChanged??m)(this[t],e))return;this.P(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t)!0!==s.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],s)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[y("elementProperties")]=new Map,A[y("finalized")]=new Map,$?.({ReactiveElement:A}),(f.reactiveElementVersions??=[]).push("2.0.4");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
const x=globalThis,w=x.trustedTypes,S=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",k=`lit$${(Math.random()+"").slice(9)}$`,C="?"+k,P=`<${C}>`,O=document,U=()=>O.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,T=t=>z(t)||"function"==typeof t?.[Symbol.iterator],H="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,j=/>/g,L=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,B=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),Z=new WeakMap,F=O.createTreeWalker(O,129);function J(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,r=[];let i,n=2===e?"<svg>":"",o=M;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,h=0;for(;h<s.length&&(o.lastIndex=h,l=o.exec(s),null!==l);)h=o.lastIndex,o===M?"!--"===l[1]?o=N:void 0!==l[1]?o=j:void 0!==l[2]?(B.test(l[2])&&(i=RegExp("</"+l[2],"g")),o=L):void 0!==l[3]&&(o=L):o===L?">"===l[0]?(o=i??M,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?L:'"'===l[3]?I:D):o===I||o===D?o=L:o===N||o===j?o=M:(o=L,i=void 0);const d=o===L&&t[e+1].startsWith("/>")?" ":"";n+=o===M?s+P:c>=0?(r.push(a),s.slice(0,c)+E+s.slice(c)+k+d):s+k+(-2===c?e:d)}return[J(t,n+(t[s]||"<?>")+(2===e?"</svg>":"")),r]};class Q{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let i=0,n=0;const o=t.length-1,a=this.parts,[l,c]=K(t,e);if(this.el=Q.createElement(l,s),F.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=F.nextNode())&&a.length<o;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(E)){const e=c[n++],s=r.getAttribute(t).split(k),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:i,name:o[2],strings:s,ctor:"."===o[1]?et:"?"===o[1]?st:"@"===o[1]?rt:tt}),r.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:i}),r.removeAttribute(t));if(B.test(r.tagName)){const t=r.textContent.split(k),e=t.length-1;if(e>0){r.textContent=w?w.emptyScript:"";for(let s=0;s<e;s++)r.append(t[s],U()),F.nextNode(),a.push({type:2,index:++i});r.append(t[e],U())}}}else if(8===r.nodeType)if(r.data===C)a.push({type:2,index:i});else{let t=-1;for(;-1!==(t=r.data.indexOf(k,t+1));)a.push({type:7,index:i}),t+=k.length-1}i++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,r){if(e===V)return e;let i=void 0!==r?s._$Co?.[r]:s._$Cl;const n=R(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),void 0===n?i=void 0:(i=new n(t),i._$AT(t,s,r)),void 0!==r?(s._$Co??=[])[r]=i:s._$Cl=i),void 0!==i&&(e=G(t,i._$AS(t,e.values),i,r)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??O).importNode(e,!0);F.currentNode=r;let i=F.nextNode(),n=0,o=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Y(i,i.nextSibling,this,t):1===a.type?e=new a.ctor(i,a.name,a.strings,this,t):6===a.type&&(e=new it(i,this,t)),this._$AV.push(e),a=s[++o]}n!==a?.index&&(i=F.nextNode(),n++)}return F.currentNode=O,r}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),R(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):T(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==W&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Q.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new X(r,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Q(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const i of t)r===e.length?e.push(s=new Y(this.S(U()),this.S(U()),this,this.options)):s=e[r],s._$AI(i),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,r){const i=this.strings;let n=!1;if(void 0===i)t=G(this,t,e,0),n=!R(t)||t!==this._$AH&&t!==V,n&&(this._$AH=t);else{const r=t;let o,a;for(t=i[0],o=0;o<i.length-1;o++)a=G(this,r[s+o],e,o),a===V&&(a=this._$AH[o]),n||=!R(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+i[o+1]),this._$AH[o]=a}n&&!r&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class rt extends tt{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??W)===V)return;const s=this._$AH,r=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==W&&(s===W||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const nt={P:E,A:k,C:C,M:1,L:K,R:X,D:T,V:G,I:Y,H:tt,N:st,U:rt,B:et,F:it},ot=x.litHtmlPolyfillSupport;ot?.(Q,Y),(x.litHtmlVersions??=[]).push("3.1.2");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
let at=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const r=s?.renderBefore??e;let i=r._$litPart$;if(void 0===i){const t=s?.renderBefore??null;r._$litPart$=i=new Y(e.insertBefore(U(),t),t,void 0,s??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};at._$litElement$=!0,at.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:at});const lt=globalThis.litElementPolyfillSupport;lt?.({LitElement:at}),(globalThis.litElementVersions??=[]).push("4.0.4");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
const ct=t=>(e,s)=>{void 0!==s?s.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)}
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */,ht={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:m},dt=(t=ht,e,s)=>{const{kind:r,metadata:i}=s;let n=globalThis.litPropertyMetadata.get(i);if(void 0===n&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(s.name,t),"accessor"===r){const{name:r}=s;return{set(s){const i=e.get.call(this);e.set.call(this,s),this.requestUpdate(r,i,t)},init(e){return void 0!==e&&this.P(r,void 0,t),e}}}if("setter"===r){const{name:r}=s;return function(s){const i=this[r];e.call(this,s),this.requestUpdate(r,i,t)}}throw Error("Unsupported decorator location: "+r)};function pt(t){return(e,s)=>"object"==typeof s?dt(t,e,s):((t,e,s)=>{const r=e.hasOwnProperty(s);return e.constructor.createProperty(s,r?{...t,wrapped:!0}:t),r?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */}
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
const ut=(t,e,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,s),s)
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */;var ft=o`
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
`,vt=function(t,e,s,r){var i,n=arguments.length,o=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(o=(n<3?i(o):n>3?i(e,s,o):i(e,s))||o);return n>3&&o&&Object.defineProperty(e,s,o),o};let gt=class extends at{constructor(){super(...arguments),this.disabled="",this.shape="default",this.size="base",this.variant="primary"}render(){return q`
            <button class="variant-${this.variant} size-${this.size} shape-${this.shape} ${this.disabled?"disabled":""}">
                <slot></slot>
            </button>
        `}};gt.styles=[ft,o`
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
        `],vt([pt({type:String})],gt.prototype,"disabled",void 0),vt([pt({type:String})],gt.prototype,"shape",void 0),vt([pt({type:String})],gt.prototype,"size",void 0),vt([pt({type:String})],gt.prototype,"variant",void 0),gt=vt([ct("astra-button")],gt);var $t,yt=gt,bt=function(t,e,s,r){var i,n=arguments.length,o=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(o=(n<3?i(o):n>3?i(e,s,o):i(e,s))||o);return n>3&&o&&Object.defineProperty(e,s,o),o};!function(t){t.base="base",t.small="small",t.compact="compact"}($t||($t={}));let mt=class extends at{constructor(){super(...arguments),this.size=$t.base}render(){return q`
            <div class="size-${this.size}">
                <slot></slot>
            </div>
        `}};mt.styles=[ft,o`
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
        `],bt([pt({type:String})],mt.prototype,"size",void 0),mt=bt([ct("astra-card")],mt);var _t=mt,At=function(t,e,s,r){var i,n=arguments.length,o=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(o=(n<3?i(o):n>3?i(e,s,o):i(e,s))||o);return n>3&&o&&Object.defineProperty(e,s,o),o};let xt=class extends at{constructor(){super(...arguments),this.placeholder="",this.value=""}onInput(t){this.value=t.target.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:this.value}))}render(){return q`
            <div>
                <slot name="left"></slot>
                <input type="text" .placeholder=${this.placeholder} .value=${this.value} @input=${this.onInput} />
                <slot name="right"></slot>
            </div>
        `}};xt.styles=[ft,o`
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
        `],At([pt({type:String})],xt.prototype,"placeholder",void 0),At([pt({type:String})],xt.prototype,"value",void 0),xt=At([ct("astra-input")],xt);var wt,St=xt,Et=function(t,e,s,r){var i,n=arguments.length,o=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(o=(n<3?i(o):n>3?i(e,s,o):i(e,s))||o);return n>3&&o&&Object.defineProperty(e,s,o),o};!function(t){t.unspecified="",t.label="label",t.h1="h1",t.h2="h2",t.h3="h3",t.h4="h4"}(wt||(wt={}));let kt=class extends at{constructor(){super(...arguments),this.variant=wt.unspecified}render(){return q`<label class=${this.variant}><slot></slot></label>`}};kt.styles=[ft,o`
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
        `],Et([pt({attribute:"variant"})],kt.prototype,"variant",void 0),kt=Et([ct("astra-label")],kt);var Ct=kt;
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const Pt=2;class Ot{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
     * @license
     * Copyright 2020 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const{I:Ut}=nt,Rt=()=>document.createComment(""),zt=(t,e,s)=>{const r=t._$AA.parentNode,i=void 0===e?t._$AB:e._$AA;if(void 0===s){const e=r.insertBefore(Rt(),i),n=r.insertBefore(Rt(),i);s=new Ut(e,n,t,t.options)}else{const e=s._$AB.nextSibling,n=s._$AM,o=n!==t;if(o){let e;s._$AQ?.(t),s._$AM=t,void 0!==s._$AP&&(e=t._$AU)!==n._$AU&&s._$AP(e)}if(e!==i||o){let t=s._$AA;for(;t!==e;){const e=t.nextSibling;r.insertBefore(t,i),t=e}}}return s},Tt=(t,e,s=t)=>(t._$AI(e,s),t),Ht={},Mt=t=>{t._$AP?.(!1,!0);let e=t._$AA;const s=t._$AB.nextSibling;for(;e!==s;){const t=e.nextSibling;e.remove(),e=t}},Nt=(t,e,s)=>{const r=new Map;for(let i=e;i<=s;i++)r.set(t[i],i);return r},jt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends Ot{constructor(t){if(super(t),t.type!==Pt)throw Error("repeat() can only be used in text expressions")}dt(t,e,s){let r;void 0===s?s=e:void 0!==e&&(r=e);const i=[],n=[];let o=0;for(const e of t)i[o]=r?r(e,o):o,n[o]=s(e,o),o++;return{values:n,keys:i}}render(t,e,s){return this.dt(t,e,s).values}update(t,[e,s,r]){const i=(t=>t._$AH)(t),{values:n,keys:o}=this.dt(e,s,r);if(!Array.isArray(i))return this.ut=o,n;const a=this.ut??=[],l=[];let c,h,d=0,p=i.length-1,u=0,f=n.length-1;for(;d<=p&&u<=f;)if(null===i[d])d++;else if(null===i[p])p--;else if(a[d]===o[u])l[u]=Tt(i[d],n[u]),d++,u++;else if(a[p]===o[f])l[f]=Tt(i[p],n[f]),p--,f--;else if(a[d]===o[f])l[f]=Tt(i[d],n[f]),zt(t,l[f+1],i[d]),d++,f--;else if(a[p]===o[u])l[u]=Tt(i[p],n[u]),zt(t,i[d],i[p]),p--,u++;else if(void 0===c&&(c=Nt(o,u,f),h=Nt(a,d,p)),c.has(a[d]))if(c.has(a[p])){const e=h.get(o[u]),s=void 0!==e?i[e]:null;if(null===s){const e=zt(t,i[d]);Tt(e,n[u]),l[u]=e}else l[u]=Tt(s,n[u]),zt(t,i[d],s),i[e]=null;u++}else Mt(i[p]),p--;else Mt(i[d]),d++;for(;u<=f;){const e=zt(t,l[f+1]);Tt(e,n[u]),l[u++]=e}for(;d<=p;){const t=i[d++];null!==t&&Mt(t)}return this.ut=o,((t,e=Ht)=>{t._$AH=e})(t,l),V}});
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */var Lt=function(t,e,s,r){var i,n=arguments.length,o=n<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(o=(n<3?i(o):n>3?i(e,s,o):i(e,s))||o);return n>3&&o&&Object.defineProperty(e,s,o),o};const Dt=q`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
</svg>`;let It=class extends at{constructor(){super(...arguments),this.placeholder="",this.value="",this.options=[],this.isOpen=!1}shouldDisplayOptions(t){t?(this.optionsListElement.style.display="block",setTimeout(this.optionsListElement.focus.bind(this.optionsListElement),0)):this.optionsListElement.style.display="none",this.isOpen=t}onClickOutside(t){"undefined"!=typeof document&&t.target!==this&&(this.shouldDisplayOptions(!1),document.removeEventListener("click",this.onClickOutside))}onClickInside(t){"undefined"!=typeof document&&(this.isOpen?document.removeEventListener("click",this.onClickOutside):document.addEventListener("click",this.onClickOutside),this.shouldDisplayOptions(!this.isOpen))}renderOption(t,e){return q`<div class="option" @click="${()=>this.value=e}">${t}</div>`}connectedCallback(){super.connectedCallback(),this.onClickOutside=this.onClickOutside.bind(this)}render(){return q`
            <div id="container" @click="${this.onClickInside}">
                <div id="placeholder">${this.placeholder}</div>
                <div id="selection">${this.value}</div>

                ${Dt}

                <div id="options-list">
                    ${jt(this.options,(({label:t})=>t),(({label:t,value:e})=>this.renderOption(t,e)))}
                </div>
            </div>
        `}};It.styles=[ft,o`
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
        `],Lt([pt({attribute:"placeholder"})],It.prototype,"placeholder",void 0),Lt([pt({attribute:"value"})],It.prototype,"value",void 0),Lt([pt({attribute:"options",type:Array})],It.prototype,"options",void 0),Lt([function(t){return pt({...t,state:!0,attribute:!1})}()],It.prototype,"isOpen",void 0),Lt([function(t,e){return(s,r,i)=>{const n=e=>e.renderRoot?.querySelector(t)??null;if(e){const{get:t,set:e}="object"==typeof r?s:i??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return ut(s,r,{get(){let s=t.call(this);return void 0===s&&(s=n(this),(null!==s||this.hasUpdated)&&e.call(this,s)),s}})}return ut(s,r,{get(){return n(this)}})}}("#options-list")],It.prototype,"optionsListElement",void 0),It=Lt([ct("astra-select")],It);var Bt=It;return t.AstraButton=yt,t.AstraCard=_t,t.AstraInput=St,t.AstraLabel=Ct,t.AstraSelect=Bt,t}({});
