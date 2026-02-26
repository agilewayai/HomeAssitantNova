#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-8088}"

IP="$(ipconfig getifaddr en0 2>/dev/null || true)"
if [ -z "$IP" ]; then
  IP="$(ipconfig getifaddr en1 2>/dev/null || true)"
fi
if [ -z "$IP" ]; then
  IP="localhost"
fi

echo "Serving HomeAssistant-Nova iPad build..."
echo "Open this on iPad Safari: http://${IP}:${PORT}/"
echo "Press Ctrl+C to stop."

cd "$SCRIPT_DIR"
python3 -m http.server "$PORT"
