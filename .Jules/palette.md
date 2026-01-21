## 2024-05-23 - [Langton3d Accessibility Gaps]
**Learning:** The custom HUD/Drawer system relies heavily on `div` structures and inputs without explicit `<label>` tags. Keyboard focus indicators were missing globally, making navigation invisible for keyboard users.
**Action:** Always check custom UI panels for missing `aria-label` on inputs and ensure a global `:focus-visible` style exists to support keyboard navigation.
