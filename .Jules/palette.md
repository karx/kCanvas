## 2024-05-22 - Async Feedback & Keyboard Discovery
**Learning:** Users often miss keyboard shortcuts if they are only in help text. Async operations (like WebGL snapshots) without immediate UI feedback feel broken.
**Action:** Always add `aria-keyshortcuts` to buttons with hotkeys. Always add immediate "loading" state (text change/disable) to buttons triggering async logic.
