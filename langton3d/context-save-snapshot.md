langton3d/kaaro.html (line 15) loads an A-Frame scene + camera controls (wasd-controls) and runs langton3d/kaaro.js (line 24).
langton3d/kaaro.js mixes simulation + rendering: grid is preallocated as a 3D array of cell objects; each visited cell becomes/updates an a-box via drawBox (langton3d/kaaro.js (line 212)).
Multiple ants already exist conceptually: the sim iterates allTermites (langton3d/kaaro.js (line 180), langton3d/kaaro.js (line 203)) and each ant runs colorAndupdatePosition() (langton3d/kaaro.js (line 82)).
Usability (UI/UX) Findings

No discoverable controls: no pause/reset/speed, no “how to move camera”, no indication how many ants/rules are running (langton3d/kaaro.html (line 15)).
CSS appears unused in langton3d (langton3d/kaaro.css targets #myCanvas, but there is no #myCanvas in langton3d/kaaro.html).
Simulation runs “full throttle” (one step per ant per animation frame) with no step-rate control; when an ant exits bounds it silently stops updating (early return in langton3d/kaaro.js (line 82)).
Rendering approach will degrade quickly: per-voxel DOM entities (a-box) plus a fully preallocated grid makes scale/multiple-ants hard.
Ability To Spawn Custom Ants (same canvas) — Current State

langton3d: only by editing allTermites in code (langton3d/kaaro.js (line 180)).
langtonHexD already demonstrates the UX pattern you want: runtime rule entry and live ant list (langtonHexD/index.html (line 27), langtonHexD/kaaro.js (line 534), langtonHexD/kaaro.js (line 560)).
Checklist / Next Steps (prioritized)

P0: Make it usable

Add a small overlay HUD: play/pause, reset, speed (steps/frame), and a help panel listing controls + current ant count.
Add runtime spawning API + UI:
spawnAnt(config) that pushes into allTermites (start x,y,z, rule string → transitions array, orientation/plane, optional heading).
Validate: rule tokens allowed, numberOfStates === transitions.length, start position in-bounds (or show “out of bounds” instead of silently failing).
Ant management list: enable/disable/remove ants; show each ant’s rule in colored tokens (like langtonHexD/kaaro.js (line 560)).
P1: Make spawning scale (multiple ants without collapsing)

Replace the preallocated 3D array with lazy storage (e.g., Map keyed by "x,y,z"): missing cell implies state 0; create cells on first write. This removes the up-front O(x*y*z) memory hit and makes “spawn anywhere” feasible.
Decouple simulation stepping from rendering: run N simulation steps per frame, but only re-render mutated cells; add a fixed timestep option for determinism.
P2: Performance + UX polish

Replace “one a-box per visited cell” with instanced/merged rendering (A-Frame component using THREE.InstancedMesh, or direct Three.js hook). This is the main enabler for lots of ants.
Add click-to-spawn: raycast into the scene and spawn at the selected voxel; show a ghost preview before placing.
Add presets + shareable links: encode rules/ants in query params so users can share setups.
If you want, I can turn P0 into an actual implementation in langton3d (overlay HUD + runtime spawnAnt form), borrowing the working interaction pattern from langtonHexD.