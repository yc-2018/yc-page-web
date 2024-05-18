import React from "react";

/** 搜索引擎数据 */
export const searchData =[
    {id:1,  isQuickSearch:0, name: '百度', engineUrl: 'https://www.baidu.com/s?wd=@@@' },
    {id:2,  isQuickSearch:0, name: 'Bing', engineUrl: 'https://www.bing.com/search?q=@@@' },
    {id:3,  isQuickSearch:0, name: '谷歌', engineUrl: 'https://www.google.com/search?q=@@@' },
    {id:4,  isQuickSearch:0, name: '360', engineUrl: 'https://www.so.com/s?q=@@@' },
    {id:5,  isQuickSearch:0, name: '搜狗', engineUrl: 'https://www.sogou.com/web?query=@@@' },

    {id:6,  isQuickSearch:1, name: '百度', engineUrl: 'https://www.baidu.com/s?wd=@@@' },
    {id:7,  isQuickSearch:1, name: 'Bing', engineUrl: 'https://www.bing.com/search?q=@@@' },
    {id:8,  isQuickSearch:1, name: '谷歌', engineUrl: 'https://www.google.com/search?q=@@@' },
    {id:9,  isQuickSearch:1, name: '360', engineUrl: 'https://www.so.com/s?q=@@@' },
    {id:10, isQuickSearch:1, name: '搜狗', engineUrl: 'https://www.sogou.com/web?query=@@@' },
    {id:11, isQuickSearch:1, name: '抖音', engineUrl: 'https://www.douyin.com/search/@@@' },
    {id:12, isQuickSearch:1, name: '京东', engineUrl: 'https://search.jd.com/Search?keyword=@@@' },
    {id:13, isQuickSearch:1, name: '天猫', engineUrl: 'https://s.taobao.com/search?fromTmallRedirect=true&q=@@@&tab=mall' },
    {id:14, isQuickSearch:1, name: '小红书', engineUrl: 'https://www.xiaohongshu.com/search_result?keyword=@@@&source=web_explore_feed' },
    {id:15, isQuickSearch:1, name: "微博", engineUrl: "https://s.weibo.com/weibo?q=@@@" },
    {id:16, isQuickSearch:1, name: "知乎", engineUrl: "https://www.zhihu.com/search?type=content&q=@@@" },
    {id:17, isQuickSearch:1, name: 'B站', engineUrl: 'https://search.bilibili.com/all?keyword=@@@&search_source=1' },
    {id:18, isQuickSearch:1, name: 'GitHub', engineUrl: 'https://github.com/search?q=@@@&type=repositories' },
    {id:19, isQuickSearch:1, name: '百度翻译', engineUrl: 'https://fanyi.baidu.com/#auto/en/@@@' },
    {id:20, isQuickSearch:1, name: 'deepl翻译', engineUrl: 'https://www.deepl.com/translator#auto/en/@@@' },
];

/** 头部导航测试数据 */
export const items = [
    {
        label: '博客',
        key: 'blog',
    },
    {
        label: '站内工具',
        key: 'tool',
        children: [
            {
                label: '转特殊字母|数字',
                key: 'utils-specialChar',
            },
            {
                label: 'gg比价器',
                key: 'utils-ggComparator',
            },
            // {
            //     label: '2FA验证码获取',
            //     key: 'utils-2af',
            //     // disabled: true,
            // },
        ],
    },
    {
        label: '工具',
        key: 'util',
        children: [
            {
                label: (
                    <a href="https://yc556.gitee.io/business-code-generator/" target="_blank" rel="noopener noreferrer">
                        业务代码生成器
                    </a>
                ),
                key: 'businessCodeGenerator',
            },
            {
                label: (
                    <a href="https://yc556.gitee.io/grid/" target="_blank" rel="noopener noreferrer">
                        CSS网格布局生成器
                    </a>
                ),
                key: 'cssGridLayoutGenerator',
            },
            {
                label: (
                  <a href="https://yc556.gitee.io/2fa/" target="_blank" rel="noopener noreferrer">
                      2FA验证码获取
                  </a>
                ),
                key: '2fa',
            },
        ],
    },
    {
        label: '帮助',
        key: 'help',
    },
];

/** 英语标签 26个字母 26个颜色 */
export const tagList = [
    {'value': 'a', 'color': 'processing'},
    {'value': 'b', 'color':'success'},
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
    {'value':'m', 'color': 'blue'},
    {'value': 'n', 'color': 'geekblue'},
    {'value': 'o', 'color': 'purple'},
    {'value': 'p', 'color': 'default'},
    {'value': 'q', 'color': 'processing'},
    {'value': 'r', 'color': 'success'},
    {'value':'s', 'color': 'error'},
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
    0: "普通",
    1: "循环",
    2: "长期",
    3: "紧急",
    5: "日记",
    6: "工作",
    7: "其他"
}

/** 博客菜单测试数据 */
export const blogMenu = [
    ['err菜单', 'err子带单1','子带单2','子带单3','子带单4','子带单5','子带单6','子带单7'],
    ['报错问题', '还能点开?坏了','打开网络错误','就是没加载好啦','不可能这么慢没加载好','肯定是坏了','寄!'],
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