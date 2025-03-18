import{r as l,j as e,B as h,C as B}from"./index-B0C6OQY_.js";import{T as x}from"./TextArea-V7vQgJ7K.js";import{s as N}from"./index-Chr6ef6i.js";import{R as k,C as E}from"./row-C9ZHmdcs.js";import{R as o}from"./index-BZY3Qf_0.js";import{C as R}from"./index-B4uH93u6.js";import"./BaseInput-Anhy3aYS.js";import"./useMergedState-DUiMMcXK.js";import"./index-B60-yQZ9.js";import"./EllipsisOutlined-DLTU3878.js";import"./Overflow-BGN261ev.js";import"./index-BXtotYsN.js";import"./isMobile-B4CO7CVJ.js";import"./PlusOutlined-CzqjDeDz.js";import"./Dropdown-DXlklsFA.js";const u="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",m="0123456789",b=["𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙","𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁","𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ","𝑎𝑏𝑐𝑑𝑒𝑓𝑔𝒽𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍","𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭","𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕","𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉","𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡","𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹","𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅","𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵","𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩","ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ","⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵🄐🄑🄒🄓🄔🄕🄖🄗🄘🄙🄚🄛🄜🄝🄞🄟🄠🄡🄢🄣🄤🄥🄦🄧🄨🄩","🇦🇧🇨🇩🇪🇫🇬🇭🇮🇯🇰🇱🇲🇳🇴🇵🇶🇷🇸🇹🇺🇻🇼🇽🇾🇿".repeat(2),"🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉".repeat(2),"🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩".repeat(2),"🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉".repeat(2)],f=["𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗","𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫","𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡","𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿","𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵","₀₁₂₃₄₅₆₇₈₉","⁰¹²³⁴⁵⁶⁷⁸⁹"],Q=()=>{const[n,v]=l.useState(""),[i,y]=l.useState(""),[p,j]=l.useState(""),[a,C]=l.useState(b[2]),[c,T]=l.useState(f[2]),[A,S]=l.useState("");l.useEffect(()=>w(),[n,a,c]);const w=()=>{let s="";for(const r of n){let t=u.indexOf(r);t!==-1?s+=Array.from(a)[t]:(t=m.indexOf(r),t!==-1?s+=Array.from(c)[t]:s+=r)}y(s)},d=(s,r)=>e.jsxs(E,{span:8,children:[e.jsx("div",{style:{textAlign:"center"},children:s}),r]});return e.jsxs("div",{className:"gun",style:{padding:10,backgroundColor:"rgba(220,220,220,.2)",height:"calc(100vh - 84px)",overflow:"auto"},children:[e.jsxs(k,{children:[d("输入文本",e.jsx(x,{rows:15,value:n,onChange:s=>v(s.target.value)})),d(e.jsxs(e.Fragment,{children:["输出文本",e.jsx(g,{text:i})]}),e.jsx(x,{rows:15,value:i})),d(e.jsxs(e.Fragment,{children:[e.jsx(h,{size:"small",onClick:()=>j(i),children:"➪输出过来"}),"乱搞文本",e.jsx(g,{text:p})]}),e.jsx(x,{rows:15,value:p,onChange:s=>j(s.target.value)}))]}),e.jsxs("div",{style:{margin:10},children:[e.jsx("hr",{style:{border:"#eaeaf5 solid 1px"}}),e.jsx("span",{children:"特殊字母："}),e.jsxs(o.Group,{value:a,onChange:s=>C(s.target.value),children:[b.map(s=>e.jsxs(o.Button,{value:s,children:[Array.from(s).slice(0,3).join(""),"..."]},s)),e.jsx(o.Button,{value:u,children:"不换!"})]}),e.jsx("hr",{style:{border:"#eaeaf5 solid 1px"}}),e.jsx("span",{children:"特殊数字："}),e.jsxs(o.Group,{value:c,onChange:s=>T(s.target.value),children:[f.map(s=>e.jsxs(o.Button,{value:s,children:[Array.from(s).slice(0,3).join(""),"..."]},s)),e.jsx(o.Button,{value:m,children:"不换!"})]}),e.jsx("hr",{style:{border:"#eaeaf5 solid 1px"}}),e.jsxs(R,{title:e.jsx("div",{style:{textAlign:"center"},children:"注意事项和说明"}),children:[e.jsxs("div",{children:[e.jsx("b",{children:"特殊字母选项："}),"如果选项显示小写就说明大小写正常转换，",e.jsx("b",{style:{color:"red"},children:"如果显示大写的就说明本来的大小写都会转化为大写"}),"； 另外 ",e.jsx("b",{style:{color:"blue"},children:"🇦🇧🇨..."}),"比较特殊,在手机上显示",e.jsx("b",{style:{color:"blue"},children:"蓝色大字"}),", 但是两个以上拼接在一起就会显示变成一些国旗符号,所以可以到乱搞文本上加上空格",e.jsx("b",{style:{color:"blue"},children:"🇦 🇧 🇨..."}),", 这样手机上也能正常显示了。"]}),e.jsxs("div",{children:[e.jsx("b",{children:"乱搞文本："}),"顾名思义就是给你编辑的,因为输出文本输入框是跟着输入变的,所以输出框是不能编辑的,所以你可以点击【输出过来】按钮 把输出文本 覆盖到乱搞文本。 ",e.jsx("b",{children:"值得注意的是"}),"：如果你已经在乱搞文本里面编辑了,就不要再点【输出过来】按钮了,因为是会覆盖你本来编辑的文字的。"]}),e.jsxs("div",{children:[e.jsx("b",{children:"换特殊符号时："})," 输出文本会实时改变。"]}),e.jsxs("div",{children:[e.jsx("b",{children:"更多特殊符号："}),e.jsx("a",{href:"https://blog.csdn.net/weixin_46665865/article/details/126132912",target:"_blank",children:"可以看看我的CSDN这篇笔记"}),"，都已经分类整理好了"]}),e.jsx(h,{onClick:s=>{s.target.parentElement.style.display="none";let r="";for(let t=32;t<14e4;t++)r+=String.fromCharCode(t);S(r)},children:"点击直接看10万符号(电脑卡别点)【有很多方块这些都是电脑当前字体不支持显示的符号】"}),e.jsx("div",{style:{wordWrap:"break-word"},children:A})]})]})]})},g=({text:n})=>e.jsx(N.CopyToClipboard,{text:n,onCopy:()=>B.msg.success("复制成功"),children:e.jsx(h,{size:"small",children:"复制文本"})});export{Q as default};
