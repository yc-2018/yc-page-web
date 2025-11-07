import {useEffect, useRef, useState} from "react";
import {DownCircleOutlined, PlusOutlined, SendOutlined} from "@ant-design/icons";
import {
  addSearchEngines,
  getSearchEngines,
  getThinkList,
  updateSearchEngines
} from "@/request/homeApi";
import {Alert, App, AutoComplete, Button, Checkbox, Divider, Form, Input, Modal} from "antd";
import SearchEngines from "@/pages/Home/HomeSearch/SearchEngines";
import {_getDefaultEngine, _getSearchEngines, _setSearchEngines} from "@/utils/localStorageUtils";
import ISearchEngines, {LOW_SEARCH, SEARCH} from "@/interface/ISearchEngines";
import JWTUtils from "@/utils/JWTUtils";
import UserStore from "@/store/UserStore";
import CommonStore from "@/store/CommonStore";
import './index.css'

let timer: number;
const {msg} = CommonStore
interface IEditOrAdd {
  open: boolean;
  edit?: ISearchEngines;
}

/**
 * 首页搜索框组件
 *
 * @author Yc
 * @since 2025/7/16 2:01
 */
const SearchBox = () => {
  const getDefaultEngine = _getDefaultEngine();
  const [searchList, setSearchList] = useState<ISearchEngines[] | undefined>(_getSearchEngines())
  const [searchLowList, setSearchLowList] = useState<ISearchEngines[]>();
  const [showLows, setShowLows] = useState(false);
  const [anotherOptions, setAnotherOptions] = useState<{ value: any }[]>([]);
  const [nowSearch, setNowSearch] = useState<ISearchEngines>(getDefaultEngine)
  const [editOrAddData, setEditOrAddData] = useState<IEditOrAdd>({open: false})
  const [modalLoading, setModalLoading] = useState(false)
  const [lowLoading, setLowLoading] = useState(false)
  const [q, setQ] = useState<string>(); // 搜索框的值,当前组件用不上,子组件传useRef有问题，就用这个
  const searchValue = useRef<string>();
  const [form] = Form.useForm(); // 创建一个表单域
  const {modal} = App.useApp();      // 获取在App组件的上下文的modal

  useEffect(() => {
    // 获取搜索引擎列表
    if (!JWTUtils.isExpired()) {
      getSearchEngines(SEARCH).then(response => {
        if (response.success) setSearchList(response.data)
      });
      getDefaultEngine && setNowSearch(getDefaultEngine)  // 获取默认搜索引擎(登录时)
    }
  }, [UserStore.jwt])

  /** 索引列表变化就记录 */
  useEffect(() => {
    !JWTUtils.isExpired() && searchList?.length && _setSearchEngines(searchList)
  }, [searchList])


  /** 获取不常用搜索列表 */
  const getSearchLowList = () => {
    setShowLows(true)
    if (searchLowList?.length) return; // 存在列表就不用请求了

    setLowLoading(true)
    getSearchEngines(LOW_SEARCH).then(response => {
      if (response.success) setSearchLowList(response.data ?? [])
    }).finally(() => setLowLoading(false));
  }

  /**
   * 搜索【新页面打开】
   *
   * @author Yc
   * @since 2025/7/16 1:57
   */
  const onSearch = () => window.open(nowSearch.engineUrl.replace('@@@', searchValue.current ?? ''), '_blank');

  /**
   * 生成联想项
   *
   * @author Yc
   * @since 2025/7/16 1:40
   */
  const getOption = (item: { value: string }) =>
    <div
      key={item.value}
      style={{display: 'flex', justifyContent: 'space-between'}}
      onClick={() => setKeyword(item.value)}
    >
      <span>{item.value}</span>
      <div className="searchGo" onClick={() => setTimeout(onSearch, 50)}>
        <SendOutlined/>
      </div>
    </div>;

  /**
   * 自动通过接口联想
   *
   * @author Yc
   * @since 2025/7/16 1:41
   */
  const autoThink = (text: string) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(async () => {
      const list: { value: string }[] = await getThinkList(text);
      setAnotherOptions(list?.map(item => ({value: item.value, label: getOption(item)})) ?? [])
    }, 50)
  }

  /** 打开编辑或新增弹窗 */
  const openModal = (edit?: ISearchEngines) => {
    setEditOrAddData({open: true, edit})
    form.resetFields()
    form.setFieldsValue({...edit, lowUsage: Boolean(edit?.type)})
  }

  /** 设置为[常用/不常用](换) */
  const changeLowUsage = (search: ISearchEngines) => {
    const lowTo = search.type === SEARCH ? '不常用' : '常用'
    modal.confirm({
      title: `确定把【${search.name}】切换到 ${lowTo}吗?`,
      content: `放到【${lowTo}】列表的最后`,
      maskClosable: true,
      async onOk() {
        const setXxxSearchList = search.type === SEARCH ? setSearchList : setSearchLowList
        if (search?.type === SEARCH) search.type = LOW_SEARCH
        else search.type = SEARCH
        updateSearchEngines(search).then(res => {
          if (res.success) {
            // 本身列表中移除
            setXxxSearchList(v => v?.filter(item => item.id !== search.id))
            // 添加到另外列表中
            const setXxxToSearchList = setXxxSearchList === setSearchList ? setSearchLowList : setSearchList
            setXxxToSearchList(v => v ? [...v, res.data!] : undefined)
          }
        })
      }
    })
  }

  /** 设置关键字 */
  const setKeyword = (v: string) => {
    setQ(v)
    searchValue.current = v
  }

  /** 新增或编辑弹窗的确定处理 */
  const modalOnOk = () => {
    form.validateFields().then((values: ISearchEngines & { lowUsage: boolean }) => {
      values.type = values.lowUsage ? LOW_SEARCH : SEARCH
      const editSearch = editOrAddData.edit;
      if (editSearch?.id) {
        // ———————————— 修改 ————————————
        setModalLoading(true);
        updateSearchEngines({...editSearch, ...values}).then(result => {
          if (result.success && result.data) {
            const updateData = result.data;
            const setXxxSearchList = editSearch.type === SEARCH ? setSearchList : setSearchLowList;
            // 数据回显 ( 考虑 常用和不常用列表的转换
            if (updateData.type === editSearch!.type) {
              setXxxSearchList(items =>
                  items?.map(item => item.id === updateData.id ? updateData : item));
            } else {  // ——数据换列表——
              // 移除原列表那个数据
              setXxxSearchList(items => items?.filter(item => item.id !== updateData.id));
              // 反转设置某列表方法
              const setToXxxSearchList = setXxxSearchList === setSearchList ? setSearchLowList : setSearchList
              // 放到新列表：考虑新列表是否为空？空就算了
              setToXxxSearchList(items => items ? [...items, updateData] : undefined);
            }
            msg.success('修改成功');
            setEditOrAddData({open: false})
          } else msg.error('修改失败(返回数据异常')
        }).finally(() => setModalLoading(false));
      } else {
        // ———————————— 新增 ————————————
        addSearchEngines(values).then(result => {
          if (result.success) {
            const setXxxSearchList = values.type === SEARCH ? setSearchList : setSearchLowList;
            setXxxSearchList(v => v ? [...v, result.data!] : undefined)
            setEditOrAddData({open: false})
          }
        })
      }
    })

  }

  return (
    <div id="搜索组件">

      <SearchEngines
        id="搜索引擎列表"
        q={q}
        setEngine={setNowSearch}
        searchList={searchList}
        setSearchList={setSearchList}
        openModal={openModal}
        changeLowUsage={changeLowUsage}
        extraElement={UserStore.jwt &&
          <>
            {!showLows &&
              <Button
                loading={lowLoading}
                title="展开不常用搜索引擎"
                icon={<DownCircleOutlined/>}
                className="opacity30to100"
                onClick={() => getSearchLowList()}
              />
            }
            <Button
              style={{position: 'absolute', right: 6}}
              title="添加新的搜索引擎"
              icon={<PlusOutlined/>}
              className="opacity30to100"
              onClick={() => openModal()}
            />
          </>
        }
      />

      {showLows &&
        <SearchEngines
          id="不常用搜索引擎列表"
          changeLowName="设为常用"
          q={q}
          setEngine={setNowSearch}
          searchList={searchLowList}
          setSearchList={setSearchLowList}
          openModal={openModal}
          changeLowUsage={changeLowUsage}
          btnStyle={{borderColor: '#fff', background: '#555050', color: 'white'}}
          extraElement={
            <Button
              title="隐藏不常用搜索引擎"
              className="opacity30to100"
              onClick={() => setShowLows(false)}
              icon={<DownCircleOutlined style={{transform: 'rotate(180deg)'}}/>}
            />
          }
        />
      }

      <AutoComplete
        onSearch={autoThink}                          // 输入框值改变时联想列表的回调
        options={anotherOptions}                      // 联想列表
        // value={searchValue.current}                // 输入框的值
        // open                                       // 测试用 一直展开联想列表
        onChange={setKeyword}                         // 输入框的值改变的回调
        classNames={{popup: {root: 'thinkList'}}}
        style={{width: 500, height: 40, margin: '5px 0 15px 0'}}
      >
        <Input.Search
          size="large"
          onSearch={() => setTimeout(onSearch, 50)}                   // 点击搜索按钮的回调
          placeholder="求知若渴，解惑在斯。"
          enterButton={[nowSearch.name, <SendOutlined key="搜索按钮"/>]}      // 搜索按钮
        />
      </AutoComplete>

      {/*————————————————————————————————————新增或编辑弹窗————————————————————————————————————*/}
      <Modal
          title={editOrAddData.edit?.id ? '修改搜索引擎' : '添加搜索引擎'}
          open={editOrAddData.open}
          onOk={modalOnOk}
          confirmLoading={modalLoading}
          onCancel={() => setEditOrAddData({open: false})}
      >
        {!editOrAddData.edit && // 新增时提示
          <Alert
            type="success"
            description={
              <>
                提示 添加搜索引擎时用@@@替代你要搜索的内容哦，比如百度的：
                <Divider style={{color: 'blue'}}>https://www.baidu.com/s?wd=@@@</Divider>
              </>}
          />
        }

        <br/>
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
              {
                pattern: /^(http|https):\/\/.*@@@.*$/,
                message: 'URL必须以 http:// 或 https:// 开头，并且包含 "@@@"'
              }
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
              label="图标" name="iconUrl"
              rules={[
                {max: 255, message: '引擎URL不能超过255个字符'},
                {
                  pattern: /^(http|https):\/\//,
                  message: 'URL必须以 http:// 或 https:// 开头'
                }
              ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item label="不常用" name="lowUsage" valuePropName="checked">
            <Checkbox/>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}

export default SearchBox;
