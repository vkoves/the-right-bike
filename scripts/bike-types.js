/**
 * Extracts bike type IDs and titles from bikeTypes.ts for use in build scripts.
 *
 * Parses the source file directly so Node CJS scripts don't need a TS toolchain,
 * while still staying in sync with the single source of truth.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src', 'constants', 'bikeTypes.ts');
const source = fs.readFileSync(SRC, 'utf-8');

// Match each  'slug': { ... title: '...' ... } block
const bikeTypes = {};
const entryRe = /'([a-z-]+)':\s*\{[^}]*?title:\s*'([^']+)'/g;
let match;
while ((match = entryRe.exec(source)) !== null) {
  bikeTypes[match[1]] = { title: match[2] };
}

if (Object.keys(bikeTypes).length === 0) {
  throw new Error('Failed to parse any bike types from ' + SRC);
}

module.exports = { bikeTypes };
