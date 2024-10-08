import styles from './LoaderWhite.module.css'

/** 自定义 加载动画 白色圈圈*/
export default ({loadName = '正在玩命加载中...'}) => {
  return (
    <div className={styles.loader}>
      <div className={styles.item1}/>
      <div className={styles.item2}/>
      <div className={styles.item3}/>
      <div className={styles.text}>{loadName}</div>
    </div>
  )
}
