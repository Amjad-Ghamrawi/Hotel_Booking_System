// Listings page specific JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Initialize filters and listings
    setupFilters();
    loadListings();

    // Initialize view toggle
    const gridViewBtn = document.getElementById('grid-view-btn');
    const mapViewBtn = document.getElementById('map-view-btn');
    const listingsGrid = document.getElementById('listings-grid');
    const listingsMap = document.getElementById('listings-map');

    if (gridViewBtn && mapViewBtn && listingsGrid && listingsMap) {
        gridViewBtn.addEventListener('click', function () {
            gridViewBtn.classList.add('active');
            mapViewBtn.classList.remove('active');
            listingsGrid.style.display = 'grid';
            listingsMap.style.display = 'none';
        });

        mapViewBtn.addEventListener('click', function () {
            mapViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            listingsMap.style.display = 'block';
            listingsGrid.style.display = 'none';

            // Initialize map when switching to map view
            initializeMap();
        });
    }

    // Initialize pagination
    initializePagination();
});

// Set up filter functionality
function setupFilters() {
    const minPriceRange = document.getElementById('min-price');
    const maxPriceRange = document.getElementById('max-price');
    const minPriceInput = document.getElementById('min-price-input');
    const maxPriceInput = document.getElementById('max-price-input');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');

    // Sync range sliders with input fields
    if (minPriceRange && minPriceInput) {
        minPriceRange.addEventListener('input', function () {
            minPriceInput.value = this.value;
        });

        minPriceInput.addEventListener('input', function () {
            minPriceRange.value = this.value;
        });
    }

    if (maxPriceRange && maxPriceInput) {
        maxPriceRange.addEventListener('input', function () {
            maxPriceInput.value = this.value;
        });

        maxPriceInput.addEventListener('input', function () {
            maxPriceRange.value = this.value;
        });
    }

    // Apply filters
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function () {
            applyFilters();
        });
    }

    // Reset filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function () {
            resetFilters();
        });
    }
}

// Apply filters to listings
function applyFilters() {
    // Get filter values
    const selectedType = document.querySelector('input[name="type"]:checked')?.value || 'all';
    const minPrice = parseInt(document.getElementById('min-price-input').value);
    const maxPrice = parseInt(document.getElementById('max-price-input').value);
    const location = document.getElementById('location-filter').value;
    const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(el => el.value);

    // Create filter object
    const filters = {
        type: selectedType,
        minPrice: minPrice,
        maxPrice: maxPrice,
        location: location,
        amenities: selectedAmenities
    };

    // Save filters to session storage
    sessionStorage.setItem('listingFilters', JSON.stringify(filters));

    // Reload listings with new filters
    loadListings(1);

    // Show toast notification
    showToast('Filters applied successfully', 'success');
}

// Reset all filters
function resetFilters() {
    // Reset type radio buttons
    const typeRadios = document.querySelectorAll('input[name="type"]');
    typeRadios.forEach(radio => {
        radio.checked = radio.value === 'all';
    });

    // Reset price ranges
    const minPriceRange = document.getElementById('min-price');
    const maxPriceRange = document.getElementById('max-price');
    const minPriceInput = document.getElementById('min-price-input');
    const maxPriceInput = document.getElementById('max-price-input');

    if (minPriceRange) minPriceRange.value = 0;
    if (maxPriceRange) maxPriceRange.value = 1000;
    if (minPriceInput) minPriceInput.value = 0;
    if (maxPriceInput) maxPriceInput.value = 1000;

    // Reset location
    const locationFilter = document.getElementById('location-filter');
    if (locationFilter) locationFilter.value = '';

    // Reset amenities
    const amenityCheckboxes = document.querySelectorAll('input[name="amenities"]');
    amenityCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear filters from session storage
    sessionStorage.removeItem('listingFilters');

    // Reload listings without filters
    loadListings(1);

    // Show toast notification
    showToast('Filters have been reset', 'info');
}

// Initialize pagination controls
function initializePagination() {
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');

    if (prevPageBtn && nextPageBtn) {
        prevPageBtn.addEventListener('click', function () {
            const currentPage = parseInt(currentPageSpan.textContent);
            if (currentPage > 1) {
                loadListings(currentPage - 1);
            }
        });

        nextPageBtn.addEventListener('click', function () {
            const currentPage = parseInt(currentPageSpan.textContent);
            const totalPages = parseInt(totalPagesSpan.textContent);
            if (currentPage < totalPages) {
                loadListings(currentPage + 1);
            }
        });
    }
}

