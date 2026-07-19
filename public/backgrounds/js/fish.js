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

  void main() {
    vUv = uv;
    vPosition = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const waterFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec2 vPosition;

  void main() {
    float broadWave = sin(vPosition.x * 0.34 + uTime * 0.34)
      * cos(vPosition.y * 0.29 - uTime * 0.25);
    float fineWave = sin((vPosition.x + vPosition.y) * 1.2 + uTime * 0.62)
      * sin((vPosition.x - vPosition.y) * 0.72 - uTime * 0.48);
    float caustic = smoothstep(0.68, 0.96, broadWave * 0.32 + fineWave * 0.18 + 0.68);
    vec3 deepWater = vec3(0.012, 0.105, 0.16);
    vec3 shallowWater = vec3(0.025, 0.24, 0.29);
    vec3 color = mix(deepWater, shallowWater, vUv.y * 0.34 + broadWave * 0.08 + 0.2);
    color += vec3(0.08, 0.3, 0.32) * caustic * 0.18;
    float vignette = 1.0 - smoothstep(0.35, 0.75, distance(vUv, vec2(0.5)));
    color *= 0.82 + vignette * 0.18;
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
  renderer.setClearColor(0x031a27, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 0, 18);

  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: {uTime: {value: 0}},
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    depthWrite: false,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), waterMaterial);
  water.position.z = -0.5;
  scene.add(water);

  scene.add(new THREE.HemisphereLight(0xc8ffff, 0x06303d, 2.3));
  const sunlight = new THREE.DirectionalLight(0xd9ffff, 2.8);
  sunlight.position.set(-4, 7, 12);
  scene.add(sunlight);

  const bodyGeometry = new THREE.SphereGeometry(0.5, lowQuality ? 10 : 16, lowQuality ? 7 : 10);
  const detailGeometry = new THREE.SphereGeometry(0.5, lowQuality ? 8 : 12, lowQuality ? 6 : 8);
  const eyeGeometry = new THREE.SphereGeometry(0.045, 7, 5);
  const finGeometry = new THREE.BufferGeometry();
  finGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0.02,
    -0.38, 0.27, 0,
    -0.4, -0.27, 0,
  ], 3));
  finGeometry.computeVertexNormals();
  const sideFinGeometry = new THREE.BufferGeometry();
  sideFinGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
    0.08, 0.1, 0.02,
    -0.2, 0.42, -0.01,
    -0.24, 0.1, 0,
  ], 3));
  sideFinGeometry.computeVertexNormals();
  const shadowGeometry = new THREE.CircleGeometry(0.5, 16);

  const palettes = [
    {body: 0xf0a13a, detail: 0xffd47a, fin: 0xd96b2b},
    {body: 0xe9e1ca, detail: 0xf3774c, fin: 0xd55335},
    {body: 0x58a8b0, detail: 0x9ee0d7, fin: 0x32757f},
    {body: 0xe1bd50, detail: 0xffe293, fin: 0xa66d28},
    {body: 0xb4c7d5, detail: 0xf4f7e9, fin: 0x718c9c},
  ].map(colors => ({
    body: new THREE.MeshPhongMaterial({color: colors.body, shininess: 65}),
    detail: new THREE.MeshPhongMaterial({color: colors.detail, shininess: 75}),
    fin: new THREE.MeshPhongMaterial({
      color: colors.fin,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      shininess: 30,
    }),
  }));
  const eyeMaterial = new THREE.MeshBasicMaterial({color: 0x071014});
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x001019,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });

  const fishCount = lowQuality ? 10 : 17;
  const fishes = [];
  for (let index = 0; index < fishCount; index += 1) {
    const palette = palettes[index % palettes.length];
    const root = new THREE.Group();
    const visual = new THREE.Group();
    root.add(visual);

    const body = new THREE.Mesh(bodyGeometry, palette.body);
    body.scale.set(1, 0.39, 0.27);
    visual.add(body);

    const backMark = new THREE.Mesh(detailGeometry, palette.detail);
    backMark.scale.set(0.56, 0.15, 0.285);
    backMark.position.set(0.03, 0, 0.055);
    visual.add(backMark);

    const tailPivot = new THREE.Group();
    tailPivot.position.x = -0.42;
    const tail = new THREE.Mesh(finGeometry, palette.fin);
    tailPivot.add(tail);
    visual.add(tailPivot);

    const leftFin = new THREE.Mesh(sideFinGeometry, palette.fin);
    visual.add(leftFin);
    const rightFin = new THREE.Mesh(sideFinGeometry, palette.fin);
    rightFin.scale.y = -1;
    visual.add(rightFin);

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.38, 0.13, 0.1);
    visual.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.38, -0.13, 0.1);
    visual.add(rightEye);

    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.set(-0.05, 0, -0.24);
    shadow.scale.set(1.18, 0.48, 1);
    visual.add(shadow);

    const size = randomRange(0.72, 1.18);
    root.scale.setScalar(size);
    root.position.set(randomRange(-10, 10), randomRange(-5.7, 5.7), randomRange(-0.02, 0.2));
    const heading = Math.random() * TAU;
    root.rotation.z = heading;
    scene.add(root);
    fishes.push({
      root,
      visual,
      tailPivot,
      heading,
      wanderHeading: heading,
      wanderTimer: randomRange(0.4, 2.5),
      speed: randomRange(0.42, 0.78),
      phase: Math.random() * TAU,
      size,
    });
  }

  const rippleGeometry = new THREE.RingGeometry(0.82, 1, lowQuality ? 36 : 64);
  const ripples = [];
  const pointerWorld = new THREE.Vector2(1000, 1000);
  let pointerActiveUntil = 0;
  let lastRippleTime = 0;
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
    const material = new THREE.MeshBasicMaterial({
      color: strength > 1 ? 0xc5ffff : 0x8be5e5,
      transparent: true,
      opacity: Math.min(0.38, 0.22 * strength),
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(rippleGeometry, material);
    ring.position.set(position.x, position.y, 0.24);
    ring.scale.setScalar(0.08);
    ring.renderOrder = 3;
    scene.add(ring);
    ripples.push({ring, material, age: 0, strength});
    while (ripples.length > (lowQuality ? 8 : 16)) {
      const oldest = ripples.shift();
      scene.remove(oldest.ring);
      oldest.material.dispose();
    }
  };

  const onPointerMove = event => {
    const position = eventToWorld(event);
    if (!position) return;
    pointerWorld.copy(position);
    pointerActiveUntil = performance.now() + 1150;
    const now = performance.now();
    if (now - lastRippleTime > 90 && position.distanceToSquared(lastRipplePosition) > 0.12) {
      addRipple(position, 0.8);
      lastRipplePosition.copy(position);
      lastRippleTime = now;
    }
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
    fish.heading += THREE.MathUtils.clamp(
      shortestAngleDifference(fish.heading, targetHeading),
      -maximumTurn,
      maximumTurn,
    );
    const swimSpeed = fish.speed * (fleeing ? 2.15 : 1);
    fish.root.position.x += Math.cos(fish.heading) * swimSpeed * delta;
    fish.root.position.y += Math.sin(fish.heading) * swimSpeed * delta;
    fish.root.rotation.z = fish.heading;
    fish.tailPivot.rotation.z = Math.sin(elapsedTime * (fleeing ? 10 : 6.2) + fish.phase) * (fleeing ? 0.46 : 0.3);
    fish.visual.rotation.z = Math.sin(elapsedTime * 2.4 + fish.phase) * 0.025;

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
        scene.remove(ripple.ring);
        ripple.material.dispose();
        ripples.splice(index, 1);
        continue;
      }
      const radius = 0.1 + progress * (2.15 + ripple.strength * 0.75);
      ripple.ring.scale.setScalar(radius);
      ripple.material.opacity = (1 - progress) * (1 - progress) * 0.25 * ripple.strength;
    }
  };

  const drawFrame = time => {
    if (!running || destroyed) return;
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    elapsedTime += delta;
    waterMaterial.uniforms.uTime.value = elapsedTime;
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
      rippleGeometry.dispose();
      disposeRenderer(renderer);
    },
  };
}
