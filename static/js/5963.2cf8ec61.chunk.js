"use strict";(self.webpackChunkantd_demo=self.webpackChunkantd_demo||[]).push([[5963,3588],{3624:(t,e,n)=>{n.d(e,{Z:()=>s});var a=n(41583),r=n(80184);const s=t=>{let{children:e,items:n=[{label:"\u7f16\u8f91",key:"EDIT"},{label:"\u5220\u9664",key:"DELETE"}],tag:s,lambdaObj:o}=t;return(0,r.jsx)(a.Z,{trigger:["contextMenu"],menu:{items:n,onClick:t=>null===o||void 0===o?void 0:o[t.key](s)},onContextMenu:t=>t.preventDefault(),children:e})}},82307:(t,e,n)=>{n.d(e,{Z:()=>c});n(72791);var a=n(25216),r=n(43893),s=n(68218),o=n(80184);const i=t=>{let{dndIds:e,setItems:n,storageName:s,style:i,children:c,dragEndFunc:d}=t;const l=[(0,a.VT)(a.we)];return(0,o.jsx)("div",{style:i||{display:"flex",flexWrap:"wrap",flexDirection:"row",gap:"0"},children:(0,o.jsx)(a.LB,{sensors:l,collisionDetection:a.pE,onDragEnd:t=>{const{active:e,over:a}=t;e.id!==a.id&&n((t=>{const n=t.findIndex((t=>t.id===e.id)),o=t.findIndex((t=>t.id===a.id)),i=(0,r.Rp)(t,n,o);return s&&localStorage.setItem(s+"_idList",JSON.stringify(i.map((t=>t.id)))),d&&d(i),i}))},children:(0,o.jsx)(r.Fo,{items:null!==e&&void 0!==e&&e[0].id?e.map((t=>t.id)):e,children:c})})})};i.Item=function(t){let{id:e,drag:n,children:a,styles:i={},className:c=""}=t;const{attributes:d,listeners:l,setNodeRef:m,transform:f,transition:u}=(0,r.nB)({id:e}),p={transform:s.ux.Transform.toString(f),transition:u,...i};return n?(0,o.jsxs)("div",{ref:m,style:p,...d,className:c,children:[(0,o.jsx)("span",{...l,className:"mouseMove",children:n}),(0,o.jsx)("span",{className:"pointer",children:a})]}):(0,o.jsx)("div",{ref:m,style:p,...d,...l,className:"mouseMove".concat(" "+c),children:a})};const c=i},87603:(t,e,n)=>{n.r(e),n.d(e,{default:()=>u});var a=n(72791),r=n(2556),s=n(98483),o=n(3588),i=n(82307),c=n(60104),d=n(22567),l=n(87203),m=n(3624),f=n(80184);const u=t=>{let{bookmarkItems:e,setModal:n,groupId:u,setGroup:p}=t;const[g,v]=(0,a.useState)(e),{msg:y}=d.default,h=()=>(0,f.jsx)(r.ZP,{type:"dashed",block:!0,size:"small",onClick:()=>{n(!0,2),p(u,v)},children:"\u2795"}),O=(0,l.default)(v,n,(()=>p(u,v)));return g.length>0?(0,f.jsxs)(i.Z,{dndIds:g,setItems:v,style:{},dragEndFunc:async t=>{const e=[...g],n=t.map((t=>t.id)).join("/");await(0,c.vc)({id:u,type:1,sort:n})?y.success("\u6392\u5e8f\u6210\u529f"):v(e)},children:[g.map((t=>{return(0,f.jsx)(i.Z.Item,{id:t.id,drag:(e=t.url.match(/^(?:https?:\/\/)?([^\/]+)/),(0,f.jsx)(s.Z,{width:18,height:18,preview:!1,src:e[0]+"/favicon.ico",fallback:"https://api.iowen.cn/favicon/".concat(e[1],".png")})),className:o.default.dndItem,children:(0,f.jsx)(m.Z,{tag:t,lambdaObj:O,children:(0,f.jsx)(r.ZP,{type:"link",href:t.url,className:o.default.dndContent,target:"_blank",children:t.name})})},t.id);var e})),e.length<16&&h()]}):h()}},87203:(t,e,n)=>{n.r(e),n.d(e,{default:()=>c});var a=n(10187),r=n(60104),s=(n(72791),n(22567)),o=n(17896),i=n(80184);const c=function(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;const{msg:c}=s.default,{modal:d}=o.Z.useApp();return{EDIT:t=>{e(!0,t.type,t),n&&n()},DELETE:e=>d.confirm({title:"\u786e\u5b9a\u5220\u9664\u5417?",icon:(0,i.jsx)(a.Z,{}),content:"\u5220\u9664\u4e86\u5c31\u771f\u7684\u6d88\u5931\u4e86",confirmLoading:!0,async onOk(){try{await new Promise((async(n,a)=>await(0,r.K8)(e)?(t((t=>t.filter((t=>t.id!==e.id)))),n()):a()))}catch(n){c.error("\u5220\u9664\u5f02\u5e38")}}})}}},77268:(t,e,n)=>{n.d(e,{Z:()=>c,i:()=>i});var a=n(72791),r=n(75179),s=n(67049),o=n(71929);function i(t){return e=>a.createElement(s.ZP,{theme:{token:{motion:!1,zIndexPopupBase:0}}},a.createElement(t,Object.assign({},e)))}const c=(t,e,n,s)=>i((i=>{const{prefixCls:c,style:d}=i,l=a.useRef(null),[m,f]=a.useState(0),[u,p]=a.useState(0),[g,v]=(0,r.Z)(!1,{value:i.open}),{getPrefixCls:y}=a.useContext(o.E_),h=y(e||"select",c);a.useEffect((()=>{if(v(!0),"undefined"!==typeof ResizeObserver){const t=new ResizeObserver((t=>{const e=t[0].target;f(e.offsetHeight+8),p(e.offsetWidth)})),e=setInterval((()=>{var a;const r=n?".".concat(n(h)):".".concat(h,"-dropdown"),s=null===(a=l.current)||void 0===a?void 0:a.querySelector(r);s&&(clearInterval(e),t.observe(s))}),10);return()=>{clearInterval(e),t.disconnect()}}}),[]);let O=Object.assign(Object.assign({},i),{style:Object.assign(Object.assign({},d),{margin:0}),open:g,visible:g,getPopupContainer:()=>l.current});s&&(O=s(O));const E={paddingBottom:m,position:"relative",minWidth:u};return a.createElement("div",{ref:l,style:E},a.createElement(t,Object.assign({},O)))}))},25390:(t,e,n)=>{n.d(e,{Fm:()=>f});var a=n(8262),r=n(18303);const s=new a.E4("antMoveDownIn",{"0%":{transform:"translate3d(0, 100%, 0)",transformOrigin:"0 0",opacity:0},"100%":{transform:"translate3d(0, 0, 0)",transformOrigin:"0 0",opacity:1}}),o=new a.E4("antMoveDownOut",{"0%":{transform:"translate3d(0, 0, 0)",transformOrigin:"0 0",opacity:1},"100%":{transform:"translate3d(0, 100%, 0)",transformOrigin:"0 0",opacity:0}}),i=new a.E4("antMoveLeftIn",{"0%":{transform:"translate3d(-100%, 0, 0)",transformOrigin:"0 0",opacity:0},"100%":{transform:"translate3d(0, 0, 0)",transformOrigin:"0 0",opacity:1}}),c=new a.E4("antMoveLeftOut",{"0%":{transform:"translate3d(0, 0, 0)",transformOrigin:"0 0",opacity:1},"100%":{transform:"translate3d(-100%, 0, 0)",transformOrigin:"0 0",opacity:0}}),d=new a.E4("antMoveRightIn",{"0%":{transform:"translate3d(100%, 0, 0)",transformOrigin:"0 0",opacity:0},"100%":{transform:"translate3d(0, 0, 0)",transformOrigin:"0 0",opacity:1}}),l=new a.E4("antMoveRightOut",{"0%":{transform:"translate3d(0, 0, 0)",transformOrigin:"0 0",opacity:1},"100%":{transform:"translate3d(100%, 0, 0)",transformOrigin:"0 0",opacity:0}}),m={"move-up":{inKeyframes:new a.E4("antMoveUpIn",{"0%":{transform:"translate3d(0, -100%, 0)",transformOrigin:"0 0",opacity:0},"100%":{transform:"translate3d(0, 0, 0)",transformOrigin:"0 0",opacity:1}}),outKeyframes:new a.E4("antMoveUpOut",{"0%":{transform:"translate3d(0, 0, 0)",transformOrigin:"0 0",opacity:1},"100%":{transform:"translate3d(0, -100%, 0)",transformOrigin:"0 0",opacity:0}})},"move-down":{inKeyframes:s,outKeyframes:o},"move-left":{inKeyframes:i,outKeyframes:c},"move-right":{inKeyframes:d,outKeyframes:l}},f=(t,e)=>{const{antCls:n}=t,a="".concat(n,"-").concat(e),{inKeyframes:s,outKeyframes:o}=m[e];return[(0,r.R)(a,s,o,t.motionDurationMid),{["\n        ".concat(a,"-enter,\n        ").concat(a,"-appear\n      ")]:{opacity:0,animationTimingFunction:t.motionEaseOutCirc},["".concat(a,"-leave")]:{animationTimingFunction:t.motionEaseInOutCirc}}]}},88302:(t,e,n)=>{n.d(e,{Z:()=>c});var a=n(87462),r=n(72791);const s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"}}]},name:"eye",theme:"outlined"};var o=n(28858),i=function(t,e){return r.createElement(o.Z,(0,a.Z)({},t,{ref:e,icon:s}))};const c=r.forwardRef(i)},3588:(t,e,n)=>{n.r(e),n.d(e,{default:()=>a});const a={dndItem:"bookmark_dndItem__MwsZ3",dndContent:"bookmark_dndContent__LB8hc"}}}]);
//# sourceMappingURL=5963.2cf8ec61.chunk.js.map