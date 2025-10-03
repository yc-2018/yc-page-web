import {CSSProperties, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState} from "react";
import {deleteSearchEngine, sortSearchEngine} from "@/request/homeApi";
import {searchData} from "@/store/NoLoginData";
import {App, Avatar, Button, Dropdown, Flex} from "antd";
import {tryGetFavicon, tryGetFavicon1} from "@/utils/urlUtils";
import {QuestionCircleTwoTone} from "@ant-design/icons";
import CommonStore from "@/store/CommonStore";
import {MenuInfo} from "rc-menu/lib/interface";
import ISearchEngines from "@/interface/ISearchEngines";
import {_setDefaultEngine} from "@/utils/localStorageUtils";
import JWTUtils from "@/utils/JWTUtils";
import MyDnd from "@/components/MyDnd";
import styles from './SearchEngines.module.css'

interface ISearchEngineList {
  id?: string,  // 元素ID
  q?: string,   // 搜索关键字
  searchList?: ISearchEngines[],  // 搜索引擎列表
  setSearchList: Dispatch<SetStateAction<ISearchEngines[] | undefined>> // 设置搜索引擎列表
  setEngine: Dispatch<SetStateAction<ISearchEngines>>                   // 设置默认搜索引擎
  openModal: (edit?: ISearchEngines) => void                            // 打开模态框
  changeLowUsage: (search: ISearchEngines) => void                      // 修改搜索引擎的常用性
  extraElement?: ReactNode                                              // 额外元素
  changeLowName?: string                                                // 菜单中的常用名称
  btnStyle?: CSSProperties                                              // 按钮样式
}

const {msg} = CommonStore
const EDIT = '0'
const DELETE = '1'
const SET_SEARCH = '2'
const SORT = '3'
const LOW_USE = '4'

/**
 * 搜索引擎列表
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/8/3 20:16
 */
const SearchEngineList: FC<ISearchEngineList> = (
  {
    id = "搜索引擎列表",
    q,
    setEngine,
    searchList,
    setSearchList,
    openModal,
    extraElement,
    changeLowUsage,
    changeLowName = '设为不常用',
    btnStyle = {},
  }) => {
  const [searchItems, setSearchItems] = useState(searchList ?? searchData)
  const [isDrag, setIsDrag] = useState(false)
  const {modal} = App.useApp();      // 获取在App组件的上下文的modal

  const items = [
    {label: '设为主搜索', key: SET_SEARCH},
    {label: changeLowName, key: LOW_USE, disabled: JWTUtils.isExpired()},
    {label: '编 辑', key: EDIT, disabled: JWTUtils.isExpired()},
    {label: '删 除', key: DELETE, disabled: JWTUtils.isExpired()},
    {label: '排 序', key: SORT, disabled: JWTUtils.isExpired()},
  ];

  /** 父组件数据改变的话，子组件数据也设置改变 */
  useEffect(() => {
    searchList && setSearchItems(searchList)
  }, [searchList])

  /**
   * 触发搜索
   *
   * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
   * @since 2025/8/4 0:47
   */
  const onSearch = (engineUrl: string) => {
    if (!q) return msg.warning('请输入搜索内容')
    window.open(engineUrl.replace('@@@', q ?? ''), '_blank');
  }

  /** 取消拖拽 */
  const cancelDrag = () => {
    setIsDrag(false)
    setSearchList(v => v ? [...v] : undefined)
  }

  /** 确认排序 */
  const confirmSort = () => {
    const son = searchItems.map(v => v.id).join('/');
    const main = searchList?.map(v => v.id).join('/');

    if (son === main) {
      msg.warning('没变...')
      setIsDrag(false)
    }

    const lowUsage = !!searchItems[0].lowUsage;
    CommonStore.setLoading(true, '正在排序...')
    sortSearchEngine(son, lowUsage).then(res => {
      if (res.success) {
        setSearchList([...searchItems])
        msg.success('排序成功')
        setIsDrag(false)
      } else msg.error(res.msg)
    }).finally(() => CommonStore.setLoading(false))
  }

  /** 右键菜单逻辑 */
  const menuOnClick = (e: MenuInfo, searchItem: ISearchEngines) => {
    if (e.key === EDIT) {
      openModal(searchItem)
    }
    if (e.key === LOW_USE) {
      changeLowUsage(searchItem)
    }
    if (e.key === DELETE) {
      modal.confirm({
        title: `确定删除 ${searchItem.name} 吗?`,
        content: '删除了就不能撤回了哟...',
        maskClosable: true,
        async onOk() {
          const result = await deleteSearchEngine(searchItem.id);
          if (result.success) {
            setSearchList(items => items?.filter(item => item.id !== searchItem.id))
            msg.success('删除成功');
          }
        }
      })
    }
    if (e.key === SET_SEARCH) {
      setEngine(searchItem)
      _setDefaultEngine(searchItem)
      msg.info('已设置默认搜索引擎为：' + searchItem.name!)
    }
    if (e.key === SORT) {
      setIsDrag(true)
    }
  }

  /**
   * 是否拖拽组件
   *
   * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
   * @since 2025/8/11 2:54
   */
  const IsMyDnd = ({children}: { children: ReactNode }) => isDrag ?
    <MyDnd
      dndIds={searchItems}
      setItems={setSearchItems}
      dragEndFunc={setSearchItems}
      style={{display: "flex", flexWrap: "wrap", gap: 5, zIndex: 9999}}
    >
      {children}
    </MyDnd>
    :
    <>{children}</>

  /**
   * 是否拖拽子组件
   *
   * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
   * @since 2025/8/11 2:53
   */
  const IsMyDndItem = ({children, searchItem}: { children: ReactNode, searchItem: ISearchEngines }) => isDrag ?
    <MyDnd.Item id={searchItem.id} key={searchItem.id}>
      {children}
    </MyDnd.Item>
    :
    <Dropdown
      key={searchItem.id}
      menu={{items, onClick: (e) => menuOnClick(e, searchItem)}}
      trigger={['contextMenu']}
    >
      {children}
    </Dropdown>

  return (
    <div id={id}>

      {isDrag &&  // 拖拽中 遮罩和功能键
        <div className={styles.isDragBottom}>
          <div className={styles.cancelDragAndDrop}>
            <Button size="large" onClick={cancelDrag}>取消拖拽</Button>
            <Button size="large" onClick={confirmSort}>确认排序</Button>
          </div>
        </div>
      }

      <Flex gap="small" wrap="wrap" justify='center' style={{margin: "5px 80px"}}>
        <IsMyDnd>
          {searchItems.map(searchItem =>
            <IsMyDndItem searchItem={searchItem} key={searchItem.id}>
              <Button
                key={searchItem.id}
                onClick={() => onSearch(searchItem.engineUrl)}
                style={{cursor: isDrag ? "move" : "pointer", ...btnStyle}}
                icon={
                  <Avatar
                    size={20}
                    icon={
                      <Avatar
                        size={20}
                        shape="square"  // 方形
                        src={tryGetFavicon1(searchItem.engineUrl)}
                        icon={<QuestionCircleTwoTone style={{color: '#888', fontSize: 16}}/>}
                        style={{backgroundColor: 'unset'}}
                      />}
                    shape="square"
                    style={{backgroundColor: 'unset'}}
                    src={searchItem.iconUrl || tryGetFavicon(searchItem.engineUrl)}
                  />
                }
              >
                {searchItem.name}
              </Button>
            </IsMyDndItem>
          )}
        </IsMyDnd>
        {extraElement}
      </Flex>
    </div>
  )
}

export default SearchEngineList
