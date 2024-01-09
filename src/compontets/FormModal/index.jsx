import React, {useEffect, useState} from "react";
import {Modal, Input, Radio, Space, Divider} from 'antd';
import {saveOrUpdateToDoItem} from "../../request/homeRequest";
import Msg from "../../store/Msg";
const { TextArea } = Input;
/**
 * 新增/编辑备忘录弹窗
 *
 * @param {boolean}     isOpen          弹窗是否显示
 * @param {function}    setOpen         关闭弹窗
 * @param {object}      data            编辑的数据
 * @param {function}    reList          刷新列表
 * @param {number}      currentMemoType 当前备忘类型,编辑的不用，新增的才要
 * */
const FormModal = ({isOpen,setOpen,data,reList,currentMemoType}) => {
    const [formData, setFormData] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    useEffect(()=> {
        if(data) setFormData(data)
        else setFormData({
            content:null,
            itemType:currentMemoType,
        })
    },[data])
    const handleOk = async() => {
        if(!formData.itemType?.toString())return Msg.msg.error('备忘类型不能为空')
        if(!formData.content)return Msg.msg.error('备忘内容不能为空')

        setConfirmLoading(true);
        // 构造请求体
        let body = {};
        body.content = formData.content===data?.content?null:formData.content;
        body.itemType = formData.itemType===data?.itemType?null:formData.itemType;
        body.id = data?.id;
        let result = await saveOrUpdateToDoItem(body,data && "put");
        if(result) {
            setOpen(false);
            reList(Math.random()) // 刷新列表
        }
        setConfirmLoading(false);
    };

    return (
        <Modal title={data?"编辑备忘":"新增备忘"} open={isOpen} onOk={handleOk} onCancel={()=>setOpen(false)} confirmLoading={confirmLoading}>
            <Divider plain>
                <Space direction={'vertical'} style={{marginBottom:20}}>
                    <Radio.Group onChange={(e)=>{setFormData({...formData,itemType:e.target.value})}} defaultValue={formData?.itemType} value={formData?.itemType} buttonStyle="solid">
                        <Radio.Button value={0}>普通</Radio.Button>
                        <Radio.Button value={1}>循环</Radio.Button>
                        <Radio.Button value={2}>长期</Radio.Button>
                        <Radio.Button value={3}>紧急</Radio.Button>
                        <Radio.Button value={5}>日记</Radio.Button>
                        <Radio.Button value={6}>工作</Radio.Button>
                        <Radio.Button value={7}>其他</Radio.Button>
                    </Radio.Group>
                    <TextArea rows={16} maxLength={2000} showCount placeholder="请输入备忘内容" value={formData?.content} onChange={(e)=>setFormData({...formData,content:e.target.value})}/>
                </Space>
            </Divider>
        </Modal>
    );
};
export default FormModal;