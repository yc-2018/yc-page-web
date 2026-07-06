import {useEffect, useRef, useState} from 'react';
import type {Dispatch, SetStateAction} from 'react';
import {QuestionCircleTwoTone, SmileTwoTone} from '@ant-design/icons';
import {Modal, Input, Radio, Button, DatePicker, Popover, Row, Col, App, Checkbox} from 'antd';
import type {Dayjs} from 'dayjs';
import type {TextAreaRef} from 'antd/es/input/TextArea';
import {addMemo, getMemoTags, updateMemo} from '@/request/memoApi';
import modalStyle from '@/pages/MemoDrawer/compontets/formModal.module.css'
import CommonStore from '@/store/CommonStore';
import {toolsBaseURL} from '@/request/toolsRequest';
import type IMemo from '@/interface/IMemo';
import type IMemoTag from '@/interface/IMemoTag';
import {symbols} from '@/pages/MemoDrawer/constants';

const {TextArea} = Input;
const {msg} = CommonStore

interface MemoFormData extends Omit<IMemo, 'content' | 'itemType'> {
  /** 备忘内容，新增时允许为空 */
  content?: string | null
  /** 备忘类型，提交时允许传空表示不修改 */
  itemType?: number | null
}

interface FormModalProps {
  /** 弹窗是否显示 */
  isOpen: boolean
  /** 关闭弹窗 */
  setOpen: Dispatch<SetStateAction<boolean>>
  /** 编辑的数据（不改变的） */
  data?: IMemo | null
  /** 刷新列表 */
  reList: () => void
  /** 当前备忘类型，新增时使用 */
  currentMemoType: number
  /** 当前备忘类型标签列表 */
  currentMemoTags: IMemoTag[]
}

/** 外部图片链接列表 */
const externalImgBedList = [
  {src: 'https://playground.z.wiki/img-cloud/index.html', title: '外部图床1(可能失效,注意信息安全)'},
  {src: `${toolsBaseURL}/聚合图床/`, title: '外部图床2(数据在外部，注意信息安全)'},
  {src: `${toolsBaseURL}/官方图床/`, title: '官方图床3'},
  // {src: 'https://ycimg.pages.dev/', title: '外部图床2(加载缓慢,最大支持5M)'},
]

/**
 * 新增/编辑备忘录弹窗
 *
 * @param isOpen          弹窗是否显示
 * @param setOpen         关闭弹窗
 * @param data            编辑的数据（不改变的）
 * @param reList          刷新列表
 * @param currentMemoType 当前备忘类型，编辑时不用，新增时使用
 * @param currentMemoTags 当前备忘类型标签列表
 */
