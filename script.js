// Rewatec Calculator v3.0 - Updated 2026-03-16
// Global data storage
let cisternProducts = [];
let rainData = [];

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

        // Update comfort options when toilet/washing machine selection changes
        document.getElementById('connectToilet').addEventListener('change', updateComfortLevel);
        document.getElementById('connectWashingMachine').addEventListener('change', updateComfortLevel);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Konfigurationsdaten konnten nicht geladen werden. Bitte Seite neu laden.');
    }
});

// Update comfort level options based on household connection
function updateComfortLevel() {
    const toilet = document.getElementById('connectToilet').checked;
    const washing = document.getElementById('connectWashingMachine').checked;
    const comfortSelect = document.getElementById('comfortLevel');

    if (toilet || washing) {
        comfortSelect.innerHTML = `
            <option value="">Komfort Level auswählen</option>
            <option value="hauswasserwerk">System mit Hauswasserwerk (Pumpe im Keller/HWR)</option>
            <option value="tauchpumpe">System mit Tauchdruckpumpe (Pumpe im Tank)</option>
        `;
    } else {
        comfortSelect.innerHTML = `
            <option value="">Komfort Level auswählen</option>
            <option value="economical">Einstiegsvariante mit Filterkorb und Pumpe zur Bewässerung mit Handbrause</option>
            <option value="comfortable">Komfortvariante mit beruhigtem Zulauf und leistungsstarker Pumpe</option>
        `;
    }
}

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
        irrigationDemand: parseFloat(document.getElementById('irrigationDemand').value),
        accessibility: document.getElementById('accessibility').value,
        connectToilet: document.getElementById('connectToilet').checked,
        connectWashingMachine: document.getElementById('connectWashingMachine').checked,
        numPeople: parseInt(document.getElementById('numPeople').value),
        comfortLevel: document.getElementById('comfortLevel').value
    };
}

