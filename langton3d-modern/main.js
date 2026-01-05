import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.getElementById("c");
const statusRenderer = document.getElementById("statusRenderer");
const statusSteps = document.getElementById("statusSteps");
const statusCells = document.getElementById("statusCells");

const ruleInput = document.getElementById("ruleInput");
const presetSelect = document.getElementById("presetSelect");
const speedInput = document.getElementById("speedInput");
const cameraMode = document.getElementById("cameraMode");
const colorGrid = document.getElementById("colorGrid");
const presetDescription = document.getElementById("presetDescription");
const toggleBtn = document.getElementById("toggleBtn");
const stepBtn = document.getElementById("stepBtn");
const resetBtn = document.getElementById("resetBtn");

const scene = new THREE.Scene();
scene.background = null;
scene.fog = null;

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 20000);
camera.position.set(18, 14, 18);

let renderer = null;

async function createRenderer() {
  const params = new URLSearchParams(window.location.search);
  const useWebGPU = params.get("webgpu") === "1";
  if (useWebGPU && navigator.gpu) {
    try {
      const module = await import(
        "three/addons/renderers/webgpu/WebGPURenderer.js"
      );
      renderer = new module.WebGPURenderer({ canvas, antialias: true });
      statusRenderer.textContent = "Renderer: WebGPU";
    } catch (error) {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      statusRenderer.textContent = "Renderer: WebGL";
    }
  } else {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    statusRenderer.textContent = "Renderer: WebGL";
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
}

await createRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const hemi = new THREE.HemisphereLight(0xffffff, 0x5a4a38, 0.8);
scene.add(hemi);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(20, 30, 10);
scene.add(dirLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambient);

const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xe7dcc8,
  roughness: 1,
  metalness: 0,
});
const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), groundMaterial);
ground.rotation.x = -Math.PI * 0.5;
ground.position.y = -0.6;
scene.add(ground);

const gridHelper = new THREE.GridHelper(160, 80, 0x9f896f, 0xcab499);
gridHelper.position.y = -0.5;
scene.add(gridHelper);


const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

let instancedByColor = new Map();
let instancedCapacityByColor = new Map();

const dummy = new THREE.Object3D();

const antGeometry = new THREE.ConeGeometry(0.35, 0.9, 5);
const antMaterial = new THREE.MeshStandardMaterial({
  color: 0x2b1b12,
  roughness: 0.4,
  metalness: 0.1,
});
const antGroup = new THREE.Group();
scene.add(antGroup);

const state = {
  running: true,
  stepsPerFrame: Number(speedInput.value),
  stepCount: 0,
  rule: "LR",
  palette: [],
  followMode: cameraMode.value,
  antConfigs: [],
};

function sanitizeRule(value) {
  const tokens = value.toUpperCase().replace(/[^LRUDFB]/g, "");
  return tokens.length ? tokens : "LR";
}

function updateRule(value) {
  const rule = sanitizeRule(value);
  ruleInput.value = rule;
  state.rule = rule;
  resetInstances();
  rebuildColorInputs();
}

function buildPalette(count) {
  const colors = [];
  for (let i = 0; i < count; i += 1) {
    const hue = (i / count) * 0.78 + 0.1;
    colors.push(new THREE.Color().setHSL(hue, 0.5, 0.42));
  }
  return colors;
}

function generatePaletteFromHue(baseHue, count) {
  const c = Number.isFinite(Number(count)) ? Math.max(2, Number(count)) : 2;
  let hue = Number(baseHue);
  if (!Number.isFinite(hue)) hue = 210;
  hue = ((hue % 360) + 360) % 360;
  const palette = [];
  for (let i = 0; i < c; i += 1) {
    const h = (hue + i * 40) % 360;
    palette.push(hslToHex(h, 62, 60));
  }
  return palette;
}

