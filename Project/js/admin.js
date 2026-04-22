// Admin page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Load dashboard data
    loadDashboardStats();

    // Load pending listings
    loadPendingListings();

    // Load users
    loadUsers();

    // Load all listings
    loadAllListings();

    // Initialize charts (placeholder)
    initializeCharts();

    // Handle tab switching
    setupTabs();

    // Handle form submissions
    setupFormSubmissions();
});

// Load dashboard statistics
function loadDashboardStats() {
    // In a real application, this would fetch data from an API
    // For this demo, we'll use mock data
    document.getElementById('total-users').textContent = '856';
    document.getElementById('total-listings').textContent = '342';
    document.getElementById('total-bookings').textContent = '1,289';
    document.getElementById('total-revenue').textContent = '$125,750';
}

// Load pending listings
// Load pending listings from backend
async function loadPendingListings() {
    const pendingListingsContainer = document.getElementById('pending-listings');
    if (!pendingListingsContainer) return;

    try {
        console.log('Sending request to /api/listings/pending');  // Log before fetch

        const response = await fetch('http://localhost:3000/api/listings/pending', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        console.log('Response received:', response);  // Log response object

        if (!response.ok) {
            throw new Error(`Failed to fetch pending listings: ${response.status} ${response.statusText}`);
        }

        const listings = await response.json();

        console.log('Parsed JSON listings:', listings);  // Log parsed data

        pendingListingsContainer.innerHTML = '';

        listings.forEach(listing => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${listing.id}</td>
                <td><img src="${listing.image_url || 'images/default-image.jpg'}" alt="${listing.title}" width="50" height="50" style="object-fit: cover; border-radius: 4px;"></td>
                <td>${listing.title}</td>
                <td><span class="badge ${listing.type === 'guesthouse' ? 'bg-blue' : 'bg-orange'}">${listing.type}</span></td>
                <td>${listing.host_name}</td>
                <td>${new Date(listing.created_at).toLocaleDateString()}</td>
                <td class="table-actions">
                    <button class="action-btn view" data-id="${listing.id}" title="View details"><i class="fas fa-eye"></i></button>
                    <button class="action-btn accept" data-id="${listing.id}" title="Approve"><i class="fas fa-check"></i></button>
                    <button class="action-btn reject" data-id="${listing.id}" title="Reject"><i class="fas fa-times"></i></button>
                </td>
            `;
            pendingListingsContainer.appendChild(row);
        });

        // Add event listeners for approve/reject/view buttons
        pendingListingsContainer.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                if (button.classList.contains('view')) {
                    openListingModal(id);
                } else if (button.classList.contains('accept')) {
                    await approveListing(id);
                    loadPendingListings();  // Refresh list after approval
                } else if (button.classList.contains('reject')) {
                    await rejectListing(id);
                    loadPendingListings();  // Refresh list after rejection
                }
            });
        });

        // Filter listings by type
        document.getElementById('pending-filter')?.addEventListener('change', function () {
            const type = this.value;
            pendingListingsContainer.querySelectorAll('tr').forEach(row => {
                const rowType = row.querySelector('.badge').textContent.trim();
                row.style.display = (type === 'all' || rowType === type) ? '' : 'none';
            });
        });

    } catch (error) {
        console.error('Failed to load pending listings:', error);
    }
}




// Load users
function loadUsers() {
    const usersContainer = document.getElementById('users-list');
    if (!usersContainer) return;

    // In a real application, this would fetch data from an API
    // Here we'll use mock data
    const mockUsers = [
        {
            id: 'u1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'guest',
            joined: '2023-01-15',
            status: 'active'
        },
        {
            id: 'u2',
            name: 'Sarah Wilson',
            email: 'sarah.w@example.com',
            role: 'host',
            joined: '2022-11-20',
            status: 'active'
        },
        {
            id: 'u3',
            name: 'Michael Brown',
            email: 'michael.b@example.com',
            role: 'host',
            joined: '2023-03-05',
            status: 'active'
        },
        {
            id: 'u4',
            name: 'Emily Johnson',
            email: 'emily.j@example.com',
            role: 'guest',
            joined: '2023-02-10',
            status: 'inactive'
        },
        {
            id: 'u5',
            name: 'Robert Smith',
            email: 'robert.s@example.com',
            role: 'admin',
            joined: '2022-10-01',
            status: 'active'
        }
    ];

    usersContainer.innerHTML = '';

    mockUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge ${user.role === 'admin' ? 'bg-purple' :
                user.role === 'host' ? 'bg-green' : 'bg-blue'
            }">
                    ${user.role}
                </span>
            </td>
            <td>${formatDate(user.joined)}</td>
            <td>
                <span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}">
                    ${user.status}
                </span>
            </td>
            <td class="table-actions">
                <button class="action-btn edit" data-id="${user.id}" title="Edit user">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn ${user.status === 'active' ? 'suspend' : 'activate'}" 
                        data-id="${user.id}" 
                        title="${user.status === 'active' ? 'Suspend user' : 'Activate user'}">
                    <i class="fas ${user.status === 'active' ? 'fa-ban' : 'fa-check-circle'}"></i>
                </button>
                <button class="action-btn delete" data-id="${user.id}" title="Delete user">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        usersContainer.appendChild(row);
    });

    // Add event listeners for action buttons
    usersContainer.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function () {
            const id = button.getAttribute('data-id');

            if (button.classList.contains('edit')) {
                showToast('Edit user functionality would go here', 'info');
            } else if (button.classList.contains('suspend')) {
                confirmAction('Are you sure you want to suspend this user?', () => {
                    button.innerHTML = '<i class="fas fa-check-circle"></i>';
                    button.classList.remove('suspend');
                    button.classList.add('activate');
                    button.title = 'Activate user';

                    // Update the status badge
                    const statusBadge = button.closest('tr').querySelector('td:nth-child(6) .badge');
                    statusBadge.textContent = 'inactive';
                    statusBadge.classList.remove('bg-success');
                    statusBadge.classList.add('bg-danger');

                    showToast('User suspended successfully', 'success');
                });
            } else if (button.classList.contains('activate')) {
                confirmAction('Are you sure you want to activate this user?', () => {
                    button.innerHTML = '<i class="fas fa-ban"></i>';
                    button.classList.remove('activate');
                    button.classList.add('suspend');
                    button.title = 'Suspend user';

                    // Update the status badge
                    const statusBadge = button.closest('tr').querySelector('td:nth-child(6) .badge');
                    statusBadge.textContent = 'active';
                    statusBadge.classList.remove('bg-danger');
                    statusBadge.classList.add('bg-success');

                    showToast('User activated successfully', 'success');
                });
            } else if (button.classList.contains('delete')) {
                confirmAction('Are you sure you want to delete this user? This action cannot be undone.', () => {
                    button.closest('tr').remove();
                    showToast('User deleted successfully', 'success');
                });
            }
        });
    });

    // Set up user filter
    document.getElementById('user-filter')?.addEventListener('change', function () {
        const role = this.value;

        usersContainer.querySelectorAll('tr').forEach(row => {
            const rowRole = row.querySelector('td:nth-child(4) .badge').textContent.trim();

            if (role === 'all' || rowRole === role) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Load all listings
function loadAllListings() {
    const allListingsContainer = document.getElementById('all-listings');
    if (!allListingsContainer) return;

    // In a real application, this would fetch data from an API
    // Here we'll use mock data
    const mockListings = [
        {
            id: 'l1',
            image: getPlaceholderImage('property', 0),
            title: 'Beachfront Villa',
            type: 'guesthouse',
            host: {
                id: 'h1',
                name: 'Sarah W.'
            },
            price: 150,
            status: 'active'
        },
        {
            id: 'l2',
            image: getPlaceholderImage('activity', 1),
            title: 'Wine Tasting Tour',
            type: 'activity',
            host: {
                id: 'h2',
                name: 'Michael B.'
            },
            price: 65,
            status: 'active'
        },
        {
            id: 'l3',
            image: getPlaceholderImage('property', 2),
            title: 'Mountain Cabin',
            type: 'guesthouse',
            host: {
                id: 'h3',
                name: 'Robert S.'
            },
            price: 95,
            status: 'suspended'
        },
        {
            id: 'l4',
            image: getPlaceholderImage('activity', 3),
            title: 'Cooking Class',
            type: 'activity',
            host: {
                id: 'h2',
                name: 'Michael B.'
            },
            price: 45,
            status: 'active'
        },
        {
            id: 'l5',
            image: getPlaceholderImage('property', 4),
            title: 'City Apartment',
            type: 'guesthouse',
            host: {
                id: 'h1',
                name: 'Sarah W.'
            },
            price: 120,
            status: 'active'
        }
    ];

    allListingsContainer.innerHTML = '';

    mockListings.forEach(listing => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${listing.id}</td>
            <td>
                <img src="${listing.image}" alt="${listing.title}" width="50" height="50" style="object-fit: cover; border-radius: 4px;">
            </td>
            <td>${listing.title}</td>
            <td>
                <span class="badge ${listing.type === 'guesthouse' ? 'bg-blue' : 'bg-orange'}">
                    ${listing.type}
                </span>
            </td>
            <td>${listing.host.name}</td>
            <td>$${listing.price}</td>
            <td>
                <span class="badge ${listing.status === 'active' ? 'bg-success' : 'bg-danger'}">
                    ${listing.status}
                </span>
            </td>
            <td class="table-actions">
                <button class="action-btn view" data-id="${listing.id}" title="View details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" data-id="${listing.id}" title="Edit listing">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn ${listing.status === 'active' ? 'suspend' : 'activate'}" 
                        data-id="${listing.id}" 
                        title="${listing.status === 'active' ? 'Suspend listing' : 'Activate listing'}">
                    <i class="fas ${listing.status === 'active' ? 'fa-ban' : 'fa-check-circle'}"></i>
                </button>
                <button class="action-btn feature" data-id="${listing.id}" title="Feature listing">
                    <i class="far fa-star"></i>
                </button>
            </td>
        `;

        allListingsContainer.appendChild(row);
    });

    // Add event listeners for action buttons
    allListingsContainer.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function () {
            const id = button.getAttribute('data-id');

            if (button.classList.contains('view')) {
                openListingModal(id, false);
            } else if (button.classList.contains('edit')) {
                showToast('Edit listing functionality would go here', 'info');
            } else if (button.classList.contains('suspend')) {
                confirmAction('Are you sure you want to suspend this listing?', () => {
                    button.innerHTML = '<i class="fas fa-check-circle"></i>';
                    button.classList.remove('suspend');
                    button.classList.add('activate');
                    button.title = 'Activate listing';

                    // Update the status badge
                    const statusBadge = button.closest('tr').querySelector('td:nth-child(7) .badge');
                    statusBadge.textContent = 'suspended';
                    statusBadge.classList.remove('bg-success');
                    statusBadge.classList.add('bg-danger');

                    showToast('Listing suspended successfully', 'success');
                });
            } else if (button.classList.contains('activate')) {
                confirmAction('Are you sure you want to activate this listing?', () => {
                    button.innerHTML = '<i class="fas fa-ban"></i>';
                    button.classList.remove('activate');
                    button.classList.add('suspend');
                    button.title = 'Suspend listing';

                    // Update the status badge
                    const statusBadge = button.closest('tr').querySelector('td:nth-child(7) .badge');
                    statusBadge.textContent = 'active';
                    statusBadge.classList.remove('bg-danger');
                    statusBadge.classList.add('bg-success');

                    showToast('Listing activated successfully', 'success');
                });
            } else if (button.classList.contains('feature')) {
                if (button.querySelector('i').classList.contains('far')) {
                    // Feature the listing
                    button.querySelector('i').classList.remove('far');
                    button.querySelector('i').classList.add('fas');
                    button.title = 'Remove from featured';

                    showToast('Listing added to featured listings', 'success');
                } else {
                    // Unfeature the listing
                    button.querySelector('i').classList.remove('fas');
                    button.querySelector('i').classList.add('far');
                    button.title = 'Feature listing';

                    showToast('Listing removed from featured listings', 'success');
                }
            }
        });
    });

    // Set up listing filter
    document.getElementById('listing-filter')?.addEventListener('change', function () {
        const type = this.value;

        allListingsContainer.querySelectorAll('tr').forEach(row => {
            const rowType = row.querySelector('td:nth-child(4) .badge').textContent.trim();

            if (type === 'all' || rowType === type) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Initialize charts
function initializeCharts() {
    // In a real application, this would use a charting library like Chart.js
    // For this demo, we'll just show placeholders
}

// Set up tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.admin-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabName = button.getAttribute('data-tab');

            // Update active state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');

                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Set up form submissions
function setupFormSubmissions() {
    const settingsForms = document.querySelectorAll('.settings-form');

    settingsForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // In a real application, this would send the form data to the server
            showToast('Settings saved successfully', 'success');
        });
    });
}

