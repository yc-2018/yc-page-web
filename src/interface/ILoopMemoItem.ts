import ILoopMemoItemComment from '@/interface/ILoopMemoItemComment';

/**
 * 循环备忘记录项
 *
 * @author 𝒸𝒽𝑒𝓃𝒢𝓊𝒶𝓃𝑔ℒ𝑜𝓃𝑔
 * @since 2023-12-20
 */
export default interface ILoopMemoItem {
  id?: number
  version?: number
  /** 所属备忘录版本号，仅写操作使用 */
  memoVersion?: number
  memoId?: number
  memoDate?: string
  createTime?: string
  updateTime?: string
  loopText?: string
  imgArr?: string
  comments?: ILoopMemoItemComment[]
  commentTotal?: number
  commentHasMore?: boolean
}
