import React, {useEffect, useState} from 'react';
import {Form, Input, Modal} from 'antd';
import CommonStore from "../../../store/CommonStore";

/**
 * 表单弹窗
 * @param {boolean} open     【必须】是否打开
 * @param {function} setOpen 【必须】设置open
 * @param {object} obj       编辑时需要数据
 * @param {number} type     【必须】类型 1:书签组 2:书签
 * @param {function} addBookmark 【必须】添加书签方法
 * @param {function} updateBookmark 【必须】修改书签方法
 */
export default ({open, setOpen,obj,type, addBookmark, updateBookmark}) => {
    const [bookmarksForm] = Form.useForm()                       // 创建表单域
    const [confirmLoading, setConfirmLoading] = useState(false) // 是否加载中
    const {msg} = CommonStore

    // 每次修改表达的值都要重置表单 才能获取最新的初始值  因为异步的原因还要手动延迟一下
    useEffect(()=> {
        if (open) setTimeout(() => bookmarksForm.resetFields(), 100)
    },[open])

    /**点击确定按钮事件*/
    const handleOk = async () => {
        bookmarksForm.validateFields().then(async (values) => {
            setConfirmLoading(true)
            const funcResult = obj ? await updateBookmark({...obj, ...values}) : await addBookmark(values)
            setConfirmLoading(false)
            if (!funcResult){   // 成功不返回 失败返回字符串
                msg.success('操作成功')
                setOpen(false)
                bookmarksForm.resetFields()
            }else msg.error('操作失败')
        }).catch((e) => console.log('表单有误=>',e) || msg.error('请填写必填项'))
    }



    /**类型*/
    const typeName = type===1?'书签组':'书签'

    return (
        <Modal
            title={obj?`编辑${typeName}`:`新增${typeName}`}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={() => setOpen(false)}
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

                {/*<Form.Item name="icon" label={'图标'}>*/}
                {/*    <Input placeholder="网址图标" />*/}
                {/*</Form.Item>*/}
            </Form>
        </Modal>
    )
}