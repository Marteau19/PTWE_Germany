// Global data storage
let cisternProducts = [];
let rainData = {};

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load cistern products
        const productsResponse = await fetch('cisternProducts.json');
        cisternProducts = await productsResponse.json();

        // Load rain data
        const rainResponse = await fetch('plzRainData.json');
        rainData = await rainResponse.json();

        // Setup form submission
        document.getElementById('cisternForm').addEventListener('submit', handleFormSubmit);
        document.getElementById('emailResults').addEventListener('click', emailResults);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load configuration data. Please refresh the page.');
    }
});

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    // Clear any existing errors
    clearErrors();

    // Get form values
    const formData = getFormData();

    // Validate form
    if (!validateForm(formData)) {
        return;
    }

    // Calculate results
    const results = calculateCistern(formData);

    // Display results
    displayResults(results);
}

// Get all form data
function getFormData() {
    return {
        roofType: parseFloat(document.getElementById('roofType').value),
        houseLength: parseFloat(document.getElementById('houseLength').value),
        houseWidth: parseFloat(document.getElementById('houseWidth').value),
        gardenArea: parseFloat(document.getElementById('gardenArea').value),
        zipCode: document.getElementById('zipCode').value,
        irrigationDemand: document.getElementById('irrigationDemand').value,
        accessibility: document.getElementById('accessibility').value,
        connectToilet: document.getElementById('connectToilet').value === 'yes',
        connectWashingMachine: document.getElementById('connectWashingMachine').value === 'yes',
        numPeople: parseInt(document.getElementById('numPeople').value),
        comfortLevel: document.getElementById('comfortLevel').value
    };
}

// Validate form data
function validateForm(formData) {
    if (!formData.roofType || !formData.houseLength || !formData.houseWidth ||
        !formData.gardenArea || !formData.zipCode || !formData.irrigationDemand ||
        !formData.accessibility || !formData.numPeople || !formData.comfortLevel) {
        showError('Please fill in all required fields.');
        return false;
    }

    if (formData.zipCode.length !== 5) {
        showError('Please enter a valid 5-digit ZIP code.');
        return false;
    }

    return true;
}

// Calculate cistern requirements
function calculateCistern(formData) {
    // Calculate house area (roof area)
    const houseArea = formData.houseLength * formData.houseWidth;

    // Get annual rainfall based on ZIP code
    const annualRainfall = getRainfallByZIP(formData.zipCode);

    // Calculate total rain collected (m³/year)
    // Formula: Roof Area (m²) × Runoff Coefficient × Annual Rainfall (mm) / 1000
    const rainTotal = (houseArea * formData.roofType * annualRainfall) / 1000;

    // Calculate water demand
    const waterDemand = calculateWaterDemand(formData);

    // Calculate recommended cistern size
    // Use the smaller of: 50% of annual rain collection or water demand × storage factor
    const storageFactor = 21; // 21 days storage recommended
    const demandBasedSize = (waterDemand / 365) * storageFactor;
    const rainBasedSize = rainTotal * 0.06; // 6% of annual rainfall (approx 21 days)

    let recommendedSize = Math.min(demandBasedSize, rainBasedSize);

    // Ensure minimum size based on usage
    const minSize = getMinimumSize(formData);
    recommendedSize = Math.max(recommendedSize, minSize);

    // Round up to nearest 100L
    recommendedSize = Math.ceil(recommendedSize / 0.1) * 0.1;

    // Find suitable product
    const product = findSuitableProduct(recommendedSize, formData);

    return {
        houseArea: houseArea.toFixed(2),
        annualRainfall: annualRainfall,
        rainTotal: rainTotal.toFixed(2),
        waterDemand: waterDemand.toFixed(0),
        recommendedSize: recommendedSize.toFixed(1),
        product: product
    };
}

// Get rainfall by ZIP code
function getRainfallByZIP(zipCode) {
    const zip = parseInt(zipCode);

    for (const data of rainData.rainData) {
        const start = parseInt(data.plzRange.start);
        const end = parseInt(data.plzRange.end);

        if (zip >= start && zip <= end) {
            return data.annualRainfall;
        }
    }

    // Return default if not found
    return rainData.defaultRainfall;
}

// Calculate daily water demand (liters/year)
function calculateWaterDemand(formData) {
    let dailyDemand = 0;

    // Garden irrigation demand (liters per m² per year)
    const irrigationRates = {
        'low': 20,      // 20L/m²/year
        'medium': 35,   // 35L/m²/year
        'high': 50      // 50L/m²/year
    };

    dailyDemand += formData.gardenArea * irrigationRates[formData.irrigationDemand];

    // Toilet usage (40 liters per person per day)
    if (formData.connectToilet) {
        dailyDemand += formData.numPeople * 40 * 365;
    }

    // Washing machine (50 liters per person per week)
    if (formData.connectWashingMachine) {
        dailyDemand += formData.numPeople * 50 * 52;
    }

    return dailyDemand;
}

