## 2024-05-22 - Accessibility in Custom Canvas UIs
**Learning:** Custom 3D/Canvas experiments often neglect standard accessible patterns because they rely on global keyboard listeners rather than focused elements. Explicitly exposing these shortcuts via `aria-keyshortcuts` bridges the gap between the "invisible" event listener and the screen reader user.
**Action:** When working on Canvas/WebGL experiments that implement global key listeners, always audit the UI controls to ensure they document these shortcuts programmatically (aria-keyshortcuts) and visually (tooltips).
