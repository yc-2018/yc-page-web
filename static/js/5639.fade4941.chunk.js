(self.webpackChunkantd_demo=self.webpackChunkantd_demo||[]).push([[5639,6171],{69893:(e,a,n)=>{"use strict";n.r(a),n.d(a,{default:()=>q});var r=n(17896),t=n(43608),l=n(14520),o=n(41583),c=n(2556),s=n(64248),i=n(40959),u=n(6955),d=n(77128),h=n(45208),m=n(72791),g=n(77257),p=n(65447),w=n(79286),f=n(60104),v=n(20005),b=n(45226),k=n(13097),y=n(80184);const{Search:x}=h.default,j=e=>{let{onSearch:a,setSearchValue:n}=e;const[r,t]=(0,m.useState)([]),l=(0,m.createRef)();let o;return(0,m.useEffect)((()=>l.current.focus()),[]),(0,y.jsx)(v.Z,{className:"inputOpacity",value:o,options:r,style:{width:500,margin:"5px 0 15px 0"},onChange:e=>{n(e),o=e},onSearch:async e=>t(await(0,f.sS)(e)),children:(0,y.jsx)(x,{size:"large",ref:l,onSearch:a,placeholder:"\u6c42\u77e5\u82e5\u6e34\uff0c\u89e3\u60d1\u5728\u65af\u3002",enterButton:[b.Z.searchEngines,(0,y.jsx)(k.Z,{},"\u641c\u7d22\u6309\u94ae")]})})};var S=n(63241),Z=n(64958),E=n(22567);n(96171);const C="searchOption";let I=!0;const q=(0,g.Pi)((function(){const[e,a]=(0,m.useState)(),[n,g]=(0,m.useState)(!1),[v,k]=(0,m.useState)(0),[x,q]=(0,m.useState)(void 0),[T,N]=(0,m.useState)(S.rg.filter((e=>0===e.isQuickSearch))),[U,B]=(0,m.useState)(S.rg.filter((e=>1===e.isQuickSearch))),[P,Q]=(0,m.useState)(""),[A,F]=(0,m.useState)(""),{msg:O}=E.default,{modal:R}=r.Z.useApp(),[M]=t.Z.useForm(),L=Z.default.jwt?[{label:"\u7f16\u8f91",key:"0"},{label:"\u5220\u9664",key:"1"}]:[{label:"\u767b\u5f55\u540e\u53ef\u4ee5\u5220\u9664/\u7f16\u8f91",key:"login",disabled:!0}];(0,m.useEffect)((()=>{Z.default.jwt&&(async()=>{const e=await(0,f.EE)();e&&(N(e.filter((e=>0===e.isQuickSearch))),B(e.filter((e=>1===e.isQuickSearch))),0===e.filter((e=>e.name===b.Z.searchEngines)).length&&b.Z.setSearchEngines(T[0].name))})()}),[Z.default.jwt]),(0,m.useEffect)((()=>{void 0!==x&&setTimeout((()=>M.resetFields()),100)}),[x]);const z=a=>{if(!e&&I)return I=!1,setTimeout((()=>I=!0),3e3),O.info("\u68c0\u6d4b\u5230\u641c\u7d22\u6846\u5185\u5bb9\u4e3a\u7a7a\u54e6~ \u771f\u60f3\u4e3a\u7a7a\u641c\u7d22\u4e09\u79d2\u5185\u518d\u6b21\u70b9\u51fb");if(a)window.open(a.replace("@@@",null!==e&&void 0!==e?e:""),"_blank");else{const a=T.find((e=>e.name===b.Z.searchEngines)).engineUrl;window.open(a.replace("@@@",null!==e&&void 0!==e?e:""),"_blank")}},V=e=>{q({}),k(e)},D=e=>{let{key:a}=e;if(A.length>10||A.includes("\n"))return O.info("\u8fd9\u4e48\u7ec6\u7684\u8fb9\u90fd\u88ab\u4f60\u70b9\u5230\u4e86\uff0c\u54c8\u54c8\u54c8\uff0c\u5f80\u91cc\u9762\u70b9\u70b9\u770b");"1"===a?R.confirm({title:"\u786e\u5b9a\u5220\u9664 ".concat(A," \u5417?"),content:"".concat(P===C?"\u641c\u7d22\u5f15\u64ce":"\u5feb\u901f\u641c\u7d22","\u5220\u9664\u4e86\u5c31\u627e\u4e0d\u56de\u6765\u4e86..."),async onOk(){if(P!==C){return await(0,f.TH)([U.find((e=>e.name===A)).id])&&B(U.filter((e=>e.name!==A)))}await(0,f.TH)([T.find((e=>e.name===A)).id])&&(N(T.filter((e=>e.name!==A))),A===b.Z.searchEngines&&b.Z.setSearchEngines(T[0].name===A?T[1].name:T[0].name))}}):q(P===C?T.find((e=>e.name===A)):U.find((e=>e.name===A)))},H=e=>{e.preventDefault(),"path"===e.target.tagName&&(e.target=e.target.parentElement),"svg"===e.target.tagName&&(e.target=e.target.parentElement),""===e.target.innerText&&(e.target=e.target.parentElement.parentElement),"DIV"===e.target.tagName?Q(C):Q("quickSearch"),F(e.target.innerText)};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(l.Z,{style:{margin:"5px 80px"},wrap:"wrap",gap:"small",justify:"center",children:[U.map((e=>(0,y.jsx)(o.Z,{menu:{items:L,onClick:D},trigger:["contextMenu"],onContextMenu:H,children:(0,y.jsx)(c.ZP,{className:"searchButton",icon:(0,y.jsx)(p.Z,{}),onClick:()=>z(e.engineUrl),style:{backgroundImage:b.Z.quickSearchIcon?"url(https://api.iowen.cn/favicon/".concat(e.engineUrl.match(/^(?:https?:\/\/)?([^\/]+)/)[1],".png)"):void 0,backgroundColor:"rgba(255, 255, 255, ".concat(.01*b.Z.searchIconTransparency,")")},children:e.name})},e.id))),Z.default.jwt&&(0,y.jsx)(c.ZP,{icon:(0,y.jsx)(w.Z,{}),className:"addButton",onClick:()=>V(1)})]}),(0,y.jsx)(j,{onSearch:()=>z(),setSearchValue:e=>a(e)}),(0,y.jsx)("br",{}),(0,y.jsx)(o.Z,{menu:{items:L,onClick:D},trigger:["contextMenu"],children:(0,y.jsx)(s.Z,{options:T.map((e=>e.name)),value:b.Z.searchEngines,onChange:e=>b.Z.setSearchEngines(e),onContextMenu:H})}),Z.default.jwt&&(0,y.jsx)(c.ZP,{icon:(0,y.jsx)(w.Z,{}),style:{margin:"0 3px"},className:"addButton",onClick:()=>V(0)}),(0,y.jsxs)(i.Z,{title:void 0===(null===x||void 0===x?void 0:x.isQuickSearch)?"".concat(v?"\u6dfb\u52a0\u5feb\u901f\u641c\u7d22\u5f15\u64ce":"\u6dfb\u52a0\u641c\u7d22\u5f15\u64ce"):1===(null===x||void 0===x?void 0:x.isQuickSearch)?"\u4fee\u6539\u5feb\u901f\u641c\u7d22\u5f15\u64ce":"\u4fee\u6539\u641c\u7d22\u5f15\u64ce",open:!!x,onOk:()=>{M.validateFields().then((async e=>{if(0===v&&0!==T.filter((a=>a.name===e.name)).length&&e.name!==(null===x||void 0===x?void 0:x.name))return O.error("\u666e\u901a\u641c\u7d22\u5f15\u64ce\u540d\u79f0\u4e0d\u5141\u8bb8\u6709\u76f8\u540c\u7684");if(1===v&&0!==U.filter((a=>a.name===e.name)).length&&e.name!==(null===x||void 0===x?void 0:x.name))return O.error("\u5feb\u901f\u641c\u7d22\u5f15\u64ce\u540d\u79f0\u4e0d\u5141\u8bb8\u6709\u76f8\u540c\u7684");g(!0);const a=null!==x&&void 0!==x&&x.id?[{...x,...e}]:{...e,isQuickSearch:v},n=null!==x&&void 0!==x&&x.id?await(0,f.Wx)(a):await(0,f.tB)(a);g(!1),n&&(null!==x&&void 0!==x&&x.id?0===x.isQuickSearch?N(_(...a,T)):B(_(...a,U)):0===v?N([...T,{...a,id:n}]):B([...U,{...a,id:n}]),q(void 0))})).catch((()=>g(!1)))},confirmLoading:n,onCancel:()=>q(x?void 0:{}),children:[!(null!==x&&void 0!==x&&x.id)&&(0,y.jsx)(u.Z,{description:(0,y.jsxs)(y.Fragment,{children:["\u63d0\u793a \u6dfb\u52a0\u641c\u7d22\u5f15\u64ce\u65f6\u7528@@@\u66ff\u4ee3\u4f60\u8981\u641c\u7d22\u7684\u5185\u5bb9\u54e6\uff0c\u6bd4\u5982\u767e\u5ea6\u7684\uff1a ",(0,y.jsx)(d.Z,{style:{color:"blue"},children:"https://www.baidu.com/s?wd=@@@"})]}),type:"success"}),(0,y.jsx)("br",{}),(0,y.jsxs)(t.Z,{form:M,labelCol:{span:6},wrapperCol:{span:16},style:{maxWidth:600},initialValues:{name:null===x||void 0===x?void 0:x.name,engineUrl:null===x||void 0===x?void 0:x.engineUrl},children:[(0,y.jsx)(t.Z.Item,{label:"\u5f15\u64ce\u540d\u79f0",name:"name",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5f15\u64ce\u540d\u5b57"},{max:10,message:"\u5f15\u64ce\u540d\u79f0\u4e0d\u80fd\u8d85\u8fc710\u4e2a\u5b57\u7b26"}],children:(0,y.jsx)(h.default,{})}),(0,y.jsx)(t.Z.Item,{label:"\u5f15\u64ceURL",name:"engineUrl",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5f15\u64ceURL"},{max:255,message:"\u5f15\u64ceURL\u4e0d\u80fd\u8d85\u8fc7255\u4e2a\u5b57\u7b26"},{pattern:/^(http|https):\/\/.*@@@.*$/,message:'URL\u5fc5\u987b\u4ee5 http:// \u6216 https:// \u5f00\u5934\uff0c\u5e76\u4e14\u5305\u542b "@@@"'}],children:(0,y.jsx)(h.default,{})})]})]})]})})),_=(e,a)=>a.map((a=>a.id===e.id?{...a,name:e.name,engineUrl:e.engineUrl}:a))},63241:(e,a,n)=>{"use strict";n.d(a,{Rj:()=>d,Y8:()=>m,bb:()=>i,ev:()=>c,lg:()=>h,oG:()=>s,qN:()=>u,rg:()=>l});var r=n(80184);const t=[0,"\u767e\u5ea6","www.baidu.com/s?wd=@@@",0,"Bing","www.bing.com/search?q=@@@",0,"\u8c37\u6b4c","www.google.com/search?q=@@@",0,"360","www.so.com/s?q=@@@",0,"\u641c\u72d7","www.sogou.com/web?query=@@@",1,"\u767e\u5ea6","www.baidu.com/s?wd=@@@",1,"Bing","www.bing.com/search?q=@@@",1,"\u8c37\u6b4c","www.google.com/search?q=@@@",1,"360","www.so.com/s?q=@@@",1,"\u641c\u72d7","www.sogou.com/web?query=@@@",1,"\u6296\u97f3","www.douyin.com/search/@@@",1,"\u5c0f\u7ea2\u4e66","www.xiaohongshu.com/search_result?keyword=@@@&source=web_explore_feed",1,"\u77e5\u4e4e","www.zhihu.com/search?type=content&q=@@@",1,"B\u7ad9","search.bilibili.com/all?keyword=@@@&search_source=1",1,"GitHub","github.com/search?q=@@@&type=repositories",1,"\u767e\u5ea6\u7ffb\u8bd1","fanyi.baidu.com/#auto/en/@@@",1,"deepl\u7ffb\u8bd1","www.deepl.com/translator#auto/en/@@@",1,"\u4eac\u4e1c","search.jd.com/Search?keyword=@@@",1,"\u5929\u732b","s.taobao.com/search?fromTmallRedirect=true&q=@@@&tab=mall",1,"\u5fae\u535a","s.weibo.com/weibo?q=@@@"],l=(()=>{const e=[];for(let a=0;a<t.length;a+=3)e.push({id:a,isQuickSearch:t[a],name:t[a+1],engineUrl:"https://"+t[a+2]});return e})(),o="https://htmltools.pages.dev/",c=[{label:"\u535a\u5ba2",key:"blog"},{label:"\u7ad9\u5185\u5de5\u5177",key:"tool",children:[{label:"\u8f6c\u7279\u6b8a\u5b57\u6bcd|\u6570\u5b57",key:"utils-specialChar"},{label:"gg\u6bd4\u4ef7\u5668",key:"utils-ggComparator"}]},{label:"\u5de5\u5177",key:"util",children:[{key:"\u6587\u672c\u5dee\u5f02\u5bf9\u6bd4",label:(0,r.jsx)("a",{href:o+"\u6587\u672c\u5dee\u5f02\u5bf9\u6bd4/",target:"_blank",rel:"noopener noreferrer",children:"\u6587\u672c\u5dee\u5f02\u5bf9\u6bd4"})},{key:"CSS\u7f51\u683c\u5e03\u5c40\u751f\u6210\u5668",label:(0,r.jsx)("a",{href:o+"css\u7f51\u683c\u5e03\u5c40/",target:"_blank",rel:"noopener noreferrer",children:"CSS\u7f51\u683c\u5e03\u5c40\u751f\u6210\u5668"})},{key:"2FA\u9a8c\u8bc1\u7801\u83b7\u53d6",label:(0,r.jsx)("a",{href:o+"2fa/",target:"_blank",rel:"noopener noreferrer",children:"2FA\u9a8c\u8bc1\u7801\u83b7\u53d6"})},{key:"nginx\u53ef\u89c6\u5316\u914d\u7f6e",label:(0,r.jsx)("a",{href:o+"nginx\u53ef\u89c6\u5316\u914d\u7f6e/?global.app.lang=zhCN",target:"_blank",rel:"noopener noreferrer",children:"nginx\u53ef\u89c6\u5316\u914d\u7f6e"})},{key:"\u5f00\u53d1\u901f\u67e5\u8868",label:(0,r.jsx)("a",{href:o+"\u5f00\u53d1\u901f\u67e5\u8868/",target:"_blank",rel:"noopener noreferrer",children:"\u5f00\u53d1\u901f\u67e5\u8868"})},{key:"\u4e03\u5929\u5e74\u5316\u6536\u76ca\u7387\u8ba1\u7b97\u5668",label:(0,r.jsx)("a",{href:o+"\u4e03\u5929\u5e74\u5316\u6536\u76ca\u7387\u8ba1\u7b97\u5668/",target:"_blank",rel:"noopener noreferrer",children:"\u4e03\u5929\u5e74\u5316\u6536\u76ca\u7387\u8ba1\u7b97\u5668"})},{key:"\u62f3\u7687\u4e8c\u7a3f\u7248",label:(0,r.jsx)("a",{href:o+"\u62f3\u7687\u4e8c\u7a3f\u7248/",target:"_blank",rel:"noopener noreferrer",children:"\u62f3\u7687\u4e8c\u7a3f\u7248"})}]},{label:"\u5e2e\u52a9",key:"help"}],s=[{value:"a",color:"processing"},{value:"b",color:"success"},{value:"c",color:"error"},{value:"d",color:"warning"},{value:"e",color:"magenta"},{value:"f",color:"red"},{value:"g",color:"volcano"},{value:"h",color:"orange"},{value:"i",color:"gold"},{value:"j",color:"lime"},{value:"k",color:"green"},{value:"l",color:"cyan"},{value:"m",color:"blue"},{value:"n",color:"geekblue"},{value:"o",color:"purple"},{value:"p",color:"default"},{value:"q",color:"processing"},{value:"r",color:"success"},{value:"s",color:"error"},{value:"t",color:"warning"},{value:"u",color:"magenta"},{value:"v",color:"red"},{value:"w",color:"volcano"},{value:"x",color:"orange"},{value:"y",color:"gold"},{value:"z",color:"lime"}],i=[{value:1,label:"\u4fee\u6539\u2193"},{value:2,label:"\u4fee\u6539\u2191"},{value:3,label:"\u521b\u5efa\u2193"},{value:4,label:"\u521b\u5efa\u2191"}],u=[{value:5,label:"A\u2193"},{value:6,label:"Z\u2193"},...i],d={0:"\u666e\u901a",1:"\u5faa\u73af",2:"\u957f\u671f",3:"\u7d27\u6025",5:"\u65e5\u8bb0",6:"\u5de5\u4f5c",7:"\u5176\u4ed6"},h=[["err\u83dc\u5355","err\u5b50\u5e26\u53551","\u5b50\u5e26\u53552","\u5b50\u5e26\u53553","\u5b50\u5e26\u53554","\u5b50\u5e26\u53555","\u5b50\u5e26\u53556","\u5b50\u5e26\u53557"],["\u62a5\u9519\u95ee\u9898","\u8fd8\u80fd\u70b9\u5f00?\u574f\u4e86","\u6253\u5f00\u7f51\u7edc\u9519\u8bef","\u5c31\u662f\u6ca1\u52a0\u8f7d\u597d\u5566","\u4e0d\u53ef\u80fd\u8fd9\u4e48\u6162\u6ca1\u52a0\u8f7d\u597d","\u80af\u5b9a\u662f\u574f\u4e86","\u5bc4!"],["\u8fd8\u6ca1\u6709\u52a0\u8f7d\u771f\u83dc\u5355","\u4e0d\u4f1a\u662f\u51fa\u95ee\u9898\u4e86\u5427"],["\u5176\u4ed6\u95ee\u9898"]],m=["java","javascript","html","css","bash","less","scss","typescript","json","xml","markdown","yaml","sql","shell","powershell","bat","sh","c","c++"]},45226:(e,a,n)=>{"use strict";n.d(a,{Z:()=>t});var r=n(84098);const t=new class{constructor(){var e,a;this.searchEngines=localStorage.getItem("searchEngines")||"Bing",this.quickSearchIcon=null===(e=localStorage.getItem("quickSearchIcon"))||void 0===e||e,this._searchIconTransparency=null!==(a=localStorage.getItem("searchIconTransparency"))&&void 0!==a?a:88,(0,r.ky)(this)}setSearchEngines(e){localStorage.setItem("searchEngines",e),this.searchEngines=e}setQuickSearchIcon(e){localStorage.setItem("quickSearchIcon",e?"ikun":""),this.quickSearchIcon=e}setSearchIconTransparency(e){localStorage.setItem("searchIconTransparency",e.toString()),this._searchIconTransparency=e}get searchIconTransparency(){return parseInt(this._searchIconTransparency)}}},36490:function(e,a){var n,r,t;r=[a,e],n=function(e,a){"use strict";var n={timeout:5e3,jsonpCallback:"callback",jsonpCallbackFunction:null};function r(){return"jsonp_"+Date.now()+"_"+Math.ceil(1e5*Math.random())}function t(e){try{delete window[e]}catch(a){window[e]=void 0}}function l(e){var a=document.getElementById(e);a&&document.getElementsByTagName("head")[0].removeChild(a)}function o(e){var a=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],o=e,c=a.timeout||n.timeout,s=a.jsonpCallback||n.jsonpCallback,i=void 0;return new Promise((function(n,u){var d=a.jsonpCallbackFunction||r(),h=s+"_"+d;window[d]=function(e){n({ok:!0,json:function(){return Promise.resolve(e)}}),i&&clearTimeout(i),l(h),t(d)},o+=-1===o.indexOf("?")?"?":"&";var m=document.createElement("script");m.setAttribute("src",""+o+s+"="+d),a.charset&&m.setAttribute("charset",a.charset),a.nonce&&m.setAttribute("nonce",a.nonce),a.referrerPolicy&&m.setAttribute("referrerPolicy",a.referrerPolicy),a.crossorigin&&m.setAttribute("crossorigin","true"),m.id=h,document.getElementsByTagName("head")[0].appendChild(m),i=setTimeout((function(){u(new Error("JSONP request to "+e+" timed out")),t(d),l(h),window[d]=function(){t(d)}}),c),m.onerror=function(){u(new Error("JSONP request to "+e+" failed")),t(d),l(h),i&&clearTimeout(i)}}))}a.exports=o},void 0===(t="function"===typeof n?n.apply(a,r):n)||(e.exports=t)},96171:(e,a,n)=>{"use strict";n.r(a),n.d(a,{default:()=>r});const r={}}}]);
//# sourceMappingURL=5639.fade4941.chunk.js.map