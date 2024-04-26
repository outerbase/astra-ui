var Astra=function(t){"use strict";
/**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const e=globalThis,r=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;let a=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(r&&void 0===t){const r=void 0!==e&&1===e.length;r&&(t=i.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&i.set(e,t))}return t}toString(){return this.cssText}};const s=(t,...e)=>{const r=1===t.length?t[0]:e.reduce(((e,r,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[o+1]),t[0]);return new a(r,t,o)},n=r?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,o))(e)})(t):t
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,b=g.trustedTypes,v=b?b.emptyScript:"",f=g.reactiveElementPolyfillSupport,w=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},m=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:m};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;class k extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),o=this.getPropertyDescriptor(t,r,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,r){const{get:o,set:i}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return o?.call(this)},set(e){const a=o?.call(this);i.call(this,e),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const r of e)this.createProperty(r,t[r])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const r=this._$Eu(t,e);void 0!==r&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(r)t.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const r of o){const o=document.createElement("style"),i=e.litNonce;void 0!==i&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(void 0!==o&&!0===r.reflect){const i=(void 0!==r.converter?.toAttribute?r.converter:y).toAttribute(e,r.type);this._$Em=t,null==i?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){const r=this.constructor,o=r._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=r.getPropertyOptions(o),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o,this[o]=i.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,r){if(void 0!==t){if(r??=this.constructor.getPropertyOptions(t),!(r.hasChanged??m)(this[t],e))return;this.P(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),!0===r.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,r]of t)!0!==r.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],r)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[w("elementProperties")]=new Map,k[w("finalized")]=new Map,f?.({ReactiveElement:k}),(g.reactiveElementVersions??=[]).push("2.0.4");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
const $=globalThis,S=$.trustedTypes,_=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${(Math.random()+"").slice(9)}$`,C="?"+E,z=`<${C}>`,O=document,P=()=>O.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,M=t=>R(t)||"function"==typeof t?.[Symbol.iterator],H="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,N=/>/g,D=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,j=/"/g,B=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...r)=>({_$litType$:t,strings:e,values:r}))(1),Y=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),Z=new WeakMap,X=O.createTreeWalker(O,129);function q(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==_?_.createHTML(e):e}const F=(t,e)=>{const r=t.length-1,o=[];let i,a=2===e?"<svg>":"",s=L;for(let e=0;e<r;e++){const r=t[e];let n,l,c=-1,d=0;for(;d<r.length&&(s.lastIndex=d,l=s.exec(r),null!==l);)d=s.lastIndex,s===L?"!--"===l[1]?s=I:void 0!==l[1]?s=N:void 0!==l[2]?(B.test(l[2])&&(i=RegExp("</"+l[2],"g")),s=D):void 0!==l[3]&&(s=D):s===D?">"===l[0]?(s=i??L,c=-1):void 0===l[1]?c=-2:(c=s.lastIndex-l[2].length,n=l[1],s=void 0===l[3]?D:'"'===l[3]?j:U):s===j||s===U?s=D:s===I||s===N?s=L:(s=D,i=void 0);const h=s===D&&t[e+1].startsWith("/>")?" ":"";a+=s===L?r+z:c>=0?(o.push(n),r.slice(0,c)+A+r.slice(c)+E+h):r+E+(-2===c?e:h)}return[q(t,a+(t[r]||"<?>")+(2===e?"</svg>":"")),o]};class G{constructor({strings:t,_$litType$:e},r){let o;this.parts=[];let i=0,a=0;const s=t.length-1,n=this.parts,[l,c]=F(t,e);if(this.el=G.createElement(l,r),X.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=X.nextNode())&&n.length<s;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(A)){const e=c[a++],r=o.getAttribute(t).split(E),s=/([.?@])?(.*)/.exec(e);n.push({type:1,index:i,name:s[2],strings:r,ctor:"."===s[1]?et:"?"===s[1]?rt:"@"===s[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(E)&&(n.push({type:6,index:i}),o.removeAttribute(t));if(B.test(o.tagName)){const t=o.textContent.split(E),e=t.length-1;if(e>0){o.textContent=S?S.emptyScript:"";for(let r=0;r<e;r++)o.append(t[r],P()),X.nextNode(),n.push({type:2,index:++i});o.append(t[e],P())}}}else if(8===o.nodeType)if(o.data===C)n.push({type:2,index:i});else{let t=-1;for(;-1!==(t=o.data.indexOf(E,t+1));)n.push({type:7,index:i}),t+=E.length-1}i++}}static createElement(t,e){const r=O.createElement("template");return r.innerHTML=t,r}}function K(t,e,r=t,o){if(e===Y)return e;let i=void 0!==o?r._$Co?.[o]:r._$Cl;const a=T(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),void 0===a?i=void 0:(i=new a(t),i._$AT(t,r,o)),void 0!==o?(r._$Co??=[])[o]=i:r._$Cl=i),void 0!==i&&(e=K(t,i._$AS(t,e.values),i,o)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,o=(t?.creationScope??O).importNode(e,!0);X.currentNode=o;let i=X.nextNode(),a=0,s=0,n=r[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new Q(i,i.nextSibling,this,t):1===n.type?e=new n.ctor(i,n.name,n.strings,this,t):6===n.type&&(e=new it(i,this,t)),this._$AV.push(e),n=r[++s]}a!==n?.index&&(i=X.nextNode(),a++)}return X.currentNode=O,o}p(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,o){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),T(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==Y&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):M(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==V&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,o="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=G.createElement(q(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new J(o,this),r=t.u(this.options);t.p(e),this.T(r),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new G(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,o=0;for(const i of t)o===e.length?e.push(r=new Q(this.S(P()),this.S(P()),this,this.options)):r=e[o],r._$AI(i),o++;o<e.length&&(this._$AR(r&&r._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,o,i){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=V}_$AI(t,e=this,r,o){const i=this.strings;let a=!1;if(void 0===i)t=K(this,t,e,0),a=!T(t)||t!==this._$AH&&t!==Y,a&&(this._$AH=t);else{const o=t;let s,n;for(t=i[0],s=0;s<i.length-1;s++)n=K(this,o[r+s],e,s),n===Y&&(n=this._$AH[s]),a||=!T(n)||n!==this._$AH[s],n===V?t=V:t!==V&&(t+=(n??"")+i[s+1]),this._$AH[s]=n}a&&!o&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class rt extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class ot extends tt{constructor(t,e,r,o,i){super(t,e,r,o,i),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??V)===Y)return;const r=this._$AH,o=t===V&&r!==V||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==V&&(r===V||o);o&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const at={P:A,A:E,C:C,M:1,L:F,R:J,D:M,V:K,I:Q,H:tt,N:rt,U:ot,B:et,F:it},st=$.litHtmlPolyfillSupport;st?.(G,Q),($.litHtmlVersions??=[]).push("3.1.2");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
let nt=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{const o=r?.renderBefore??e;let i=o._$litPart$;if(void 0===i){const t=r?.renderBefore??null;o._$litPart$=i=new Q(e.insertBefore(P(),t),t,void 0,r??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Y}};nt._$litElement$=!0,nt.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:nt});const lt=globalThis.litElementPolyfillSupport;lt?.({LitElement:nt}),(globalThis.litElementVersions??=[]).push("4.0.4");
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
     */,dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:m},ht=(t=dt,e,r)=>{const{kind:o,metadata:i}=r;let a=globalThis.litPropertyMetadata.get(i);if(void 0===a&&globalThis.litPropertyMetadata.set(i,a=new Map),a.set(r.name,t),"accessor"===o){const{name:o}=r;return{set(r){const i=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,i,t)},init(e){return void 0!==e&&this.P(o,void 0,t),e}}}if("setter"===o){const{name:o}=r;return function(r){const i=this[o];e.call(this,r),this.requestUpdate(o,i,t)}}throw Error("Unsupported decorator location: "+o)};function pt(t){return(e,r)=>"object"==typeof r?ht(t,e,r):((t,e,r)=>{const o=e.hasOwnProperty(r);return e.constructor.createProperty(r,o?{...t,wrapped:!0}:t),o?Object.getOwnPropertyDescriptor(e,r):void 0})(t,e,r)
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */}function ut(t){return pt({...t,state:!0,attribute:!1})}
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const gt=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,r),r)
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */;var bt,vt,ft,wt=s`
    :host {
        font-size: var(--astra-font-size, 14px);

        --astra-font-family: 'Inter', sans-serif;
        --astra-accent: var(--astra-neutral-400, lime);

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
`,yt=function(t,e,r,o){var i,a=arguments.length,s=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,r,s):i(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};!function(t){t.primary="primary",t.secondary="secondary",t.transparent="transparent"}(bt||(bt={})),function(t){t.base="base",t.small="small",t.compact="compact"}(vt||(vt={})),function(t){t.default="default",t.square="square",t.circle="circle"}(ft||(ft={}));let mt=class extends nt{constructor(){super(),this.disabled=!1,this.size=vt.base,this.shape=ft.default,this.variant=bt.primary,this.onKeyDown=this.onKeyDown.bind(this)}onKeyDown(t){const{code:e}=t;this.disabled||"Space"!==e&&"Enter"!==e||(t.preventDefault(),this.click())}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.onKeyDown)}render(){return W`
            <button tabindex="0" class="${`variant-${this.variant} size-${this.size} shape-${this.shape}`}" ?disabled="${this.disabled}">
                <slot></slot>
            </button>
        `}};mt.styles=[wt,s`
            /* Base button styles */
            button {
                display: flex;
                gap: 8px;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border: none;
                font-weight: 500;
                font-family: var(--astra-font-family);
                line-height: 20px;
                border-radius: 6px;
                user-select: none;
                -webkit-user-select: none;
                outline: none; /* Avoid default focus styles */
            }

            /* Enhanced focus styles for keyboard navigation */
            button:focus-visible {
                box-shadow: 0 0 0 3px var(--astra-accent, lime); /* Custom focus indicator */
            }

            /* Handling active and disabled states */
            button:active {
                opacity: 0.75;
            }

            button[disabled] {
                opacity: 0.4;
                cursor: default;
            }

            /* Styling for button shapes */
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

            /* Styling for button sizes */
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

            /* Variant styling for buttons */
            .variant-primary {
                background: var(--astra-neutral-700);
                color: white;
            }

            .variant-secondary {
                background: var(--astra-neutral-100);
                color: var(--astra-neutral-900);
            }

            .variant-transparent {
                background: transparent;
                color: var(--astra-neutral-900);
            }

            .variant-destructive {
                background: var(--astra-red-600);
                color: white !important;
            }

            button:not([disabled]) {
                .variant-primary:hover {
                    background: var(--astra-neutral-900);
                }

                .variant-secondary:hover {
                    background: var(--astra-neutral-200);
                }

                .variant-destructive:hover {
                    background: var(--astra-red-700);
                }
            }

            /* Media queries for dark mode adaptations */
            @media (prefers-color-scheme: dark) {
                button[disabled] {
                    opacity: 0.4;
                    cursor: default;
                }

                .variant-primary {
                    background: var(--astra-neutral-200);
                    color: black;
                }

                button:not([disabled]) {
                    .variant-primary:hover {
                        background: white;
                    }

                    .variant-secondary:hover {
                        background: var(--astra-neutral-700);
                    }

                    .variant-transparent:hover {
                        background: var(--astra-neutral-800);
                    }
                }

                .variant-secondary {
                    background: var(--astra-neutral-800);
                    color: var(--astra-neutral-200);
                }

                .variant-transparent {
                    background: transparent;
                    color: var(--astra-neutral-200);
                }

                .variant-destructive {
                    background: var(--astra-red-900);
                }

                .variant-destructive:hover {
                    background: var(--astra-red-800);
                }
            }
        `],yt([pt({type:Boolean,reflect:!0})],mt.prototype,"disabled",void 0),yt([pt({type:String})],mt.prototype,"size",void 0),yt([pt({type:String})],mt.prototype,"shape",void 0),yt([pt({type:String})],mt.prototype,"variant",void 0),mt=yt([ct("astra-button")],mt);var xt,kt=mt,$t=function(t,e,r,o){var i,a=arguments.length,s=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,r,s):i(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};!function(t){t.base="base",t.small="small",t.compact="compact"}(xt||(xt={}));let St=class extends nt{constructor(){super(...arguments),this.size=xt.base}render(){return W`
            <section class="size-${this.size}">
                <slot></slot>
            </section>
        `}};St.styles=[wt,s`
            section {
                display: flex;
                flex-direction: column;
                gap: 8px;
                font-weight: 500;
                font-family: var(--astra-font-family);
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
        `],$t([pt({type:String})],St.prototype,"size",void 0),St=$t([ct("astra-card")],St);var _t=St,At=function(t,e,r,o){var i,a=arguments.length,s=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,r,s):i(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};let Et=class extends nt{constructor(){super(...arguments),this.placeholder="",this.value=""}onInput(t){this.value=t.target.value}render(){const t=this.label?W`<label id="input-label" for="input">${this.label}</label>`:void 0;return W`
            <div>
                <slot name="left"></slot>

                ${t}
                <input
                    id="input"
                    type="text"
                    aria-labelledby="input-label"
                    .placeholder=${this.placeholder}
                    .value=${this.value}
                    @input=${this.onInput}
                />

                <slot name="right"></slot>
            </div>
        `}};Et.styles=[wt,s`
            :host {
                display: block;
            }

            div {
                display: flex;
                gap: 8px;
                border: 1px solid var(--astra-neutral-200);
                border-radius: 6px;
                overflow: hidden; // preserves border-radius from un-rounded children
                background: white;
                align-items: center;
                font-family: var(--astra-font-family);
            }

            div:focus-within {
                outline: 1px solid var(--astra-accent, lime);
                outline-offset: -1px; // 0px draws it _outside_ of the border, where as this covers the border
            }

            input {
                flex: 1;
                padding: 10px 12px;
                background: transparent;
                border: none;
                color: var(--astra-neutral-900);
                font-family: var(--astra-font-family);
                font-size: 14px;
                line-height: 20px;
            }

            /* Removed outline:none; to preserve default focus indication */
            input::placeholder {
                color: var(--astra-neutral-500);
                opacity: 1; /* Firefox */
            }

            ::-ms-input-placeholder {
                color: var(--astra-neutral-500);
            }

            label {
                position: absolute;
                clip: rect(1px, 1px, 1px, 1px);
                clip-path: inset(50%);
                height: 1px;
                width: 1px;
                margin: -1px;
                overflow: hidden;
                padding: 0;
                border: 0;
            }

            @media (prefers-color-scheme: dark) {
                div {
                    background: var(--astra-neutral-900);
                    border: 1px solid var(--astra-neutral-800);
                }

                input {
                    color: var(--astra-neutral-100);
                }
            }
        `],At([pt({type:String})],Et.prototype,"placeholder",void 0),At([pt({type:String})],Et.prototype,"value",void 0),At([pt({type:String})],Et.prototype,"label",void 0),Et=At([ct("astra-input")],Et);var Ct,zt=Et,Ot=function(t,e,r,o){var i,a=arguments.length,s=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,r,s):i(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};!function(t){t.unspecified="",t.label="label",t.h1="h1",t.h2="h2",t.h3="h3",t.h4="h4"}(Ct||(Ct={}));let Pt=class extends nt{constructor(){super(...arguments),this.variant=Ct.unspecified}render(){return W`<label class=${this.variant}><slot></slot></label>`}};Pt.styles=[wt,s`
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
        `],Ot([pt({attribute:"variant"})],Pt.prototype,"variant",void 0),Pt=Ot([ct("astra-label")],Pt);var Tt=Pt;
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const Rt=1,Mt=2,Ht=t=>(...e)=>({_$litDirective$:t,values:e});let Lt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
     * @license
     * Copyright 2018 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const It=Ht(class extends Lt{constructor(t){if(super(t),t.type!==Rt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const r=t.element.classList;for(const t of this.st)t in e||(r.remove(t),this.st.delete(t));for(const t in e){const o=!!e[t];o===this.st.has(t)||this.nt?.has(t)||(o?(r.add(t),this.st.add(t)):(r.remove(t),this.st.delete(t)))}return Y}}),{I:Nt}=at,Dt=()=>document.createComment(""),Ut=(t,e,r)=>{const o=t._$AA.parentNode,i=void 0===e?t._$AB:e._$AA;if(void 0===r){const e=o.insertBefore(Dt(),i),a=o.insertBefore(Dt(),i);r=new Nt(e,a,t,t.options)}else{const e=r._$AB.nextSibling,a=r._$AM,s=a!==t;if(s){let e;r._$AQ?.(t),r._$AM=t,void 0!==r._$AP&&(e=t._$AU)!==a._$AU&&r._$AP(e)}if(e!==i||s){let t=r._$AA;for(;t!==e;){const e=t.nextSibling;o.insertBefore(t,i),t=e}}}return r},jt=(t,e,r=t)=>(t._$AI(e,r),t),Bt={},Wt=t=>{t._$AP?.(!1,!0);let e=t._$AA;const r=t._$AB.nextSibling;for(;e!==r;){const t=e.nextSibling;e.remove(),e=t}},Yt=(t,e)=>{const r=t._$AN;if(void 0===r)return!1;for(const t of r)t._$AO?.(e,!1),Yt(t,e);return!0},Vt=t=>{let e,r;do{if(void 0===(e=t._$AM))break;r=e._$AN,r.delete(t),t=e}while(0===r?.size)},Zt=t=>{for(let e;e=t._$AM;t=e){let r=e._$AN;if(void 0===r)e._$AN=r=new Set;else if(r.has(t))break;r.add(t),Ft(e)}};
/**
     * @license
     * Copyright 2020 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function Xt(t){void 0!==this._$AN?(Vt(this),this._$AM=t,Zt(this)):this._$AM=t}function qt(t,e=!1,r=0){const o=this._$AH,i=this._$AN;if(void 0!==i&&0!==i.size)if(e)if(Array.isArray(o))for(let t=r;t<o.length;t++)Yt(o[t],!1),Vt(o[t]);else null!=o&&(Yt(o,!1),Vt(o));else Yt(this,t)}const Ft=t=>{t.type==Mt&&(t._$AP??=qt,t._$AQ??=Xt)};class Gt extends Lt{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),Zt(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(Yt(this,t),Vt(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}
/**
     * @license
     * Copyright 2020 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const Kt=()=>new Jt;class Jt{}const Qt=new WeakMap,te=Ht(class extends Gt{render(t){return V}update(t,[e]){const r=e!==this.Y;return r&&void 0!==this.Y&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.Y=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),V}rt(t){if("function"==typeof this.Y){const e=this.ht??globalThis;let r=Qt.get(e);void 0===r&&(r=new WeakMap,Qt.set(e,r)),void 0!==r.get(this.Y)&&this.Y.call(this.ht,void 0),r.set(this.Y,t),void 0!==t&&this.Y.call(this.ht,t)}else this.Y.value=t}get lt(){return"function"==typeof this.Y?Qt.get(this.ht??globalThis)?.get(this.Y):this.Y?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),ee="important",re=" !"+ee,oe=Ht(class extends Lt{constructor(t){if(super(t),t.type!==Rt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,r)=>{const o=t[r];return null==o?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`}),"")}update(t,[e]){const{style:r}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?r.removeProperty(t):r[t]=null);for(const t in e){const o=e[t];if(null!=o){this.ft.add(t);const e="string"==typeof o&&o.endsWith(re);t.includes("-")||e?r.setProperty(t,e?o.slice(0,-11):o,e?ee:""):r[t]=o}}return Y}});
/**
     * @license
     * Copyright 2018 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function ie(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}var ae="object"==typeof global&&global&&global.Object===Object&&global,se="object"==typeof self&&self&&self.Object===Object&&self,ne=ae||se||Function("return this")(),le=function(){return ne.Date.now()},ce=/\s/;var de=/^\s+/;function he(t){return t?t.slice(0,function(t){for(var e=t.length;e--&&ce.test(t.charAt(e)););return e}(t)+1).replace(de,""):t}var pe=ne.Symbol,ue=Object.prototype,ge=ue.hasOwnProperty,be=ue.toString,ve=pe?pe.toStringTag:void 0;var fe=Object.prototype.toString;var we="[object Null]",ye="[object Undefined]",me=pe?pe.toStringTag:void 0;function xe(t){return null==t?void 0===t?ye:we:me&&me in Object(t)?function(t){var e=ge.call(t,ve),r=t[ve];try{t[ve]=void 0;var o=!0}catch(t){}var i=be.call(t);return o&&(e?t[ve]=r:delete t[ve]),i}(t):function(t){return fe.call(t)}(t)}var ke="[object Symbol]";var $e=NaN,Se=/^[-+]0x[0-9a-f]+$/i,_e=/^0b[01]+$/i,Ae=/^0o[0-7]+$/i,Ee=parseInt;function Ce(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return null!=t&&"object"==typeof t}(t)&&xe(t)==ke}(t))return $e;if(ie(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=ie(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=he(t);var r=_e.test(t);return r||Ae.test(t)?Ee(t.slice(2),r?2:8):Se.test(t)?$e:+t}var ze,Oe,Pe,Te,Re,Me=Math.max,He=Math.min;function Le(t,e,r){var o,i,a,s,n,l,c=0,d=!1,h=!1,p=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function u(e){var r=o,a=i;return o=i=void 0,c=e,s=t.apply(a,r)}function g(t){var r=t-l;return void 0===l||r>=e||r<0||h&&t-c>=a}function b(){var t=le();if(g(t))return v(t);n=setTimeout(b,function(t){var r=e-(t-l);return h?He(r,a-(t-c)):r}(t))}function v(t){return n=void 0,p&&o?u(t):(o=i=void 0,s)}function f(){var t=le(),r=g(t);if(o=arguments,i=this,l=t,r){if(void 0===n)return function(t){return c=t,n=setTimeout(b,e),d?u(t):s}(l);if(h)return clearTimeout(n),n=setTimeout(b,e),u(l)}return void 0===n&&(n=setTimeout(b,e)),s}return e=Ce(e)||0,ie(r)&&(d=!!r.leading,a=(h="maxWait"in r)?Me(Ce(r.maxWait)||0,e):a,p="trailing"in r?!!r.trailing:p),f.cancel=function(){void 0!==n&&clearTimeout(n),c=0,o=l=i=n=void 0},f.flush=function(){return void 0===n?s:v(le())},f}!function(t){t.light="light",t.dark="dark"}(ze||(ze={})),function(t){t.horizontal="horizontal",t.vertical="vertical",t.both="both"}(Oe||(Oe={})),function(t){t[t.created=0]="created",t[t.updated=1]="updated",t[t.deleted=2]="deleted"}(Pe||(Pe={})),function(t){t.REAL="REAL",t.INTEGER="INTEGER",t.INT="INT",t.TEXT="TEXT",t.JSON="JSON",t.SMALLINT="SMALLINT",t.BIGINT="BIGINT",t.DECIMAL="DECIMAL",t.NUMERIC="NUMERIC",t.DOUBLE_PRECISION="DOUBLE PRECISION",t.SERIAL="SERIAL",t.BIGSERIAL="BIGSERIAL",t.MONEY="MONEY",t.CHAR="CHAR",t.VARCHAR="VARCHAR",t.BYTEA="BYTEA",t.TIMESTAMP="TIMESTAMP",t.TIMESTAMP_WITH_TIME_ZONE="TIMESTAMP WITH TIME ZONE",t.DATE="DATE",t.DATETIME="DATETIME",t.TIME="TIME",t.TIME_WITH_TIME_ZONE="TIME WITH TIME ZONE",t.INTERVAL="INTERVAL",t.BOOLEAN="BOOLEAN",t.ENUM="ENUM",t.POINT="POINT",t.LINE="LINE",t.LSEG="LSEG",t.BOX="BOX",t.PATH="PATH",t.POLYGON="POLYGON",t.CIRCLE="CIRCLE",t.CIDR="CIDR",t.INET="INET",t.MACADDR="MACADDR",t.MACADDR8="MACADDR8",t.JSONB="JSONB",t.UUID="UUID",t.XML="XML",t.TSVECTOR="TSVECTOR",t.TSQUERY="TSQUERY",t.VARYING="CHARACTER VARYING"}(Te||(Te={})),function(t){t.onEdit="onedit",t.onStopEdit="onstopedit",t.onCancelEdit="oncanceledit",t.onSave="onsave",t.updateCell="updatecell",t.updateRow="updaterow",t.createRow="createrow",t.deleteRow="deleterow",t.getNextPage="getnextpage",t.getPreviousPage="getpreviouspage",t.configurePlugin="configure_plugin",t.installPlugin="install_plugin",t.ephemeralPluginInstall="ephemeral_install_plugin",t.uninstallPlugin="uninstall_plugin",t.sortColumn="sort_column",t.hideColumn="hide_column",t.deleteColumn="delete_column",t.createColumn="create_column",t.updateColumn="update_column",t.createIndex="create_index",t.updateIndex="update_index",t.deleteIndex="delete_index",t.pageNext="page_next",t.cellValue="cellvalue"}(Re||(Re={}));const Ie=s` /* this file yields the Tailwind classes that are used in the codebase */

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

.pointer-events-none {
  pointer-events: none;
}

.visible {
  visibility: visible;
}

.invisible {
  visibility: hidden;
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

.sticky {
  position: sticky;
}

.-right-\\[7px\\] {
  right: -7px;
}

.bottom-0 {
  bottom: 0px;
}

.left-0 {
  left: 0px;
}

.left-2 {
  left: 0.5rem;
}

.right-0 {
  right: 0px;
}

.right-1 {
  right: 0.25rem;
}

.top-0 {
  top: 0px;
}

.top-8 {
  top: 2rem;
}

.top-9 {
  top: 2.25rem;
}

.z-50 {
  z-index: 50;
}

.z-\\[1\\] {
  z-index: 1;
}

.z-\\[2\\] {
  z-index: 2;
}

.m-0 {
  margin: 0px;
}

.m-0\\.5 {
  margin: 0.125rem;
}

.-mr-1 {
  margin-right: -0.25rem;
}

.ml-\\[1px\\] {
  margin-left: 1px;
}

.block {
  display: block;
}

.inline-block {
  display: inline-block;
}

.flex {
  display: flex;
}

.\\!table {
  display: table !important;
}

.table {
  display: table;
}

.table-cell {
  display: table-cell;
}

.table-header-group {
  display: table-header-group;
}

.table-row-group {
  display: table-row-group;
}

.table-row {
  display: table-row;
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

.h-4 {
  height: 1rem;
}

.h-52 {
  height: 13rem;
}

.h-\\[38px\\] {
  height: 38px;
}

.h-full {
  height: 100%;
}

.w-1 {
  width: 0.25rem;
}

.w-1\\.5 {
  width: 0.375rem;
}

.w-4 {
  width: 1rem;
}

.w-40 {
  width: 10rem;
}

.w-\\[1px\\] {
  width: 1px;
}

.w-full {
  width: 100%;
}

.min-w-full {
  min-width: 100%;
}

.flex-1 {
  flex: 1 1 0%;
}

.table-fixed {
  table-layout: fixed;
}

.border-collapse {
  border-collapse: collapse;
}

.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.cursor-auto {
  cursor: auto;
}

.cursor-col-resize {
  cursor: col-resize;
}

.cursor-pointer {
  cursor: pointer;
}

.select-none {
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}

.resize {
  resize: both;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-1 {
  gap: 0.25rem;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-3\\.5 {
  gap: 0.875rem;
}

.overflow-hidden {
  overflow: hidden;
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

.text-ellipsis {
  text-overflow: ellipsis;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.text-wrap {
  text-wrap: wrap;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.border {
  border-width: 1px;
}

.border-b {
  border-bottom-width: 1px;
}

.border-l {
  border-left-width: 1px;
}

.border-r {
  border-right-width: 1px;
}

.border-t {
  border-top-width: 1px;
}

.border-neutral-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 229 229 / var(--tw-border-opacity));
}

.border-neutral-300 {
  --tw-border-opacity: 1;
  border-color: rgb(212 212 212 / var(--tw-border-opacity));
}

.border-neutral-400 {
  --tw-border-opacity: 1;
  border-color: rgb(163 163 163 / var(--tw-border-opacity));
}

.border-neutral-500 {
  --tw-border-opacity: 1;
  border-color: rgb(115 115 115 / var(--tw-border-opacity));
}

.border-neutral-600 {
  --tw-border-opacity: 1;
  border-color: rgb(82 82 82 / var(--tw-border-opacity));
}

.border-neutral-800 {
  --tw-border-opacity: 1;
  border-color: rgb(38 38 38 / var(--tw-border-opacity));
}

.border-theme-border {
  border-color: var(--border-color, #e5e7eb);
}

.border-theme-border-dark {
  border-color: var(--border-color-dark, rgb(52,52,56));
}

.border-transparent {
  border-color: transparent;
}

.bg-black {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
}

.bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity));
}

.bg-green-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity));
}

.bg-neutral-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}

