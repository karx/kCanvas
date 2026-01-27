## 2024-10-18 - HUD Accessibility Patterns
**Learning:** The custom HUD implementation (`.hud` overlay) often uses dense layouts where standard `<label>` elements are visually omitted, leading to inputs with no accessible name.
**Action:** Systematically check all HUD inputs and apply `aria-label` to provide context for screen readers while preserving the compact visual design. Also, ensure interactive toggles (like Share panel) use `aria-expanded`.
