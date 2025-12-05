// Configuration
const CONFIG = {
    API_URL: 'api.php',
    CO2_PER_BYTE: 0.0000002, // 0.2g par MB
    CO2_PER_REQUEST: 0.001, // 1g par requête
    DOM_IMPACT: 0.0001 // Impact par élément DOM
};

// Éléments DOM
const elements = {
    form: document.getElementById('urlForm'),
    urlInput: document.getElementById('url'),
    loading: document.getElementById('loading'),
    results: document.getElementById('results'),
    domCount: document.getElementById('domCount'),
    totalWeight: document.getElementById('totalWeight'),
    requestCount: document.getElementById('requestCount'),
    co2: document.getElementById('co2'),
    equivalent: document.getElementById('equivalent')
};

// Analyse d'URL (simulation)
async function analyzeWebsite(url) {
    showLoading(true);
    
    try {
        // Simulation d'analyse (dans un cas réel, appeler une API)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Données simulées basées sur l'URL
        const urlData = new URL(url);
        const hostname = urlData.hostname;
        
        // Génération de données pseudo-aléatoires basées sur l'URL
        const seed = hashString(hostname);
        const random = (min, max) => min + (seed % (max - min));
        
        const data = {
            domElements: random(50, 500),
            totalWeight: random(500, 5000), // KB
            requests: random(10, 100),
            url: hostname
        };
        
        // Calcul du score
        const score = calculateEcoScore(data);
        const co2 = calculateCO2(data);
        
        // Affichage des résultats
        displayResults(data, score, co2);
        
    } catch (error) {
        console.error('Erreur d\'analyse:', error);
        alert('Une erreur est survenue lors de l\'analyse. Veuillez réessayer.');
    } finally {
        showLoading(false);
    }
}

// Calcul du score écologique
function calculateEcoScore(data) {
    const maxDom = 500;
    const maxWeight = 5000;
    const maxRequests = 100;
    
    const domScore = Math.max(0, 100 - (data.domElements / maxDom * 100));
    const weightScore = Math.max(0, 100 - (data.totalWeight / maxWeight * 100));
    const requestScore = Math.max(0, 100 - (data.requests / maxRequests * 100));
    
    return Math.round((domScore + weightScore + requestScore) / 3);
}

// Calcul des émissions CO2
function calculateCO2(data) {
    const weightInMB = data.totalWeight / 1024;
    const co2Weight = weightInMB * CONFIG.CO2_PER_BYTE;
    const co2Requests = data.requests * CONFIG.CO2_PER_REQUEST;
    const co2Dom = data.domElements * CONFIG.DOM_IMPACT;
    
    const totalCO2 = co2Weight + co2Requests + co2Dom;
    
    // Conversion en mètres de voiture (120g CO2/km)
    const meters = (totalCO2 / 0.12) * 1000;
    
    return {
        total: totalCO2.toFixed(2),
        meters: Math.round(meters)
    };
}

// Affichage des résultats
function displayResults(data, score, co2) {
    elements.domCount.textContent = data.domElements;
    elements.totalWeight.textContent = (data.totalWeight / 1024).toFixed(1) + ' MB';
    elements.requestCount.textContent = data.requests;
    elements.co2.textContent = co2.total + ' g';
    elements.equivalent.textContent = co2.meters + ' m';
    
    // Animation du score
    const scoreCircle = document.querySelector('.score-circle circle:nth-child(2)');
    const offset = 283 - (score / 100 * 283);
    scoreCircle.style.strokeDashoffset = offset;
    document.querySelector('.score-circle text').textContent = score;
    
    // Affichage des résultats
    elements.results.classList.remove('hidden');
    
    // Scroll vers les résultats
    elements.results.scrollIntoView({ behavior: 'smooth' });
}

// Gestion du chargement
function showLoading(show) {
    elements.loading.style.display = show ? 'block' : 'none';
    elements.form.style.opacity = show ? '0.5' : '1';
    elements.form.querySelector('button').disabled = show;
}

// Hash simple pour la génération de nombres aléatoires
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// Validation d'URL
function isValidUrl(url) {
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch {
        return false;
    }
}

// Événements
elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = elements.urlInput.value.trim();
    
    if (!isValidUrl(url)) {
        alert('Veuillez entrer une URL valide (commençant par http:// ou https://)');
        return;
    }
    
    await analyzeWebsite(url);
});

// Analyse automatique au chargement (optionnel)
window.addEventListener('load', () => {
    // Remplir avec un exemple si vide
    if (!elements.urlInput.value) {
        elements.urlInput.value = 'https://www.example.com';
    }
});

// Service Worker pour PWA (optionnel)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .catch(err => console.log('Service Worker non installé:', err));
    });
}