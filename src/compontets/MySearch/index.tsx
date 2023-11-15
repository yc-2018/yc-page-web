import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';
import axios from 'axios';

const { Search } = Input;
// 异步获取百度联想列表
async function getThinkList(param: string) {
    if (!param) return;
    const config = {
        method: 'get',
        url: `/bd/sugrec?ie=utf-&prod=pc&from=pc_web&wd=${param}`,
        headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Accept': '*/*',
            'Host': 'www.baidu.com',
            'Connection': 'keep-alive'
        }
    };

    const response = await axios(config);
    console.log(response.data);
    return response.data.g?.map((item: { q: any }) => ({ value: item.q }));


}
interface ChildComponentProps {
    onSearch: (value: any, event: any) => void;
    }

const MySearch: React.FC<ChildComponentProps> = ({ onSearch }) => {
    // const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const [anotherOptions, setAnotherOptions] = useState<{ value: string }[]>([]);



    const onSelect = (data: string) => {
        console.log('选中联想列表的回调', data);
    };


    return (
        <AutoComplete
            value={value}               //输入框的值
            options={anotherOptions}    //联想列表
            style={{ width: 500, margin: '5px' }}
            onSelect={onSelect}                                                     //选中联想列表的回调
            onChange={v=>setValue(v)}                                               //输入框的值改变的回调
            onSearch={async (text) => setAnotherOptions(await getThinkList(text))}  //输入框值改变时联想列表的回调
            size="large"
        >
            <Search 
            placeholder="求知若渴，解惑在斯。" 
            allowClear 
            size="large" 
            enterButton="Search" 
            onSearch={onSearch}     //点击搜索按钮的回调
            // loading={loading}   //加载状态
            />
        </AutoComplete>
    );
};

export default MySearch;