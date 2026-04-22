// Host page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Set up host option cards
    setupHostOptions();

    // Set up photo upload
    setupPhotoUpload('gh-upload-btn', 'gh-photo-upload', 'gh-photo-preview');
    setupPhotoUpload('act-upload-btn', 'act-photo-upload', 'act-photo-preview');

    // Initialize form submission
    setupFormSubmission();

    // Initialize time slot management
    setupTimeSlotManagement();
});

// Set up host option cards
function setupHostOptions() {
    const hostOptionCards = document.querySelectorAll('.host-option-card');
    const guesthouseForm = document.getElementById('guesthouse-form');
    const activityForm = document.getElementById('activity-form');

    if (hostOptionCards.length > 0) {
        hostOptionCards.forEach(card => {
            card.addEventListener('click', function () {
                const type = card.getAttribute('data-type');

                // Update active state
                hostOptionCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Show corresponding form
                if (type === 'guesthouse') {
                    guesthouseForm.classList.add('active');
                    activityForm.classList.remove('active');
                } else {
                    activityForm.classList.add('active');
                    guesthouseForm.classList.remove('active');
                }
            });
        });
    }
}

// Set up photo upload
function setupPhotoUpload(buttonId, fileInputId, previewId) {
    const uploadBtn = document.getElementById(buttonId);
    const fileInput = document.getElementById(fileInputId);
    const previewContainer = document.getElementById(previewId);

    if (uploadBtn && fileInput && previewContainer) {
        uploadBtn.addEventListener('click', function () {
            fileInput.click();
        });

        fileInput.addEventListener('change', function () {
            if (this.files && this.files.length > 0) {
                // Process each file
                Array.from(this.files).forEach(file => {
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        // Create preview element
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';

                        previewItem.innerHTML = `
                            <img src="${e.target.result}" alt="Uploaded photo">
                            <button type="button" class="remove-photo">
                                <i class="fas fa-times"></i>
                            </button>
                        `;

                        // Add remove event listener
                        previewItem.querySelector('.remove-photo').addEventListener('click', function () {
                            previewItem.remove();
                        });

                        previewContainer.appendChild(previewItem);
                    };

                    reader.readAsDataURL(file);
                });

                // Reset file input
                this.value = '';
            }
        });

        // Handle drag and drop uploads
        const uploadArea = document.getElementById(fileInputId).parentElement;

        if (uploadArea) {
            uploadArea.addEventListener('dragover', function (e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', function (e) {
                e.preventDefault();
                this.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', function (e) {
                e.preventDefault();
                this.classList.remove('drag-over');

                if (e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;

                    // Trigger the change event manually
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });
        }
    }
}

// Initialize form submission
function setupFormSubmission() {
    const guesthouseForm = document.getElementById('guesthouse-form');
    const activityForm = document.getElementById('activity-form');

    if (guesthouseForm) {
        guesthouseForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validate form
            if (!validateGuesthouseForm()) return;

            // Gather form data
            const amenities = Array.from(document.querySelectorAll('#guesthouse-form input[name="amenities"]:checked')).map(input => input.value);

            const data = {
                type: 'guesthouse',
                title: document.getElementById('gh-title').value.trim(),
                description: document.getElementById('gh-description').value.trim(),
                price_per_night: parseFloat(document.getElementById('gh-price').value),
                max_guests: parseInt(document.getElementById('gh-guests').value),
                property_type: document.getElementById('gh-type').value,
                bedrooms: parseInt(document.getElementById('gh-bedrooms').value),
                bathrooms: parseFloat(document.getElementById('gh-bathrooms').value),
                amenities: amenities,
                address: document.getElementById('gh-address').value.trim(),
                city: document.getElementById('gh-city').value.trim(),
                state: document.getElementById('gh-state').value.trim(),
                zip: document.getElementById('gh-zip').value.trim(),
                country: document.getElementById('gh-country').value,
                house_rules: document.getElementById('gh-rules').value.trim()
                // For photos and location (lat/lng), additional implementation needed
            };

            try {
                const res = await fetch('http://localhost:3000/api/listings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await res.json();

                if (!res.ok) {
                    showToast(responseData.message || 'Failed to submit guesthouse listing', 'error');
                    return;
                }

                showToast('Your guesthouse listing has been submitted for review!', 'success');

                this.reset();
                document.getElementById('gh-photo-preview').innerHTML = '';

            } catch (err) {
                console.error('Guesthouse submission error:', err);
                showToast('Error submitting guesthouse listing. Please try again.', 'error');
            }
        });
    }

    if (activityForm) {
        activityForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!validateActivityForm()) return;

            const days = Array.from(document.querySelectorAll('#activity-form input[name="days"]:checked')).map(input => input.value);

            const timeSlots = Array.from(document.querySelectorAll('#activity-form .time-select')).map(select => select.value).filter(val => val);

            const data = {
                type: 'activity',
                title: document.getElementById('act-title').value.trim(),
                description: document.getElementById('act-description').value.trim(),
                price_per_person: parseFloat(document.getElementById('act-price').value),
                duration_hours: parseFloat(document.getElementById('act-duration').value),
                category: document.getElementById('act-category').value,
                max_group_size: parseInt(document.getElementById('act-group-size').value),
                difficulty_level: document.getElementById('act-difficulty').value,
                language: document.getElementById('act-language').value,
                included_items: document.getElementById('act-included').value.trim(),
                what_to_bring: document.getElementById('act-bring').value.trim(),
                address: document.getElementById('act-address').value.trim(),
                city: document.getElementById('act-city').value.trim(),
                state: document.getElementById('act-state').value.trim(),
                zip: document.getElementById('act-zip').value.trim(),
                country: document.getElementById('act-country').value,
                available_days: days,
                available_times: timeSlots
                // For photos and location (lat/lng), additional implementation needed
            };

            try {
                const res = await fetch('http://localhost:3000/api/listings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await res.json();

                if (!res.ok) {
                    showToast(responseData.message || 'Failed to submit activity listing', 'error');
                    return;
                }

                showToast('Your activity listing has been submitted for review!', 'success');

                this.reset();
                document.getElementById('act-photo-preview').innerHTML = '';

            } catch (err) {
                console.error('Activity submission error:', err);
                showToast('Error submitting activity listing. Please try again.', 'error');
            }
        });
    }
}