.bg-neutral-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(229 229 229 / var(--tw-bg-opacity));
}

.bg-neutral-200\\/60 {
  background-color: rgb(229 229 229 / 0.6);
}

.bg-neutral-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(250 250 250 / var(--tw-bg-opacity));
}

.bg-neutral-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(82 82 82 / var(--tw-bg-opacity));
}

.bg-neutral-700 {
  --tw-bg-opacity: 1;
  background-color: rgb(64 64 64 / var(--tw-bg-opacity));
}

.bg-neutral-700\\/50 {
  background-color: rgb(64 64 64 / 0.5);
}

.bg-neutral-800 {
  --tw-bg-opacity: 1;
  background-color: rgb(38 38 38 / var(--tw-bg-opacity));
}

.bg-neutral-900 {
  --tw-bg-opacity: 1;
  background-color: rgb(23 23 23 / var(--tw-bg-opacity));
}

.bg-neutral-950 {
  --tw-bg-opacity: 1;
  background-color: rgb(10 10 10 / var(--tw-bg-opacity));
}

.bg-red-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity));
}

.bg-theme-border {
  background-color: var(--border-color, #e5e7eb);
}

.bg-theme-cell-dirty {
  background-color: var(--cell-dirty-background-color, rgb(253 230 138));
}

.bg-theme-cell-dirty-dark {
  background-color: var(--cell-dirty-background-color, rgba(234, 179, 8, .6));
}

.bg-theme-column {
  background-color: var(--column-header-background-color, rgba(255,255,255,0.9));
}

.bg-theme-column-dark {
  background-color: var(--column-header-background-color-dark, rgba(0,0,0,0.9));
}

.bg-theme-row-even-dark {
  background-color: var(--table-row-even-background-color-dark, rgba(0,0,0));
}

.bg-theme-row-hover-dark {
  background-color: var(--hover-background-color-dark, rgba(255,255,255,0.03));
}

.bg-theme-row-new {
  background-color: var(--table-row-new, rgba(22, 163, 74, 0.33));
}

.bg-theme-row-new-dark {
  background-color: var(--table-row-new-dark, rgba(21, 128, 61, 0.5));
}

.bg-theme-row-selected {
  background-color: var(--table-row-selected-background-color, rgba(245, 245, 245, 1));
}

.bg-theme-row-selected-hover-dark {
  background-color: var(--table-row-selected-hover-background-color-dark, rgb(38 38 38));
}

.bg-theme-table {
  background-color: var(--table-background-color, rgba(255,255,255, 0));
}

.bg-theme-table-dark {
  background-color: var(--table-background-color, rgba(10,10,10, 0));
}

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.bg-yellow-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity));
}

