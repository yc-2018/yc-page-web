import * as THREE from '../vendor/three-0.185.1.module.min.js';
import {
  createPointerTracker,
  disposeObject3D,
  disposeRenderer,
  observeSceneSize,
  prepareRenderer,
} from './scene-utils.js';

/**
 * 挂载可被鼠标扰动的空间粒子波浪。
 *
 * @param {HTMLElement} container 背景容器
 * @param {{reducedMotion: boolean, pixelRatio: number, quality: 'low' | 'balanced'}} options 性能参数
 */
export function mountBackground(container, options) {
  const reducedMotion = Boolean(options?.reducedMotion);
  const columns = options?.quality === 'low' ? 44 : 68;
  const rows = options?.quality === 'low' ? 28 : 44;
  const pointCount = columns * rows;
  const renderer = new THREE.WebGLRenderer({antialias: false, powerPreference: 'high-performance'});
  prepareRenderer(renderer, container, options?.pixelRatio ?? 1);
  renderer.setClearColor(0x030817, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x030817, 13, 36);
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 80);
  camera.position.set(0, 9.5, 16);
  camera.lookAt(0, 0, -3);

  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  const baseX = new Float32Array(pointCount);
  const baseZ = new Float32Array(pointCount);
  const color = new THREE.Color();
  let pointIndex = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = (column / (columns - 1) - 0.5) * 24;
      const z = (row / (rows - 1) - 0.5) * 18;
      baseX[pointIndex] = x;
      baseZ[pointIndex] = z;
      positions[pointIndex * 3] = x;
      positions[pointIndex * 3 + 2] = z;
      color.setHSL(0.53 + row / rows * 0.18, 0.72, 0.44 + column / columns * 0.1);
      colors[pointIndex * 3] = color.r;
      colors[pointIndex * 3 + 1] = color.g;
      colors[pointIndex * 3 + 2] = color.b;
      pointIndex += 1;
    }
  }

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: options?.quality === 'low' ? 0.11 : 0.09,
    transparent: true,
    opacity: 0.72,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const wave = new THREE.Points(geometry, material);
  wave.rotation.x = -0.12;
  scene.add(wave);

  const pointer = createPointerTracker(!reducedMotion);
  const stopObservingSize = observeSceneSize(container, camera, renderer);
  let animationFrame = 0;
  let running = false;
  let destroyed = false;
  let previousTime = performance.now();
  let elapsedTime = 0;

  /** 更新粒子高度并绘制一帧。 */
  const drawFrame = time => {
    if (!running || destroyed) return;
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    elapsedTime += delta;
    const mouse = pointer.update(0.06);
    const mouseX = mouse.x * 10;
    const mouseZ = -mouse.y * 7;

    for (let index = 0; index < pointCount; index += 1) {
      const x = baseX[index];
      const z = baseZ[index];
      const distance = Math.hypot(x - mouseX, z - mouseZ);
      const baseWave = Math.sin(x * 0.72 + elapsedTime * 1.7) * 0.42
        + Math.cos(z * 0.82 - elapsedTime * 1.25) * 0.34;
      const pointerWave = Math.exp(-distance * 0.38) * Math.sin(distance * 2.2 - elapsedTime * 5.2) * 1.55;
      positions[index * 3 + 1] = baseWave + pointerWave;
    }
    positionAttribute.needsUpdate = true;
    camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.025;
    camera.lookAt(mouse.x * 0.8, mouse.y * 0.5, -3);
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(drawFrame);
  };

  /** 绘制减少动态效果时使用的静态波浪。 */
  const drawStaticFrame = () => {
    for (let index = 0; index < pointCount; index += 1) {
      positions[index * 3 + 1] = Math.sin(baseX[index] * 0.72) * 0.42 + Math.cos(baseZ[index] * 0.82) * 0.34;
    }
    positionAttribute.needsUpdate = true;
    renderer.render(scene, camera);
  };

  const pause = () => {
    running = false;
    cancelAnimationFrame(animationFrame);
  };

  const resume = () => {
    if (destroyed) return;
    if (reducedMotion) return drawStaticFrame();
    if (running) return;
    running = true;
    previousTime = performance.now();
    animationFrame = requestAnimationFrame(drawFrame);
  };

  drawStaticFrame();
  resume();

  return {
    pause,
    resume,
    /** 销毁粒子波浪场景和全部浏览器资源。 */
    destroy() {
      destroyed = true;
      pause();
      pointer.destroy();
      stopObservingSize();
      disposeObject3D(scene);
      disposeRenderer(renderer);
    },
  };
}
