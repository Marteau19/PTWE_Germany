# WordPress Integration Guide - Rewatec Cistern Calculator

## Overview

This calculator is a standalone web application built with vanilla JavaScript, HTML, and CSS. It requires no backend server and can be easily integrated into any WordPress site.

## Architecture

### File Structure
```
cistern-calculator/
├── index.html              # Main HTML structure
├── styles.css              # All styling (layout, colors, responsive)
├── script.js               # Calculator logic and form handling
├── plzRainData.json        # Rainfall data for German postal codes (24,590 entries)
├── cisternProducts.json    # Product catalog with specifications
└── plzRainData_proto.json  # Source data (optional, for reference)
```

### How It Works

1. **Data Loading** (script.js lines 6-23)
   - On page load, fetches `cisternProducts.json` and `plzRainData.json`
   - Stores data in memory for fast calculations

2. **Form Submission** (script.js lines 26-45)
   - Validates all input fields
   - Calculates cistern requirements
   - Displays results with product recommendations

3. **Calculation Logic** (script.js lines 82-119)
   - Gets rainfall data by ZIP code lookup
   - Calculates roof area: `length × width`
   - Calculates rain yield: `roof area × runoff coefficient × rainfall`
   - Calculates water demand based on usage (toilet, washing machine, garden)
   - Recommends cistern size using formula: `((rainYield + demand) / 2) × 0.06`
   - Finds matching product from catalog

4. **Results Display** (script.js lines 209-278)
   - Shows all calculations
   - Displays recommended product with image and links
   - Provides email/sharing options

---

## WordPress Integration Methods

### Method 1: Upload to WordPress Media Library (Recommended for Small Sites)

#### Step 1: Prepare Files

1. **Create a folder** called `cistern-calculator`
2. **Copy these 4 files** into it:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `plzRainData.json`
   - `cisternProducts.json`

#### Step 2: Upload Files

1. **Via FTP/SFTP** (recommended):
   ```
   WordPress Root/
   └── wp-content/
       └── uploads/
           └── cistern-calculator/
               ├── index.html
               ├── styles.css
               ├── script.js
               ├── plzRainData.json
               └── cisternProducts.json
   ```

2. **Upload Location**: `/wp-content/uploads/cistern-calculator/`

#### Step 3: Create WordPress Page

1. **Create New Page** in WordPress
2. **Add Custom HTML Block**
3. **Insert this code**:

```html
<iframe
    src="/wp-content/uploads/cistern-calculator/index.html"
    width="100%"
    height="1200px"
    frameborder="0"
    style="border: none; max-width: 900px; margin: 0 auto; display: block;">
</iframe>
```

**Adjust iframe height** if needed (1200px usually fits the form + results).

---

### Method 2: Child Theme Integration (Recommended for Custom Sites)

#### Step 1: Create Child Theme Folder Structure

```
wp-content/
└── themes/
    └── your-child-theme/
        └── cistern-calculator/
            ├── calculator.php
            ├── css/
            │   └── styles.css
            ├── js/
            │   └── script.js
            └── data/
                ├── plzRainData.json
                └── cisternProducts.json
```

#### Step 2: Create calculator.php

Create file: `wp-content/themes/your-child-theme/cistern-calculator/calculator.php`

