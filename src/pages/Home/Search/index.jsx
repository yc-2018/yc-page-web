import { Segmented, Flex, Button } from 'antd'
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite'
import { ThunderboltOutlined, PlusOutlined } from '@ant-design/icons';
import MySearch from '../../../compontets/MySearch';
import searchStore from '../../../store/SearchEnginesStore';
import {searchData} from '../../../store/NoLoginData';

import "./Search.css"


function Search() {
    // const [searchEngines, setSearchEngines] = useState("Bing");  //放bomx去了
    const [searchValue, setSearchVal] = useState();
    const setSearchValue = value => setSearchVal(value)     // 输入框的值改变的回调(直接传setSearchVal给子组件会报错：Rendered more hooks than during the previous render.)
    
    const [searchOptions, setSearchOptions] = useState(searchData.filter(item => item.isQuickSearch === 0));    // 搜索引擎列表
    const [quickSearch, setQuickSearch] = useState(searchData.filter(item => item.isQuickSearch === 1));        // 快速搜索列表
    // TODO 登录更新搜索引擎列表
    

    // 点击搜索按钮 或回车触发的事件
    const onSearch = (value, _e) => {
        //通过搜索引擎名字找到他对应的URL=》这就要求名字在一个用户中是唯一的
        const engineUrl = searchOptions.find(option => option.name === searchStore.searchEngines).engineUrl;
        window.open(engineUrl.replace('@@@', searchValue), '_blank');
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