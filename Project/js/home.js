// Home page specific JavaScript
document.addEventListener('DOMContentLoaded', function () {
    loadFeaturedGuesthouses();
    loadFeaturedActivities();
    loadMapLocations();
});

// Load featured guesthouses
function loadFeaturedGuesthouses() {
    // In a real application, this data would come from an API
    const featuredGuesthouses = [
        {
            id: 'gh-1',
            title: 'Modern Beachfront Villa',
            type: 'guesthouse',
            price: 120,
            location: 'Miami, FL',
            image: getPlaceholderImage('property', 0),
            rating: 4.9,
            reviews: 28,
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
            mapLocation: {
                lat: 40.7128,
                lng: -74.006
            }
        }
    ];

    renderListings(featuredGuesthouses, 'featured-guesthouses');
}

// Load featured activities
function loadFeaturedActivities() {
    // In a real application, this data would come from an API
    const featuredActivities = [
        {
            id: 'act-1',
            title: 'Sunset Kayak Tour',
            type: 'activity',
            price: 45,
            location: 'San Diego, CA',
            image: getPlaceholderImage('activity', 0),
            rating: 4.8,
            reviews: 56,
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
            mapLocation: {
                lat: 42.3601,
                lng: -71.0589
            }
        }
    ];

    renderListings(featuredActivities, 'featured-activities');
}

// Render listings to a container
function renderListings(listings, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    listings.forEach(listing => {
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

        container.appendChild(listingCard);
    });
}

// Load map locations
function loadMapLocations() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // In a real application, this would initialize a map with markers
    // For this demo, we'll just show a placeholder
    mapContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #f0f0f0; color: #666;">
            <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <p>Interactive map with property and activity locations</p>
            <p style="font-size: 0.875rem; margin-top: 10px;">(Map visualization would be implemented with Google Maps or Mapbox API)</p>
        </div>
    `;
}