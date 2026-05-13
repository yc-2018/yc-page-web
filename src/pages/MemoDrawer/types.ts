import type {ReactNode} from 'react';
import type IMemo from '@/interface/IMemo';
import type ILoopMemoItem from '@/interface/ILoopMemoItem';

/** 桌面端备忘列表项，包含列表骨架屏临时 loading 字段 */
export interface MemoDrawerListItem extends IMemo {
  loading?: boolean
}

/** 备忘完成状态筛选值 */
export type MemoCompletedFilter = -1 | 0 | 1;

/** 备忘类型未完成数量映射 */
export type MemoCountMap = Record<string, number>;

/** 循环备忘子项加载函数 */
export type LoadLoopMemoItems = (memoId: number) => Promise<void>;

/** 循环备忘子项修改函数 */
export type UpdateLoopMemoItemHandler = (
  memoId: number,
  id: number,
  loopText?: string,
  imgArr?: string,
) => void;

/** 循环备忘子项删除函数 */
export type DeleteLoopMemoItemHandler = (memoId: number, id: number) => void;

/** 循环备忘下拉渲染函数 */
export type RenderLoopMemoDropdown = (memoId?: number) => ReactNode;

/** 循环备忘子项数据 */
export type MemoLoopItem = ILoopMemoItem;
