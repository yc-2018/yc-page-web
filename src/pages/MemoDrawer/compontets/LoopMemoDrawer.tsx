import {useState} from 'react';
import {Button, Drawer, Empty, Image, Space, Spin, Tag, Typography} from 'antd';
import {HistoryOutlined, SyncOutlined} from '@ant-design/icons';
import {fDate} from '@/utils/DateUtils';
import {thumbUrl} from '@/utils/urlUtils.js';
import type {
  DeleteLoopMemoItemHandler,
  LoadLoopMemoItems,
  MemoDrawerListItem,
  MemoLoopItem,
  UpdateLoopMemoItemHandler,
} from '@/pages/MemoDrawer/types';

interface LoopMemoDrawerProps {
  /** 循环备忘主项 */
  memo: MemoDrawerListItem
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
 * 循环备忘子项二层抽屉
 *
 * @param memo 循环备忘主项
 * @param loopTimeList 循环子项列表
 * @param loopTimeTotal 循环子项总数
 * @param loopTimeWebLoading 循环子项加载状态
 * @param getLoopMemoTimeData 加载循环子项
 * @param resetLoopMemoTimeData 重置循环子项列表
 * @param updateLoopMemo 修改循环子项
 * @param deleteLoopMemo 删除循环子项
 */
const LoopMemoDrawer = ({
  memo,
  loopTimeList,
  loopTimeTotal,
  loopTimeWebLoading,
  getLoopMemoTimeData,
  resetLoopMemoTimeData,
  updateLoopMemo,
  deleteLoopMemo,
}: LoopMemoDrawerProps) => {
  const [open, setOpen] = useState(false); // 二层抽屉显示状态
  const memoId = memo.id; // 循环备忘主项 ID

  /** 打开二层抽屉并从第一页加载循环记录 */
  const openDrawer = async () => {
    if (!memoId) return;
    resetLoopMemoTimeData()
    setOpen(true)
    await getLoopMemoTimeData(memoId, 1, true)
  }

  /** 关闭二层抽屉并清理循环记录 */
  const closeDrawer = () => {
    setOpen(false)
    resetLoopMemoTimeData()
  }

  /** 渲染循环备忘子项图片缩略图，并让预览从被点击的原图开始 */
  const renderLoopMemoImages = (imgArr: string) => {
    const imageUrls = imgArr.split(',').filter(Boolean); // 循环备忘图片原图地址列表
    if (!imageUrls.length) return null;

    return (
      <Image.PreviewGroup items={imageUrls}>
        <div className="loop-memo-img-list">
          {imageUrls.map(url =>
            <Image
              width={58}
              height={58}
              src={thumbUrl(url)}
              preview={{src: url}}
              key={url}
            />
          )}
        </div>
      </Image.PreviewGroup>
    )
  }

  /** 渲染循环子项列表底部状态 */
  const renderListFooter = () => {
    if (loopTimeWebLoading) return <div className="loop-memo-footer"><SyncOutlined spin/> 正在加载中</div>;
    if (!memoId) return null;
    if (!loopTimeList.length) return null;
    if (loopTimeTotal <= loopTimeList.length) return <div className="loop-memo-footer">到底了</div>;
    return (
      <Button block size="small" onClick={() => getLoopMemoTimeData(memoId)}>
        继续加载
      </Button>
    );
  }

  return (
    <>
      <Button
        type="link"
        size="small"
        icon={<HistoryOutlined/>}
        className="loop-drawer-trigger"
        onClick={openDrawer}
      >
        循环记录
      </Button>

      <Drawer
        title={
          <Space>
            <span>循环记录</span>
            <Tag color="green">{loopTimeTotal || loopTimeList.length} 条</Tag>
          </Space>
        }
        placement="right"
        size={520}
        open={open}
        onClose={closeDrawer}
        mask
        className="loop-memo-drawer"
      >
        <div className="loop-memo-main-record">
          <Typography.Paragraph
            className="loop-memo-main-content"
            ellipsis={{rows: 4, expandable: 'collapsible', symbol: expanded => expanded ? '收起' : '展开'}}
          >
            {memo.content}
          </Typography.Paragraph>
        </div>

        <Spin spinning={loopTimeWebLoading && !loopTimeList.length}>
          {!loopTimeWebLoading && !loopTimeList.length ?
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无循环记录"/>
            :
            <div className="loop-memo-record-list">
              {loopTimeList.map((loopMemo, index) =>
                <div key={loopMemo.id ?? index} className="loop-memo-record">
                  <div className="loop-memo-record-head">
                    <div>
                      <div className="loop-memo-date">{index + 1}：{fDate(loopMemo.memoDate)}</div>
                    </div>
                    <Space>
                      <Button
                        size="small"
                        onClick={() => loopMemo.id && loopMemo.memoId && updateLoopMemo(loopMemo)}
                      >
                        修改
                      </Button>
                      <Button
                        size="small"
                        danger
                        onClick={() => loopMemo.id && loopMemo.memoId && deleteLoopMemo(loopMemo.memoId, loopMemo.id)}
                      >
                        删除
                      </Button>
                    </Space>
                  </div>

                  {loopMemo.loopText && <div className="loop-text loop-memo-text">{loopMemo.loopText}</div>}
                  {loopMemo.imgArr && renderLoopMemoImages(loopMemo.imgArr)}
                </div>
              )}
              {renderListFooter()}
            </div>
          }
        </Spin>
      </Drawer>
    </>
  )
}

export default LoopMemoDrawer;
