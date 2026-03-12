# Bike Model Images

Locally hosted product images for bike recommendations. All images are processed to a consistent format before saving.

## Processing Pipeline

1. **Download** the original image at the highest available resolution
2. **Check for transparency** — `identify -verbose <file> | grep Type`
   - `TrueColorAlpha` → preserve alpha channel throughout
   - `TrueColor` → no special handling needed
3. **Remove unwanted elements** (logos, badges etc.) — for transparent images, erase the region to transparent rather than filling with white:
   ```
   -region <WxH+X+Y> -alpha transparent +region
   ```
4. **Trim whitespace/transparency**:
   ```
   -fuzz 5% -trim +repage
   ```
5. **Resize to 1000px wide** (height scales proportionally):
   ```
   -resize 1000x
   ```
6. **Export as WebP** at quality 85:
   ```
   -quality 85 output.webp
   ```

### Full example (with logo removal)
```bash
convert input.png \
  -alpha set \
  -region 1350x700+3400+0 -alpha transparent +region \
  -fuzz 2% -trim +repage \
  -resize 1000x \
  -quality 85 \
  output.webp
```

### Full example (no transparency)
```bash
convert input.jpg \
  -fuzz 5% -trim +repage \
  -resize 1000x \
  -quality 85 \
  output.webp
```
