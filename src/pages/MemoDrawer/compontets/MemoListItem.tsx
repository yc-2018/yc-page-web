import {Badge, Skeleton, Typography} from 'antd';
import ActionBtn from '@/pages/MemoDrawer/compontets/ActionBtn';
import HighlightKeyword from '@/utils/HighlightKeyword';
import {fDate} from '@/utils/DateUtils';
import type {MemoDrawerListItem, RenderLoopMemoDrawer} from '@/pages/MemoDrawer/types';

interface MemoListItemProps {
  /** 备忘数据 */
  memo: MemoDrawerListItem
  /** 搜索关键字 */
  keyword: string
  /** 搜索框是否为空 */
  searchEmpty: boolean
  /** 渲染循环子项二层抽屉 */
  renderLoopMemoDrawer: RenderLoopMemoDrawer
}

/**
 * 桌面端备忘列表项
 *
 * @param {object} memo 备忘数据
 * @param {string} keyword 搜索关键字
 * @param {boolean} searchEmpty 搜索框是否为空
 * @param {function} renderLoopMemoDrawer 渲染循环子项二层抽屉
 */
const MemoListItem = ({memo, keyword, searchEmpty, renderLoopMemoDrawer}: MemoListItemProps) => {
  const {
    id,
    loading,
    content,
    itemType,
    completed,
    updateTime,
    createTime,
    numberOfRecurrences,
    okTime,
    okText,
  } = memo;

  return (
    <div className={`memo-list-item ${completed ? 'finish' : ''}`}>
      <Skeleton avatar title={false} loading={loading} active>
        <div data-id={id}>
          <div
            data-action="see"
            style={{userSelect: 'auto'}}
            className={(itemType === 3 && !completed && 'gradientText') || undefined}
          >
            {!searchEmpty && <HighlightKeyword content={content ?? ''} keyword={keyword}/>}
            <Typography.Paragraph
              style={{color: '#999'}}
              ellipsis={{rows: 3, expandable: 'collapsible', symbol: b => b ? <b>收起</b> : <b>展开</b>}}
            >
              {content}
            </Typography.Paragraph>
          </div>

          {Boolean(completed) && okText && <div className="ok-text"><b>完成备注：</b>{okText}</div>}

          {/*————————————————备忘项 的功能按钮和 创建修改时间显示————————————————*/}
          <div style={{display: 'flex', marginTop: 10}}>
            {/*如果是循环待办显示循环按钮*/ itemType === 1 &&
              <Badge
                size="small"
                offset={[-13, -1]}
                count={numberOfRecurrences}
                overflowCount={9999}
                style={{backgroundColor: '#52c41a'}}
              >
                <ActionBtn actionName="addOne">循环+1</ActionBtn>
              </Badge>
            }
            <ActionBtn actionName="finish">{!!completed && '取消'}完成</ActionBtn>
            <ActionBtn actionName="edit" show={!completed}>编辑</ActionBtn> {/*完成了就不要显示编辑了*/}
            <ActionBtn actionName="delete">删除</ActionBtn>

            <div style={{fontSize: 11, height: 22, lineHeight: '25px', marginLeft: 10, color: '#999'}}>
              {createTime !== updateTime && itemType === 1 &&
                renderLoopMemoDrawer(memo)
              }
              &nbsp;&nbsp;
              创建:{fDate(createTime)}
              &nbsp;&nbsp;
              {createTime !== updateTime &&
                ` ${completed ? `完成:${fDate(okTime)}` : `修改:${fDate(updateTime)}`}`
              }
            </div>
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default MemoListItem;
