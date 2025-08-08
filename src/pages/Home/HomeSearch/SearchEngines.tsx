import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {deleteSearchEngine} from "@/request/homeApi";
import {searchData} from "@/store/NoLoginData";
import {App, Avatar, Button, Dropdown, Flex} from "antd";
import {tryGetFavicon, tryGetFavicon1} from "@/utils/urlUtils";
import {QuestionCircleTwoTone} from "@ant-design/icons";
import CommonStore from "@/store/CommonStore";
import {MenuInfo} from "rc-menu/lib/interface";
import ISearchEngines from "@/interface/ISearchEngines";
import {_setDefaultEngine} from "@/utils/localStorageUtils";
import JWTUtils from "@/utils/JWTUtils";

interface ISearchEngineList {
  q?: string,   // 搜索关键字
  searchList?: ISearchEngines[],  // 搜索引擎列表
  setSearchList: Dispatch<SetStateAction<ISearchEngines[] | undefined>> // 设置搜索引擎列表
  setEngine: Dispatch<SetStateAction<ISearchEngines>>   // 设置默认搜索引擎
  openModal: (edit?: ISearchEngines) => void      // 打开模态框
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
    {q,
      setEngine,
      searchList,
      setSearchList,
      openModal,}) => {
  const [searchItems, setSearchItems] = useState(searchData)
  const {modal} = App.useApp();      // 获取在App组件的上下文的modal

  const items = [
    {label: '设为主搜索', key: SET_SEARCH},
    {label: '设为不常用', key: LOW_USE, disabled: JWTUtils.isExpired()},
    {label: '编 辑', key: EDIT, disabled: JWTUtils.isExpired()},  // todo
    {label: '删 除', key: DELETE, disabled: JWTUtils.isExpired()},
    {label: '排 序', key: SORT, disabled: JWTUtils.isExpired()},
  ];

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

  const menuOnClick = (e: MenuInfo, searchItem:ISearchEngines) => {
    if (e.key === EDIT) {
      openModal(searchItem)
    }
    if (e.key === DELETE) {
      modal.confirm({
        title: `确定删除 ${searchItem.name} 吗?`,
        content: '删除了就不能撤回了哟...',
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
      msg.info('正在排序搜索引擎')
    }
  }

  return (
    <div id="搜索引擎列表">
      <Flex style={{margin: "5px 80px"}} wrap="wrap" gap="small" justify='center'>
        {searchItems.map(searchItem =>
          <Dropdown
            key={searchItem.id}
            menu={{items, onClick: (e) => menuOnClick(e, searchItem)}}
            trigger={['contextMenu']}
          >
            <Button
              onClick={() => onSearch(searchItem.engineUrl)}
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
          </Dropdown>
        )}
        {
          /*登录后显示添加快速搜索按钮*/
          // UserStore.jwt &&
          // <Button icon={<PlusOutlined/>} className={"addButton"} onClick={() => addSearch(1)}/>
        }
      </Flex>
    </div>
  )
}

export default SearchEngineList
