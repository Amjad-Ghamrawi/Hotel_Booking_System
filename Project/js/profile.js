// Profile page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Load user profile data
    loadUserProfile(currentUser);

    // Load user bookings
    loadUserBookings();

    // Handle profile edit button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileView = document.getElementById('profile-view');
    const profileEdit = document.getElementById('profile-edit');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    if (editProfileBtn && profileView && profileEdit && cancelEditBtn) {
        editProfileBtn.addEventListener('click', function () {
            profileView.style.display = 'none';
            profileEdit.style.display = 'block';
        });

        cancelEditBtn.addEventListener('click', function () {
            profileView.style.display = 'block';
            profileEdit.style.display = 'none';
        });
    }

    // Handle profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Update user data (in a real app, this would be sent to an API)
            const updatedUser = {
                ...currentUser,
                name: document.getElementById('full-name').value,
                email: document.getElementById('profile-email').value
            };

            // Update localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            // Update the displayed profile information
            document.getElementById('profile-name').textContent = updatedUser.name;
            document.getElementById('display-name').textContent = updatedUser.name;
            document.getElementById('display-email').textContent = updatedUser.email;

            // Show success message
            showToast('Profile updated successfully!', 'success');

            // Switch back to view mode
            profileView.style.display = 'block';
            profileEdit.style.display = 'none';
        });
    }

    // Handle password change
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordModal = document.getElementById('password-modal');
    const cancelPasswordBtn = document.getElementById('cancel-password-btn');
    const savePasswordBtn = document.getElementById('save-password-btn');

    if (changePasswordBtn && passwordModal) {
        changePasswordBtn.addEventListener('click', function () {
            passwordModal.style.display = 'block';
        });

        cancelPasswordBtn?.addEventListener('click', function () {
            passwordModal.style.display = 'none';
            document.getElementById('password-form').reset();
        });

        passwordModal.querySelector('.close-btn')?.addEventListener('click', function () {
            passwordModal.style.display = 'none';
            document.getElementById('password-form').reset();
        });

        savePasswordBtn?.addEventListener('click', function () {
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            // Validate
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                showToast('Please fill in all password fields', 'error');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                showToast('New passwords do not match', 'error');
                return;
            }

            // In a real application, this would verify the current password and update to the new one
            showToast('Password changed successfully', 'success');
            passwordModal.style.display = 'none';
            document.getElementById('password-form').reset();
        });
    }

    // Handle booking filter buttons
    const bookingFilterButtons = document.querySelectorAll('.booking-filters button');
    if (bookingFilterButtons.length > 0) {
        bookingFilterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const filter = button.getAttribute('data-filter');

                // Update active state
                bookingFilterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter bookings
                filterBookings(filter);
            });
        });
    }
});

// Load user profile data
function loadUserProfile(user) {
    // Update profile header
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('member-since').textContent = `Member since ${formatDate(user.joinDate)}`;

    // Update profile avatar
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar && user.profileImage) {
        profileAvatar.src = user.profileImage;
    }

    // Update profile information
    document.getElementById('display-name').textContent = user.name;
    document.getElementById('display-email').textContent = user.email;

    // For demo purposes, we'll use some mock data for the other fields
    document.getElementById('display-phone').textContent = '+1 (555) 123-4567';
    document.getElementById('display-address').textContent = '123 Main Street, Anytown, USA';
    document.getElementById('display-bio').textContent = 'I love traveling and exploring new places!';

    // Update profile form fields
    document.getElementById('full-name').value = user.name;
    document.getElementById('profile-email').value = user.email;
    document.getElementById('phone').value = '+1 (555) 123-4567';
    document.getElementById('address').value = '123 Main Street, Anytown, USA';
    document.getElementById('bio').value = 'I love traveling and exploring new places!';
}

