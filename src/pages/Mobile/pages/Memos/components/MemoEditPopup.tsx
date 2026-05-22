import type {RefObject} from 'react'
import {Button, Dialog, Modal, Popup, Radio, TextArea} from 'antd-mobile'
import type {TextAreaRef} from 'antd-mobile/es/components/text-area'

import {symbols} from '@/pages/MemoDrawer/constants'
import type {MobileMemoItem} from './types'

type MemoEditPopupProps = {
  editVisible?: false | '新增' | MobileMemoItem
  content: string
  itemType: number
  textRef: RefObject<TextAreaRef>
  onClose: () => void
  onContentChange: (value: string) => void
  onItemTypeChange: (value: number) => void
  onOpenDatePicker: () => void
  onInsertAtCursor: (text: string) => void
  onSubmit: () => void
}

/** 移动端备忘新增/编辑弹窗 */
const MemoEditPopup = ({
  editVisible,
  content,
  itemType,
  textRef,
  onClose,
  onContentChange,
  onItemTypeChange,
  onOpenDatePicker,
  onInsertAtCursor,
  onSubmit,
}: MemoEditPopupProps) => (
  <Popup
    visible={!!editVisible}
    onMaskClick={async () => {
      const oldContent = editVisible && editVisible !== '新增' ? editVisible.content : '' // 原备忘内容
      if (!content || content === oldContent) return onClose()
      const result = await Dialog.confirm({
        content: '检测到内容已修改，直接返回已编辑的内容会丢失哦,确定退出吗？',
        closeOnMaskClick: true,
      })
      if (result) onClose()
    }}
    position="top"
    bodyStyle={{height: '450px'}}
  >
    <div style={{padding: '10px'}}>
      <div style={{textAlign: 'center'}}>
        <Radio.Group value={itemType} onChange={value => onItemTypeChange(Number(value))}>
          <Radio value={0} className="█Radio">普通</Radio>
          <Radio value={1} className="█Radio">循环</Radio>
          <Radio value={2} className="█Radio">长期</Radio>
          <Radio value={3} className="█Radio">紧急</Radio>
          <Radio value={5} className="█Radio">日记</Radio>
          <Radio value={6} className="█Radio">工作</Radio>
          <Radio value={7} className="█Radio">其他</Radio>
        </Radio.Group>
      </div>

      <TextArea
        rows={13}
        showCount
        ref={textRef}
        value={content}
        className="contentText"
        style={{height: '300px'}}
        placeholder="请输入备忘内容"
        maxLength={itemType === 5 ? 4000 : 2000}
        onChange={onContentChange}
      />
      <div style={{margin: '10px 0'}}>
        <Button size="small" onClick={onOpenDatePicker}>插入日期</Button>
        &nbsp;
        <Button
          size="small"
          onClick={() => {
            const handler = Modal.show({
              content:
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2}}>
                  {symbols.map((item) =>
                    <div
                      key={item}
                      style={{padding: 5, border: '1px solid #ccc', textAlign: 'center'}}
                      onClick={() => {
                        onInsertAtCursor(item)
                        handler.close()
                      }}
                    >
                      {item}
                    </div>
                  )}
                </div>,
              closeOnMaskClick: true,
              closeOnAction: true,
              actions: [{key: 'close', text: '关闭'}]
            })
          }}
        >
          插入符号
        </Button>
      </div>

      <Button block onClick={onSubmit}> 提交 </Button>
    </div>
  </Popup>
)

export default MemoEditPopup
