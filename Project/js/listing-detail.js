// Listing Detail page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Get listing ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('id');

    if (listingId) {
        loadListingDetails(listingId);
    } else {
        // Redirect to listings page if no ID is provided
        window.location.href = 'listings.html';
    }

    // Set up reservation modal
    setupReservationModal();

    // Set up gallery
    document.getElementById('view-all-photos')?.addEventListener('click', function () {
        // In a real application, this could open a photo gallery modal
        alert('Photo gallery would open here');
    });
});

// Load listing details
function loadListingDetails(listingId) {
    // In a real application, this would fetch data from an API
    const listing = getMockListingById(listingId);

    if (!listing) {
        // Listing not found, redirect to listings page
        window.location.href = 'listings.html';
        return;
    }

    // Update page title
    document.title = `${listing.title} - BookEase`;

    // Update breadcrumb
    const listingTitleSpan = document.getElementById('listing-title');
    if (listingTitleSpan) {
        listingTitleSpan.textContent = listing.title;
    }

    // Update gallery
    updateGallery(listing);

    // Update listing information
    updateListingInfo(listing);

    // Update booking form based on listing type
    updateBookingForm(listing);

    // Load reviews
    loadReviews(listing);

    // Initialize map
    initializeDetailMap(listing.mapLocation);
}

