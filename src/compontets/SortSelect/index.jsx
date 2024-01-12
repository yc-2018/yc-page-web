import {Select, Space} from "antd";
import {SwapOutlined} from "@ant-design/icons";
import React from "react";
import './SortSelect.css'

/**
 * 排序选择框
 * @param {function} onChange 选择框值改变时的回调函数
 * @param {[]}       options 选项
 * @param {number}  value   选项值
 * @param {number}  width   选项下的选择框宽度
 * @param {boolean} loading 是否显示加载中
 * */
const SortSelect = ({onChange, options,value , width,loading}) =>
    <Space style={{margin:'0 8px'}}>
        <Space.Compact className={'sParent'}>
            <SwapOutlined rotate={90} className={'select-icon'}/>
            <Select
                bordered={false}
                icon={<SwapOutlined rotate={90}/>}
                size={'small'}
                value={value}
                onChange={onChange}
                options={options}
                loading={loading}
                popupMatchSelectWidth={width ?? 70}
                placement={'bottomRight'}
            />
        </Space.Compact>
    </Space>

export default SortSelect