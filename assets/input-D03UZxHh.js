import{d as g,u as x,c as S,i as R}from"./index-CbZvnSSW.js";import{v as P,m as w,w as E,u as $}from"./index-C6qBGSQV.js";import{r as u,R as m,c as L}from"./index-B0C6OQY_.js";import{e as A,u as I}from"./index-CblStDFS.js";var N=function(t){return t.every(function(r){var l=g(r);return l?l.getRootNode()instanceof ShadowRoot:!1})},K=function(t){return t?t.getRootNode():document},O=function(t){if(!t||!document.getRootNode)return document;var r=Array.isArray(t)?t:[t];return N(r)?K(g(r[0])):document};function T(t,r,l){l===void 0&&(l="click");var i=x(t);S(function(){var e=function(c){var y=Array.isArray(r)?r:[r];y.some(function(C){var s=g(C);return!s||s.contains(c.target)})||i.current(c)},o=O(r),d=Array.isArray(l)?l:[l];return d.forEach(function(c){return o.addEventListener(c,e)}),function(){d.forEach(function(c){return o.removeEventListener(c,e)})}},Array.isArray(l)?l:[l],r)}function _(t){return u.createElement("svg",Object.assign({width:"1em",height:"1em",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink"},t,{style:Object.assign({verticalAlign:"-0.125em"},t.style),className:["antd-mobile-icon",t.className].filter(Boolean).join(" ")}),u.createElement("g",{id:"CloseCircleFill-CloseCircleFill",stroke:"none",strokeWidth:1,fill:"none",fillRule:"evenodd"},u.createElement("g",{id:"CloseCircleFill-编组"},u.createElement("rect",{id:"CloseCircleFill-矩形",fill:"#FFFFFF",opacity:0,x:0,y:0,width:48,height:48}),u.createElement("path",{d:"M24,2 C36.1502645,2 46,11.8497355 46,24 C46,36.1502645 36.1502645,46 24,46 C11.8497355,46 2,36.1502645 2,24 C2,11.8497355 11.8497355,2 24,2 Z M18.6753876,16 L15.5637812,16 C15.4576916,16 15.3559474,16.0421451 15.2809323,16.1171635 C15.124726,16.2733766 15.1247316,16.5266426 15.2809447,16.6828489 L15.2809447,16.6828489 L22.299066,23.7006641 L14.6828159,31.3171619 C14.6078042,31.3921761 14.5656632,31.4939157 14.5656632,31.6 C14.5656632,31.8209139 14.7447493,32 14.9656632,32 L14.9656632,32 L18.0753284,32 C18.1814068,32 18.2831412,31.9578638 18.3581544,31.8828594 L18.3581544,31.8828594 L24.420066,25.8216641 L30.4818451,31.8828564 C30.5568585,31.9578626 30.6585942,32 30.7646741,32 L30.7646741,32 L33.8763476,32 C33.9824309,32 34.0841695,31.9578599 34.1591835,31.8828496 C34.315397,31.7266436 34.3154031,31.4733776 34.1591972,31.3171641 L34.1591972,31.3171641 L26.542066,23.6996641 L33.5591874,16.6828489 C33.6342057,16.6078338 33.6763508,16.5060896 33.6763508,16.4 C33.6763508,16.1790861 33.4972647,16 33.2763508,16 L33.2763508,16 L30.1637654,16 C30.0576705,16 29.9559218,16.0421493 29.8809058,16.1171741 L29.8809058,16.1171741 L24.420066,21.5786641 L18.9582218,16.1171488 C18.883208,16.0421394 18.7814701,16 18.6753876,16 L18.6753876,16 Z",id:"CloseCircleFill-形状结合",fill:"currentColor",fillRule:"nonzero"}))))}function B(t,r,l){let i=t;return r!==void 0&&(i=Math.max(t,r)),l!==void 0&&(i=Math.min(i,l)),i}let p=null,h=null;P&&(p=document.createElement("div"),p.className="adm-px-tester",p.style.setProperty("--size","10"),document.body.appendChild(p),h=document.createElement("div"),h.className="adm-px-tester",document.body.appendChild(h));function U(t){return p===null||h===null||p.getBoundingClientRect().height===10?t:(h.style.setProperty("--size",t.toString()),h.getBoundingClientRect().height)}const f="adm-space",D={direction:"horizontal"},Z=t=>{const r=w(D,t),{direction:l,onClick:i}=r;return E(r,m.createElement("div",{className:L(f,{[`${f}-wrap`]:r.wrap,[`${f}-block`]:r.block,[`${f}-${l}`]:!0,[`${f}-align-${r.align}`]:!!r.align,[`${f}-justify-${r.justify}`]:!!r.justify}),onClick:i},m.Children.map(r.children,e=>e!=null&&m.createElement("div",{className:`${f}-item`},e))))};function M({onEnterPress:t,onKeyDown:r,nativeInputRef:l,enterKeyHint:i}){const e=o=>{t&&(o.code==="Enter"||o.keyCode===13)&&t(o),r==null||r(o)};return A(()=>{const o=l.current;if(!(!i||!o))return o.setAttribute("enterkeyhint",i),()=>{o.removeAttribute("enterkeyhint")}},[i]),e}const v="adm-input",j={defaultValue:"",clearIcon:m.createElement(_,null),onlyShowClearWhenFocus:!0},X=u.forwardRef((t,r)=>{const{locale:l,input:i={}}=I(),e=w(j,i,t),[o,d]=$(e),[c,y]=u.useState(!1),C=u.useRef(!1),s=u.useRef(null),b=M({onEnterPress:e.onEnterPress,onKeyDown:e.onKeyDown,nativeInputRef:s,enterKeyHint:e.enterKeyHint});u.useImperativeHandle(r,()=>({clear:()=>{d("")},focus:()=>{var n;(n=s.current)===null||n===void 0||n.focus()},blur:()=>{var n;(n=s.current)===null||n===void 0||n.blur()},get nativeElement(){return s.current}}));function F(){let n=o;if(e.type==="number"){const a=n&&B(parseFloat(n),e.min,e.max).toString();Number(n)!==Number(a)&&(n=a)}n!==o&&d(n)}const k=!e.clearable||!o||e.readOnly?!1:e.onlyShowClearWhenFocus?c:!0;return E(e,m.createElement("div",{className:L(`${v}`,e.disabled&&`${v}-disabled`)},m.createElement("input",{ref:s,className:`${v}-element`,value:o,onChange:n=>{d(n.target.value)},onFocus:n=>{var a;y(!0),(a=e.onFocus)===null||a===void 0||a.call(e,n)},onBlur:n=>{var a;y(!1),F(),(a=e.onBlur)===null||a===void 0||a.call(e,n)},onPaste:e.onPaste,id:e.id,placeholder:e.placeholder,disabled:e.disabled,readOnly:e.readOnly,maxLength:e.maxLength,minLength:e.minLength,max:e.max,min:e.min,autoComplete:e.autoComplete,enterKeyHint:e.enterKeyHint,autoFocus:e.autoFocus,pattern:e.pattern,inputMode:e.inputMode,type:e.type,name:e.name,autoCapitalize:e.autoCapitalize,autoCorrect:e.autoCorrect,onKeyDown:b,onKeyUp:e.onKeyUp,onCompositionStart:n=>{var a;C.current=!0,(a=e.onCompositionStart)===null||a===void 0||a.call(e,n)},onCompositionEnd:n=>{var a;C.current=!1,(a=e.onCompositionEnd)===null||a===void 0||a.call(e,n)},onClick:e.onClick,step:e.step,role:e.role,"aria-valuenow":e["aria-valuenow"],"aria-valuemax":e["aria-valuemax"],"aria-valuemin":e["aria-valuemin"],"aria-label":e["aria-label"]}),k&&m.createElement("div",{className:`${v}-clear`,onMouseDown:n=>{n.preventDefault()},onClick:()=>{var n,a;d(""),(n=e.onClear)===null||n===void 0||n.call(e),R()&&C.current&&(C.current=!1,(a=s.current)===null||a===void 0||a.blur())},"aria-label":l.Input.clear},e.clearIcon)))});export{X as I,Z as S,M as a,B as b,U as c,T as u};
