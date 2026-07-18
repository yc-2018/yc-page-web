import type {ISearchEngineExample} from '@/interface/ISearchEngines';

/** 新增搜索引擎时可直接回填的示例数据 */
export const searchEngineExamples: ISearchEngineExample[] = [
  {
    name: '微博',
    engineUrl: 'https://s.weibo.com/weibo?q=@@@',
  },
  {
    name: '高德地图',
    engineUrl: 'https://ditu.amap.com/search?query=@@@',
  },
  {
    name: '搜狗',
    engineUrl: 'https://www.sogou.com/web?query=@@@',
  },
  {
    name: '360',
    engineUrl: 'https://www.so.com/s?q=@@@',
  },
  {
    name: '京东',
    engineUrl: 'https://search.jd.com/Search?keyword=@@@',
  },
  {
    name: '淘宝',
    engineUrl: 'https://s.taobao.com/search?fromTmallRedirect=true&q=@@@&tab=mall',
    iconUrl: 'https://www.taobao.com/favicon.ico',
  },
  {
    name: '油管',
    engineUrl: 'https://www.youtube.com/results?search_query=@@@',
    iconUrl: 'https://img.alicdn.com/imgextra/i4/O1CN01XYeMDZ1K28kqTFMhF_!!2095901105-2-fleamarket.png',
  },
  {
    name: '优酷',
    engineUrl: 'https://so.youku.com/search_video/q_@@@',
    directUrl: 'https://youku.com',
  },
  {
    name: '腾讯视频',
    engineUrl: 'https://v.qq.com/x/search/?q=@@@',
    directUrl: 'https://v.qq.com',
  },
  {
    name: '爱奇艺',
    engineUrl: 'https://so.iqiyi.com/so/q_@@@',
    iconUrl: 'https://www.iqiyi.com/favicon.ico',
  },
  {
    name: '百度图片',
    engineUrl: 'https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=index&fr=&hs=0&xthttps=111110&sf=1&fmq=&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&word=@@@',
  },
  {
    name: 'deepl翻译',
    engineUrl: 'https://www.deepl.com/translator#auto/en/@@@',
  },
  {
    name: 'Crx搜搜',
    engineUrl: 'https://www.crxsoso.com/search?keyword=@@@&store=chrome',
    directUrl: 'https://www.crxsoso.com/',
    iconUrl: 'https://www.crxsoso.com/favicon-32x32.png',
  },
  {
    name: 'iconfont',
    engineUrl: 'https://www.iconfont.cn/search/index?searchType=icon&q=@@@',
    directUrl: 'https://www.iconfont.cn',
  },
  {
    name: 'Bing',
    engineUrl: 'https://www.bing.com/search?q=@@@',
  },
  {
    name: '百度',
    engineUrl: 'https://www.baidu.com/s?wd=@@@',
  },
  {
    name: '谷歌',
    engineUrl: 'https://www.google.com/search?q=@@@',
    directUrl: 'https://www.google.com',
    iconUrl: 'https://img11.360buyimg.com/cxxjwimg/jfs/t1/352092/10/12938/1152/69422399F5715940f/06d7020020916c56.png',
  },
  {
    name: 'L站',
    engineUrl: 'https://linux.do/search?q=@@@',
    directUrl: 'https://linux.do/latest?order=created',
    iconUrl: 'https://img11.360buyimg.com/cxxjwimg/jfs/t1/375570/15/13098/1853/694223e5Ff2788d7a/06d70200205a9e0f.png',
  },
  {
    name: '秘塔AI',
    engineUrl: 'https://metaso.cn/?q=@@@',
  },
  {
    name: '百度AI',
    engineUrl: 'https://chat.baidu.com/search?word=@@@',
  },
  {
    name: '抖音',
    engineUrl: 'https://www.douyin.com/search/@@@',
    directUrl: 'https://www.douyin.com/?recommend=1',
  },
  {
    name: 'B站',
    engineUrl: 'https://search.bilibili.com/all?keyword=@@@&search_source=1',
    iconUrl: 'https://www.bilibili.com/favicon.ico',
  },
  {
    name: 'GitHub',
    engineUrl: 'https://github.com/search?q=@@@&type=repositories',
    directUrl: 'https://github.com/',
    iconUrl: 'https://img20.360buyimg.com/openfeedback/jfs/t1/286994/23/10698/860/6873e786F50ffcd56/e0c094c3866dd916.png',
  },
  {
    name: '百度翻译',
    engineUrl: 'https://fanyi.baidu.com/#auto/en/@@@',
    directUrl: 'https://fanyi.baidu.com',
  },
  {
    name: '小红书',
    engineUrl: 'https://www.xiaohongshu.com/search_result?keyword=@@@&source=web_explore_feed',
    directUrl: 'https://www.xiaohongshu.com/user/profile/5e21857700000000010095ff',
  },
  {
    name: '知乎',
    engineUrl: 'https://www.zhihu.com/search?type=content&q=@@@',
  },
  {
    name: 'copilot(外',
    engineUrl: 'https://www.bing.com/copilotsearch?q=@@@',
    iconUrl: 'https://copilot.microsoft.com/static/cmc/favicon.ico',
  },
  {
    name: 'gpt(外',
    engineUrl: 'https://chatgpt.com/?q=@@@',
    iconUrl: 'https://img11.360buyimg.com/cxxjwimg/jfs/t1/376561/9/15650/1808/69440001Ff0a6e18f/06d70200203073d1.png',
  },
  {
    name: 'Genspark(外',
    engineUrl: 'https://www.genspark.ai/search?query=@@@',
    iconUrl: 'https://img20.360buyimg.com/openfeedback/jfs/t1/296225/20/22538/3671/6873e8b7F9025a188/37fd553038e752d9.png',
  },
  {
    name: 'you.com(外',
    engineUrl: 'https://you.com/search?q=@@@',
  },
  {
    name: 'perplexity(外',
    engineUrl: 'https://www.perplexity.ai/?q=@@@',
    iconUrl: 'https://www.perplexity.ai/favicon.svg',
  },
];

/** 新增首页链接时可直接回填的示例数据 */
export const homeLinkExamples: ISearchEngineExample[] = [
  {
    name: 'deepSeek',
    engineUrl: 'https://chat.deepseek.com/',
    iconUrl: 'https://img11.360buyimg.com/cxxjwimg/jfs/t1/346418/21/24884/6042/6910da52Fbf330721/90a75e6cfa360b58.png',
  },
  {
    name: '腾讯元宝',
    engineUrl: 'https://yuanbao.tencent.com/chat/',
  },
  {
    name: '豆包',
    engineUrl: 'https://www.doubao.com/chat/',
    iconUrl: 'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/chat/favicon.png',
  },
  {
    name: 'gitee',
    engineUrl: 'https://gitee.com/yc556',
    iconUrl: 'https://img11.360buyimg.com/cxxjwimg/jfs/t1/357216/38/6830/1808/69114e41F488ee1c6/09d56799432d16d2.png',
  },
  {
    name: '吾爱破解',
    engineUrl: 'https://www.52pojie.cn/forum-16-1.html',
  },
  {
    name: '克隆窝',
    engineUrl: 'https://www.uy5.net/',
  },
];
