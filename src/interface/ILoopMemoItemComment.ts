/**
 * 循环备忘记录评论项
 *
 * @author codex
 * @since 2026-05-19
 */
export default interface ILoopMemoItemComment {
  id?: number
  version?: number
  memoId?: number
  loopItemId?: number
  commentDate?: string
  commentText?: string
  imgArr?: string
  createTime?: string
  updateTime?: string
}
