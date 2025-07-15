// Interactive Map Application
// Pure JavaScript implementation with MapLibre GL JS

class InteractiveMapApp {
    // Show the directions panel and scroll to it after route calculation
    showRouteResults() {
        // Switch to directions tab if not already
        this.switchTab('directions');
        // Optionally scroll to the directions panel
        const directionsPanel = document.getElementById('directions-panel');
        if (directionsPanel) {
            directionsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    constructor() {
        // Configuration
        this.MAPTILER_API_KEY = 'sRe65NC9QXxe7YQ11VGd'; // Replace with your API key
        this.VALHALLA_API_URL = 'https://valhalla1.openstreetmap.de/route'; // Free Valhalla instance
        
        // State
        this.map = null;
        this.markers = [];
        this.clusters = null;
        this.currentRoute = null;
        this.selectedCategory = 'all';
        this.searchQuery = '';
        this.isDarkTheme = false;
        this.isSidebarCollapsed = false;
        this.isRoutingMode = false;
        
        
        // Sample POI data
        this.pois = [
    {
        id: 'TN1',
        name: 'Gangaikonda Cholapuram Temple',
        category: 'tourist',
        coordinates: [79.4600, 11.2000],
        rating: 4.8,
        description: 'UNESCO World Heritage Chola-era temple known for its grand architecture.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Gangaikondacholapuram_Temple_4.jpg',
        address: 'Gangaikonda Cholapuram, Ariyalur, Tamil Nadu'
    },
    {
        id: 'TN2',
        name: 'Mahabalipuram - Shore Temple',
        category: 'tourist',
        coordinates: [80.1950, 12.6208],
        rating: 4.7,
        description: 'Ancient coastal temple complex with rock-cut monuments and sculptures.',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4noEuIqhTTsLhYb2qimW4gLAwLYsPp1c7leoH2aWFbxFLcuf4N1LllAwVvtnoPutsKwGUTBSwv7mpT2XKlArbKnqnLIX1sp80yrF7fYi8ciKQTM0Wyopl2XQscR_BeAe1YoI8WpnrA=w270-h312-n-k-no',
        address: 'Mahabalipuram, Chengalpattu, Tamil Nadu'
    },
    {
        id: 'TN3',
        name: 'Marina Beach',
        category: 'tourist',
        coordinates: [80.2850, 13.0500],
        rating: 4.5,
        description: 'India’s longest urban beach along the Bay of Bengal.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFYIgBmwVq-0v-vMJ4FhbLYaktopigD0FiWg&s',
        address: 'Marina Beach, Chennai, Tamil Nadu'
    },
    {
        id: 'TN4',
        name: 'Velliangiri Hills',
        category: 'tourist',
        coordinates: [76.7350, 10.9667],
        rating: 4.6,
        description: 'Sacred hills near Coimbatore, part of Western Ghats known for trekking and Shiva temple.',
        image: 'https://static.sadhguru.org/d/46272/1626099393-velliangiri-mountains-3.jpg',
        address: 'Velliangiri, Coimbatore, Tamil Nadu'
    },
    {
        id: 'TN5',
        name: 'Pichavaram Mangrove Forest',
        category: 'tourist',
        coordinates: [79.7700, 11.4300],
        rating: 4.7,
        description: 'One of the largest mangrove forests in India with boating and birdwatching.',
        image: 'https://img-cdn.publive.online/fit-in/640x430/filters:format(webp)/30-stades/media/media_files/UYdmgLbNeNy9vahJexlF.jpg',
        address: 'Pichavaram, Cuddalore, Tamil Nadu'
    },
    {
        id: 'TN6',
        name: 'Hogenakkal Falls',
        category: 'tourist',
        coordinates: [77.7720, 12.1192],
        rating: 4.6,
        description: 'Stunning waterfalls on the Kaveri River, popular for coracle rides.',
        image: 'https://img-cdn.publive.online/fit-in/640x430/filters:format(webp)/30-stades/media/media_files/LCuf7fEWT2UhvoGg8H2R.jpg',
        address: 'Hogenakkal, Dharmapuri, Tamil Nadu'
    },
    {
        id: 'TN7',
        name: 'Kodaikanal Lake',
        category: 'tourist',
        coordinates: [77.4987, 10.2381],
        rating: 4.8,
        description: 'Star-shaped lake surrounded by hills and pine forests in Kodaikanal.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0PBZfSmN3loKHckX_2c48PvXUWEqKez_UQ&s',
        address: 'Kodaikanal, Dindigul, Tamil Nadu'
    },
    {
        id: 'TN8',
        name: 'Sangameswarar Temple',
        category: 'tourist',
        coordinates: [77.6830, 11.4500],
        rating: 4.4,
        description: 'Historic temple at the confluence of rivers Bhavani and Cauvery.',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiI9s52KjrHXKmAsdJ2j7OhZWp7kIPpTtIP3IjIjRrvfGLybXUjWKoWt5RVnzVsheRqnLL5tDSZtx5xNk8lqY0vAdZns3vaZRBesWftj8p8fSt4XGu3OSERcZANoPnOXfEFF0YnGHq-0p16/s1600/bhavani-koodudurai-008.jpg',
        address: 'Bhavani, Erode, Tamil Nadu'
    },
    {
        id: 'TN9',
        name: 'Perumpallam Dam',
        category: 'tourist',
        coordinates: [78.9586, 11.7057],
        rating: 4.2,
        description: 'Scenic dam area with greenery in Kallakurichi district.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5ZOimFYJnFIyi680pAHDeA_vdl2IWjMxufw&s',
        address: 'Kallakurichi, Tamil Nadu'
    },
    {
        id: 'TN10',
        name: 'Vivekananda Rock Memorial',
        category: 'tourist',
        coordinates: [77.5510, 8.0781],
        rating: 4.9,
        description: 'Monument honoring Swami Vivekananda on a rocky islet off Kanyakumari coast.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkIZs_JfSQS1kE2wO4XZAR6wW1__4YDSyiZQ&s',
        address: 'Kanyakumari, Tamil Nadu'
    }
];

        
        // Map styles
        this.mapStyles = {
            streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${this.MAPTILER_API_KEY}`,
            satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${this.MAPTILER_API_KEY}`,
            terrain: `https://api.maptiler.com/maps/terrain-v2/style.json?key=${this.MAPTILER_API_KEY}`,
            dark: `https://api.maptiler.com/maps/dark-v2/style.json?key=${this.MAPTILER_API_KEY}`,
            light: `https://api.maptiler.com/maps/light-v2/style.json?key=${this.MAPTILER_API_KEY}`
        };
        
        this.currentMapStyle = 'streets';
        
        // Initialize app
        this.init();
    }
    
    async init() {
        // Check for saved theme preference
        this.isDarkTheme = localStorage.getItem('theme') === 'dark' || 
                          (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        // Apply theme
        this.applyTheme();
        
        // Show loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            this.initializeMap();
            this.setupEventListeners();
            this.registerServiceWorker();
        }, 1000);
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
        localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
        
        // Update theme toggle icons
        const lightIcon = document.querySelector('.theme-icon-light');
        const darkIcon = document.querySelector('.theme-icon-dark');
        
        if (this.isDarkTheme) {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        } else {
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        }
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
    
    initializeMap() {
        this.map = new maplibregl.Map({
            container: 'map',
            style: this.mapStyles[this.isDarkTheme ? 'dark' : 'streets'],
            center: [-74.006, 40.7128], // New York City
            zoom: 12,
            pitch: 0,
            bearing: 0
        });
        
        // Add map controls
        this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
        this.map.addControl(new maplibregl.ScaleControl(), 'bottom-left');
        this.map.addControl(new maplibregl.FullscreenControl(), 'top-right');
        this.map.addControl(new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }), 'top-right');
        
        // Initialize map features when loaded
        this.map.on('load', () => {
            this.initializePOIs();
            this.setupMapEventListeners();
        });
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.isDarkTheme = !this.isDarkTheme;
            this.applyTheme();
            if (this.map) {
                this.map.setStyle(this.mapStyles[this.isDarkTheme ? 'dark' : 'streets']);
            }
        });
        
        // Geolocation
        document.getElementById('geolocation-btn').addEventListener('click', () => {
            this.getCurrentLocation();
        });
        
        // Routing toggle
        document.getElementById('routing-toggle').addEventListener('click', () => {
            this.toggleRoutingMode();
        });
        
        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // Sidebar tabs
        document.getElementById('explore-tab').addEventListener('click', () => {
            this.switchTab('explore');
        });
        
        document.getElementById('directions-tab').addEventListener('click', () => {
            this.switchTab('directions');
        });
        
        // Search functionality
        this.setupSearchListeners();
        
        // POI filtering
        this.setupPOIListeners();
        
        // Route calculation
        this.setupRouteListeners();
        
        // Map controls
        this.setupMapControlListeners();
    }
    
    setupSearchListeners() {
        const searchInput = document.getElementById('search-input');
        const clearSearch = document.getElementById('clear-search');
        const searchResults = document.getElementById('search-results');
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length > 0) {
                clearSearch.classList.remove('hidden');
            } else {
                clearSearch.classList.add('hidden');
                searchResults.classList.add('hidden');
                return;
            }
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });
        
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.classList.add('hidden');
            searchResults.classList.add('hidden');
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.classList.add('hidden');
            }
        });
    }
    
    async performSearch(query) {
        const searchResults = document.getElementById('search-results');
        
        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }
        
        searchResults.innerHTML = '<div class="search-loading"><div class="loading-spinner"></div>Searching...</div>';
        searchResults.classList.remove('hidden');
        
        try {
            const response = await fetch(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${this.MAPTILER_API_KEY}&limit=5`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                this.displaySearchResults(data.features);
            } else {
                searchResults.innerHTML = '<div class="search-result">No results found</div>';
            }
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = '<div class="search-result">Search error occurred</div>';
        }
    }
    
    displaySearchResults(results) {
        const searchResults = document.getElementById('search-results');
        
        searchResults.innerHTML = results.map(result => `
            <div class="search-result" data-lng="${result.center[0]}" data-lat="${result.center[1]}">
                <div class="search-result-name">${result.place_name}</div>
                <div class="search-result-type">${result.place_type.join(', ')}</div>
            </div>
        `).join('');
        
        // Add click listeners to results
        searchResults.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', () => {
                const lng = parseFloat(result.dataset.lng);
                const lat = parseFloat(result.dataset.lat);
                
                this.map.flyTo({
                    center: [lng, lat],
                    zoom: 15,
                    duration: 2000
                });
                
                document.getElementById('search-input').value = result.querySelector('.search-result-name').textContent;
                searchResults.classList.add('hidden');
            });
        });
    }
    
    setupPOIListeners() {
        // POI search
        document.getElementById('poi-search').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterAndDisplayPOIs();
        });
        
        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedCategory = btn.dataset.category;
                this.filterAndDisplayPOIs();
            });
        });
    }
    
    setupRouteListeners() {
        document.getElementById('calculate-route').addEventListener('click', () => {
            this.calculateRoute();
        });
        
        document.getElementById('clear-route').addEventListener('click', () => {
            this.clearRoute();
        });
    }
    
    setupMapControlListeners() {
        // Layers toggle
        document.getElementById('layers-toggle').addEventListener('click', () => {
            const panel = document.getElementById('layers-panel');
            panel.classList.toggle('hidden');
        });
        
        // Layer style buttons
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMapStyle = btn.dataset.style;
                this.map.setStyle(this.mapStyles[this.currentMapStyle]);
                document.getElementById('layers-panel').classList.add('hidden');
            });
        });
        
        // Compass reset
        document.getElementById('compass-btn').addEventListener('click', () => {
            this.map.resetNorth();
        });
        
        // Close layers panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#layers-toggle') && !e.target.closest('#layers-panel')) {
                document.getElementById('layers-panel').classList.add('hidden');
            }
        });
    }
    
    setupMapEventListeners() {
        // Map click for reverse geocoding
        this.map.on('click', async (e) => {
            if (this.isRoutingMode) {
                this.handleRouteClick(e);
                return;
            }
            
            const { lng, lat } = e.lngLat;
            
            try {
                const response = await fetch(
                    `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${this.MAPTILER_API_KEY}`
                );
                const data = await response.json();
                
                if (data.features && data.features.length > 0) {
                    const place = data.features[0];
                    
                    new maplibregl.Popup()
                        .setLngLat([lng, lat])
                        .setHTML(`
                            <div style="padding: 8px; max-width: 200px;">
                                <strong>${place.place_name}</strong>
                            </div>
                        `)
                        .addTo(this.map);
                }
            } catch (error) {
                console.error('Reverse geocoding error:', error);
            }
        });
    }
    
    getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.map.flyTo({
                    center: [longitude, latitude],
                    zoom: 15,
                    duration: 2000
                });
                
                // Add user location marker
                new maplibregl.Marker({ color: '#ef4444' })
                    .setLngLat([longitude, latitude])
                    .addTo(this.map);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location.');
            }
        );
    }
    
    toggleRoutingMode() {
        this.isRoutingMode = !this.isRoutingMode;
        const btn = document.getElementById('routing-toggle');
        
        if (this.isRoutingMode) {
            btn.classList.add('active');
            this.switchTab('directions');
        } else {
            btn.classList.remove('active');
        }
    }
    
    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        const sidebar = document.getElementById('sidebar');
        
        if (this.isSidebarCollapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    }
    
    switchTab(tab) {
        const exploreTab = document.getElementById('explore-tab');
        const directionsTab = document.getElementById('directions-tab');
        const explorePanel = document.getElementById('explore-panel');
        const directionsPanel = document.getElementById('directions-panel');
        
        if (tab === 'explore') {
            exploreTab.classList.add('active');
            directionsTab.classList.remove('active');
            explorePanel.classList.remove('hidden');
            directionsPanel.classList.add('hidden');
        } else {
            exploreTab.classList.remove('active');
            directionsTab.classList.add('active');
            explorePanel.classList.add('hidden');
            directionsPanel.classList.remove('hidden');
        }
    }
    
    initializePOIs() {
        this.clearMarkers();
        this.addPOIMarkers();
        this.filterAndDisplayPOIs();
    }
    
    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }
    
    addPOIMarkers() {
        this.pois.forEach(poi => {
            const markerElement = this.createMarkerElement(poi);
            
            const marker = new maplibregl.Marker(markerElement)
                .setLngLat(poi.coordinates)
                .addTo(this.map);
            
            this.markers.push(marker);
            
            // Add popup
            const popup = new maplibregl.Popup({ offset: 25 })
                .setHTML(this.createPopupHTML(poi));
            
            marker.setPopup(popup);
        });
    }
    
    createMarkerElement(poi) {
        const element = document.createElement('div');
        element.className = 'poi-marker';
        element.innerHTML = this.getMarkerIcon(poi.category);
        
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.2)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
        
        return element;
    }
    
    getMarkerIcon(category) {
        const icons = {
            restaurant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"></path></svg>',
            hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
            hospital: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"></path></svg>',
            tourist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>'
        };
        
        return icons[category] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
    }
    
    createPopupHTML(poi) {
        return `
            <div class="poi-popup">
                <h3>${poi.name}</h3>
                <p>${poi.description}</p>
                <div class="rating">
                    <span>★</span>
                    <span>${poi.rating}/5</span>
                </div>
                ${poi.address ? `<p style="font-size: 0.75rem; color: #666; margin-top: 8px;">${poi.address}</p>` : ''}
            </div>
        `;
    }
    
    filterAndDisplayPOIs() {
        let filteredPOIs = this.pois;
        
        // Filter by category
        if (this.selectedCategory !== 'all') {
            filteredPOIs = filteredPOIs.filter(poi => poi.category === this.selectedCategory);
        }
        
        // Filter by search query
        if (this.searchQuery) {
            filteredPOIs = filteredPOIs.filter(poi =>
                poi.name.toLowerCase().includes(this.searchQuery) ||
                poi.description.toLowerCase().includes(this.searchQuery)
            );
        }
        
        this.displayPOIList(filteredPOIs);
        this.updatePOICount(filteredPOIs.length);
    }
    
    displayPOIList(pois) {
        const poiList = document.getElementById('poi-list');
        
        if (pois.length === 0) {
            poiList.innerHTML = `
                <div class="poi-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <p>No places found</p>
                    <p style="font-size: 0.875rem;">Try adjusting your filters or search query</p>
                </div>
            `;
            return;
        }
        
        poiList.innerHTML = pois.map(poi => `
            <div class="poi-item" data-poi-id="${poi.id}">
                ${poi.image ? `<img src="${poi.image}" alt="${poi.name}" class="poi-image">` : ''}
                <div class="poi-name">${poi.name}</div>
                <div class="poi-rating">
                    <div class="poi-stars">
                        ${this.renderStars(poi.rating)}
                    </div>
                    <span class="poi-rating-text">${poi.rating}/5</span>
                </div>
                <div class="poi-description">${poi.description}</div>
                ${poi.address ? `<div class="poi-address">${poi.address}</div>` : ''}
            </div>
        `).join('');
        
        // Add click listeners
        poiList.querySelectorAll('.poi-item').forEach(item => {
            item.addEventListener('click', () => {
                const poiId = item.dataset.poiId;
                const poi = this.pois.find(p => p.id === poiId);
                if (poi) {
                    this.focusOnPOI(poi);
                }
            });
        });
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const stars = [];
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push('<svg class="poi-star filled" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>');
            } else {
                stars.push('<svg class="poi-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>');
            }
        }
        
        return stars.join('');
    }
    
    updatePOICount(count) {
        document.getElementById('poi-count').textContent = count;
    }
    
    focusOnPOI(poi) {
        this.map.flyTo({
            center: poi.coordinates,
            zoom: 16,
            duration: 2000
        });
        
        // Find and trigger popup for this POI
        const marker = this.markers.find(m => {
            const lngLat = m.getLngLat();
            return Math.abs(lngLat.lng - poi.coordinates[0]) < 0.0001 && 
                   Math.abs(lngLat.lat - poi.coordinates[1]) < 0.0001;
        });
        
        if (marker && marker.getPopup()) {
            marker.togglePopup();
        }
    }
    
    async calculateRoute() {
        const origin = document.getElementById('route-origin').value.trim();
        const destination = document.getElementById('route-destination').value.trim();
        const mode = document.getElementById('route-mode').value;

        if (!origin || !destination) {
            alert('Please enter both origin and destination');
            return;
        }

        const calculateBtn = document.getElementById('calculate-route');
        const btnText = calculateBtn.querySelector('.btn-text');
        const btnSpinner = calculateBtn.querySelector('.btn-spinner');

        // Show loading state
        btnText.textContent = 'Calculating...';
        btnSpinner.classList.remove('hidden');
        calculateBtn.disabled = true;

        try {
            // Geocode origin and destination
            let originCoords, destCoords;

            // If input is in 'lat, lng' format, use directly, else geocode
            const latLngRegex = /^\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\s*$/;
            let match = origin.match(latLngRegex);
            if (match) {
                originCoords = [parseFloat(match[2]), parseFloat(match[1])];
            } else {
                originCoords = await this.geocodeLocation(origin);
            }

            match = destination.match(latLngRegex);
            if (match) {
                destCoords = [parseFloat(match[2]), parseFloat(match[1])];
            } else {
                destCoords = await this.geocodeLocation(destination);
            }

            if (!originCoords || !destCoords) {
                alert('Could not find coordinates for one or both locations.');
                return;
            }

            const routeData = await this.getRoute(originCoords, destCoords, mode);
            this.displayRoute(routeData);
            this.showRouteResults();
        } catch (error) {
            console.error('Route calculation error:', error);
            alert('Error calculating route: ' + (error.message || 'Unknown error'));
        } finally {
            // Reset button state
            btnText.textContent = 'Get Directions';
            btnSpinner.classList.add('hidden');
            calculateBtn.disabled = false;
        }

    }
    
    async geocodeLocation(location) {
        try {
            const response = await fetch(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${this.MAPTILER_API_KEY}&limit=1`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                return data.features[0].center;
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }
    
    async getRoute(origin, destination, mode) {
        // Use Valhalla API for real road routing
        const costing = mode === 'walking' ? 'pedestrian' : (mode === 'cycling' ? 'bicycle' : 'auto');
        const url = `${this.VALHALLA_API_URL}`;
        const body = {
            locations: [
                { lon: origin[0], lat: origin[1] },
                { lon: destination[0], lat: destination[1] }
            ],
            costing: costing,
            directions_options: { units: 'kilometers' }
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (!data.trip) throw new Error('No route found');
            // Decode polyline geometry
            const coordinates = this.decodePolyline(data.trip.legs[0].shape);
            // Steps
            const steps = data.trip.legs[0].maneuvers.map(m => ({
                instruction: m.instruction,
                distance: `${m.length.toFixed(2)} km`
            }));
            return {
                distance: `${data.trip.summary.length.toFixed(1)} km`,
                duration: `${Math.round(data.trip.summary.time / 60)} mins`,
                coordinates,
                steps
            };
        } catch (e) {
            // fallback to straight line if Valhalla fails
            const distance = this.calculateDistance(origin, destination);
            const duration = this.estimateDuration(distance, mode);
            return {
                distance: `${distance.toFixed(1)} km`,
                duration: `${Math.round(duration)} mins`,
                coordinates: [origin, destination],
                steps: [
                    { instruction: `Head ${this.getDirection(origin, destination)} on your current road`, distance: '0.5 km' },
                    { instruction: 'Continue straight for most of the journey', distance: `${(distance - 1).toFixed(1)} km` },
                    { instruction: 'Arrive at your destination', distance: '0.5 km' }
                ]
            };
        }
    }

    // Polyline decoding for Valhalla (Google encoded polyline algorithm)
    decodePolyline(str) {
        let index = 0, lat = 0, lng = 0, coordinates = [];
        while (index < str.length) {
            let b, shift = 0, result = 0;
            do {
                b = str.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = str.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;
            coordinates.push([lng * 1e-6, lat * 1e-6]);
        }
        return coordinates;
    }
    
    calculateDistance(coord1, coord2) {
        const R = 6371; // Earth's radius in km
        const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
        const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    estimateDuration(distance, mode) {
        const speeds = {
            driving: 50, // km/h
            walking: 5,  // km/h
            cycling: 15  // km/h
        };
        
        return (distance / speeds[mode]) * 60; // minutes
    }
    
    getDirection(origin, destination) {
        const bearing = Math.atan2(
            destination[0] - origin[0],
            destination[1] - origin[1]
        ) * 180 / Math.PI;
        
        if (bearing >= -45 && bearing < 45) return 'north';
        if (bearing >= 45 && bearing < 135) return 'east';
        if (bearing >= 135 || bearing < -135) return 'south';
        return 'west';
    }
    
    displayRoute(routeData) {
        this.currentRoute = routeData;

        // Update route summary
        document.getElementById('route-distance').textContent = routeData.distance;
        document.getElementById('route-duration').textContent = routeData.duration;

        // Display route steps
        const stepsList = document.getElementById('route-steps-list');
        stepsList.innerHTML = routeData.steps.map((step, index) => `
            <div class="route-step">
                <div class="route-step-number">${index + 1}</div>
                <div class="route-step-content">
                    <div class="route-step-instruction">${step.instruction}</div>
                    <div class="route-step-distance">${step.distance}</div>
                </div>
            </div>
        `).join('');

        // Draw route on map (simplified line)
        if (this.map.getSource('route')) {
            this.map.removeLayer('route');
            this.map.removeSource('route');
        }

        this.map.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: routeData.coordinates
                }
            }
        });

        this.map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3b82f6',
                'line-width': 4
            }
        });

        // Fit map to route
        const bounds = new maplibregl.LngLatBounds();
        routeData.coordinates.forEach(coord => bounds.extend(coord));
        this.map.fitBounds(bounds, { padding: 50 });

        // Live moving marker follows user's real geolocation and live turn-by-turn instructions
        if (this.liveMarker) {
            this.liveMarker.remove();
            this.liveMarker = null;
        }
        if (this.liveMoveWatchId) {
            navigator.geolocation.clearWatch(this.liveMoveWatchId);
            this.liveMoveWatchId = null;
        }

        // Prepare step locations for live navigation
        const stepCoords = [];
        if (routeData.steps && routeData.steps.length > 0 && routeData.coordinates.length > 1) {
            // Evenly assign coordinates to steps (approximate, for demo)
            const perStep = Math.floor(routeData.coordinates.length / routeData.steps.length);
            for (let i = 0; i < routeData.steps.length; i++) {
                stepCoords.push(routeData.coordinates[Math.min(i * perStep, routeData.coordinates.length - 1)]);
            }
        }

        // Only start if geolocation is available
        if (navigator.geolocation) {
            const markerEl = document.createElement('div');
            markerEl.className = 'live-move-marker';
            markerEl.style.width = '32px';
            markerEl.style.height = '32px';
            markerEl.style.display = 'flex';
            markerEl.style.alignItems = 'center';
            markerEl.style.justifyContent = 'center';
            markerEl.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="13" width="24" height="8" rx="3" fill="#3b82f6" stroke="#222" stroke-width="2"/>
                  <rect x="8" y="10" width="16" height="6" rx="2" fill="#fff" stroke="#222" stroke-width="1.5"/>
                  <circle cx="9" cy="24" r="3" fill="#222"/>
                  <circle cx="23" cy="24" r="3" fill="#222"/>
                  <rect x="13" y="6" width="6" height="5" rx="2" fill="#3b82f6" stroke="#222" stroke-width="1.5"/>
                </svg>
            `;
            this.liveMarker = new maplibregl.Marker(markerEl)
                .setLngLat(routeData.coordinates[0])
                .addTo(this.map);

            // Live turn-by-turn instruction
            let currentStep = 0;
            const highlightStep = (idx) => {
                if (!stepsList) return;
                stepsList.querySelectorAll('.route-step').forEach((el, i) => {
                    if (i === idx) {
                        el.classList.add('active-step');
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        el.classList.remove('active-step');
                    }
                });
            };
            highlightStep(0);

            this.liveMoveWatchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.liveMarker.setLngLat([longitude, latitude]);
                    // Check if user is close to next step
                    if (stepCoords.length > 0 && currentStep < stepCoords.length) {
                        const stepCoord = stepCoords[currentStep];
                        const dist = this.calculateDistance([longitude, latitude], stepCoord);
                        if (dist < 0.05) { // 50 meters threshold
                            currentStep++;
                            if (currentStep < stepCoords.length) {
                                highlightStep(currentStep);
                                // Optionally, show a toast or update a live instruction panel
                                this.showLiveInstruction(routeData.steps[currentStep].instruction);
                            } else {
                                highlightStep(stepCoords.length - 1);
                                this.showLiveInstruction('You have arrived at your destination.');
                            }
                        }
                    }
                },
                (error) => {
                    // Optionally handle error
                },
                { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
            );
        }
    }

    // Show live instruction (toast or panel)
    showLiveInstruction(instruction) {
        let livePanel = document.getElementById('live-instruction-panel');
        if (!livePanel) {
            livePanel = document.createElement('div');
            livePanel.id = 'live-instruction-panel';
            livePanel.style.position = 'fixed';
            livePanel.style.bottom = '32px';
            livePanel.style.left = '50%';
            livePanel.style.transform = 'translateX(-50%)';
            livePanel.style.background = '#fff';
            livePanel.style.color = '#222';
            livePanel.style.padding = '12px 24px';
            livePanel.style.borderRadius = '24px';
            livePanel.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
            livePanel.style.fontSize = '1.1rem';
            livePanel.style.zIndex = '9999';
            document.body.appendChild(livePanel);
        }
        livePanel.textContent = instruction;
        livePanel.style.display = 'block';
        // Hide after 8 seconds
        if (this.liveInstructionTimeout) clearTimeout(this.liveInstructionTimeout);
        this.liveInstructionTimeout = setTimeout(() => {
            livePanel.style.display = 'none';
        }, 8000);
    }

    handleRouteClick(e) {
        const { lng, lat } = e.lngLat;
        const originInput = document.getElementById('route-origin');
        const destInput = document.getElementById('route-destination');
        if (!originInput.value) {
            originInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        } else if (!destInput.value) {
            destInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveMapApp();
});