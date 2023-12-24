import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';
import searchStore from '../../store/SearchEnginesStore';
import {SendOutlined } from '@ant-design/icons';

import {getThinkList} from "../../request/homeRequest";
import "./MySearch.css"

const { Search } = Input;


interface ChildComponentProps {
    onSearch: (value: any, event: any) => void;
    setSearchValue: (value: any) => void;
    }

const MySearch: React.FC<ChildComponentProps> = ({ onSearch,setSearchValue}) => {
    const [anotherOptions, setAnotherOptions] = useState<{ value: string }[]>([]);

    //存搜索框的值
    let searchValue = undefined;

    return (
        <AutoComplete
            className="inputOpacity"
            value={searchValue}                 //输入框的值
            options={anotherOptions}            //联想列表
            style={{ width: 500, margin: '5px 0 15px 0' }}
          //onSelect={v=>console.log(v,"#########")}                                    //选中联想列表的回调
            onChange={v=>{setSearchValue(v);searchValue = v;}}                         //输入框的值改变的回调
            onSearch={async (text) => setAnotherOptions(await getThinkList(text))}    //输入框值改变时联想列表的回调
          //size='large'
        >
            <Search 
                placeholder="求知若渴，解惑在斯。"
                size="large"
                enterButton={[searchStore.searchEngines,<SendOutlined  key={'搜索按钮'}/>]}      //搜索按钮
                onSearch={onSearch}             //点击搜索按钮的回调
            />
        </AutoComplete>
    );
};

export default MySearch;