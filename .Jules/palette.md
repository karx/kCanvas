
## 2026-02-04 - Consistent Focus States in Custom UI
**Learning:** Custom UI components (like `.hud__btn`) often lose default browser focus indicators, making keyboard navigation impossible. Relying solely on `hover` states excludes keyboard users.
**Action:** Always verify keyboard focus visibility when styling custom buttons and ensure a consistent focus ring style (e.g., using `box-shadow` or `border-color`) is applied across all interactive elements.
=======
## 2026-02-06 - Manual Focus Management for Custom Drawers
**Learning:** Custom UI components like drawers (`.drawer` in this repo) do not manage focus automatically like native `<dialog>` elements. Users can get lost if focus isn't moved to the drawer content.
**Action:** When toggling a custom drawer open, explicitly focus the first interactive element (e.g., input) to improve keyboard accessibility and usability.

