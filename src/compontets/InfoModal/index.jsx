import {observer} from "mobx-react-lite";
import {Avatar, Col, Form, Input, Modal, Row} from "antd";
import UserStore from "../../store/UserStore";
import React, {useState} from "react";
import JWTUtils from "../../utils/JWTUtils";
import {updateNameOrAvatar} from "../../request/commonRequest";
import {UserOutlined} from "@ant-design/icons";

export default observer(() => {
    const [confirmLoading, setConfirmLoading] = useState(false) // 是否加载中
    const [avatar, setAvatar] = useState(JWTUtils.getAvatar())
    const [infoForm] = Form.useForm()

    /**点击确定按钮事件*/
    const handleOk = async () => {
        infoForm.validateFields().then(async values => {
            const {username} = values;
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
            </Form>
            <Row>
                <Col span={20}>
                    头像
                    <Input value={avatar} onChange={(e)=>setAvatar(e.target.value)} />
                </Col>
                <Col span={4} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Avatar size={40}
                            style={{backgroundColor: 'rgba(180,171,171,0.45)'}}
                            icon={<UserOutlined />}
                            src={avatar}
                    />
                </Col>
                {[...Array(99).keys()].map(i =>
                        <Avatar key={i}
                                size={40}
                                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${i + 1}`}
                                onClick={()=>setAvatar(`https://api.dicebear.com/7.x/miniavs/svg?seed=${i + 1}`)}
                        />
                )}
            </Row>

        </Modal>
    )
})