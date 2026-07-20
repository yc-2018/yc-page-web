import {CSSProperties, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState} from 'react';
import {deleteSearchEngine, sortSearchEngine} from '@/request/homeApi';
import {searchData} from '@/store/NoLoginData';
import {App, Button, Dropdown, Flex} from 'antd';
import CommonStore from '@/store/CommonStore';
import ISearchEngines from '@/interface/ISearchEngines';
import type {MenuClickInfo} from '@/interface/IAntd';
import {_setDefaultEngine} from '@/utils/localStorageUtils';
import TryFavicon from '@/components/TryFavicon';
import JWTUtils from '@/utils/JWTUtils';
import MyDnd from '@/components/MyDnd';
import {openDirectUrl, openSearchEngine} from '@/pages/Home/HomeSearch/searchAction';
import styles from './SearchEngines.module.css'

interface ISearchEngineList {
  id?: string,  // 元素ID
  searchList?: ISearchEngines[],  // 搜索引擎列表
  setSearchList: Dispatch<SetStateAction<ISearchEngines[] | undefined>> // 设置搜索引擎列表
  setEngine: Dispatch<SetStateAction<ISearchEngines>>                   // 设置默认搜索引擎
  openModal: (edit?: ISearchEngines) => void                            // 打开模态框
  changeLowUsage: (search: ISearchEngines) => void                      // 修改搜索引擎的常用性
  refreshSearchData: () => Promise<void>                                // 刷新搜索列表和排序版本
  extraElement?: ReactNode                                              // 额外元素
  changeLowName?: string                                                // 菜单中的常用名称
  btnStyle?: CSSProperties                                              // 按钮样式
}

interface IIsMyDnd {
  children: ReactNode,
  isDrag: boolean,
  searchItems: ISearchEngines[],
  setSearchItems: Dispatch<SetStateAction<ISearchEngines[]>>
}

interface IIsMyDndItem {
  children: ReactNode,
  searchItem: ISearchEngines,
  items: {label: string, key: string, disabled?: boolean}[],
  isDrag: boolean,
  menuOnClick: (e: MenuClickInfo, searchItem: ISearchEngines) => void
}

const {msg} = CommonStore
const EDIT = '0'
const DELETE = '1'
const SET_SEARCH = '2'
const SORT = '3'
const LOW_USE = '4'
const DIRECT_OPEN = '5'

/**
 * 搜索引擎列表
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/8/3 20:16
 */
const SearchEngineList: FC<ISearchEngineList> = (
  {
    id = '搜索引擎列表',
    setEngine,
    searchList,
    setSearchList,
    openModal,
    extraElement,
    changeLowUsage,
    refreshSearchData,
    changeLowName = '设为不常用',
    btnStyle = {},
  }) => {
  const [searchItems, setSearchItems] = useState(searchList ?? searchData)
  const [isDrag, setIsDrag] = useState(false)
  const {modal} = App.useApp();      // 获取在App组件的上下文的modal

  /** 生成右键菜单，有直达URL时才显示直接访问 */
  const getMenuItems = (searchItem: ISearchEngines) => [
    ...(searchItem.directUrl?.trim() ? [{
      label: '直接访问',
      key: DIRECT_OPEN
    }] : []),
    {label: '设为主搜索', key: SET_SEARCH},
    {label: changeLowName, key: LOW_USE, disabled: JWTUtils.isExpired()},
    {label: '编 辑', key: EDIT, disabled: JWTUtils.isExpired()},
    {label: '排 序', key: SORT, disabled: JWTUtils.isExpired()},
    {label: '删 除', key: DELETE, disabled: JWTUtils.isExpired()},
  ];

  /** 父组件数据改变的话，子组件数据也设置改变 */
  useEffect(() => {
    if (searchList) setSearchItems(searchList)
  }, [searchList])

  /** 取消拖拽 */
  const cancelDrag = () => {
    setIsDrag(false)
    setSearchList(v => [...v!])
  }

  /** 确认排序 */
  const confirmSort = () => {
    const son = searchItems.map(v => v.id).join('/');
    const main = searchList?.map(v => v.id).join('/');

    if (son === main) {
      setIsDrag(false)
      return msg.warning('没变...')
    }

    CommonStore.setLoading(true, '正在排序...')
    const sortVersion = searchItems[0]?.sortVersion; // 拖拽开始时读取的排序版本
    if (sortVersion === undefined) {
      CommonStore.setLoading(false)
      return msg.error('排序版本缺失，请刷新后重试')
    }
    sortSearchEngine(son, searchItems[0].type, sortVersion).then(async res => {
      if (res.success) {
        await refreshSearchData()
        msg.success('排序成功')
        setIsDrag(false)
      } else {
        await refreshSearchData()
        setIsDrag(false)
        msg.error(res.msg)
      }
    }).finally(() => CommonStore.setLoading(false))
  }

  /** 右键菜单逻辑 */
  const menuOnClick = (e: MenuClickInfo, searchItem: ISearchEngines) => {
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
        mask: {closable: true},
        async onOk() {
          if (searchItem.version === undefined || searchItem.sortVersion === undefined) {
            return msg.error('数据版本缺失，请刷新后重试')
          }
          const result = await deleteSearchEngine(searchItem.id, searchItem.version, searchItem.sortVersion);
          if (result.success) {
            await refreshSearchData()
            msg.success('删除成功');
          } else await refreshSearchData()
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
    if (e.key === DIRECT_OPEN) {
      openDirectUrl(searchItem)
    }
  }

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

      <Flex gap="small" wrap="wrap" justify="center" style={{margin: '5px 80px'}}>
        <IsMyDnd isDrag={isDrag} searchItems={searchItems} setSearchItems={setSearchItems}>
          {searchItems.map(searchItem =>
            <IsMyDndItem
              items={getMenuItems(searchItem)}
              isDrag={isDrag}
              key={searchItem.id}
              searchItem={searchItem}
              menuOnClick={menuOnClick}
            >
              <Button
                key={searchItem.id}
                onClick={() => openSearchEngine(searchItem)}
                style={{cursor: isDrag ? 'move' : 'pointer', ...btnStyle}}
                icon={<TryFavicon iconUrl={searchItem.iconUrl} url={searchItem.engineUrl} size={20} errSize={16}/>}
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

// —————————————————————————— 组件 ———————————————————————————— 之前每次组件刷新都会抖动，原来是因为放在了组件的内部，难怪会出现这种情况，所以要放在组件的外面，这样就不会抖动了

/**
 * 是否拖拽组件
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/8/11 2:54
 */
const IsMyDnd = ({children, isDrag, searchItems, setSearchItems}: IIsMyDnd) => isDrag ?
  <MyDnd
    dndIds={searchItems}
    setItems={setSearchItems}
    dragEndFunc={setSearchItems}
    style={{display: 'flex', flexWrap: 'wrap', gap: 5, zIndex: 9999}}
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
const IsMyDndItem = ({children, searchItem, items, isDrag, menuOnClick}: IIsMyDndItem) => isDrag ?
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