function hslToHex(h, s, l) {
  const _s = s / 100;
  const _l = l / 100;
  const c = (1 - Math.abs(2 * _l - 1)) * _s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = _l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  const rr = Math.round((r + m) * 255);
  const gg = Math.round((g + m) * 255);
  const bb = Math.round((b + m) * 255);
  return `#${toHex2(rr)}${toHex2(gg)}${toHex2(bb)}`;
}

function toHex2(value) {
  const v = Math.max(0, Math.min(255, Number(value) || 0));
  return v.toString(16).padStart(2, "0");
}

function colorToHex(color) {
  return `#${color.getHexString()}`;
}

function rebuildColorInputs(customColors) {
  const colors = customColors && customColors.length
    ? customColors
    : buildPalette(state.rule.length);
  state.palette = colors;
  syncPrimaryAntFromUi();
  if (!colorGrid) {
    return;
  }
  colorGrid.innerHTML = "";

  for (let i = 0; i < state.rule.length; i += 1) {
    const token = state.rule[i];
    const wrapper = document.createElement("label");
    wrapper.className = "color-item";
    wrapper.textContent = `${token} ${i + 1}`;

    const input = document.createElement("input");
    input.type = "color";
    input.value = colorToHex(colors[i]);
    input.addEventListener("input", (event) => {
      colors[i].set(event.target.value);
      syncPrimaryAntFromUi();
      updateInstances();
    });

    wrapper.appendChild(input);
    colorGrid.appendChild(wrapper);
  }
  updateInstances();
}

function syncPrimaryAntFromUi() {
  if (state.antConfigs.length === 0) {
    state.antConfigs = [
      {
        x: 0,
        y: 0,
        z: 0,
        rule: state.rule,
        colors: state.palette.map((c) => colorToHex(c)),
      },
    ];
  }
  const primaryConfig = state.antConfigs[0];
  primaryConfig.rule = state.rule;
  primaryConfig.colors = state.palette.map((c) => colorToHex(c));

  if (ants[0]) {
    ants[0].rule = state.rule;
    ants[0].palette = state.palette.map((c) => c.clone());
  }
}


let ants = [];

function buildAnt(config) {
  const position = new THREE.Vector3(
    Number(config?.x) || 0,
    Number(config?.y) || 0,
    Number(config?.z) || 0
  );
  const mesh = new THREE.Mesh(antGeometry, antMaterial);
  mesh.rotation.x = Math.PI * 0.5;
  antGroup.add(mesh);

  const rule = sanitizeRule(config?.rule || "LR");
  const colors = Array.isArray(config?.colors) && config.colors.length
    ? config.colors
    : buildPalette(rule.length).map((c) => colorToHex(c));
  const palette = colors.map((hex) => new THREE.Color(hex));

  return {
    position,
    dir: new THREE.Vector3(1, 0, 0),
    up: new THREE.Vector3(0, 1, 0),
    right: new THREE.Vector3(0, 0, 1),
    rule,
    palette,
    mesh,
  };
}

function setAnts(configs) {
  antGroup.clear();
  ants = (configs || []).map((config) => buildAnt(config));
}

const grid = new Map();

function keyFor(x, y, z) {
  return `${x}|${y}|${z}`;
}

function setCell(x, y, z, nextState, color) {
  const key = keyFor(x, y, z);
  grid.set(key, { x, y, z, state: nextState, color });
}

function getCell(x, y, z) {
  return grid.get(keyFor(x, y, z)) || null;
}

function rotateAnt(ant, token) {
  const { dir, up, right } = ant;
  const dirOld = dir.clone();
  const upOld = up.clone();
  const rightOld = right.clone();

  switch (token) {
    case "L":
      dir.copy(rightOld).multiplyScalar(-1);
      right.copy(dirOld);
      break;
    case "R":
      dir.copy(rightOld);
      right.copy(dirOld).multiplyScalar(-1);
      break;
    case "U":
      dir.copy(upOld);
      up.copy(dirOld).multiplyScalar(-1);
      break;
    case "D":
      dir.copy(upOld).multiplyScalar(-1);
      up.copy(dirOld);
      break;
    case "B":
      dir.copy(dirOld).multiplyScalar(-1);
      right.copy(rightOld).multiplyScalar(-1);
      break;
    case "F":
    default:
      break;
  }
}

