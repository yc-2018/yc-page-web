import type {ReactNode} from 'react';

/** 动态背景资源类型。 */
export type BackgroundKind = 'css' | 'js';

/** 背景自身的明暗色调。 */
export type BackgroundTone = 'light' | 'dark';

/** 首页用于调整前景对比度的背景色调。 */
export type HomeBackgroundTone = BackgroundTone | 'image';

/** Public 清单中的单个动态背景。 */
export interface BackgroundManifestItem {
  source: string;
  kind: BackgroundKind;
  entry: string;
  name: string;
  description: string;
  tone: BackgroundTone;
  version: string | number;
  layers?: number;
  fallback?: string;
}

/** Public 动态背景清单。 */
export interface BackgroundManifest {
  version: number;
  items: BackgroundManifestItem[];
}

/** JavaScript 动态背景的性能参数。 */
export interface BackgroundMountOptions {
  reducedMotion: boolean;
  pixelRatio: number;
  quality: 'low' | 'balanced';
}

/** JavaScript 动态背景挂载后返回的生命周期控制器。 */
export interface BackgroundController {
  pause: () => void;
  resume: () => void;
  destroy: () => void;
}

/** Public JavaScript 动态背景模块的导出约定。 */
export interface BackgroundModule {
  mountBackground: (
    container: HTMLElement,
    options: BackgroundMountOptions,
  ) => BackgroundController;
}

/** 背景选择器参数。 */
export interface BackgroundPickerProps {
  enabled: boolean;
  value: string;
  imagePanel: ReactNode;
  onSelect: (source: string) => void;
}
