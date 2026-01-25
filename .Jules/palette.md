# Palette's Journal

## 2024-10-24 - Exposing Keyboard Shortcuts
**Learning:** Keyboard shortcuts are often hidden features known only to power users. While documented in a help modal, they are not discoverable during normal interaction.
**Action:** Always use `aria-keyshortcuts` to programmatically expose shortcuts to assistive technology, and include the shortcut key in the `title` tooltip for mouse users (e.g., "Save (Ctrl+S)").
