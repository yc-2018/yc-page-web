/**
 * 创建不会拦截页面交互的鼠标位置跟踪器。
 *
 * @param {boolean} enabled 是否启用鼠标跟踪
 */
export function createPointerTracker(enabled) {
  const target = {x: 0, y: 0};
  const current = {x: 0, y: 0};

  /** 记录归一化鼠标坐标。 */
  const onPointerMove = event => {
    target.x = event.clientX / Math.max(window.innerWidth, 1) * 2 - 1;
    target.y = -(event.clientY / Math.max(window.innerHeight, 1) * 2 - 1);
  };

  if (enabled) window.addEventListener('pointermove', onPointerMove, {passive: true});

  return {
    current,
    /** 让当前坐标平滑靠近目标坐标。 */
    update(easing = 0.055) {
      current.x += (target.x - current.x) * easing;
      current.y += (target.y - current.y) * easing;
      return current;
    },
    /** 移除鼠标监听器。 */
    destroy() {
      if (enabled) window.removeEventListener('pointermove', onPointerMove);
    },
  };
}

/**
 * 监听容器尺寸并更新 Three.js 相机与渲染器。
 *
 * @param {HTMLElement} container 背景容器
 * @param {import('../vendor/three-0.185.1.module.min.js').PerspectiveCamera} camera 透视相机
 * @param {import('../vendor/three-0.185.1.module.min.js').WebGLRenderer} renderer 渲染器
 */
export function observeSceneSize(container, camera, renderer) {
  /** 根据背景容器大小更新画布。 */
  const resize = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  resize();
  if (typeof ResizeObserver === 'undefined') {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  return () => resizeObserver.disconnect();
}

/** 释放 Object3D 中持有的几何体、材质和纹理资源。 */
export function disposeObject3D(root) {
  root.traverse(object => {
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material) continue;
      for (const value of Object.values(material)) value?.isTexture && value.dispose();
      material.dispose?.();
    }
  });
}

/** 释放渲染器并从背景容器中移除画布。 */
export function disposeRenderer(renderer) {
  renderer.renderLists?.dispose();
  renderer.dispose();
  renderer.forceContextLoss();
  renderer.domElement.remove();
}

/** 为 WebGL 画布设置背景通用属性。 */
export function prepareRenderer(renderer, container, pixelRatio) {
  renderer.setPixelRatio(Math.max(0.75, pixelRatio));
  renderer.domElement.className = 'yc-background-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);
}
