## 2024-10-24 - Async State Feedback in Canvas Ops
**Learning:** Heavy operations like `canvas.toBlob` or WebGL readbacks can freeze or delay the UI without visual feedback, causing user confusion or rage-clicks. The default browser cursor doesn't always indicate "busy" for JS-driven tasks.
**Action:** Always wrap async UI handlers with explicit state management: Disable the trigger, update its text/icon to "Loading...", and ensure a safe reset in `finally` or all exit paths. Visually style the disabled state to be obvious.
