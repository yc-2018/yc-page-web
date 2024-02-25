import styles from './LoaderWhite.module.css'
/** 自定义 加载动画 白色圈圈*/
export default () => {
    return (
        <div className={styles.loader}>
            <div className={styles.item1}>12</div>
            <div className={styles.item2}>34</div>
            <div className={styles.item3}></div>
        </div>
    )
}
