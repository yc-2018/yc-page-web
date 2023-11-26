import { Segmented, Flex, Button } from 'antd'
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite'
import { ThunderboltOutlined, PlusOutlined } from '@ant-design/icons';
import MySearch from '../../../compontets/MySearch';
import searchStore from '../../../store/SearchEnginesStore';
import "./Search.css"


function Search() {
    // const [searchEngines, setSearchEngines] = useState("Bing");  //放bomx去了
    const [searchValue, setSearchVal] = useState("");
    const setSearchValue = value => setSearchVal(value)     // 输入框的值改变的回调(直接传setSearchVal给子组件会报错：Rendered more hooks than during the previous render.)
    const [searchOptions, setSearchOptions] = useState([
        { name: '百度', engineUrl: 'https://www.baidu.com/s?wd=@@@' },
        { name: 'Bing', engineUrl: 'https://www.bing.com/search?q=@@@' },
        { name: '谷歌', engineUrl: 'https://www.google.com/search?q=@@@' },
        { name: '360', engineUrl: 'https://www.so.com/s?q=@@@' },
        { name: '搜狗', engineUrl: 'https://www.sogou.com/web?query=@@@' },
    ]);
    const [quickSearch, setQuickSearch] = useState([
        { name: '百度', engineUrl: 'https://www.baidu.com/s?wd=@@@' },
        { name: 'Bing', engineUrl: 'https://www.bing.com/search?q=@@@' },
        { name: '谷歌', engineUrl: 'https://www.google.com/search?q=@@@' },
        { name: '360', engineUrl: 'https://www.so.com/s?q=@@@' },
        { name: '搜狗', engineUrl: 'https://www.sogou.com/web?query=@@@' },
        { name: '抖音', engineUrl: 'https://www.douyin.com/search/@@@' },
        { name: '京东', engineUrl: 'https://search.jd.com/Search?keyword=@@@' },
        { name: '天猫', engineUrl: 'https://s.taobao.com/search?fromTmallRedirect=true&q=@@@&tab=mall' },
        { name: '小红书', engineUrl: 'https://www.xiaohongshu.com/search_result?keyword=@@@&source=web_explore_feed' },
        { name: 'B站', engineUrl: 'https://search.bilibili.com/all?keyword=@@@&search_source=1' },
        { name: 'GitHub', engineUrl: 'https://github.com/search?q=@@@&type=repositories' },
        { name: '百度翻译', engineUrl: 'https://fanyi.baidu.com/#auto/en/@@@' },
    ]);


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




    return (
        <>
            {/* 选择搜索引擎 */}
            <Segmented
                options={searchOptions.map(option => option.name)}
                value={searchStore.searchEngines}
                onChange={(value) => searchStore.setSearchEngines(value)}
            />
            {/* 添加搜索引擎 */}
            <Button icon={<PlusOutlined />} style={{ margin: '0 3px' }} className={"addButton"}/>
            <br />
            {/* 搜索框 */}
            <MySearch onSearch={onSearch} setSearchValue={setSearchValue} />


            <br />
            {/*快速搜索*/}
            <Flex style={{ margin: "5px 80px" }} wrap="wrap" gap="small" justify='center'>
                {quickSearch.map((item, index) => (
                    <Button
                        className={"searchButton"}
                        key={item.name}
                        onClick={() => window.open(item.engineUrl.replace('@@@', searchValue), '_blank')}
                        icon={<ThunderboltOutlined />}
                    >
                        {item.name}
                    </Button>
                ))}
                {/*添加按钮*/}
                <Button icon={<PlusOutlined />} className={"addButton"}/>
            </Flex>

        </>
    )
}
export default observer(Search)