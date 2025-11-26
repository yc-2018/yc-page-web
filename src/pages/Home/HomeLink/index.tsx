import {ReactNode, useEffect, useRef, useState} from "react";
import {
  addSearchEngines, deleteSearchEngine,
  getSearchEngines, sortSearchEngine,
  updateSearchEngines
} from "@/request/homeApi";
import {App, Button, Dropdown, Form, Input, Modal} from "antd";
import {MenuInfo} from "rc-menu/lib/interface";
import {_getHomeLinks, _setHomeLinks} from "@/utils/localStorageUtils";
import ISearchEngines, {HOME_LINK} from "@/interface/ISearchEngines";
import JWTUtils from "@/utils/JWTUtils";
import UserStore from "@/store/UserStore";
import CommonStore from "@/store/CommonStore";
import {PlusOutlined} from "@ant-design/icons";
import MyDnd from "@/components/MyDnd";
import TryFavicon from "@/components/TryFavicon";
import s from './index.module.css'
import searchStyles from "@/pages/Home/HomeSearch/SearchEngines.module.css";

interface IEditOrAdd {
  open: boolean;
  edit?: ISearchEngines;
}

interface IIsMyDndItem {
  children: ReactNode,
  linkItem: ISearchEngines
}

const {msg} = CommonStore
const EDIT = '0'
const DELETE = '1'
const SORT = '2'

const menuItems = [
  {label: '编 辑', key: EDIT},
  {label: '删 除', key: DELETE},
  {label: '排 序', key: SORT},
];

const openUrl = (url: string) => window.open(url, '_blank');


/**
 * 首页搜索框组件
 *
 * @author Yc
 * @since 2025/11/8
 */