.p-0 {
  padding: 0px;
}

.p-0\\.5 {
  padding: 0.125rem;
}

.p-1 {
  padding: 0.25rem;
}

.p-1\\.5 {
  padding: 0.375rem;
}

.p-2 {
  padding: 0.5rem;
}

.p-2\\.5 {
  padding: 0.625rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-3\\.5 {
  padding: 0.875rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.px-cell-padding-x {
  padding-left: var(--cell-padding-x, 12px);
  padding-right: var(--cell-padding-x, 12px);
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.py-1\\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

.py-cell-padding-y {
  padding-top: var(--cell-padding-y, 8px);
  padding-bottom: var(--cell-padding-y, 8px);
}

.text-\\[8px\\] {
  font-size: 8px;
}

.text-sm {
  font-size: 12px;
  line-height: 18px;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-medium {
  font-weight: 500;
}

.font-normal {
  font-weight: 400;
}

.italic {
  font-style: italic;
}

.leading-\\[9\\.6px\\] {
  line-height: 9.6px;
}

.text-black {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity));
}

.text-neutral-300 {
  --tw-text-opacity: 1;
  color: rgb(212 212 212 / var(--tw-text-opacity));
}

.text-neutral-400 {
  --tw-text-opacity: 1;
  color: rgb(163 163 163 / var(--tw-text-opacity));
}

.text-neutral-50 {
  --tw-text-opacity: 1;
  color: rgb(250 250 250 / var(--tw-text-opacity));
}

.text-neutral-700 {
  --tw-text-opacity: 1;
  color: rgb(64 64 64 / var(--tw-text-opacity));
}

.text-neutral-900 {
  --tw-text-opacity: 1;
  color: rgb(23 23 23 / var(--tw-text-opacity));
}

.text-neutral-950 {
  --tw-text-opacity: 1;
  color: rgb(10 10 10 / var(--tw-text-opacity));
}

.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}

.text-theme-column-text {
  color: var(--column-header-text-color, #000000);
}

.text-theme-column-text-dark {
  color: var(--column-header-text-color-dark, #ffffff);
}

.text-theme-text {
  color: var(--text-color, #000000);
}

.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.underline {
  text-decoration-line: underline;
}

.placeholder-neutral-400::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(163 163 163 / var(--tw-placeholder-opacity));
}

.placeholder-neutral-400::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(163 163 163 / var(--tw-placeholder-opacity));
}

.placeholder-neutral-600::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(82 82 82 / var(--tw-placeholder-opacity));
}

.placeholder-neutral-600::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(82 82 82 / var(--tw-placeholder-opacity));
}

