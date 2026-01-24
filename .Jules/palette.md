# Palette's Journal

## 2026-01-24 - Snapshot Feedback Gap
**Learning:** Users lack immediate feedback during Canvas 'toBlob' operations, which can feel sluggish or broken on slower devices.
**Action:** Always implement an immediate "Processing..." state (disable + text change) before awaiting canvas blob generation.
