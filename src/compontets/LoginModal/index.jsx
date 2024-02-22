import {App, Button, Input, Modal, Radio, Space} from "antd";
import { observer } from 'mobx-react-lite'
import React, {useEffect, useRef, useState} from "react";

import UserStore from "../../store/UserStore";
import {login} from "../../request/homeRequest";

const LoginModal = () => {
    const [expireTime, setExpireTime] = useState(undefined);           // 登录有效时间
    const [loginCaptcha, setLoginCaptcha] = useState(undefined);       // 登录验证码
    const [loginLoading, setLoginLoading] = useState(false);  // 点击登录按钮加载
    const {message} = App.useApp();
    const textRef = useRef(null)  // 输入框的ref 让它能自动获得焦点

    useEffect(()=> {
        if (UserStore.openModal)
            window.setTimeout(() => textRef.current?.focus(), 100) // 点击添加按钮后自动获得焦点,但是一开始没在页面上所以要延迟一点点
    },[UserStore.openModal])
    /**
     * 登录请求
     */
    const goLogin = async() => {
        // 校验 loginCaptcha 是否为6位数字
        if (loginCaptcha?.length!== 6) return message.error('验证码格式有误');

        const isLogin =await login(loginCaptcha, expireTime, setLoginLoading);

        if (isLogin) {
            setLoginCaptcha(undefined);    // 验证码清空
            UserStore.setOpenModal(false);      // 关闭弹出弹窗
        }
    }

    return (
        <Modal
            zIndex={1001}
            open={UserStore.openModal}
            onCancel={() => UserStore.setOpenModal(false)}
            footer={<></>}
        >
                <span style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>
                    <p style={{ fontSize: 20 }}>请使用微信扫一扫关注(仰晨)登录</p>
                    <img src="/wxGzh.jpg"  alt="仰晨公众号二维码"/>

                    <Radio.Group
                        defaultValue="yt"
                        size="small"
                        style={{marginBottom:5}}
                        onChange={(e)=>setExpireTime(e.target.value)}
                    >
                        <Radio.Button disabled style={{color:'#85a2c7'}}>登录有效时长:</Radio.Button>
                        <Radio.Button value="bt">半天</Radio.Button>
                        <Radio.Button value="yt">一天</Radio.Button>
                        <Radio.Button value="yz">一周</Radio.Button>
                        <Radio.Button value="yy">一个月</Radio.Button>
                        <Radio.Button value="yn">一年</Radio.Button>
                    </Radio.Group>
                    <Space.Compact style={{ width: '80%' }} size={"large"}>
                        <Input placeholder="请输入验证码"
                               value={loginCaptcha}
                               onChange={e => setLoginCaptcha(e.target.value)}
                               onPressEnter={goLogin}
                               ref={textRef}
                        />
                        <Button type="primary" onClick={goLogin} loading={loginLoading}>
                            验证登录
                        </Button>
                    </Space.Compact>

                    <p style={{ color: '#fa5555' }}>如已关注，请回复“<strong>登录</strong>”二字获取验证码进行登录</p>
                </span>
        </Modal>
    )
};

export default observer(LoginModal);