import {useState} from "react";
import {Button} from "antd";

import styles from "./bookmark.module.css"
import MyDnd from "../../../compontets/MyDnd";

/**
 *   书签组件
 *   @param bookmarkItems:书签数组
 *   @param setModal:设置表单模态框状态
 *   @param groupId:书签分组id
 *   @param setGroup:设置书签分组：给新增表单用知道现在的表单是哪个分组 和新增时把列表设置给到父级进行增加
 */
export default ({bookmarkItems,setModal,groupId,setGroup}) => {
    const [items, setItems] = useState(bookmarkItems)
    const addItemButton = () =>
        <Button type="dashed" block size={'small'} onClick={() => {
            setModal(true, 2)
            setGroup(groupId,setItems)
        }}>
            ➕
        </Button>

    return (items.length > 0 ?
        <MyDnd dndIds={items} setItems={setItems} style={{}}>
            {items.map(item =>
                <MyDnd.Item key={item.id} id={item.id} drag={"🔖"} className={styles.dndItem}>
                    <Button type="link" href={item.url} className={styles.dndContent} target="_blank">
                        {item.name}
                    </Button>
                </MyDnd.Item>
            )}
            {bookmarkItems.length < 16 && addItemButton()}
        </MyDnd>:addItemButton()
    )
}