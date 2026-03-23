# The Right Bike — Claude Guidelines

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
