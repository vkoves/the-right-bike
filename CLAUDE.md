# Find The Right Bike — Claude Guidelines

## Core Rules*

### If It Seems Common, Make It Common
If you are making logic that is not specific the page it's on, make it a common component, style,
or function that can be reused later. **THIS IS LAW**

### No duplicated data or logic
**Never duplicate constants, configuration, or business logic across files.**
If the same data is needed in more than one place, extract it to a shared constant or utility and import it everywhere it's needed.

Examples of what this means in practice:
- Bike type metadata lives in `src/constants/bikeTypes.js` — do not re-declare it in components
- Vehicle cost data lives in `src/constants/vehicleCosts.ts` — same rule
- If you find yourself copy-pasting a data structure, stop and extract it first

### No inline styles
**Never use `style="..."` attributes on elements.** Always use scoped CSS classes instead.

### Accessibility — colour contrast
**All text must meet WCAG AA contrast ratios** (4.5:1 for normal text, 3:1 for large/bold text).

- Avoid `$gray` (`#7f8c8d`) for text — it fails on white. Use `$text-secondary` (`#727272`) with `font-weight: 600` instead.
- Small text (under ~1rem) is especially risky — always pair a lighter colour with bold weight.
- Coloured text on tinted backgrounds (e.g. green text on `$primary-lighter`) requires a darker shade than on white — prefer `$primary-dark` over `$primary` in those contexts.

### Ctrl+Click must work on in-page navigation links
**When an `<a>` or `<router-link>` handles navigation in JavaScript, never use `@click.prevent`.**
Instead, check for modifier keys and only call `event.preventDefault()` on plain clicks. Use the shared `isPlainClick()` helper from `src/utils/navigation.ts`. This ensures Ctrl+Click / Cmd+Click / middle-click still open links in a new tab.

### Constants use PascalCase
**Use PascalCase for constants** (e.g. `StickyHeaderPxOffset`, `EstGrowthRate`), not SCREAMING_SNAKE_CASE.

### Component docblocks
**Every component must have a concise docblock** in its `<script setup>` block describing what it does. Props and emits must each have a `@prop` / `@emit` line. One sentence for the component; one line per input/output.

### No hardcoded selectors in E2E tests
**Never use raw CSS selectors in E2E test files.** All selectors must live in `tests/e2e/selectors.js`, organized by component/section. Import and reference them by name. This includes selectors passed into `executeScript` — pass them as arguments rather than hardcoding inside the browser function.