// Update gallery with listing images
function updateGallery(listing) {
    const galleryContainer = document.getElementById('listing-gallery');
    if (!galleryContainer) return;

    // In a real application, listing would have multiple images
    // For this demo, we'll create 5 images from the same source with different crop parameters
    const images = [
        listing.image,
        listing.image + '?crop=focalpoint&fp-x=0.7',
        listing.image + '?crop=focalpoint&fp-x=0.3',
        listing.image + '?crop=focalpoint&fp-y=0.7',
        listing.image + '?crop=focalpoint&fp-y=0.3'
    ];

    galleryContainer.innerHTML = '';

    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${listing.title} - Image ${index + 1}`;

        galleryContainer.appendChild(img);
    });
}

// Update listing information
function updateListingInfo(listing) {
    // Update title and basic info
    document.getElementById('detail-title').textContent = listing.title;
    document.getElementById('detail-rating').textContent = listing.rating;
    document.getElementById('detail-reviews').textContent = listing.reviews;
    document.getElementById('detail-location').textContent = listing.location;
    document.getElementById('detail-description').textContent = listing.description;

    // Update booking card price
    document.getElementById('booking-price').textContent = `$${listing.price}`;
    document.getElementById('price-unit').textContent = listing.type === 'guesthouse' ? '/night' : '/person';

    // Update booking summary
    document.getElementById('price-calculation').textContent = `$${listing.price} × 1 ${listing.type === 'guesthouse' ? 'night' : 'person'}`;
    document.getElementById('subtotal').textContent = `$${listing.price}`;

    const serviceFee = Math.round(listing.price * 0.12); // 12% service fee
    document.getElementById('service-fee').textContent = `$${serviceFee}`;

    const totalPrice = listing.price + serviceFee;
    document.getElementById('total-price').textContent = `$${totalPrice}`;

    // Update host information
    document.getElementById('host-image').src = listing.host.image;
    document.getElementById('host-name').textContent = listing.host.name;
    document.getElementById('host-rating').textContent = listing.host.rating;
    document.getElementById('host-joined').textContent = listing.host.joinedDate;
    document.getElementById('host-bio').textContent = listing.host.bio;

    // Update listing details (property features or activity details)
    const detailsContainer = document.getElementById('listing-details');
    detailsContainer.innerHTML = '';

    if (listing.type === 'guesthouse') {
        // Guesthouse details
        detailsContainer.innerHTML = `
            <div class="detail-item">
                <div class="detail-icon">
                    <i class="fas fa-user-friends"></i>
                </div>
                <div class="detail-info">
                    <h4>Max Guests</h4>
                    <p>${listing.maxGuests} guests</p>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-icon">
                    <i class="fas fa-bed"></i>
                </div>
                <div class="detail-info">
                    <h4>Bedrooms</h4>
                    <p>${listing.bedrooms} bedrooms</p>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-icon">
                    <i class="fas fa-bath"></i>
                </div>
                <div class="detail-info">
                    <h4>Bathrooms</h4>
                    <p>${listing.bathrooms} bathrooms</p>
                </div>
            </div>
        `;
    } else {
        // Activity details
        detailsContainer.innerHTML = `
            <div class="detail-item">
                <div class="detail-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="detail-info">
                    <h4>Duration</h4>
                    <p>${listing.duration} hours</p>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="detail-info">
                    <h4>Group Size</h4>
                    <p>Up to ${listing.groupSize} people</p>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-icon">
                    <i class="fas fa-signal"></i>
                </div>
                <div class="detail-info">
                    <h4>Difficulty</h4>
                    <p>${listing.difficulty}</p>
                </div>
            </div>
        `;
    }

    // Update amenities
    const amenitiesContainer = document.getElementById('listing-amenities');
    amenitiesContainer.innerHTML = '';

    if (listing.amenities && listing.amenities.length > 0) {
        listing.amenities.forEach(amenity => {
            const amenityName = amenity.charAt(0).toUpperCase() + amenity.slice(1);
            const amenityIcon = getAmenityIcon(amenity);

            const amenityItem = document.createElement('div');
            amenityItem.className = 'amenity-item';
            amenityItem.innerHTML = `
                <i class="${amenityIcon}"></i>
                <span>${amenityName}</span>
            `;

            amenitiesContainer.appendChild(amenityItem);
        });
    } else {
        amenitiesContainer.innerHTML = '<p>No amenities listed for this property</p>';
    }
}

// Update booking form based on listing type
function updateBookingForm(listing) {
    const guesthouseForm = document.getElementById('guesthouse-booking-form');
    const activityForm = document.getElementById('activity-booking-form');

    if (listing.type === 'guesthouse') {
        if (guesthouseForm) guesthouseForm.style.display = 'block';
        if (activityForm) activityForm.style.display = 'none';

        // Set default dates
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const checkInInput = document.getElementById('check-in');
        const checkOutInput = document.getElementById('check-out');

        if (checkInInput) {
            checkInInput.min = today.toISOString().split('T')[0];
            checkInInput.value = today.toISOString().split('T')[0];

            checkInInput.addEventListener('change', updateBookingSummary);
        }

        if (checkOutInput) {
            checkOutInput.min = tomorrow.toISOString().split('T')[0];
            checkOutInput.value = tomorrow.toISOString().split('T')[0];

            checkOutInput.addEventListener('change', updateBookingSummary);
        }

        // Set max guests
        const guestsSelect = document.getElementById('guests');
        if (guestsSelect && listing.maxGuests) {
            guestsSelect.innerHTML = '';

            for (let i = 1; i <= listing.maxGuests; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i === 1 ? '1 guest' : `${i} guests`;
                guestsSelect.appendChild(option);
            }
        }
    } else {
        if (guesthouseForm) guesthouseForm.style.display = 'none';
        if (activityForm) activityForm.style.display = 'block';

        // Set default date
        const today = new Date();
        const activityDateInput = document.getElementById('activity-date');

        if (activityDateInput) {
            activityDateInput.min = today.toISOString().split('T')[0];
            activityDateInput.value = today.toISOString().split('T')[0];

            activityDateInput.addEventListener('change', updateBookingSummary);
        }

        // Set max participants
        const participantsSelect = document.getElementById('participants');
        if (participantsSelect && listing.groupSize) {
            participantsSelect.innerHTML = '';

            for (let i = 1; i <= listing.groupSize; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i === 1 ? '1 person' : `${i} people`;
                participantsSelect.appendChild(option);
            }

            participantsSelect.addEventListener('change', updateBookingSummary);
        }

        // Handle time selection
        const activityTimeSelect = document.getElementById('activity-time');
        if (activityTimeSelect) {
            activityTimeSelect.addEventListener('change', updateBookingSummary);
        }
    }
}

// Update booking summary when dates or guests change
function updateBookingSummary() {
    const listing = getMockListingById(new URLSearchParams(window.location.search).get('id'));
    if (!listing) return;

    if (listing.type === 'guesthouse') {
        const checkInDate = new Date(document.getElementById('check-in').value);
        const checkOutDate = new Date(document.getElementById('check-out').value);
        const numGuests = parseInt(document.getElementById('guests').value);

        // Calculate number of nights
        const nights = Math.max(1, Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));

        // Update price calculation
        const subtotal = listing.price * nights;
        document.getElementById('price-calculation').textContent = `$${listing.price} × ${nights} night${nights > 1 ? 's' : ''}`;
        document.getElementById('subtotal').textContent = `$${subtotal}`;

        // Update service fee and total
        const serviceFee = Math.round(subtotal * 0.12); // 12% service fee
        document.getElementById('service-fee').textContent = `$${serviceFee}`;

        const totalPrice = subtotal + serviceFee;
        document.getElementById('total-price').textContent = `$${totalPrice}`;
    } else {
        const numParticipants = parseInt(document.getElementById('participants').value);

        // Update price calculation
        const subtotal = listing.price * numParticipants;
        document.getElementById('price-calculation').textContent = `$${listing.price} × ${numParticipants} ${numParticipants > 1 ? 'people' : 'person'}`;
        document.getElementById('subtotal').textContent = `$${subtotal}`;

        // Update service fee and total
        const serviceFee = Math.round(subtotal * 0.12); // 12% service fee
        document.getElementById('service-fee').textContent = `$${serviceFee}`;

        const totalPrice = subtotal + serviceFee;
        document.getElementById('total-price').textContent = `$${totalPrice}`;
    }
}

// Load reviews for the listing
function loadReviews(listing) {
    // In a real application, this would fetch reviews from an API
    const mockReviews = [
        {
            id: 'r1',
            user: {
                name: 'Sarah L.',
                image: getPlaceholderImage('avatar', 0)
            },
            date: '2023-04-15',
            rating: 5,
            comment: 'Absolutely loved our stay here! The place was exactly as described, very clean and comfortable. The host was very responsive and helpful. Would definitely stay here again.'
        },
        {
            id: 'r2',
            user: {
                name: 'Michael T.',
                image: getPlaceholderImage('avatar', 1)
            },
            date: '2023-03-22',
            rating: 4,
            comment: 'Great location and very comfortable. The only reason I\'m not giving 5 stars is because the WiFi was a bit spotty at times. Otherwise, everything was perfect.'
        },
        {
            id: 'r3',
            user: {
                name: 'Jessica M.',
                image: getPlaceholderImage('avatar', 2)
            },
            date: '2023-02-10',
            rating: 5,
            comment: 'This was one of the best experiences I\'ve had! The host went above and beyond to make us feel welcome. The place was spotless and had everything we needed.'
        }
    ];

    // Update average rating and reviews count
    document.getElementById('avg-rating').textContent = listing.rating;
    document.getElementById('review-count').textContent = `${listing.reviews} reviews`;

    // Update rating breakdown
    const ratingBreakdownContainer = document.getElementById('rating-breakdown');
    if (ratingBreakdownContainer) {
        ratingBreakdownContainer.innerHTML = `
            <div class="rating-row">
                <span class="rating-category">Cleanliness</span>
                <div class="rating-bar"><div class="rating-fill" style="width: 96%;"></div></div>
                <span class="rating-value">4.8</span>
            </div>
            <div class="rating-row">
                <span class="rating-category">Accuracy</span>
                <div class="rating-bar"><div class="rating-fill" style="width: 94%;"></div></div>
                <span class="rating-value">4.7</span>
            </div>
            <div class="rating-row">
                <span class="rating-category">Communication</span>
                <div class="rating-bar"><div class="rating-fill" style="width: 100%;"></div></div>
                <span class="rating-value">5.0</span>
            </div>
            <div class="rating-row">
                <span class="rating-category">Location</span>
                <div class="rating-bar"><div class="rating-fill" style="width: 90%;"></div></div>
                <span class="rating-value">4.5</span>
            </div>
            <div class="rating-row">
                <span class="rating-category">Value</span>
                <div class="rating-bar"><div class="rating-fill" style="width: 92%;"></div></div>
                <span class="rating-value">4.6</span>
            </div>
        `;
    }

    // Render reviews
    const reviewsContainer = document.getElementById('reviews-list');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = '';

        mockReviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <img src="${review.user.image}" alt="${review.user.name}" class="reviewer-image">
                    <div class="reviewer-info">
                        <h4>${review.user.name}</h4>
                        <span class="review-date">${formatDate(review.date)}</span>
                    </div>
                </div>
                <div class="review-rating">
                    <div class="stars">
                        ${Array(5).fill().map((_, i) => `
                            <i class="fas fa-star${i < review.rating ? '' : ' far'}"></i>
                        `).join('')}
                    </div>
                </div>
                <p class="review-text">${review.comment}</p>
            `;

            reviewsContainer.appendChild(reviewElement);
        });
    }

    // Load more reviews button
    document.getElementById('load-more-reviews')?.addEventListener('click', function () {
        // In a real application, this would load more reviews from the API
        showToast('More reviews would load here', 'info');
    });
}

