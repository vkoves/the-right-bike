#!/usr/bin/env bash
set -euo pipefail

# Convert a bike model image to the project's standard format:
#   - Trim whitespace/transparency
#   - Resize to 1000px wide
#   - Export as WebP at quality 85
#   - Preserve alpha channel when present

Usage="Usage: $(basename "$0") <input-file> <output-name>

Arguments:
  input-file    Source image (any format ImageMagick supports)
  output-name   Output filename without extension (saved as .webp)

Options:
  --gear            Output to public/images/gear/ at 500px wide
                    (default: public/images/bike-models/ at 1000px)
  --crop WxH+X+Y   Remove a region (e.g. a logo) by making it
                    transparent before trimming. Implies alpha.
  --fuzz N%         Trim tolerance (default: 5%)
  --dry-run         Print the convert command without running it

Examples:
  $(basename "$0") ~/Downloads/photo.jpg velotric-triker
  $(basename "$0") ~/Downloads/render.png bunch-the-original --fuzz 2%
  $(basename "$0") ~/Downloads/logo.png my-bike --crop 1350x700+3400+0
  $(basename "$0") ~/Downloads/trailer.jpg bike-trailer --gear"

# --- Defaults ---
Fuzz="5%"
CropRegion=""
DryRun=false
GearMode=false

# --- Parse args ---
Positional=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --gear)   GearMode=true; shift ;;
    --crop)   CropRegion="$2"; shift 2 ;;
    --fuzz)   Fuzz="$2"; shift 2 ;;
    --dry-run) DryRun=true; shift ;;
    -h|--help) echo "$Usage"; exit 0 ;;
    -*) echo "Unknown option: $1" >&2; echo "$Usage" >&2; exit 1 ;;
    *)  Positional+=("$1"); shift ;;
  esac
done

if [[ ${#Positional[@]} -ne 2 ]]; then
  echo "$Usage" >&2
  exit 1
fi

InputFile="${Positional[0]}"
OutputName="${Positional[1]}"

if [[ ! -f "$InputFile" ]]; then
  echo "Error: file not found: $InputFile" >&2
  exit 1
fi

# Resolve output path relative to repo root
ScriptDir="$(cd "$(dirname "$0")" && pwd)"
RepoRoot="$(cd "$ScriptDir/.." && pwd)"

if [[ "$GearMode" == true ]]; then
  OutputDir="$RepoRoot/public/images/gear"
  ResizeWidth="500x"
else
  OutputDir="$RepoRoot/public/images/bike-models"
  ResizeWidth="1000x"
fi

OutputFile="$OutputDir/${OutputName}.webp"

if [[ -f "$OutputFile" ]]; then
  echo "Warning: $OutputFile already exists, will overwrite" >&2
fi

# --- Detect alpha channel ---
HasAlpha=false
if identify -verbose "$InputFile" 2>/dev/null | grep -q 'Type:.*Alpha'; then
  HasAlpha=true
fi

# A crop region implies we need alpha to punch a hole
if [[ -n "$CropRegion" ]]; then
  HasAlpha=true
fi

# --- Build convert command ---
Cmd=(convert "$InputFile")

if [[ "$HasAlpha" == true ]]; then
  Cmd+=(-alpha set)
fi

if [[ -n "$CropRegion" ]]; then
  Cmd+=(-region "$CropRegion" -alpha transparent +region)
fi

Cmd+=(-fuzz "$Fuzz" -trim +repage)
Cmd+=(-resize "$ResizeWidth")
Cmd+=(-quality 85)
Cmd+=("$OutputFile")

if [[ "$DryRun" == true ]]; then
  echo "${Cmd[@]}"
  exit 0
fi

"${Cmd[@]}"

# Report result
FinalSize=$(du -h "$OutputFile" | cut -f1)
Dimensions=$(identify -format '%wx%h' "$OutputFile")
echo "Saved ${OutputFile##*/} (${Dimensions}, ${FinalSize})"
