import {useState} from 'react'
import {Badge, Tabs} from 'antd-mobile'
import Memo from './Memo'
import EnglishMemo from './EnglishMemo'
import DeviceUsageLogs from './DeviceUsageLogs'

type MemoType = 0 | 1 | 2 | 3 | 5 | 6 | 7

type IncompleteCounts = Record<MemoType, number | null>

type MemoTab = {
  title: string
  type: MemoType
}

const tabList: MemoTab[] = [
  {title: '普通', type: 0},
  {title: '循环', type: 1},
  {title: '长期', type: 2},
  {title: '紧急', type: 3},
  {title: '日记', type: 5},
  {title: '工作', type: 6},
  {title: '其他', type: 7},
]

const Memos = () => {
  const [incompleteCounts, setIncompleteCounts] = useState<IncompleteCounts>({
    0: null,
    1: null,
    2: null,
    3: null,
    5: null,
    6: null,
    7: null,
  }) // 显示计数
  const [changeType, setChangeType] = useState(-1) // 新增或修改的数据不在目前待办，就重置对应类型
  const [refresh, setRefresh] = useState(true) // 切换标签时驱动当前页签刷新

  return (
    <Tabs defaultActiveKey="普通" className="█tabsContainer" onChange={() => setRefresh(!refresh)}>
      {tabList.map(tab =>
        <Tabs.Tab title={<Badge content={incompleteCounts[tab.type]}>{tab.title}</Badge>} key={tab.title}>
          <Memo
            type={tab.type}
            changeType={changeType}
            setChangeType={setChangeType}
            setIncompleteCounts={setIncompleteCounts}
          />
      </Tabs.Tab>)}

      <Tabs.Tab title="英语" key="英语">
        <EnglishMemo/>
      </Tabs.Tab>

      <Tabs.Tab title="设备" key="设备">
        <DeviceUsageLogs/>
      </Tabs.Tab>
    </Tabs>
  )
}

export default Memos
