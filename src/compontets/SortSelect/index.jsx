import {Select, Space} from "antd";
import {SwapOutlined} from "@ant-design/icons";
import React from "react";
import './SortSelect.css'

/**
 * 排序选择框
 * @param {function} onChange 选择框值改变时的回调函数
 * @param {[]}       options 选项
 * @param {number}  width   选项框宽度
 * @param {string} defaultValue 默认值
 * @param {boolean} loading 是否显示加载中
 * */
const SortSelect = ({onChange, options,defaultValue , width,loading}) =>
    <Space style={{margin:'0 8px'}}>
        <Space.Compact className={'sParent'}>
            <SwapOutlined rotate={90} className={'select-icon'}/>
            <Select
                icon={<SwapOutlined rotate={90}/>}
                size={'small'}
                defaultValue={defaultValue}
                style={{width}}
                onChange={onChange}
                options={options}
                loading={loading}
            />
        </Space.Compact>
    </Space>

export default SortSelect