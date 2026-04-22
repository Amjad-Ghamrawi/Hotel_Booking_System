// Main JavaScript file for all pages

document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function () {
            nav.classList.toggle('active');
        });
    }

    // Check if user is logged in (from localStorage)
    checkAuthStatus();

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }

    // Initialize modals if they exist
    initModals();

    // Initialize tab system if it exists
    initTabs();

    // Initialize FAQ accordions if they exist
    initFAQAccordion();
});

// Authentication Functions
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    const authButtons = document.querySelector('.auth-buttons');
    const profileMenu = document.querySelector('.profile-menu');

    if (user) {
        // User is logged in
        const userData = JSON.parse(user);

        // Hide auth buttons, show profile menu
        if (authButtons) authButtons.style.display = 'none';
        if (profileMenu) {
            profileMenu.style.display = 'block';

            // Set profile image if available
            const headerAvatar = document.getElementById('header-avatar');
            if (headerAvatar && userData.profileImage) {
                headerAvatar.src = userData.profileImage;
            }

            // If on admin page and user is not admin, redirect
            const isAdminPage = window.location.pathname.includes('admin.html');
            if (isAdminPage && userData.role !== 'admin') {
                window.location.href = 'index.html';
                return;
            }

            // Show/hide admin nav item based on role
            const adminNavItem = document.querySelector('.nav-item a[href="admin.html"]');
            if (adminNavItem) {
                adminNavItem.parentElement.style.display = userData.role === 'admin' ? 'block' : 'none';
            }

            // Show/hide "Host with Us" nav item based on role
            const hostNavItem = document.querySelector('.nav-item a[href="host.html"]');
            if (hostNavItem) {
                if (userData.role === 'guest') {
                    hostNavItem.parentElement.style.display = 'none';
                } else {
                    hostNavItem.parentElement.style.display = 'block';
                }
            }
        }
    } else {
        // No user is logged in
        if (authButtons) authButtons.style.display = 'flex';
        if (profileMenu) profileMenu.style.display = 'none';

        // Redirect from protected pages
        const currentPage = window.location.pathname;
        const protectedPages = ['profile.html', 'admin.html'];

        if (protectedPages.some(page => currentPage.includes(page))) {
            window.location.href = 'login.html';
        }

        // Since no user, hide "Host with Us" nav item too
        const hostNavItem = document.querySelector('.nav-item a[href="host.html"]');
        if (hostNavItem) {
            hostNavItem.parentElement.style.display = 'none';
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Modal Functions
function initModals() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        // Get close buttons in this modal
        const closeButtons = modal.querySelectorAll('.close-btn');

        // Add click event to close buttons
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });

        // Close modal when clicking outside of modal content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Tab Functions
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the tab to show from the data-tab attribute
            const tabToShow = button.getAttribute('data-tab');

            // Remove active class from all tabs and buttons
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');

            // Add active class to clicked button and show the tab
            button.classList.add('active');
            document.getElementById(`${tabToShow}-tab`).style.display = 'block';
        });
    });

    // Check URL parameters for tab selection
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam) {
        const tabButton = document.querySelector(`.tab-btn[data-tab="${tabParam}"]`);
        if (tabButton) {
            tabButton.click();
        }
    }
}

// FAQ Accordion Function
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Toggle active class
            item.classList.toggle('active');

            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

// Toast notification function
function showToast(message, type = 'info') {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.toast-container');

    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);

        // Add styles to the container
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '10000';
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;

    // Style the toast
    toast.style.backgroundColor = type === 'success' ? '#28a745' :
        type === 'error' ? '#dc3545' :
            type === 'warning' ? '#ffc107' : '#17a2b8';
    toast.style.color = type === 'warning' ? '#212529' : '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '4px';
    toast.style.marginBottom = '10px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';

    // Add toast to container
    toastContainer.appendChild(toast);

    // Animate the toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Generate random ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Format currency
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Simple image placeholder function
function getPlaceholderImage(type = 'property', index = 1) {
    const propertyImages = [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb',
        'https://images.unsplash.com/photo-1523217582562-09d0def993a6',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
    ];

    const activityImages = [
        'https://images.unsplash.com/photo-1526976668912-1a811878dd37',
        'https://images.unsplash.com/photo-1504609813442-a8924e83f76e',
        'https://images.unsplash.com/photo-1533105079780-92b9be482077',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'
    ];

    const avatarImages = [
        'https://randomuser.me/api/portraits/men/32.jpg',
        'https://randomuser.me/api/portraits/women/44.jpg',
        'https://randomuser.me/api/portraits/men/51.jpg',
        'https://randomuser.me/api/portraits/women/72.jpg',
        'https://randomuser.me/api/portraits/men/22.jpg'
    ];

    if (type === 'activity') {
        return activityImages[index % activityImages.length];
    } else if (type === 'avatar') {
        return avatarImages[index % avatarImages.length];
    } else {
        return propertyImages[index % propertyImages.length];
    }
}
