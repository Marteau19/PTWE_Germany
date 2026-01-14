# Rewatec Cistern Configurator

A clean, modern web calculator for determining the optimal Rewatec rainwater recovery system based on property specifications and usage requirements.

## Features

- **Interactive Form**: Easy-to-use interface for entering property and usage data
- **Smart Calculations**: Automatically calculates optimal cistern size based on:
  - Roof area and type
  - Regional rainfall data (German ZIP codes)
  - Water usage requirements (garden, toilet, washing machine)
  - Household size
- **Product Recommendations**: Suggests the best Rewatec product based on your needs
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, minimalist design matching Rewatec branding

## Project Structure

```
PTWE_Germany/
├── index.html              # Main HTML file
├── styles.css              # Stylesheet with Rewatec branding
├── script.js               # JavaScript logic and calculations
├── cisternProducts.json    # Product catalog data
├── plzRainData.json       # German ZIP code to rainfall mapping
└── README.md              # This file
```

## How It Works

### Calculation Logic

1. **Roof Area**: Calculated from house length × width
2. **Rainfall Collection**: Roof area × runoff coefficient × annual rainfall
3. **Water Demand**: Sum of:
   - Garden irrigation (based on area and demand level)
   - Toilet usage (40L/person/day if connected)
   - Washing machine (50L/person/week if connected)
4. **Recommended Size**: Minimum of demand-based or rain-based sizing with 21-day storage buffer
5. **Product Selection**: Matches requirements to optimal Rewatec product

### Input Parameters

- **Roof Type**: Flat roof, pitched roof (tiles/metal/concrete)
- **House Dimensions**: Length and width in meters
- **Garden Area**: In square meters
- **ZIP Code**: German postal code (5 digits)
- **Irrigation Demand**: Low, medium, or high
- **Accessibility**: Walkable or vehicle access
- **Toilet Connection**: Yes/No
- **Washing Machine Connection**: Yes/No
- **Household Size**: Number of people
- **Comfort Level**: Basic, comfortable, or premium system

## Deployment Options

### Option 1: GitHub Pages (Recommended)

1. Create a new repository on GitHub
2. Push all files to the repository
3. Go to Settings > Pages
4. Select branch `main` and folder `/ (root)`
5. Save and wait a few minutes
6. Your calculator will be available at: `https://yourusername.github.io/repository-name/`

**Quick commands:**
```bash
git add .
git commit -m "Add Rewatec calculator"
git push origin main
```

### Option 2: Netlify

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up/login
3. Drag and drop the project folder
4. Get instant shareable link

### Option 3: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel` in the project directory
3. Follow prompts
4. Get instant deployment URL

### Option 4: Traditional Web Hosting

Upload all files to your web hosting via FTP/cPanel. Ensure all files are in the same directory.

## Testing Locally

To test the calculator on your local machine:

1. **Simple Method**: Open `index.html` directly in a web browser
   - Note: Some browsers may block loading JSON files locally due to CORS

2. **Recommended Method**: Use a local web server

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000

   # Then open: http://localhost:8000
   ```

   **Using Node.js:**
   ```bash
   npx http-server -p 8000

   # Then open: http://localhost:8000
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000

   # Then open: http://localhost:8000
   ```

## Customization

### Adding/Modifying Products

Edit `cisternProducts.json`:

```json
{
  "id": 11,
  "name": "Product Name",
  "capacity": 5000,
  "type": "house",
  "category": "comfortable",
  "accessibility": "vehicle",
  "price": 3500,
  "features": ["Feature 1", "Feature 2"],
  "manualUrl": "https://...",
  "productUrl": "https://...",
  "imageUrl": "images/product.jpg"
}
```

### Updating Rainfall Data

Edit `plzRainData.json` to add or modify ZIP code ranges and rainfall amounts.

### Styling

All visual styling is in `styles.css`. Key colors are defined as CSS variables at the top:
- `--rewatec-blue`: Primary brand color
- `--rewatec-dark-blue`: Darker shade for hover states
- `--rewatec-light-blue`: Light background color

## Integration with WordPress

Once validated, your WordPress team can integrate this calculator by:

1. **Custom Page Template**: Create a new page template and copy the HTML
2. **Shortcode**: Create a custom shortcode that loads the HTML/CSS/JS
3. **Page Builder**: Use a custom HTML block to embed the code
4. **Upload Files**: Upload CSS, JS, and JSON files to the theme directory

**Example shortcode approach:**
```php
function rewatec_calculator_shortcode() {
    wp_enqueue_style('rewatec-calculator', get_template_directory_uri() . '/rewatec/styles.css');
    wp_enqueue_script('rewatec-calculator', get_template_directory_uri() . '/rewatec/script.js');

    ob_start();
    include get_template_directory() . '/rewatec/calculator.php';
    return ob_get_clean();
}
add_shortcode('rewatec_calculator', 'rewatec_calculator_shortcode');
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This calculator is created for PTWE Germany and Rewatec product distribution.

## Support

For questions or modifications, contact the development team.