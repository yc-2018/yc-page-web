import{C as p}from"./index-B0C6OQY_.js";import{m as n}from"./myAxios-1_awqyN6.js";async function $({type:s=0,page:e=1,completed:o=0,orderBy:t,firstLetter:a,keyword:r,dateRange:c}){let m=s===1?"&pageSize=30":"";s===4&&(m="&pageSize=20"),e=`?page=${e}`,o=`&completed=${o}`,t=t?`&orderBy=${t}`:"",a=a?`&firstLetter=${a}`:"",r=r?`&keyword=${encodeURIComponent(r)}`:"",c=c?`&dateRange=${c}`:"";try{return(await n.get(`/toDoItems/${s+e+o+m+t+a+r+c}`)).data}catch(i){console.error("待办请求失败:",i)}}async function d(s,e="post"){try{const o=await n({url:"/toDoItems",method:e,data:s});if(o.data.code===1)return p.msg.success("成功"),o.data.data}catch(o){console.error("待办请求失败:",o)}}async function g(s){try{if((await n.delete(`/toDoItems/${s}`)).data.code===1)return p.msg.success("删除成功"),!0}catch(e){console.error("待办请求失败:",e)}}async function I(s,e=1){var o;try{const t=await n.get(`/loopMemoTime/${s}?page=${e}`);return(o=t==null?void 0:t.data)==null?void 0:o.data}catch(t){console.log("待办请求失败:",t)}}export{d as a,g as d,$ as g,I as s};
