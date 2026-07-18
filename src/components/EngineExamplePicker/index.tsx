import {useMemo, useState} from 'react';
import {CheckOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Empty, Input, List, Modal, Typography} from 'antd';
import type {FC} from 'react';
import type {ISearchEngineExample} from '@/interface/ISearchEngines';

interface Props {
  open: boolean;                              // 是否打开选择示例弹窗
  examples: ISearchEngineExample[];           // 可选择的静态示例
  onCancel: () => void;                       // 关闭弹窗
  onSelect: (example: ISearchEngineExample) => void; // 选中示例
}

/**
 * 搜索引擎与首页链接共用的示例选择弹窗
 *
 * @author Yc
 * @since 2026/7/18
 */
const EngineExamplePicker: FC<Props> = ({open, examples, onCancel, onSelect}) => {
  const [keyword, setKeyword] = useState(''); // 示例筛选关键词

  const filteredExamples = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return examples;
    return examples.filter(example =>
      [example.name, example.engineUrl, example.directUrl]
        .some(value => value?.toLowerCase().includes(normalizedKeyword))
    );
  }, [examples, keyword]);

  /** 关闭弹窗并清空筛选条件 */
  const closePicker = () => {
    setKeyword('');
    onCancel();
  };

  /** 回传选择结果并关闭弹窗 */
  const selectExample = (example: ISearchEngineExample) => {
    onSelect(example);
    closePicker();
  };

  return (
    <Modal
      title="选择示例"
      open={open}
      footer={null}
      width={640}
      onCancel={closePicker}
    >
      <Input
        allowClear
        value={keyword}
        prefix={<SearchOutlined/>}
        placeholder="搜索名称或URL"
        onChange={event => setKeyword(event.target.value)}
      />
      <List
        size="small"
        rowKey={example => example.engineUrl}
        dataSource={filteredExamples}
        locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="没有匹配的示例"/>}}
        style={{maxHeight: 'min(480px, 60vh)', marginTop: 12, overflowY: 'auto'}}
        renderItem={example => (
          <List.Item
            actions={[
              <Button
                key="select"
                type="link"
                icon={<CheckOutlined/>}
                onClick={() => selectExample(example)}
              >
                选用
              </Button>
            ]}
          >
            <List.Item.Meta
              title={example.name}
              description={
                <Typography.Text
                  type="secondary"
                  ellipsis={{tooltip: example.engineUrl}}
                  style={{display: 'block', maxWidth: 480}}
                >
                  {example.engineUrl}
                </Typography.Text>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default EngineExamplePicker;
