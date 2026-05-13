import {Button, Dropdown, Image, Popover, Space} from 'antd';
import {CaretDownOutlined, SyncOutlined} from '@ant-design/icons';
import {fDate} from '@/utils/DateUtils';
import {thumbUrl} from '@/utils/urlUtils.js';
import type {
  DeleteLoopMemoItemHandler,
  LoadLoopMemoItems,
  MemoLoopItem,
  UpdateLoopMemoItemHandler,
} from '@/pages/MemoDrawer/types';

interface LoopMemoDropdownProps {
  /** 循环备忘主项 ID */
  memoId: number
  /** 循环子项列表 */
  loopTimeList: MemoLoopItem[]
  /** 循环子项总数 */
  loopTimeTotal: number
  /** 循环子项加载状态 */
  loopTimeWebLoading: boolean
  /** 加载循环子项 */
  getLoopMemoTimeData: LoadLoopMemoItems
  /** 重置循环子项列表 */
  resetLoopMemoTimeData: () => void
  /** 修改循环子项 */
  updateLoopMemo: UpdateLoopMemoItemHandler
  /** 删除循环子项 */
  deleteLoopMemo: DeleteLoopMemoItemHandler
}

/**
 * 循环备忘子项下拉列表
 *
 * @param {number} memoId 循环备忘主项 ID
 * @param {Array} loopTimeList 循环子项列表
 * @param {number} loopTimeTotal 循环子项总数
 * @param {boolean} loopTimeWebLoading 循环子项加载状态
 * @param {function} getLoopMemoTimeData 加载循环子项
 * @param {function} resetLoopMemoTimeData 重置循环子项列表
 * @param {function} updateLoopMemo 修改循环子项
 * @param {function} deleteLoopMemo 删除循环子项
 */
const LoopMemoDropdown = ({
  memoId,
  loopTimeList,
  loopTimeTotal,
  loopTimeWebLoading,
  getLoopMemoTimeData,
  resetLoopMemoTimeData,
  updateLoopMemo,
  deleteLoopMemo,
}: LoopMemoDropdownProps) => {
  /** 渲染循环备忘子项图片缩略图，并让预览从被点击的原图开始 */
  const renderLoopMemoImages = (imgArr: string) => {
    const imageUrls = imgArr.split(',').filter(Boolean); // 循环备忘图片原图地址列表
    if (!imageUrls.length) return null;

    return (
      <Image.PreviewGroup items={imageUrls}>
        {imageUrls.map(url =>
          <Image
            width={40}
            height={40}
            src={thumbUrl(url)}
            preview={{src: url}}
            key={url}
          />
        )}
      </Image.PreviewGroup>
    )
  }

  /** 渲染循环子项列表底部状态 */
  const renderListFooter = () => {
    if (loopTimeWebLoading) return <><SyncOutlined spin/> 正在加载中</>;
    if (loopTimeTotal <= loopTimeList.length) return <>到底了</>;
    return <Button block size="small" onClick={() => getLoopMemoTimeData(memoId)}>继续加载</Button>;
  }

  return (
    <Dropdown
      trigger={['click']}  // 点击展开
      onOpenChange={async open => {
        if (open) {        // 展开时加载数据
          await getLoopMemoTimeData(memoId)
        } else {           // 关闭时清空数据
          resetLoopMemoTimeData()
        }
      }}
      popupRender={() =>
        <div className="ant-dropdown-menu dropdown-menu gun">
          {loopTimeList?.map(({id, memoId: itemMemoId, memoDate, loopText, imgArr, createTime, updateTime}, index) =>
            <Popover
              key={id ?? index}
              content={
                <div>
                  <Space>
                    <Button onClick={() => id && itemMemoId && updateLoopMemo(itemMemoId, id, loopText, imgArr)}>
                      修改备注
                    </Button>
                    <Button onClick={() => id && itemMemoId && deleteLoopMemo(itemMemoId, id)}>
                      删除此项
                    </Button>
                  </Space>
                  <div style={{color: '#999'}}>
                    <div>创建时间：{createTime}</div>
                    {updateTime && <div>更新时间：{updateTime}</div>}
                  </div>
                </div>
              }
              title="操作"
              trigger="click"
            >
              <div className="memoLoopListItem" style={{cursor: 'pointer'}}>
                <div>{index + 1}：{fDate(memoDate)}</div>
                {loopText && <div className="loop-text">{loopText}</div>}
                <div
                  style={{display: 'flex', gap: 5}}
                  onClick={event => event.stopPropagation()}
                >
                  {imgArr &&
                    renderLoopMemoImages(imgArr)
                  }
                </div>
              </div>
            </Popover>
          )}
          {renderListFooter()}
        </div>
      }
    >
      <span className="pointer">
        &nbsp;&nbsp;&nbsp;<CaretDownOutlined/>循环<CaretDownOutlined/>
      </span>
    </Dropdown>
  )
}

export default LoopMemoDropdown;
