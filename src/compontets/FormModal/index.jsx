import React, {useEffect, useRef, useState} from "react";
import {Modal, Input, Radio, Space, Divider, App} from 'antd';
import {saveOrUpdateToDoItem} from "../../request/homeRequest";
const { TextArea } = Input;
/**
 * 新增/编辑备忘录弹窗
 *
 * @param {boolean}     isOpen          弹窗是否显示
 * @param {function}    setOpen         关闭弹窗
 * @param {object}      data            编辑的数据（不改变的）
 * @param {function}    reList          刷新列表
 * @param {number}      currentMemoType 当前备忘类型,编辑的不用，新增的才要
 * */
const FormModal = ({isOpen,setOpen,data,reList,currentMemoType}) => {
    const [formData, setFormData] = useState(null);    // 用来复制编辑的数据（改变的）
    const [confirmLoading, setConfirmLoading] = useState(false);

    const textRef = useRef(null)  // 搜索框的ref 让它能自动获得焦点

    const { message } = App.useApp();

    // 初始化数据
    useEffect(()=> {
        if(data) setFormData(data)  // 编辑时，初始化数据
        else setFormData({    // 新增时，初始化数据
            content:null,
            itemType:currentMemoType,
        })
    },[data])

    // 打开后自动获得焦点
    useEffect(()=> {
        if(isOpen)
            // 点击编辑或新增按钮后自动获得焦点,但是弹窗没这么快出现在页面上，所以获取焦点也要延迟一点点
            window.setTimeout(() => textRef.current?.focus(), 100)
    },[isOpen])


    /** 确定按钮（编辑完成给后端发请求） */
    const handleOk = async() => {
        if(!formData.itemType?.toString())return message.error('备忘类型不能为空')
        if(!formData.content)return message.error('备忘内容不能为空')

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
                    <TextArea rows={16}
                              maxLength={2000}
                              showCount
                              placeholder="请输入备忘内容"
                              value={formData?.content}
                              ref={textRef}
                              onChange={(e)=>setFormData({...formData,content:e.target.value})}
                    />
                </Space>
            </Divider>
        </Modal>
    );
};
export default FormModal;