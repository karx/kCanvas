## 2026-02-04 - Consistent Focus States in Custom UI
**Learning:** Custom UI components (like `.hud__btn`) often lose default browser focus indicators, making keyboard navigation impossible. Relying solely on `hover` states excludes keyboard users.
**Action:** Always verify keyboard focus visibility when styling custom buttons and ensure a consistent focus ring style (e.g., using `box-shadow` or `border-color`) is applied across all interactive elements.
