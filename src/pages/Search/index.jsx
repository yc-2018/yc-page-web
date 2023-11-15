import { Segmented, Flex, Button } from 'antd'
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite'
import MySearch from '../../compontets/MySearch';
import searchStore from '../../store/SearchEnginesStore';


function Search() {
    // const [searchEngines, setSearchEngines] = useState("Bing");
    const [searchOptions, setSearchOptions] = useState([
        { name: '百度', engineUrl: 'https://www.baidu.com/s?wd=@@@' },
        { name: 'Bing', engineUrl: 'https://www.bing.com/search?q=@@@' },
        { name: '谷歌', engineUrl: 'https://www.google.com/search?q=@@@' },
        { name: '360', engineUrl: 'https://www.so.com/s?q=@@@' },
        { name: '搜狗', engineUrl: 'https://www.sogou.com/web?query=@@@' },
    ]);
    const [quickSearch, setQuickSearch] = useState({
        '百度': 'https://www.baidu.com/s?wd=@@@',
        '谷歌': 'https://www.google.com/search?q=@@@',
        '必应': 'https://www.bing.com/search?q=@@@',
        '360': 'https://www.so.com/s?q=@@@',
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
        //通过搜索引擎名字找到他对应的URL=》这就要求名字在一个用户中是唯一的
        const engineUrl = searchOptions.find(option => option.name === searchStore.searchEngines).engineUrl;
        window.open(engineUrl.replace('@@@', searchFor), '_blank');
    }


    // 存搜索框的值
    let searchValue = undefined;
    const setSearchValue = value => {searchValue = value}

    return (
        <>
            {/* 选择搜索引擎 */}
            <Segmented
                options={searchOptions.map(option => option.name)}
                value={searchStore.searchEngines}
                onChange={(value) => searchStore.setSearchEngines(value)}
            />
            <br />
            {/* 搜索框 */}
            <MySearch onSearch={onSearch} setSearchValue={setSearchValue}/>


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
export default observer(Search)