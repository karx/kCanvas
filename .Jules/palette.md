# Palette's Journal

## 2026-02-01 - Exposing Custom Keyboard Shortcuts
**Learning:** Custom JavaScript keyboard listeners (e.g., `document.addEventListener('keydown')`) are invisible to screen readers, leaving users unaware of available shortcuts.
**Action:** Always add `aria-keyshortcuts` attributes to the corresponding UI controls to explicitly announce these shortcuts (e.g., `aria-keyshortcuts="Space"` on the Pause button).
