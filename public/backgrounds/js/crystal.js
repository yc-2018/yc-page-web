import * as THREE from '../vendor/three-0.185.1.module.min.js';
import {
  createPointerTracker,
  disposeObject3D,
  disposeRenderer,
  observeSceneSize,
  prepareRenderer,
} from './scene-utils.js';

const noise3dShader = `
  vec3 hashGradient3d(vec3 point) {
    point = fract(point * vec3(0.1031, 0.103, 0.0973));
    point += dot(point, point.yxz + 33.33);
    return normalize(fract((point.xxy + point.yxx) * point.zyx) * 2.0 - 1.0);
  }

  float noise3d(vec3 point) {
    vec3 cell = floor(point);
    vec3 local = fract(point);
    vec3 fade = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);
    float gradient = mix(
      mix(
        mix(
          dot(hashGradient3d(cell), local),
          dot(hashGradient3d(cell + vec3(1.0, 0.0, 0.0)), local - vec3(1.0, 0.0, 0.0)),
          fade.x
        ),
        mix(
          dot(hashGradient3d(cell + vec3(0.0, 1.0, 0.0)), local - vec3(0.0, 1.0, 0.0)),
          dot(hashGradient3d(cell + vec3(1.0, 1.0, 0.0)), local - vec3(1.0, 1.0, 0.0)),
          fade.x
        ),
        fade.y
      ),
      mix(
        mix(
          dot(hashGradient3d(cell + vec3(0.0, 0.0, 1.0)), local - vec3(0.0, 0.0, 1.0)),
          dot(hashGradient3d(cell + vec3(1.0, 0.0, 1.0)), local - vec3(1.0, 0.0, 1.0)),
          fade.x
        ),
        mix(
          dot(hashGradient3d(cell + vec3(0.0, 1.0, 1.0)), local - vec3(0.0, 1.0, 1.0)),
          dot(hashGradient3d(cell + vec3(1.0, 1.0, 1.0)), local - vec3(1.0, 1.0, 1.0)),
          fade.x
        ),
        fade.y
      ),
      fade.z
    );
    return gradient * 0.82 + 0.5;
  }

  float fbm3d(vec3 point) {
    float value = 0.0;
    float amplitude = 0.5;
    mat3 rotation = mat3(
      0.0, 0.8, 0.6,
      -0.8, 0.36, -0.48,
      -0.6, -0.48, 0.64
    );
    for (int octave = 0; octave < 5; octave++) {
      value += noise3d(point) * amplitude;
      point = rotation * point * 2.03 + vec3(17.1, 7.4, 13.7);
      amplitude *= 0.5;
    }
    return value;
  }
`;

const earthVertexShader = `
  varying vec3 vObjectPosition;
  varying vec3 vNormal;

  void main() {
    vObjectPosition = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  uniform vec3 uLightDirection;
  varying vec3 vObjectPosition;
  varying vec3 vNormal;
  ${noise3dShader}

  void main() {
    vec3 spherePosition = normalize(vObjectPosition);
    vec3 terrainPoint = spherePosition * 2.25;
    vec3 terrainWarp = vec3(
      noise3d(terrainPoint + vec3(4.1, 1.7, 8.3)),
      noise3d(terrainPoint + vec3(9.2, 3.4, 2.8)),
      noise3d(terrainPoint + vec3(1.3, 7.9, 5.6))
    ) - 0.5;
    float continent = fbm3d(terrainPoint + terrainWarp * 0.82);
    float land = smoothstep(0.45, 0.54, continent);
    float landDetail = fbm3d(spherePosition * 7.5 + 5.0);
    vec3 ocean = mix(vec3(0.012, 0.09, 0.24), vec3(0.015, 0.3, 0.54), spherePosition.y * 0.5 + 0.5);
    vec3 landColor = mix(vec3(0.11, 0.24, 0.07), vec3(0.44, 0.58, 0.18), landDetail);
    vec3 surface = mix(ocean, landColor, land);
    float ice = smoothstep(0.78, 0.94, abs(spherePosition.y));
    surface = mix(surface, vec3(0.86, 0.94, 1.0), ice * 0.82);
    float daylight = max(dot(normalize(vNormal), normalize(uLightDirection)), 0.0);
    float cityLights = smoothstep(0.7, 0.86, fbm3d(spherePosition * 19.0 + 9.0));
    surface += vec3(1.0, 0.44, 0.08) * cityLights * land * (1.0 - daylight) * 0.19;
    surface *= 0.27 + daylight * 0.94;
    gl_FragColor = vec4(surface, 1.0);
  }
`;

const cloudVertexShader = `
  varying vec3 vObjectPosition;

  void main() {
    vObjectPosition = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragmentShader = `
  uniform float uTime;
  varying vec3 vObjectPosition;
  ${noise3dShader}

  void main() {
    vec3 spherePosition = normalize(vObjectPosition);
    vec3 cloudPoint = spherePosition * 3.5 + vec3(uTime * 0.018, 0.0, 0.0);
    float cloud = fbm3d(cloudPoint);
    float opacity = smoothstep(0.5, 0.66, cloud) * 0.24;
    gl_FragColor = vec4(vec3(0.94, 0.98, 1.0), opacity);
  }
`;

const glowVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  varying vec2 vUv;

  void main() {
    float radius = length(vUv - 0.5) * 2.0;
    float innerFade = smoothstep(0.52, 0.76, radius);
    float outerFade = 1.0 - smoothstep(0.72, 1.0, radius);
    float opacity = innerFade * outerFade * 0.34;
    gl_FragColor = vec4(0.34, 0.72, 1.0, opacity);
  }
`;

/**
 * 挂载带云层和柔和大气光晕的程序化地球。
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
    uniforms: {uLightDirection: {value: new THREE.Vector3(0.72, 0.48, 1).normalize()}},
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
  scene.add(earthGroup);

  const atmosphereGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(7.8, 7.8),
    new THREE.ShaderMaterial({
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  atmosphereGlow.position.z = -0.65;
  scene.add(atmosphereGlow);

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
    earthGroup.rotation.y += delta * 0.055;
    earthGroup.rotation.x += (mouse.y * 0.22 - earthGroup.rotation.x) * 0.04;
    earthGroup.position.x += (mouse.x * 1.05 - earthGroup.position.x) * 0.035;
    earthGroup.position.y += (mouse.y * 0.6 - earthGroup.position.y) * 0.035;
    atmosphereGlow.position.x += (earthGroup.position.x - atmosphereGlow.position.x) * 0.12;
    atmosphereGlow.position.y += (earthGroup.position.y - atmosphereGlow.position.y) * 0.12;
    clouds.rotation.y += delta * 0.07;
    keyLight.position.x += (mouse.x * 7 - keyLight.position.x) * 0.055;
    keyLight.position.y += (mouse.y * 5 - keyLight.position.y) * 0.055;
    earthMaterial.uniforms.uLightDirection.value.set(
      0.72 + mouse.x * 0.42,
      0.48 + mouse.y * 0.36,
      1,
    ).normalize();
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
