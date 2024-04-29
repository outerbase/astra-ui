var Astra=function(t){"use strict";
/**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const e=globalThis,r=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;let s=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(r&&void 0===t){const r=void 0!==e&&1===e.length;r&&(t=i.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&i.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const r=1===t.length?t[0]:e.reduce(((e,r,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[o+1]),t[0]);return new s(r,t,o)},a=r?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,o))(e)})(t):t
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,g=globalThis,b=g.trustedTypes,v=b?b.emptyScript:"",f=g.reactiveElementPolyfillSupport,m=(t,e)=>t,w={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},y=(t,e)=>!l(t,e),k={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;class x extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=k){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),o=this.getPropertyDescriptor(t,r,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,r){const{get:o,set:i}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return o?.call(this)},set(e){const s=o?.call(this);i.call(this,e),this.requestUpdate(t,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??k}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const r of e)this.createProperty(r,t[r])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const r=this._$Eu(t,e);void 0!==r&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(r)t.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const r of o){const o=document.createElement("style"),i=e.litNonce;void 0!==i&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(void 0!==o&&!0===r.reflect){const i=(void 0!==r.converter?.toAttribute?r.converter:w).toAttribute(e,r.type);this._$Em=t,null==i?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){const r=this.constructor,o=r._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=r.getPropertyOptions(o),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:w;this._$Em=o,this[o]=i.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,r){if(void 0!==t){if(r??=this.constructor.getPropertyOptions(t),!(r.hasChanged??y)(this[t],e))return;this.P(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),!0===r.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,r]of t)!0!==r.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],r)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[m("elementProperties")]=new Map,x[m("finalized")]=new Map,f?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.0.4");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const $=globalThis,_=$.trustedTypes,E=_?_.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${(Math.random()+"").slice(9)}$`,A="?"+C,R=`<${A}>`,O=document,P=()=>O.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,D=Array.isArray,z=t=>D(t)||"function"==typeof t?.[Symbol.iterator],j="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,L=/>/g,U=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,H=/"/g,B=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...r)=>({_$litType$:t,strings:e,values:r}))(1),W=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),q=new WeakMap,K=O.createTreeWalker(O,129);function Y(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Z=(t,e)=>{const r=t.length-1,o=[];let i,s=2===e?"<svg>":"",n=I;for(let e=0;e<r;e++){const r=t[e];let a,l,c=-1,d=0;for(;d<r.length&&(n.lastIndex=d,l=n.exec(r),null!==l);)d=n.lastIndex,n===I?"!--"===l[1]?n=M:void 0!==l[1]?n=L:void 0!==l[2]?(B.test(l[2])&&(i=RegExp("</"+l[2],"g")),n=U):void 0!==l[3]&&(n=U):n===U?">"===l[0]?(n=i??I,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?U:'"'===l[3]?H:N):n===H||n===N?n=U:n===M||n===L?n=I:(n=U,i=void 0);const h=n===U&&t[e+1].startsWith("/>")?" ":"";s+=n===I?r+R:c>=0?(o.push(a),r.slice(0,c)+S+r.slice(c)+C+h):r+C+(-2===c?e:h)}return[Y(t,s+(t[r]||"<?>")+(2===e?"</svg>":"")),o]};class X{constructor({strings:t,_$litType$:e},r){let o;this.parts=[];let i=0,s=0;const n=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=X.createElement(l,r),K.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=K.nextNode())&&a.length<n;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(S)){const e=c[s++],r=o.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:i,name:n[2],strings:r,ctor:"."===n[1]?et:"?"===n[1]?rt:"@"===n[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:i}),o.removeAttribute(t));if(B.test(o.tagName)){const t=o.textContent.split(C),e=t.length-1;if(e>0){o.textContent=_?_.emptyScript:"";for(let r=0;r<e;r++)o.append(t[r],P()),K.nextNode(),a.push({type:2,index:++i});o.append(t[e],P())}}}else if(8===o.nodeType)if(o.data===A)a.push({type:2,index:i});else{let t=-1;for(;-1!==(t=o.data.indexOf(C,t+1));)a.push({type:7,index:i}),t+=C.length-1}i++}}static createElement(t,e){const r=O.createElement("template");return r.innerHTML=t,r}}function G(t,e,r=t,o){if(e===W)return e;let i=void 0!==o?r._$Co?.[o]:r._$Cl;const s=T(e)?void 0:e._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),void 0===s?i=void 0:(i=new s(t),i._$AT(t,r,o)),void 0!==o?(r._$Co??=[])[o]=i:r._$Cl=i),void 0!==i&&(e=G(t,i._$AS(t,e.values),i,o)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,o=(t?.creationScope??O).importNode(e,!0);K.currentNode=o;let i=K.nextNode(),s=0,n=0,a=r[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new Q(i,i.nextSibling,this,t):1===a.type?e=new a.ctor(i,a.name,a.strings,this,t):6===a.type&&(e=new it(i,this,t)),this._$AV.push(e),a=r[++n]}s!==a?.index&&(i=K.nextNode(),s++)}return K.currentNode=O,o}p(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,o){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),T(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):z(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==F&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,o="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=X.createElement(Y(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new J(o,this),r=t.u(this.options);t.p(e),this.T(r),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new X(t)),e}k(t){D(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,o=0;for(const i of t)o===e.length?e.push(r=new Q(this.S(P()),this.S(P()),this,this.options)):r=e[o],r._$AI(i),o++;o<e.length&&(this._$AR(r&&r._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,o,i){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=F}_$AI(t,e=this,r,o){const i=this.strings;let s=!1;if(void 0===i)t=G(this,t,e,0),s=!T(t)||t!==this._$AH&&t!==W,s&&(this._$AH=t);else{const o=t;let n,a;for(t=i[0],n=0;n<i.length-1;n++)a=G(this,o[r+n],e,n),a===W&&(a=this._$AH[n]),s||=!T(a)||a!==this._$AH[n],a===F?t=F:t!==F&&(t+=(a??"")+i[n+1]),this._$AH[n]=a}s&&!o&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class rt extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class ot extends tt{constructor(t,e,r,o,i){super(t,e,r,o,i),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??F)===W)return;const r=this._$AH,o=t===F&&r!==F||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==F&&(r===F||o);o&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const st={P:S,A:C,C:A,M:1,L:Z,R:J,D:z,V:G,I:Q,H:tt,N:rt,U:ot,B:et,F:it},nt=$.litHtmlPolyfillSupport;nt?.(X,Q),($.litHtmlVersions??=[]).push("3.1.2");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
let at=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{const o=r?.renderBefore??e;let i=o._$litPart$;if(void 0===i){const t=r?.renderBefore??null;o._$litPart$=i=new Q(e.insertBefore(P(),t),t,void 0,r??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};at._$litElement$=!0,at.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:at});const lt=globalThis.litElementPolyfillSupport;lt?.({LitElement:at}),(globalThis.litElementVersions??=[]).push("4.0.4");
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
   */,dt={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:y},ht=(t=dt,e,r)=>{const{kind:o,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),s.set(r.name,t),"accessor"===o){const{name:o}=r;return{set(r){const i=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,i,t)},init(e){return void 0!==e&&this.P(o,void 0,t),e}}}if("setter"===o){const{name:o}=r;return function(r){const i=this[o];e.call(this,r),this.requestUpdate(o,i,t)}}throw Error("Unsupported decorator location: "+o)};function ut(t){return(e,r)=>"object"==typeof r?ht(t,e,r):((t,e,r)=>{const o=e.hasOwnProperty(r);return e.constructor.createProperty(r,o?{...t,wrapped:!0}:t),o?Object.getOwnPropertyDescriptor(e,r):void 0})(t,e,r)
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */}function pt(t){return ut({...t,state:!0,attribute:!1})}
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const gt=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,r),r)
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */;var bt,vt,ft,mt=n`
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
`,wt=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};!function(t){t.primary="primary",t.secondary="secondary",t.transparent="transparent"}(bt||(bt={})),function(t){t.base="base",t.small="small",t.compact="compact"}(vt||(vt={})),function(t){t.default="default",t.square="square",t.circle="circle"}(ft||(ft={}));let yt=class extends at{constructor(){super(),this.disabled=!1,this.size=vt.base,this.shape=ft.default,this.variant=bt.primary,this.onKeyDown=this.onKeyDown.bind(this)}onKeyDown(t){const{code:e}=t;this.disabled||"Space"!==e&&"Enter"!==e||(t.preventDefault(),this.click())}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.onKeyDown)}render(){return V`
      <button tabindex="0" class="${`variant-${this.variant} size-${this.size} shape-${this.shape}`}" ?disabled="${this.disabled}">
        <slot></slot>
      </button>
    `}};yt.styles=[mt,n`
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
    `],wt([ut({type:Boolean,reflect:!0})],yt.prototype,"disabled",void 0),wt([ut({type:String})],yt.prototype,"size",void 0),wt([ut({type:String})],yt.prototype,"shape",void 0),wt([ut({type:String})],yt.prototype,"variant",void 0),yt=wt([ct("astra-button")],yt);var kt,xt=yt,$t=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};!function(t){t.base="base",t.small="small",t.compact="compact"}(kt||(kt={}));let _t=class extends at{constructor(){super(...arguments),this.size=kt.base}render(){return V`
      <section class="size-${this.size}">
        <slot></slot>
      </section>
    `}};_t.styles=[mt,n`
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
    `],$t([ut({type:String})],_t.prototype,"size",void 0),_t=$t([ct("astra-card")],_t);var Et=_t,St=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let Ct=class extends at{constructor(){super(...arguments),this.placeholder="",this.value=""}onInput(t){this.value=t.target.value}render(){const t=this.label?V`<label id="input-label" for="input">${this.label}</label>`:void 0;return V`
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
    `}};Ct.styles=[mt,n`
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
    `],St([ut({type:String})],Ct.prototype,"placeholder",void 0),St([ut({type:String})],Ct.prototype,"value",void 0),St([ut({type:String})],Ct.prototype,"label",void 0),Ct=St([ct("astra-input")],Ct);var At,Rt=Ct,Ot=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};!function(t){t.unspecified="",t.label="label",t.h1="h1",t.h2="h2",t.h3="h3",t.h4="h4"}(At||(At={}));let Pt=class extends at{constructor(){super(...arguments),this.variant=At.unspecified}render(){return V`<label class=${this.variant}><slot></slot></label>`}};Pt.styles=[mt,n`
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
    `],Ot([ut({attribute:"variant"})],Pt.prototype,"variant",void 0),Pt=Ot([ct("astra-label")],Pt);var Tt=Pt;
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const Dt=1,zt=2,jt=t=>(...e)=>({_$litDirective$:t,values:e});let It=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const Mt=jt(class extends It{constructor(t){if(super(t),t.type!==Dt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const r=t.element.classList;for(const t of this.st)t in e||(r.remove(t),this.st.delete(t));for(const t in e){const o=!!e[t];o===this.st.has(t)||this.nt?.has(t)||(o?(r.add(t),this.st.add(t)):(r.remove(t),this.st.delete(t)))}return W}}),{I:Lt}=st,Ut=()=>document.createComment(""),Nt=(t,e,r)=>{const o=t._$AA.parentNode,i=void 0===e?t._$AB:e._$AA;if(void 0===r){const e=o.insertBefore(Ut(),i),s=o.insertBefore(Ut(),i);r=new Lt(e,s,t,t.options)}else{const e=r._$AB.nextSibling,s=r._$AM,n=s!==t;if(n){let e;r._$AQ?.(t),r._$AM=t,void 0!==r._$AP&&(e=t._$AU)!==s._$AU&&r._$AP(e)}if(e!==i||n){let t=r._$AA;for(;t!==e;){const e=t.nextSibling;o.insertBefore(t,i),t=e}}}return r},Ht=(t,e,r=t)=>(t._$AI(e,r),t),Bt={},Vt=t=>{t._$AP?.(!1,!0);let e=t._$AA;const r=t._$AB.nextSibling;for(;e!==r;){const t=e.nextSibling;e.remove(),e=t}},Wt=(t,e)=>{const r=t._$AN;if(void 0===r)return!1;for(const t of r)t._$AO?.(e,!1),Wt(t,e);return!0},Ft=t=>{let e,r;do{if(void 0===(e=t._$AM))break;r=e._$AN,r.delete(t),t=e}while(0===r?.size)},qt=t=>{for(let e;e=t._$AM;t=e){let r=e._$AN;if(void 0===r)e._$AN=r=new Set;else if(r.has(t))break;r.add(t),Zt(e)}};
/**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */function Kt(t){void 0!==this._$AN?(Ft(this),this._$AM=t,qt(this)):this._$AM=t}function Yt(t,e=!1,r=0){const o=this._$AH,i=this._$AN;if(void 0!==i&&0!==i.size)if(e)if(Array.isArray(o))for(let t=r;t<o.length;t++)Wt(o[t],!1),Ft(o[t]);else null!=o&&(Wt(o,!1),Ft(o));else Wt(this,t)}const Zt=t=>{t.type==zt&&(t._$AP??=Yt,t._$AQ??=Kt)};class Xt extends It{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),qt(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(Wt(this,t),Ft(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}
/**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const Gt=()=>new Jt;class Jt{}const Qt=new WeakMap,te=jt(class extends Xt{render(t){return F}update(t,[e]){const r=e!==this.Y;return r&&void 0!==this.Y&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.Y=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),F}rt(t){if("function"==typeof this.Y){const e=this.ht??globalThis;let r=Qt.get(e);void 0===r&&(r=new WeakMap,Qt.set(e,r)),void 0!==r.get(this.Y)&&this.Y.call(this.ht,void 0),r.set(this.Y,t),void 0!==t&&this.Y.call(this.ht,t)}else this.Y.value=t}get lt(){return"function"==typeof this.Y?Qt.get(this.ht??globalThis)?.get(this.Y):this.Y?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),ee="important",re=" !"+ee,oe=jt(class extends It{constructor(t){if(super(t),t.type!==Dt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,r)=>{const o=t[r];return null==o?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`}),"")}update(t,[e]){const{style:r}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?r.removeProperty(t):r[t]=null);for(const t in e){const o=e[t];if(null!=o){this.ft.add(t);const e="string"==typeof o&&o.endsWith(re);t.includes("-")||e?r.setProperty(t,e?o.slice(0,-11):o,e?ee:""):r[t]=o}}return W}});
/**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */var ie="object"==typeof global&&global&&global.Object===Object&&global,se="object"==typeof self&&self&&self.Object===Object&&self,ne=ie||se||Function("return this")(),ae=ne.Symbol,le=Object.prototype,ce=le.hasOwnProperty,de=le.toString,he=ae?ae.toStringTag:void 0;var ue=Object.prototype.toString;var pe="[object Null]",ge="[object Undefined]",be=ae?ae.toStringTag:void 0;function ve(t){return null==t?void 0===t?ge:pe:be&&be in Object(t)?function(t){var e=ce.call(t,he),r=t[he];try{t[he]=void 0;var o=!0}catch(t){}var i=de.call(t);return o&&(e?t[he]=r:delete t[he]),i}(t):function(t){return ue.call(t)}(t)}function fe(t){return null!=t&&"object"==typeof t}var me="[object Symbol]";var we=Array.isArray,ye=/\s/;var ke=/^\s+/;function xe(t){return t?t.slice(0,function(t){for(var e=t.length;e--&&ye.test(t.charAt(e)););return e}(t)+1).replace(ke,""):t}function $e(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}var _e=NaN,Ee=/^[-+]0x[0-9a-f]+$/i,Se=/^0b[01]+$/i,Ce=/^0o[0-7]+$/i,Ae=parseInt;function Re(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||fe(t)&&ve(t)==me}(t))return _e;if($e(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=$e(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=xe(t);var r=Se.test(t);return r||Ce.test(t)?Ae(t.slice(2),r?2:8):Ee.test(t)?_e:+t}var Oe="[object AsyncFunction]",Pe="[object Function]",Te="[object GeneratorFunction]",De="[object Proxy]";function ze(t){if(!$e(t))return!1;var e=ve(t);return e==Pe||e==Te||e==Oe||e==De}var je,Ie=ne["__core-js_shared__"],Me=(je=/[^.]+$/.exec(Ie&&Ie.keys&&Ie.keys.IE_PROTO||""))?"Symbol(src)_1."+je:"";var Le=Function.prototype.toString;function Ue(t){if(null!=t){try{return Le.call(t)}catch(t){}try{return t+""}catch(t){}}return""}var Ne=/^\[object .+?Constructor\]$/,He=Function.prototype,Be=Object.prototype,Ve=He.toString,We=Be.hasOwnProperty,Fe=RegExp("^"+Ve.call(We).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function qe(t){return!(!$e(t)||(e=t,Me&&Me in e))&&(ze(t)?Fe:Ne).test(Ue(t));var e}function Ke(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return qe(r)?r:void 0}var Ye=Ke(ne,"WeakMap"),Ze=9007199254740991,Xe=/^(?:0|[1-9]\d*)$/;function Ge(t,e){var r=typeof t;return!!(e=null==e?Ze:e)&&("number"==r||"symbol"!=r&&Xe.test(t))&&t>-1&&t%1==0&&t<e}function Je(t,e){return t===e||t!=t&&e!=e}var Qe=9007199254740991;function tr(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=Qe}var er=Object.prototype;function rr(t){return fe(t)&&"[object Arguments]"==ve(t)}var or=Object.prototype,ir=or.hasOwnProperty,sr=or.propertyIsEnumerable,nr=rr(function(){return arguments}())?rr:function(t){return fe(t)&&ir.call(t,"callee")&&!sr.call(t,"callee")};var ar="object"==typeof t&&t&&!t.nodeType&&t,lr=ar&&"object"==typeof module&&module&&!module.nodeType&&module,cr=lr&&lr.exports===ar?ne.Buffer:void 0,dr=(cr?cr.isBuffer:void 0)||function(){return!1},hr={};hr["[object Float32Array]"]=hr["[object Float64Array]"]=hr["[object Int8Array]"]=hr["[object Int16Array]"]=hr["[object Int32Array]"]=hr["[object Uint8Array]"]=hr["[object Uint8ClampedArray]"]=hr["[object Uint16Array]"]=hr["[object Uint32Array]"]=!0,hr["[object Arguments]"]=hr["[object Array]"]=hr["[object ArrayBuffer]"]=hr["[object Boolean]"]=hr["[object DataView]"]=hr["[object Date]"]=hr["[object Error]"]=hr["[object Function]"]=hr["[object Map]"]=hr["[object Number]"]=hr["[object Object]"]=hr["[object RegExp]"]=hr["[object Set]"]=hr["[object String]"]=hr["[object WeakMap]"]=!1;var ur,pr="object"==typeof t&&t&&!t.nodeType&&t,gr=pr&&"object"==typeof module&&module&&!module.nodeType&&module,br=gr&&gr.exports===pr&&ie.process,vr=function(){try{var t=gr&&gr.require&&gr.require("util").types;return t||br&&br.binding&&br.binding("util")}catch(t){}}(),fr=vr&&vr.isTypedArray,mr=fr?(ur=fr,function(t){return ur(t)}):function(t){return fe(t)&&tr(t.length)&&!!hr[ve(t)]},wr=Object.prototype.hasOwnProperty;function yr(t,e){var r=we(t),o=!r&&nr(t),i=!r&&!o&&dr(t),s=!r&&!o&&!i&&mr(t),n=r||o||i||s,a=n?function(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}(t.length,String):[],l=a.length;for(var c in t)!e&&!wr.call(t,c)||n&&("length"==c||i&&("offset"==c||"parent"==c)||s&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||Ge(c,l))||a.push(c);return a}var kr=function(t,e){return function(r){return t(e(r))}}(Object.keys,Object),xr=Object.prototype.hasOwnProperty;function $r(t){if(r=(e=t)&&e.constructor,e!==("function"==typeof r&&r.prototype||er))return kr(t);var e,r,o=[];for(var i in Object(t))xr.call(t,i)&&"constructor"!=i&&o.push(i);return o}function _r(t){return null!=(e=t)&&tr(e.length)&&!ze(e)?yr(t):$r(t);var e}var Er=Ke(Object,"create");var Sr=Object.prototype.hasOwnProperty;var Cr=Object.prototype.hasOwnProperty;function Ar(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}function Rr(t,e){for(var r=t.length;r--;)if(Je(t[r][0],e))return r;return-1}Ar.prototype.clear=function(){this.__data__=Er?Er(null):{},this.size=0},Ar.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},Ar.prototype.get=function(t){var e=this.__data__;if(Er){var r=e[t];return"__lodash_hash_undefined__"===r?void 0:r}return Sr.call(e,t)?e[t]:void 0},Ar.prototype.has=function(t){var e=this.__data__;return Er?void 0!==e[t]:Cr.call(e,t)},Ar.prototype.set=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=Er&&void 0===e?"__lodash_hash_undefined__":e,this};var Or=Array.prototype.splice;function Pr(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}Pr.prototype.clear=function(){this.__data__=[],this.size=0},Pr.prototype.delete=function(t){var e=this.__data__,r=Rr(e,t);return!(r<0)&&(r==e.length-1?e.pop():Or.call(e,r,1),--this.size,!0)},Pr.prototype.get=function(t){var e=this.__data__,r=Rr(e,t);return r<0?void 0:e[r][1]},Pr.prototype.has=function(t){return Rr(this.__data__,t)>-1},Pr.prototype.set=function(t,e){var r=this.__data__,o=Rr(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this};var Tr=Ke(ne,"Map");function Dr(t,e){var r,o,i=t.__data__;return("string"==(o=typeof(r=e))||"number"==o||"symbol"==o||"boolean"==o?"__proto__"!==r:null===r)?i["string"==typeof e?"string":"hash"]:i.map}function zr(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}zr.prototype.clear=function(){this.size=0,this.__data__={hash:new Ar,map:new(Tr||Pr),string:new Ar}},zr.prototype.delete=function(t){var e=Dr(this,t).delete(t);return this.size-=e?1:0,e},zr.prototype.get=function(t){return Dr(this,t).get(t)},zr.prototype.has=function(t){return Dr(this,t).has(t)},zr.prototype.set=function(t,e){var r=Dr(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this};function jr(t){var e=this.__data__=new Pr(t);this.size=e.size}jr.prototype.clear=function(){this.__data__=new Pr,this.size=0},jr.prototype.delete=function(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r},jr.prototype.get=function(t){return this.__data__.get(t)},jr.prototype.has=function(t){return this.__data__.has(t)},jr.prototype.set=function(t,e){var r=this.__data__;if(r instanceof Pr){var o=r.__data__;if(!Tr||o.length<199)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new zr(o)}return r.set(t,e),this.size=r.size,this};var Ir=Object.prototype.propertyIsEnumerable,Mr=Object.getOwnPropertySymbols,Lr=Mr?function(t){return null==t?[]:(t=Object(t),function(t,e){for(var r=-1,o=null==t?0:t.length,i=0,s=[];++r<o;){var n=t[r];e(n,r,t)&&(s[i++]=n)}return s}(Mr(t),(function(e){return Ir.call(t,e)})))}:function(){return[]};function Ur(t){return function(t,e,r){var o=e(t);return we(t)?o:function(t,e){for(var r=-1,o=e.length,i=t.length;++r<o;)t[i+r]=e[r];return t}(o,r(t))}(t,_r,Lr)}var Nr=Ke(ne,"DataView"),Hr=Ke(ne,"Promise"),Br=Ke(ne,"Set"),Vr="[object Map]",Wr="[object Promise]",Fr="[object Set]",qr="[object WeakMap]",Kr="[object DataView]",Yr=Ue(Nr),Zr=Ue(Tr),Xr=Ue(Hr),Gr=Ue(Br),Jr=Ue(Ye),Qr=ve;(Nr&&Qr(new Nr(new ArrayBuffer(1)))!=Kr||Tr&&Qr(new Tr)!=Vr||Hr&&Qr(Hr.resolve())!=Wr||Br&&Qr(new Br)!=Fr||Ye&&Qr(new Ye)!=qr)&&(Qr=function(t){var e=ve(t),r="[object Object]"==e?t.constructor:void 0,o=r?Ue(r):"";if(o)switch(o){case Yr:return Kr;case Zr:return Vr;case Xr:return Wr;case Gr:return Fr;case Jr:return qr}return e});var to=Qr,eo=ne.Uint8Array;function ro(t){var e=-1,r=null==t?0:t.length;for(this.__data__=new zr;++e<r;)this.add(t[e])}function oo(t,e){for(var r=-1,o=null==t?0:t.length;++r<o;)if(e(t[r],r,t))return!0;return!1}ro.prototype.add=ro.prototype.push=function(t){return this.__data__.set(t,"__lodash_hash_undefined__"),this},ro.prototype.has=function(t){return this.__data__.has(t)};var io=1,so=2;function no(t,e,r,o,i,s){var n=r&io,a=t.length,l=e.length;if(a!=l&&!(n&&l>a))return!1;var c=s.get(t),d=s.get(e);if(c&&d)return c==e&&d==t;var h=-1,u=!0,p=r&so?new ro:void 0;for(s.set(t,e),s.set(e,t);++h<a;){var g=t[h],b=e[h];if(o)var v=n?o(b,g,h,e,t,s):o(g,b,h,t,e,s);if(void 0!==v){if(v)continue;u=!1;break}if(p){if(!oo(e,(function(t,e){if(n=e,!p.has(n)&&(g===t||i(g,t,r,o,s)))return p.push(e);var n}))){u=!1;break}}else if(g!==b&&!i(g,b,r,o,s)){u=!1;break}}return s.delete(t),s.delete(e),u}function ao(t){var e=-1,r=Array(t.size);return t.forEach((function(t,o){r[++e]=[o,t]})),r}function lo(t){var e=-1,r=Array(t.size);return t.forEach((function(t){r[++e]=t})),r}var co=1,ho=2,uo="[object Boolean]",po="[object Date]",go="[object Error]",bo="[object Map]",vo="[object Number]",fo="[object RegExp]",mo="[object Set]",wo="[object String]",yo="[object Symbol]",ko="[object ArrayBuffer]",xo="[object DataView]",$o=ae?ae.prototype:void 0,_o=$o?$o.valueOf:void 0;var Eo=1,So=Object.prototype.hasOwnProperty;var Co=1,Ao="[object Arguments]",Ro="[object Array]",Oo="[object Object]",Po=Object.prototype.hasOwnProperty;function To(t,e,r,o,i,s){var n=we(t),a=we(e),l=n?Ro:to(t),c=a?Ro:to(e),d=(l=l==Ao?Oo:l)==Oo,h=(c=c==Ao?Oo:c)==Oo,u=l==c;if(u&&dr(t)){if(!dr(e))return!1;n=!0,d=!1}if(u&&!d)return s||(s=new jr),n||mr(t)?no(t,e,r,o,i,s):function(t,e,r,o,i,s,n){switch(r){case xo:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case ko:return!(t.byteLength!=e.byteLength||!s(new eo(t),new eo(e)));case uo:case po:case vo:return Je(+t,+e);case go:return t.name==e.name&&t.message==e.message;case fo:case wo:return t==e+"";case bo:var a=ao;case mo:var l=o&co;if(a||(a=lo),t.size!=e.size&&!l)return!1;var c=n.get(t);if(c)return c==e;o|=ho,n.set(t,e);var d=no(a(t),a(e),o,i,s,n);return n.delete(t),d;case yo:if(_o)return _o.call(t)==_o.call(e)}return!1}(t,e,l,r,o,i,s);if(!(r&Co)){var p=d&&Po.call(t,"__wrapped__"),g=h&&Po.call(e,"__wrapped__");if(p||g){var b=p?t.value():t,v=g?e.value():e;return s||(s=new jr),i(b,v,r,o,s)}}return!!u&&(s||(s=new jr),function(t,e,r,o,i,s){var n=r&Eo,a=Ur(t),l=a.length;if(l!=Ur(e).length&&!n)return!1;for(var c=l;c--;){var d=a[c];if(!(n?d in e:So.call(e,d)))return!1}var h=s.get(t),u=s.get(e);if(h&&u)return h==e&&u==t;var p=!0;s.set(t,e),s.set(e,t);for(var g=n;++c<l;){var b=t[d=a[c]],v=e[d];if(o)var f=n?o(v,b,d,e,t,s):o(b,v,d,t,e,s);if(!(void 0===f?b===v||i(b,v,r,o,s):f)){p=!1;break}g||(g="constructor"==d)}if(p&&!g){var m=t.constructor,w=e.constructor;m==w||!("constructor"in t)||!("constructor"in e)||"function"==typeof m&&m instanceof m&&"function"==typeof w&&w instanceof w||(p=!1)}return s.delete(t),s.delete(e),p}(t,e,r,o,i,s))}function Do(t,e,r,o,i){return t===e||(null==t||null==e||!fe(t)&&!fe(e)?t!=t&&e!=e:To(t,e,r,o,Do,i))}var zo,jo,Io,Mo,Lo,Uo=function(){return ne.Date.now()},No=Math.max,Ho=Math.min;function Bo(t,e,r){var o,i,s,n,a,l,c=0,d=!1,h=!1,u=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function p(e){var r=o,s=i;return o=i=void 0,c=e,n=t.apply(s,r)}function g(t){var r=t-l;return void 0===l||r>=e||r<0||h&&t-c>=s}function b(){var t=Uo();if(g(t))return v(t);a=setTimeout(b,function(t){var r=e-(t-l);return h?Ho(r,s-(t-c)):r}(t))}function v(t){return a=void 0,u&&o?p(t):(o=i=void 0,n)}function f(){var t=Uo(),r=g(t);if(o=arguments,i=this,l=t,r){if(void 0===a)return function(t){return c=t,a=setTimeout(b,e),d?p(t):n}(l);if(h)return clearTimeout(a),a=setTimeout(b,e),p(l)}return void 0===a&&(a=setTimeout(b,e)),n}return e=Re(e)||0,$e(r)&&(d=!!r.leading,s=(h="maxWait"in r)?No(Re(r.maxWait)||0,e):s,u="trailing"in r?!!r.trailing:u),f.cancel=function(){void 0!==a&&clearTimeout(a),c=0,o=l=i=a=void 0},f.flush=function(){return void 0===a?n:v(Uo())},f}class Vo extends Event{constructor(t){super(t,{bubbles:!0,composed:!0})}}class Wo extends Vo{constructor(t){super("cell-updated"),this.detail=t}}class Fo extends Vo{constructor(t,{data:e,name:r}){super(t),this.name=r,this.data=e}}class qo extends Vo{constructor(t,e){super(t),this.plugin=e}}class Ko extends Fo{constructor(t){super("column-added",t)}}class Yo extends Fo{constructor(t){super("column-renamed",t)}}class Zo extends Fo{constructor(t){super("column-removed",t)}}class Xo extends Fo{constructor(t){super("column-hidden",t)}}class Go extends qo{constructor(t,e){super("column-plugin-activated",e),this.column=t}}class Jo extends Vo{constructor(t,e){super("column-plugin-deactivated"),this.column=t,this.installation=e}}class Qo extends Fo{constructor(t){super("column-updated",t)}}class ti extends Vo{constructor(t,e){super(t),this.rows=e}}class ei extends ti{constructor(t){super("row-added",[t])}}class ri extends ti{constructor(t){super("row-removed",t)}}class oi extends ti{constructor(t){super("row-selected",t)}}class ii extends Vo{constructor(t){super("menu-selection"),this.value=t}}class si extends Vo{constructor(t){super("resize-start"),this.name=t}}class ni extends Vo{constructor(t,e){super("resize-end"),this.name=t,this.delta=e}}class ai extends Vo{constructor(t,e){super("resize"),this.name=t,this.delta=e}}class li extends Vo{constructor(t){super("change"),this.value=t}}class ci extends Vo{constructor(t){super("menuopen"),this.close=t}}class di extends Vo{constructor(){super("toggle-check")}}!function(t){t.light="light",t.dark="dark"}(zo||(zo={})),function(t){t.horizontal="horizontal",t.vertical="vertical",t.both="both"}(jo||(jo={})),function(t){t[t.created=0]="created",t[t.updated=1]="updated",t[t.deleted=2]="deleted"}(Io||(Io={})),function(t){t.REAL="REAL",t.INTEGER="INTEGER",t.INT="INT",t.TEXT="TEXT",t.JSON="JSON",t.SMALLINT="SMALLINT",t.BIGINT="BIGINT",t.DECIMAL="DECIMAL",t.NUMERIC="NUMERIC",t.DOUBLE_PRECISION="DOUBLE PRECISION",t.SERIAL="SERIAL",t.BIGSERIAL="BIGSERIAL",t.MONEY="MONEY",t.CHAR="CHAR",t.VARCHAR="VARCHAR",t.BYTEA="BYTEA",t.TIMESTAMP="TIMESTAMP",t.TIMESTAMP_WITH_TIME_ZONE="TIMESTAMP WITH TIME ZONE",t.DATE="DATE",t.DATETIME="DATETIME",t.TIME="TIME",t.TIME_WITH_TIME_ZONE="TIME WITH TIME ZONE",t.INTERVAL="INTERVAL",t.BOOLEAN="BOOLEAN",t.ENUM="ENUM",t.POINT="POINT",t.LINE="LINE",t.LSEG="LSEG",t.BOX="BOX",t.PATH="PATH",t.POLYGON="POLYGON",t.CIRCLE="CIRCLE",t.CIDR="CIDR",t.INET="INET",t.MACADDR="MACADDR",t.MACADDR8="MACADDR8",t.JSONB="JSONB",t.UUID="UUID",t.XML="XML",t.TSVECTOR="TSVECTOR",t.TSQUERY="TSQUERY",t.VARYING="CHARACTER VARYING"}(Mo||(Mo={})),function(t){t.onEdit="onedit",t.onStopEdit="onstopedit",t.onCancelEdit="oncanceledit",t.onSave="onsave",t.updateCell="updatecell",t.updateRow="updaterow",t.createRow="createrow",t.deleteRow="deleterow",t.getNextPage="getnextpage",t.getPreviousPage="getpreviouspage",t.configurePlugin="configure_plugin",t.installPlugin="install_plugin",t.ephemeralPluginInstall="ephemeral_install_plugin",t.uninstallPlugin="uninstall_plugin",t.sortColumn="sort_column",t.hideColumn="hide_column",t.deleteColumn="delete_column",t.createColumn="create_column",t.updateColumn="update_column",t.createIndex="create_index",t.updateIndex="update_index",t.deleteIndex="delete_index",t.pageNext="page_next",t.cellValue="cellvalue"}(Lo||(Lo={}));const hi=n` /* THIS FILE IS GENERATED; DO NOT EDIT. */ /* this file yields the Tailwind classes that are used in the codebase */

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
 `;function ui(t){return Object.entries(t).map((([t,e])=>!!e&&t)).filter(Boolean).join(" ")}var pi=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};class gi extends at{constructor(){super(...arguments),this.theme=zo.light,this._class=this.theme}classMap(){return{dark:this.theme==zo.dark}}willUpdate(t){super.willUpdate(t),this._class=ui(this.classMap())}render(){return V`<slot></slot>`}}gi.styles=[hi],pi([ut({attribute:"theme",type:String})],gi.prototype,"theme",void 0),pi([ut({reflect:!0,attribute:"class",type:String})],gi.prototype,"_class",void 0);var bi=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let vi=class extends gi{constructor(){super(),this.threshold=0,this.scroller=Gt(),this.rightScrollZone=Gt(),this.rightScrollHandle=Gt(),this.bottomScrollZone=Gt(),this.bottomScrollHandle=Gt(),this.hasHoveringCursor=!1,this.axis=jo.both,this.isDragging=!1,this.verticalScrollPosition=0,this.horizontalScrollPosition=0,this.verticalScrollSize=0,this.horizontalScrollSize=0,this.horizontalScrollProgress=0,this.verticalScrollProgress=0,this.startX=0,this.startY=0,this.scrollStartX=0,this.scrollStartY=0,this._onScroll=this._onScroll?Bo(this._onScroll,10).bind(this):this._onScroll.bind(this),this.updateScrollerSizeAndPosition=this.updateScrollerSizeAndPosition.bind(this),this.onWheelVerticalScroller=this.onWheelVerticalScroller.bind(this),this.onWheelHorizontalScroller=this.onWheelHorizontalScroller.bind(this),this.onHorizontalScrollerHandleMouseDown=this.onHorizontalScrollerHandleMouseDown.bind(this),this.onVerticalScrollerHandleMouseDown=this.onVerticalScrollerHandleMouseDown.bind(this)}updateScrollerSizeAndPosition(t){if([jo.both,jo.vertical].includes(this.axis)){const t=this.scroller.value?.scrollTop??0,e=this.scroller.value?.scrollHeight??0,r=(this.scroller.value?.clientHeight??0)/e;this.verticalScrollSize=1===r?0:(this.scroller.value?.clientHeight??0)*r,this.verticalScrollProgress=t/e,this.verticalScrollPosition=this.verticalScrollProgress*(this.scroller.value?.clientHeight??0)}if([jo.both,jo.horizontal].includes(this.axis)){const t=this.scroller.value?.scrollWidth??0,e=this.scroller.value?.scrollLeft??0,r=(this.scroller.value?.clientWidth??0)/t,o=1===r?0:(this.scroller.value?.clientWidth??0)*r;this.horizontalScrollProgress=e/t,this.horizontalScrollSize=o,this.horizontalScrollPosition=this.horizontalScrollProgress*(this.scroller.value?.clientWidth??0)}}_onScroll(t){const e=this.previousScrollPosition??0,r=this.scroller.value?.scrollTop??0;Math.abs(e-r)>this.threshold&&(this.previousScrollPosition=r,"function"==typeof this.onScroll&&this.onScroll())}onClickVerticalScroller(t){if(this.scroller.value){const e=(t.clientY-this.getBoundingClientRect().top)/this.scroller.value?.clientHeight;this.scroller.value.scrollTop=e*(this.scroller.value?.scrollHeight??0)-this.verticalScrollSize}}onClickHorizontalScroller(t){if(this.scroller.value){const e=(t.clientX-this.getBoundingClientRect().left)/this.scroller.value?.clientWidth;this.scroller.value.scrollLeft=e*(this.scroller.value?.scrollWidth??0)-this.horizontalScrollSize}}onWheelHorizontalScroller(t){this.scroller.value&&(this.scroller.value.scrollLeft+=t.deltaX)}onWheelVerticalScroller(t){this.scroller.value&&(this.scroller.value.scrollTop+=t.deltaY)}onHorizontalScrollerHandleMouseDown(t){t.preventDefault(),this.startX=t.pageX,this.scrollStartX=this.scroller.value?.scrollLeft??0;const e=t=>{const e=t.pageX-this.startX,r=this.scroller.value?.scrollWidth??0,o=(this.scroller.value?.clientWidth??0)/r;this.scroller.value&&(this.scroller.value.scrollLeft=this.scrollStartX+e/o)},r=t=>{document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",r)};document.addEventListener("mouseup",r),document.addEventListener("mousemove",e)}preventDefault(t){t.preventDefault()}onVerticalScrollerHandleMouseDown(t){t.preventDefault(),this.startY=t.pageY,this.scrollStartY=this.scroller.value?.scrollTop??0;const e=t=>{t.preventDefault();const e=t.pageY-this.startY,r=this.scroller.value?.scrollHeight??0,o=(this.scroller.value?.clientHeight??0)/r;this.scroller.value&&(this.scroller.value.scrollTop=this.scrollStartY+e/o)},r=t=>{document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",r)};document.addEventListener("mouseup",r),document.addEventListener("mousemove",e)}connectedCallback(){super.connectedCallback(),setTimeout((()=>{this.scroller.value?.addEventListener("scroll",this.updateScrollerSizeAndPosition,{passive:!0}),this.scroller.value?.addEventListener("scroll",this._onScroll,{passive:!0}),this.scroller.value?.addEventListener("scrollend",this._onScroll,{passive:!0}),this.rightScrollZone.value?.addEventListener("wheel",this.onWheelVerticalScroller,{passive:!0}),this.bottomScrollZone.value?.addEventListener("wheel",this.onWheelHorizontalScroller,{passive:!0}),this.bottomScrollHandle.value?.addEventListener("mousedown",this.onHorizontalScrollerHandleMouseDown),this.rightScrollHandle.value?.addEventListener("mousedown",this.onVerticalScrollerHandleMouseDown),this.rightScrollZone.value?.addEventListener("contextmenu",this.preventDefault),this.bottomScrollZone.value?.addEventListener("contextmenu",this.preventDefault),this.bottomScrollHandle.value?.addEventListener("contextmenu",this.preventDefault),this.rightScrollHandle.value?.addEventListener("contextmenu",this.preventDefault)}),0)}disconnectedCallback(){super.disconnectedCallback(),this.scroller.value?.removeEventListener("scroll",this.updateScrollerSizeAndPosition),this.scroller.value?.removeEventListener("scroll",this._onScroll),this.scroller.value?.removeEventListener("scrollend",this._onScroll),this.rightScrollZone.value?.removeEventListener("wheel",this.onWheelVerticalScroller),this.bottomScrollZone.value?.removeEventListener("wheel",this.onWheelHorizontalScroller),this.bottomScrollHandle.value?.removeEventListener("mousedown",this.onHorizontalScrollerHandleMouseDown),this.rightScrollHandle.value?.removeEventListener("mousedown",this.onVerticalScrollerHandleMouseDown),this.rightScrollZone.value?.removeEventListener("contextmenu",this.preventDefault),this.bottomScrollZone.value?.removeEventListener("contextmenu",this.preventDefault),this.bottomScrollHandle.value?.removeEventListener("contextmenu",this.preventDefault),this.rightScrollHandle.value?.removeEventListener("contextmenu",this.preventDefault)}willUpdate(t){super.willUpdate(t),t.has("theme")&&this.requestUpdate("class"),t.has("hasHoveringCursor")&&this.hasHoveringCursor&&this.updateScrollerSizeAndPosition()}render(){const t={"w-full rounded-md":!0,"bg-neutral-200/60 dark:bg-neutral-700/50":!0,"hover:bg-neutral-300 dark:hover:bg-neutral-700":!0,"active:bg-neutral-300 dark:active:bg-neutral-700":!0},e={"z-50 absolute right-0 bottom-0 m-0.5":!0,"transition-opacity duration-300":!0,"opacity-0":!this.hasHoveringCursor,"opacity-100":this.hasHoveringCursor},r={transform:`translateY(${this.verticalScrollPosition}px)`,height:`${this.verticalScrollSize}px`},o={transform:`translateX(${this.horizontalScrollPosition}px)`,width:`${this.horizontalScrollSize}px`},i={"absolute bottom-0 left-0 right-0 top-0":!0,"overflow-scroll":this.axis===jo.both,"overflow-x-scroll overflow-y-hidden":this.axis===jo.horizontal,"overflow-y-scroll overflow-x-hidden":this.axis===jo.vertical};return V`<!-- this comment exists to force the next line onto the next line -->
      <div
        @mouseleave=${()=>{this.pendingMouseLeave=setTimeout((()=>{this.hasHoveringCursor=!1,delete this.pendingMouseLeave}),1e3)}}
        @mouseenter=${()=>{this.hasHoveringCursor=!0,clearTimeout(this.pendingMouseLeave),delete this.pendingMouseLeave}}
        class=${Mt({dark:this.theme==zo.dark})}
      >
        <div
          class=${Mt({...e,"top-0 w-1.5":!0})}
          ${te(this.rightScrollZone)}
          @click=${this.onClickVerticalScroller}
        >
          <div style=${oe(r)} class=${Mt(t)} ${te(this.rightScrollHandle)}></div>
        </div>

        <div
          class=${Mt({...e,"left-0":!0})}
          ${te(this.bottomScrollZone)}
          @click=${this.onClickHorizontalScroller}
        >
          <div
            style=${oe(o)}
            class=${Mt({...t,"h-1.5":!0})}
            ${te(this.bottomScrollHandle)}
          ></div>
        </div>

        <div class=${Mt(i)} ${te(this.scroller)}>
          <slot></slot>
        </div>
      </div>`}};vi.styles=[...gi.styles,n`
      /* Hide scrollbar for Chrome, Safari and Opera */
      ::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
      }

      /* Hide scrollbar for IE, Edge, and Firefox */
      :host {
        -ms-overflow-style: none; /* for Internet Explorer and Edge */
        scrollbar-width: none; /* for Firefox */
      }
    `],bi([ut()],vi.prototype,"onScroll",void 0),bi([ut({type:Number})],vi.prototype,"threshold",void 0),bi([ut()],vi.prototype,"scroller",void 0),bi([ut()],vi.prototype,"rightScrollZone",void 0),bi([ut()],vi.prototype,"rightScrollHandle",void 0),bi([ut()],vi.prototype,"bottomScrollZone",void 0),bi([ut()],vi.prototype,"bottomScrollHandle",void 0),bi([ut()],vi.prototype,"hasHoveringCursor",void 0),bi([ut()],vi.prototype,"axis",void 0),bi([pt()],vi.prototype,"isDragging",void 0),bi([pt()],vi.prototype,"verticalScrollPosition",void 0),bi([pt()],vi.prototype,"horizontalScrollPosition",void 0),bi([pt()],vi.prototype,"verticalScrollSize",void 0),bi([pt()],vi.prototype,"horizontalScrollSize",void 0),vi=bi([ct("astra-scroll-area")],vi);var fi=vi;
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const mi=(t,e,r)=>{const o=new Map;for(let i=e;i<=r;i++)o.set(t[i],i);return o},wi=jt(class extends It{constructor(t){if(super(t),t.type!==zt)throw Error("repeat() can only be used in text expressions")}dt(t,e,r){let o;void 0===r?r=e:void 0!==e&&(o=e);const i=[],s=[];let n=0;for(const e of t)i[n]=o?o(e,n):n,s[n]=r(e,n),n++;return{values:s,keys:i}}render(t,e,r){return this.dt(t,e,r).values}update(t,[e,r,o]){const i=(t=>t._$AH)(t),{values:s,keys:n}=this.dt(e,r,o);if(!Array.isArray(i))return this.ut=n,s;const a=this.ut??=[],l=[];let c,d,h=0,u=i.length-1,p=0,g=s.length-1;for(;h<=u&&p<=g;)if(null===i[h])h++;else if(null===i[u])u--;else if(a[h]===n[p])l[p]=Ht(i[h],s[p]),h++,p++;else if(a[u]===n[g])l[g]=Ht(i[u],s[g]),u--,g--;else if(a[h]===n[g])l[g]=Ht(i[h],s[g]),Nt(t,l[g+1],i[h]),h++,g--;else if(a[u]===n[p])l[p]=Ht(i[u],s[p]),Nt(t,i[h],i[u]),u--,p++;else if(void 0===c&&(c=mi(n,p,g),d=mi(a,h,u)),c.has(a[h]))if(c.has(a[u])){const e=d.get(n[p]),r=void 0!==e?i[e]:null;if(null===r){const e=Nt(t,i[h]);Ht(e,s[p]),l[p]=e}else l[p]=Ht(r,s[p]),Nt(t,i[h],r),i[e]=null;p++}else Vt(i[u]),u--;else Vt(i[h]),h++;for(;p<=g;){const e=Nt(t,l[g+1]);Ht(e,s[p]),l[p++]=e}for(;h<=u;){const t=i[h++];null!==t&&Vt(t)}return this.ut=n,((t,e=Bt)=>{t._$AH=e})(t,l),W}});var yi=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};const ki=V`<svg
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  fill="currentColor"
  viewBox="0 0 256 256"
>
  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
</svg>`;let xi=class extends at{shouldDisplayOptions(t){t?(this.optionsListElement.style.display="block",setTimeout(this.optionsListElement.focus.bind(this.optionsListElement),0)):this.optionsListElement.style.display="none",this.isOpen=t,this.ariaExpanded=t?"true":"false"}onClickOutside(t){"undefined"!=typeof document&&t.target!==this&&(this.shouldDisplayOptions(!1),document.removeEventListener("click",this.onClickOutside))}onClickInside(t){"undefined"!=typeof document&&(this.isOpen?document.removeEventListener("click",this.onClickOutside):document.addEventListener("click",this.onClickOutside),this.shouldDisplayOptions(!this.isOpen))}onKeyDown(t){const{code:e}=t;this.disabled||"Space"!==e&&"Enter"!==e||(t.preventDefault(),this.onClickInside())}renderOption(t,e){return V`<li
      class="option"
      tabindex="0"
      @click=${()=>{this.value=e}}
    >
      ${t}
    </li>`}connectedCallback(){super.connectedCallback(),this.onClickOutside=this.onClickOutside.bind(this),this.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.onKeyDown)}constructor(){super(),this.ariaExpanded="false",this.placeholder="",this.value="",this.options=[],this.disabled=!1,this.isOpen=!1,this.onKeyDown=this.onKeyDown.bind(this)}render(){const t=this.value.length>0?V`<div class="flex-1 ">${this.value}</div>`:V`<div class="flex-1 opacity-50">${this.placeholder}</div>`;return V`
      <div id="container" aria-haspopup="listbox" tabindex="0" @click=${this.onClickInside} role="listbox">
        ${t} ${ki}

        <ul id="options-list" aria-owns="container" role="menu">
          ${wi(this.options,(({label:t})=>t),(({label:t,value:e})=>this.renderOption(t,e)))}
        </ul>
      </div>
    `}};xi.styles=[hi,mt,n`
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
    `],yi([ut({attribute:"aria-expanded",reflect:!0})],xi.prototype,"ariaExpanded",void 0),yi([ut({attribute:"placeholder"})],xi.prototype,"placeholder",void 0),yi([ut({attribute:"value"})],xi.prototype,"value",void 0),yi([ut({attribute:"options",type:Array})],xi.prototype,"options",void 0),yi([ut({attribute:"disabled",type:Boolean})],xi.prototype,"disabled",void 0),yi([pt()],xi.prototype,"isOpen",void 0),yi([function(t,e){return(r,o,i)=>{const s=e=>e.renderRoot?.querySelector(t)??null;if(e){const{get:t,set:e}="object"==typeof o?r:i??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return gt(r,o,{get(){let r=t.call(this);return void 0===r&&(r=s(this),(null!==r||this.hasUpdated)&&e.call(this,r)),r}})}return gt(r,o,{get(){return s(this)}})}}("#options-list")],xi.prototype,"optionsListElement",void 0),xi=yi([ct("astra-select")],xi);var $i=xi;
/**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const _i=t=>t??F;var Ei,Si=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let Ci=Ei=class extends at{constructor(){super(...arguments),this.checked=!1,this.theme=zo.light,this.tabIndex=0,this._class="focus:shadow-ringlet dark:focus:shadow-ringlet-dark focus:rounded-md focus:ring-1 focus:ring-black dark:focus:ring-neutral-300 focus:outline-none"}toggleCheckbox(t){t.preventDefault(),this.checked=!this.checked,this.dispatchEvent(new di)}onKeyDown(t){const{code:e}=t;"Enter"!==e&&"Space"!==e||this.toggleCheckbox(t)}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.onKeyDown)}render(){const t=Mt({"flex items-center cursor-pointer":!0,dark:this.theme==zo.dark});return V`
      <div class=${t} @click="${this.toggleCheckbox}">
        ${this.checked?Ei.checkedTemplate:Ei.uncheckedTemplate}
        <input type="checkbox" ?checked="${this.checked}" @change="${this.toggleCheckbox}" class="hidden" />
      </div>
    `}};var Ai;Ci.styles=hi,Ci.checkedTemplate=V`<span
    class="bg-black dark:bg-white text-white dark:text-black flex items-center justify-center w-4 h-4 p-0.5 rounded-md"
    >${Ai=16,V`<svg xmlns="http://www.w3.org/2000/svg" width="${Ai}" height="${Ai}" fill="currentColor" viewBox="0 0 256 256">
    <rect width="256" height="256" fill="none" />
    <polyline
      points="40 144 96 200 224 72"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    />
  </svg>`}</span
  >`,Ci.uncheckedTemplate=V`<span class="w-4 h-4 border border-neutral-500 rounded-md"></span>`,Si([ut({type:Boolean})],Ci.prototype,"checked",void 0),Si([ut({type:String})],Ci.prototype,"theme",void 0),Si([ut({attribute:"class",type:String,reflect:!0})],Ci.prototype,"_class",void 0),Ci=Ei=Si([ct("check-box")],Ci);const Ri=t=>V`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" fill="currentColor" viewBox="0 0 256 256">
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
  </svg>`;var Oi=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};class Pi extends gi{constructor(){super(...arguments),this.open=!1,this.options=[],this.withoutPadding=!1,this.activeOptions=[],this.historyStack=[],this.close=()=>this.open=!1}classMap(){return{"flex items-center justify-between gap-2":!this.withoutPadding,"font-medium select-none whitespace-nowrap":!0,...super.classMap()}}get menuPositionClasses(){return""}get listElement(){if(!this.open)return null;const t={[this.menuPositionClasses]:!0,"absolute z-[2] overflow-hidden":!0,"rounded-xl p-1.5":!0,"text-sm text-neutral-900 dark:text-white font-medium":!0,"bg-white dark:bg-neutral-900":!0,"shadow-lg shadow-black/5":!0,"border border-neutral-200 dark:border-neutral-800":!0};return V`<ul class=${Mt(t)} role="menu">
      ${wi(this.activeOptions,(({label:t})=>t),(({label:t,value:e,classes:r})=>V`<li
            @click=${this.onItemClick}
            data-value=${e}
            class=${ui({[r??""]:!!r,"text-ellipsis overflow-hidden":!0,"rounded-md p-2.5":!0,"text-neutral-700 dark:text-neutral-300":!r,"cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800":!0,"bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800":this.focused===e})}
            role="menuitem"
            ?selected=${this.selection===e}
          >
            ${t}
          </li>`))}
    </ul>`}onTrigger(t){this.open=!this.open,this.activeEvent=t}onItemClick(t){let e=t.target;for(;e&&!e.hasAttribute("data-value")&&e.parentElement;)e=e.parentElement;const r=e.getAttribute("data-value");if(!r)throw new Error("onItemClick didn't recover a selection value");this.onSelection(t,r)}onSelection(t,e){const r=this.options.find((t=>t.value===e));if(r&&r.options)return t.stopPropagation(),t.preventDefault(),this.historyStack.push(this.options),void(this.options=r.options);if("string"==typeof e){const t=new ii(e);this.selection=e,this.dispatchEvent(t)}}onKeyDown(t){const{code:e}=t;if("Escape"===e)this.open=!1;else if("Space"===e||"Enter"===e)t.preventDefault(),this.open=!this.open,t.didCloseMenu=!0,!this.open&&this.focused&&this.onSelection(t,this.focused);else if("ArrowDown"===e||"ArrowRight"===e)if(t.preventDefault(),this.focused){const t=this.activeOptions.findIndex((({value:t},e)=>t===this.focused));t>-1&&t<this.activeOptions.length-1?this.focused=this.activeOptions[t+1].value:t===this.activeOptions.length-1&&(this.focused=this.activeOptions[0].value)}else this.focused=this.activeOptions[0]?.value;else if("ArrowUp"===e||"ArrowLeft"===e)if(t.preventDefault(),this.focused){const t=this.activeOptions.findIndex((({value:t},e)=>t===this.focused));t>0?this.focused=this.activeOptions[t-1].value:0===t&&(this.focused=this.activeOptions[this.activeOptions.length-1].value)}else this.focused=this.activeOptions[this.activeOptions.length-1]?.value;else"Tab"===e&&this.open&&t.preventDefault()}focus(){const t=this.shadowRoot?.querySelector("#trigger");t?.focus()}willUpdate(t){super.willUpdate(t),t.has("open")&&this.open?(this.setAttribute("aria-expanded",""),this.outsideClicker=(t=>{t!==this.activeEvent&&(this.open=!1,delete this.activeEvent,this.outsideClicker&&document.removeEventListener("click",this.outsideClicker))}).bind(this),document.addEventListener("click",this.outsideClicker),this.dispatchEvent(new ci(this.close))):t.has("open")&&!this.open&&(this.removeAttribute("aria-expanded"),this.historyStack.length>0&&(this.options=this.historyStack[0],this.historyStack=[]),this.outsideClicker&&(delete this.activeEvent,document.removeEventListener("click",this.outsideClicker))),t.has("options")&&(this.activeOptions=this.options)}updated(t){super.updated(t),t.has("open")&&!this.open&&(this.focused=void 0)}render(){const t={"relative -mr-1 cursor-pointer":!0,dark:this.theme==zo.dark};return V`
      <slot></slot>
      <div
        id="trigger"
        class=${Mt(t)}
        aria-haspopup="menu"
        tabindex="0"
        @click=${this.onTrigger}
        @dblclick=${t=>t.stopPropagation()}
        @keydown=${this.onKeyDown}
      >
        <div class=${Mt({"border border-transparent":!0,"hover:bg-neutral-100 dark:hover:bg-neutral-900 active:border-neutral-200 dark:active:border-neutral-800":!0,"p-0.5 rounded-md":!0})}>${Ri(16)}</div>
        ${this.listElement}
      </div>
    `}}Oi([ut({type:Boolean,attribute:"open",reflect:!0})],Pi.prototype,"open",void 0),Oi([ut({attribute:"selection",type:String})],Pi.prototype,"selection",void 0),Oi([ut({type:Array,attribute:"options"})],Pi.prototype,"options",void 0),Oi([ut({attribute:"without-padding",type:Boolean})],Pi.prototype,"withoutPadding",void 0),Oi([pt()],Pi.prototype,"activeOptions",void 0),Oi([pt()],Pi.prototype,"historyStack",void 0),Oi([pt()],Pi.prototype,"focused",void 0);var Ti=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let Di=class extends Pi{constructor(){super(...arguments),this._classMap={"focus:ring-1 focus:ring-neutral-950 dark:focus:ring-neutral-50 focus:outline-none ":!0,"px-2 py-1.5":!0,"bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50":!0,"placeholder-neutral-400 dark:placeholder-neutral-600":!0,"rounded-md border border-neutral-400 dark:border-neutral-600":!0},this.value=""}get menuPositionClasses(){return"left-0 right-0 top-8"}onMenuSelection(t){const{value:e}=t;this.value=e}onKeyDown(t){if(this.open)return super.onKeyDown({...t,didCloseMenu:!1});const{code:e}=t;"Space"!==e&&"ArrowLeft"!==e&&"ArrowRight"!==e&&("ArrowDown"===e?this.open=!0:super.onKeyDown({...t,didCloseMenu:!1}))}connectedCallback(){super.connectedCallback(),this.addEventListener("menu-selection",this.onMenuSelection)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("menu-selection",this.onMenuSelection)}willUpdate(t){super.willUpdate(t),t.has("value")&&this.dispatchEvent&&this.dispatchEvent(new li(this.value))}render(){return V`
            <slot></slot>
            <input
            id="trigger"
            @keydown=${this.onKeyDown}
            .value=${this.value}
            @input=${t=>{const{value:e}=t.target;this.value=e}}
                class=${Mt({"relative w-full":!0,dark:this.theme==zo.dark,...this._classMap})}
                tabindex="0"
                type="text"
                autocomplete="off"
                required
            >
                <div class=${Mt({"absolute right-1":!0,"border border-transparent":!0,"bg-neutral-50 dark:bg-neutral-950":!0,"hover:bg-neutral-100 dark:hover:bg-neutral-900 active:border-neutral-200 dark:active:border-neutral-800":!0,"p-0.5 rounded-md":!0})} @click=${t=>{const e=this.shadowRoot?.querySelector("#trigger");e?.focus(),this.onTrigger(t)}} aria-haspopup="menu">${Ri(16)}</div>
                ${this.listElement}
            </input>
        `}};Ti([ut({type:Object})],Di.prototype,"_classMap",void 0),Ti([ut({type:String})],Di.prototype,"value",void 0),Di=Ti([ct("astra-input-menu")],Di);var zi,ji=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let Ii=zi=class extends gi{constructor(){super(...arguments),this.columnName="",this.columnType=""}classMap(){return{"inline-block p-3.5 w-40":!0,"text-xs":!0,"bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50":!0,"rounded-lg border border-neutral-400 dark:border-neutral-600":!0,...super.classMap()}}onChange(t){const{value:e}=t.target;this.columnName=e}onSubmit(t){if(t.preventDefault(),!this.columnName)throw new Error("Missing column name");this.dispatchEvent(new Ko({name:this.columnName,data:{type:this.columnType}}))}render(){return V`<form @submit=${this.onSubmit} class="flex flex-col gap-3.5 text-xs">
      <div class="flex flex-col gap-1">
        <label for="column-name" class=${Mt(zi.labelClasses)}>Column Name</label>
        <input
          required
          type="text"
          name="column-name"
          id="column-name"
          class=${Mt(zi.inputClasses)}
          placeholder="Enter name"
          autocomplete="off"
          .value=${this.columnName}
          @input=${this.onChange}
        />
        ${this.errorMessage}
      </div>

      <div class="flex flex-col gap-1">
        <label for="data-type" class=${Mt(zi.labelClasses)}>Select Type</label>

        <astra-input-menu
          ._classMap=${zi.inputClasses}
          .options=${[{label:"Text",value:"Text"},{label:"Integer",value:"Integer"},{label:"Date and time",value:"Date and time"},{label:"Boolean",value:"Boolean"},{label:"Image",value:"Image"},{label:"etc.",value:"etc."}]}
          @change=${t=>{t.stopPropagation(),this.columnType=t.value}}
          @menu-selection=${t=>{t.stopPropagation()}}
        ></astra-input-menu>
      </div>

      <button ?disabled="${0===this.columnName.length}" class=${Mt(zi.buttonClasses)} type="submit">
        Create Column
      </button>
    </form>`}};Ii.labelClasses={"font-medium":!0},Ii.inputClasses={"focus:ring-1 focus:ring-neutral-500 focus:outline-none ":!0,"px-2 py-1.5":!0,"bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50":!0,"placeholder-neutral-600 dark:placeholder-neutral-400":!0,"rounded-md border border-neutral-400 dark:border-neutral-600 focus:dark:border-neutral-300":!0},Ii.buttonClasses={"bg-neutral-950 dark:bg-neutral-50 hover:bg-neutral-800 hover:dark:bg-neutral-200":!0,"text-neutral-50 dark:text-neutral-950":!0,"px-5 py-1.5 rounded-md":!0,"disabled:bg-neutral-400 disabled:dark:bg-neutral-600":!0},ji([pt()],Ii.prototype,"columnName",void 0),ji([pt()],Ii.prototype,"columnType",void 0),ji([pt()],Ii.prototype,"errorMessage",void 0),Ii=zi=ji([ct("astra-add-column")],Ii);let Mi=class extends gi{classMap(){return{"p-0.5 rounded-md cursor-pointer":!0,"dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900":!0,"border border-transparent active:border-neutral-200 dark:active:border-neutral-800":!0,...super.classMap()}}render(){return V`${(t=>V` <svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 256 256">
    <rect width="256" height="256" fill="none" />
    <line
      x1="40"
      y1="128"
      x2="216"
      y2="128"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    />
    <line
      x1="128"
      y1="40"
      x2="128"
      y2="216"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    />
  </svg>`)(16)}`}};Mi=ji([ct("astra-add-column-trigger")],Mi);var Li=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let Ui=class extends gi{classMap(){return{"table-row-group":!0,...super.classMap()}}};Ui=Li([ct("astra-rowgroup")],Ui);
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
class Ni extends It{constructor(t){if(super(t),this.it=F,t.type!==zt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===F||null==t)return this._t=void 0,this.it=t;if(t===W)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}Ni.directiveName="unsafeHTML",Ni.resultType=1;const Hi=jt(Ni);function Bi(t){return t.composedPath().some((t=>{if(t instanceof HTMLElement&&t.tagName.toLowerCase().includes("astra-plugin"))return!0}))}var Vi=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};const Wi=["Int","Integer","SmallInt","BigInt","Decimal","Float","Real","Double Precision","TinyInt","MediumInt","Serial","BigSerial"].map((t=>t.toLowerCase())),Fi=["Boolean","Bit"].map((t=>t.toLowerCase())),qi=["JSON","JSONB","ARRAY"].map((t=>t.toLowerCase()));class Ki extends gi{constructor(){super(...arguments),this._didSetInitialValue=!1,this.constrainTypes=!1,this.position={column:"",row:""},this.readonly=!1,this.isInteractive=!1,this.outerBorder=!1,this.separateCells=!1,this.blank=!1,this.isEditing=!1,this.hasMenu=!1,this.isFirstColumn=!1,this.isLastColumn=!1}static moveFocusToNextRow(t){const e=t?.parentElement,r=Array.from(e?.children??[]).indexOf(t),o=e?e.nextElementSibling:null;if(o&&o.children.length>r){var i=o.children[r];i&&i.focus()}}static moveFocusToPreviousRow(t){const e=t?.parentElement,r=Array.from(e?.children??[]).indexOf(t),o=e?e.previousElementSibling:null;if(o&&o.children.length>r){var i=o.children[r];i&&i.focus()}}static onKeyDown(t){const e=t.currentTarget;if("Escape"===t.code&&(t.stopPropagation(),t.preventDefault(),e.isEditing=!1,e.focus()),"Enter"===t.code&&e.isEditing&&t.target instanceof HTMLElement){const r=t.target;setTimeout((()=>{e.isEditing=!1,e.focus(),setTimeout((()=>{Ki.moveFocusToNextRow(r)}),0)}))}"Enter"===t.code&&!e.isEditing&&e.readonly&&t.preventDefault(),"Enter"!==t.code||e.isEditing||e.readonly||t.target instanceof HTMLElement&&!e.isEditing&&(t.didCloseMenu||(e.isEditing=!0))}static convertToType(t,e){if(t&&"string"==typeof e){if(Wi.includes(t))return parseInt(e,10);if(qi.includes(t))return JSON.parse(e);if(Fi.includes(t))return"true"===e.toLowerCase().trim();if(""===e)return null}return e}classMap(){return{"cursor-pointer":this.isInteractive&&!this.readonly,...super.classMap()}}get value(){return this._value}set value(t){const e=this._value;e!==t&&(this.constrainTypes?this._value=Ki.convertToType(this.type,t)??t:this._value=t,this.requestUpdate("value",e),this._didSetInitialValue&&this.dispatchChangedEvent(),this._didSetInitialValue=!0)}get originalValue(){return this._originalValue}set originalValue(t){const e=this._originalValue;this.constrainTypes?this._originalValue=Ki.convertToType(this.type,t)??t:this._originalValue=t,this.requestUpdate("originalValue",e)}get dirty(){return t=this.value,e=this.originalValue,!Do(t,e);var t,e}get type(){return this._type}set type(t){this._type=t?.toLowerCase()}updated(t){if(super.updated(t),t.has("isEditing")&&this.isEditing){const t=this.shadowRoot?.querySelector("input");t&&t.select()}}willUpdate(t){super.willUpdate(t),this.constrainTypes&&t.has("type")&&(this.value=Ki.convertToType(this.type,this.value)??this._value,this.originalValue=Ki.convertToType(this.type,this.originalValue)??this.originalValue)}dispatchChangedEvent(){const t={position:this.position,previousValue:this.originalValue,value:this.value,label:this.label};this.dispatchEvent(new Wo(t))}onBlur(){this.isEditing=!1}onChange(t){const{value:e}=t.target;this.value=""===e?null:e}}Vi([ut({attribute:"constrain-types",type:Boolean})],Ki.prototype,"constrainTypes",void 0),Vi([ut({attribute:"value",type:String})],Ki.prototype,"value",null),Vi([ut({attribute:"original-value",type:String})],Ki.prototype,"originalValue",null),Vi([ut({type:String})],Ki.prototype,"dirty",null),Vi([ut({type:Object,attribute:"position"})],Ki.prototype,"position",void 0),Vi([ut({type:String})],Ki.prototype,"label",void 0),Vi([ut({attribute:"read-only",type:Boolean})],Ki.prototype,"readonly",void 0),Vi([ut({type:String,attribute:"width"})],Ki.prototype,"width",void 0),Vi([ut({attribute:"interactive",type:Boolean})],Ki.prototype,"isInteractive",void 0),Vi([ut({attribute:"outer-border",type:Boolean})],Ki.prototype,"outerBorder",void 0),Vi([ut({type:Boolean,attribute:"separate-cells"})],Ki.prototype,"separateCells",void 0),Vi([ut({type:Boolean,attribute:"blank"})],Ki.prototype,"blank",void 0),Vi([ut({attribute:"type",type:String})],Ki.prototype,"type",null),Vi([ut({attribute:"is-editing",type:Boolean})],Ki.prototype,"isEditing",void 0),Vi([ut({attribute:"menu",type:Boolean})],Ki.prototype,"hasMenu",void 0),Vi([ut({attribute:"is-first-column",type:Boolean})],Ki.prototype,"isFirstColumn",void 0),Vi([ut({attribute:"is-last-column",type:Boolean})],Ki.prototype,"isLastColumn",void 0);var Yi=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let Zi=class extends Pi{get menuPositionClasses(){return"undefined"!=typeof window?"right-0 left-0 top-9":""}render(){const t=Mt({dark:this.theme==zo.dark});return V`
      <span
        class=${Mt({"whitespace-nowrap text-ellipsis":!0,"overflow-hidden w-full focus:z-[1] ":!0})}
        ><slot></slot
      ></span>
      <span
        id="trigger"
        aria-haspopup="menu"
        class=${t}
        @click=${this.onTrigger}
        @dblclick=${t=>t.stopPropagation()}
        @keydown=${this.onKeyDown}
      >
        ${this.listElement}</span
      >
    `}};Zi=Yi([ct("astra-td-menu")],Zi);var Xi,Gi=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};const Ji=[{label:"Edit",value:"edit"},{label:"Copy",value:"copy"},{label:"Paste",value:"paste"},{label:"Clear",value:"clear"}],Qi=[{label:"Copy",value:"copy"}];let ts=Xi=class extends Ki{static onClick(t){const e=t.currentTarget;e instanceof Xi&&!e.isDisplayingPluginEditor&&e.focus()}static onContextMenu(t){const e=function(t){return t.composedPath().some((t=>{if(t instanceof HTMLElement&&t.tagName.toLowerCase().includes("astra-plugin-editor"))return!0}))}(t);if(e)return;const r=t.currentTarget.shadowRoot?.querySelector("astra-td-menu");r&&(t.preventDefault(),r.focus(),r.open=!0)}static onContentEditableKeyDown(t){const e=t.composedPath().every((t=>t instanceof HTMLElement&&"plugin-editor"!==t.id));e&&t.preventDefault()}static onDragOver(t){t.preventDefault()}static onDrop(t){t.preventDefault()}static onDoubleClick(t){const e=t.currentTarget;e.isEditing||Bi(t)||(e.isEditing=!0,setTimeout((()=>{const t=e.shadowRoot?.querySelector("input");t&&(t.focus(),e.readonly||t.setSelectionRange(t.value.length,t.value.length))}),0))}static copyValueToClipboard(t){return null==t?navigator.clipboard.writeText(""):"object"==typeof t?navigator.clipboard.writeText(JSON.stringify(t)):navigator.clipboard.writeText(t.toString())}static async onKeyDown(t){if(Bi(t))return;const e=t.currentTarget,r=e.shadowRoot?.querySelector("astra-td-menu");if(r?.open)return;if(e.plugin&&"Enter"===t.code&&t.target instanceof HTMLElement)return void Ki.moveFocusToNextRow(t.target);if(Ki.onKeyDown(t),e.isEditing)return;const{code:o}=t;let i=t.target;if(!(i instanceof HTMLElement))return;if("check-box"===i.tagName.toLowerCase()){const e=i.parentElement?.parentElement?.parentElement;return void("ArrowDown"===o?(t.preventDefault(),e?.nextElementSibling?.querySelector("check-box")?.focus()):"ArrowUp"===o?(t.preventDefault(),e?.previousElementSibling?.querySelector("check-box")?.focus()):"ArrowRight"===o&&(t.preventDefault(),i.parentElement?.parentElement?.nextElementSibling?.focus()))}const s=1===t.key.length&&(n=t.key,/^[a-zA-Z0-9 \.,]+$/.test(n));var n;const a=!(t.metaKey||t.shiftKey),l=!(e.type&&qi.includes(e.type));if(s&&a&&l&&(t.preventDefault(),e.isEditing=!0,void 0===e.value||null===e.value?e.value=t.key:e.value+=t.key,setTimeout((()=>{const t=e.shadowRoot?.querySelector("input");t?.focus(),t?.setSelectionRange(t.value.length,t.value.length)}),0)),"ArrowRight"===o)return t.preventDefault(),void i?.nextElementSibling?.focus();if("ArrowLeft"!==o){if("ArrowDown"===o){if(t.preventDefault(),t.target instanceof HTMLElement&&!e.isEditing)return void Ki.moveFocusToNextRow(t.target)}else if("ArrowUp"===o&&(t.preventDefault(),t.target instanceof HTMLElement&&!e.isEditing))return void Ki.moveFocusToPreviousRow(t.target);return t.metaKey&&"KeyC"===o?(t.preventDefault(),Xi.copyValueToClipboard(e.value)):e.readonly||"Backspace"!==o&&"Delete"!==o?void 0:(t.preventDefault(),void(e.value=null))}{t.preventDefault();const e=i?.previousElementSibling?.querySelector("check-box");e?e.focus():i?.previousElementSibling?.focus()}}static onPaste(t){const e=t.composedPath().find((t=>{const e=t;if("astra-td"===e.tagName?.toLowerCase())return!0}));e&&(t.preventDefault(),e.value=t.clipboardData?.getData("text"))}classMap(){return{...super.classMap(),"table-cell relative focus:z-[1]":!0,"px-cell-padding-x py-cell-padding-y ":!this.plugin&&!this.blank,"px-5":this.blank,"border-theme-border dark:border-theme-border-dark":!0,"bg-theme-cell dark:bg-theme-cell-dark text-theme-cell-text dark:text-theme-cell-text-dark":!0,"bg-theme-cell-dirty dark:bg-theme-cell-dirty-dark":this.dirty&&!this.hideDirt,"group-hover:bg-theme-row-hover dark:group-hover:bg-theme-row-hover-dark":!this.dirty||this.hideDirt,"focus:shadow-ringlet dark:focus:shadow-ringlet-dark focus:rounded-[4px] focus:ring-1 focus:ring-black dark:focus:ring-neutral-300 focus:outline-none":!this.isEditing&&this.isInteractive,"border-r":this.isInteractive||this._drawRightBorder&&this.separateCells&&this.isLastColumn&&this.outerBorder||this._drawRightBorder&&this.separateCells&&!this.isLastColumn,"first:border-l":this.separateCells&&this.outerBorder,"border-b":this.withBottomBorder}}constructor(){super(),this.pluginAttributes="",this.withBottomBorder=!1,this._drawRightBorder=!1,this.isRowSelector=!1,this.row=void 0,this.column=void 0,this.hideDirt=!1,this.isDisplayingPluginEditor=!1,this.isFirstRow=!1,this.options=Ji,this.onDisplayEditor=this.onDisplayEditor.bind(this),this.onPluginChangeEvent=this.onPluginChangeEvent.bind(this),this.onMenuSelection=this.onMenuSelection.bind(this),this.focus=this.focus.bind(this)}onDisplayEditor(t){const e=t.composedPath().some((t=>t instanceof HTMLElement&&"plugin-editor"===t.id));e||(this.isDisplayingPluginEditor=!1)}onPluginChangeEvent({detail:{action:t,value:e}}){const r=t.toLowerCase();r===Lo.onEdit?this.isDisplayingPluginEditor=!0:r===Lo.onStopEdit||r===Lo.onCancelEdit?this.isDisplayingPluginEditor=!1:r===Lo.updateCell&&(this._interstitialValue=e)}async onMenuSelection(t){switch(t.value){case"edit":return this.isEditing=!0;case"copy":return Xi.copyValueToClipboard(this.value);case"paste":return this.value=await navigator.clipboard.readText(),void this.dispatchChangedEvent();case"clear":return this.value=null,void this.dispatchChangedEvent();case"reset":return this.value=this.originalValue,void this.dispatchChangedEvent()}}focus(){this.shadowRoot?.querySelector("[contenteditable]")?.focus()}connectedCallback(){super.connectedCallback(),this.addEventListener("contextmenu",Xi.onContextMenu),this.addEventListener("keydown",Xi.onKeyDown),this.addEventListener("click",Xi.onClick),this.addEventListener("custom-change",this.onPluginChangeEvent),this.addEventListener("plugin-change",this.onPluginChangeEvent),this.isInteractive&&!this.plugin&&this.addEventListener("dblclick",Xi.onDoubleClick)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("contextmenu",Xi.onContextMenu),this.removeEventListener("keydown",Xi.onKeyDown),this.removeEventListener("click",Xi.onClick),this.removeEventListener("dblclick",Xi.onDoubleClick),this.removeEventListener("plugin-change",this.onPluginChangeEvent),this.removeEventListener("custom-change",this.onPluginChangeEvent)}willUpdate(t){if(super.willUpdate(t),t.has("isDisplayingPluginEditor")){if("undefined"==typeof document)return;this.isDisplayingPluginEditor?setTimeout((()=>{document.addEventListener("click",this.onDisplayEditor)}),0):document.removeEventListener("click",this.onDisplayEditor)}!t.has("isDisplayingPluginEditor")&&this.isDisplayingPluginEditor||(t.has("isDisplayingPluginEditor")&&!this.isDisplayingPluginEditor&&this._interstitialValue&&(this.value=this._interstitialValue,delete this._interstitialValue),t.has("readonly")&&(this.readonly?this.options=Qi:this.options=Ji),(t.has("isFirstRow")||t.has("isFirstColumn"))&&(this.isFirstColumn&&this.isFirstRow?this.setAttribute("first-cell","true"):this.removeAttribute("first-cell")))}render(){const t=null===this.value?null:"object"==typeof this.value?JSON.stringify(this.value):this.value,e=null===this.value?null:"object"==typeof this.value?JSON.stringify(this.value,null,2):this.value,r=Mt({"font-normal":!0,dark:this.theme==zo.dark});let o,i;if(this.plugin){const{config:r,tagName:s}=this.plugin,n=Hi(`<${s} cellvalue='${t}' configuration='${r}' ${this.pluginAttributes}></${s}>`);o=V`${n}`,this.isDisplayingPluginEditor&&(i=Hi(`<${s.replace("astra-plugin-cell","astra-plugin-editor")} cellvalue='${e}' configuration='${r}' ${this.pluginAttributes}></${s}>`))}else o=V`${V`<span class="nbsp">${t}</span>`??V`<span class="italic text-neutral-400 dark:text-neutral-500">NULL</span>`}`;const s=this.isEditing?V`<span class=${r}>&nbsp;<input .value=${t??""}
                ?readonly=${this.readonly}
                @input=${this.onChange}
                class=${Mt({"z-[2] absolute top-0 bottom-0 right-0 left-0":!0,"bg-blue-50 dark:bg-blue-950 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700":!0,"px-3 font-normal focus:rounded-[4px]":!0})} @blur=${this.onBlur}></input></span>`:V``,n=this.blank?V`<slot></slot>`:V``,a=this.dirty?[...this.options,{label:"object"==typeof this.originalValue?"Revert":V`Revert to
                    <span class="pointer-events-none italic whitespace-nowrap"
                      >${null!==this.originalValue||void 0!==this.originalValue?this.originalValue:"NULL"}</span
                    >`,value:"reset"}]:this.options,l=this.isEditing||this.blank?V``:V`<span
            class="outline-none caret-transparent"
            contenteditable="true"
            spellcheck="false"
            autocorrect="off"
            @paste=${Xi.onPaste}
            @keydown=${Xi.onContentEditableKeyDown}
            @dragover=${Xi.onDragOver}
            @drop=${Xi.onDrop}
            ><astra-td-menu
              theme=${this.theme}
              .options=${a}
              ?without-padding=${!!this.plugin}
              ?selectable-text=${!this.isInteractive}
              @menu-selection=${this.onMenuSelection}
              ><span class=${r}>${o}</span
              ><span id="plugin-editor" class="absolute top-8 caret-current cursor-auto">${i}</span></astra-td-menu
            ></span
          >`;return this.isEditing?s:this.blank?n:l}};ts.styles=[...Ki.styles,n`
      .nbsp::after {
        content: '.'; /* Non-breaking space */
        visibility: hidden;
      }
    `],Gi([ut({attribute:"plugin-attributes",type:String})],ts.prototype,"pluginAttributes",void 0),Gi([ut({type:Boolean,attribute:"bottom-border"})],ts.prototype,"withBottomBorder",void 0),Gi([ut({type:Boolean,attribute:"odd"})],ts.prototype,"isOdd",void 0),Gi([ut({type:Boolean,attribute:"draw-right-border"})],ts.prototype,"_drawRightBorder",void 0),Gi([ut({type:Boolean,attribute:"row-selector"})],ts.prototype,"isRowSelector",void 0),Gi([ut({attribute:"row",type:Number})],ts.prototype,"row",void 0),Gi([ut({attribute:"column",type:Number})],ts.prototype,"column",void 0),Gi([ut({attribute:"hide-dirt",type:Boolean})],ts.prototype,"hideDirt",void 0),Gi([ut({attribute:"plugin",type:String})],ts.prototype,"plugin",void 0),Gi([ut({attribute:"is-displaying-plugin-editor",type:Boolean})],ts.prototype,"isDisplayingPluginEditor",void 0),Gi([ut({attribute:"is-first-row",type:Boolean})],ts.prototype,"isFirstRow",void 0),Gi([pt()],ts.prototype,"options",void 0),ts=Xi=Gi([ct("astra-td")],ts);const es=t=>V` <svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" fill="currentColor" viewBox="0 0 256 256">
    <rect width="256" height="256" fill="none" />
    <polyline
      points="96 48 176 128 96 208"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    />
  </svg>`;var rs=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let os=class extends gi{onMouseDown(t){if(!this.column)throw new Error("`column` is unset; aborting");const e=this.column.value??this.column.originalValue??"";this.dispatchEvent(new si(e));const r=t=>{if(!this.column)throw new Error("`column` is unset; aborting");if(!this.xPosition)throw new Error("`xPosition` is unset; aborting");if(!this.width)throw new Error("`width` is unset; aborting");this.dispatchEvent(new ai(e,t.clientX-this.xPosition))},o=t=>{if(document.removeEventListener("mouseup",o),document.removeEventListener("mousemove",r),!this.column)throw new Error("`column` is unset; aborting");this.dispatchEvent(new ni(e,this.xPosition?t.clientX-this.xPosition:0))};document.addEventListener("mousemove",r),document.addEventListener("mouseup",o),this.xPosition=t.clientX,this.width=parseInt(window.getComputedStyle(this.column).width,10)}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.onMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.onMouseDown)}willUpdate(t){super.willUpdate(t),t.has("height")}render(){const t=Mt({"absolute z-[1] top-0 bottom-0 -right-[7px] w-4":!0,"flex justify-center":!0,"cursor-col-resize group":!0,dark:this.theme==zo.dark});return V`
      <div class=${t}>
        <div
          class="h-full ml-[1px] w-[1px] group-hover:w-1 group-active:w-1 bg-theme-border dark:bg-theme-border-dark group-hover:bg-blue-400 group-active:bg-blue-500 dark:group-hover:bg-blue-900 dark:group-active:bg-blue-800"
        ></div>
      </div>
    `}};rs([ut({type:Number,attribute:"height"})],os.prototype,"height",void 0),rs([ut({type:Object})],os.prototype,"column",void 0),os=rs([ct("column-resizer")],os);var is=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let ss=class extends Pi{get menuPositionClasses(){return"undefined"!=typeof window?"right-0 top-8":""}};ss=is([ct("astra-th-menu")],ss);var ns=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let as=class extends Ki{constructor(){super(...arguments),this.readonly=!0,this.withResizer=!1,this.installedPlugins={},this.options=[{label:"Sort A-Z",value:"sort:alphabetical:ascending"},{label:"Sort Z-A",value:"sort:alphabetical:descending"},{label:"Hide Column",value:"hide"},{label:"Rename Column",value:"rename"},{label:"Delete Column",value:"delete",classes:"text-red-500 dark:text-red-400/90 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"}],this._previousWidth=0,this._options=[],this._pluginOptions=[]}classMap(){return{...super.classMap(),"table-cell relative whitespace-nowrap h-[38px]":!0,"cursor-pointer":!0,"border-b border-theme-border dark:border-theme-border-dark":!0,"first:border-l border-t":this.outerBorder,"px-cell-padding-x py-cell-padding-y":!0,"bg-theme-column dark:bg-theme-column-dark":!this.dirty,"bg-theme-cell-dirty dark:bg-theme-cell-dirty-dark":this.dirty,"select-none":this.hasMenu,"border-r":!this.withResizer&&this.isLastColumn&&this.outerBorder||!this.withResizer&&this.separateCells&&!this.isLastColumn}}get value(){return this._value?.toString()}set value(t){const e=this._value;this._value=t,this.requestUpdate("value",e)}get originalValue(){return this._originalValue?.toString()}set originalValue(t){const e=this._originalValue;this._originalValue=t,this.requestUpdate("value",e)}dispatchChangedEvent(){"string"==typeof this.originalValue&&this.dispatchEvent(new Yo({name:this.originalValue,data:{name:this.value}}))}onMenuSelection(t){t.stopPropagation();let e=!1;const r=this.originalValue??this.value??"",o=this.plugins?.find((({tagName:e})=>t.value===e));if(o)return this.dispatchEvent(new Go(r,{...o,columnName:r}));if("uninstall-column-plugin"===t.value){const t=this.installedPlugins[r];if(!t)throw new Error(`Attempting to uninstall a non-existent plugin on ${r}`);this.dispatchEvent(new Jo(r,t))}switch(t.value){case"hide":return this.hideColumn();case"rename":return this.isEditing=!0;case"delete":return this.removeColumn();case"reset":return this.dispatchEvent(new Yo({name:this.originalValue??"",data:{value:this.value}})),this.value=this.originalValue??"";default:e=!0}e&&this.dispatchEvent(new Qo({name:this.originalValue??this.value??"",data:{action:t.value}}))}onContextMenu(t){const e=this.shadowRoot?.querySelector("astra-th-menu");e&&(t.preventDefault(),e.focus(),e.open=!0)}onClick(t){const e=t.composedPath(),r=e.some((t=>"trigger"===t.getAttribute?.("id"))),o=this.originalValue??this.value,i=!e.some((t=>"column-resizer"===t.tagName?.toLowerCase()));!r&&o&&i&&this.dispatchEvent(new Qo({name:o,data:{action:"sort:alphabetical:ascending"}}))}removeColumn(){if(!this.originalValue)throw new Error("missing OG value");this.dispatchEvent(new Zo({name:this.originalValue}))}hideColumn(){if(!this.originalValue)throw new Error("missing OG value");this.dispatchEvent(new Xo({name:this.originalValue}))}connectedCallback(){super.connectedCallback(),this.addEventListener("contextmenu",this.onContextMenu),this.addEventListener("click",this.onClick)}disconnectedCallback(){super.disconnectedCallback,this.removeEventListener("contextmenu",this.onContextMenu),this.removeEventListener("click",this.onClick)}firstUpdated(t){this.width&&this.style&&(this.style.width=this.width)}willUpdate(t){if(super.willUpdate(t),t.has("plugins")){const t=this.plugins?.filter((t=>!t.isDefault))??[];this._pluginOptions=t.map((t=>({label:t.displayName,value:t.tagName})))??[]}t.has("width")&&this.width&&this.style&&(this.style.width=this.width),t.has("readonly")&&(this.readonly?this.options=[{label:"Sort A-Z",value:"sort:alphabetical:ascending"},{label:"Sort Z-A",value:"sort:alphabetical:descending"},{label:"Hide Column",value:"hide"},{label:"Delete Column",value:"delete",classes:"text-red-500 dark:text-red-400/90 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"}]:this.options=[{label:"Sort A-Z",value:"sort:alphabetical:ascending"},{label:"Sort Z-A",value:"sort:alphabetical:descending"},{label:"Hide Column",value:"hide"},{label:"Rename Column",value:"rename"},{label:"Delete Column",value:"delete",classes:"text-red-500 dark:text-red-400/90 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"}]),(t.has("isFirstColumn")||t.has("isFirstColumn"))&&this.isFirstColumn&&this.setAttribute("first-cell","true")}render(){const t=this.originalValue??this.value??"",e=void 0!==this.installedPlugins?.[t]&&!this.installedPlugins?.[t]?.isDefaultPlugin,r=this.dirty?[...this.options,{label:V`Revert to <span class="pointer-events-none italic whitespace-nowrap">${this.originalValue}</span>`,value:"reset"}]:[...this.options];this._pluginOptions.length>0&&r.splice(2,0,e?{label:V`<span class="">Remove Plugin</span> `,value:"uninstall-column-plugin"}:{label:V`<div class="flex items-center justify-between">Plugins ${es(16)}</div>`,value:"plugins",options:this._pluginOptions});const o={"absolute top-0 bottom-0 right-0 left-0":!0,dark:this.theme==zo.dark},i={dark:this.theme==zo.dark};if(this.blank)return V`<div class=${Mt(o)}><slot></slot></div> `;{const t=this.isEditing?V`<input .value=${this.value} @input=${this.onChange} @keydown=${Ki.onKeyDown} class=${Mt({"z-[1] absolute top-0 bottom-0 right-0 left-0":!0,"bg-blue-50 dark:bg-blue-950 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700":!0,"px-cell-padding-x font-normal":!0})} @blur=${this.onBlur}></input>`:this.hasMenu?V`<astra-th-menu theme=${this.theme} .options=${r} @menu-selection=${this.onMenuSelection}
              ><span class="font-normal">${this.value}</span></astra-th-menu
            >`:V`<span class="font-normal">${this.value}</span>`;return this.withResizer?V`<span class=${Mt(i)}
            ><slot></slot>
            ${t}
            <column-resizer
              .column=${this}
              height="${_i(this.tableHeight)}"
              theme=${this.theme}
              @resize-start=${()=>{this._previousWidth=this.width?+this.width.slice(0,-2):0}}
              @resize=${({delta:t})=>{this.width=`${this._previousWidth+t}px`}}
            ></column-resizer
          ></span>`:V`<div class=${Mt(i)}><slot></slot>${t}</div>`}}};ns([ut({attribute:"table-height",type:Number})],as.prototype,"tableHeight",void 0),ns([ut({attribute:"with-resizer",type:Boolean})],as.prototype,"withResizer",void 0),ns([ut({attribute:"plugins",type:Array})],as.prototype,"plugins",void 0),ns([ut({attribute:"installed-plugins",type:Object})],as.prototype,"installedPlugins",void 0),ns([ut({attribute:"options",type:Array})],as.prototype,"options",void 0),ns([ut({attribute:"value",type:String})],as.prototype,"value",null),ns([ut({attribute:"original-value",type:String})],as.prototype,"originalValue",null),ns([pt()],as.prototype,"_previousWidth",void 0),ns([pt()],as.prototype,"_options",void 0),ns([pt()],as.prototype,"_pluginOptions",void 0),as=ns([ct("astra-th")],as);var ls=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let cs=class extends gi{classMap(){return{"table-header-group sticky z-[2] top-0":!0,...super.classMap()}}};cs=ls([ct("astra-thead")],cs);var ds=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};let hs=class extends gi{constructor(){super(...arguments),this.selected=!1,this.isHeaderRow=!1,this.new=!1}classMap(){return{"table-row group":!0,"text-theme-column-text dark:text-theme-column-text-dark":this.isHeaderRow,"bg-theme-row-new dark:bg-theme-row-new-dark":this.new&&!this.selected,"odd:bg-theme-row-odd dark:odd:bg-theme-row-odd-dark even:bg-theme-row-even dark:even:bg-theme-row-even-dark":!this.new&&!this.isHeaderRow&&!this.selected,"bg-theme-row-selected dark:bg-theme-row-selected-dark hover:bg-theme-row-selected-hover dark:hover:bg-theme-row-selected-hover-dark":this.selected&&!this.isHeaderRow,...super.classMap()}}willUpdate(t){super.willUpdate(t),t.has("selected")&&void 0!==t.get("selected")&&this.dispatchEvent(new Event("on-selection"))}};ds([ut({type:Boolean,attribute:"selected"})],hs.prototype,"selected",void 0),ds([ut({type:Boolean,attribute:"header",reflect:!0})],hs.prototype,"isHeaderRow",void 0),ds([ut({type:Boolean,attribute:"new"})],hs.prototype,"new",void 0),hs=ds([ct("astra-tr")],hs);var us=function(t,e,r,o){var i,s=arguments.length,n=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,r,n):i(e,r))||n);return s>3&&n&&Object.defineProperty(e,r,n),n};const ps="undefined"!=typeof navigator&&navigator.userAgent.includes("Safari")?20:4;let gs=class extends gi{set data(t){this.rows=t}updateVisibleColumns(){this.visibleColumns=this.columns.filter((({name:t,status:e})=>e!==Io.deleted&&-1===this.hiddenColumnNames.indexOf(t)&&-1===this.deletedColumnNames.indexOf(t)))}constructor(){super(),this.selectableRows=!1,this.keyboardShortcuts=!1,this.isNonInteractive=!1,this.outerBorder=!1,this.hiddenColumnNames=[],this.deletedColumnNames=[],this.renamedColumnNames={},this.pluginAttributes="",this.readonly=!1,this.blankFill=!1,this.columnWidthOffsets={},this.addableColumns=!1,this.scrollableEl=Gt(),this.rows=[],this.newRows=[],this.existingVisibleRows=[],this.allRowsSelected=!1,this.columns=[],this.visibleColumns=[],this.selectedRowUUIDs=new Set,this.removedRowUUIDs=new Set,this.rowHeight=38,this.visibleEndIndex=0,this.visibleStartIndex=0,this.fromIdToRowMap={},this._previousWidth=0,this.updateTableView=this.updateTableView.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}addNewRow(t){const e={id:t?.id??self.crypto.randomUUID(),values:t?.values??{},originalValues:t?.originalValues??{},isNew:t?.isNew??!0};return this.rows=[...this.rows,e],this.dispatchEvent(new ei(e)),e}addNewColumn(t){const e={is_nullable:!1,name:t,position:this.columns.length,model:"column",type:Mo.TEXT,unique:!1,primaryKey:!1,autoIncrement:!1,status:Io.created};this.columns=[...this.columns,e],this.rows=this.rows.map((e=>({...e,values:{...e.values,[t]:""}}))),this.dispatchEvent(new Ko({name:t})),this.updateVisibleColumns()}toggleSelectedRow(t){const e=this.selectedRowUUIDs;e.has(t)?e.delete(t):e.add(t),this.requestUpdate("selectedRowUUIDs")}clearSelection(){this.selectedRowUUIDs=new Set,this.removedRowUUIDs=new Set,this.shadowRoot?.querySelectorAll(".row-select-checkbox").forEach((t=>{t.checked=!1,t.dispatchEvent(new Event("change"))}))}deleteSelectedRows(){this.selectedRowUUIDs.forEach((t=>this.removedRowUUIDs.add(t)));const t=[];this.selectedRowUUIDs.forEach((e=>{const r=this.rows.find((({id:t})=>e===t));r&&t.push(r)})),this.dispatchEvent(new ri(t)),this.selectedRowUUIDs=new Set,this.requestUpdate("removedRowUUIDs")}resetParams(){this.clearSelection(),this.hiddenColumnNames=[]}_onColumnRemoved({name:t}){this.deletedColumnNames.push(t),this.requestUpdate("columns"),this.updateVisibleColumns()}_onColumnHidden({name:t}){this.hiddenColumnNames.push(t),this.requestUpdate("columns"),this.updateVisibleColumns()}_onRowSelection(){const t=[];this.selectedRowUUIDs.forEach((e=>{const r=this.fromIdToRowMap[e];r&&t.push(r)})),this.dispatchEvent(new oi(t))}widthForColumnType(t,e=0){const r=this.visibleColumns.find((({name:e})=>t===e))?.type?.toUpperCase();return[Mo.BIGINT,Mo.DECIMAL,Mo.DECIMAL,Mo.DOUBLE_PRECISION,Mo.INTEGER,Mo.NUMERIC,Mo.REAL,Mo.SMALLINT,Mo.INT].includes(r)?150+e:[Mo.CHAR,Mo.TEXT,Mo.VARCHAR,Mo.VARYING].includes(r)?200+e:[Mo.TIME,Mo.DATE,Mo.TIMESTAMP].includes(r)?110+e:[Mo.TIME_WITH_TIME_ZONE,Mo.DATETIME,Mo.TIMESTAMP_WITH_TIME_ZONE].includes(r)||[Mo.JSON,Mo.JSONB].includes(r)?200+e:[Mo.UUID].includes(r)?300+e:200+e}onKeyDown(t){const e=t.composedPath()[0];if(!(e instanceof HTMLElement&&"INPUT"!==e.tagName&&"TEXTAREA"!==e.tagName))return;const{shiftKey:r,key:o}=t;if(r){if("C"===o){const t=`Column ${Date.now()}`,e=prompt("Choose a unique name for this column",t)||t;this.addNewColumn(e)}"R"===o&&this.addNewRow(),"D"===o&&this.deleteSelectedRows()}}_onColumnResizeStart(){const t=this.shadowRoot?.getElementById("table");if(!t)throw new Error("Unexpectedly missing a table");this._previousWidth=t.clientWidth}_onColumnResized({delta:t}){const e=this.shadowRoot?.getElementById("table");if(!e)throw new Error("Unexpectedly missing a table");e.style.width=`${this._previousWidth+t}px`}_onColumnPluginDeactivated({column:t}){this.installedPlugins&&(delete this.installedPlugins[t],this.requestUpdate("installedPlugins"))}setCssVariablesForPlugin(t){"undefined"!=typeof document&&(t==zo.dark?(document.documentElement.style.setProperty("--ob-background-color","#0A0A0A"),document.documentElement.style.setProperty("--ob-text-color","#D4D4D4"),document.documentElement.style.setProperty("--ob-border-color","#262626"),document.documentElement.style.setProperty("--ob-null-text-color","#959497")):(document.documentElement.style.setProperty("--ob-background-color","#FAFAFA"),document.documentElement.style.setProperty("--ob-text-color","#525252"),document.documentElement.style.setProperty("--ob-border-color","#E5E5E5"),document.documentElement.style.setProperty("--ob-null-text-color","#D0D0D0")),document.documentElement.style.setProperty("--ob-font-family",'"Inter", sans-serif'),document.documentElement.style.setProperty("--ob-cell-font-family",'"Inter", sans-serif'))}renderRows(t){return V`${wi(t,(({id:t})=>t),(({id:t,values:e,originalValues:r,isNew:o},i)=>this.removedRowUUIDs.has(t)?null:V`<astra-tr .selected=${this.selectedRowUUIDs.has(t)} ?new=${o} @on-selection=${this._onRowSelection}>
              <!-- checkmark cell -->
              ${this.selectableRows?V`<astra-td
                    .position=${{row:t,column:"__selected"}}
                    .type=${null}
                    theme=${this.theme}
                    ?separate-cells=${!0}
                    ?draw-right-border=${!0}
                    ?bottom-border=${!0}
                    ?outer-border=${this.outerBorder}
                    ?blank=${!0}
                    ?is-last-row=${i===this.rows.length-1}
                    ?is-last-column=${!1}
                    ?row-selector="${!0}"
                    ?read-only=${!0}
                    ?interactive=${!0}
                    width="42px"
                  >
                    <div class="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center h-full">
                      <check-box
                        ?checked="${this.selectedRowUUIDs.has(t)}"
                        @toggle-check="${()=>this.toggleSelectedRow(t)}"
                        theme=${this.theme}
                      />
                    </div>
                  </astra-td>`:null}

              <!-- render a TableCell for each column of data in the current row -->
              ${wi(this.visibleColumns,(({name:t})=>t),(({name:s},n)=>{const a=this.plugins?.find((({pluginWorkspaceId:t})=>t===this.installedPlugins?.[s]?.plugin_workspace_id)),l=this.plugins?.find((({id:t})=>t===this.installedPlugins?.[s]?.plugin_installation_id)),c=a??l;return V`
                    <!-- TODO @johnny remove separate-cells and instead rely on css variables to suppress borders -->
                    <!-- TODO @caleb & johnny move plugins to support the new installedPlugins variable -->
                    <astra-td
                      .position=${{row:t,column:s}}
                      .value=${e[s]}
                      .originalValue=${r[s]}
                      width="${this.widthForColumnType(s,this.columnWidthOffsets[s])}px"
                      theme=${this.theme}
                      type=${this.columnTypes?.[s]}
                      .plugin=${c}
                      plugin-attributes=${this.installedPlugins?.[s]?.supportingAttributes??""}
                      ?separate-cells=${!0}
                      ?draw-right-border=${!0}
                      ?bottom-border=${!0}
                      ?outer-border=${this.outerBorder}
                      ?is-last-row=${i===this.rows.length-1}
                      ?is-last-column=${n===this.visibleColumns.length-1}
                      ?is-first-row=${0===i}
                      ?is-first-column=${0===n}
                      ?menu=${!this.isNonInteractive&&!this.readonly}
                      ?selectable-text=${this.isNonInteractive}
                      ?interactive=${!this.isNonInteractive}
                      ?hide-dirt=${o}
                      ?read-only=${this.readonly}
                    >
                    </astra-td>
                  `}))}
              ${this.blankFill?V`<astra-td ?outer-border=${!1} ?read-only=${!0} ?separate-cells=${!1} ?bottom-border=${!0} ?interactive=${!1} ?menu=${!1} ?blank=${!0}></<astra-td>`:""}
            </astra-tr>`))}`}updateTableView(){const t=this.scrollableEl?.value?.scroller?.value?.scrollTop??0;t?this.updateVisibleRows(t):setTimeout((()=>this.updateVisibleRows(0)),0)}updateVisibleRows(t){const e=this.rows.filter((({isNew:t})=>!t)),r=Math.max(Math.floor((t??0)/this.rowHeight)-ps,0);this.visibleStartIndex!==r&&(this.visibleStartIndex=r);const o=r+this.numberOfVisibleRows()+2*ps,i=o<e.length?o:e.length;this.visibleEndIndex!==i&&(this.visibleEndIndex=i),this.visibleStartIndex===r&&this.visibleEndIndex===i&&this.existingVisibleRows.length===r-i||(this.existingVisibleRows=e.slice(r,i))}numberOfVisibleRows(){return Math.ceil((this.scrollableEl?.value?.scroller?.value?.clientHeight??0)/this.rowHeight)+1}firstUpdated(t){this.keyboardShortcuts&&document.addEventListener("keydown",this.onKeyDown);const e=this.shadowRoot?.getElementById("table");if(!e)throw new Error("Unexpectedly missing a table");this._previousWidth=e.clientWidth,e.style.width=`${this._previousWidth}px`;const r=document.createElement("astra-td");r.withBottomBorder=!0,r.outerBorder=this.outerBorder,r.isInteractive=!0,this.scrollableEl?.value?.appendChild(r),setTimeout((()=>{const t=r.offsetHeight;this.scrollableEl?.value?.removeChild(r),this.rowHeight!==t&&(this.rowHeight=t)}),0)}willUpdate(t){var e,r,o;if(super.willUpdate(t),t.has("schema")&&this.schema&&(this.columns=this.schema.columns,this.columnTypes=(e=this.columns,r="name",o="type",e.reduce(((t,e)=>({...t,[e[r]]:e[o]})),{})),this.updateVisibleColumns()),t.has("theme")&&this.setCssVariablesForPlugin(this.theme),t.has("selectedRowUUIDs")){if(0===this.rows.length)return;this.selectedRowUUIDs.size!==this.rows.length&&this.allRowsSelected?this.allRowsSelected=!1:this.selectedRowUUIDs.size!==this.rows.length||this.allRowsSelected||(this.allRowsSelected=!0)}if(t.has("rows")){const t={};this.rows.forEach((e=>{t[e.id]=e})),this.fromIdToRowMap=t,this.newRows=this.rows.filter((({isNew:t})=>t)),this.updateTableView()}}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.onKeyDown)}render(){const t=this.rows.length>0?V`<check-box
            theme=${this.theme}
            ?checked=${this.allRowsSelected}
            @click=${t=>{t.preventDefault()}}
            @toggle-check=${()=>{this.rows.length===this.selectedRowUUIDs.size?(this.selectedRowUUIDs=new Set,this.allRowsSelected=!1):(this.selectedRowUUIDs=new Set(this.rows.map((({id:t})=>t))),this.allRowsSelected=!0),this._onRowSelection()}}
          />`:"";return V`
            <astra-scroll-area ${te(this.scrollableEl)}
                threshold=${ps/2*this.rowHeight}
                theme=${this.theme}
                .onScroll=${this.updateTableView}
            >
                <div
                    id="table"
                    class=${Mt({"table table-fixed bg-theme-table dark:bg-theme-table-dark":!0,"text-theme-text dark:text-theme-text-dark text-sm":!0,"min-w-full":!0,relative:!0})}
                    @menuopen=${t=>{this.closeLastMenu!==t.close&&(this.closeLastMenu?.(),this.closeLastMenu=t.close)}}
                >
                    <astra-thead>
                        <astra-tr header>
                            <!-- first column of (optional) checkboxes -->
                            ${this.selectableRows?V`<astra-th
                              theme=${this.theme}
                              table-height=${_i(this._height)}                              width="42px"
                              .value=${null} .originalValue=${null}
                              
                              ?separate-cells=${!0}
                              ?outer-border=${this.outerBorder}
                              ?is-last-column=${0===this.visibleColumns.length}
                              ?blank=${!0}
                              ?read-only=${this.readonly}
                          /><div class="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center h-full">
                          ${t}
                      </div></astra-th>`:null}
                            ${wi(this.visibleColumns,(({name:t},e)=>t),(({name:t},e)=>V`<astra-th
                                  .options=${this.columnOptions||F}
                                  .plugins="${this.plugins}"
                                  installed-plugins=${JSON.stringify(this.installedPlugins)}
                                  table-height=${_i(this._height)}
                                  theme=${this.theme}
                                  value="${this.renamedColumnNames[t]??t}"
                                  original-value="${t}"
                                  width="${this.widthForColumnType(t,this.columnWidthOffsets[t])}px"
                                  ?separate-cells=${!0}
                                  ?outer-border=${this.outerBorder}
                                  ?menu=${!this.isNonInteractive&&!this.readonly}
                                  ?with-resizer=${!this.isNonInteractive}
                                  ?is-first-column=${0===e}
                                  ?is-last-column=${e===this.visibleColumns.length-1}
                                  ?removable=${!0}
                                  ?interactive=${!this.isNonInteractive}
                                  @column-hidden=${this._onColumnHidden}
                                  @column-removed=${this._onColumnRemoved}
                                  @column-plugin-deactivated=${this._onColumnPluginDeactivated}
                                  @resize-start=${this._onColumnResizeStart}
                                  @resize=${this._onColumnResized}
                                  ?read-only=${this.readonly}
                                >
                                </astra-th>`))}
                            ${this.blankFill?V`<astra-th ?outer-border=${this.outerBorder} ?read-only=${!0} fill .value=${null} .originalValue=${null}>
                            ${this.isNonInteractive||!this.addableColumns?"":V`<span class="flex items-center absolute top-0 left-2 bottom-0 right-0">
                                    <astra-add-column-trigger></astra-add-column-trigger>
                                  </span>`}
                            </<astra-th>`:""}
                        </astra-tr>
                    </astra-thead>

                    <astra-rowgroup>
                        <div
                            style=${oe({height:`${Math.max(this.visibleStartIndex*this.rowHeight,0)}px`,"will-change":"transform, height"})}
                        ></div>

                        <!-- render a TableRow element for each row of data -->
                        ${this.renderRows(this.newRows)} ${this.renderRows(this.existingVisibleRows)}

                    <div
                        style=${oe({height:`${Math.max((this.rows.length-this.visibleEndIndex)*this.rowHeight,0)}px`,"will-change":"transform, height"})}
                    ></div>
                </astra-rowgroup>
            </div>
        </div>`}};us([ut({type:Boolean,attribute:"selectable-rows"})],gs.prototype,"selectableRows",void 0),us([ut({attribute:"keyboard-shortcuts",type:Boolean})],gs.prototype,"keyboardShortcuts",void 0),us([ut({attribute:"schema",type:Object})],gs.prototype,"schema",void 0),us([ut({attribute:"data",type:Array})],gs.prototype,"data",null),us([ut({attribute:"plugins",type:Array})],gs.prototype,"plugins",void 0),us([ut({attribute:"installed-plugins",type:Array})],gs.prototype,"installedPlugins",void 0),us([ut({attribute:"non-interactive",type:Boolean})],gs.prototype,"isNonInteractive",void 0),us([ut({attribute:"auth-token",type:String})],gs.prototype,"authToken",void 0),us([ut({attribute:"column-options",type:Array})],gs.prototype,"columnOptions",void 0),us([ut({attribute:"outer-border",type:Boolean})],gs.prototype,"outerBorder",void 0),us([ut({attribute:"hidden-columns",type:Array})],gs.prototype,"hiddenColumnNames",void 0),us([ut({attribute:"deleted-columns",type:Array})],gs.prototype,"deletedColumnNames",void 0),us([ut({attribute:"renamed-columns",type:Object})],gs.prototype,"renamedColumnNames",void 0),us([ut({attribute:"plugin-attributes",type:String})],gs.prototype,"pluginAttributes",void 0),us([ut({attribute:"read-only",type:Boolean})],gs.prototype,"readonly",void 0),us([ut({attribute:"blank-fill",type:Boolean})],gs.prototype,"blankFill",void 0),us([ut({attribute:"column-width-offsets",type:Object})],gs.prototype,"columnWidthOffsets",void 0),us([ut({attribute:"addable-columns",type:Boolean})],gs.prototype,"addableColumns",void 0),us([pt()],gs.prototype,"scrollableEl",void 0),us([pt()],gs.prototype,"rows",void 0),us([pt()],gs.prototype,"newRows",void 0),us([pt()],gs.prototype,"existingVisibleRows",void 0),us([pt()],gs.prototype,"allRowsSelected",void 0),us([pt()],gs.prototype,"columns",void 0),us([pt()],gs.prototype,"visibleColumns",void 0),us([pt()],gs.prototype,"selectedRowUUIDs",void 0),us([pt()],gs.prototype,"removedRowUUIDs",void 0),us([pt()],gs.prototype,"columnTypes",void 0),us([pt()],gs.prototype,"rowHeight",void 0),us([pt()],gs.prototype,"visibleEndIndex",void 0),us([pt()],gs.prototype,"visibleStartIndex",void 0),us([pt()],gs.prototype,"_height",void 0),gs=us([ct("astra-table")],gs);var bs=gs;return t.AstraButton=xt,t.AstraCard=Et,t.AstraInput=Rt,t.AstraLabel=Tt,t.AstraScrollArea=fi,t.AstraSelect=$i,t.AstraTable=bs,t}({});
