import ISearchEngines from '@/interface/ISearchEngines';

/** 搜索引擎数据 */
const searchDatas = [
  1, '百度', 'www.baidu.com/s?wd=@@@', 'www.baidu.com',
  1, 'Bing', 'www.bing.com/search?q=@@@', 'www.bing.com',
  1, '谷歌', 'www.google.com/search?q=@@@', 'www.google.com',
  1, '360', 'www.so.com/s?q=@@@', 'www.so.com',
  1, '搜狗', 'www.sogou.com/web?query=@@@', 'www.sogou.com',
  1, '抖音', 'www.douyin.com/search/@@@', 'www.douyin.com',
  1, '小红书', 'www.xiaohongshu.com/search_result?keyword=@@@&source=web_explore_feed', 'www.xiaohongshu.com',
  1, '知乎', 'www.zhihu.com/search?type=content&q=@@@', 'www.zhihu.com',
  1, 'B站', 'search.bilibili.com/all?keyword=@@@&search_source=1', 'www.bilibili.com',
  1, 'GitHub', 'github.com/search?q=@@@&type=repositories', 'github.com',
  1, '百度翻译', 'fanyi.baidu.com/#auto/en/@@@', 'fanyi.baidu.com',
  1, 'deepl翻译', 'www.deepl.com/translator#auto/en/@@@', 'www.deepl.com/translator',
  1, '京东', 'search.jd.com/Search?keyword=@@@', 'www.jd.com',
  1, '天猫', 's.taobao.com/search?fromTmallRedirect=true&q=@@@&tab=mall', 'www.tmall.com',
  1, '微博', 's.weibo.com/weibo?q=@@@', 'weibo.com',
]

/**
 * 构建搜索引擎数据结构
 * @author ChenGuangLong
 * @since 2024/7/1 19:56
 */
const buildSearchData = () => {
  const searchData: ISearchEngines[] = []
  for (let i = 0; i < searchDatas.length; i += 4) {
    searchData.push({
      id: i,
      type: searchDatas[i] === 0 ? 0 : 1,
      name: `${searchDatas[i + 1]}`,
      engineUrl: 'https://' + searchDatas[i + 2],
      directUrl: 'https://' + searchDatas[i + 3]
    })
  }
  return searchData
}
export const searchData: ISearchEngines[] = buildSearchData()

/** 头部导航数据 */
export const items = [
  {
    label: '博客',
    key: 'blog',
  },
  {
    label: '工具',
    key: 'util',
  },
  {
    label: '帮助',
    key: 'help',
  },
];

/** 英语标签 26个字母 26个颜色 */
export const tagList = [
  {'value': 'a', 'color': 'processing'},
  {'value': 'b', 'color': 'success'},
  {'value': 'c', 'color': 'error'},
  {'value': 'd', 'color': 'warning'},
  {'value': 'e', 'color': 'magenta'},
  {'value': 'f', 'color': 'red'},
  {'value': 'g', 'color': 'volcano'},
  {'value': 'h', 'color': 'orange'},
  {'value': 'i', 'color': 'gold'},
  {'value': 'j', 'color': 'lime'},
  {'value': 'k', 'color': 'green'},
  {'value': 'l', 'color': 'cyan'},
  {'value': 'm', 'color': 'blue'},
  {'value': 'n', 'color': 'geekblue'},
  {'value': 'o', 'color': 'purple'},
  {'value': 'p', 'color': 'default'},
  {'value': 'q', 'color': 'processing'},
  {'value': 'r', 'color': 'success'},
  {'value': 's', 'color': 'error'},
  {'value': 't', 'color': 'warning'},
  {'value': 'u', 'color': 'magenta'},
  {'value': 'v', 'color': 'red'},
  {'value': 'w', 'color': 'volcano'},
  {'value': 'x', 'color': 'orange'},
  {'value': 'y', 'color': 'gold'},
  {'value': 'z', 'color': 'lime'},
];

/** 待办排序 */
export const sortingOptions = [
  {
    value: 1,
    label: '修改↓',
  },
  {
    value: 2,
    label: '修改↑',
  },
  {
    value: 3,
    label: '创建↓',
  },
  {
    value: 4,
    label: '创建↑',
  }
]


/** 英语排序 */
export const englishSortingOptions = [
  {
    value: 5,
    label: 'A↓',
  },
  {
    value: 6,
    label: 'Z↓',
  },
  ...sortingOptions
]

/** 待办类型映射 */
export const tagNameMapper = {
  0: '普通',
  1: '循环',
  2: '长期',
  3: '紧急',
  5: '日记',
  6: '工作',
  7: '其他'
}

/** 博客菜单测试数据 */
export const blogMenu = [
  ['err菜单', 'err子带单1', '子带单2', '子带单3', '子带单4', '子带单5', '子带单6', '子带单7'],
  ['报错问题', '还能点开?坏了', '打开网络错误', '就是没加载好啦', '不可能这么慢没加载好', '肯定是坏了', '寄!'],
  ['还没有加载真菜单', '不会是出问题了吧'],
  ['其他问题'],
]

/** md代码语言列表 */
export const mdCodeLanguageList = [
  'java',
  'javascript',
  'html',
  'css',
  'bash',
  'less',
  'scss',
  'typescript',
  'json',
  'xml',
  'markdown',
  'yaml',
  'sql',
  'shell',
  'powershell',
  'bat',
  'sh',
  'c',
  'c++',
]
