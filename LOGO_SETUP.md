# Logo Setup Instructions

## Adding Your Rewatec Logo

The calculator is now configured to use your actual Rewatec logo image.

### Required File

**File name:** `rewatec-logo.png`

**Recommended specifications:**
- Format: PNG (with transparent background) or SVG
- Height: 100-150px (will auto-scale to 50px display height)
- Width: Any (will maintain aspect ratio)
- Background: Transparent or white

### File Placement

#### Option 1: Same Directory (Standalone)
Place the logo file in the same directory as `index.html`:
```
/
├── index.html
├── styles.css
├── script.js
├── rewatec-logo.png  ← Place logo here
├── plzRainData.json
└── cisternProducts.json
```

#### Option 2: WordPress Upload Directory
If using WordPress, upload to:
```
/wp-content/uploads/cistern-calculator/rewatec-logo.png
```

#### Option 3: WordPress Child Theme
If using child theme integration:
```
/wp-content/themes/your-child-theme/cistern-calculator/rewatec-logo.png
```

#### Option 4: WordPress Plugin
If using plugin method:
```
/wp-content/plugins/rewatec-cistern-calculator/assets/rewatec-logo.png
```

### Using a Different File Name or Path

If you need to use a different file name or path, edit `index.html` line 12:

**Current:**
```html
<img src="rewatec-logo.png" alt="REWATEC" class="logo-img">
```

**Examples:**
```html
<!-- Different filename -->
<img src="logo.png" alt="REWATEC" class="logo-img">

<!-- Different path -->
<img src="images/rewatec-logo.png" alt="REWATEC" class="logo-img">

<!-- Full URL -->
<img src="https://yoursite.com/wp-content/uploads/rewatec-logo.png" alt="REWATEC" class="logo-img">

<!-- SVG format -->
<img src="rewatec-logo.svg" alt="REWATEC" class="logo-img">
```

### Logo Styling

The logo will:
- Display at 50px height on desktop
- Display at 40px height on mobile
- Automatically maintain aspect ratio
- Center horizontally in the blue header
- Work with any width (responsive)

### Adjusting Logo Size

To change the logo size, edit `styles.css`:

```css
/* Desktop size */
.logo-img {
    height: 50px;  /* Change this value */
    max-width: 100%;
    object-fit: contain;
}

/* Mobile size */
@media (max-width: 768px) {
    .logo-img {
        height: 40px;  /* Change this value */
    }
}
```

### Troubleshooting

**Logo not showing?**
1. Check the file path is correct
2. Verify the file name matches exactly (case-sensitive)
3. Make sure the image file uploaded successfully
4. Check browser console (F12) for 404 errors
5. Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Logo too large or small?**
- Adjust the `height` value in CSS (see above)

**Logo quality poor?**
- Use a higher resolution image (2x or 3x size)
- Use SVG format for perfect scaling
- Ensure transparent background for best appearance

### Example Logo Export Settings

**From Adobe Illustrator / Photoshop:**
- Format: PNG-24 with transparency
- Resolution: 72 DPI (web)
- Size: 300px height (will auto-scale)

**From SVG:**
- SVG files work perfectly and scale to any size
- Recommended for best quality

---

## Quick Setup Checklist

- [ ] Save your Rewatec logo as `rewatec-logo.png`
- [ ] Upload to the correct directory
- [ ] Verify the file path in `index.html` matches your setup
- [ ] Refresh the calculator page
- [ ] Check that logo displays correctly
- [ ] Test on mobile devices

---

Your calculator will now display the professional Rewatec logo in the blue header!
