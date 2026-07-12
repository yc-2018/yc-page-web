import {Button, ImageViewer, Popup, Tag, Toast} from 'antd-mobile'

import LinkifyContent from '@/components/LinkifyContent/index'
import {fDate} from '@/utils/DateUtils'
import styles from '@/pages/Mobile/styles/mobile.module.css'
import type {MemoAction, MobileMemoItem} from './types'
import MobileMemoImageGallery from './MobileMemoImageGallery'

type MemoDetailPopupProps = {
  visibleMemo?: MobileMemoItem
  onClose: () => void
  onShowLoopItems: (event?: unknown) => void
  onAction: (action: MemoAction) => void
}

/** 移动端备忘详情弹窗 */
const MemoDetailPopup = ({visibleMemo, onClose, onShowLoopItems, onAction}: MemoDetailPopupProps) => (
  <Popup
    visible={!!visibleMemo}
    closeOnSwipe
    onMaskClick={onClose}
    bodyStyle={{
      height: '62vh',
      width: '95vw',
      padding: 10,
      overflow: 'scroll',
      borderRadius: '15px 15px 0 0'
    }}
  >
    {visibleMemo &&
      <>
        <div className={styles.memoPopupMetaRows}>
          <div className={styles.memoPopupMetaRow}>
            {(visibleMemo.numberOfRecurrences ?? 0) > 0 && visibleMemo.itemType === 1 &&
              <Tag
                color="warning"
                fill="outline"
                onClick={onShowLoopItems}
                style={{'--background-color': '#fcecd8', flex: '0 0 auto'}}
                className={styles.memoPopupTag}
              >
                {`循环次数: ${visibleMemo.numberOfRecurrences}▼`}
              </Tag>
            }

            {visibleMemo.createTime !== visibleMemo.updateTime &&
              <Tag color="success" fill="outline" className={styles.memoPopupTag}
                   style={{'--background-color': '#c8f7c5', flex: '0 0 auto'}}>
                {visibleMemo.completed ?
                  <span onClick={() => Toast.show({content: `修改:${visibleMemo.updateTime}`})}>
                    完成:{fDate(visibleMemo.okTime)}
                  </span>
                  :
                  <span>修改:{fDate(visibleMemo.updateTime)}</span>
                }
              </Tag>
            }

            <Tag
              color="primary"
              fill="outline"
              className={styles.memoPopupTag}
              style={{'--background-color': '#c5f1f7', flex: '0 0 auto'}}
            >
              创建:{fDate(visibleMemo.createTime)}
            </Tag>
          </div>

          {Boolean(visibleMemo.tags?.length) &&
            <div className={styles.memoPopupTagRow}>
              {visibleMemo.tags?.map(tag =>
                <Tag
                  key={tag.id}
                  color="primary"
                  fill="outline"
                  className={styles.memoPopupTag}
                  style={{'--background-color': '#eef2ff', flex: '0 0 auto'}}
                >
                  {tag.name}
                </Tag>
              )}
            </div>
          }
        </div>

        <div style={{height: '42vh', overflowY: 'scroll', border: '1px solid #ccc', borderRadius: 10, marginTop: 5}}>
          {visibleMemo.okText && <div className={styles.okText}><b>完成备注：</b>{visibleMemo.okText}</div>}
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontSize: 14,
              fontFamily: 'unset',
              padding: 8,
              margin: 0
            }}
          >
            <LinkifyContent
              linkImg={(link: string) => <a key={link} onClick={() => ImageViewer.show({image: link})}>{link}</a>}
            >
              {visibleMemo.content ?? ''}
            </LinkifyContent>
          </pre>
          <MobileMemoImageGallery imgArr={visibleMemo.imgArr}/>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10}}>
          {visibleMemo.completed === 0 &&
            <Button
              block
              color="primary"
              onClick={() => onAction({key: 'edit', id: visibleMemo.id})}
            >
              修改
            </Button>
          }
          {visibleMemo.completed === 0 &&
            <Button
              block
              color="success"
              onClick={() => onAction({key: 'success', text: '完成', id: visibleMemo.id})}
            >
              完成
            </Button>
          }

          {visibleMemo.completed === 1 &&
            <Button
              block
              style={{background: '#f6b234', border: 'none', color: '#fff'}}
              onClick={() => onAction({key: 'success', text: '取消完成', id: visibleMemo.id})}
            >
              取消完成
            </Button>
          }

          <Button
            block
            color="danger"
            onClick={() => onAction({key: 'delete', id: visibleMemo.id})}
          >
            删除
          </Button>

          {visibleMemo.itemType === 1 &&
            <Button
              block
              style={{background: '#a934f6', border: 'none', color: '#fff'}}
              onClick={() => onAction({key: 'addOne', id: visibleMemo.id})}
            >
              +1
            </Button>
          }
        </div>
      </>
    }
  </Popup>
)

export default MemoDetailPopup
