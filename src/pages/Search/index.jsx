import { Input, Segmented, Flex , Button } from 'antd'
import React, { useState, useEffect } from 'react';
// 引入搜索组件
const { Search: AntdSearch } = Input;


export default function Search() {
    const [loading, setLoading] = useState(false);
    const [searchEngines, setSearchEngines] = useState("谷歌");
    const [searchOptions, setSearchOptions] = useState({
        '百度': 'https://www.baidu.com/s?wd=@@@',
        '谷歌': 'https://www.google.com/search?q=@@@',
        '必应': 'https://www.bing.com/search?q=@@@',
        ' 360': 'https://www.so.com/s?q=@@@',
        '搜狗': 'https://www.sogou.com/web?query=@@@',
    });
    const [quickSearch, setQuickSearch] = useState({
        '百度': 'https://www.baidu.com/s?wd=@@@',
        '谷歌': 'https://www.google.com/search?q=@@@',
        '必应': 'https://www.bing.com/search?q=@@@',
        ' 360': 'https://www.so.com/s?q=@@@',
        '搜狗': 'https://www.sogou.com/web?query=@@@',
        '抖音': 'https://www.douyin.com/search/@@@',
        '百度翻译': 'https://fanyi.baidu.com/#auto/en/@@@',
        'B站': 'https://search.bilibili.com/all?keyword=@@@&search_source=1',
        'GitHub': 'https://github.com/search?q=@@@&type=repositories',


    });


    // useEffect(() => {
    //     console.log(data);
    //     }, [data]);


    // 点击搜索按钮 或回车触发的事件
    const onSearch = (value, _e) => {
        const searchFor = value.target?.value ?? value; //回车时_e不存在
        window.open(searchOptions[searchEngines].replace('@@@', searchFor), '_blank');
        setLoading(true); window.setTimeout(() => setLoading(false), 1000);
    }

    // 点击搜索按钮 或回车触发的事件
    const onQuickSearch = (value) => {
        const searchFor = value; //回车时_e不存在
        window.open(quickSearch[searchEngines].replace('@@@', searchFor), '_blank');
        setLoading(true); window.setTimeout(() => setLoading(false), 1000);
    }

    // 存搜索框的值
    let searchValue;

    return (
        <>
            {/* 选择搜索引擎 */}
            <Segmented
                options={Object.keys(searchOptions)}
                // options={Array.from(new Map(Object.entries(searchOptions)).keys())} 
                value={searchEngines}
                onChange={(value) => setSearchEngines(value)}
            />
            <br />
            {/* 搜索框 */}
            <AntdSearch
                placeholder="你想搜索吗？"
                onSearch={onSearch}
                onPressEnter={onSearch}
                size="large"
                style={{ width: 500, 'margin': "5px" }}
                loading={loading}
                value={searchValue}
                onChange={e => searchValue=e.target.value}
            />
            <br />
            {/* 快速搜索 */}
            <Flex  /* style={{ width: "80%" }} */ wrap="wrap" gap="small" justify='center'>
                {Object.entries(quickSearch).map(([key, value], index) => (
                    <Button key={index} onClick={() => window.open(value.replace('@@@', searchValue), '_blank')}>{key}</Button>
                ))}
            </Flex>
        </>
    )
}
