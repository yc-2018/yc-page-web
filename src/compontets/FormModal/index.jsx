import React, {useEffect, useRef, useState} from "react";
import {Modal, Input, Radio, App, Button, DatePicker} from 'antd';
import {saveOrUpdateToDoItem} from "../../request/homeRequest";
import styles from '../../common.module.css'
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
    const [confirmLoading, setConfirmLoading] = useState(false)

    const [openDate, setOpenDate] = useState(false)                 // 日期选择
    const [openDateRange, setOpenDateRange] = useState(false)       // 日期范围选择

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

    /** 关闭弹窗 */
    const closeModal = () => {
        setOpenDateRange(false)
        setOpenDate(false)
        window.setTimeout(() =>setOpen(false),100 )
    };

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
            closeModal();
            reList(Math.random()) // 刷新列表
        }
        setConfirmLoading(false);
    };

    /** 插入日期 */
    const insertDate = (_date, dateStr) => {
        const content = dateStr + '\n' + (formData.content ?? '');
        setFormData({...formData,content})
        setOpenDate(false)
        textRef.current?.focus() // 将光标移动到最后
    }

    /** 插入日期范围 */
    const insertDateRange = (_dates, date2Str) => {
        const content = date2Str.join('~') + '\n' + (formData.content ?? '');
        setFormData({...formData,content})
        setOpenDateRange(false)
        textRef.current?.focus() // 将光标移动到最后
    }

    /** 自定义底部按钮 */
    const footerButtons = [
        <Button key="dateButt" onClick={() => setOpenDate(v => !v) || setOpenDateRange(false)}>
            插入日期
        </Button>,
        <Button key="RangeButt" onClick={() => setOpenDateRange(v => !v) || setOpenDate(false)}>
            插入日期段
        </Button>,
        <DatePicker key="date" open={openDate} onChange={insertDate} placement={'topRight'} style={{visibility: 'hidden', width: 0}}/>,
        <DatePicker.RangePicker
            key="dateRange"
            open={openDateRange}
            onChange={insertDateRange}
            placement={'topRight'}
            style={{visibility: 'hidden'}}
        />,
        <Button key="back" onClick={closeModal}>返回</Button>,
        <Button key="submit" type="primary" onClick={handleOk} loading={confirmLoading}>提交</Button>,
    ]

    return (
        <Modal
            width={888}
            title={data ? "编辑备忘" : "新增备忘"}
            open={isOpen}
            onCancel={closeModal}
            footer={footerButtons}
        >
            <div className={styles.lrCenter}>
                <Radio.Group
                    onChange={(e) => setFormData({...formData, itemType: e.target.value})}
                    value={formData?.itemType}
                    buttonStyle="solid"
                    style={{margin: 5}}
                >
                    <Radio.Button value={0}>普通</Radio.Button>
                    <Radio.Button value={1}>循环</Radio.Button>
                    <Radio.Button value={2}>长期</Radio.Button>
                    <Radio.Button value={3}>紧急</Radio.Button>
                    <Radio.Button value={5}>日记</Radio.Button>
                    <Radio.Button value={6}>工作</Radio.Button>
                    <Radio.Button value={7}>其他</Radio.Button>
                </Radio.Group>
            </div>
            <TextArea rows={16}
                      showCount
                      ref={textRef}
                      maxLength={2000}
                      value={formData?.content}
                      placeholder="请输入备忘内容"
                      onChange={e => setFormData({...formData, content: e.target.value})}
            />
        </Modal>
    )
}
export default FormModal;