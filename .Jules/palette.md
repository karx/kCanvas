## 2024-05-22 - [Exposing Keyboard Shortcuts]
**Learning:** This application implements custom keyboard shortcuts (Space, N, R, H) via JavaScript but relies on visual hints or tooltips to communicate them. Screen reader users would have no way of knowing these shortcuts exist on the buttons without `aria-keyshortcuts`.
**Action:** Always verify that keyboard shortcuts handled in JS are exposed via `aria-keyshortcuts` on the corresponding interactive elements, or documented in a way accessible to screen readers (e.g., in a help modal that is easily discoverable).