const FormModal = ({isOpen, setOpen, data, reList, currentMemoType, currentMemoTags}: FormModalProps) => {
  const [formData, setFormData] = useState<MemoFormData | null>(null); // 用来复制编辑的数据（改变的）
  const [confirmLoading, setConfirmLoading] = useState(false)          // 提交按钮loading
  const [openDate, setOpenDate] = useState(false)                      // 日期选择
  const [openDateRange, setOpenDateRange] = useState(false)            // 日期范围选择
  const [memoTags, setMemoTags] = useState<IMemoTag[]>([])              // 当前类型标签列表

  const textRef = useRef<TextAreaRef>(null)  // 搜索框的ref 让它能自动获得焦点
  const {modal} = App.useApp();              // 关闭时提示框

  // 初始化数据
  useEffect(() => {
    if (data) setFormData(data)  // 编辑时，初始化数据
    else setFormData({           // 新增时，初始化数据
      content: null,
      itemType: currentMemoType,
      tagIds: [],
    })
  }, [data, currentMemoType])

  // 切换类型后加载当前类型标签
  useEffect(() => {
    const itemType = formData?.itemType; // 当前表单类型
    if (itemType === null || itemType === undefined) return setMemoTags([]);
    if (itemType === currentMemoType) return setMemoTags(currentMemoTags);
    getMemoTags(itemType).then(resp => setMemoTags(resp?.data ?? []));
  }, [formData?.itemType, currentMemoTags, currentMemoType])

  // 打开后自动获得焦点
  useEffect(() => {
    // 点击编辑或新增按钮后自动获得焦点,但是弹窗没这么快出现在页面上，所以获取焦点也要延迟一点点
    if (isOpen) window.setTimeout(() => textRef.current?.focus(), 100)
  }, [isOpen])

  /** 关闭弹窗 */
  const closeModal = (notSubmit = true) => {
    // 编辑框有内容 && 内容发送改变 && 不是提交 ==>> 提示弹窗
    if (formData?.content && formData.content !== data?.content && notSubmit) {
      modal.confirm({
        title: '检查到内容发送改变',
        content: '是否确定不保存内容直接关闭编辑框？',
        okText: '确认关闭',
        onOk: close
      })
    } else close()

    function close() {
      setOpenDateRange(false)                          // 日期范围选择器关闭
      setOpenDate(false)                               // 日期选择器关闭
      window.setTimeout(() => setOpen(false), 100)     // 延迟关闭，防止这个先关闭了时间选择器就关闭不了
    }
  };

  /** 确定按钮（编辑完成给后端发请求） */
  const handleOk = async () => {
    if (!formData?.itemType?.toString()) return msg.error('备忘类型不能为空')
    if (!formData.content) return msg.error('备忘内容不能为空')

    setConfirmLoading(true);
    // 构造请求体
    const body: MemoFormData = {};
    body.content = formData.content === data?.content ? null : formData.content;
    body.itemType = formData.itemType === data?.itemType ? null : formData.itemType;
    if (!sameIds(formData.tagIds, data?.tagIds)) body.tagIds = formData.tagIds ?? [];
    body.id = data?.id;
    const result = await (data ? updateMemo : addMemo)(body as IMemo);
    if (result) {
      closeModal(false);
      reList() // 刷新列表
    }
    setConfirmLoading(false);
  };

  /** 插入日期 */
  const insertDate = (_date: Dayjs | null, dateStr: string | null) => {
    const selectedDate = dateStr ?? ''; // 选择的日期文本
    insertAtCursor(`${selectedDate}${formData?.content ? '' : '\n'}`) // 插入日期 如果本来内容为空 那多加一个换行
    setOpenDate(false)
  }

  /** 判断标签ID是否一致 */
  const sameIds = (a?: number[], b?: number[]) => {
    const left = [...(a ?? [])].sort((x, y) => x - y).join(',');
    const right = [...(b ?? [])].sort((x, y) => x - y).join(',');
    return left === right;
  }

  /** 插入日期范围 */
  const insertDateRange = (_dates: [Dayjs | null, Dayjs | null] | null, date2Str: [string, string]) => {
    if (!date2Str[0]) return;
    insertAtCursor(`${date2Str.join('~')}${formData?.content ? '' : '\n'}`) // 如果本来内容为空 那多加一个换行
    setOpenDateRange(false)
  }

  /** 插入符号 */
  const signs =
    <Row>
      {symbols.map(sign =>
        <Col key={sign} span={3} onClick={() => insertAtCursor(sign)} className={modalStyle.sign}>
          {sign}
        </Col>
      )}
    </Row>

  /** 在光标位置后面插入文本的函数 */
  const insertAtCursor = (textToInsert: string) => {
    // 获取原生的textarea元素
    const textareaElement = textRef.current?.resizableTextArea?.textArea ?? {selectionStart: -1, selectionEnd: -1}
    const selectionStart = textareaElement.selectionStart;   // 光标位置
    const selectionEnd = textareaElement.selectionEnd        // 选择情况下的选中最后位置 没选中就是和光标位置一样

    const currentValue = formData?.content ?? ''
    const beforeText = currentValue.slice(0, selectionStart);
    const afterText = currentValue.slice(selectionEnd);

    setFormData(formData => ({
      ...(formData ?? {}),
      content: `${beforeText}${textToInsert}${afterText}`
    }));

    window.setTimeout(() => { // setFormData是异步的哇 所以一定要比它还要晚一点 因为它是属于全覆盖 光标自然在最后
      // 重新定位光标到插入点之后
      if (textRef.current) {
        textRef.current?.resizableTextArea?.textArea.setSelectionRange(selectionStart + textToInsert.length, selectionStart + textToInsert.length)
        textRef.current.focus();
      }
    }, 100)
  }

  /** 打开外部图床弹窗 */
  const openExternalImgModel = (title: string, src: string) =>
    modal.info({
      title,
      style: {top: 20},
      wrapClassName: modalStyle.externalImgModel,
      width: '100vh',
      okText: '关闭',
      mask: {closable: true},
      content:
        <iframe
          src={src}
          title={title}
          allow="clipboard-read; clipboard-write"
          style={{width: '100%', height: '100%'}}
        />
    })

  /** 帮助按钮气泡 */
  const help =
    <div>
      <p>● 点击插入时间/段,可插入时间/段在输入框光标所在位置</p>
      <p>● 如果输入框本来是空的 插入后会多加一个换行</p>
      <p>● 如果选中了文字 插入会覆盖哦</p>
      <p>● 插入的符号更多
        <Button
          type="link"
          href="https://blog.csdn.net/weixin_46665865/article/details/126132912"
          style={{padding: 0}}
          target="_blank"
        >
          参考这里
        </Button>
      </p>
    </div>

  /** 自定义底部按钮 */
  const footerButtons = [
    ...externalImgBedList.map(({title, src}, index) =>
      <Button
        key={index}
        onClick={() => openExternalImgModel(title, src)}
      >
        外部图床{index + 1}
      </Button>),
    <Popover key="help" content={help} title="帮助"><Button icon={<QuestionCircleTwoTone/>} shape="circle"/></Popover>,
    <Popover key="insertSymbol" content={signs} title="插入符号"><Button icon={<SmileTwoTone/>}
                                                                         shape="circle"/></Popover>,
    <Button key="RangeButt" onClick={() => {
      setOpenDateRange(v => !v)
      setOpenDate(false)
    }}>
      插入日期段
    </Button>,
    <Button key="dateButt" onClick={() => {
      setOpenDate(v => !v)
      setOpenDateRange(false)
    }}>
      插入日期
    </Button>,
    <Button key="back" onClick={() => closeModal()}>返回</Button>,
    <Button key="submit" type="primary" onClick={handleOk} loading={confirmLoading}>提交</Button>,
  ]
  const selectableMemoTags = memoTags.filter((tag): tag is IMemoTag & {id: number} => typeof tag.id === 'number'); // 可选标签列表

  return (
    <Modal
      width={888}
      title={data ? '编辑备忘' : '新增备忘'}
      open={isOpen}
      onCancel={() => closeModal()}
      footer={footerButtons}
    >
      <div className="lrCenter">
        <Radio.Group
          onChange={(e) => setFormData(formData => ({...(formData ?? {}), itemType: e.target.value, tagIds: []}))}
          value={formData?.itemType}
          buttonStyle="solid"
          style={{margin: 5}}
        >
          <Radio.Button value={0}>普通</Radio.Button>
          <Radio.Button value={1}>循环</Radio.Button>
          <Radio.Button value={2}>长期</Radio.Button>
          <Radio.Button value={3}>紧急</Radio.Button>
          <Radio.Button value={5}>日记</Radio.Button>
          <Radio.Button value={6}>工作</Radio.Button>
          <Radio.Button value={7}>其他</Radio.Button>
        </Radio.Group>
      </div>
      <div className={modalStyle.memoTagBox}>
        {selectableMemoTags.length > 0 ?
          <Checkbox.Group
            className={modalStyle.memoTagGroup}
            value={formData?.tagIds ?? []}
            onChange={tagIds => setFormData(formData => ({...(formData ?? {}), tagIds: tagIds as number[]}))}
          >
            {selectableMemoTags.map(tag =>
              <Checkbox key={tag.id} value={tag.id}>
                {tag.name}
              </Checkbox>
            )}
          </Checkbox.Group> :
          <div className={modalStyle.memoTagEmpty}>当前类型暂无标签，请先在列表上方新增</div>
        }
      </div>
      <TextArea
        rows={14}
        showCount
        ref={textRef}
        maxLength={formData?.itemType === 5 ? 4000 : 2000}
        value={formData?.content ?? undefined}
        placeholder="请输入备忘内容"
        onChange={e => setFormData(formData => ({...(formData ?? {}), content: e.target.value}))}
      />
      {/*日期选择面板*/}
      <DatePicker
        open={openDate}
        onChange={insertDate}
        placement="topRight"
        style={{left: 480, top: 30, height: 20, visibility: 'hidden'}}
      />
      {/*日期范围选择面板*/}
      <DatePicker.RangePicker
        key="dateRange"
        open={openDateRange}
        onChange={insertDateRange}
        placement="topRight"
        style={{left: 100, height: 20, display: openDateRange ? '' : 'none'}}
      />
    </Modal>
  )
}
export default FormModal;
