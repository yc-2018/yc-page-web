import * as THREE from '../vendor/three-0.185.1.module.min.js';
import {
  createPointerTracker,
  disposeObject3D,
  disposeRenderer,
  observeSceneSize,
  prepareRenderer,
} from './scene-utils.js';

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  uniform vec3 uLightDirection;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x),
      local.y
    );
  }

  void main() {
    vec2 coordinate = vUv * vec2(5.0, 3.0);
    float continent = noise(coordinate + vec2(0.0, uTime * 0.008));
    continent = mix(continent, noise(coordinate * 2.2 + 8.0), 0.32);
    float land = smoothstep(0.5, 0.63, continent);
    vec3 ocean = mix(vec3(0.015, 0.12, 0.3), vec3(0.02, 0.3, 0.52), vUv.y);
    vec3 landColor = mix(vec3(0.14, 0.28, 0.08), vec3(0.42, 0.58, 0.19), noise(coordinate * 1.7));
    vec3 surface = mix(ocean, landColor, land);
    float daylight = max(dot(normalize(vNormal), normalize(uLightDirection)), 0.0);
    float cityLights = smoothstep(0.76, 0.9, noise(coordinate * 18.0));
    surface += vec3(1.0, 0.42, 0.08) * cityLights * (1.0 - daylight) * 0.18;
    surface *= 0.28 + daylight * 0.92;
    gl_FragColor = vec4(surface, 1.0);
  }
`;

const cloudVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(41.7, 289.3))) * 15731.743);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x),
      local.y
    );
  }

  void main() {
    float cloud = noise(vUv * vec2(8.0, 4.0) + vec2(uTime * 0.012, 0.0));
    cloud = mix(cloud, noise(vUv * 17.0 - uTime * 0.018), 0.32);
    float opacity = smoothstep(0.57, 0.76, cloud) * 0.26;
    gl_FragColor = vec4(vec3(0.94, 0.98, 1.0), opacity);
  }
`;

/**
 * 挂载带云层和大气光晕的程序化地球。
 *
 * @param {HTMLElement} container 背景容器
 * @param {{reducedMotion: boolean, pixelRatio: number, quality: 'low' | 'balanced'}} options 性能参数
 */
export function mountBackground(container, options) {
  const reducedMotion = Boolean(options?.reducedMotion);
  const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: 'high-performance'});
  prepareRenderer(renderer, container, options?.pixelRatio ?? 1);
  renderer.setClearColor(0x02030a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02030a, 0.035);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
  camera.position.set(0, 0.2, 11);

  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = -0.22;
  const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uLightDirection: {value: new THREE.Vector3(0.72, 0.48, 1).normalize()},
      uTime: {value: 0},
    },
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
  });
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(2.55, options?.quality === 'low' ? 40 : 64, options?.quality === 'low' ? 28 : 48),
    earthMaterial,
  );
  earthGroup.add(earth);

  const cloudMaterial = new THREE.ShaderMaterial({
    uniforms: {uTime: {value: 0}},
    vertexShader: cloudVertexShader,
    fragmentShader: cloudFragmentShader,
    transparent: true,
    depthWrite: false,
  });
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(2.59, 48, 32), cloudMaterial);
  earthGroup.add(clouds);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.78, 48, 32),
    new THREE.MeshBasicMaterial({
      color: 0x47baff,
      transparent: true,
      opacity: 0.17,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  earthGroup.add(atmosphere);
  scene.add(earthGroup);

  const ambientLight = new THREE.AmbientLight(0x40558d, 1.4);
  const keyLight = new THREE.PointLight(0xfff1cc, 38, 32);
  keyLight.position.set(5, 4, 8);
  const fillLight = new THREE.PointLight(0x4e8cff, 18, 26);
  fillLight.position.set(-5, -3, 5);
  scene.add(ambientLight, keyLight, fillLight);

  const dustCount = options?.quality === 'low' ? 220 : 460;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let index = 0; index < dustCount; index += 1) {
    const radius = 5 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 2;
    dustPositions[index * 3] = Math.cos(angle) * radius;
    dustPositions[index * 3 + 1] = (Math.random() - 0.5) * 18;
    dustPositions[index * 3 + 2] = Math.sin(angle) * radius - 4;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.PointsMaterial({
    color: 0x9adfff,
    size: 0.05,
    transparent: true,
    opacity: 0.48,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dust);

  const pointer = createPointerTracker(!reducedMotion);
  const stopObservingSize = observeSceneSize(container, camera, renderer);
  let animationFrame = 0;
  let running = false;
  let destroyed = false;
  let previousTime = performance.now();
  let elapsedTime = 0;

  /** 更新地球自转、云层和鼠标光照并绘制一帧。 */
  const drawFrame = time => {
    if (!running || destroyed) return;
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    elapsedTime += delta;
    const mouse = pointer.update(0.045);
    earthGroup.rotation.y += delta * 0.16;
    earthGroup.rotation.x += (mouse.y * 0.22 - earthGroup.rotation.x) * 0.04;
    earthGroup.position.x += (mouse.x * 1.05 - earthGroup.position.x) * 0.035;
    earthGroup.position.y += (mouse.y * 0.6 - earthGroup.position.y) * 0.035;
    clouds.rotation.y += delta * 0.19;
    keyLight.position.x += (mouse.x * 7 - keyLight.position.x) * 0.055;
    keyLight.position.y += (mouse.y * 5 - keyLight.position.y) * 0.055;
    earthMaterial.uniforms.uLightDirection.value.set(
      0.72 + mouse.x * 0.42,
      0.48 + mouse.y * 0.36,
      1,
    ).normalize();
    earthMaterial.uniforms.uTime.value = elapsedTime;
    cloudMaterial.uniforms.uTime.value = elapsedTime;
    dust.rotation.y -= delta * 0.014;
    dust.rotation.x += delta * 0.005;
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(drawFrame);
  };

  const pause = () => {
    running = false;
    cancelAnimationFrame(animationFrame);
  };

  const resume = () => {
    if (destroyed) return;
    if (reducedMotion) {
      renderer.render(scene, camera);
      return;
    }
    if (running) return;
    running = true;
    previousTime = performance.now();
    animationFrame = requestAnimationFrame(drawFrame);
  };

  renderer.render(scene, camera);
  resume();

  return {
    pause,
    resume,
    /** 销毁地球场景和全部浏览器资源。 */
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
