import {Button, Popup} from 'antd-mobile'

type LoopMemoItem = {
  id: number
  memoId: number
  loopText?: string
  createTime?: string
  updateTime?: string
}

type LoopMemoActionPopupProps = {
  loopItemVisible: LoopMemoItem | null
  onClose: () => void
  onDirectAddOne: (loopItem: LoopMemoItem) => void
  onAddOneWithText: (loopItem: LoopMemoItem) => void
  onEditLoopItem: (loopItem: LoopMemoItem) => void
  onEditLoopComment: (loopItem: LoopMemoItem) => void
  onDeleteLoopItem: (memoId: number, id: number) => void
}

/** 移动端循环备忘单条记录操作弹窗 */
const LoopMemoActionPopup = ({
  loopItemVisible,
  onClose,
  onDirectAddOne,
  onAddOneWithText,
  onEditLoopItem,
  onEditLoopComment,
  onDeleteLoopItem,
}: LoopMemoActionPopupProps) => (
  <Popup
    visible={!!loopItemVisible}
    onMaskClick={onClose}
    bodyStyle={{height: loopItemVisible?.loopText ? 290 : 190}}
    style={{zIndex: 1002}}
  >
    {loopItemVisible &&
      <div style={{padding: 10, display: 'flex', flexWrap: 'wrap', gap: 10}}>
        {loopItemVisible?.loopText &&
          <Button block onClick={() => onDirectAddOne(loopItemVisible)}>
            按当前备注直接 +1
          </Button>
        }
        {loopItemVisible?.loopText &&
          <Button block onClick={() => onAddOneWithText(loopItemVisible)}>
            +1 并按当前备注编辑
          </Button>
        }
        <Button block onClick={() => onEditLoopItem(loopItemVisible)}>
          编辑备注
        </Button>
        <Button block color="primary" onClick={() => onEditLoopComment(loopItemVisible)}>
          添加评论
        </Button>
        <Button
          block
          color="danger"
          onClick={() => onDeleteLoopItem(loopItemVisible.memoId, loopItemVisible.id)}
        >
          删除此项
        </Button>
        <div>创建时间:{loopItemVisible?.createTime}</div>
        {loopItemVisible?.updateTime && <div>更新时间:{loopItemVisible.updateTime}</div>}
      </div>
    }
  </Popup>
)

export default LoopMemoActionPopup
