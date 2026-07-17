import {useEffect, useState} from 'react';
import {Alert, Button, Empty, Spin, Tabs} from 'antd';
import {BgColorsOutlined, CodeOutlined, PictureOutlined} from '@ant-design/icons';
import {loadBackgroundManifest} from './backgroundSource';
import type {BackgroundKind, BackgroundManifestItem, BackgroundPickerProps} from './types';
import styles from './Background.module.css';

/** 按类型展示动态背景卡片。 */
const PresetList = ({
  kind,
  items,
  value,
  onSelect,
}: {
  kind: BackgroundKind;
  items: BackgroundManifestItem[];
  value: string;
  onSelect: (source: string) => void;
}) => {
  const presetList = items.filter(item => item.kind === kind);
  if (!presetList.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无背景"/>;

  return (
    <div className={styles.presetGrid}>
      {presetList.map(item =>
        <Button
          key={item.source}
          className={styles.presetButton}
          type={value === item.source ? 'primary' : 'default'}
          onClick={() => onSelect(item.source)}
        >
          <span className={styles.presetName}>
            <i className={styles.toneDot} data-tone={item.tone}/>
            {item.name}
          </span>
          <small>{item.description}</small>
        </Button>,
      )}
    </div>
  );
};

/** 根据 Public 清单展示图片、CSS 和 3D 背景选项。 */
const BackgroundPicker = ({enabled, value, imagePanel, onSelect}: BackgroundPickerProps) => {
  const [items, setItems] = useState<BackgroundManifestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!enabled || items.length) return;
    let timeoutId: number | undefined;
    setLoading(true);
    setError(undefined);
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error('动态背景清单加载超时')), 8000);
    });
    Promise.race([loadBackgroundManifest(), timeoutPromise])
      .then(manifest => setItems(manifest.items))
      .catch(reason => setError(reason instanceof Error ? reason.message : '动态背景清单加载失败'))
      .finally(() => {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        setLoading(false);
      });
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [enabled, items.length]);

  const dynamicPanel = (kind: BackgroundKind) => {
    if (loading) return <div className={styles.pickerStatus}><Spin size="small"/> 正在读取背景清单...</div>;
    if (error) return <Alert type="warning" showIcon message={error}/>;
    return <PresetList kind={kind} items={items} value={value} onSelect={onSelect}/>;
  };

  const activeTab = value.startsWith('css://') ? 'css' : value.startsWith('js://') ? 'js' : 'image';
  const tabItems = [
    {key: 'image', label: <><PictureOutlined/> 图片</>, children: imagePanel},
    {key: 'css', label: <><BgColorsOutlined/> CSS</>, children: dynamicPanel('css')},
    {key: 'js', label: <><CodeOutlined/> 3D</>, children: dynamicPanel('js')},
  ];

  return (
    <div className={styles.picker}>
      <Tabs key={activeTab} defaultActiveKey={activeTab} size="small" items={tabItems}/>
    </div>
  );
};

export default BackgroundPicker;