.caret-current {
  caret-color: currentColor;
}

.caret-transparent {
  caret-color: transparent;
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.opacity-50 {
  opacity: 0.5;
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-black\\/5 {
  --tw-shadow-color: rgb(0 0 0 / 0.05);
  --tw-shadow: var(--tw-shadow-colored);
}

.outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.outline {
  outline-style: solid;
}

.ring-blue-700 {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(29 78 216 / var(--tw-ring-opacity));
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

.first\\:border-l:first-child {
  border-left-width: 1px;
}

.odd\\:bg-theme-row-odd:nth-child(odd) {
  background-color: var(--table-row-even-background-color, rgba(255,255,255));
}

.even\\:bg-theme-row-even:nth-child(even) {
  background-color: var(--table-row-even-background-color, rgba(255,255,255));
}

.hover\\:bg-neutral-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}

.hover\\:bg-neutral-300:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(212 212 212 / var(--tw-bg-opacity));
}

.hover\\:bg-neutral-800:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(38 38 38 / var(--tw-bg-opacity));
}

.hover\\:bg-red-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity));
}

.hover\\:bg-theme-row-hover:hover {
  background-color: var(--hover-background-color, rgba(0,0,0,0.03));
}

.hover\\:bg-theme-row-selected-hover:hover {
  background-color: var(--table-row-selected-hover-background-color, rgba(229, 229, 229, 1));
}

