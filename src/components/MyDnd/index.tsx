import {CSSProperties, Dispatch, FC, ReactElement, ReactNode, SetStateAction} from 'react';
import {DndContext, closestCenter, PointerSensor, useSensor} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  type SortingStrategy
} from '@dnd-kit/sortable';
import MyDndItem, {IMyDndItem} from './MyDndItem';
import {DragEndEvent} from '@dnd-kit/core/dist/types';

// 定义接口
interface IBaseEntity {
  id: number | string; // 必须属性
}

type DndId = IBaseEntity['id'];
type DndItem = IBaseEntity | DndId;

interface MyDndProps<T extends DndItem> {
  dndIds: T[];                                        // 【必须】对象可拖动对象的ID数组  数组里面是 整个对象也行 但是这个对象必须包涵id属性
  setItems: Dispatch<SetStateAction<T[]>>;            // 【必须】设置items的函数 对象里面必须包含 id 属性***变不了的不知道为什么，但dragEndFunc可以
  storageName?: string;                               // 存储在localStorage中的名字  如果是空的就不存储
  style?: CSSProperties;                              // 最外层样式（有默认值）
  dragEndFunc?: (data: T[]) => void;                  // 拖拽结束时触发的额外回调函数 而且会把拖动后的数组传进去
  children: ReactNode;                                // 子组件
  strategy?: SortingStrategy;                         // 拖拽排序策略
}

interface ComComponent {
  <T extends DndItem>(props: MyDndProps<T>): ReactElement;
  Item: FC<IMyDndItem>;                                      // 可用自带子组件
}

const getDndId = (item: DndItem): DndId => typeof item === 'object' ? item.id : item;

const noScaleRectSortingStrategy: SortingStrategy = (args) => {
  const transform = rectSortingStrategy(args);

  return transform
    ? {
      ...transform,
      scaleX: 1,
      scaleY: 1,
    }
    : null;
};

const getLayoutGap = (rects: NonNullable<Parameters<SortingStrategy>[0]['rects']>) => {
  let horizontalGap = 0;
  let verticalGap = 0;

  rects.forEach((rect, index) => {
    const nextRect = rects[index + 1];

    if (!nextRect) return;

    const sameRow = Math.abs(rect.top - nextRect.top) < Math.min(rect.height, nextRect.height) / 2;

    if (sameRow) {
      const gap = nextRect.left - (rect.left + rect.width);
      if (gap > 0) horizontalGap = horizontalGap ? Math.min(horizontalGap, gap) : gap;
    } else {
      const gap = nextRect.top - (rect.top + rect.height);
      if (gap > 0) verticalGap = verticalGap ? Math.min(verticalGap, gap) : gap;
    }
  });

  return {horizontalGap, verticalGap};
};

const flowSortingStrategy: SortingStrategy = (args) => {
  const {activeIndex, activeNodeRect, index, overIndex, rects} = args;

  if (activeIndex === overIndex) {
    return {x: 0, y: 0, scaleX: 1, scaleY: 1};
  }

  const layoutRects = rects.map((rect, rectIndex) =>
    rect ?? (rectIndex === activeIndex ? activeNodeRect : null)
  );

  if (layoutRects.some(rect => !rect)) {
    return noScaleRectSortingStrategy(args);
  }

  const measuredRects = layoutRects as Exclude<(typeof layoutRects)[number], null>[];
  const currentRect = measuredRects[index];
  const orderedIndexes = arrayMove(measuredRects.map((_, rectIndex) => rectIndex), activeIndex, overIndex);
  const left = Math.min(...measuredRects.map(rect => rect.left));
  const right = Math.max(...measuredRects.map(rect => rect.left + rect.width));
  const top = Math.min(...measuredRects.map(rect => rect.top));
  const {horizontalGap, verticalGap} = getLayoutGap(measuredRects);
  const targets = new Map<number, {left: number; top: number}>();
  let cursorLeft = left;
  let cursorTop = top;
  let rowHeight = 0;

  orderedIndexes.forEach(rectIndex => {
    const rect = measuredRects[rectIndex];

    if (cursorLeft > left && cursorLeft + rect.width > right) {
      cursorLeft = left;
      cursorTop += rowHeight + verticalGap;
      rowHeight = 0;
    }

    targets.set(rectIndex, {left: cursorLeft, top: cursorTop});
    cursorLeft += rect.width + horizontalGap;
    rowHeight = Math.max(rowHeight, rect.height);
  });

  const target = targets.get(index);

  return target
    ? {
      x: target.left - currentRect.left,
      y: target.top - currentRect.top,
      scaleX: 1,
      scaleY: 1,
    }
    : null;
};

/**
 * 拖拽区域组件
 */
const MyDnd = (<T extends DndItem>(
  {
    dndIds,
    setItems,
    storageName,
    style,
    children,
    dragEndFunc,
    strategy = flowSortingStrategy
  }: MyDndProps<T>) => {

  // 使用自定义Hook来获取鼠标传感器数据
  const sensors = [useSensor(PointerSensor)]

  /**
   * 当拖拽结束时触发的回调函数
   * */
  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event

    if (active.id !== over?.id) {
      setItems(items => {
        // 找到拖拽项目（active.id）的索引
        const oldIndex = items.findIndex(item => getDndId(item) === active.id)
        // 找到目标位置项目（over.id）的索引
        const newIndex = items.findIndex(item => getDndId(item) === over?.id)
        const data = arrayMove(items, oldIndex, newIndex);
        // 要的话 把新数组的id 放到localStorage中
        if (storageName) {
          localStorage.setItem(storageName + '_idList', JSON.stringify(data.map(item => getDndId(item))))
        }

        if (dragEndFunc) {
          dragEndFunc(data)    // 如果有传 就回调
        }

        return data
      });
    }
  };

  return (
    <div style={style || {
      display: 'flex',
      flexWrap: 'wrap',        // 启用换行
      flexDirection: 'row',   // 子元素默认会在一行内排列，不会换行
      gap: '0' /* 根据需要调整间距 */
    }}>
      {/**
       * sensors:  传感器是用于处理拖拽输入的设备，例如鼠标、触摸屏或键盘。sensors 属性允许你定义用于拖拽操作的传感器数组。
       * collisionDetection: 碰撞检测是确定拖拽项目在移动过程中与哪些项目发生交互的算法。
       * onDragEnd: 当拖拽结束时触发的回调函数。
       * ——————————
       * items: 这个属性接受一个项目标识符的数组，定义了哪些项目是可排序的。这些标识符通常是字符串或数字，用于唯一标识每个可拖拽项目。
       * strategy: 排序策略定义了项目排序的逻辑。verticalListSortingStrategy 是 @dnd-kit/sortable 提供的一个策略，用于垂直列表的排序。这个策略决定了项目如何根据拖拽操作重新排序。
       * */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={dndIds.map(item => getDndId(item))}
          strategy={strategy}
        >
          {children}
        </SortableContext>
      </DndContext>
    </div>
  );
}) as ComComponent


MyDnd.Item = MyDndItem

export default MyDnd