// Load user bookings
function loadUserBookings() {
    const bookingsContainer = document.getElementById('bookings-list');
    if (!bookingsContainer) return;

    // In a real application, this would fetch data from an API
    // Here we'll use mock data
    const mockBookings = [
        {
            id: 'b1',
            listingId: 'gh-1',
            title: 'Modern Beachfront Villa',
            type: 'guesthouse',
            image: getPlaceholderImage('property', 0),
            location: 'Miami, FL',
            checkIn: '2023-12-15',
            checkOut: '2023-12-20',
            guests: 2,
            price: 600,
            status: 'upcoming'
        },
        {
            id: 'b2',
            listingId: 'act-1',
            title: 'Sunset Kayak Tour',
            type: 'activity',
            image: getPlaceholderImage('activity', 0),
            location: 'San Diego, CA',
            date: '2023-11-05',
            time: '5:30 PM',
            participants: 2,
            price: 90,
            status: 'completed'
        },
        {
            id: 'b3',
            listingId: 'gh-2',
            title: 'Mountain Retreat Cabin',
            type: 'guesthouse',
            image: getPlaceholderImage('property', 1),
            location: 'Asheville, NC',
            checkIn: '2023-10-10',
            checkOut: '2023-10-13',
            guests: 4,
            price: 285,
            status: 'completed'
        },
        {
            id: 'b4',
            listingId: 'act-2',
            title: 'Wine Tasting Experience',
            type: 'activity',
            image: getPlaceholderImage('activity', 1),
            location: 'Napa Valley, CA',
            date: '2023-12-18',
            time: '2:00 PM',
            participants: 2,
            price: 130,
            status: 'upcoming'
        }
    ];

    renderBookings(mockBookings, bookingsContainer);
}

// Render bookings
function renderBookings(bookings, container) {
    container.innerHTML = '';

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-day" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                <h3>No bookings found</h3>
                <p>You haven't made any bookings yet.</p>
                <a href="listings.html" class="btn btn-primary mt-3">Explore Listings</a>
            </div>
        `;
        return;
    }

    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.setAttribute('data-status', booking.status);

        if (booking.type === 'guesthouse') {
            // Guesthouse booking
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);
            const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

            bookingCard.innerHTML = `
                <img src="${booking.image}" alt="${booking.title}" class="booking-image">
                <div class="booking-details">
                    <h3 class="booking-title">${booking.title}</h3>
                    <div class="booking-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${booking.location}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}</span>
                        <span><i class="fas fa-user-friends"></i> ${booking.guests} guest${booking.guests > 1 ? 's' : ''}</span>
                    </div>
                    <div class="booking-price">
                        Total: $${booking.price} (${nights} night${nights > 1 ? 's' : ''})
                    </div>
                    <div class="booking-status status-${booking.status}">
                        ${capitalizeFirstLetter(booking.status)}
                    </div>
                    <div class="booking-actions">
                        <button class="btn btn-outline btn-sm">View Receipt</button>
                        ${booking.status === 'upcoming' ? `
                            <button class="btn btn-outline btn-sm btn-danger">Cancel</button>
                        ` : ''}
                    </div>
                </div>
            `;
        } else {
            // Activity booking
            bookingCard.innerHTML = `
                <img src="${booking.image}" alt="${booking.title}" class="booking-image">
                <div class="booking-details">
                    <h3 class="booking-title">${booking.title}</h3>
                    <div class="booking-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${booking.location}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(booking.date)}</span>
                        <span><i class="fas fa-clock"></i> ${booking.time}</span>
                        <span><i class="fas fa-user-friends"></i> ${booking.participants} participant${booking.participants > 1 ? 's' : ''}</span>
                    </div>
                    <div class="booking-price">
                        Total: $${booking.price}
                    </div>
                    <div class="booking-status status-${booking.status}">
                        ${capitalizeFirstLetter(booking.status)}
                    </div>
                    <div class="booking-actions">
                        <button class="btn btn-outline btn-sm">View Receipt</button>
                        ${booking.status === 'upcoming' ? `
                            <button class="btn btn-outline btn-sm btn-danger">Cancel</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        container.appendChild(bookingCard);
    });

    // Add event listeners for action buttons
    container.querySelectorAll('.booking-actions button').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // In a real application, this would perform the corresponding action
            if (button.textContent.includes('Cancel')) {
                const confirmed = confirm('Are you sure you want to cancel this booking?');

                if (confirmed) {
                    showToast('Booking cancelled successfully', 'success');

                    // Remove the booking card
                    const bookingCard = button.closest('.booking-card');
                    if (bookingCard) {
                        bookingCard.remove();
                    }
                }
            } else if (button.textContent.includes('View Receipt')) {
                showToast('Receipt would be displayed here', 'info');
            }
        });
    });
}

// Filter bookings based on status
function filterBookings(filter) {
    const bookingCards = document.querySelectorAll('.booking-card');

    bookingCards.forEach(card => {
        const status = card.getAttribute('data-status');

        if (filter === 'all' || status === filter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}