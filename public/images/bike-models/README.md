# Bike Model Images

Locally hosted product images for bike recommendations. All images are processed to a consistent format before saving.

## Goals

- **Consistent dimensions**: all images are 1000px wide so they render uniformly in recommendation cards.
- **Small file size**: WebP at quality 85 keeps images sharp while staying lightweight.
- **Clean backgrounds**: whitespace and transparency are trimmed so bikes fill the frame.
- **No third-party logos**: crop them out before committing.

## Quick Start

Use the conversion script from the repo root:

```bash
scripts/convert-bike-image.sh <input-file> <output-name>
```

This trims, resizes, and exports to `public/images/bike-models/<output-name>.webp`.

### Examples

```bash
# Basic conversion
scripts/convert-bike-image.sh ~/Downloads/photo.jpg velotric-triker

# Custom trim tolerance
scripts/convert-bike-image.sh ~/Downloads/render.png bunch-the-original --fuzz 2%

# Remove a logo region before trimming
scripts/convert-bike-image.sh ~/Downloads/logo.png my-bike --crop 1350x700+3400+0

# Preview the command without running it
scripts/convert-bike-image.sh ~/Downloads/photo.jpg my-bike --dry-run
```

### Options

| Flag | Description |
|---|---|
| `--crop WxH+X+Y` | Make a region transparent (e.g. to remove a logo) before trimming |
| `--fuzz N%` | Trim tolerance (default: `5%`) |
| `--dry-run` | Print the `convert` command without executing it |

## Processing Pipeline (Manual)

If you need to run the steps manually:

1. **Download** the original image at the highest available resolution
2. **Check for transparency** — `identify -verbose <file> | grep Type`
   - `TrueColorAlpha` — preserve alpha channel throughout
   - `TrueColor` — no special handling needed
3. **Trim whitespace/transparency**: `-fuzz 5% -trim +repage`
4. **Resize to 1000px wide** (height scales proportionally): `-resize 1000x`
5. **Export as WebP** at quality 85: `-quality 85 output.webp`

### Full manual example (with logo removal)
```bash
convert input.png \
  -alpha set \
  -region 1350x700+3400+0 -alpha transparent +region \
  -fuzz 2% -trim +repage \
  -resize 1000x \
  -quality 85 \
  output.webp
```

### Full manual example (no transparency)
```bash
convert input.jpg \
  -fuzz 5% -trim +repage \
  -resize 1000x \
  -quality 85 \
  output.webp
```
