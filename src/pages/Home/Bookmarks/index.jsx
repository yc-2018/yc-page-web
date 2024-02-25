import React, {useState} from "react";
import {DndContext, closestCenter, PointerSensor, useSensor} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy
} from '@dnd-kit/sortable';

import Menu from "./Menu";


export default function Bookmarks() {
    const [items, setItems] = useState([
        {id: "11hhh", name: 'Item 111111'},
        {id: "22hhh", name: 'Item 2222'},
        {id: "33hhh", name: 'Item 33'},
        {id: "43hhh", name: 'Item 44'},
        {id: "5hhh", name: 'Item 55'},
        {id: "6hhh", name: 'Item 66'},
        {id: "37h", name: 'Item 77'},
        {id: "338h", name: 'Item 88'},
        {id: "33h9hh", name: 'Item 99'},
        {id: "331hhh", name: 'Item aa'},
        {id: "33h11hh", name: 'Item ss'},
        {id: "33h12hh", name: 'Item dd'},
        {id: "3314hhh", name: 'Item ff'},
        {id: "33hh13h", name: 'Item gg'},
        {id: "33h15hh", name: 'Item hh'},
        {id: "dd", name: 'Item dd'},
        {id: "cc", name: 'Item cc'},
        {id: "zz", name: 'Item zz'},
        {id: "vv", name: 'Item vv'},
        {id: "tt", name: 'tt hh'},
    ]);


    // 使用自定义Hook来获取鼠标传感器数据
    const sensors = [useSensor(PointerSensor)]


    /**
     * 当拖拽结束时触发的回调函数
     * */
    const handleDragEnd = event => {
        const {active, over} = event;

        if (active.id !== over.id) {
            setItems((items) => {
                // 找到拖拽项目（active.id）的索引
                const oldIndex = items.findIndex(item => item.id === active.id);
                // 找到目标位置项目（over.id）的索引
                const newIndex = items.findIndex(item => item.id === over.id);
                console.log('███████newIndex>>>>', arrayMove(items, oldIndex, newIndex), '<<<<██████')
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',        // 启用换行
            flexDirection: 'row',   // 子元素默认会在一行内排列，不会换行
            gap: '0' /* 根据需要调整间距 */}}>
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
                        <Menu key={item.id} obj={item}/>
                    )}
                </SortableContext>
            </DndContext>
        </div>

    )
}