.hover\\:text-red-600:hover {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity));
}

.focus\\:z-\\[1\\]:focus {
  z-index: 1;
}

.focus\\:rounded-\\[4px\\]:focus {
  border-radius: 4px;
}

.focus\\:rounded-md:focus {
  border-radius: 0.375rem;
}

.focus\\:shadow-ringlet:focus {
  --tw-shadow: 0px 0px 0px 3px #d4d4d4;;
  --tw-shadow-colored: 0px 0px 0px 3px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\\:ring-1:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-black:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(0 0 0 / var(--tw-ring-opacity));
}

.focus\\:ring-blue-300:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(147 197 253 / var(--tw-ring-opacity));
}

.focus\\:ring-neutral-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(115 115 115 / var(--tw-ring-opacity));
}

.focus\\:ring-neutral-950:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(10 10 10 / var(--tw-ring-opacity));
}

.active\\:border-neutral-200:active {
  --tw-border-opacity: 1;
  border-color: rgb(229 229 229 / var(--tw-border-opacity));
}

.active\\:bg-neutral-300:active {
  --tw-bg-opacity: 1;
  background-color: rgb(212 212 212 / var(--tw-bg-opacity));
}

.disabled\\:bg-neutral-400:disabled {
  --tw-bg-opacity: 1;
  background-color: rgb(163 163 163 / var(--tw-bg-opacity));
}

.group:hover .group-hover\\:w-1 {
  width: 0.25rem;
}

.group:hover .group-hover\\:bg-blue-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(96 165 250 / var(--tw-bg-opacity));
}

.group:hover .group-hover\\:bg-theme-row-hover {
  background-color: var(--hover-background-color, rgba(0,0,0,0.03));
}

.group:hover .group-hover\\:bg-theme-row-hover-dark {
  background-color: var(--hover-background-color-dark, rgba(255,255,255,0.03));
}

.group:active .group-active\\:w-1 {
  width: 0.25rem;
}

.group:active .group-active\\:bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}

.dark\\:border-neutral-600:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(82 82 82 / var(--tw-border-opacity));
}

.dark\\:border-neutral-800:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(38 38 38 / var(--tw-border-opacity));
}

.dark\\:border-theme-border-dark:is(.dark *) {
  border-color: var(--border-color-dark, rgb(52,52,56));
}

.dark\\:bg-blue-950:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(23 37 84 / var(--tw-bg-opacity));
}