function stepAnt(ant) {
  const { position } = ant;
  const cell = getCell(position.x, position.y, position.z);
  const stateIndex = Number.isFinite(cell?.state) ? cell.state : 0;
  const token = ant.rule[stateIndex % ant.rule.length];
  rotateAnt(ant, token);

  const nextState = (stateIndex + 1) % ant.rule.length;
  const nextColor = ant.palette[nextState] || ant.palette[0];
  setCell(position.x, position.y, position.z, nextState, colorToHex(nextColor));

  position.add(ant.dir);
  state.stepCount += 1;
}

function stepSimulation() {
  ants.forEach((ant) => stepAnt(ant));
}

function resetInstances() {
  instancedByColor.forEach((mesh) => {
    scene.remove(mesh);
  });
  instancedByColor.clear();
  instancedCapacityByColor.clear();
}

function ensureInstanceCapacityForColor(colorHex, count) {
  if (count <= 0) {
    return;
  }
  const current = instancedCapacityByColor.get(colorHex) || 0;
  if (count <= current && instancedByColor.get(colorHex)) {
    return;
  }
  const nextCapacity = Math.max(16, 2 ** Math.ceil(Math.log2(count)));
  instancedCapacityByColor.set(colorHex, nextCapacity);

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    metalness: 0.05,
    roughness: 0.65,
  });
  const mesh = new THREE.InstancedMesh(cubeGeometry, material, nextCapacity);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const existing = instancedByColor.get(colorHex);
  if (existing) {
    scene.remove(existing);
  }
  instancedByColor.set(colorHex, mesh);
  scene.add(mesh);
}