```php
<?php
/**
 * Template Name: Cistern Calculator
 * Description: Full-width cistern calculator page
 */

get_header();
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <?php
        // Get the calculator directory URL
        $calculator_url = get_stylesheet_directory_uri() . '/cistern-calculator';
        ?>

        <div class="rewatec-calculator-wrapper">
            <div class="container">
                <header>
                    <div class="logo">
                        <h1>REWATEC</h1>
                    </div>
                </header>

                <main>
                    <div class="configurator-card">
                        <h2>Cistern Configurator</h2>

                        <form id="cisternForm">
                            <!-- Roof Type -->
                            <div class="form-group">
                                <label for="roofType">Roof Type (Runoff Coefficient):</label>
                                <select id="roofType" required>
                                    <option value="">Select roof type</option>
                                    <option value="0.9">Flat Roof (0.9)</option>
                                    <option value="0.8">Pitched Roof - Tiles (0.8)</option>
                                    <option value="0.85">Pitched Roof - Metal (0.85)</option>
                                    <option value="0.95">Pitched Roof - Concrete (0.95)</option>
                                </select>
                            </div>

                            <!-- House Length -->
                            <div class="form-group">
                                <label for="houseLength">House Length (m):</label>
                                <input type="number" id="houseLength" min="0" step="0.1" required>
                            </div>

                            <!-- House Width -->
                            <div class="form-group">
                                <label for="houseWidth">House Width (m):</label>
                                <input type="number" id="houseWidth" min="0" step="0.1" required>
                            </div>

                            <!-- Garden Area -->
                            <div class="form-group">
                                <label for="gardenArea">Garden Area (m²):</label>
                                <input type="number" id="gardenArea" min="0" step="1" required>
                            </div>

                            <!-- ZIP Code -->
                            <div class="form-group">
                                <label for="zipCode">ZIP Code:</label>
                                <input type="text" id="zipCode" pattern="[0-9]{5}" maxlength="5" required>
                            </div>

                            <!-- Irrigation Demand -->
                            <div class="form-group">
                                <label for="irrigationDemand">Irrigation Demand:</label>
                                <select id="irrigationDemand" required>
                                    <option value="">Select irrigation demand</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <!-- Accessibility -->
                            <div class="form-group">
                                <label for="accessibility">Accessibility:</label>
                                <select id="accessibility" required>
                                    <option value="">Select accessibility</option>
                                    <option value="walkable">Walkable</option>
                                    <option value="vehicle">Vehicle</option>
                                </select>
                            </div>

                            <!-- Number of People -->
                            <div class="form-group">
                                <label for="numPeople">Number of People in Household:</label>
                                <input type="number" id="numPeople" min="1" max="20" required>
                            </div>

                            <!-- Connect Toilet -->
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" id="connectToilet">
                                    Connect Toilet
                                </label>
                            </div>

                            <!-- Connect Washing Machine -->
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" id="connectWashingMachine">
                                    Connect Washing Machine
                                </label>
                            </div>

                            <!-- Comfort Level -->
                            <div class="form-group full-width">
                                <label for="comfortLevel">Comfort Level:</label>
                                <select id="comfortLevel" required>
                                    <option value="">Select comfort level</option>
                                    <option value="basic">Basic - Simple system</option>
                                    <option value="comfortable">Comfortable - with filter-based and quiet inlet</option>
                                    <option value="premium">Premium - with advanced filtration</option>
                                </select>
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" class="btn-calculate">Calculate Cistern</button>
                        </form>

                        <!-- Results Section -->
                        <div id="results" class="results hidden">
                            <h3>Calculation Results</h3>

                            <div class="result-item">
                                <span class="result-label">House Area:</span>
                                <span class="result-value" id="resultHouseArea">-</span>
                            </div>

                            <div class="result-item">
                                <span class="result-label">Rain Amount:</span>
                                <span class="result-value" id="resultRainAmount">-</span>
                            </div>

                            <div class="result-item">
                                <span class="result-label">Rain Yield:</span>
                                <span class="result-value" id="resultRainTotal">-</span>
                            </div>

                            <div class="result-item">
                                <span class="result-label">Total Water Demand:</span>
                                <span class="result-value" id="resultWaterDemand">-</span>
                            </div>

                            <div class="result-item highlight">
                                <span class="result-label">Recommended Cistern Size:</span>
                                <span class="result-value" id="resultCisternSize">-</span>
                            </div>

                            <div class="result-item highlight">
                                <span class="result-label">Recommended Product:</span>
                                <span class="result-value" id="resultProduct">-</span>
                            </div>

                            <div class="result-actions">
                                <a href="#" id="downloadManual" class="btn-link" target="_blank">Download Manual</a>
                                <a href="#" id="viewProduct" class="btn-link" target="_blank">View Product</a>
                            </div>

                            <div class="product-image">
                                <img id="productImage" src="" alt="Recommended Product">
                            </div>

                            <button type="button" class="btn-email" id="emailResults">Email Results</button>
                        </div>
                    </div>
                </main>

                <footer>
                    <p>&copy; <?php echo date('Y'); ?> Rewatec - Rainwater Recovery Systems</p>
                </footer>
            </div>
        </div>

        <script>
            // Pass the calculator directory URL to JavaScript
            const CALCULATOR_BASE_URL = '<?php echo $calculator_url; ?>';
        </script>

    </main>
</div>

<?php
get_footer();
?>
```

