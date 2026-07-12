import type {RefObject} from 'react'
import {Button, Dialog, ImageUploader, ImageViewer, Modal, Popup, Radio, Selector, TextArea} from 'antd-mobile'
import type {ImageUploadItem, UploadTask} from 'antd-mobile/es/components/image-uploader'
import type {TextAreaRef} from 'antd-mobile/es/components/text-area'

import {symbols} from '@/pages/MemoDrawer/constants'
import styles from '@/pages/Mobile/styles/mobile.module.css'
import type {MobileMemoItem} from './types'
import {MAX_MEMO_IMAGES} from '@/utils/memoImageUtils.js'

type MemoEditPopupProps = {
  editVisible?: false | '新增' | MobileMemoItem
  content: string
  itemType: number
  textRef: RefObject<TextAreaRef>
  onClose: () => void
  onContentChange: (value: string) => void
  onItemTypeChange: (value: number) => void
  memoTags: {id?: number, name?: string}[]
  tagIds: number[]
  onTagIdsChange: (value: number[]) => void
  hasUnsavedChanges: boolean
  memoImages: ImageUploadItem[]
  onMemoImagesChange: (items: ImageUploadItem[]) => void
  onImageUploadQueueChange: (tasks: UploadTask[]) => void
  onUploadImage: (file: File) => Promise<ImageUploadItem>
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
  memoTags,
  tagIds,
  onTagIdsChange,
  hasUnsavedChanges,
  memoImages,
  onMemoImagesChange,
  onImageUploadQueueChange,
  onUploadImage,
  onOpenDatePicker,
  onInsertAtCursor,
  onSubmit,
}: MemoEditPopupProps) => (
  <Popup
    style={{background: '#bf3434'}}
    visible={!!editVisible}
    onMaskClick={async () => {
      if (!hasUnsavedChanges) return onClose()
      const result = await Dialog.confirm({
        content: '检测到内容已修改，直接返回已编辑的内容会丢失哦,确定退出吗？',
        closeOnMaskClick: true,
      })
      if (result) onClose()
    }}
    position="top"
    bodyStyle={{minHeight: 450}}
  >
    <div className={styles.memoEditBody}>
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

      {memoTags.length > 0 &&
        <div className={styles.memoEditTagBox}>
          <Selector
            multiple
            className={styles.memoEditTagSelector}
            value={tagIds}
            options={memoTags.map(tag => ({label: tag.name ?? '', value: tag.id ?? 0}))}
            onChange={arr => onTagIdsChange(arr as number[])}
          />
        </div>
      }

      <TextArea
        rows={13}
        showCount
        ref={textRef}
        value={content}
        className="contentText"
        style={{height: memoTags.length > 0 ? '200px' : '245px'}}
        placeholder="请输入备忘内容"
        maxLength={itemType === 5 ? 4000 : 2000}
        onChange={onContentChange}
      />
      <div className={styles.memoImageUploaderRow}>
        <ImageUploader
          className={styles.memoImageUploader}
          value={memoImages}
          columns={6}
          maxCount={MAX_MEMO_IMAGES}
          multiple
          accept="image/*"
          showFailed={false}
          upload={onUploadImage}
          onChange={onMemoImagesChange}
          onUploadQueueChange={onImageUploadQueueChange}
          onPreview={index => ImageViewer.Multi.show({
            images: memoImages.map(item => item.url),
            defaultIndex: index,
            classNames: {mask: styles.imgListViewer},
          })}
        />
      </div>
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
