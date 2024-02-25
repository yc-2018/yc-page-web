import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Dnd from "../../../compontets/Dnd";
import {Button, Dropdown} from "antd";

/**
 * 配置拖动元素
 * @param {Object} obj
 * */
export default function({ obj }) {
    const {
        attributes,   // 拖动元素属性
        listeners,  // 拖动事件|手柄
        setNodeRef,                   // 拖动元素的ref
        transform,        // 拖动元素的transform
        transition,         // 拖动元素的过渡效果
    } = useSortable({ id:obj.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '1px 0',
    };

    return (

        <div ref={setNodeRef} style={style} {...attributes}>
            <span {...listeners} className={'mouseMove'} style={{color:'#00000030'}}>☰</span>
            <Dropdown
                dropdownRender={() =>
                    <div className={'ant-dropdown-menu'}>
                        <Dnd/>
                    </div>
                }
            >
                <Button ghost           // 使按钮背景透明
                        type="dashed"
                        size='small'
                        href={"https://ant-design.gitee.io/components/dropdown-cn"}
                        style={{textShadow:' 0px 0px 5px #abc9ec', borderColor: 'rgb(0 0 0)'}}
                >
                    {obj.name}
                </Button>
            </Dropdown>
        </div>


    );
}
