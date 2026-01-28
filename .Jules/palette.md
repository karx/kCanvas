## 2024-10-18 - Missing Focus Styles on HUD Inputs
**Learning:** The 'langton3d' experiment uses custom inputs (`.panel__input`) that remove the default outline but fail to provide a custom focus state, unlike `.spawn__input`. Additionally, these inputs lack associated labels, making them inaccessible to screen readers and keyboard users.
**Action:** Ensure all custom inputs in HUD/Panels have explicit `:focus` or `:focus-visible` styles matching the design system (e.g., `rgba(160, 196, 255, 0.55)`) and accessible names (via `aria-label` if visual labels are absent).
