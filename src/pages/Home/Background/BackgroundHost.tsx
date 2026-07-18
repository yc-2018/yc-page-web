import {useCallback, useEffect, useRef, useState} from 'react';
import {
  DEFAULT_BACKGROUND_SOURCE,
  isDynamicBackgroundSource,
  isImageBackgroundSource,
  loadBackgroundManifest,
  resolveBackgroundEntryUrl,
} from './backgroundSource';
import type {
  BackgroundController,
  BackgroundManifestItem,
  BackgroundModule,
  HomeBackgroundTone,
} from './types';
import styles from './Background.module.css';

interface BackgroundHostProps {
  source: string;
  onToneChange?: (tone: HomeBackgroundTone) => void;
  onError?: (message: string) => void;
}

type RenderState =
  | {kind: 'loading'}
  | {kind: 'image'; source: string}
  | {kind: 'dynamic'; item: BackgroundManifestItem};

/** 判断 JavaScript 背景模块是否实现了完整生命周期接口。 */
const isBackgroundModule = (value: unknown): value is BackgroundModule => {
  if (!value || typeof value !== 'object') return false;
  return typeof (value as Partial<BackgroundModule>).mountBackground === 'function';
};

/** 判断背景控制器是否可以被首页安全管理。 */
const isBackgroundController = (value: unknown): value is BackgroundController => {
  if (!value || typeof value !== 'object') return false;
  const controller = value as Partial<BackgroundController>;
  return ['pause', 'resume', 'destroy'].every(method => typeof controller[method as keyof BackgroundController] === 'function');
};

/**
 * 统一渲染图片、Public CSS 与 Public JavaScript 背景。
 *
 * 动态背景切换时会主动移除样式或销毁 JavaScript 生命周期控制器。
 */
const BackgroundHost = ({source, onToneChange, onError}: BackgroundHostProps) => {
  const [effectiveSource, setEffectiveSource] = useState(source);
  const [renderState, setRenderState] = useState<RenderState>(() =>
    isImageBackgroundSource(source) ? {kind: 'image', source} : {kind: 'loading'},
  );
  const [ready, setReady] = useState(isImageBackgroundSource(source));
  const mountRef = useRef<HTMLDivElement>(null);
  const failedSourcesRef = useRef(new Set<string>());
  const onToneChangeRef = useRef(onToneChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onToneChangeRef.current = onToneChange;
    onErrorRef.current = onError;
  }, [onError, onToneChange]);

  useEffect(() => {
    failedSourcesRef.current.clear();
    setEffectiveSource(source);
  }, [source]);

  /** 当前背景失败时切换到清单降级背景或默认壁纸。 */
  const applyFallback = useCallback((message: string, fallback?: string) => {
    failedSourcesRef.current.add(effectiveSource);
    const canUseFallback = fallback
      && fallback !== effectiveSource
      && !failedSourcesRef.current.has(fallback);
    const nextSource = canUseFallback ? fallback : DEFAULT_BACKGROUND_SOURCE;
    onErrorRef.current?.(`${message}，已切换到备用背景`);
    setEffectiveSource(nextSource);
  }, [effectiveSource]);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    if (isImageBackgroundSource(effectiveSource)) {
      setRenderState({kind: 'image', source: effectiveSource});
      setReady(true);
      onToneChangeRef.current?.('image');
      return () => {
        cancelled = true;
      };
    }

    if (!isDynamicBackgroundSource(effectiveSource)) {
      applyFallback('背景地址格式不受支持');
      return () => {
        cancelled = true;
      };
    }

    setRenderState({kind: 'loading'});
    loadBackgroundManifest().then(manifest => {
      if (cancelled) return;
      const item = manifest.items.find(background => background.source === effectiveSource);
      if (!item) return applyFallback(`没有找到动态背景 ${effectiveSource}`);
      setRenderState({kind: 'dynamic', item});
      onToneChangeRef.current?.(item.tone);
    }).catch(error => {
      if (cancelled) return;
      const message = error instanceof Error ? error.message : '动态背景清单加载失败';
      applyFallback(message);
    });

    return () => {
      cancelled = true;
    };
  }, [applyFallback, effectiveSource]);

  useEffect(() => {
    if (
      renderState.kind !== 'dynamic'
      || renderState.item.source !== effectiveSource
      || !mountRef.current
    ) return;
    const item = renderState.item;
    const mountContainer = mountRef.current;
    let cancelled = false;
    let controller: BackgroundController | undefined;
    let styleElement: HTMLLinkElement | undefined;
    let removeVisibilityListener: (() => void) | undefined;

    setReady(false);
    if (item.kind === 'css') {
      styleElement = document.createElement('link');
      styleElement.rel = 'stylesheet';
      styleElement.href = resolveBackgroundEntryUrl(item);
      styleElement.dataset.backgroundSource = item.source;
      styleElement.onload = () => !cancelled && setReady(true);
      styleElement.onerror = () => !cancelled && applyFallback(`CSS 背景加载失败：${item.name}`);
      document.head.appendChild(styleElement);
    } else {
      const mountJavaScriptBackground = async () => {
        try {
          const entryUrl = resolveBackgroundEntryUrl(item);
          const backgroundModule: unknown = await import(/* @vite-ignore */ entryUrl);
          if (cancelled) return;
          if (!isBackgroundModule(backgroundModule)) throw new Error('模块没有导出 mountBackground');
          const lowQuality = (navigator.hardwareConcurrency || 8) <= 4;
          const mountedController: unknown = backgroundModule.mountBackground(mountContainer, {
            reducedMotion: false,
            pixelRatio: Math.min(window.devicePixelRatio || 1, lowQuality ? 1 : 1.5),
            quality: lowQuality ? 'low' : 'balanced',
          });
          if (!isBackgroundController(mountedController)) throw new Error('模块没有返回完整生命周期控制器');
          controller = mountedController;

          /** 根据标签页可见性暂停或恢复 WebGL 场景。 */
          const updateVisibility = () => document.hidden ? controller?.pause() : controller?.resume();
          document.addEventListener('visibilitychange', updateVisibility);
          removeVisibilityListener = () => document.removeEventListener('visibilitychange', updateVisibility);
          updateVisibility();
          setReady(true);
        } catch (error) {
          if (cancelled) return;
          const detail = error instanceof Error ? error.message : '未知错误';
          applyFallback(`3D 背景 ${item.name} 加载失败：${detail}`, item.fallback);
        }
      };
      void mountJavaScriptBackground();
    }

    return () => {
      cancelled = true;
      styleElement?.remove();
      removeVisibilityListener?.();
      controller?.destroy();
      mountContainer.replaceChildren();
    };
  }, [applyFallback, renderState]);

  const imageStyle = renderState.kind === 'image'
    ? {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.4)), url(${JSON.stringify(renderState.source)})`,
      }
    : undefined;
  const dynamicItem = renderState.kind === 'dynamic' ? renderState.item : undefined;
  const layerCount = dynamicItem?.kind === 'css' ? dynamicItem.layers ?? 0 : 0;

  return (
    <div className={styles.host} aria-hidden="true">
      {renderState.kind === 'image' && <div className={styles.image} style={imageStyle}/>} 
      <div
        className={`${styles.scene} yc-background-scene`}
        data-background-source={dynamicItem?.source}
        data-background-tone={dynamicItem?.tone}
      >
        {Array.from({length: layerCount}, (_, index) =>
          <i key={index} className="yc-background-layer"/>,
        )}
        <div ref={mountRef} className="yc-background-mount"/>
      </div>
      {!ready && <div className={styles.loading}/>} 
    </div>
  );
};

export default BackgroundHost;