#### Step 3: Enqueue Scripts and Styles

Add to your child theme's `functions.php`:

```php
<?php
/**
 * Enqueue Cistern Calculator assets
 */
function enqueue_cistern_calculator_assets() {
    // Only load on calculator pages
    if (is_page_template('cistern-calculator/calculator.php')) {

        $calculator_url = get_stylesheet_directory_uri() . '/cistern-calculator';

        // Enqueue CSS
        wp_enqueue_style(
            'cistern-calculator-styles',
            $calculator_url . '/css/styles.css',
            array(),
            '1.0.0'
        );

        // Enqueue JavaScript
        wp_enqueue_script(
            'cistern-calculator-script',
            $calculator_url . '/js/script.js',
            array(),
            '1.0.0',
            true // Load in footer
        );

        // Pass data file URLs to JavaScript
        wp_localize_script('cistern-calculator-script', 'calculatorData', array(
            'productsUrl' => $calculator_url . '/data/cisternProducts.json',
            'rainDataUrl' => $calculator_url . '/data/plzRainData.json'
        ));
    }
}
add_action('wp_enqueue_scripts', 'enqueue_cistern_calculator_assets');
```

#### Step 4: Modify script.js for WordPress

Update the data loading section in `script.js` (lines 6-23):

```javascript
// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get URLs from WordPress
        const baseUrl = typeof CALCULATOR_BASE_URL !== 'undefined'
            ? CALCULATOR_BASE_URL
            : '';

        const productsUrl = typeof calculatorData !== 'undefined'
            ? calculatorData.productsUrl
            : baseUrl + '/data/cisternProducts.json';

        const rainDataUrl = typeof calculatorData !== 'undefined'
            ? calculatorData.rainDataUrl
            : baseUrl + '/data/plzRainData.json';

        // Load cistern products
        const productsResponse = await fetch(productsUrl);
        cisternProducts = await productsResponse.json();

        // Load rain data
        const rainResponse = await fetch(rainDataUrl);
        rainData = await rainResponse.json();

        // Setup form submission
        document.getElementById('cisternForm').addEventListener('submit', handleFormSubmit);
        document.getElementById('emailResults').addEventListener('click', emailResults);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load configuration data. Please refresh the page.');
    }
});
```

#### Step 5: Create Page Using Template

1. **Go to WordPress Admin** → Pages → Add New
2. **Create new page**: "Cistern Calculator"
3. **In Page Attributes** → Template: Select "Cistern Calculator"
4. **Publish**

---

### Method 3: Plugin-Based Integration (Best for Multiple Sites)

#### Step 1: Create Plugin Structure

```
wp-content/
└── plugins/
    └── rewatec-cistern-calculator/
        ├── rewatec-calculator.php
        ├── assets/
        │   ├── css/
        │   │   └── styles.css
        │   ├── js/
        │   │   └── script.js
        │   └── data/
        │       ├── plzRainData.json
        │       └── cisternProducts.json
        └── templates/
            └── calculator-shortcode.php
```

#### Step 2: Create Main Plugin File

Create `rewatec-calculator.php`:

