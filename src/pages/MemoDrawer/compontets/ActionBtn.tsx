import type {ReactNode} from 'react';
import styles from '@/pages/MemoDrawer/compontets/actionBtn.module.css'

interface ActionBtnProps {
  /** 触发事件名称 */
  actionName: string
  /** 显示内容 */
  children: ReactNode
  /** 是否显示当前组件 */
  show?: boolean
}

/**
 * 动作按钮
 * @param actionName {string}   触发事件名称
 * @param children {ReactNode}  显示内容
 * @param show {boolean}        是否显示当前组件
 * @author ChenGuangLong
 * @since 2024/5/29 18:42
*/
const ActionBtn = ({actionName, children, show = true}: ActionBtnProps) => show &&
  <div data-action={actionName} className={styles.btn}>{children}</div>

export default ActionBtn;
