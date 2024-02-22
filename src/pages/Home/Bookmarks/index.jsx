import React, {useState} from "react";
import { Button, Dropdown, Space } from 'antd';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy
} from '@dnd-kit/sortable';

import CommonStore from "../../../store/CommonStore";
import Dnd from "../../../compontets/Dnd";
import Menu from "./Menu";


export default function Bookmarks() {
    const [items, setItems] = useState([
        { id: "1hhh", name: 'Item 1' },
        { id: "2hhh", name: 'Item 2' },
        { id: "3hhh", name: 'Item 3' },
    ]);
    const itemss = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://ant-design.gitee.io/components/dropdown-cn">     {/*添加 rel="noopener" 可以阻止新页面通过 window.opener 属性访问和操纵打开它的页面。这有助于防止某些类型的恶意攻击，比如点击劫持。noreferrer：这个值用于指示浏览器在打开链接时不要发送 HTTP 引用头。通常，当用户点击一个链接时，浏览器会向新页面传递一个引用头（Referrer Header），告诉新页面这个请求是从哪个页面发起的。noreferrer 可以用来增强隐私保护，因为它阻止了这种行为。同时，它也隐式地提供了 noopener 的功能，因为在不发送引用头的情况下，新页面通常无法访问 window.opener。*/}
                    下拉菜单 Dropdown - Ant Design
                </a>
            ),
            icon: <img alt src="https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png" width={10} />,
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            icon: <img alt src="https://g.csdnimg.cn/static/logo/favicon32.ico" width={10} />,
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer"  href="https://x.chatmindai.net/">
                    gpt一年
                </a>
            ),
            icon: <img alt src="https://x.chatmindai.net/Logo.png" width={10} />,
        },
        {
            key: '4',
            label: 'a danger item',
            icon: <img alt src="https://x.chatmindai.net/Logo.png" width={10} />,
        },
    ];

    // 使用自定义Hook来获取传感器数据
    const sensors = useSensors(
        // 使用自定义Hook来获取鼠标传感器数据
        useSensor(PointerSensor),
        // 使用自定义Hook来获取键盘传感器数据，并指定坐标获取器（暂时没用）
        // useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );



    /**
     * 当拖拽结束时触发的回调函数
     * */
    const handleDragEnd = event => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                // 找到拖拽项目（active.id）的索引
                const oldIndex = items.findIndex(item => item.id === active.id);
                // 找到目标位置项目（over.id）的索引
                const newIndex = items.findIndex(item => item.id === over.id);
                console.log('███████newIndex>>>>', arrayMove(items, oldIndex, newIndex),'<<<<██████')
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <Space>

            <Dropdown menu={{ itemss, }} >
                <Button 
                    ghost 
                    type="dashed" 
                    size='small' 
                    href={"https://x.chatmindai.net/"} 
                    style={{textShadow:' 0px 0px 5px #abc9ec', borderColor: 'rgb(0 0 0)'}}
                >
                    ikun
                </Button>
            </Dropdown>

            <Dropdown
                dropdownRender={() =>
                    <div className={'ant-dropdown-menu'}>
                        <Dnd/>
                    </div>
                }
            >
                <Button ghost type="dashed" size='small' href={"https://ant-design.gitee.io/components/dropdown-cn"}>小黑子</Button>
            </Dropdown>


            <Dropdown onClick={() => { CommonStore.msg.info('不知道怎么写好，害') }}
                dropdownRender={() =>
                    <img alt src="https://x.chatmindai.net/Logo.png" width={50} />
                }
            >
                <Button ghost type="dashed" size='small' >
                    吃饭码
                </Button>
            </Dropdown>


            <Dropdown dropdownRender={() => <div />}>
                <a rel="noopener noreferrer"  href='https://ant-design.gitee.io/components/select-cn'>antd选择器</a>
            </Dropdown>

            {/**
             * sensors:  传感器是用于处理拖拽输入的设备，例如鼠标、触摸屏或键盘。sensors 属性允许你定义用于拖拽操作的传感器数组。
             * collisionDetection: 碰撞检测是确定拖拽项目在移动过程中与哪些项目发生交互的算法。
             * onDragEnd: 当拖拽结束时触发的回调函数。
             * ——————————
             * items: 这个属性接受一个项目标识符的数组，定义了哪些项目是可排序的。这些标识符通常是字符串或数字，用于唯一标识每个可拖拽项目。
             * strategy: 排序策略定义了项目排序的逻辑。verticalListSortingStrategy 是 @dnd-kit/sortable 提供的一个策略，用于垂直列表的排序。这个策略决定了项目如何根据拖拽操作重新排序。
             * */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(item => item.id)}
                                 strategy={horizontalListSortingStrategy}
                >
                    {items.map(item =>
                        <Menu key={item.id} obj={item} />
                    )}
                </SortableContext>
            </DndContext>

        </Space>
    )
}
