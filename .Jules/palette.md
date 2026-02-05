## 2026-02-05 - Hidden Labels in Utility Panels
**Learning:** Utility inputs (like copy-paste URLs) often rely on context/placeholders and miss accessible labels, which blocks screen reader users. Also, `outline: none` without a focus replacement is a common oversight in these custom panels.
**Action:** Always audit "utility" or "tool" panels for inputs that might have been treated as "visual only" and ensure they have `aria-label` and visible focus states.
