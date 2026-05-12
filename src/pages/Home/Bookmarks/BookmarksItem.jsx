import {useState} from "react";
import {Button} from "antd";

import {dragSort} from "@/request/homeApi";
import MyDnd from "@/components/MyDnd";
import ContextMenu from "@/components/ContextMenu";
import CommonStore from "@/store/CommonStore";
import TryFavicon from "@/components/TryFavicon";
import action from "./action";
import styles from "./bookmark.module.css"

/**
 * 书签组件
 * @param bookmarkItems:书签数组
 * @param setModal:设置表单模态框状态
 * @param groupId:书签分组id
 * @param setGroup:设置书签分组：给新增表单用知道现在的表单是哪个分组 和新增时把列表设置给到父级进行增加
 */
export default ({bookmarkItems, setModal, groupId, setGroup}) => {
  const [items, setItems] = useState(bookmarkItems)

  const {msg} = CommonStore
  const addItemButton = () =>
    <Button type="dashed" block size={'small'} onClick={() => {
      setModal(true, 2)
      setGroup(groupId, setItems)
    }}
    >
      ➕
    </Button>

  /**
   * 拖动后请求排序
   */
  const dragSortReq = async (dragEndList) => {
    const oldList = [...items]
    const sort = dragEndList.map(item => item.id).join('/')
    const result = await dragSort({id: groupId, type: 1, sort})
    if (result) msg.success('排序成功')
    else setItems(oldList)
  }

  /**右键菜单点击后的功能*/
  const lambdaObj = action(setItems, setModal, () => setGroup(groupId, setItems))

  return (items.length > 0 ?
      <MyDnd dndIds={items} setItems={setItems} style={{}} dragEndFunc={dragSortReq}>
        {items.map(item =>
          <MyDnd.Item
            key={item.id}
            id={item.id}
            className={styles.dndItem}
            styles={{display: 'flex', alignItems: 'center'}}
            drag={<TryFavicon iconUrl={item.icon} url={item.url} size={18} errSize={14}/>}
          >
            <ContextMenu tag={item} lambdaObj={lambdaObj}>
              <Button type="link" href={item.url} className={styles.dndContent} target="_blank">
                {item.name}
              </Button>
            </ContextMenu>
          </MyDnd.Item>
        )}
        {bookmarkItems.length < 16 && addItemButton()}
      </MyDnd> : addItemButton()
  )
}
