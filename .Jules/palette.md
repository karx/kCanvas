## 2026-02-06 - Manual Focus Management for Custom Drawers
**Learning:** Custom UI components like drawers (`.drawer` in this repo) do not manage focus automatically like native `<dialog>` elements. Users can get lost if focus isn't moved to the drawer content.
**Action:** When toggling a custom drawer open, explicitly focus the first interactive element (e.g., input) to improve keyboard accessibility and usability.