.dark\\:bg-neutral-50:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(250 250 250 / var(--tw-bg-opacity));
}

.dark\\:bg-neutral-700\\/50:is(.dark *) {
  background-color: rgb(64 64 64 / 0.5);
}

.dark\\:bg-neutral-800:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(38 38 38 / var(--tw-bg-opacity));
}

.dark\\:bg-neutral-900:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(23 23 23 / var(--tw-bg-opacity));
}

.dark\\:bg-neutral-950:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(10 10 10 / var(--tw-bg-opacity));
}

.dark\\:bg-theme-border-dark:is(.dark *) {
  background-color: var(--border-color-dark, rgb(52,52,56));
}

.dark\\:bg-theme-cell-dirty-dark:is(.dark *) {
  background-color: var(--cell-dirty-background-color, rgba(234, 179, 8, .6));
}

.dark\\:bg-theme-column-dark:is(.dark *) {
  background-color: var(--column-header-background-color-dark, rgba(0,0,0,0.9));
}

.dark\\:bg-theme-row-new-dark:is(.dark *) {
  background-color: var(--table-row-new-dark, rgba(21, 128, 61, 0.5));
}

.dark\\:bg-theme-row-selected-dark:is(.dark *) {
  background-color: var(--table-row-selected-background-color-dark, rgb(23 23 23));
}

.dark\\:bg-theme-table-dark:is(.dark *) {
  background-color: var(--table-background-color, rgba(10,10,10, 0));
}

.dark\\:bg-white:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.dark\\:text-black:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity));
}

.dark\\:text-neutral-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(212 212 212 / var(--tw-text-opacity));
}

.dark\\:text-neutral-50:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(250 250 250 / var(--tw-text-opacity));
}

.dark\\:text-neutral-500:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(115 115 115 / var(--tw-text-opacity));
}

.dark\\:text-neutral-950:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(10 10 10 / var(--tw-text-opacity));
}

.dark\\:text-red-400\\/90:is(.dark *) {
  color: rgb(248 113 113 / 0.9);
}

.dark\\:text-theme-column-text-dark:is(.dark *) {
  color: var(--column-header-text-color-dark, #ffffff);
}

.dark\\:text-theme-text-dark:is(.dark *) {
  color: var(--text-color-dark, #ffffff);
}

.dark\\:text-white:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.dark\\:placeholder-neutral-400:is(.dark *)::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(163 163 163 / var(--tw-placeholder-opacity));
}

.dark\\:placeholder-neutral-400:is(.dark *)::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(163 163 163 / var(--tw-placeholder-opacity));
}

.dark\\:placeholder-neutral-600:is(.dark *)::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(82 82 82 / var(--tw-placeholder-opacity));
}

.dark\\:placeholder-neutral-600:is(.dark *)::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(82 82 82 / var(--tw-placeholder-opacity));
}

.dark\\:odd\\:bg-theme-row-odd-dark:nth-child(odd):is(.dark *) {
  background-color: var(--table-row-even-background-color-dark, rgba(0,0,0));
}

.dark\\:even\\:bg-theme-row-even-dark:nth-child(even):is(.dark *) {
  background-color: var(--table-row-even-background-color-dark, rgba(0,0,0));
}

.dark\\:hover\\:bg-neutral-700:hover:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(64 64 64 / var(--tw-bg-opacity));
}

.dark\\:hover\\:bg-neutral-800:hover:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(38 38 38 / var(--tw-bg-opacity));
}

.dark\\:hover\\:bg-neutral-900:hover:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(23 23 23 / var(--tw-bg-opacity));
}

.dark\\:hover\\:bg-red-500\\/10:hover:is(.dark *) {
  background-color: rgb(239 68 68 / 0.1);
}

.dark\\:hover\\:bg-theme-row-hover-dark:hover:is(.dark *) {
  background-color: var(--hover-background-color-dark, rgba(255,255,255,0.03));
}

.dark\\:hover\\:bg-theme-row-selected-hover-dark:hover:is(.dark *) {
  background-color: var(--table-row-selected-hover-background-color-dark, rgb(38 38 38));
}

.hover\\:dark\\:bg-neutral-200:is(.dark *):hover {
  --tw-bg-opacity: 1;
  background-color: rgb(229 229 229 / var(--tw-bg-opacity));
}

.dark\\:hover\\:text-red-400:hover:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity));
}

.focus\\:dark\\:border-neutral-300:is(.dark *):focus {
  --tw-border-opacity: 1;
  border-color: rgb(212 212 212 / var(--tw-border-opacity));
}

.dark\\:focus\\:shadow-ringlet-dark:focus:is(.dark *) {
  --tw-shadow: 0px 0px 0px 3px #525252;;
  --tw-shadow-colored: 0px 0px 0px 3px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.dark\\:focus\\:ring-blue-700:focus:is(.dark *) {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(29 78 216 / var(--tw-ring-opacity));
}

.dark\\:focus\\:ring-neutral-300:focus:is(.dark *) {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(212 212 212 / var(--tw-ring-opacity));
}

.dark\\:focus\\:ring-neutral-50:focus:is(.dark *) {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(250 250 250 / var(--tw-ring-opacity));
}

.dark\\:active\\:border-neutral-800:active:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(38 38 38 / var(--tw-border-opacity));
}

.dark\\:active\\:bg-neutral-700:active:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(64 64 64 / var(--tw-bg-opacity));
}

.disabled\\:dark\\:bg-neutral-600:is(.dark *):disabled {
  --tw-bg-opacity: 1;
  background-color: rgb(82 82 82 / var(--tw-bg-opacity));
}

.group:hover .dark\\:group-hover\\:bg-blue-900:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(30 58 138 / var(--tw-bg-opacity));
}

.group:hover .dark\\:group-hover\\:bg-theme-row-hover-dark:is(.dark *) {
  background-color: var(--hover-background-color-dark, rgba(255,255,255,0.03));
}

