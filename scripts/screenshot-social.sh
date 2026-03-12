#!/bin/bash
# Takes a screenshot of /social-image and saves it to public/images/social.png
# Requires the dev server to be running on localhost:5173

URL="http://localhost:5173/social-image"
OUT="$(dirname "$0")/../public/images/social.png"

echo "Waiting for page to load..."
sleep 3

google-chrome \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --hide-scrollbars \
  --window-size=1000,522 \
  --screenshot="$OUT" \
  "$URL"

echo "Saved to $OUT"
