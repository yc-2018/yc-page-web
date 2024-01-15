import React, {useState} from 'react'
import { Tabs,Badge } from 'antd-mobile'
import Memo from "./Memo";

const tabList = [
    {title: '普通', type: 0},
    {title: '循环', type: 1},
    {title: '长期', type: 2},
    {title: '紧急', type: 3},
 // {title: '英语', type: 4},
    {title: '日记', type: 5},
    {title: '工作', type: 6},
    {title: '其他', type: 7},
]
export default () =>{

    // 显示计数
    const [incompleteCounts,setIncompleteCounts] = useState({0:null,1:null,2:null,3:null,5:null,6:null,7:null})
    // 新增或修改的数据 不再目前的待办就要处理的值，把那个类型的待办重置
    const [changeType, setChangeType] = useState(-1)

    return (
        <Tabs defaultActiveKey='普通' className={'█tabsContainer'}>

            {tabList.map(tab=>
                <Tabs.Tab title={<Badge content={incompleteCounts[tab.type]}>{tab.title}</Badge>} key={tab.title}>
                    <Memo type={tab.type} setIncompleteCounts={setIncompleteCounts} changeType={changeType} setChangeType={setChangeType}/>
                </Tabs.Tab>)
            }
        </Tabs>
    )
}



