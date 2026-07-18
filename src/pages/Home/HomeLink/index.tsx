import {Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState} from 'react';
import {
  addSearchEngines, deleteSearchEngine,
  getSearchEngines, sortSearchEngine,
  updateSearchEngines
} from '@/request/homeApi';
import {App, Button, Dropdown, Form, Input, Modal, Space} from 'antd';
import {_getHomeLinks, _setHomeLinks} from '@/utils/localStorageUtils';
import ISearchEngines, {HOME_LINK, type ISearchEngineExample} from '@/interface/ISearchEngines';
import type {MenuClickInfo} from '@/interface/IAntd';
import JWTUtils from '@/utils/JWTUtils';
import UserStore from '@/store/UserStore';
import CommonStore from '@/store/CommonStore';
import {AppstoreAddOutlined, PlusOutlined} from '@ant-design/icons';
import MyDnd from '@/components/MyDnd';
import TryFavicon from '@/components/TryFavicon';
import EngineExamplePicker from '@/components/EngineExamplePicker';
import {homeLinkExamples} from '@/store/SearchEngineExamples';
import s from './index.module.css'
import searchStyles from '@/pages/Home/HomeSearch/SearchEngines.module.css';

interface IEditOrAdd {
  open: boolean;
  edit?: ISearchEngines;
}

interface IIsMyDnd {
  children: ReactNode,
  linkList: ISearchEngines[],
  setLinkList: Dispatch<SetStateAction<ISearchEngines[]>>,
  isDrag: boolean
}

interface IIsMyDndItem {
  children: ReactNode,
  linkItem: ISearchEngines,
  isDrag: boolean
  menuOnClick: (e: MenuClickInfo, linkItem: ISearchEngines) => void
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
  const [examplePickerOpen, setExamplePickerOpen] = useState(false) // 示例选择弹窗状态

  const [form] = Form.useForm(); // 创建一个表单域
  const {modal} = App.useApp();      // 获取在App组件的上下文的modal
  const linkListBak = useRef<ISearchEngines[]>();
  const {jwt} = UserStore;           // 当前登录凭证

  useEffect(() => {
    // 获取搜索引擎列表
    if (!JWTUtils.isExpired()) {
      getSearchEngines(HOME_LINK).then(response => {
        if (response.success) setLinkList(response.data ?? [])
      });
    }
  }, [jwt])

  /** 索引列表变化就记录 */
  useEffect(() => {
    if (!JWTUtils.isExpired() && linkList?.length) _setHomeLinks(linkList)
  }, [linkList])


  /** 打开编辑或新增弹窗 */
  const openModal = (edit?: ISearchEngines) => {
    setEditOrAddData({open: true, edit})
    setExamplePickerOpen(false)
    form.resetFields()
    form.setFieldsValue(edit)
  }

  /** 关闭新增或编辑弹窗 */
  const closeModal = () => {
    setExamplePickerOpen(false)
    setEditOrAddData({open: false})
  }

  /** 选择示例后回填首页链接表单 */
  const applyHomeLinkExample = (example: ISearchEngineExample) => {
    form.setFieldsValue({
      name: example.name,
      engineUrl: example.engineUrl,
      iconUrl: example.iconUrl ?? '',
    })
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
            closeModal()
          } else msg.error('修改失败(返回数据异常')
        }).finally(() => setModalLoading(false));
      } else {
        // ———————————— 新增 ————————————
        addSearchEngines({...values, type: HOME_LINK}).then(result => {
          if (result.success) {
            setLinkList(v => [...v, result.data!])
            closeModal()
          }
        })
      }
    })
  }

  /** 右键菜单逻辑 */
  const menuOnClick = (e: MenuClickInfo, linkItem: ISearchEngines) => {
    if (e.key === EDIT) openModal(linkItem);
    if (e.key === SORT) {
      linkListBak.current = [...linkList];
      setIsDrag(true);
    }
    if (e.key === DELETE) {
      modal.confirm({
        title: `确定删除 ${linkItem.name} 吗?`,
        content: '删除了就不能撤回了哟...',
        mask: {closable: true},
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

  return (
    <div>
      <div id="首页链接组件" className={s.center} style={{zIndex: isDrag ? 10000 : 'unset'}}>
        {!JWTUtils.isExpired() &&
          <IsMyDnd isDrag={isDrag} linkList={linkList} setLinkList={setLinkList}>
            <div className={s.grid10}>
              {linkList.map(item =>
                <IsMyDndItem linkItem={item} key={item.id} isDrag={isDrag} menuOnClick={menuOnClick}>
                  <div key={item.id} className={s.item} onClick={() => openUrl(item.engineUrl)}>
                    <span className={s.itemIcon}>
                      <TryFavicon
                        size={50}
                        errSize={40}
                        initElm="loading"
                        url={item.engineUrl}
                        iconUrl={item.iconUrl}
                      />
                    </span>
                    <div className={s.itemName}>{item.name}</div>
                  </div>
                </IsMyDndItem>
              )}
              {linkList.length < 20 && !isDrag &&
                <div onClick={() => openModal()} className={s.item}>
                  <span className={s.itemIcon}>
                    <PlusOutlined style={{fontSize: 30, color: 'currentColor'}}/>
                  </span>
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
        onCancel={closeModal}
        footer={(_, {OkBtn, CancelBtn}) => (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            {!editOrAddData.edit?.id
              ? <Button icon={<AppstoreAddOutlined/>} onClick={() => setExamplePickerOpen(true)}>选择示例</Button>
              : <span/>}
            <Space>
              <CancelBtn/>
              <OkBtn/>
            </Space>
          </div>
        )}
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

      <EngineExamplePicker
        open={examplePickerOpen}
        examples={homeLinkExamples}
        onCancel={() => setExamplePickerOpen(false)}
        onSelect={applyHomeLinkExample}
      />


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

// —————————————————————————— 组件 ———————————————————————————— 之前每次组件刷新都会抖动，原来是因为放在了组件的内部，难怪会出现这种情况，所以要放在组件的外面，这样就不会抖动了

/**
 * 是否拖拽组件
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/8/11 2:54
 */
const IsMyDnd = ({children, linkList, setLinkList, isDrag}: IIsMyDnd) => isDrag ?
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
const IsMyDndItem = ({children, linkItem, isDrag, menuOnClick}: IIsMyDndItem) => isDrag ?
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
