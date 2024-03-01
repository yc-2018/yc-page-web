import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import MyDndItem from "./MyDndItem";

/**
 * @component
 * @param {Array} dndIds                         【必须】对象可拖动对象的ID数组  数组里面是 整个对象也行 但是这个对象必须包涵id属性
 * @param {Function} setItems                   【必须】设置items的函数
 * @param {String} storageName                  存储在localStorage中的名字  如果是空的就不存储
 * @param {Object} style                        最外层样式（有默认值）
 * @param {Function|undefined} dragEndFunc      拖拽结束时触发的额外回调函数 而且会把拖动后的数组传进去
 * @param {React.ReactNode|unknown[]} children  子组件
 * @property {React.Component} MyDnd.Item       可用自带子组件
 * */
const MyDnd = ({dndIds,setItems ,storageName,style,children,dragEndFunc }) => {

    // 使用自定义Hook来获取鼠标传感器数据
    const sensors = [useSensor(PointerSensor)]

    /**
     * 当拖拽结束时触发的回调函数
     * */
    const handleDragEnd = event => {
        const { active, over } = event

        if (active.id !== over.id) {
            setItems( items => {
                // 找到拖拽项目（active.id）的索引
                const oldIndex = items.findIndex(item => item.id === active.id)
                // 找到目标位置项目（over.id）的索引
                const newIndex = items.findIndex(item => item.id === over.id)
                const data = arrayMove(items, oldIndex, newIndex);
                console.log('███████newIndex>>>>', data,'<<<<██████')
                // 要的话 把新数组的id 放到localStorage中
                storageName && localStorage.setItem(storageName+'_idList', JSON.stringify(data.map(item=>item.id)))
                dragEndFunc && dragEndFunc(data)    // 如果有传 就回调
                return data
            });
        }
    };

    return (
        <div style={style || {
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
                <SortableContext items={dndIds?.[0].id? dndIds.map(item => item.id) :dndIds} /*strategy={verticalListSortingStrategy}*/ >
                    {children}
                </SortableContext>
            </DndContext>
        </div>
    );
}

/**
 * @type {{Item: (props: object) => JSX.Element}}
 */
MyDnd.Item = MyDndItem

export default MyDnd