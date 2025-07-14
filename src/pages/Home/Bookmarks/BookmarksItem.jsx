import {useState} from "react";
import {Button, Image} from "antd";

import {dragSort} from "@/request/homeRequest";
import MyDnd from "@/compontets/MyDnd";
import ContextMenu from "@/compontets/ContextMenu";
import {getBaseUrl, tryGetFavicon1} from "@/utils/urlUtils";
import CommonStore from "@/store/CommonStore";
import action from "./action.jsx";
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
  
  /**
   * 获取书签图标
   * @param URLs 正则匹配后的URLs是个列表  [0]:带http..  [1]:不带http..
   */
  const getLogo = URLs =>
    <Image
      width={18}
      height={18}
      preview={false}
      src={URLs[0] + '/favicon.ico'}
      fallback={tryGetFavicon1(URLs[1])}
    />
  
  
  /**右键菜单点击后的功能*/
  const lambdaObj = action(setItems, setModal, () => setGroup(groupId, setItems))
  
  return (items.length > 0 ?
      <MyDnd dndIds={items} setItems={setItems} style={{}} dragEndFunc={dragSortReq}>
        {items.map(item =>
          <MyDnd.Item key={item.id} id={item.id} drag={getLogo(getBaseUrl(item.url))} className={styles.dndItem}>
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