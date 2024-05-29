import React from 'react';
import styles from './actionBtn.module.css'

const ActionBtn = ({actionName, children, show=true}) => show ?
  <span data-action={actionName} className={styles.btn}>{children}</span>
  :
  <></>


export default ActionBtn;