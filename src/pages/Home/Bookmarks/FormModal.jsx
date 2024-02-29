import React, { useState } from 'react';
import { Modal } from 'antd';

/**
 * 表单弹窗
 * @param {boolean} open     【必须】是否打开
 * @param {function} setOpen 【必须】设置open
 * @param {object} obj       编辑时需要数据
 * @param {number} type     【必须】类型 1:书签组 2:书签
 */
export default ({open, setOpen,obj,type}) => {
    const [confirmLoading, setConfirmLoading] = useState(false) // 是否加载中


    /**点击确定按钮事件*/
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000)
    }

    /**关闭弹窗事件*/
    const handleCancel = () => {
        console.log('Clicked cancel button'+open);
        setOpen(false);
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
            <p>表单</p>
        </Modal>
    )
}