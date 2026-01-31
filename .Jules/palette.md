## 2026-01-31 - Canvas Snapshot Loading States
**Learning:** Canvas `toBlob` operations can be slow on high-res displays or complex scenes, causing the UI to feel unresponsive. Users might click multiple times.
**Action:** Always wrap heavy canvas operations (like snapshots) with a visible loading state (disabled button + text change) to provide feedback.
