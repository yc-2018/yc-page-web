import {
  FireOutlined,
  FlagOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
  ReadOutlined,
  TagsOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import {Badge, Segmented} from 'antd';

interface MemoTypeSegmentedProps {
  /** 当前备忘类型 */
  value?: number | null
  /** 备忘类型变化回调 */
  onChange: (value: number) => void
  /** 未完成数量映射，传入时显示角标 */
  counts?: Record<string | number, number | undefined>
  /** Segmented 尺寸 */
  size?: 'small' | 'middle' | 'large'
  /** 是否撑满父容器 */
  block?: boolean
  /** 自定义样式类 */
  className?: string
}

const memoTypeOptions = [
  {label: '普通', value: 0, icon: <FolderOpenOutlined/>, tone: 'blue'},
  {label: '工作', value: 6, icon: <ToolOutlined/>, tone: 'green'},
  {label: '紧急', value: 3, icon: <FireOutlined/>, tone: 'red'},
  {label: '循环', value: 1, icon: <HistoryOutlined/>, tone: 'purple'},
  {label: '长期', value: 2, icon: <FlagOutlined/>, tone: 'gold'},
  {label: '日记', value: 5, icon: <ReadOutlined/>, tone: 'cyan'},
  {label: '其他', value: 7, icon: <TagsOutlined/>, tone: 'gray'},
]

/** 桌面备忘类型分段选择器 */
const MemoTypeSegmented = ({value, onChange, counts, size = 'middle', block = false, className}: MemoTypeSegmentedProps) => {
  const activeTone = memoTypeOptions.find(item => item.value === value)?.tone ?? 'blue'; // 当前类型色
  const rootClassName = `memo-type-segmented memo-type-segmented-${activeTone}${className ? ` ${className}` : ''}`; // 根样式类
  const options = memoTypeOptions.map(item => {
    const label =
      <span className="memo-type-segment-label">
        <span className="memo-type-segment-icon">{item.icon}</span>
        <span>{item.label}</span>
      </span>

    return {
      value: item.value,
      label: counts ?
        <Badge
          size="small"
          offset={[8, -4]}
          title="未完成的条数"
          overflowCount={9999}
          count={counts[item.value]}
        >
          {label}
        </Badge> :
        label,
    }
  })

  return (
    <Segmented
      className={rootClassName}
      size={size}
      block={block}
      options={options}
      value={value ?? undefined}
      onChange={nextValue => onChange(Number(nextValue))}
    />
  )
}

export default MemoTypeSegmented;
