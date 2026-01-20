# Palette's Journal

## 2024-05-23 - [Initial Setup]
**Learning:** This repository contains multiple WebGL and Canvas experiments, with 'langton3d' being a primary one. It lacks a centralized package.json.
**Action:** Focus UX improvements on individual experiments like 'langton3d', verifying locally with a simple HTTP server.

## 2026-01-20 - [Focus Management in Custom Drawers]
**Learning:** Custom UI drawers and modals in `langton3d` lacked focus management, trapping keyboard users or forcing extra clicks.
**Action:** When toggling custom UI visibility (like `.is-open` classes), always explicitly `.focus()` the primary input or close button.