// Open listing modal
function openListingModal(id, isPending = true) {
    const modal = document.getElementById('view-listing-modal');
    if (!modal) return;

    // In a real application, this would fetch the listing details from the server
    // For this demo, we'll use mock data
    const listing = {
        id: id,
        title: 'Mountain View Cabin',
        type: 'guesthouse',
        price: 120,
        location: 'Denver, CO',
        description: 'Escape to this charming cabin nestled in the Rocky Mountains. Enjoy breathtaking views, modern amenities, and complete privacy.',
        host: 'Michael Johnson',
        submitted: '2023-05-10',
        images: [
            getPlaceholderImage('property', 0),
            getPlaceholderImage('property', 1),
            getPlaceholderImage('property', 2)
        ],
        details: {
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 1
        },
        amenities: ['Wi-Fi', 'Parking', 'Kitchen', 'Air Conditioning', 'TV', 'Heating']
    };

    // Update modal content
    document.getElementById('modal-listing-title').textContent = listing.title;
    document.getElementById('modal-main-image').src = listing.images[0];
    document.getElementById('modal-type').textContent = capitalizeFirstLetter(listing.type);
    document.getElementById('modal-price').textContent = `$${listing.price}/${listing.type === 'guesthouse' ? 'night' : 'person'}`;
    document.getElementById('modal-location').textContent = listing.location;
    document.getElementById('modal-host').textContent = listing.host;
    document.getElementById('modal-date').textContent = formatDate(listing.submitted);
    document.getElementById('modal-description').textContent = listing.description;

    // Update thumbnails
    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    thumbnailsContainer.innerHTML = '';

    listing.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `${listing.title} - ${index + 1}`;
        thumbnail.className = `thumbnail${index === 0 ? ' active' : ''}`;

        thumbnail.addEventListener('click', function () {
            document.getElementById('modal-main-image').src = image;

            // Update active thumbnail
            thumbnailsContainer.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
        });

        thumbnailsContainer.appendChild(thumbnail);
    });

    // Update details
    const detailsContainer = document.getElementById('modal-details');
    detailsContainer.innerHTML = '';

    if (listing.type === 'guesthouse') {
        detailsContainer.innerHTML = `
            <div>
                <strong>Max Guests:</strong> ${listing.details.maxGuests}
            </div>
            <div>
                <strong>Bedrooms:</strong> ${listing.details.bedrooms}
            </div>
            <div>
                <strong>Bathrooms:</strong> ${listing.details.bathrooms}
            </div>
        `;
    } else {
        detailsContainer.innerHTML = `
            <div>
                <strong>Duration:</strong> 2 hours
            </div>
            <div>
                <strong>Group Size:</strong> Up to 8 people
            </div>
            <div>
                <strong>Difficulty:</strong> Beginner-friendly
            </div>
        `;
    }

    // Update amenities
    const amenitiesContainer = document.getElementById('modal-amenities');
    amenitiesContainer.innerHTML = '';

    listing.amenities.forEach(amenity => {
        const amenityTag = document.createElement('div');
        amenityTag.className = 'amenity-tag';
        amenityTag.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${amenity}</span>
        `;

        amenitiesContainer.appendChild(amenityTag);
    });

    // Show appropriate action buttons
    document.getElementById('approval-actions').style.display = isPending ? 'flex' : 'none';
    document.getElementById('management-actions').style.display = isPending ? 'none' : 'flex';

    // Initialize map (placeholder)
    document.getElementById('modal-map').innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #f0f0f0; color: #666;">
            <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 15px;"></i>
            <p>Location: Denver, CO</p>
            <p style="font-size: 0.875rem; margin-top: 10px;">(Map visualization would be implemented with Google Maps or Mapbox API)</p>
        </div>
    `;

    // Add action button event listeners
    document.getElementById('approval-btn')?.addEventListener('click', function () {
        approveListing(listing.id);
        modal.style.display = 'none';
    });

    document.getElementById('rejection-btn')?.addEventListener('click', function () {
        rejectListing(listing.id);
        modal.style.display = 'none';
    });

    // Show modal
    modal.style.display = 'block';
}

// Approve a listing
function approveListing(id) {
    confirmAction('Are you sure you want to approve this listing?', () => {
        // In a real application, this would send an API request
        // For this demo, we'll just remove the row from the table
        const row = document.querySelector(`#pending-listings tr button.accept[data-id="${id}"]`)?.closest('tr');
        if (row) {
            row.remove();
        }

        showToast('Listing approved successfully', 'success');
    });
}

// Reject a listing
function rejectListing(id) {
    // Show a dialog asking for rejection reason
    const reason = prompt('Please provide a reason for rejecting this listing:');

    if (reason !== null) {
        // In a real application, this would send an API request
        // For this demo, we'll just remove the row from the table
        const row = document.querySelector(`#pending-listings tr button.reject[data-id="${id}"]`)?.closest('tr');
        if (row) {
            row.remove();
        }

        showToast('Listing rejected successfully', 'success');
    }
}

// Helper function for confirmation dialogs
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}