const LinkBox = () => {
  const [linkList, setLinkList] = useState<ISearchEngines[]>(_getHomeLinks())
  const [editOrAddData, setEditOrAddData] = useState<IEditOrAdd>({open: false})
  const [modalLoading, setModalLoading] = useState(false)
  const [isDrag, setIsDrag] = useState(false)

  const [form] = Form.useForm(); // 创建一个表单域
  const {modal} = App.useApp();      // 获取在App组件的上下文的modal
  const linkListBak = useRef<ISearchEngines[]>();

  useEffect(() => {
    // 获取搜索引擎列表
    if (!JWTUtils.isExpired()) {
      getSearchEngines(HOME_LINK).then(response => {
        if (response.success) setLinkList(response.data ?? [])
      });
    }
  }, [UserStore.jwt])

  /** 索引列表变化就记录 */
  useEffect(() => {
    !JWTUtils.isExpired() && linkList?.length && _setHomeLinks(linkList)
  }, [linkList])


  /** 打开编辑或新增弹窗 */
  const openModal = (edit?: ISearchEngines) => {
    setEditOrAddData({open: true, edit})
    form.resetFields()
    form.setFieldsValue(edit)
  }

  /** 新增或编辑弹窗的确定处理 */
  const modalOnOk = () => {
    form.validateFields().then((values: ISearchEngines) => {
      const editSearch = editOrAddData.edit;
      if (editSearch?.id) {
        // ———————————— 修改 ————————————
        setModalLoading(true);
        updateSearchEngines({...editSearch, ...values}).then(result => {
          if (result.success && result.data) {
            const updateData = result.data;
            // 数据回显
            setLinkList(items => items?.map(item => item.id === updateData.id ? updateData : item));
            msg.success('修改成功');
            setEditOrAddData({open: false})
          } else msg.error('修改失败(返回数据异常')
        }).finally(() => setModalLoading(false));
      } else {
        // ———————————— 新增 ————————————
        addSearchEngines({...values, type: HOME_LINK}).then(result => {
          if (result.success) {
            setLinkList(v => [...v, result.data!])
            setEditOrAddData({open: false})
          }
        })
      }
    })
  }

  /** 右键菜单逻辑 */
  const menuOnClick = (e: MenuInfo, linkItem: ISearchEngines) => {
    if (e.key === EDIT) openModal(linkItem);
    if (e.key === SORT) {
      linkListBak.current = [...linkList];
      setIsDrag(true);
    }
    if (e.key === DELETE) {
      modal.confirm({
        title: `确定删除 ${linkItem.name} 吗?`,
        content: '删除了就不能撤回了哟...',
        maskClosable: true,
        async onOk() {
          const result = await deleteSearchEngine(linkItem.id);
          if (result.success) {
            setLinkList(items => items?.filter(item => item.id !== linkItem.id))
            msg.success('删除成功');
          }
        }
      })
    }
  }

  /** 取消拖拽 */
  const cancelDrag = () => {
    setIsDrag(false)
    setLinkList([...linkListBak.current!])
  }

  /** 确认排序 */
  const confirmSort = () => {
    const newSort = linkList.map(v => v.id).join('/');
    const oldSort = linkListBak.current?.map(v => v.id).join('/');

    if (newSort === oldSort) {
      setIsDrag(false)
      return msg.warning('没变...')
    }

    CommonStore.setLoading(true, '正在排序...')
    sortSearchEngine(newSort, HOME_LINK).then(res => {
      if (res.success) {
        msg.success('排序成功')
        setIsDrag(false)
      } else {
        setLinkList([...linkListBak.current!])
        msg.error(res.msg)
      }
    }).finally(() => CommonStore.setLoading(false))
  }

  /**
   * 是否拖拽组件
   *
   * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
   * @since 2025/8/11 2:54
   */
  const IsMyDnd = ({children}: { children: ReactNode }) => isDrag ?
    <MyDnd
      dndIds={linkList}
      setItems={setLinkList}
      dragEndFunc={setLinkList}
      style={{position: 'relative'}}
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
  const IsMyDndItem = ({children, linkItem}: IIsMyDndItem) => isDrag ?
    <MyDnd.Item id={linkItem.id} key={linkItem.id}>
      {children}
    </MyDnd.Item>
    :
    <Dropdown
      key={linkItem.id}
      menu={{items: menuItems, onClick: (e) => menuOnClick(e, linkItem)}}
      trigger={['contextMenu']}
    >
      {children}
    </Dropdown>

  return (
    <div>
      <div id="首页链接组件" className={s.center} style={{zIndex: isDrag ? 10000 : 'unset'}}>
        {!JWTUtils.isExpired() &&
          <IsMyDnd>
            <div className={s.grid10}>
              {linkList.map(item =>
                <IsMyDndItem linkItem={item} key={item.id}>
                  <div key={item.id} className={s.item} onClick={() => openUrl(item.engineUrl)}>
                    <TryFavicon
                      size={50}
                      errSize={40}
                      initElm="loading"
                      url={item.engineUrl}
                      iconUrl={item.iconUrl}
                    />
                    <div>{item.name}</div>
                  </div>
                </IsMyDndItem>
              )}
              {linkList.length < 20 &&
                <div onClick={() => openModal()} className={s.item}>
                  <PlusOutlined style={{fontSize: 30, color: '#888'}}/>
                </div>
              }
            </div>
          </IsMyDnd>
        }
      </div>

      {/*————————————————————————————————————新增或编辑弹窗————————————————————————————————————*/}
      <Modal
        title={editOrAddData.edit?.id ? '修改链接' : '添加链接'}
        open={editOrAddData.open}
        onOk={modalOnOk}
        confirmLoading={modalLoading}
        onCancel={() => setEditOrAddData({open: false})}
      >
        <Form<ISearchEngines>
          form={form}
          labelCol={{span: 6}}
          wrapperCol={{span: 16}}
          style={{maxWidth: 600}}
        >
          <Form.Item
            label="引擎名称" name="name"
            rules={[
              {required: true, message: '请输入引擎名字'},
              {max: 10, message: '引擎名称不能超过10个字符'}
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="引擎URL" name="engineUrl"
            rules={[
              {required: true, message: '请输入引擎URL'},
              {max: 255, message: '引擎URL不能超过255个字符'},
              {pattern: /^(http|https):\/\//, message: 'URL必须以 http:// 或 https:// 开头'}
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="图标" name="iconUrl"
            rules={[
              {max: 255, message: '引擎URL不能超过255个字符'},
              {pattern: /^(http|https):\/\//, message: 'URL必须以 http:// 或 https:// 开头'}
            ]}
          >
            <Input/>
          </Form.Item>

        </Form>
      </Modal>


      {isDrag &&  // 拖拽中 遮罩和功能键
        <div className={searchStyles.isDragBottom}>
          <div className={searchStyles.cancelDragAndDrop}>
            <Button size="large" onClick={cancelDrag}>取消拖拽</Button>
            <Button size="large" onClick={confirmSort}>确认排序</Button>
          </div>
        </div>
      }
    </div>
  );
}

export default LinkBox;
