import {useState} from "react";
import {Button} from "antd";

import styles from "./bookmark.module.css"
import MyDnd from "../../../compontets/MyDnd";

export default ({bookmarkItems}) => {
    const [items, setItems] = useState(bookmarkItems)
    const addItemButton = () => <Button type="dashed" block size={'small'}>➕</Button>

    return (items.length > 0 ?
        <MyDnd dndIds={items} setItems={setItems} style={{}}>
            {items.map(item =>
                <MyDnd.Item key={item.id} id={item.id} drag={"█"} className={styles.dndItem}>
                    <Button type="link" href={'https://www.baidu.com'} className={styles.dndContent} target="_blank">
                        {item.name}
                    </Button>
                </MyDnd.Item>
            )}
            {bookmarkItems.length < 16 && addItemButton()}
        </MyDnd>:addItemButton()
    )
}