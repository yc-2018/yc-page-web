import{R as r,r as B,c as s,e as le,d as o,_ as te,f as q}from"./index-B0C6OQY_.js";function re(e){return!!(e.addonBefore||e.addonAfter)}function ie(e){return!!(e.prefix||e.suffix||e.allowClear)}function z(e,a,l){var d=a.cloneNode(!0),u=Object.create(e,{target:{value:d},currentTarget:{value:d}});return d.value=l,typeof a.selectionStart=="number"&&typeof a.selectionEnd=="number"&&(d.selectionStart=a.selectionStart,d.selectionEnd=a.selectionEnd),d.setSelectionRange=function(){a.setSelectionRange.apply(a,arguments)},u}function ce(e,a,l,d){if(l){var u=a;if(a.type==="click"){u=z(a,e,""),l(u);return}if(e.type!=="file"&&d!==void 0){u=z(a,e,d),l(u);return}l(u)}}function se(e,a){if(e){e.focus(a);var l=a||{},d=l.cursor;if(d){var u=e.value.length;switch(d){case"start":e.setSelectionRange(0,0);break;case"end":e.setSelectionRange(u,u);break;default:e.setSelectionRange(0,u)}}}}var oe=r.forwardRef(function(e,a){var l,d,u,J=e.inputElement,N=e.children,v=e.prefixCls,W=e.prefix,y=e.suffix,C=e.addonBefore,O=e.addonAfter,K=e.className,L=e.style,E=e.disabled,j=e.readOnly,Q=e.focused,b=e.triggerFocus,c=e.allowClear,R=e.value,h=e.handleReset,U=e.hidden,i=e.classes,n=e.classNames,w=e.dataAttrs,f=e.styles,t=e.components,g=e.onClear,D=N??J,X=(t==null?void 0:t.affixWrapper)||"span",Y=(t==null?void 0:t.groupWrapper)||"span",Z=(t==null?void 0:t.wrapper)||"span",F=(t==null?void 0:t.groupAddon)||"span",A=B.useRef(null),V=function(x){var k;(k=A.current)!==null&&k!==void 0&&k.contains(x.target)&&(b==null||b())},I=ie(e),m=B.cloneElement(D,{value:R,className:s((l=D.props)===null||l===void 0?void 0:l.className,!I&&(n==null?void 0:n.variant))||null}),G=B.useRef(null);if(r.useImperativeHandle(a,function(){return{nativeElement:G.current||A.current}}),I){var M=null;if(c){var P=!E&&!j&&R,S="".concat(v,"-clear-icon"),ee=le(c)==="object"&&c!==null&&c!==void 0&&c.clearIcon?c.clearIcon:"✖";M=r.createElement("button",{type:"button",onClick:function(x){h==null||h(x),g==null||g()},onMouseDown:function(x){return x.preventDefault()},className:s(S,o(o({},"".concat(S,"-hidden"),!P),"".concat(S,"-has-suffix"),!!y))},ee)}var p="".concat(v,"-affix-wrapper"),ne=s(p,o(o(o(o(o({},"".concat(v,"-disabled"),E),"".concat(p,"-disabled"),E),"".concat(p,"-focused"),Q),"".concat(p,"-readonly"),j),"".concat(p,"-input-with-clear-btn"),y&&c&&R),i==null?void 0:i.affixWrapper,n==null?void 0:n.affixWrapper,n==null?void 0:n.variant),ae=(y||c)&&r.createElement("span",{className:s("".concat(v,"-suffix"),n==null?void 0:n.suffix),style:f==null?void 0:f.suffix},M,y);m=r.createElement(X,te({className:ne,style:f==null?void 0:f.affixWrapper,onClick:V},w==null?void 0:w.affixWrapper,{ref:A}),W&&r.createElement("span",{className:s("".concat(v,"-prefix"),n==null?void 0:n.prefix),style:f==null?void 0:f.prefix},W),m,ae)}if(re(e)){var _="".concat(v,"-group"),T="".concat(_,"-addon"),$="".concat(_,"-wrapper"),de=s("".concat(v,"-wrapper"),_,i==null?void 0:i.wrapper,n==null?void 0:n.wrapper),ue=s($,o({},"".concat($,"-disabled"),E),i==null?void 0:i.group,n==null?void 0:n.groupWrapper);m=r.createElement(Y,{className:ue,ref:G},r.createElement(Z,{className:de},C&&r.createElement(F,{className:T},C),m,O&&r.createElement(F,{className:T},O)))}return r.cloneElement(m,{className:s((d=m.props)===null||d===void 0?void 0:d.className,K)||null,style:q(q({},(u=m.props)===null||u===void 0?void 0:u.style),L),hidden:U})});export{oe as B,ce as r,se as t};
