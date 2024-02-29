import React, { useState } from 'react';
import {Form, Input, Modal} from 'antd';
import CommonStore from "../../../store/CommonStore";

/**
 * 表单弹窗
 * @param {boolean} open     【必须】是否打开
 * @param {function} setOpen 【必须】设置open
 * @param {object} obj       编辑时需要数据
 * @param {number} type     【必须】类型 1:书签组 2:书签
 */
export default ({open, setOpen,obj,type}) => {
    const [bookmarksForm] = Form.useForm()                       // 创建表单域
    const [confirmLoading, setConfirmLoading] = useState(false) // 是否加载中
    const {msg} = CommonStore


    /**点击确定按钮事件*/
    const handleOk = () => {
        bookmarksForm.validateFields().then(async (values) => {
            console.log('███████values>>>>', values,'<<<<██████')
            setConfirmLoading(true)
            setTimeout(() => {
                setOpen(false)
                setConfirmLoading(false)
            }, 2000)
            bookmarksForm.resetFields()
        }).catch(() => msg.error('请填写必填项'))
    }

    /**关闭弹窗事件*/
    const handleCancel = () => {
        console.log('Clicked cancel button'+open)
        setOpen(false)
    }

    /**类型*/
    const typeName = type===1?'书签组':'书签'

    return (
        <Modal
            title={obj?`编辑${typeName}`:`新增${typeName}`}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
        >
            <Form
                form={bookmarksForm}
                layout="vertical"
                initialValues={{name: obj?.name, url: obj?.url,icon:obj?.icon}}
            >
                <Form.Item
                    name="name"
                    label={`${typeName}名称`}
                    rules={[{required: true, message: `${typeName}名称是要写滴`}]}
                >
                    <Input placeholder={`请输入${typeName}名称`} />
                </Form.Item>

                <Form.Item name="url" label="网址" rules={[{required: type===2, message: `网址是要写滴`}]}>
                    <Input placeholder="请输入网址" />
                </Form.Item>

                <Form.Item name="icon" label={'图标'}>
                    <Input placeholder="网址图标" />
                </Form.Item>
            </Form>
        </Modal>
    )
}