// Validate form data
function validateForm(formData) {
    if (!formData.roofType || !formData.houseLength || !formData.houseWidth ||
        !formData.gardenArea || !formData.zipCode || !formData.irrigationDemand ||
        !formData.accessibility || !formData.numPeople || !formData.comfortLevel) {
        showError('Bitte alle Pflichtfelder ausfüllen.');
        return false;
    }

    if (formData.zipCode.length !== 5) {
        showError('Bitte eine gültige 5-stellige Postleitzahl eingeben.');
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

    // Calculate total rain yield (L/year)
    // Formula: Roof Area (m²) × Runoff Coefficient × Annual Rainfall (mm)
    const rainYield = houseArea * formData.roofType * annualRainfall;

    // Calculate water demand
    const waterDemand = calculateWaterDemand(formData);

    // Calculate recommended cistern size (DIN formula)
    // Formula: min(totalDemand, rainYield) * 0.06
    const recommendedSize = Math.round(Math.min(waterDemand, rainYield) * 0.06);

    // Convert to m³ for display
    const recommendedSizeM3 = recommendedSize / 1000;

    // Find suitable product
    const product = findSuitableProduct(recommendedSize, formData);

    return {
        houseArea: houseArea.toFixed(2),
        annualRainfall: annualRainfall,
        rainYield: rainYield.toFixed(0),
        waterDemand: waterDemand.toFixed(0),
        recommendedSize: recommendedSize,
        recommendedSizeM3: recommendedSizeM3.toFixed(1),
        product: product
    };
}

// Get rainfall by ZIP code
function getRainfallByZIP(zipCode) {
    // rainData is now an array of {PLZ, rainfall} objects
    console.log('Looking for ZIP:', zipCode, 'Type:', typeof zipCode);
    console.log('rainData is array:', Array.isArray(rainData), 'Length:', rainData.length);

    const entry = rainData.find(item => item.PLZ === zipCode);
    console.log('Found entry:', entry);

    if (entry) {
        return entry.rainfall;
    }

    // Return default if not found (700mm is typical German average)
    console.warn('PLZ nicht gefunden, Standardwert wird verwendet:', zipCode);
    return 700;
}

// Calculate water demand (liters/year)
function calculateWaterDemand(formData) {
    // Garden irrigation: irrigationDemand is L/m²/year (80, 140, or 200)
    const waterNeed = formData.gardenArea * formData.irrigationDemand;

    // Household water usage (DIN-based values)
    const toiletUsePerPersonYear = 24 * 365;   // 8760 L/year per person
    const washingUsePerPersonYear = 15 * 365;  // 5475 L/year per person
    const householdUse =
        (formData.connectToilet ? formData.numPeople * toiletUsePerPersonYear : 0) +
        (formData.connectWashingMachine ? formData.numPeople * washingUsePerPersonYear : 0);

    return waterNeed + householdUse;
}

// Find suitable product
function findSuitableProduct(size, formData) {
    // Find first product matching access, comfort, and size >= calculated size
    const product = cisternProducts.find(p =>
        p.size >= size &&
        p.access === formData.accessibility &&
        p.comfort === formData.comfortLevel
    );

    return product || null;
}

// Display results
function displayResults(results) {
    // Update result values
    document.getElementById('resultHouseArea').textContent = `${results.houseArea} m²`;
    document.getElementById('resultRainAmount').textContent = `${results.annualRainfall} mm`;
    document.getElementById('resultRainTotal').textContent = `${results.rainYield} L/Jahr`;
    document.getElementById('resultWaterDemand').textContent = `${results.waterDemand} L/Jahr`;
    document.getElementById('resultCisternSize').textContent = `${results.recommendedSize} L`;

    if (results.product) {
        document.getElementById('resultProduct').textContent =
            `${results.product.name} (${results.product.size} L)`;

        // Update links - only show if real URLs exist
        const downloadLink = document.getElementById('downloadManual');
        const productLink = document.getElementById('viewProduct');
        const tenderLink = document.getElementById('viewTender');
        const linksContainer = document.querySelector('.result-actions');

        if (results.product.pdf && results.product.pdf.startsWith('http')) {
            downloadLink.href = results.product.pdf;
            downloadLink.style.display = 'inline-block';
        } else {
            downloadLink.style.display = 'none';
        }

        if (results.product.website && results.product.website.startsWith('http')) {
            productLink.href = results.product.website;
            productLink.style.display = 'inline-block';
        } else {
            productLink.style.display = 'none';
        }

        if (tenderLink) {
            if (results.product.tender && results.product.tender.startsWith('http')) {
                tenderLink.href = results.product.tender;
                tenderLink.style.display = 'inline-block';
            } else {
                tenderLink.style.display = 'none';
            }
        }

        const hasLinks = (results.product.pdf || results.product.website || results.product.tender);
        linksContainer.style.display = hasLinks ? 'block' : 'none';

        // Show product images
        const productImageContainer = document.querySelector('.product-image');
        productImageContainer.innerHTML = '';
        const images = [results.product.image1, results.product.image2].filter(src => src && src.startsWith('http'));
        if (images.length > 0) {
            images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = results.product.name;
                img.onerror = function() { this.style.display = 'none'; };
                productImageContainer.appendChild(img);
            });
            productImageContainer.style.display = 'block';
        } else {
            productImageContainer.style.display = 'none';
        }
    } else {
        document.getElementById('resultProduct').textContent =
            'Kein passendes Produkt gefunden. Bitte kontaktieren Sie uns, in Ihrem Fall bedarf es einer individuellen Auslegung.';
        document.getElementById('downloadManual').style.display = 'none';
        document.getElementById('viewProduct').style.display = 'none';
        const tenderLink = document.getElementById('viewTender');
        if (tenderLink) tenderLink.style.display = 'none';
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

    // Get product, manual and tender links
    const productLink = document.getElementById('viewProduct');
    const manualLink = document.getElementById('downloadManual');
    const tenderLink = document.getElementById('viewTender');
    const productUrl = productLink.href && productLink.href !== '#' && productLink.style.display !== 'none'
        ? productLink.href
        : null;
    const manualUrl = manualLink.href && manualLink.href !== '#' && manualLink.style.display !== 'none'
        ? manualLink.href
        : null;
    const tenderUrl = tenderLink && tenderLink.href && tenderLink.href !== '#' && tenderLink.style.display !== 'none'
        ? tenderLink.href
        : null;

    // Build links section
    let linksSection = '';
    if (productUrl || manualUrl || tenderUrl) {
        linksSection = '\n\nProdukt-Links:\n';
        if (productUrl) {
            linksSection += `Produktseite mit weitergehenden Informationen: ${productUrl}\n`;
        }
        if (manualUrl) {
            linksSection += `Einbauanleitung herunterladen: ${manualUrl}\n`;
        }
        if (tenderUrl) {
            linksSection += `Zum Ausschreibungstext: ${tenderUrl}\n`;
        }
    }

    const subject = 'Rewatec Zisternen-Konfigurator Ergebnis';
    const body = `
Berechnungsergebnisse Zisternen-Konfigurator
============================================

Dachfläche: ${results.houseArea}
Niederschlagsmenge: ${results.rainAmount}
Regenwasserertrag: ${results.rainTotal}
Gesamtwasserbedarf: ${results.waterDemand}

Empfohlene Zisternengröße: ${results.cisternSize}
Empfohlenes Produkt: ${results.product}${linksSection}

---
Erstellt mit dem Rewatec Zisternen-Konfigurator
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
