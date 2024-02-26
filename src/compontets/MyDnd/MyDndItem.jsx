import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * 配置拖动元素
 * @component
 * @param id                            【必须】必须带id 而且要对应在SortableContext组件的 items属性数组中
 * @param drag {React.ReactNode}        是否单独拖动组件 就是前面拖动组件 后面正常组件 为空就是完全拖动
 * @param {React.ReactNode} children    子组件
 * @param styles {Object}               拖动元素 额外样式
 * @type {{Item: (props: object) => JSX.Element}}
 * */
export default function({ id, drag, children, styles={} }) {
    const {
        attributes,   // 拖动元素属性
        listeners,  // 拖动事件|手柄
        setNodeRef,                   // 拖动元素的ref
        transform,        // 拖动元素的transform
        transition,         // 拖动元素的过渡效果
    } = useSortable({ id });


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...styles
    };

    return drag?
        <div ref={setNodeRef} style={style} {...attributes}>
             <span {...listeners} className={'mouseMove'}>{drag}</span><span className={'pointer'}>{children}</span>
        </div>
    :
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={'mouseMove'}>
            {children}
        </div>
}
