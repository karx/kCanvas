## 2024-05-22 - Keyboard Accessibility Gap
**Learning:** Custom button classes like .hud__btn often miss default focus styles and programmatic keyboard shortcut hints, creating a gap between visual instructions (e.g., "Press Space") and assistive technology awareness.
**Action:** Always pair custom button styles with :focus-visible rules and ensure listed shortcuts are reflected in aria-keyshortcuts attributes.
