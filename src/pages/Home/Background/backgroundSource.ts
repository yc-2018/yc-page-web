import type {BackgroundManifest, BackgroundManifestItem} from './types';

export const DEFAULT_BACKGROUND_SOURCE = '/Default-wallpaper.jpg';

const CSS_SOURCE_PATTERN = /^css:\/\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const JS_SOURCE_PATTERN = /^js:\/\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HTTP_IMAGE_PATTERN = /^https?:\/\/[^\s]+$/i;

let manifestPromise: Promise<BackgroundManifest> | undefined;

/** 判断字符串是否为内置 CSS 或 JavaScript 背景协议。 */
export const isDynamicBackgroundSource = (source: string) =>
  CSS_SOURCE_PATTERN.test(source) || JS_SOURCE_PATTERN.test(source);

/** 判断字符串是否为允许使用的图片背景地址。 */
export const isImageBackgroundSource = (source: string) =>
  HTTP_IMAGE_PATTERN.test(source) || (source.startsWith('/') && !source.startsWith('//'));

/** 判断背景清单入口是否为安全的同源相对路径。 */
const isSafeEntry = (entry: unknown): entry is string => {
  if (typeof entry !== 'string' || !entry || entry.includes('\\') || entry.includes(':')) return false;
  if (entry.startsWith('/')) return false;
  return !entry.split('/').some(part => !part || part === '..');
};

/** 校验并规范 Public 背景清单。 */
const parseManifest = (value: unknown): BackgroundManifest => {
  if (!value || typeof value !== 'object') throw new Error('动态背景清单格式错误');
  const manifest = value as Partial<BackgroundManifest>;
  if (!Number.isInteger(manifest.version) || !Array.isArray(manifest.items)) {
    throw new Error('动态背景清单缺少 version 或 items');
  }

  const sourceSet = new Set<string>();
  const items = manifest.items.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`动态背景清单第 ${index + 1} 项格式错误`);
    const sourcePattern = item.kind === 'css' ? CSS_SOURCE_PATTERN : JS_SOURCE_PATTERN;
    if (!['css', 'js'].includes(item.kind) || !sourcePattern.test(item.source)) {
      throw new Error(`动态背景清单第 ${index + 1} 项协议错误`);
    }
    if (sourceSet.has(item.source)) throw new Error(`动态背景协议重复：${item.source}`);
    sourceSet.add(item.source);
    if (!isSafeEntry(item.entry)) throw new Error(`动态背景入口不安全：${item.source}`);
    if (!item.name?.trim() || !item.description?.trim()) throw new Error(`动态背景说明不完整：${item.source}`);
    if (!['light', 'dark'].includes(item.tone)) throw new Error(`动态背景色调错误：${item.source}`);
    if (!['string', 'number'].includes(typeof item.version) || !String(item.version)) {
      throw new Error(`动态背景版本错误：${item.source}`);
    }
    if (item.kind === 'css' && (!Number.isInteger(item.layers) || item.layers! < 0 || item.layers! > 20)) {
      throw new Error(`动态背景层数错误：${item.source}`);
    }
    if (item.kind === 'js' && typeof item.fallback !== 'string') {
      throw new Error(`动态背景缺少降级配置：${item.source}`);
    }
    return item as BackgroundManifestItem;
  });

  const itemMap = new Map(items.map(item => [item.source, item]));
  items.filter(item => item.kind === 'js').forEach(item => {
    const fallback = itemMap.get(item.fallback!);
    if (fallback?.kind !== 'css') throw new Error(`动态背景降级配置无效：${item.source}`);
  });

  return {version: manifest.version!, items};
};

/** 获取兼容 Vite 相对部署路径的 Public 背景根地址。 */
export const getBackgroundRootUrl = () => {
  const appBaseUrl = new URL(import.meta.env.BASE_URL, window.location.href);
  return new URL('backgrounds/', appBaseUrl);
};

/** 加载并缓存 Public 动态背景清单，失败后允许再次重试。 */
export const loadBackgroundManifest = async () => {
  if (!manifestPromise) {
    const manifestUrl = new URL('manifest.json', getBackgroundRootUrl());
    manifestPromise = fetch(manifestUrl, {cache: 'no-cache'})
      .then(response => {
        if (!response.ok) throw new Error(`动态背景清单请求失败：${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then(parseManifest)
      .catch(error => {
        manifestPromise = undefined;
        throw error;
      });
  }
  return manifestPromise;
};

/** 将已校验的相对入口转换为带版本号的同源真实地址。 */
export const resolveBackgroundEntryUrl = (item: BackgroundManifestItem) => {
  if (!isSafeEntry(item.entry)) throw new Error(`动态背景入口不安全：${item.source}`);
  const rootUrl = getBackgroundRootUrl();
  const entryUrl = new URL(item.entry, rootUrl);
  if (entryUrl.origin !== window.location.origin || !entryUrl.href.startsWith(rootUrl.href)) {
    throw new Error(`动态背景入口越界：${item.source}`);
  }
  entryUrl.searchParams.set('v', String(item.version));
  return entryUrl.href;
};
