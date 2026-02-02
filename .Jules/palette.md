## 2024-10-24 - [Manual UI State Management]
**Learning:** The 'langton3d' experiment relies on manual DOM manipulation for UI states (loading, disabled) rather than reactive frameworks or CSS state classes.
**Action:** When implementing async features, manually toggle `disabled` attributes and text content to prevent race conditions and provide feedback.

## 2024-10-24 - [Implicit Form Labels]
**Learning:** HUD inputs in 'langton3d' often lack associated `<label>` elements, relying on visual layout.
**Action:** Always check for and add `aria-label` to inputs in the HUD or side panels to ensure screen reader accessibility.
