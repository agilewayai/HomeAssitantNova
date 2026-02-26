# HomeAssistant-Nova iPad Executable (PWA)

This build runs as an installable iPad app (standalone window) with offline support and localStorage persistence.

## Files
- `index.html`: single-page production build for iPad
- `manifest.webmanifest`: app install metadata
- `sw.js`: offline cache service worker
- `locales/*.json`: lazy-loaded compact locale packs (EN/JA/DE/FR/ES/IT)
- `icon.svg`: app icon source
- `start-ipad-server.command`: one-click local server

## Run and Install on iPad
1. On your Mac, double-click `start-ipad-server.command`.
2. Ensure iPad and Mac are on the same Wi-Fi.
3. Open `http://<MAC-IP>:8088/` in iPad Safari.
4. Tap **Share** -> **Add to Home Screen**.
5. Launch from the iPad home screen (standalone app mode).

## Notes
- For microphone voice input, use HTTPS or same-LAN trusted context.
- Data is stored locally on the iPad via localStorage.
- If you update files, hard refresh Safari once, then reopen from home screen.
