import React from "react";
import {Button, Avatar, List} from 'antd-mobile'

import UserStore from "../../store/UserStore";
import JWTUtils from "../../utils/JWTUtils";

/**
 * @param setBarItem {function} 设置当前页面:用来退出后登录设置会到待办页面，不然重新登录进来会有bug
 * */
export default ({setBarItem}) =>
    <div style={{padding: '10px'}}>
        <List>
            <List.Item
                prefix={<Avatar src=''/>}
                description='你的个性签名'
            >
                {JWTUtils.getName()}
            </List.Item>
            <List.Item extra={<Button>Go</Button>}>意见反馈</List.Item>
            <List.Item extra={<Button>Go</Button>}>打赏</List.Item>
        </List>
        <Button block color='danger' onClick={() => {
            setBarItem('Memos')
            UserStore.clearJwt()
        }}>退出登录</Button>
    </div>
