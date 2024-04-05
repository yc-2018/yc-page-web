import React, {useRef} from "react";
import {Button, Avatar, List, Dialog, Toast,Grid} from 'antd-mobile'

import UserStore from "../../store/UserStore";
import JWTUtils from "../../utils/JWTUtils";
import {Input} from "antd";
import {updateNameOrAvatar} from "../../request/commonRequest";


let username = JWTUtils.getName()   // 获取用户名
let avatar = JWTUtils.getAvatar()   // 获取头像

/**
 * @param setBarItem {function} 设置当前页面:用来退出后登录设置会到待办页面，不然重新登录进来会有bug
 * */
export default ({setBarItem}) => {
  const avatarRef = useRef()        // 头像ref 因为弹窗是静态的 用不了state 所以用ref

  return (
    <div style={{padding: '10px'}}>
      <List>
        <List.Item
          prefix={<Avatar src={JWTUtils.getAvatar()}/>}
          description={`${getGreeting()},${JWTUtils.getName()}`}
          onClick={() => {
            Dialog.confirm({
              content: <>
                <span>昵称：</span>
                <Input
                  defaultValue={username}
                  placeholder='请输入用户名'
                  onChange={v => {username=v.target.value}}
                />
                <br/>

                <div>头像：</div>
                <img
                  width={100}
                  src={avatar}
                  style={{display: 'inline-block'}}
                  ref={avatarRef}
                  alt
                />

                <Grid columns={5} gap={2}>
                  {[...Array(100).keys()].map(i =>
                    <Avatar key={i}
                            size={40}
                            src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${i + 1}`}
                            onClick={()=> {
                                avatar = `https://api.dicebear.com/7.x/miniavs/svg?seed=${i + 1}`
                                avatarRef.current.src = avatar
                            }}
                    />
                  )}
                </Grid>
              </>,
              closeOnMaskClick: true,
              onConfirm: async () => {
                const funcResult = await updateNameOrAvatar({username, avatar})
                Toast.show({
                  icon: funcResult === 1 ? 'success' : 'fail',
                  content: funcResult === 1 ? '提交成功' : '提交失败'
                })
              },
            })
          }}
        >
          {JWTUtils.getName()}
        </List.Item>

        {/*意见反馈*/}
        <List.Item
          onClick={() => {
            Dialog.alert({
              content: '直接发到公众号但是查看不及时,也可以通过邮箱:cgl556@foxmail.com进行反馈。',
              closeOnMaskClick: true,
            })
          }}
        >
          意见反馈
        </List.Item>

        {/*打赏*/}
        <List.Item
          onClick={() => {
            Dialog.alert({
              image: 'https://s21.ax1x.com/2024/04/04/pFbrav9.jpg',   // 微信+支付宝收款码图片
              title: '感谢你的支持!',
              confirmText: '关闭',
            })
          }}
        >
            打赏
        </List.Item>
      </List>

      {/*退出登录*/}
      <Button block color='danger'
              onClick={() => {
                setBarItem('Memos')
                UserStore.clearJwt()
              }}
      >
        退出登录
      </Button>
    </div>)
}


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
