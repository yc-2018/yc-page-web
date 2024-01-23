import {Button, Input, Space} from "antd";
import {DeleteOutlined, DeleteTwoTone} from "@ant-design/icons";
import React, {useState} from "react";

/**
 * 给《待办》底部用的搜索框
 * @param keyword           {string}     搜索框的值
 * @param setKeyword        {function}   搜索框的值
 * @param setRefreshTrigger {function}  设置刷新触发器
 * */
export default ({keyword, setKeyword, setRefreshTrigger}) => {
    const [searchEmpty, setSearchEmpty] = useState(true); // 搜索框为空（搜索框有值没点搜索？）
    return (
        <Space style={{display: 'grid', justifyContent: 'center'}}>    {/*居中*/}
            <Space.Compact>
                <Button icon={searchEmpty ? <DeleteOutlined/> : <DeleteTwoTone twoToneColor={'red'}/>}
                        onClick={() => keyword && (setKeyword(null) || (!searchEmpty && (setRefreshTrigger(v => !v) || setSearchEmpty(true))))}/>
                <Input.Search placeholder="要搜索内容吗😶‍🌫️"
                              value={keyword}
                              style={{width: 300}}
                              onChange={v => setKeyword(v.target.value)}
                              onSearch={() => keyword && (setRefreshTrigger(v => !v) || setSearchEmpty(false))}/>
            </Space.Compact>
        </Space>
    )
}