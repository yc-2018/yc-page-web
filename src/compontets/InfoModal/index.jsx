import {observer} from "mobx-react-lite";
import {Form, Input, Modal} from "antd";
import UserStore from "../../store/UserStore";
import React, {useState} from "react";
import JWTUtils from "../../utils/JWTUtils";
import {updateNameOrAvatar} from "../../request/commonRequest";

export default observer(() => {
    const [confirmLoading, setConfirmLoading] = useState(false) // 是否加载中
    const [infoForm] = Form.useForm()

    /**点击确定按钮事件*/
    const handleOk = async () => {
        infoForm.validateFields().then(async values => {
            const {username, avatar} = values;
            setConfirmLoading(true)
            const funcResult = await updateNameOrAvatar({username, avatar})
            setConfirmLoading(false)
            if (funcResult === 1) {
                UserStore.setInfoModal(false)
                infoForm.resetFields()
            }
        }).catch((e) => console.log('表单有误=>', e))
    }

    return (
        <Modal onOk={handleOk}
               open={UserStore.infoModal}
               confirmLoading={confirmLoading}
               onCancel={()=>UserStore.setInfoModal(false)}
        >
            <Form
                form={infoForm}
                layout="vertical"
                initialValues={{name: JWTUtils.getName(), avatar: JWTUtils.getAvatar()}}
            >
                <Form.Item name="username" label={'用户昵称'}>
                    <Input placeholder={'请输入用户昵称'} />
                </Form.Item>

                <Form.Item name="avatar" label="头像">
                    <Input placeholder="请输入网址" />
                </Form.Item>
            </Form>
        </Modal>
    )
})