import type {ReactNode} from 'react';
import type IMemo from '@/interface/IMemo';
import type ILoopMemoItem from '@/interface/ILoopMemoItem';
import type ILoopMemoItemComment from '@/interface/ILoopMemoItemComment';

/** 桌面端备忘列表项，包含列表骨架屏临时 loading 字段 */
export interface MemoDrawerListItem extends IMemo {
  loading?: boolean
}

/** 备忘完成状态筛选值 */
export type MemoCompletedFilter = -1 | 0 | 1;

/** 备忘类型未完成数量映射 */
export type MemoCountMap = Record<string, number>;

/** 循环备忘子项加载函数 */
export type LoadLoopMemoItems = (memoId: number, page?: number, replace?: boolean) => Promise<MemoLoopItem[]>;

/** 循环备忘子项修改函数 */
export type UpdateLoopMemoItemHandler = (loopMemo: MemoLoopItem) => void;

/** 循环备忘子项删除函数 */
export type DeleteLoopMemoItemHandler = (memoId: number, id: number) => void;

/** 循环备忘二层抽屉渲染函数 */
export type RenderLoopMemoDrawer = (memo?: MemoDrawerListItem) => ReactNode;

/** 循环备忘子项数据 */
export type MemoLoopItem = ILoopMemoItem;

/** 循环备忘记录评论数据 */
export type MemoLoopItemComment = ILoopMemoItemComment;
