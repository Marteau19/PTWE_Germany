# Deployment Guide

## Repository

**GitHub:** https://github.com/Marteau19/PTWE_Germany  
**Main branch:** `main`

---

## Option 1: GitHub Pages (for testing / preview)

1. Go to the repository → **Settings** → **Pages**
2. Source: branch `main`, folder `/ (root)`
3. Save — the calculator will be live at:
   ```
   https://marteau19.github.io/PTWE_Germany/
   ```

---

## Option 2: Hand off to WordPress firm

See **WORDPRESS_INTEGRATION.md** for full instructions.

**Files to provide:**

| File | Size |
|------|------|
| `index.html` | ~6 KB |
| `styles.css` | ~12 KB |
| `script.js` | ~10 KB |
| `cisternProducts.json` | ~30 KB |
| `plzRainData.json` | ~1.5 MB |

**Quickest way to share:**  
Create a ZIP of those five files and send it, or share the GitHub repository URL directly.

---

## Option 3: Traditional web hosting

Upload all five files to the same directory on any web server. No server-side processing required.

---

## Testing locally

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Then open `http://localhost:8000`.

> Opening `index.html` directly (file://) will fail because browsers block local JSON fetches. Always use a local server.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Calculator doesn't load | Open browser console (F12) and check for errors |
| JSON not found (404) | Verify all 5 files are in the same directory |
| Changes not appearing | Hard refresh: Ctrl+Shift+R / Cmd+Shift+R |
