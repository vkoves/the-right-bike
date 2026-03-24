# Find The Right Bike — Claude Guidelines

## Core Rules

### No duplicated data or logic
**Never duplicate constants, configuration, or business logic across files.**
If the same data is needed in more than one place, extract it to a shared constant or utility and import it everywhere it's needed.

Examples of what this means in practice:
- Bike type metadata lives in `src/constants/bikeTypes.js` — do not re-declare it in components
- Bike cost data lives in `src/constants/bikeCosts.js` — same rule
- If you find yourself copy-pasting a data structure, stop and extract it first

### No inline styles
**Never use `style="..."` attributes on elements.** Always use scoped CSS classes instead.

### Accessibility — colour contrast
**All text must meet WCAG AA contrast ratios** (4.5:1 for normal text, 3:1 for large/bold text).

- Avoid `$gray` (`#7f8c8d`) for text — it fails on white. Use `$text-secondary` (`#727272`) with `font-weight: 600` instead.
- Small text (under ~1rem) is especially risky — always pair a lighter colour with bold weight.
- Coloured text on tinted backgrounds (e.g. green text on `$primary-lighter`) requires a darker shade than on white — prefer `$primary-dark` over `$primary` in those contexts.

### Constants use PascalCase
**Use PascalCase for constants** (e.g. `StickyHeaderPxOffset`, `EstGrowthRate`), not SCREAMING_SNAKE_CASE.
