import {Button, Input, Space} from "antd";
import {DeleteOutlined, DeleteTwoTone} from "@ant-design/icons";
import React from "react";

/**
 * 给《待办》底部用的搜索框
 * @param keyword           {string}     搜索框的值
 * @param setKeyword        {function}   搜索框的值
 * @param setRefreshTrigger {function}  设置刷新触发器
 * @param searchEmpty      {boolean}    搜索框是否为空(是否为空,清空图标变红)
 * @param setSearchEmpty   {function}  设置搜索框是否为空
 * @param setOpenMemoText  {function}  展开备忘录内容（每条默认显示100个字符，展开就是显示全部） 1展开 非1收缩
 * */
const SearchBox = ({keyword, setKeyword, setRefreshTrigger, searchEmpty, setSearchEmpty, setOpenMemoText}) =>
  <Space style={{display: 'grid', justifyContent: 'center'}}>    {/*居中*/}
    <Space.Compact>
      <Button
        icon={searchEmpty ? <DeleteOutlined/> : <DeleteTwoTone twoToneColor={'red'}/>}
        onClick={() => {
          if (keyword) {
            setOpenMemoText(0)
            setKeyword(null)
            !searchEmpty && (setRefreshTrigger(v => !v) || setSearchEmpty(true))
          }
        }}
      />
      
      <Input.Search
        placeholder="要搜索内容吗😶‍🌫️"
        value={keyword}
        style={{width: 300}}
        onChange={v => setKeyword(v.target.value)}
        onSearch={() => keyword && (setOpenMemoText(1) || (setRefreshTrigger(v => !v) || setSearchEmpty(false)))}
      />
    </Space.Compact>
  </Space>

export default SearchBox