// Set up reservation modal
function setupReservationModal() {
    const reserveBtn = document.getElementById('reserve-btn');
    const bookingModal = document.getElementById('booking-modal');
    const closeBtn = bookingModal?.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancel-booking');
    const confirmBtn = document.getElementById('confirm-booking');

    if (reserveBtn && bookingModal) {
        reserveBtn.addEventListener('click', function () {
            // Get listing data
            const listing = getMockListingById(new URLSearchParams(window.location.search).get('id'));
            if (!listing) return;

            // Update modal with booking details
            document.getElementById('modal-listing-image').src = listing.image;
            document.getElementById('modal-listing-title').textContent = listing.title;

            // Get booking details
            let bookingDetails = '';
            let subtotal = 0;

            if (listing.type === 'guesthouse') {
                const checkInDate = document.getElementById('check-in').value;
                const checkOutDate = document.getElementById('check-out').value;
                const numGuests = document.getElementById('guests').value;

                // Calculate number of nights
                const checkIn = new Date(checkInDate);
                const checkOut = new Date(checkOutDate);
                const nights = Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)));

                bookingDetails = `${formatDate(checkInDate)} to ${formatDate(checkOutDate)} · ${numGuests} guest${numGuests > 1 ? 's' : ''}`;
                subtotal = listing.price * nights;

                document.getElementById('modal-price-calculation').textContent = `$${listing.price} × ${nights} night${nights > 1 ? 's' : ''}`;
            } else {
                const activityDate = document.getElementById('activity-date').value;
                const activityTime = document.getElementById('activity-time').options[document.getElementById('activity-time').selectedIndex].text;
                const numParticipants = document.getElementById('participants').value;

                bookingDetails = `${formatDate(activityDate)} · ${activityTime} · ${numParticipants} ${numParticipants > 1 ? 'people' : 'person'}`;
                subtotal = listing.price * numParticipants;

                document.getElementById('modal-price-calculation').textContent = `$${listing.price} × ${numParticipants} ${numParticipants > 1 ? 'people' : 'person'}`;
            }

            document.getElementById('modal-booking-details').textContent = bookingDetails;
            document.getElementById('modal-subtotal').textContent = `$${subtotal}`;

            const serviceFee = Math.round(subtotal * 0.12);
            document.getElementById('modal-service-fee').textContent = `$${serviceFee}`;
            document.getElementById('modal-total-price').textContent = `$${subtotal + serviceFee}`;

            // Show modal
            bookingModal.style.display = 'block';
        });

        // Close modal when clicking close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                bookingModal.style.display = 'none';
            });
        }

        // Cancel booking
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                bookingModal.style.display = 'none';
            });
        }

        // Confirm booking
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
                // In a real application, this would send booking data to the server
                bookingModal.style.display = 'none';
                showToast('Booking confirmed! Check your email for details.', 'success');
            });
        }
    }
}

