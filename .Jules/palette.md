## 2025-02-20 - Loading State for Canvas Operations
**Learning:** Client-side canvas snapshotting (WebGL -> Blob) can be surprisingly slow and block interaction. Users might double-click or think the app froze.
**Action:** Always provide immediate feedback (e.g., "Snapping...", disabled state) for file generation actions, even if they seem fast on dev machines.
