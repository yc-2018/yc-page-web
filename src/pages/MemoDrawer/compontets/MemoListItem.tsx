import {Badge, Dropdown, Skeleton, Typography} from 'antd';
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined} from '@ant-design/icons';
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
  /** 是否为最后操作的备忘项 */
  lastAction: boolean
}

/**
 * 桌面端备忘列表项
 *
 * @param {object} memo 备忘数据
 * @param {string} keyword 搜索关键字
 * @param {boolean} searchEmpty 搜索框是否为空
 * @param {function} renderLoopMemoDrawer 渲染循环子项二层抽屉
 * @param {boolean} lastAction 是否为最后操作的备忘项
 */
const MemoListItem = ({memo, keyword, searchEmpty, renderLoopMemoDrawer, lastAction}: MemoListItemProps) => {
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
    <div className={`memo-list-item ${completed ? 'finish' : ''} ${lastAction ? 'memo-last-action' : ''}`}>
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
          <div style={{display: 'flex', marginTop: 10, gap: 10, alignItems: 'center'}}>
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
            <ActionBtn actionName="see" actionTrigger="click" iconOnly title="查看">
              <EyeOutlined/>
            </ActionBtn>
            <ActionBtn actionName="edit" show={!completed} iconOnly title="编辑">
              <EditOutlined/>
            </ActionBtn> {/*完成了就不要显示编辑了*/}
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              getPopupContainer={triggerNode => (triggerNode.closest('[data-id]') as HTMLElement | null) ?? document.body}
              menu={{
                items: [
                  {
                    key: 'finish',
                    label: (
                      <span data-action="finish" className="memo-menu-action">
                        {completed ? <CloseOutlined/> : <CheckOutlined/>}
                        <span>{completed ? '取消完成' : '完成'}</span>
                      </span>
                    )
                  },
                  {
                    key: 'delete',
                    danger: true,
                    label: (
                      <span data-action="delete" className="memo-menu-action">
                        <DeleteOutlined/>
                        <span>删除</span>
                      </span>
                    )
                  }
                ]
              }}
            >
              <div
                className="memo-action-more"
                title="更多操作"
                aria-label="更多操作"
              >
                <MoreOutlined/>
              </div>
            </Dropdown>

              {createTime !== updateTime && itemType === 1 &&   // 循环待办才显示
                  renderLoopMemoDrawer(memo)
              }

              <div style={{fontSize: 10, color: '#999'}}>
                  <div>创建:{fDate(createTime)}</div>
                  {createTime !== updateTime &&
                      <div>{completed ? `完成:${fDate(okTime)}` : `修改:${fDate(updateTime)}`}</div>
                  }
              </div>
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default MemoListItem;