// Initialize map
function initializeDetailMap(location) {
    const mapContainer = document.getElementById('detail-map');
    if (!mapContainer) return;

    // In a real application, this would initialize a map with the Google Maps or Mapbox API
    // For this demo, we'll just show a placeholder
    mapContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #f0f0f0; color: #666;">
            <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 15px;"></i>
            <p>Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
            <p style="font-size: 0.875rem; margin-top: 10px;">(Map visualization would be implemented with Google Maps or Mapbox API)</p>
        </div>
    `;
}

// Helper function to get icon for amenity
function getAmenityIcon(amenity) {
    const icons = {
        wifi: 'fas fa-wifi',
        pool: 'fas fa-swimming-pool',
        parking: 'fas fa-parking',
        ac: 'fas fa-snowflake',
        kitchen: 'fas fa-utensils',
        tv: 'fas fa-tv',
        heating: 'fas fa-thermometer-three-quarters',
        washer: 'fas fa-soap',
        dryer: 'fas fa-wind',
        'hot-tub': 'fas fa-hot-tub',
        gym: 'fas fa-dumbbell',
        pets: 'fas fa-paw'
    };

    return icons[amenity] || 'fas fa-check';
}

// Get mock listing by ID
function getMockListingById(id) {
    // In a real application, this would fetch data from an API
    const listings = {
        'gh-1': {
            id: 'gh-1',
            title: 'Modern Beachfront Villa',
            type: 'guesthouse',
            description: 'Enjoy this stunning beachfront villa with panoramic ocean views. Perfect for a family vacation or a romantic getaway. This modern property features an open-plan living space, fully equipped kitchen, and a private terrace overlooking the water.',
            price: 120,
            location: 'Miami, FL',
            image: getPlaceholderImage('property', 0),
            rating: 4.9,
            reviews: 28,
            amenities: ['wifi', 'pool', 'ac', 'kitchen'],
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 2,
            host: {
                name: 'Sophie R.',
                image: getPlaceholderImage('avatar', 0),
                rating: 4.8,
                joinedDate: 'March 2019',
                bio: 'Hi! I\'m Sophie, a Miami local who loves to share the beauty of our beaches with travelers from around the world. I ensure all my properties are clean, comfortable, and well-stocked with everything you need for a perfect stay.'
            },
            mapLocation: {
                lat: 25.7617,
                lng: -80.1918
            }
        },
        'gh-2': {
            id: 'gh-2',
            title: 'Mountain Retreat Cabin',
            type: 'guesthouse',
            description: 'Escape to this cozy mountain cabin nestled among the trees. Enjoy hiking trails, fresh mountain air, and stunning views. The cabin features a rustic-chic interior, wood-burning fireplace, and a spacious deck perfect for stargazing.',
            price: 95,
            location: 'Asheville, NC',
            image: getPlaceholderImage('property', 1),
            rating: 4.7,
            reviews: 42,
            amenities: ['wifi', 'heating', 'parking', 'kitchen'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 1,
            host: {
                name: 'Mark T.',
                image: getPlaceholderImage('avatar', 1),
                rating: 4.9,
                joinedDate: 'June 2020',
                bio: 'I\'m a nature enthusiast who loves sharing the beauty of the mountains with others. My cabin is my pride and joy, and I have put a lot of care into making it a comfortable retreat for all my guests.'
            },
            mapLocation: {
                lat: 35.5951,
                lng: -82.5515
            }
        },
        'act-1': {
            id: 'act-1',
            title: 'Sunset Kayak Tour',
            type: 'activity',
            description: 'Experience the magic of a sunset from the water on our guided kayak tour. Paddle through calm waters as the sky transforms with vibrant colors. Our experienced guides will point out local wildlife and share interesting facts about the ecosystem.',
            price: 45,
            location: 'San Diego, CA',
            image: getPlaceholderImage('activity', 0),
            rating: 4.8,
            reviews: 56,
            duration: 2,
            groupSize: 8,
            difficulty: 'Beginner-friendly',
            host: {
                name: 'David W.',
                image: getPlaceholderImage('avatar', 2),
                rating: 4.9,
                joinedDate: 'April 2018',
                bio: 'As a certified kayaking instructor with over 10 years of experience, I love sharing my passion for the ocean with others. Safety is my top priority, and I make sure everyone has a great time regardless of experience level.'
            },
            mapLocation: {
                lat: 32.7157,
                lng: -117.1611
            }
        },
        'act-2': {
            id: 'act-2',
            title: 'Wine Tasting Experience',
            type: 'activity',
            description: 'Join us for an intimate wine tasting experience featuring award-winning local wines. You will learn about the winemaking process, proper tasting techniques, and how to pair different wines with food. The experience includes tastings of six premium wines and a selection of artisanal cheeses.',
            price: 65,
            location: 'Napa Valley, CA',
            image: getPlaceholderImage('activity', 1),
            rating: 4.9,
            reviews: 34,
            duration: 3,
            groupSize: 10,
            difficulty: 'All welcome',
            host: {
                name: 'Emma T.',
                image: getPlaceholderImage('avatar', 3),
                rating: 5.0,
                joinedDate: 'May 2017',
                bio: 'With a background in viticulture and a certification as a sommelier, I love demystifying the world of wine for both beginners and connoisseurs alike. My tours focus on education, enjoyment, and creating memorable experiences.'
            },
            mapLocation: {
                lat: 38.5025,
                lng: -122.2654
            }
        }
    };

    return listings[id];
}