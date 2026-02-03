## 2026-02-03 - Auto-focus in Custom Drawers
**Learning:** Custom UI drawers (non-native dialogs) don't manage focus automatically. Users expect input focus immediately upon opening a form-like drawer.
**Action:** Always add explicit `.focus()` logic when toggling visibility of custom input containers.
