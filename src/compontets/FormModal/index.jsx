import React, {useEffect, useRef, useState} from "react";
import {QuestionCircleTwoTone, SmileTwoTone} from "@ant-design/icons";
import {Modal, Input, Radio, Button, DatePicker, Popover, Row, Col} from 'antd';
import {saveOrUpdateToDoItem} from "../../request/memoRequest.js";
import styles from '../../common.module.css'
import modalStyle from './formModal.module.css'
import CommonStore from "../../store/CommonStore";

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
            // 点击编辑或新增按钮后自动获得焦点,但是弹窗没这么快出现在页面上，所以获取焦点也要延迟一点点
        if(isOpen) window.setTimeout(() => textRef.current?.focus(), 100)
    },[isOpen])

    /** 关闭弹窗 */
    const closeModal = () => {
        setOpenDateRange(false)
        setOpenDate(false)
        window.setTimeout(() =>setOpen(false),100 )
    };

    /** 确定按钮（编辑完成给后端发请求） */
    const handleOk = async() => {
        if(!formData.itemType?.toString())return CommonStore.msg.error('备忘类型不能为空')
        if(!formData.content)return CommonStore.msg.error('备忘内容不能为空')

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
        insertAtCursor(`${dateStr}${formData.content ? '' : '\n'}`) // 插入日期 如果本来内容为空 那多加一个换行
        setOpenDate(false)
    }

    /** 插入日期范围 */
    const insertDateRange = (_dates, date2Str) => {
        if (!date2Str[0]) return;
        insertAtCursor(`${date2Str.join('~')}${formData.content ? '' : '\n'}`) // 如果本来内容为空 那多加一个换行
        setOpenDateRange(false)
    }

    /** 插入符号 */
    const signs =
        <Row>
            {symbols.map(sign =>
                <Col key={sign} span={3} onClick={() => insertAtCursor(sign)} className={modalStyle.sign}>
                    {sign}
                </Col>
            )}
        </Row>

    /** 在光标位置后面插入文本的函数 */
    const insertAtCursor = (textToInsert) => {
        // 获取原生的textarea元素
        const textareaElement = textRef.current?.resizableTextArea.textArea ?? {selectionStart:-1,selectionEnd:-1}
        const selectionStart = textareaElement.selectionStart;   // 光标位置
        const selectionEnd = textareaElement.selectionEnd        // 选择情况下的选中最后位置 没选中就是和光标位置一样

        const currentValue = formData.content ?? ''
        const beforeText = currentValue.slice(0, selectionStart);
        const afterText = currentValue.slice(selectionEnd);

        setFormData(formData => ({
            ...formData,
            content: `${beforeText}${textToInsert}${afterText}`
        }));

        window.setTimeout(() => { // setFormData是异步的哇 所以一定要比它还要晚一点 因为它是属于全覆盖 光标自然在最后
            // 重新定位光标到插入点之后
            if (textRef.current) {
                textRef.current?.resizableTextArea.textArea.setSelectionRange(selectionStart + textToInsert.length, selectionStart + textToInsert.length)
                textRef.current.focus();
            }
        }, 100)
    }

    const help =
        <div>
            <p>● 点击插入时间/段,可插入时间/段在输入框光标所在位置</p>
            <p>● 如果输入框本来是空的 插入后会多加一个换行</p>
            <p>● 如果选中了文字 插入会覆盖哦</p>
            <p>● 插入的符号更多
                <Button type="link"
                        href={'https://blog.csdn.net/weixin_46665865/article/details/126132912'}
                        style={{padding:0}}
                        target="_blank"
                >
                    参考这里
                </Button>
            </p>
        </div>


    /** 自定义底部按钮 */
    const footerButtons = [
        <Popover key="help" content={help} title="帮助"><Button icon={<QuestionCircleTwoTone/>} shape="circle"/></Popover>,
        <Popover key="insertSymbol" content={signs} title="插入符号"><Button icon={<SmileTwoTone />} shape="circle"/></Popover>,
        <Button key="RangeButt" onClick={() => setOpenDateRange(v => !v) || setOpenDate(false)}>
            插入日期段
        </Button>,
        <Button key="dateButt" onClick={() => setOpenDate(v => !v) || setOpenDateRange(false)}>
            插入日期
        </Button>,
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
            <TextArea rows={14}
                      showCount
                      ref={textRef}
                      maxLength={2000}
                      value={formData?.content}
                      placeholder="请输入备忘内容"
                      onChange={e => setFormData({...formData, content: e.target.value})}
            />
            {/*日期选择面板*/}
            <DatePicker open={openDate}
                        onChange={insertDate}
                        placement={'topRight'}
                        style={{left:480,top:30, height:20, visibility: 'hidden'}}
            />
            {/*日期范围选择面板*/}
            <DatePicker.RangePicker
                key="dateRange"
                open={openDateRange}
                onChange={insertDateRange}
                placement={'topRight'}
                style={{left:100, height:20, display:openDateRange?'':'none'}}
            />

        </Modal>
    )
}
export default FormModal;




/** 符号列表 */
const symbols =
    [
        '▣', '●', '〓', '▬', '▼', '▲', '▷', '⚫',
        '↔', '⌂', '→', '←', '↖', '↗',
        '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁰',
        '⁺', '⁻', '⁼', '×', '√', '◆', '℃', '𖤐', '♻',
        '֎', '✩', '𖦹', '𓃒', '𐃶', '𐙼', '😶‍🌫️',
    ]