import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ obj }) {
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
        padding: '2px 10px',
    };

    return (

        <div ref={setNodeRef} style={style} {...attributes}>
             <span {...listeners} className={'mouseMove'}>☰</span> <span className={'pointer'}>{obj.name}</span>
        </div>


    );
}
