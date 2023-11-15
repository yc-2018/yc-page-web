import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';
import axios from 'axios';
import { observer } from 'mobx-react-lite'
import searchStore from '../../store/SearchEnginesStore';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Search } = Input;
// 异步获取百度联想列表
async function getThinkList(param: string) {
    if (!param) return;
    const response = await axios.get(`/bd/sugrec?ie=utf-&prod=pc&from=pc_web&wd=${param}`);
    console.log(response.data);
    return response.data.g?.map((item: { q: any }) => ({ value: item.q }));


}
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
            value={searchValue}                 //输入框的值
            options={anotherOptions}            //联想列表
            style={{ width: 500, margin: '5px 0 15px 0' }}
            // onSelect={onSelect}                                                    //选中联想列表的回调
            onChange={v=>{searchValue = v; setSearchValue(v);}}                       //输入框的值改变的回调
            onSearch={async (text) => setAnotherOptions(await getThinkList(text))}    //输入框值改变时联想列表的回调
            // size='large'
        >
            <Search 
            placeholder="求知若渴，解惑在斯。" 
            size="large" 
            enterButton={[searchStore.searchEngines,<ArrowRightOutlined key={'搜索按钮'}/>]}      //搜索按钮
            onSearch={onSearch}             //点击搜索按钮的回调
            />
        </AutoComplete>
    );
};

export default MySearch;