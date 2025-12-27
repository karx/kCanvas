## 2024-05-23 - Focus styles for custom buttons
**Learning:** The custom buttons in `langton3d` (`.hud__btn`) lacked `:focus-visible` styles, making keyboard navigation difficult as the default browser focus ring was often insufficient or overridden by custom borders.
**Action:** When creating custom UI components, always verify that `:focus-visible` states are clearly distinguishable, especially in dark mode interfaces. Added explicit `outline` styles to ensure visibility.
