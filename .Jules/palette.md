## 2024-10-25 - [Accessibility] Discoverable Shortcuts
**Learning:** `aria-keyshortcuts` is a powerful, low-effort way to bridge the gap between "power user" features (keyboard shortcuts) and accessibility. It exposes existing shortcuts programmatically without requiring UI changes.
**Action:** Audit all HUD/toolbar buttons for existing keyboard listeners and add corresponding `aria-keyshortcuts` attributes.

## 2024-10-25 - [Accessibility] Invisible Inputs
**Learning:** Inputs in "compact" panels often rely on placeholders or button proximity for context, failing WCAG 3.3.2 (Labels or Instructions). `aria-label` solves this without cluttering the visual UI.
**Action:** Always check `input` elements in drawers/modals for `label` tags; if missing for design reasons, mandate `aria-label`.