.group:active .dark\\:group-active\\:bg-blue-800:is(.dark *) {
  --tw-bg-opacity: 1;
  background-color: rgb(30 64 175 / var(--tw-bg-opacity));
}
 `;var Ne=function(t,e,r,o){var i,a=arguments.length,s=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,r,s):i(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};class De extends nt{constructor(){super(...arguments),this.theme=ze.light,this._class=this.theme}classMap(){return{dark:this.theme==ze.dark}}willUpdate(t){var e;super.willUpdate(t),this._class=(e=this.classMap(),Object.entries(e).map((([t,e])=>!!e&&t)).filter(Boolean).join(" "))}render(){return W`<slot></slot>`}}De.styles=[Ie],Ne([pt({attribute:"theme",type:String})],De.prototype,"theme",void 0),Ne([pt({reflect:!0,attribute:"class",type:String})],De.prototype,"_class",void 0);var Ue=function(t,e,r,o){var i,a=arguments.length,s=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,r,s):i(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};let je=class extends De{constructor(){super(),this.threshold=0,this.scroller=Kt(),this.rightScrollZone=Kt(),this.rightScrollHandle=Kt(),this.bottomScrollZone=Kt(),this.bottomScrollHandle=Kt(),this.hasHoveringCursor=!1,this.axis=Oe.both,this.isDragging=!1,this.verticalScrollPosition=0,this.horizontalScrollPosition=0,this.verticalScrollSize=0,this.horizontalScrollSize=0,this.horizontalScrollProgress=0,this.verticalScrollProgress=0,this.startX=0,this.startY=0,this.scrollStartX=0,this.scrollStartY=0,this._onScroll=this._onScroll?Le(this._onScroll,10).bind(this):this._onScroll.bind(this),this.updateScrollerSizeAndPosition=this.updateScrollerSizeAndPosition.bind(this),this.onWheelVerticalScroller=this.onWheelVerticalScroller.bind(this),this.onWheelHorizontalScroller=this.onWheelHorizontalScroller.bind(this),this.onHorizontalScrollerHandleMouseDown=this.onHorizontalScrollerHandleMouseDown.bind(this),this.onVerticalScrollerHandleMouseDown=this.onVerticalScrollerHandleMouseDown.bind(this)}updateScrollerSizeAndPosition(t){if([Oe.both,Oe.vertical].includes(this.axis)){const t=this.scroller.value?.scrollTop??0,e=this.scroller.value?.scrollHeight??0,r=(this.scroller.value?.clientHeight??0)/e;this.verticalScrollSize=1===r?0:(this.scroller.value?.clientHeight??0)*r,this.verticalScrollProgress=t/e,this.verticalScrollPosition=this.verticalScrollProgress*(this.scroller.value?.clientHeight??0)}if([Oe.both,Oe.horizontal].includes(this.axis)){const t=this.scroller.value?.scrollWidth??0,e=this.scroller.value?.scrollLeft??0,r=(this.scroller.value?.clientWidth??0)/t,o=1===r?0:(this.scroller.value?.clientWidth??0)*r;this.horizontalScrollProgress=e/t,this.horizontalScrollSize=o,this.horizontalScrollPosition=this.horizontalScrollProgress*(this.scroller.value?.clientWidth??0)}}_onScroll(t){const e=this.previousScrollPosition??0,r=this.scroller.value?.scrollTop??0;Math.abs(e-r)>this.threshold&&(this.previousScrollPosition=r,"function"==typeof this.onScroll&&this.onScroll())}onClickVerticalScroller(t){if(this.scroller.value){const e=(t.clientY-this.getBoundingClientRect().top)/this.scroller.value?.clientHeight;this.scroller.value.scrollTop=e*(this.scroller.value?.scrollHeight??0)-this.verticalScrollSize}}onClickHorizontalScroller(t){if(this.scroller.value){const e=(t.clientX-this.getBoundingClientRect().left)/this.scroller.value?.clientWidth;this.scroller.value.scrollLeft=e*(this.scroller.value?.scrollWidth??0)-this.horizontalScrollSize}}onWheelHorizontalScroller(t){this.scroller.value&&(this.scroller.value.scrollLeft+=t.deltaX)}onWheelVerticalScroller(t){this.scroller.value&&(this.scroller.value.scrollTop+=t.deltaY)}onHorizontalScrollerHandleMouseDown(t){t.preventDefault(),this.startX=t.pageX,this.scrollStartX=this.scroller.value?.scrollLeft??0;const e=t=>{const e=t.pageX-this.startX,r=this.scroller.value?.scrollWidth??0,o=(this.scroller.value?.clientWidth??0)/r;this.scroller.value&&(this.scroller.value.scrollLeft=this.scrollStartX+e/o)},r=t=>{document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",r)};document.addEventListener("mouseup",r),document.addEventListener("mousemove",e)}preventDefault(t){t.preventDefault()}onVerticalScrollerHandleMouseDown(t){t.preventDefault(),this.startY=t.pageY,this.scrollStartY=this.scroller.value?.scrollTop??0;const e=t=>{t.preventDefault();const e=t.pageY-this.startY,r=this.scroller.value?.scrollHeight??0,o=(this.scroller.value?.clientHeight??0)/r;this.scroller.value&&(this.scroller.value.scrollTop=this.scrollStartY+e/o)},r=t=>{document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",r)};document.addEventListener("mouseup",r),document.addEventListener("mousemove",e)}connectedCallback(){super.connectedCallback(),setTimeout((()=>{this.scroller.value?.addEventListener("scroll",this.updateScrollerSizeAndPosition,{passive:!0}),this.scroller.value?.addEventListener("scroll",this._onScroll,{passive:!0}),this.scroller.value?.addEventListener("scrollend",this._onScroll,{passive:!0}),this.rightScrollZone.value?.addEventListener("wheel",this.onWheelVerticalScroller,{passive:!0}),this.bottomScrollZone.value?.addEventListener("wheel",this.onWheelHorizontalScroller,{passive:!0}),this.bottomScrollHandle.value?.addEventListener("mousedown",this.onHorizontalScrollerHandleMouseDown),this.rightScrollHandle.value?.addEventListener("mousedown",this.onVerticalScrollerHandleMouseDown),this.rightScrollZone.value?.addEventListener("contextmenu",this.preventDefault),this.bottomScrollZone.value?.addEventListener("contextmenu",this.preventDefault),this.bottomScrollHandle.value?.addEventListener("contextmenu",this.preventDefault),this.rightScrollHandle.value?.addEventListener("contextmenu",this.preventDefault)}),0)}disconnectedCallback(){super.disconnectedCallback(),this.scroller.value?.removeEventListener("scroll",this.updateScrollerSizeAndPosition),this.scroller.value?.removeEventListener("scroll",this._onScroll),this.scroller.value?.removeEventListener("scrollend",this._onScroll),this.rightScrollZone.value?.removeEventListener("wheel",this.onWheelVerticalScroller),this.bottomScrollZone.value?.removeEventListener("wheel",this.onWheelHorizontalScroller),this.bottomScrollHandle.value?.removeEventListener("mousedown",this.onHorizontalScrollerHandleMouseDown),this.rightScrollHandle.value?.removeEventListener("mousedown",this.onVerticalScrollerHandleMouseDown),this.rightScrollZone.value?.removeEventListener("contextmenu",this.preventDefault),this.bottomScrollZone.value?.removeEventListener("contextmenu",this.preventDefault),this.bottomScrollHandle.value?.removeEventListener("contextmenu",this.preventDefault),this.rightScrollHandle.value?.removeEventListener("contextmenu",this.preventDefault)}willUpdate(t){super.willUpdate(t),t.has("theme")&&this.requestUpdate("class"),t.has("hasHoveringCursor")&&this.hasHoveringCursor&&this.updateScrollerSizeAndPosition()}render(){const t={"w-full rounded-md":!0,"bg-neutral-200/60 dark:bg-neutral-700/50":!0,"hover:bg-neutral-300 dark:hover:bg-neutral-700":!0,"active:bg-neutral-300 dark:active:bg-neutral-700":!0},e={"z-50 absolute right-0 bottom-0 m-0.5":!0,"transition-opacity duration-300":!0,"opacity-0":!this.hasHoveringCursor,"opacity-100":this.hasHoveringCursor},r={transform:`translateY(${this.verticalScrollPosition}px)`,height:`${this.verticalScrollSize}px`},o={transform:`translateX(${this.horizontalScrollPosition}px)`,width:`${this.horizontalScrollSize}px`},i={"absolute bottom-0 left-0 right-0 top-0":!0,"overflow-scroll":this.axis===Oe.both,"overflow-x-scroll overflow-y-hidden":this.axis===Oe.horizontal,"overflow-y-scroll overflow-x-hidden":this.axis===Oe.vertical};return W`<!-- this comment exists to force the next line onto the next line -->
            <div
                @mouseleave=${()=>{this.pendingMouseLeave=setTimeout((()=>{this.hasHoveringCursor=!1,delete this.pendingMouseLeave}),1e3)}}
                @mouseenter=${()=>{this.hasHoveringCursor=!0,clearTimeout(this.pendingMouseLeave),delete this.pendingMouseLeave}}
                class=${It({dark:this.theme==ze.dark})}
            >
                <div
                    class=${It({...e,"top-0 w-1.5":!0})}
                    ${te(this.rightScrollZone)}
                    @click=${this.onClickVerticalScroller}
                >
                    <div
                        style=${oe(r)}
                        class=${It(t)}
                        ${te(this.rightScrollHandle)}
                    ></div>
                </div>

                <div
                    class=${It({...e,"left-0":!0})}
                    ${te(this.bottomScrollZone)}
                    @click=${this.onClickHorizontalScroller}
                >
                    <div
                        style=${oe(o)}
                        class=${It({...t,"h-1.5":!0})}
                        ${te(this.bottomScrollHandle)}
                    ></div>
                </div>

                <div class=${It(i)} ${te(this.scroller)}>
                    <slot></slot>
                </div>
            </div>`}};je.styles=[...De.styles,s`
            /* Hide scrollbar for Chrome, Safari and Opera */
            ::-webkit-scrollbar {
                display: none; /* for Chrome, Safari, and Opera */
            }

            /* Hide scrollbar for IE, Edge, and Firefox */
            :host {
                -ms-overflow-style: none; /* for Internet Explorer and Edge */
                scrollbar-width: none; /* for Firefox */
            }
        `],Ue([pt()],je.prototype,"onScroll",void 0),Ue([pt({type:Number})],je.prototype,"threshold",void 0),Ue([pt()],je.prototype,"scroller",void 0),Ue([pt()],je.prototype,"rightScrollZone",void 0),Ue([pt()],je.prototype,"rightScrollHandle",void 0),Ue([pt()],je.prototype,"bottomScrollZone",void 0),Ue([pt()],je.prototype,"bottomScrollHandle",void 0),Ue([pt()],je.prototype,"hasHoveringCursor",void 0),Ue([pt()],je.prototype,"axis",void 0),Ue([ut()],je.prototype,"isDragging",void 0),Ue([ut()],je.prototype,"verticalScrollPosition",void 0),Ue([ut()],je.prototype,"horizontalScrollPosition",void 0),Ue([ut()],je.prototype,"verticalScrollSize",void 0),Ue([ut()],je.prototype,"horizontalScrollSize",void 0),je=Ue([ct("astra-scroll-area")],je);var Be=je;
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const We=(t,e,r)=>{const o=new Map;for(let i=e;i<=r;i++)o.set(t[i],i);return o},Ye=Ht(class extends Lt{constructor(t){if(super(t),t.type!==Mt)throw Error("repeat() can only be used in text expressions")}dt(t,e,r){let o;void 0===r?r=e:void 0!==e&&(o=e);const i=[],a=[];let s=0;for(const e of t)i[s]=o?o(e,s):s,a[s]=r(e,s),s++;return{values:a,keys:i}}render(t,e,r){return this.dt(t,e,r).values}update(t,[e,r,o]){const i=(t=>t._$AH)(t),{values:a,keys:s}=this.dt(e,r,o);if(!Array.isArray(i))return this.ut=s,a;const n=this.ut??=[],l=[];let c,d,h=0,p=i.length-1,u=0,g=a.length-1;for(;h<=p&&u<=g;)if(null===i[h])h++;else if(null===i[p])p--;else if(n[h]===s[u])l[u]=jt(i[h],a[u]),h++,u++;else if(n[p]===s[g])l[g]=jt(i[p],a[g]),p--,g--;else if(n[h]===s[g])l[g]=jt(i[h],a[g]),Ut(t,l[g+1],i[h]),h++,g--;else if(n[p]===s[u])l[u]=jt(i[p],a[u]),Ut(t,i[h],i[p]),p--,u++;else if(void 0===c&&(c=We(s,u,g),d=We(n,h,p)),c.has(n[h]))if(c.has(n[p])){const e=d.get(s[u]),r=void 0!==e?i[e]:null;if(null===r){const e=Ut(t,i[h]);jt(e,a[u]),l[u]=e}else l[u]=jt(r,a[u]),Ut(t,i[h],r),i[e]=null;u++}else Wt(i[p]),p--;else Wt(i[h]),h++;for(;u<=g;){const e=Ut(t,l[g+1]);jt(e,a[u]),l[u++]=e}for(;h<=p;){const t=i[h++];null!==t&&Wt(t)}return this.ut=s,((t,e=Bt)=>{t._$AH=e})(t,l),Y}});var Ve=function(t,e,r,o){var i,a=arguments.length,s=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,r,s):i(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};const Ze=W`<svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 256 256"
>
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
</svg>`;let Xe=class extends nt{shouldDisplayOptions(t){t?(this.optionsListElement.style.display="block",setTimeout(this.optionsListElement.focus.bind(this.optionsListElement),0)):this.optionsListElement.style.display="none",this.isOpen=t,this.ariaExpanded=t?"true":"false"}onClickOutside(t){"undefined"!=typeof document&&t.target!==this&&(this.shouldDisplayOptions(!1),document.removeEventListener("click",this.onClickOutside))}onClickInside(t){"undefined"!=typeof document&&(this.isOpen?document.removeEventListener("click",this.onClickOutside):document.addEventListener("click",this.onClickOutside),this.shouldDisplayOptions(!this.isOpen))}onKeyDown(t){const{code:e}=t;this.disabled||"Space"!==e&&"Enter"!==e||(t.preventDefault(),this.onClickInside())}renderOption(t,e){return W`<li
            class="option"
            tabindex="0"
            @click=${()=>{this.value=e}}
        >
            ${t}
        </li>`}connectedCallback(){super.connectedCallback(),this.onClickOutside=this.onClickOutside.bind(this),this.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.onKeyDown)}constructor(){super(),this.ariaExpanded="false",this.placeholder="",this.value="",this.options=[],this.disabled=!1,this.isOpen=!1,this.onKeyDown=this.onKeyDown.bind(this)}render(){const t=this.value.length>0?W`<div class="flex-1 ">${this.value}</div>`:W`<div class="flex-1 opacity-50">${this.placeholder}</div>`;return W`
            <div id="container" aria-haspopup="listbox" tabindex="0" @click=${this.onClickInside} role="listbox">
                ${t} ${Ze}

                <ul id="options-list" aria-owns="container" role="menu">
                    ${Ye(this.options,(({label:t})=>t),(({label:t,value:e})=>this.renderOption(t,e)))}
                </ul>
            </div>
        `}};Xe.styles=[Ie,wt,s`
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

            #container:focus-within {
                outline: 1px solid var(--astra-accent, lime);
                outline-offset: -1px; // 0px draws it _outside_ of the border, where as this covers the border
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

            li {
                list-style-type: none;
            }

            ul {
                margin-block-start: 0px;
                margin-block-end: 0px;
                padding-inline-start: 0px;
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
        `],Ve([pt({attribute:"aria-expanded",reflect:!0})],Xe.prototype,"ariaExpanded",void 0),Ve([pt({attribute:"placeholder"})],Xe.prototype,"placeholder",void 0),Ve([pt({attribute:"value"})],Xe.prototype,"value",void 0),Ve([pt({attribute:"options",type:Array})],Xe.prototype,"options",void 0),Ve([pt({attribute:"disabled",type:Boolean})],Xe.prototype,"disabled",void 0),Ve([ut()],Xe.prototype,"isOpen",void 0),Ve([function(t,e){return(r,o,i)=>{const a=e=>e.renderRoot?.querySelector(t)??null;if(e){const{get:t,set:e}="object"==typeof o?r:i??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return gt(r,o,{get(){let r=t.call(this);return void 0===r&&(r=a(this),(null!==r||this.hasUpdated)&&e.call(this,r)),r}})}return gt(r,o,{get(){return a(this)}})}}("#options-list")],Xe.prototype,"optionsListElement",void 0),Xe=Ve([ct("astra-select")],Xe);var qe=Xe;return t.AstraButton=kt,t.AstraCard=_t,t.AstraInput=zt,t.AstraLabel=Tt,t.AstraScrollArea=Be,t.AstraSelect=qe,t}({});
