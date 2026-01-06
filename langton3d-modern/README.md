# Langton 3D Termite (Modern)

This is a clean rewrite of the Langton 3D termite using modern browser features and Three.js modules. It keeps the core idea simple: a single agent walks a 3D lattice, turning based on cell state and flipping that cell to the next state.

## What is Langton's ant?
Langton's ant is a cellular automaton with a single moving agent. Each cell stores a state. The ant looks at the current cell, turns based on that state, flips the state, and moves forward. Even with tiny rules like `LR`, it produces emergent structure.

In 3D, the "termite" uses the same idea, but the lattice is three dimensional and turns can include up/down rotations.

## Run
Open `langton3d-modern/index.html` in a local server or a static host.

## Rule tokens
Rules are strings made from these tokens:
- `L` / `R`: turn left or right.
- `N`: no turn (go straight).
- `U`: u-turn (180 degrees).

Example rules:
- `LR` (classic)
- `LURD`
- `LRFB`

## Controls
- Rule input to change the turn sequence.
- Steps per frame to speed up or slow down.
- Follow ant to keep the camera centered.
- Pause, Step, Reset.
- Ants panel lets you add ants, set heading, and schedule spawns.
 - Export panel lets you download a GLTF, a top-view PNG, and a share URL for the starting config.

## Notes
- WebGPU is used automatically if available; otherwise it falls back to WebGL.
- Colors are generated per rule length.

## Multi-ant interaction model
Each cell stores a shared `stateIndex`. Every ant reads that index and interprets it with its own rule length (`stateIndex % antRuleLength`). When an ant visits, it increments the cell state modulo its own rule length and overwrites the cell color using its own palette at that new state. This matches the original `langton3d` behavior where the last ant to visit defines the stored state index.
