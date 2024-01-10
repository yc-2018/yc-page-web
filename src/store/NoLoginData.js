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
        label: '菜单一',
        key: '111',
    },
    {
        label: '导航二',
        key: '222',
        disabled: true,
    },
    {
        label: '导航三-子菜单',
        key: '333',
        children: [
            {
                type: 'group',
                label: '项目1',
                children: [
                    {
                        label: '选项1',
                        key: '3331',
                    },
                    {
                        label: '选项2',
                        key: '3332',
                    },
                ],
            },
            {
                label: '项目2',
            },
        ],
    },
    {
        label: (
            <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer">
                导航四-链接
            </a>
        ),
        key: '444',
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
        value: '1',
        label: '修改↓',
    },
    {
        value: '2',
        label: '修改↑',
    },
    {
        value: '3',
        label: '创建↓',
    },
    {
        value: '4',
        label: '创建↑',
    }
]


/** 英语排序 */
export const englishSortingOptions = [
    {
        value: '5',
        label: 'A↓',
    },
    {
        value: '6',
        label: 'Z↓',
    },
    ...sortingOptions
]