```php
<?php
/**
 * Plugin Name: Rewatec Cistern Calculator
 * Description: A cistern size calculator with German postal code rainfall data
 * Version: 1.0.0
 * Author: Your Company
 */

if (!defined('ABSPATH')) exit;

class RewatecCalculator {

    private $plugin_url;

    public function __construct() {
        $this->plugin_url = plugin_dir_url(__FILE__);

        add_shortcode('cistern_calculator', array($this, 'render_calculator'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
    }

    public function enqueue_assets() {
        // Only enqueue if shortcode is present
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'cistern_calculator')) {

            wp_enqueue_style(
                'rewatec-calculator-css',
                $this->plugin_url . 'assets/css/styles.css',
                array(),
                '1.0.0'
            );

            wp_enqueue_script(
                'rewatec-calculator-js',
                $this->plugin_url . 'assets/js/script.js',
                array(),
                '1.0.0',
                true
            );

            wp_localize_script('rewatec-calculator-js', 'calculatorData', array(
                'productsUrl' => $this->plugin_url . 'assets/data/cisternProducts.json',
                'rainDataUrl' => $this->plugin_url . 'assets/data/plzRainData.json'
            ));
        }
    }

    public function render_calculator($atts) {
        ob_start();
        include(plugin_dir_path(__FILE__) . 'templates/calculator-shortcode.php');
        return ob_get_clean();
    }
}

new RewatecCalculator();
```

#### Step 3: Create Shortcode Template

Create `templates/calculator-shortcode.php` - copy the entire HTML from `index.html` (excluding `<html>`, `<head>`, and `<body>` tags).

#### Step 4: Use the Shortcode

1. **Activate the plugin** in WordPress
2. **Add to any page/post**: `[cistern_calculator]`
3. The calculator will render inline

---

## Customization Guide

### Update Colors

Edit `styles.css` - CSS variables at the top:

```css
:root {
    --primary-blue: #3D5B75;        /* Main blue color */
    --accent-blue: #41A5D8;         /* Button color */
    --text-dark: #333333;           /* Text color */
    --border-color: #D0D0D0;        /* Border color */
}
```

### Update Product Catalog

Edit `cisternProducts.json`:

```json
{
  "name": "Product Name",
  "capacity": 3000,
  "type": "house",
  "accessibility": "walkable",
  "category": "comfortable",
  "imageUrl": "https://...",
  "productUrl": "https://...",
  "manualUrl": "https://..."
}
```

### Update Rainfall Data

Edit `plzRainData.json` - each entry:

```json
{
  "PLZ": "80331",
  "rainfall": 955.5
}
```

---

## Troubleshooting

### Calculator Not Loading

1. **Check browser console** (F12) for errors
2. **Verify file paths** are correct
3. **Check JSON files** are accessible (visit URL directly)

### Styling Conflicts

Add namespace to avoid WordPress theme conflicts:

```css
.rewatec-calculator-wrapper .form-group { ... }
```

### JSON Files Not Loading

1. **Check CORS** if serving from different domain
2. **Verify file permissions** (644 for files, 755 for directories)
3. **Check .htaccess** allows JSON files

### Mobile Issues

The calculator is fully responsive. If issues occur:
- Check viewport meta tag is present
- Clear browser cache
- Test in different browsers

---

## Performance Tips

1. **Cache JSON Files**: Use WordPress transients
2. **Minify Assets**: Use a build tool (Webpack, Gulp)
3. **Lazy Load Images**: Add loading="lazy" to product images
4. **CDN**: Serve static assets from CDN

---

## Security Considerations

1. **Validate Input**: All form validation is client-side (server validation not needed for calculator)
2. **Sanitize Output**: Use `esc_url()`, `esc_html()` in PHP
3. **File Permissions**: Set correctly (644 for files)
4. **HTTPS**: Ensure site uses HTTPS

---

## Support & Maintenance

### Updating Rainfall Data

To update rainfall data:
1. Edit `plzRainData.json`
2. Re-upload to server
3. Clear browser cache
4. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### Version Control

Keep backups of:
- `cisternProducts.json`
- `plzRainData.json`
- Custom modifications to `script.js`

---

## Technical Requirements

- **WordPress Version**: 5.0+
- **PHP Version**: 7.0+
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **No Database Required**: All data stored in JSON files
- **No External Dependencies**: Pure vanilla JavaScript

---

## Questions?

For technical support or customization requests, consult:
1. This documentation
2. Browser console errors (F12)
3. WordPress error logs
4. Your development team
