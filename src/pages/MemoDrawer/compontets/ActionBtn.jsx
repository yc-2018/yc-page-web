import React from 'react';
import styles from './actionBtn.module.css'


/**
 * 动作按钮
 * @param actionName {string}   触发事件名称
 * @param children {ReactNode}  显示内容
 * @param show {boolean}        是否显示当前组件
 * @author ChenGuangLong
 * @since 2024/5/29 18:42
*/
const ActionBtn = ({actionName, children, show = true}) => show &&
  <span data-action={actionName} className={styles.btn}>{children}</span>

export default ActionBtn;