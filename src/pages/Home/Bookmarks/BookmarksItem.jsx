import {useState} from "react";
import MyDnd from "../../../compontets/MyDnd";
import {Button} from "antd";

export default ({bookmarkItems}) => {
    const [items, setItems] = useState(bookmarkItems)

    return (
        <MyDnd dndIds={items} setItems={setItems} style={{}}>
            {items.map(item =>
                <MyDnd.Item key={item.id} id={item.id} drag={"█"}>
                    <Button type="link" href={'https://www.baidu.com'} style={{padding:'0 2px'}} target="_blank">
                        {item.name}
                    </Button>
                </MyDnd.Item>
            )}
            <Button type="dashed" block size={'small'}>
                ➕
            </Button>
        </MyDnd>
    )
}