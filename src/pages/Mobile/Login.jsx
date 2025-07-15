import React, { useRef } from 'react'
import {Form, Input, Button, Toast, Selector} from 'antd-mobile'
import {login} from "../../request/commonRequest";
import styles from './mobile.module.css'
import {getWelcomePic, loginTime} from "./data.jsx";
import Filing from "@/components/Filing";

export default () => {
    const formRef = useRef()
    const [loginLoading, setLoginLoading] = React.useState(false)

    const handleSubmit = () => {
        formRef.current.validateFields()
            .then(values => {login(values.code, values.duration, setLoginLoading);})    // 获取表单数据去登录
            .catch(_ => {Toast.show({icon: 'fail', content: '请输入按提示输入表单'})})
    }

    return (
        <>
            <span style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>
                <p style={{ fontSize: 20 }}>欢迎来到Open备忘第一页</p>
                <p style={{ color: '#fa5555' }}>请关注<strong>仰晨</strong>，并回复“<strong>登录</strong>” 获取验证码进行登录</p>
                <img src={getWelcomePic()}  alt="仰晨欢迎你" className={styles.qrCode}/>
            </span>
            <Form ref={formRef}
                  footer={
                      <Button block type="submit" color="primary" size="large" onClick={handleSubmit} loading={loginLoading}>
                          登录
                      </Button>
                  }
            >
                <Form.Item name="code"
                           label="登录验证码"
                           rules={[{ required: true, len: 6, message: '请输入6位数字' }]}>
                    <Input type="number" placeholder="请输入6位数字" />
                </Form.Item>

                <Form.Item name="duration"
                           label="登录有效期"
                           initialValue="yt"
                           rules={[{ required: true, message: '请选择登录时间' }]}>
                    <Selector options={loginTime}/>
                </Form.Item>
            </Form>

          <div style={{position: 'absolute', bottom: 15,display: 'flex',justifyContent: 'center',width: '100%'}}>
            <Filing/>
          </div>

        </>
    )
}
