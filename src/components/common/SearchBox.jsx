import {Button, Input, Space} from "antd";
import {DeleteOutlined, DeleteTwoTone} from "@ant-design/icons";
import React from "react";

/**
 * 给《待办》底部用的搜索框
 * @param keyword           {string}     搜索框的值
 * @param setKeyword        {function}   搜索框的值
 * @param sxSj              {function}   设置刷新触发器
 * @param searchEmpty      {boolean}    搜索框是否为空(是否为空,清空图标变红)
 * @param setSearchEmpty   {function}  设置搜索框是否为空
 * */
const SearchBox = ({keyword, setKeyword, sxSj, searchEmpty, setSearchEmpty}) =>
  <Space style={{display: 'grid', justifyContent: 'center'}}>    {/*居中*/}
    <Space.Compact>
      <Button   // ————————————————————清除搜索——————————————————
        icon={searchEmpty ? <DeleteOutlined/> : <DeleteTwoTone twoToneColor={'red'}/>}
        onClick={() => {
          keyword && setKeyword(null)
          !searchEmpty && (sxSj() || setSearchEmpty(true))
        }}
      />
      
      <Input.Search // ————————————————搜索内容——————————————————
        placeholder="要搜索内容吗😶‍🌫️"
        value={keyword}
        style={{width: 300}}
        onChange={v => setKeyword(v.target.value)}
        onSearch={() => {
          // 已搜索 但搜索框的的值被清空
          if (!searchEmpty && !keyword) sxSj() || setSearchEmpty(true)
            // 搜索框有值，直接搜索
          else if (keyword) sxSj() || setSearchEmpty(false)
        }}
      />
    </Space.Compact>
  </Space>

export default SearchBox