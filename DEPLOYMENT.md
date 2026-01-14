# GitHub Pages Deployment Instructions

## Quick Setup (5 minutes)

Your Rewatec calculator is ready to deploy! Follow these steps:

### Step 1: Enable GitHub Pages

1. Go to your repository: **https://github.com/Marteau19/PTWE_Germany**
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under "Source", select:
   - **Branch**: `claude/add-rewatec-calculator-MSFAd`
   - **Folder**: `/ (root)`
5. Click **Save**

### Step 2: Wait for Deployment

- GitHub will take 2-5 minutes to build and deploy
- You'll see a green message: "Your site is published at..."
- Your calculator will be live at:
  ```
  https://marteau19.github.io/PTWE_Germany/
  ```

### Step 3: Test Your Calculator

Once deployed, open the URL and test with sample data:
- **Example**: House 10m × 8m, Garden 100m², ZIP 80331 (Munich)
- Should recommend: NEO 1500 or larger depending on usage

---

## Alternative: Deploy from Main Branch

If you prefer to deploy from the main branch:

### Option 1: Merge via Pull Request (Recommended)

1. Go to: https://github.com/Marteau19/PTWE_Germany/pull/new/claude/add-rewatec-calculator-MSFAd
2. Create Pull Request
3. Review changes
4. Click "Merge Pull Request"
5. Then enable GitHub Pages from `main` branch (steps above)

### Option 2: Merge via Command Line

```bash
# Switch to main branch
git checkout main

# Merge the calculator
git merge claude/add-rewatec-calculator-MSFAd

# Push to main
git push origin main
```

Then follow Step 1 above, but select `main` branch instead.

---

## Troubleshooting

### Calculator doesn't load
- Check browser console for errors (F12)
- Ensure all files (HTML, CSS, JS, JSON) are in the same directory
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### JSON files not loading
- GitHub Pages needs a few minutes to process files
- Check the GitHub Actions tab for build status

### Changes not appearing
- Wait 2-5 minutes for GitHub to rebuild
- Clear browser cache
- Check you're viewing the correct URL

---

## Sharing with Your Client

Once live, share this link with your client:
```
https://marteau19.github.io/PTWE_Germany/
```

**Professional tip**: You can also set up a custom domain in GitHub Pages settings if desired (e.g., calculator.yourcompany.de)

---

## Next Steps After Validation

1. ✅ Client tests calculator
2. ✅ Gather feedback
3. ✅ Make any adjustments (edit files, commit, push)
4. ✅ Hand off to WordPress team for integration

Need help? Check the main README.md for customization options.
