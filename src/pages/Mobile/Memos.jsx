import React from 'react'
import { Tabs } from 'antd-mobile'
import Memo from "./Memo";
// todo 待办未完成计数
export default () =>
        <Tabs defaultActiveKey='普通' className={'█tabsContainer'}>

            <Tabs.Tab title='普通' key='普通'> <Memo type={0}/> </Tabs.Tab>
            <Tabs.Tab title='循环' key='循环'> <Memo type={1}/> </Tabs.Tab>
            <Tabs.Tab title='长期' key='长期'> <Memo type={2}/> </Tabs.Tab>
            <Tabs.Tab title='紧急' key='紧急'> <Memo type={3}/> </Tabs.Tab>
            {/*<Tabs.Tab title='英语' key='英语'> <Memo type={4}/> </Tabs.Tab>*/}
            <Tabs.Tab title='日记' key='日记'> <Memo type={5}/> </Tabs.Tab>
            <Tabs.Tab title='工作' key='工作'> <Memo type={6}/> </Tabs.Tab>
            <Tabs.Tab title='其他' key='其他'> <Memo type={7}/> </Tabs.Tab>

        </Tabs>


