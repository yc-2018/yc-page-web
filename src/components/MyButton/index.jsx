import styles from './myButton.module.css'
const MyButton = ({ children , onClick}) =><button className={styles.btn} onClick={onClick}>{ children }</button>
export default MyButton