// Initialize time slot management
function setupTimeSlotManagement() {
    const addTimeSlotBtn = document.getElementById('add-time-slot');
    const timeSlotsContainer = document.getElementById('time-slots');

    if (addTimeSlotBtn && timeSlotsContainer) {
        addTimeSlotBtn.addEventListener('click', function () {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <select class="form-select time-select">
                            <option value="">Select time</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">01:00 PM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                            <option value="17:00">05:00 PM</option>
                            <option value="18:00">06:00 PM</option>
                            <option value="19:00">07:00 PM</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-outline btn-sm remove-time">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            // Add remove event listener
            timeSlot.querySelector('.remove-time').addEventListener('click', function () {
                timeSlot.remove();
            });

            timeSlotsContainer.appendChild(timeSlot);
        });

        // Add remove event listeners to existing time slots
        document.querySelectorAll('.remove-time').forEach(button => {
            button.addEventListener('click', function () {
                this.closest('.time-slot').remove();
            });
        });
    }
}

// Validate guesthouse form
function validateGuesthouseForm() {
    const title = document.getElementById('gh-title').value;
    const description = document.getElementById('gh-description').value;
    const price = document.getElementById('gh-price').value;
    const type = document.getElementById('gh-type').value;
    const photoPreviews = document.querySelectorAll('#gh-photo-preview .preview-item');

    if (!title) {
        showToast('Please enter a title for your listing', 'error');
        return false;
    }

    if (!description || description.length < 20) {
        showToast('Please enter a detailed description (at least 20 characters)', 'error');
        return false;
    }

    if (!price || isNaN(price) || price <= 0) {
        showToast('Please enter a valid price', 'error');
        return false;
    }

    if (!type) {
        showToast('Please select a property type', 'error');
        return false;
    }

    if (photoPreviews.length === 0) {
        showToast('Please upload at least one photo', 'error');
        return false;
    }

    return true;
}

// Validate activity form
function validateActivityForm() {
    const title = document.getElementById('act-title').value;
    const description = document.getElementById('act-description').value;
    const price = document.getElementById('act-price').value;
    const category = document.getElementById('act-category').value;
    const photoPreviews = document.querySelectorAll('#act-photo-preview .preview-item');
    const days = document.querySelectorAll('input[name="days"]:checked');

    if (!title) {
        showToast('Please enter a title for your activity', 'error');
        return false;
    }

    if (!description || description.length < 20) {
        showToast('Please enter a detailed description (at least 20 characters)', 'error');
        return false;
    }

    if (!price || isNaN(price) || price <= 0) {
        showToast('Please enter a valid price', 'error');
        return false;
    }

    if (!category) {
        showToast('Please select a category for your activity', 'error');
        return false;
    }

    if (photoPreviews.length === 0) {
        showToast('Please upload at least one photo', 'error');
        return false;
    }

    if (days.length === 0) {
        showToast('Please select at least one available day', 'error');
        return false;
    }

    return true;
}

// Initialize maps (placeholder)
function initializeMaps() {
    const ghMap = document.getElementById('gh-map');
    const actMap = document.getElementById('act-map');

    // In a real application, this would initialize maps with the Google Maps or Mapbox API
    // For this demo, we'll just keep the placeholders
}

// Open FAQ items
document.addEventListener('click', function (e) {
    if (e.target.closest('.faq-question')) {
        const faqItem = e.target.closest('.faq-item');
        faqItem.classList.toggle('active');
    }
});