// Load listings with optional page number
function loadListings(page = 1) {
    const listingsGrid = document.getElementById('listings-grid');
    if (!listingsGrid) return;

    // Get stored filters if any
    let filters = {};
    const storedFilters = sessionStorage.getItem('listingFilters');
    if (storedFilters) {
        filters = JSON.parse(storedFilters);
    }

    // In a real application, this data would come from an API with pagination and filtering
    // Here we'll demonstrate with mock data
    const allListings = getMockListings();

    // Apply filters
    let filteredListings = allListings;

    if (filters.type && filters.type !== 'all') {
        filteredListings = filteredListings.filter(listing => listing.type === filters.type);
    }

    if (filters.minPrice !== undefined) {
        filteredListings = filteredListings.filter(listing => listing.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
        filteredListings = filteredListings.filter(listing => listing.price <= filters.maxPrice);
    }

    if (filters.location) {
        filteredListings = filteredListings.filter(listing =>
            listing.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    if (filters.amenities && filters.amenities.length > 0) {
        filteredListings = filteredListings.filter(listing =>
            filters.amenities.every(amenity => listing.amenities?.includes(amenity)));
    }

    // Pagination settings
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

    // Update pagination UI
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');

    if (currentPageSpan) currentPageSpan.textContent = page;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
    if (prevPageBtn) prevPageBtn.disabled = page <= 1;
    if (nextPageBtn) nextPageBtn.disabled = page >= totalPages;

    // Get current page items
    const startIndex = (page - 1) * itemsPerPage;
    const currentItems = filteredListings.slice(startIndex, startIndex + itemsPerPage);

    // Render listings
    listingsGrid.innerHTML = '';

    if (currentItems.length === 0) {
        listingsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>No listings found</h3>
                <p>Try adjusting your filters to see more results</p>
            </div>
        `;
        return;
    }

    currentItems.forEach(listing => {
        const listingCard = document.createElement('div');
        listingCard.className = 'listing-card';
        listingCard.innerHTML = `
            <div class="relative">
                <img src="${listing.image}" alt="${listing.title}" class="listing-image">
                <div style="position: absolute; top: 10px; left: 10px; padding: 5px 10px; background-color: ${listing.type === 'guesthouse' ? '#3366cc' : '#ff6b35'}; color: white; border-radius: 4px; font-size: 0.75rem;">
                    ${listing.type === 'guesthouse' ? 'Guesthouse' : 'Activity'}
                </div>
            </div>
            <div style="padding: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <h3 style="font-size: 1.125rem; margin: 0;">${listing.title}</h3>
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-star" style="color: #ff6b35; margin-right: 5px;"></i>
                        <span>${listing.rating}</span>
                        <span style="color: #999; margin-left: 5px;">(${listing.reviews})</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; color: #666; margin-bottom: 10px;">
                    <i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>
                    <span>${listing.location}</span>
                </div>
                <div style="font-weight: 500;">
                    $${listing.price}${listing.type === 'guesthouse' ? '/night' : '/person'}
                </div>
            </div>
        `;

        listingCard.addEventListener('click', function () {
            window.location.href = `listing-detail.html?id=${listing.id}`;
        });

        listingsGrid.appendChild(listingCard);
    });

    // Also update the map view with the filtered listings
    updateMapView(filteredListings);
}

// Update the map view with filtered listings
function updateMapView(listings) {
    const mapContainer = document.getElementById('listings-map');
    if (!mapContainer) return;

    // In a real application, this would update the map with markers for the filtered listings
    // For this demo, we'll just show a placeholder with location count
    mapContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #f0f0f0; color: #666;">
            <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <p>${listings.length} locations found</p>
            <p style="font-size: 0.875rem; margin-top: 10px;">(Map visualization would be implemented with Google Maps or Mapbox API)</p>
        </div>
    `;
}

// Initialize the map
function initializeMap() {
    // In a real application, this would initialize the map with the Google Maps or Mapbox API
    const mapContainer = document.getElementById('listings-map');
    if (!mapContainer) return;

    // Just to ensure we update the map display when switching to map view
    const storedFilters = sessionStorage.getItem('listingFilters');
    const allListings = getMockListings();

    let filteredListings = allListings;

    if (storedFilters) {
        const filters = JSON.parse(storedFilters);

        if (filters.type && filters.type !== 'all') {
            filteredListings = filteredListings.filter(listing => listing.type === filters.type);
        }

        if (filters.minPrice !== undefined) {
            filteredListings = filteredListings.filter(listing => listing.price >= filters.minPrice);
        }

        if (filters.maxPrice !== undefined) {
            filteredListings = filteredListings.filter(listing => listing.price <= filters.maxPrice);
        }

        if (filters.location) {
            filteredListings = filteredListings.filter(listing =>
                listing.location.toLowerCase().includes(filters.location.toLowerCase()));
        }

        if (filters.amenities && filters.amenities.length > 0) {
            filteredListings = filteredListings.filter(listing =>
                filters.amenities.every(amenity => listing.amenities?.includes(amenity)));
        }
    }

    updateMapView(filteredListings);
}

// Mock listings data
function getMockListings() {
    // In a real application, this data would come from an API
    return [
        {
            id: 'gh-1',
            title: 'Modern Beachfront Villa',
            type: 'guesthouse',
            price: 120,
            location: 'Miami, FL',
            image: getPlaceholderImage('property', 0),
            rating: 4.9,
            reviews: 28,
            amenities: ['wifi', 'pool', 'ac', 'kitchen'],
            mapLocation: {
                lat: 25.7617,
                lng: -80.1918
            }
        },
        {
            id: 'gh-2',
            title: 'Mountain Retreat Cabin',
            type: 'guesthouse',
            price: 95,
            location: 'Asheville, NC',
            image: getPlaceholderImage('property', 1),
            rating: 4.7,
            reviews: 42,
            amenities: ['wifi', 'heating', 'parking'],
            mapLocation: {
                lat: 35.5951,
                lng: -82.5515
            }
        },
        {
            id: 'gh-3',
            title: 'Downtown Luxury Apartment',
            type: 'guesthouse',
            price: 150,
            location: 'New York, NY',
            image: getPlaceholderImage('property', 2),
            rating: 4.8,
            reviews: 63,
            amenities: ['wifi', 'ac', 'kitchen', 'gym'],
            mapLocation: {
                lat: 40.7128,
                lng: -74.006
            }
        },
        {
            id: 'gh-4',
            title: 'Cozy Lake House',
            type: 'guesthouse',
            price: 110,
            location: 'Lake Tahoe, CA',
            image: getPlaceholderImage('property', 3),
            rating: 4.6,
            reviews: 35,
            amenities: ['wifi', 'parking', 'kitchen'],
            mapLocation: {
                lat: 39.0968,
                lng: -120.0324
            }
        },
        {
            id: 'gh-5',
            title: 'Modern Desert Oasis',
            type: 'guesthouse',
            price: 180,
            location: 'Scottsdale, AZ',
            image: getPlaceholderImage('property', 4),
            rating: 4.9,
            reviews: 21,
            amenities: ['wifi', 'pool', 'ac', 'parking'],
            mapLocation: {
                lat: 33.4942,
                lng: -111.9261
            }
        },
        {
            id: 'gh-6',
            title: 'Historic City Loft',
            type: 'guesthouse',
            price: 135,
            location: 'Boston, MA',
            image: getPlaceholderImage('property', 0),
            rating: 4.7,
            reviews: 49,
            amenities: ['wifi', 'ac', 'kitchen'],
            mapLocation: {
                lat: 42.3601,
                lng: -71.0589
            }
        },
        {
            id: 'gh-7',
            title: 'Oceanside Beach House',
            type: 'guesthouse',
            price: 200,
            location: 'San Diego, CA',
            image: getPlaceholderImage('property', 1),
            rating: 4.9,
            reviews: 37,
            amenities: ['wifi', 'pool', 'ac', 'parking', 'kitchen'],
            mapLocation: {
                lat: 32.7157,
                lng: -117.1611
            }
        },
        {
            id: 'gh-8',
            title: 'Rustic Forest Cabin',
            type: 'guesthouse',
            price: 85,
            location: 'Portland, OR',
            image: getPlaceholderImage('property', 2),
            rating: 4.6,
            reviews: 31,
            amenities: ['wifi', 'heating', 'parking'],
            mapLocation: {
                lat: 45.5051,
                lng: -122.675
            }
        },
        {
            id: 'act-1',
            title: 'Sunset Kayak Tour',
            type: 'activity',
            price: 45,
            location: 'San Diego, CA',
            image: getPlaceholderImage('activity', 0),
            rating: 4.8,
            reviews: 56,
            amenities: [],
            mapLocation: {
                lat: 32.7157,
                lng: -117.1611
            }
        },
        {
            id: 'act-2',
            title: 'Wine Tasting Experience',
            type: 'activity',
            price: 65,
            location: 'Napa Valley, CA',
            image: getPlaceholderImage('activity', 1),
            rating: 4.9,
            reviews: 34,
            amenities: [],
            mapLocation: {
                lat: 38.5025,
                lng: -122.2654
            }
        },
        {
            id: 'act-3',
            title: 'Historic City Walking Tour',
            type: 'activity',
            price: 30,
            location: 'Boston, MA',
            image: getPlaceholderImage('activity', 2),
            rating: 4.7,
            reviews: 87,
            amenities: [],
            mapLocation: {
                lat: 42.3601,
                lng: -71.0589
            }
        },
        {
            id: 'act-4',
            title: 'Mountain Biking Adventure',
            type: 'activity',
            price: 75,
            location: 'Moab, UT',
            image: getPlaceholderImage('activity', 3),
            rating: 4.9,
            reviews: 29,
            amenities: [],
            mapLocation: {
                lat: 38.5733,
                lng: -109.5498
            }
        },
        {
            id: 'act-5',
            title: 'Cooking Class with Local Chef',
            type: 'activity',
            price: 60,
            location: 'New Orleans, LA',
            image: getPlaceholderImage('activity', 4),
            rating: 4.8,
            reviews: 42,
            amenities: [],
            mapLocation: {
                lat: 29.9511,
                lng: -90.0715
            }
        },
        {
            id: 'act-6',
            title: 'Surfing Lesson',
            type: 'activity',
            price: 50,
            location: 'Honolulu, HI',
            image: getPlaceholderImage('activity', 0),
            rating: 4.6,
            reviews: 61,
            amenities: [],
            mapLocation: {
                lat: 21.3069,
                lng: -157.8583
            }
        }
    ];
}