// Get minimum cistern size based on usage
function getMinimumSize(formData) {
    if (formData.connectToilet || formData.connectWashingMachine) {
        return 3.0; // 3000L minimum for house use
    }
    return 0.8; // 800L minimum for garden only
}

// Find suitable product
function findSuitableProduct(size, formData) {
    // Convert size from m³ to liters
    const sizeInLiters = size * 1000;

    // Determine product type
    const needsHouseSystem = formData.connectToilet || formData.connectWashingMachine;
    const productType = needsHouseSystem ? 'house' : 'garden';

    // Filter products by type, accessibility, and comfort level
    let suitableProducts = cisternProducts.filter(product => {
        return (product.type === productType || (productType === 'house' && product.capacity >= 3000)) &&
               product.accessibility === formData.accessibility &&
               product.category === formData.comfortLevel &&
               product.capacity >= sizeInLiters;
    });

    // If no exact match, relax the comfort level requirement
    if (suitableProducts.length === 0) {
        suitableProducts = cisternProducts.filter(product => {
            return (product.type === productType || (productType === 'house' && product.capacity >= 3000)) &&
                   product.accessibility === formData.accessibility &&
                   product.capacity >= sizeInLiters;
        });
    }

    // If still no match, just find by capacity and type
    if (suitableProducts.length === 0) {
        suitableProducts = cisternProducts.filter(product => {
            return (product.type === productType || (productType === 'house' && product.capacity >= 3000)) &&
                   product.capacity >= sizeInLiters;
        });
    }

    // Sort by capacity (ascending) and return the smallest suitable one
    suitableProducts.sort((a, b) => a.capacity - b.capacity);

    return suitableProducts.length > 0 ? suitableProducts[0] : null;
}

// Display results
function displayResults(results) {
    // Update result values
    document.getElementById('resultHouseArea').textContent = `${results.houseArea} m²`;
    document.getElementById('resultRainAmount').textContent = `${results.annualRainfall} mm`;
    document.getElementById('resultRainTotal').textContent = `${results.rainTotal} m³/year`;
    document.getElementById('resultWaterDemand').textContent = `${results.waterDemand} L/year`;
    document.getElementById('resultCisternSize').textContent = `${results.recommendedSize} m³`;

    if (results.product) {
        document.getElementById('resultProduct').textContent =
            `${results.product.name} (${results.product.capacity} L)`;

        // Update links - only show if real URLs exist
        const downloadLink = document.getElementById('downloadManual');
        const productLink = document.getElementById('viewProduct');
        const linksContainer = document.querySelector('.result-actions');

        if (results.product.manualUrl && results.product.manualUrl.startsWith('http')) {
            downloadLink.href = results.product.manualUrl;
            downloadLink.style.display = 'inline-block';
        } else {
            downloadLink.style.display = 'none';
        }

        if (results.product.productUrl && results.product.productUrl.startsWith('http')) {
            productLink.href = results.product.productUrl;
            productLink.style.display = 'inline-block';
        } else {
            productLink.style.display = 'none';
        }

        // Hide links container if both links are hidden
        if (!results.product.manualUrl && !results.product.productUrl) {
            linksContainer.style.display = 'none';
        } else {
            linksContainer.style.display = 'block';
        }

        // Hide image section completely - will add real images later
        const productImageContainer = document.querySelector('.product-image');
        productImageContainer.style.display = 'none';
    } else {
        document.getElementById('resultProduct').textContent =
            'No suitable product found. Please contact us for a custom solution.';
        document.getElementById('downloadManual').style.display = 'none';
        document.getElementById('viewProduct').style.display = 'none';
        document.querySelector('.product-image').style.display = 'none';
        document.querySelector('.result-actions').style.display = 'none';
    }

    // Show results section
    document.getElementById('results').classList.remove('hidden');

    // Smooth scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Email results
function emailResults() {
    const results = {
        houseArea: document.getElementById('resultHouseArea').textContent,
        rainAmount: document.getElementById('resultRainAmount').textContent,
        rainTotal: document.getElementById('resultRainTotal').textContent,
        waterDemand: document.getElementById('resultWaterDemand').textContent,
        cisternSize: document.getElementById('resultCisternSize').textContent,
        product: document.getElementById('resultProduct').textContent
    };

    const subject = 'Rewatec Cistern Configurator Results';
    const body = `
Cistern Configuration Results
=============================

House Area: ${results.houseArea}
Annual Rainfall: ${results.rainAmount}
Total Rainwater Collection: ${results.rainTotal}
Water Demand: ${results.waterDemand}

Recommended Cistern Size: ${results.cisternSize}
Recommended Product: ${results.product}

---
Generated by Rewatec Cistern Configurator
    `.trim();

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

// Show error message
function showError(message) {
    clearErrors();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const form = document.getElementById('cisternForm');
    form.insertBefore(errorDiv, form.firstChild);
}

// Clear error messages
function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
}
