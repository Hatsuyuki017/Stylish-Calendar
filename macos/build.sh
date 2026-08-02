#!/bin/bash
# build.sh — assemble "Study Ledger.app" from the Swift sources and the web app.
#
#   ./macos/build.sh              build into macos/build/
#   ./macos/build.sh --test       build, then run the headless self-test
#   ./macos/build.sh --run        build, then launch it
#
# No Xcode project and no package manager: swiftc plus a hand-laid bundle. The
# only requirement is the Swift toolchain that ships with Xcode.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
BUILD="$HERE/build"
APP="$BUILD/Study Ledger.app"
CONTENTS="$APP/Contents"
RES="$CONTENTS/Resources"

MIN_MACOS="12.0"

echo "── Study Ledger ─────────────────────────────────"

# ---- clean slate -------------------------------------------------------
rm -rf "$APP"
mkdir -p "$CONTENTS/MacOS" "$RES/web"

# ---- the web app becomes a bundle resource ------------------------------
echo "  · staging web assets"
cp "$ROOT/index.html" "$ROOT/gadget.html" "$RES/web/"
cp -R "$ROOT/css" "$ROOT/js" "$RES/web/"

# ---- icon ---------------------------------------------------------------
ICONSET="$BUILD/AppIcon.iconset"
if [ ! -f "$BUILD/icon-1024.png" ]; then
  echo "  · drawing icon"
  python3 "$HERE/make-icon.py" "$BUILD/icon-1024.png" >/dev/null
fi
rm -rf "$ICONSET"; mkdir -p "$ICONSET"
for sz in 16 32 128 256 512; do
  sips -z $sz $sz "$BUILD/icon-1024.png" --out "$ICONSET/icon_${sz}x${sz}.png" >/dev/null 2>&1
  sips -z $((sz*2)) $((sz*2)) "$BUILD/icon-1024.png" --out "$ICONSET/icon_${sz}x${sz}@2x.png" >/dev/null 2>&1
done
iconutil -c icns "$ICONSET" -o "$RES/AppIcon.icns"
rm -rf "$ICONSET"

# ---- Info.plist ---------------------------------------------------------
cat > "$CONTENTS/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key>                  <string>Study Ledger</string>
  <key>CFBundleDisplayName</key>           <string>Study Ledger</string>
  <key>CFBundleIdentifier</key>            <string>app.studyledger.mac</string>
  <key>CFBundleVersion</key>               <string>1.0.0</string>
  <key>CFBundleShortVersionString</key>    <string>1.0.0</string>
  <key>CFBundlePackageType</key>           <string>APPL</string>
  <key>CFBundleExecutable</key>            <string>StudyLedger</string>
  <key>CFBundleIconFile</key>              <string>AppIcon</string>
  <key>LSMinimumSystemVersion</key>        <string>$MIN_MACOS</string>
  <key>NSHighResolutionCapable</key>       <true/>
  <key>NSHumanReadableCopyright</key>      <string>Study Ledger</string>
  <!-- Google Fonts is the only thing it ever reaches for, and it degrades to
       system faces without it. -->
  <key>NSAppTransportSecurity</key>
  <dict><key>NSAllowsArbitraryLoads</key><false/></dict>
</dict>
</plist>
PLIST

# ---- compile ------------------------------------------------------------
echo "  · compiling Swift"
ARCHS=()
for a in arm64 x86_64; do ARCHS+=(-target "$a-apple-macos$MIN_MACOS"); done

# A universal binary when both slices build; otherwise just this machine's.
build_slice () {          # $1 = arch, $2 = output
  swiftc -O -whole-module-optimization \
    -target "$1-apple-macos$MIN_MACOS" \
    -o "$2" \
    "$HERE"/Sources/*.swift 2>&1
}

TMPBIN="$BUILD/bin"; mkdir -p "$TMPBIN"
SLICES=()
for arch in arm64 x86_64; do
  if build_slice "$arch" "$TMPBIN/StudyLedger-$arch" >"$TMPBIN/$arch.log" 2>&1; then
    SLICES+=("$TMPBIN/StudyLedger-$arch")
    echo "      $arch ✓"
  else
    echo "      $arch — skipped (no SDK slice)"
    tail -3 "$TMPBIN/$arch.log" | sed 's/^/        /'
  fi
done

if [ ${#SLICES[@]} -eq 0 ]; then
  echo "  ✗ compilation failed"
  cat "$TMPBIN"/*.log
  exit 1
fi

if [ ${#SLICES[@]} -gt 1 ]; then
  lipo -create "${SLICES[@]}" -output "$CONTENTS/MacOS/StudyLedger"
else
  cp "${SLICES[0]}" "$CONTENTS/MacOS/StudyLedger"
fi
chmod +x "$CONTENTS/MacOS/StudyLedger"
rm -rf "$TMPBIN"

# ---- sign ---------------------------------------------------------------
# Files copied out of iCloud Drive carry extended attributes that codesign
# rejects outright, so strip them first. Ad-hoc signing is enough to run
# locally — and required at all on Apple silicon. Swap in a Developer ID
# identity to distribute it.
xattr -cr "$APP" 2>/dev/null || true
if codesign --force --deep --sign - "$APP" 2>/dev/null; then
  echo "  · signed (ad-hoc)"
else
  echo "  ✗ codesign failed — the app will not launch on Apple silicon"
  codesign --force --deep --sign - "$APP" 2>&1 | sed 's/^/      /'
  exit 1
fi

SIZE=$(du -sh "$APP" | cut -f1)
echo "  ✓ $APP  ($SIZE)"
echo

case "${1:-}" in
  --test)
    SCRATCH="$(mktemp -d)"
    echo "── self-test (data in $SCRATCH) ─────────────────"
    LEDGER_DATA_DIR="$SCRATCH" "$CONTENTS/MacOS/StudyLedger" --self-test
    code=$?
    rm -rf "$SCRATCH"
    exit $code
    ;;
  --run)
    open "$APP"
    ;;
esac
