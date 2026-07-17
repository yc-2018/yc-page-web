import * as THREE from '../vendor/three-0.185.1.module.min.js';
import {
  createPointerTracker,
  disposeObject3D,
  disposeRenderer,
  observeSceneSize,
  prepareRenderer,
} from './scene-utils.js';

/**
 * 挂载会随鼠标产生视差的星空隧道。
 *
 * @param {HTMLElement} container 背景容器
 * @param {{reducedMotion: boolean, pixelRatio: number, quality: 'low' | 'balanced'}} options 性能参数
 */
export function mountBackground(container, options) {
  const reducedMotion = Boolean(options?.reducedMotion);
  const starCount = options?.quality === 'low' ? 900 : 1900;
  const renderer = new THREE.WebGLRenderer({antialias: false, powerPreference: 'high-performance'});
  prepareRenderer(renderer, container, options?.pixelRatio ?? 1);
  renderer.setClearColor(0x02040d, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02040d, 0.022);
  const camera = new THREE.PerspectiveCamera(64, 1, 0.1, 180);
  camera.position.set(0, 0, 8);

  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const color = new THREE.Color();
  for (let index = 0; index < starCount; index += 1) {
    const radius = 2.5 + Math.pow(Math.random(), 0.55) * 25;
    const angle = Math.random() * Math.PI * 2;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius;
    positions[index * 3 + 2] = -Math.random() * 150 + 9;
    color.setHSL(0.52 + Math.random() * 0.18, 0.45, 0.68 + Math.random() * 0.28);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: options?.quality === 'low' ? 0.14 : 0.11,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.92,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  const pointer = createPointerTracker(!reducedMotion);
  const stopObservingSize = observeSceneSize(container, camera, renderer);
  let animationFrame = 0;
  let running = false;
  let destroyed = false;
  let previousTime = performance.now();

  /** 绘制一帧星空。 */
  const render = time => {
    if (!running || destroyed) return;
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    const mouse = pointer.update();
    camera.position.x += (mouse.x * 2.4 - camera.position.x) * 0.035;
    camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.035;
    camera.rotation.z += (-mouse.x * 0.025 - camera.rotation.z) * 0.04;

    const speed = 9 * delta;
    for (let index = 2; index < positions.length; index += 3) {
      positions[index] += speed;
      if (positions[index] > 10) positions[index] = -140 - Math.random() * 15;
    }
    positionAttribute.needsUpdate = true;
    stars.rotation.z += delta * 0.018;
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(render);
  };

  /** 暂停逐帧渲染。 */
  const pause = () => {
    running = false;
    cancelAnimationFrame(animationFrame);
  };

  /** 恢复逐帧渲染。 */
  const resume = () => {
    if (destroyed) return;
    if (reducedMotion) {
      renderer.render(scene, camera);
      return;
    }
    if (running) return;
    running = true;
    previousTime = performance.now();
    animationFrame = requestAnimationFrame(render);
  };

  renderer.render(scene, camera);
  resume();

  return {
    pause,
    resume,
    /** 销毁星空场景和全部浏览器资源。 */
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
