import type {ReactNode} from 'react';
import styles from '@/pages/MemoDrawer/compontets/actionBtn.module.css'

interface ActionBtnProps {
  /** 触发事件名称 */
  actionName: string
  /** 显示内容 */
  children?: ReactNode
  /** 是否显示当前组件 */
  show?: boolean
  /** 图标按钮的悬浮说明 */
  title?: string
  /** 单击即可触发的动作标记 */
  actionTrigger?: 'click' | 'dblclick'
  /** 是否使用图标按钮样式 */
  iconOnly?: boolean
  /** 是否使用危险操作样式 */
  danger?: boolean
}

/**
 * 动作按钮
 * @param actionName {string}   触发事件名称
 * @param children {ReactNode}  显示内容
 * @param show {boolean}        是否显示当前组件
 * @param title {string}        图标按钮的悬浮说明
 * @param actionTrigger {'click' | 'dblclick'} 动作触发方式
 * @param iconOnly {boolean}    是否使用图标按钮样式
 * @param danger {boolean}      是否使用危险操作样式
 * @author ChenGuangLong
 * @since 2024/5/29 18:42
*/
const ActionBtn = ({
  actionName,
  children,
  show = true,
  title,
  actionTrigger,
  iconOnly = false,
  danger = false
}: ActionBtnProps) => {
  if (!show) return null

  const className = [
    styles.btn,
    iconOnly ? styles.iconBtn : '',
    danger ? styles.dangerBtn : ''
  ].filter(Boolean).join(' '); // 当前按钮样式集合

  return (
    <div
      data-action={actionName}
      data-action-trigger={actionTrigger}
      className={className}
      title={title}
      aria-label={title}
    >
      {children}
    </div>
  )
}

export default ActionBtn;
