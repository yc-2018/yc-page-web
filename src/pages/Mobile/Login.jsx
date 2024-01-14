import React, { useRef } from 'react'
import {Form, Input, Radio, Button, Toast} from 'antd-mobile'
import {login} from "../../request/homeRequest";
import styles from './mobile.module.css'

export default function () {
    const formRef = useRef()
    const [loginLoading, setLoginLoading] = React.useState(false)

    const handleSubmit = () => {
        formRef.current.validateFields().then(values => {
            // 获取表单数据去登录
            login(values.code, values.duration, setLoginLoading);
        }).catch(_ => {
            Toast.show({icon: 'fail', content: '请输入按提示输入表单'})
        })
    }

    return (
        <>
            <span style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>
                <p style={{ fontSize: 20 }}>欢迎来到Open备忘第一页</p>
                <p style={{ color: '#fa5555' }}>请关注<strong>仰晨</strong>，并回复“<strong>登录</strong>” 获取验证码进行登录</p>
                <img src="https://i.niupic.com/images/2024/01/14/fhhB.jpg"  alt="仰晨公众号二维码" className={styles.qrCode}/>
            </span>
            <Form ref={formRef}
                  footer={
                      <Button block type="submit" color="primary" size="large" onClick={handleSubmit} loading={loginLoading}>
                          登录
                      </Button>
                  }

            >
                <Form.Item
                    name="code"
                    label="登录验证码"
                    rules={[{ required: true, len: 6, message: '请输入6位数字' }]}
                >
                    <Input type="number" placeholder="请输入6位数字" />
                </Form.Item>
                <Form.Item name="duration" label="登录有效期" initialValue="bt">
                    <Radio.Group>
                        <Radio value="bt">半天&nbsp;</Radio>
                        <Radio value="yt">一天&nbsp;</Radio>
                        <Radio value="yz">一周&nbsp;</Radio>
                        <Radio value="yy">一个月&nbsp;</Radio>
                        <Radio value="yn">一年</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </>
    )
}