function updateInstances() {
  const cells = Array.from(grid.values());
  if (cells.length === 0) {
    instancedByColor.forEach((mesh) => {
      mesh.count = 0;
      mesh.instanceMatrix.needsUpdate = true;
    });
    return;
  }

  const buckets = new Map();
  for (const cell of cells) {
    const colorHex = (cell.color || "#12130f").toLowerCase();
    if (!buckets.has(colorHex)) {
      buckets.set(colorHex, []);
    }
    buckets.get(colorHex).push(cell);
  }

  const usedColors = new Set(buckets.keys());
  buckets.forEach((bucket, colorHex) => {
    ensureInstanceCapacityForColor(colorHex, bucket.length);
    const mesh = instancedByColor.get(colorHex);
    if (!mesh) {
      return;
    }
    for (let i = 0; i < bucket.length; i += 1) {
      const cell = bucket[i];
      dummy.position.set(cell.x, cell.y, cell.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.count = bucket.length;
    mesh.instanceMatrix.needsUpdate = true;
  });

  instancedByColor.forEach((mesh, colorHex) => {
    if (!usedColors.has(colorHex)) {
      mesh.count = 0;
      mesh.instanceMatrix.needsUpdate = true;
    }
  });
}

function updateAntMeshes() {
  ants.forEach((ant) => {
    ant.mesh.position.copy(ant.position);
    ant.mesh.lookAt(ant.position.clone().add(ant.dir));
  });
}

function resize() {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

window.addEventListener("resize", resize);
resize();

toggleBtn.addEventListener("click", () => {
  state.running = !state.running;
  toggleBtn.textContent = state.running ? "Pause" : "Play";
});

stepBtn.addEventListener("click", () => {
  state.running = false;
  toggleBtn.textContent = "Play";
  stepSimulation();
  updateInstances();
  updateAntMeshes();
});

resetBtn.addEventListener("click", () => {
  resetSimulation();
});

function resetSimulation() {
  grid.clear();
  setAnts(state.antConfigs);
  state.stepCount = 0;
  resetInstances();
  updateInstances();
  updateAntMeshes();
}

const presets = [
  {
    name: "Classic (LR)",
    description: "The original Langton's Ant: 2-state LR.",
    speed: 2,
    rule: "LR",
    colors: ["#12130f", "#eae6e5"],
  },
  {
    name: "4-state (LRRL)",
    description: "A 4-state rule that tends to form structured patterns.",
    speed: 3,
    rule: "LRRL",
    colors: ["#12130f", "#5b9279", "#eae6e5", "#8fcb9b"],
  },
  {
    name: "4-state (LLRR)",
    description: "Another 4-state that often produces broad swirls.",
    speed: 3,
    rule: "LLRR",
    colors: ["#0b0f14", "#3a506b", "#5bc0be", "#f0b429"],
  },
  {
    name: "Two Ants (mirror)",
    description: "Mirror ants from the original preset.",
    speed: 2,
    rule: "LR",
    ants: [
      { x: -10, y: 0, z: 0, rule: "LR", colors: ["#0a0c10", "#8fcb9b"] },
      { x: 10, y: 0, z: 0, rule: "RL", colors: ["#0a0c10", "#eae6e5"] },
    ],
  },
  {
    name: "Scheduled Spawn",
    description: "Original preset with both ants starting together.",
    speed: 3,
    rule: "LR",
    ants: [
      { x: 0, y: 0, z: 0, rule: "LR", colors: ["#0a0c10", "#5b9279"] },
      {
        x: 0,
        y: 0,
        z: 25,
        rule: "LRRL",
        colors: ["#0a0c10", "#486084", "#8c916f", "#324683"],
      },
    ],
  },
  {
    category: "The Geometric Architects",
    name: "The Cardioid",
    description: "LLRR (4 colors) - symmetry-focused growth.",
    speed: 4,
    rule: "LLRR",
    baseHue: 140,
  },
  {
    category: "The Geometric Architects",
    name: "The Square",
    description: "LRRRRRLLR (9 colors) - dense space-filling square growth.",
    speed: 5,
    rule: "LRRRRRLLR",
    baseHue: 210,
  },
  {
    category: "The Geometric Architects",
    name: "The Triangle",
    description: "RRLLLRLLLRRR (12 colors) - triangular wedge; later migrates.",
    speed: 6,
    rule: "RRLLLRLLLRRR",
    baseHue: 35,
  },
  {
    category: "The Geometric Architects",
    name: "The Spiral",
    description: "LRRRRLLLRRR (11 colors) - clean architectural square spiral.",
    speed: 5,
    rule: "LRRRRLLLRRR",
    baseHue: 280,
  },
  {
    category: "The Highwaymen",
    name: "Classic Highway",
    description: "RL (2 colors) - chaos, then the classic diagonal highway.",
    speed: 4,
    rule: "RL",
    baseHue: 150,
  },
  {
    category: "The Highwaymen",
    name: "Convolution",
    description: "LLRRRLRLRLLR (12 colors) - thick braided highway.",
    speed: 6,
    rule: "LLRRRLRLRLLR",
    baseHue: 190,
  },
  {
    category: "The Highwaymen",
    name: "The Weaver",
    description: "RLR (3 colors) - chaotic fuzzball growth.",
    speed: 7,
    rule: "RLR",
    baseHue: 320,
  },
  {
    category: "Multi-Ant Orchestrations",
    name: "The Rorschach",
    description: "Two mirrored ants produce an inkblot symmetry.",
    speed: 4,
    ants: [
      { x: -1, y: 0, z: 0, rule: "RL", baseHue: 140 },
      { x: 1, y: 0, z: 0, rule: "RL", baseHue: 40 },
    ],
  },
  {
    category: "Multi-Ant Orchestrations",
    name: "The Collider",
    description: "A second ant intercepts the highway and resets chaos.",
    speed: 4,
    ants: [
      { x: 0, y: 0, z: 0, rule: "RL", baseHue: 130 },
      { x: 30, y: 30, z: 0, rule: "RL", baseHue: 10 },
    ],
  },
  {
    category: "Multi-Ant Orchestrations",
    name: "The Galaxy",
    description: "Four ants with rotational symmetry form a galaxy-like burst.",
    speed: 3,
    ants: [
      { x: 0, y: 10, z: 0, rule: "RL", baseHue: 210 },
      { x: 0, y: -10, z: 0, rule: "RL", baseHue: 30 },
      { x: 10, y: 0, z: 0, rule: "RL", baseHue: 120 },
      { x: -10, y: 0, z: 0, rule: "RL", baseHue: 300 },
    ],
  },
];

function resolvePresetColors(source, rule, fallback) {
  if (Array.isArray(source?.colors) && source.colors.length) {
    return source.colors;
  }
  if (Number.isFinite(Number(source?.baseHue))) {
    return generatePaletteFromHue(source.baseHue, rule.length);
  }
  if (fallback) {
    return resolvePresetColors(fallback, rule);
  }
  return buildPalette(rule.length).map((c) => colorToHex(c));
}

function applyPreset(preset) {
  if (!preset) return;
  let antConfigs = [];
  if (Array.isArray(preset.ants) && preset.ants.length) {
    antConfigs = preset.ants.map((ant) => {
      const rule = sanitizeRule(ant.rule || preset.rule || "LR");
      const colors = resolvePresetColors(ant, rule, preset);
      return {
        x: Number(ant.x) || 0,
        y: Number(ant.y) || 0,
        z: Number(ant.z) || 0,
        rule,
        colors,
      };
    });
  } else {
    const rule = sanitizeRule(preset.rule || "LR");
    const colors = resolvePresetColors(preset, rule);
    antConfigs = [{ x: 0, y: 0, z: 0, rule, colors }];
  }

  state.antConfigs = antConfigs;
  const primary = antConfigs[0];
  state.rule = primary.rule;
  ruleInput.value = primary.rule;
  const palette = primary.colors.map((hex) => new THREE.Color(hex));
  resetInstances();
  rebuildColorInputs(palette);
  const nextSpeed = Math.max(1, Math.min(400, Number(preset.speed) || 60));
  speedInput.value = String(nextSpeed);
  state.stepsPerFrame = nextSpeed;
  if (presetDescription) {
    presetDescription.textContent = preset.description || "";
  }
  resetSimulation();
}

function buildPresetOptions() {
  if (!presetSelect) return;
  presetSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose preset";
  presetSelect.appendChild(placeholder);

  const groups = new Map();
  presets.forEach((preset) => {
    const category = preset.category || "Presets";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(preset);
  });

  Array.from(groups.entries()).forEach(([category, items]) => {
    const group = document.createElement("optgroup");
    group.label = category;
    items.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.name;
      option.textContent = preset.name;
      option.title = preset.description || "";
      group.appendChild(option);
    });
    presetSelect.appendChild(group);
  });
}

presetSelect?.addEventListener("change", (event) => {
  const value = event.target.value;
  const preset = presets.find((item) => item.name === value);
  applyPreset(preset);
});

buildPresetOptions();
updateRule(ruleInput.value);
resetSimulation();

ruleInput.addEventListener("change", (event) => {
  updateRule(event.target.value);
});

speedInput.addEventListener("input", (event) => {
  state.stepsPerFrame = Number(event.target.value);
});

cameraMode.addEventListener("change", (event) => {
  state.followMode = event.target.value;
});

function tick() {
  if (state.running) {
    for (let i = 0; i < state.stepsPerFrame; i += 1) {
      stepSimulation();
    }
    updateInstances();
    updateAntMeshes();
  }

  const primaryAnt = ants[0];
  if (primaryAnt && state.followMode === "soft") {
    controls.target.lerp(primaryAnt.position, 0.05);
  } else if (primaryAnt && state.followMode === "tight") {
    controls.target.lerp(primaryAnt.position, 0.2);
  }

  controls.update();

  statusSteps.textContent = `Steps: ${state.stepCount}`;
  statusCells.textContent = `Active cells: ${grid.size}`;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(tick);
