import * as THREE from '../vendor/three-0.185.1.module.min.js';
import {
  disposeObject3D,
  disposeRenderer,
  observeSceneSize,
  prepareRenderer,
} from './scene-utils.js';

const waterVertexShader = `
  varying vec2 vUv;
  varying vec2 vPosition;
  varying float vWave;

  uniform float uTime;
  uniform int uRippleCount;
  uniform vec4 uRipples[16];

  void main() {
    vUv = uv;
    vPosition = position.xy;
    float height = 0.0;
    for (int index = 0; index < 16; index++) {
      if (index >= uRippleCount) break;
      vec4 ripple = uRipples[index];
      float distanceToRipple = distance(position.xy, ripple.xy);
      float radius = ripple.z * (2.1 + ripple.w * 0.72) + 0.08;
      float ringDistance = distanceToRipple - radius;
      float lifeFade = 1.0 - smoothstep(0.48, 1.0, ripple.z);
      float envelope = exp(-ringDistance * ringDistance * 13.0) * exp(-ripple.z * 0.7) * lifeFade;
      height += sin(ringDistance * 8.0 - ripple.z * 5.0) * envelope * ripple.w * 0.092;
      float wake = exp(-distanceToRipple * distanceToRipple * 0.22) * exp(-ripple.z * 1.2) * lifeFade;
      float clickStrength = smoothstep(0.8, 1.2, ripple.w);
      height += sin(distanceToRipple * 4.5 - ripple.z * 3.0) * wake * ripple.w * clickStrength * 0.018;
    }
    float ambient = sin(position.x * 0.34 + uTime * 0.34) * cos(position.y * 0.29 - uTime * 0.25) * 0.012;
    vWave = height + ambient;
    vec3 displaced = position + vec3(0.0, 0.0, vWave);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const waterFragmentShader = `
  uniform float uTime;
  uniform int uRippleCount;
  uniform vec4 uRipples[16];
  varying vec2 vUv;
  varying vec2 vPosition;
  varying float vWave;

  float rippleHeight(vec2 point) {
    float height = 0.0;
    for (int index = 0; index < 16; index++) {
      if (index >= uRippleCount) break;
      vec4 ripple = uRipples[index];
      float distanceToRipple = distance(point, ripple.xy);
      float radius = ripple.z * (2.1 + ripple.w * 0.72) + 0.08;
      float ringDistance = distanceToRipple - radius;
      float lifeFade = 1.0 - smoothstep(0.48, 1.0, ripple.z);
      float envelope = exp(-ringDistance * ringDistance * 13.0) * exp(-ripple.z * 0.7) * lifeFade;
      height += sin(ringDistance * 8.0 - ripple.z * 5.0) * envelope * ripple.w * 0.092;
      float wake = exp(-distanceToRipple * distanceToRipple * 0.22) * exp(-ripple.z * 1.2) * lifeFade;
      float clickStrength = smoothstep(0.8, 1.2, ripple.w);
      height += sin(distanceToRipple * 4.5 - ripple.z * 3.0) * wake * ripple.w * clickStrength * 0.018;
    }
    return height;
  }

  void main() {
    float broadWave = sin(vPosition.x * 0.34 + uTime * 0.34)
      * cos(vPosition.y * 0.29 - uTime * 0.25);
    float fineWave = sin(vPosition.x * 1.8 + uTime * 0.42)
      * sin(vPosition.y * 2.2 - uTime * 0.33);
    float sampleStep = 0.055;
    float heightLeft = rippleHeight(vPosition - vec2(sampleStep, 0.0));
    float heightRight = rippleHeight(vPosition + vec2(sampleStep, 0.0));
    float heightDown = rippleHeight(vPosition - vec2(0.0, sampleStep));
    float heightUp = rippleHeight(vPosition + vec2(0.0, sampleStep));
    vec3 surfaceNormal = normalize(vec3(
      (heightLeft - heightRight) / (sampleStep * 2.0),
      (heightDown - heightUp) / (sampleStep * 2.0),
      0.72
    ));
    vec3 lightDirection = normalize(vec3(-0.35, 0.48, 0.82));
    vec3 halfDirection = normalize(lightDirection + vec3(0.0, 0.0, 1.0));
    float diffuse = dot(surfaceNormal, lightDirection) * 0.5 + 0.5;
    float reflection = pow(max(dot(surfaceNormal, halfDirection), 0.0), 42.0);
    float caustic = smoothstep(0.68, 0.96, broadWave * 0.32 + fineWave * 0.18 + 0.68);
    vec3 deepWater = vec3(0.08, 0.28, 0.31);
    vec3 shallowWater = vec3(0.18, 0.5, 0.43);
    vec3 color = mix(deepWater, shallowWater, vUv.y * 0.34 + broadWave * 0.08 + 0.2);
    color *= 0.84 + diffuse * 0.22;
    float crest = smoothstep(0.01, 0.065, abs(vWave));
    color += vec3(0.20, 0.42, 0.36) * crest * 0.22;
    color += vec3(0.68, 0.86, 0.67) * reflection * (0.14 + crest * 0.62);
    color += vec3(0.34, 0.46, 0.23) * caustic * 0.16;
    float shimmer = pow(max(0.0, sin(vPosition.x * 2.7 + sin(vPosition.y * 0.8) + uTime * 1.1)
      * sin(vPosition.y * 2.1 - cos(vPosition.x * 0.6) - uTime * 0.7)), 12.0);
    color += vec3(0.24, 0.48, 0.46) * shimmer * 0.035;
    float vignette = 1.0 - smoothstep(0.35, 0.75, distance(vUv, vec2(0.5)));
    color *= 0.98 + vignette * 0.08;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const TAU = Math.PI * 2;

function randomRange(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

function shortestAngleDifference(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

const fishVertexShader = `
  uniform float uTime;
  uniform float uPhase;
  uniform float uFlee;
  uniform float uTurn;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 bentPosition = position;
    float tailWeight = pow(1.0 - uv.x, 1.85);
    float turnWeight = pow(1.0 - uv.x, 1.35);
    bentPosition.y += sin(uTime * (2.8 + uFlee * 1.2) + uPhase + uv.x * 4.0)
      * tailWeight * (0.095 + uFlee * 0.015);
    bentPosition.y -= uTurn * turnWeight * (0.15 + uFlee * 0.025);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(bentPosition, 1.0);
  }
`;

const fishFragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    vec4 fish = texture2D(uTexture, vUv);
    if (fish.a < 0.02) discard;
    float sunlight = 0.98 + smoothstep(0.1, 0.72, vUv.y) * 0.06;
    vec3 vividColor = fish.rgb * vec3(1.03, 1.0, 0.96);
    gl_FragColor = vec4(vividColor * sunlight, fish.a);
  }
`;

function createFishTexture(palette, seed) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  let randomState = seed * 2654435761 >>> 0;
  const random = () => {
    randomState = randomState * 1664525 + 1013904223 >>> 0;
    return randomState / 4294967296;
  };
  const traceBody = () => {
    context.beginPath();
    context.moveTo(225, 64);
    context.bezierCurveTo(216, 43, 188, 28, 153, 26);
    context.bezierCurveTo(112, 24, 78, 33, 53, 47);
    context.bezierCurveTo(46, 51, 42, 57, 41, 64);
    context.bezierCurveTo(42, 71, 46, 77, 53, 81);
    context.bezierCurveTo(78, 95, 112, 104, 153, 102);
    context.bezierCurveTo(188, 100, 216, 85, 225, 64);
    context.closePath();
  };

  context.clearRect(0, 0, 256, 128);

  const tailGradient = context.createLinearGradient(6, 64, 58, 64);
  tailGradient.addColorStop(0, `${palette.fin}88`);
  tailGradient.addColorStop(0.58, `${palette.fin}d8`);
  tailGradient.addColorStop(1, palette.shadow);
  context.fillStyle = tailGradient;
  context.beginPath();
  context.moveTo(57, 46);
  context.bezierCurveTo(42, 41, 24, 25, 8, 28);
  context.bezierCurveTo(12, 43, 24, 57, 38, 64);
  context.bezierCurveTo(24, 71, 12, 85, 8, 100);
  context.bezierCurveTo(24, 103, 42, 87, 57, 82);
  context.bezierCurveTo(50, 70, 50, 58, 57, 46);
  context.fill();

  const bodyGradient = context.createLinearGradient(35, 35, 216, 91);
  bodyGradient.addColorStop(0, palette.shadow);
  bodyGradient.addColorStop(0.42, palette.body);
  bodyGradient.addColorStop(0.72, palette.belly);
  bodyGradient.addColorStop(1, palette.shadow);
  traceBody();
  context.shadowColor = 'rgba(83, 48, 24, 0.18)';
  context.shadowBlur = 6;
  context.fillStyle = bodyGradient;
  context.fill();
  context.shadowBlur = 0;

  context.save();
  traceBody();
  context.clip();
  const bodyHighlight = context.createRadialGradient(148, 43, 3, 148, 54, 92);
  bodyHighlight.addColorStop(0, 'rgba(255, 246, 204, 0.22)');
  bodyHighlight.addColorStop(1, 'rgba(255, 246, 204, 0)');
  context.fillStyle = bodyHighlight;
  context.fillRect(35, 25, 190, 78);
  context.restore();

  context.save();
  traceBody();
  context.clip();
  for (let index = 0; index < 5; index += 1) {
    const x = 65 + random() * 115;
    const y = 45 + random() * 38;
    const radiusX = 12 + random() * 24;
    const radiusY = 6 + random() * 13;
    context.save();
    context.translate(x, y);
    context.rotate((random() - 0.5) * 0.8);
    const markGradient = context.createRadialGradient(0, 0, 1, 0, 0, radiusX);
    markGradient.addColorStop(0, palette.pattern);
    markGradient.addColorStop(0.62, `${palette.pattern}cc`);
    markGradient.addColorStop(1, `${palette.pattern}00`);
    context.globalAlpha = 0.56 + random() * 0.29;
    context.fillStyle = markGradient;
    context.beginPath();
    context.moveTo(radiusX, 0);
    context.bezierCurveTo(radiusX * 0.55, -radiusY, -radiusX * 0.35, -radiusY * 0.8, -radiusX, -radiusY * 0.1);
    context.bezierCurveTo(-radiusX * 0.55, radiusY, radiusX * 0.35, radiusY * 0.8, radiusX, 0);
    context.closePath();
    context.fill();
    context.restore();
  }
  context.strokeStyle = 'rgba(226, 239, 218, 0.08)';
  context.lineWidth = 1;
  for (let x = 72; x < 184; x += 10) {
    for (let y = 48; y < 82; y += 9) {
      context.beginPath();
      context.arc(x + (y % 18 ? 5 : 0), y, 5, -1.1, 1.1);
      context.stroke();
    }
  }
  context.restore();

  // 俯视时只保留贴近头部两侧的暗色眼缘，避免形成正面的卡通眼睛。
  context.strokeStyle = 'rgba(43, 33, 21, 0.64)';
  context.lineWidth = 1.8;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(201, 40.5);
  context.quadraticCurveTo(205, 41.5, 207, 44);
  context.stroke();
  context.beginPath();
  context.moveTo(201, 87.5);
  context.quadraticCurveTo(205, 86.5, 207, 84);
  context.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, 128, 128);
  const gradient = context.createLinearGradient(0, 20, 0, 128);
  gradient.addColorStop(0, 'rgba(124, 187, 103, 0.74)');
  gradient.addColorStop(1, 'rgba(27, 91, 67, 0.3)');
  context.strokeStyle = gradient;
  context.lineWidth = 4;
  context.lineCap = 'round';
  for (let index = 0; index < 14; index += 1) {
    const x = 8 + index * 8;
    context.beginPath();
    context.moveTo(64, 72);
    context.quadraticCurveTo(x - 8 + (index % 3) * 6, 56, x - 3 + (index % 4) * 4, 24 + (index % 5) * 10);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createRockTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  context.fillStyle = 'rgba(24, 57, 52, 0.42)';
  context.beginPath();
  context.ellipse(64, 76, 46, 20, -0.12, 0, TAU);
  context.fill();
  const gradient = context.createLinearGradient(44, 28, 88, 88);
  gradient.addColorStop(0, '#b6b48c');
  gradient.addColorStop(0.42, '#7d866d');
  gradient.addColorStop(1, '#495b55');
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(20, 67);
  context.bezierCurveTo(25, 40, 46, 22, 76, 27);
  context.bezierCurveTo(105, 32, 112, 62, 92, 83);
  context.bezierCurveTo(63, 103, 27, 95, 20, 67);
  context.fill();
  context.strokeStyle = 'rgba(224, 220, 166, 0.28)';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(31, 59);
  context.bezierCurveTo(48, 35, 70, 30, 91, 42);
  context.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createFinTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(112, 64, 12, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.32)');
  gradient.addColorStop(0.48, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
  context.fillStyle = gradient;
  context.shadowColor = 'rgba(255, 255, 255, 0.35)';
  context.shadowBlur = 4;
  context.beginPath();
  if (type === 'tail') {
    context.moveTo(118, 64);
    context.bezierCurveTo(91, 54, 65, 19, 14, 15);
    context.bezierCurveTo(26, 41, 48, 55, 66, 64);
    context.bezierCurveTo(48, 73, 26, 87, 14, 113);
    context.bezierCurveTo(65, 109, 91, 74, 118, 64);
  } else if (type === 'pectoral') {
    context.moveTo(116, 67);
    context.bezierCurveTo(87, 55, 55, 25, 16, 19);
    context.bezierCurveTo(26, 52, 64, 83, 116, 67);
  } else {
    context.moveTo(8, 75);
    context.bezierCurveTo(37, 42, 84, 39, 120, 69);
    context.bezierCurveTo(82, 62, 39, 68, 8, 75);
  }
  context.closePath();
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Mounts a top-down pond with free-swimming fish and pointer ripples.
 * @param {HTMLElement} container
 * @param {{reducedMotion: boolean, pixelRatio: number, quality: 'low' | 'balanced'}} options
 */
export function mountBackground(container, options) {
  const reducedMotion = Boolean(options?.reducedMotion);
  const lowQuality = options?.quality === 'low';
  const renderer = new THREE.WebGLRenderer({antialias: !lowQuality, powerPreference: 'high-performance'});
  prepareRenderer(renderer, container, options?.pixelRatio ?? 1);
  renderer.setClearColor(0x17606a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 0, 18);

  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: {value: 0},
      uRippleCount: {value: 0},
      uRipples: {value: Array.from({length: 16}, () => new THREE.Vector4())},
    },
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    depthWrite: false,
  });
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 40, lowQuality ? 48 : 96, lowQuality ? 32 : 64),
    waterMaterial,
  );
  water.position.z = -0.5;
  scene.add(water);

  const grassGeometry = new THREE.PlaneGeometry(2.7, 2.2, 1, 1);
  const grassTexture = createGrassTexture();
  const grassMaterial = new THREE.MeshBasicMaterial({
    map: grassTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.52,
  });
  const grassPositions = [[-8.2, -5.1, -0.2], [-3.8, -5.8, -0.1], [3.4, -5.5, -0.15], [8.1, -4.8, -0.05]];
  const grass = grassPositions.map(([x, y, z], index) => {
    const mesh = new THREE.Mesh(grassGeometry, grassMaterial);
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(0.75 + (index % 2) * 0.25);
    mesh.rotation.z = (index - 1.5) * 0.18;
    scene.add(mesh);
    return mesh;
  });

  const rockTexture = createRockTexture();
  const rockGeometry = new THREE.PlaneGeometry(2.1, 1.45);
  const rockMaterial = new THREE.MeshBasicMaterial({map: rockTexture, transparent: true, depthWrite: false, opacity: 0.78});
  const rocks = [[-6.3, -5.4, 0.9], [-1.2, -6.1, 0.65], [5.8, -5.2, 1.05], [8.8, -3.7, 0.62]].map(([x, y, scale], index) => {
    const mesh = new THREE.Mesh(rockGeometry, rockMaterial);
    mesh.position.set(x, y, -0.12 + index * 0.01);
    mesh.scale.set(scale, scale * (0.78 + index % 2 * 0.12), 1);
    mesh.rotation.z = index * 0.47;
    scene.add(mesh);
    return mesh;
  });

  const fishGeometry = new THREE.PlaneGeometry(1.55, 0.72, lowQuality ? 10 : 20, 1);
  const finTextures = {
    pectoral: createFinTexture('pectoral'),
  };
  const finGeometries = {
    pectoral: new THREE.PlaneGeometry(0.36, 0.27),
  };
  const fishPalettes = [
    {body: '#d1c7aa', belly: '#f1dfb9', shadow: '#8d7052', pattern: '#c84b32', fin: '#d98563'},
    {body: '#d58e25', belly: '#f0c960', shadow: '#8a571b', pattern: '#c8472e', fin: '#d99a48'},
    {body: '#d8ad38', belly: '#f1d875', shadow: '#92702a', pattern: '#b95d2b', fin: '#d7ad52'},
    {body: '#cf6640', belly: '#eebd70', shadow: '#873b2a', pattern: '#d5a02f', fin: '#d78459'},
    {body: '#d9cfb4', belly: '#f3e8c9', shadow: '#957653', pattern: '#d26c37', fin: '#dba06a'},
  ];
  const fishTextures = [];

  const fishCount = lowQuality ? 10 : 17;
  const fishes = [];
  for (let index = 0; index < fishCount; index += 1) {
    const palette = fishPalettes[index % fishPalettes.length];
    const root = new THREE.Group();
    const texture = createFishTexture(palette, index + 11);
    fishTextures.push(texture);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {value: texture},
        uTime: {value: 0},
        uPhase: {value: Math.random() * TAU},
        uFlee: {value: 0},
        uTurn: {value: 0},
      },
      vertexShader: fishVertexShader,
      fragmentShader: fishFragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const visual = new THREE.Mesh(fishGeometry, material);
    visual.renderOrder = 2;
    root.add(visual);

    const createFinMaterial = (map, opacity) => new THREE.MeshBasicMaterial({
      map,
      color: palette.fin,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const finMaterials = {
      pectoral: createFinMaterial(finTextures.pectoral, 0.46),
    };

    const pectoralLeftPivot = new THREE.Group();
    pectoralLeftPivot.position.set(0.2, 0.14, 0.005);
    const pectoralLeft = new THREE.Mesh(finGeometries.pectoral, finMaterials.pectoral);
    pectoralLeft.position.set(-0.17, 0.035, 0);
    pectoralLeft.renderOrder = 3;
    pectoralLeftPivot.add(pectoralLeft);
    root.add(pectoralLeftPivot);
    const pectoralRightPivot = new THREE.Group();
    pectoralRightPivot.position.set(0.2, -0.14, 0.005);
    const pectoralRight = new THREE.Mesh(finGeometries.pectoral, finMaterials.pectoral);
    pectoralRight.position.set(-0.17, -0.035, 0);
    pectoralRight.scale.y = -1;
    pectoralRight.renderOrder = 3;
    pectoralRightPivot.add(pectoralRight);
    root.add(pectoralRightPivot);

    const size = randomRange(0.72, 1.18);
    root.scale.setScalar(size);
    root.position.set(randomRange(-10, 10), randomRange(-5.7, 5.7), randomRange(-0.02, 0.2));
    const heading = Math.random() * TAU;
    root.rotation.z = heading;
    scene.add(root);
    fishes.push({
      root,
      visual,
      material,
      finMaterials,
      pectoralLeftPivot,
      pectoralRightPivot,
      pectoralLeft,
      pectoralRight,
      heading,
      wanderHeading: heading,
      wanderTimer: randomRange(0.4, 2.5),
      speed: randomRange(0.42, 0.78),
      phase: Math.random() * TAU,
      size,
    });
  }

  const ripples = [];
  const pointerWorld = new THREE.Vector2(1000, 1000);
  let pointerActiveUntil = 0;
  let lastRippleTime = 0;
  const lastPointerPosition = new THREE.Vector2(1000, 1000);
  const lastRipplePosition = new THREE.Vector2(1000, 1000);

  const eventToWorld = event => {
    const bounds = container.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) return null;
    const normalizedX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    const normalizedY = -((event.clientY - bounds.top) / bounds.height * 2 - 1);
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
    return new THREE.Vector2(
      normalizedX * visibleHeight * camera.aspect * 0.5,
      normalizedY * visibleHeight * 0.5,
    );
  };

  const addRipple = (position, strength = 1) => {
    ripples.push({position: position.clone(), age: 0, strength});
    while (ripples.length > (lowQuality ? 8 : 16)) {
      ripples.shift();
    }
  };

  const onPointerMove = event => {
    const position = eventToWorld(event);
    if (!position) return;
    pointerWorld.copy(position);
    pointerActiveUntil = performance.now() + 1150;
    if (lastPointerPosition.x < 900) {
      const movement = position.clone().sub(lastPointerPosition);
      const now = performance.now();
      const distanceFromLastRipple = position.distanceToSquared(lastRipplePosition);
      if (movement.lengthSq() > 0.0001 && now - lastRippleTime > 90
        && distanceFromLastRipple > 0.065) {
        addRipple(position, 0.62);
        lastRippleTime = now;
        lastRipplePosition.copy(position);
      }
    } else {
      lastRipplePosition.copy(position);
    }
    lastPointerPosition.copy(position);
  };

  const onPointerDown = event => {
    if (event.button !== 0) return;
    const position = eventToWorld(event);
    if (!position) return;
    pointerWorld.copy(position);
    pointerActiveUntil = performance.now() + 1500;
    addRipple(position, 1.45);
    const delayedRipple = window.setTimeout(() => {
      delayedRippleTimers.delete(delayedRipple);
      if (!destroyed) addRipple(position, 0.9);
    }, 120);
    delayedRippleTimers.add(delayedRipple);
  };

  const delayedRippleTimers = new Set();
  if (!reducedMotion) {
    window.addEventListener('pointermove', onPointerMove, {passive: true});
    window.addEventListener('pointerdown', onPointerDown, {passive: true});
  }

  const stopObservingSize = observeSceneSize(container, camera, renderer);
  const separation = new THREE.Vector2();
  const desired = new THREE.Vector2();
  const away = new THREE.Vector2();
  let animationFrame = 0;
  let running = false;
  let destroyed = false;
  let previousTime = performance.now();
  let elapsedTime = 0;

  const updateFish = (fish, fishIndex, delta, now) => {
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
    const horizontalLimit = Math.max(5, visibleHeight * camera.aspect * 0.5 + 0.8);
    const verticalLimit = visibleHeight * 0.5 + 0.8;
    fish.wanderTimer -= delta;
    if (fish.wanderTimer <= 0) {
      fish.wanderHeading += randomRange(-1.05, 1.05);
      fish.wanderTimer = randomRange(0.8, 3.1);
    }

    desired.set(Math.cos(fish.wanderHeading), Math.sin(fish.wanderHeading));
    if (Math.abs(fish.root.position.x) > horizontalLimit - 1.4) {
      desired.x += fish.root.position.x > 0 ? -2.2 : 2.2;
    }
    if (Math.abs(fish.root.position.y) > verticalLimit - 1.15) {
      desired.y += fish.root.position.y > 0 ? -2.2 : 2.2;
    }

    separation.set(0, 0);
    for (let otherIndex = 0; otherIndex < fishes.length; otherIndex += 1) {
      if (otherIndex === fishIndex) continue;
      const other = fishes[otherIndex];
      const differenceX = fish.root.position.x - other.root.position.x;
      const differenceY = fish.root.position.y - other.root.position.y;
      const distanceSquared = differenceX * differenceX + differenceY * differenceY;
      if (distanceSquared > 0.001 && distanceSquared < 1.15) {
        separation.x += differenceX / distanceSquared;
        separation.y += differenceY / distanceSquared;
      }
    }
    desired.addScaledVector(separation, 0.38);

    let fleeing = false;
    if (now < pointerActiveUntil) {
      away.set(fish.root.position.x - pointerWorld.x, fish.root.position.y - pointerWorld.y);
      const pointerDistance = away.length();
      const avoidRadius = 2.7 + fish.size * 0.35;
      if (pointerDistance < avoidRadius) {
        const avoidStrength = Math.pow(1 - pointerDistance / avoidRadius, 1.4) * 5.2;
        if (pointerDistance < 0.05) away.set(Math.cos(fish.heading), Math.sin(fish.heading));
        else away.multiplyScalar(1 / pointerDistance);
        desired.addScaledVector(away, avoidStrength);
        fleeing = true;
      }
    }

    desired.normalize();
    const targetHeading = Math.atan2(desired.y, desired.x);
    const maximumTurn = delta * (fleeing ? 3.4 : 1.15);
    const turnStep = THREE.MathUtils.clamp(
      shortestAngleDifference(fish.heading, targetHeading),
      -maximumTurn,
      maximumTurn,
    );
    fish.heading += turnStep;
    const swimSpeed = fish.speed * (fleeing ? 2.15 : 1);
    fish.root.position.x += Math.cos(fish.heading) * swimSpeed * delta;
    fish.root.position.y += Math.sin(fish.heading) * swimSpeed * delta;
    fish.root.rotation.z = fish.heading;
    fish.material.uniforms.uTime.value = elapsedTime;
    fish.material.uniforms.uFlee.value += ((fleeing ? 1 : 0) - fish.material.uniforms.uFlee.value) * 0.08;
    const turnTarget = maximumTurn > 0 ? THREE.MathUtils.clamp(turnStep / maximumTurn, -1, 1) : 0;
    const turnSmoothing = Math.min(1, delta * 7.5);
    fish.material.uniforms.uTurn.value += (turnTarget - fish.material.uniforms.uTurn.value) * turnSmoothing;
    const pectoralMotion = Math.sin(elapsedTime * (fleeing ? 5.2 : 3.3) + fish.phase + 0.7);
    fish.pectoralLeftPivot.rotation.z = -0.1 + pectoralMotion * 0.22;
    fish.pectoralRightPivot.rotation.z = 0.1 - pectoralMotion * 0.22;
    fish.pectoralLeft.scale.x = 0.94 + pectoralMotion * 0.1;
    fish.pectoralRight.scale.x = 0.94 + pectoralMotion * 0.1;
    fish.visual.rotation.z = Math.sin(elapsedTime * 2.1 + fish.phase) * 0.018;

    if (fish.root.position.x > horizontalLimit) fish.root.position.x = -horizontalLimit;
    else if (fish.root.position.x < -horizontalLimit) fish.root.position.x = horizontalLimit;
    if (fish.root.position.y > verticalLimit) fish.root.position.y = -verticalLimit;
    else if (fish.root.position.y < -verticalLimit) fish.root.position.y = verticalLimit;
  };

  const updateRipples = delta => {
    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index];
      ripple.age += delta;
      const duration = 1.35 + ripple.strength * 0.2;
      const progress = ripple.age / duration;
      if (progress >= 1) {
        ripples.splice(index, 1);
        continue;
      }
    }
    const rippleUniforms = waterMaterial.uniforms.uRipples.value;
    const rippleCount = Math.min(ripples.length, rippleUniforms.length);
    waterMaterial.uniforms.uRippleCount.value = rippleCount;
    for (let index = 0; index < rippleUniforms.length; index += 1) {
      if (index >= rippleCount) {
        rippleUniforms[index].set(0, 0, 1, 0);
        continue;
      }
      const ripple = ripples[ripples.length - 1 - index];
      const duration = 1.35 + ripple.strength * 0.2;
      rippleUniforms[index].set(
        ripple.position.x,
        ripple.position.y,
        Math.min(ripple.age / duration, 1),
        ripple.strength,
      );
    }
  };

  const drawFrame = time => {
    if (!running || destroyed) return;
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    elapsedTime += delta;
    waterMaterial.uniforms.uTime.value = elapsedTime;
    grass.forEach((mesh, index) => {
      mesh.rotation.z += Math.sin(elapsedTime * 0.7 + index) * delta * 0.04;
    });
    rocks.forEach((mesh, index) => {
      mesh.rotation.z += Math.sin(elapsedTime * 0.18 + index) * delta * 0.012;
    });
    for (let index = 0; index < fishes.length; index += 1) updateFish(fishes[index], index, delta, time);
    updateRipples(delta);
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
    destroy() {
      destroyed = true;
      pause();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      for (const timer of delayedRippleTimers) window.clearTimeout(timer);
      delayedRippleTimers.clear();
      stopObservingSize();
      disposeObject3D(scene);
      for (const texture of fishTextures) texture.dispose();
      grassTexture.dispose();
      rockTexture.dispose();
      disposeRenderer(renderer);
    },
  };
}
