# WordPress Integration Guide – Rewatec Zisternen-Finder

## Overview

The Zisternen-Finder is a self-contained web application built with plain HTML, CSS, and JavaScript. It requires no backend, no database, and no build step. Integration into WordPress is straightforward.

---

## Files to deliver

```
cistern-calculator/
├── index.html              # Full HTML form and results markup
├── styles.css              # All styling (layout, branding, responsive)
├── script.js               # Calculator logic, form handling, email
├── cisternProducts.json    # Product catalogue (57 entries)
└── plzRainData.json        # Annual rainfall by German ZIP code (24,590 entries)
```

> **Note:** `plzRainData.json` is ~1.5 MB. Keep all five files together in the same directory.

---

## Recommended integration method: iframe

This is the lowest-risk approach. It fully isolates the calculator from the WordPress theme so there are no CSS or JavaScript conflicts.

### Step 1 – Upload files

Upload the five files above via FTP/SFTP to:

```
/wp-content/uploads/cistern-calculator/
```

### Step 2 – Embed in a WordPress page

Create or edit a page, switch to the **Custom HTML** block, and paste:

```html
<iframe
    src="/wp-content/uploads/cistern-calculator/index.html"
    width="100%"
    height="900px"
    frameborder="0"
    style="border:none; display:block; max-width:900px; margin:0 auto;">
</iframe>
```

Adjust the `height` value if the results section gets cut off (900 px covers the form; ~1400 px covers form + results).

---

## Alternative method: shortcode plugin

Use this if the WordPress firm prefers native WordPress integration without an iframe.

### Step 1 – File structure

Place the files inside a plugin directory:

```
/wp-content/plugins/rewatec-calculator/
├── rewatec-calculator.php
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── data/
    ├── cisternProducts.json
    └── plzRainData.json
```

### Step 2 – Plugin file

Create `/wp-content/plugins/rewatec-calculator/rewatec-calculator.php`:

```php
<?php
/**
 * Plugin Name: Rewatec Zisternen-Finder
 * Description: Cistern size configurator for Rewatec products
 * Version: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function rewatec_enqueue_assets() {
    global $post;
    if ( ! is_a( $post, 'WP_Post' ) || ! has_shortcode( $post->post_content, 'rewatec_calculator' ) ) {
        return;
    }

    $base = plugin_dir_url( __FILE__ );

    wp_enqueue_style(  'rewatec-calc-css', $base . 'css/styles.css', [], '1.0.0' );
    wp_enqueue_script( 'rewatec-calc-js',  $base . 'js/script.js',  [], '1.0.0', true );

    // Pass JSON file URLs into JavaScript
    wp_localize_script( 'rewatec-calc-js', 'rewatecData', [
        'productsUrl' => $base . 'data/cisternProducts.json',
        'rainDataUrl' => $base . 'data/plzRainData.json',
    ]);
}
add_action( 'wp_enqueue_scripts', 'rewatec_enqueue_assets' );

function rewatec_calculator_shortcode() {
    ob_start();
    include plugin_dir_path( __FILE__ ) . 'templates/calculator.php';
    return ob_get_clean();
}
add_shortcode( 'rewatec_calculator', 'rewatec_calculator_shortcode' );
```

### Step 3 – Update script.js data loading

At the top of `script.js`, change the two fetch calls from relative paths to use the WordPress-injected URLs:

```javascript
// Replace:
const productsResponse = await fetch('cisternProducts.json');
const rainResponse     = await fetch('plzRainData.json');

// With:
const productsUrl = (typeof rewatecData !== 'undefined') ? rewatecData.productsUrl : 'cisternProducts.json';
const rainUrl     = (typeof rewatecData !== 'undefined') ? rewatecData.rainDataUrl  : 'plzRainData.json';

const productsResponse = await fetch(productsUrl);
const rainResponse     = await fetch(rainUrl);
```

### Step 4 – Create the shortcode template

Create `/wp-content/plugins/rewatec-calculator/templates/calculator.php` and paste the contents of `index.html` (everything inside `<body>`, excluding the `<script src="script.js">` tag at the bottom — that is handled by `wp_enqueue_script`).

### Step 5 – Use the shortcode

Add `[rewatec_calculator]` to any page or post.

---

## Updating the product catalogue

Edit `cisternProducts.json`. Each entry follows this structure:

| Field      | Type   | Description |
|------------|--------|-------------|
| `name`     | string | Display name |
| `size`     | number | Tank volume in litres |
| `minsize`  | number | Minimum recommended size to show this product |
| `access`   | string | `"walkable"` or `"car-accessible"` |
| `comfort`  | string | `"economical"`, `"comfortable"`, `"hauswasserwerk"`, or `"tauchpumpe"` |
| `image1`   | string | Primary product image URL |
| `image2`   | string | Secondary/kit image URL |
| `tender`   | string | Link to tender text (ausschreiben.de) — leave `""` if none |
| `website`  | string | Rewatec product page URL |
| `pdf`      | string | Installation manual PDF URL |

---

## Updating rainfall data

Edit `plzRainData.json`. Each entry:

```json
{ "PLZ": "21220", "rainfall": 712 }
```

`rainfall` is the annual average in mm. If a ZIP code is not found, the calculator falls back to 700 mm (German national average).

---

## Branding / colours

All colours are CSS variables at the top of `styles.css`:

```css
:root {
    --primary-blue:  #3D5B75;
    --primary-dark:  #2C4459;
    --accent-blue:   #41A5D8;
    --bg-light:      #F0F4F8;
    --text-dark:     #333333;
    --border-color:  #D0D0D0;
}
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Calculator shows error on load | JSON files not found | Verify file paths and that all 5 files are uploaded |
| Styles look broken | Theme CSS conflict | Use the iframe method, or prefix all CSS selectors with a wrapper class |
| JSON not loading (CORS error) | Files served from different domain | Serve all files from the same domain as WordPress |
| File permissions error | Wrong server permissions | Set files to 644, directories to 755 |

---

## Technical requirements

- WordPress 5.0+, PHP 7.4+
- No npm, no build step, no external CDN dependencies
- Modern browsers (Chrome, Firefox, Safari, Edge — latest two versions)
