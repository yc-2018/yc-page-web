import React from "react";
import {Button, Avatar, List, Dialog} from 'antd-mobile'

import UserStore from "../../store/UserStore";
import JWTUtils from "../../utils/JWTUtils";

/**
 * @param setBarItem {function} 设置当前页面:用来退出后登录设置会到待办页面，不然重新登录进来会有bug
 * */
export default ({setBarItem}) =>
  <div style={{padding: '10px'}}>
    <List>
      <List.Item
        prefix={<Avatar src={JWTUtils.getAvatar()}/>}
        description={`${getGreeting()},${JWTUtils.getName()}`}
      >
        {JWTUtils.getName()}
      </List.Item>
      <List.Item
        onClick={() => {
          Dialog.alert({
            content: '直接发到公众号但是查看不及时,也可以通过邮箱:cgl556@foxmail.com进行反馈。',
            closeOnMaskClick: true,
          })
        }}>意见反馈</List.Item>

      <List.Item onClick={() => {
        Dialog.alert({
          image: 'https://s21.ax1x.com/2024/04/04/pFbrav9.jpg',
          title: '感谢你的支持!',
          confirmText:'关闭',
        })
      }}>打赏</List.Item>

    </List>
    <Button block color='danger' onClick={() => {
      setBarItem('Memos')
      UserStore.clearJwt()
    }}>退出登录</Button>
  </div>




/** 获取问候语 */
const getGreeting = () => {
  let date = new Date();  // 创建一个新的 Date 对象
  let hour = date.getHours(); // 获取当前的小时数（24小时制）

  // 根据小时数返回不同的问候语
  if (hour >= 0 && hour < 6) return '夜深了早点休息吧';
  if (hour >= 6 && hour < 9) return '早上好';
  if (hour >= 9 && hour < 12) return '上午好';
  if (hour >= 12 && hour < 14) return '中午好';
  if (hour >= 14 && hour < 18) return '下午好';
  if (hour >= 18 && hour < 22) return '晚上好';

  return '你好';
}
