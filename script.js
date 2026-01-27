/**
 * Byte-Sized Business Boost - Main Application Script
 * Built for FBLA Coding & Programming Competition 2025-2026
 * 
 * This application helps users discover and support local small businesses.
 * Features include business listing, reviews, favorites, deals, and bot verification.
 * 
 * @author FBLA Coding & Programming Team
 * @version 1.0.0
 */

/* ============================================
   GLOBAL VARIABLES AND DATA STORAGE
   ============================================ */

/**
 * Main application data structure
 * Uses localStorage for persistence across sessions
 */
const AppData = {
    // Load data from localStorage or initialize with sample data
    businesses: [],
    favorites: [],
    verified: false
};

/**
 * Sample business data - in production, this would come from a database
 * This includes businesses from different categories with initial data
 */
const SAMPLE_BUSINESSES = [
    {
        id: 1,
        name: "Mama Rosa's Italian Kitchen",
        category: "food",
        description: "Authentic Italian cuisine with family recipes passed down for generations. Fresh pasta, wood-fired pizzas, and homemade desserts.",
        address: "123 Main Street",
        phone: "(555) 123-4567",
        rating: 4.8,
        reviews: [
            {
                author: "Sarah Johnson",
                rating: 5,
                comment: "Best Italian food in town! The pasta was amazing.",
                date: "2025-01-15"
            },
            {
                author: "Mike Chen",
                rating: 4,
                comment: "Great atmosphere and friendly service. Will come back!",
                date: "2025-01-10"
            }
        ],
        deal: {
            title: "Family Dinner Special",
            description: "20% off entire bill for parties of 4 or more",
            code: "FAMILY20",
            expires: "2025-03-31"
        }
    },
    {
        id: 2,
        name: "Green Leaf Bookstore",
        category: "retail",
        description: "Independent bookstore featuring local authors and a cozy reading corner. Coffee and pastries available.",
        address: "456 Oak Avenue",
        phone: "(555) 234-5678",
        rating: 4.6,
        reviews: [
            {
                author: "Emma Davis",
                rating: 5,
                comment: "Love this bookstore! Great selection and the staff is so knowledgeable.",
                date: "2025-01-12"
            }
        ],
        deal: {
            title: "Student Discount",
            description: "15% off all books with student ID",
            code: "STUDENT15",
            expires: "2025-06-30"
        }
    },
    {
        id: 3,
        name: "Sunshine Dry Cleaning",
        category: "services",
        description: "Eco-friendly dry cleaning service with same-day pickup available. Professional garment care.",
        address: "789 Pine Road",
        phone: "(555) 345-6789",
        rating: 4.4,
        reviews: [
            {
                author: "Robert Lee",
                rating: 5,
                comment: "Fast service and my clothes always look perfect!",
                date: "2025-01-08"
            },
            {
                author: "Lisa Anderson",
                rating: 4,
                comment: "Great prices and convenient location.",
                date: "2025-01-05"
            }
        ],
        deal: {
            title: "New Customer Special",
            description: "First visit 25% off",
            code: "WELCOME25",
            expires: "2025-04-30"
        }
    },
    {
        id: 4,
        name: "The Burger Joint",
        category: "food",
        description: "Gourmet burgers made with locally sourced beef. Hand-cut fries and craft milkshakes.",
        address: "321 Elm Street",
        phone: "(555) 456-7890",
        rating: 4.7,
        reviews: [
            {
                author: "Tom Wilson",
                rating: 5,
                comment: "Best burger I've ever had!",
                date: "2025-01-14"
            }
        ],
        deal: {
            title: "Lunch Special",
            description: "Combo meal for $9.99 (Mon-Fri 11am-2pm)",
            code: "LUNCH999",
            expires: "2025-05-31"
        }
    },
    {
        id: 5,
        name: "Artisan Crafts & Gifts",
        category: "retail",
        description: "Handmade items from local artists. Unique gifts, jewelry, pottery, and home decor.",
        address: "654 Maple Drive",
        phone: "(555) 567-8901",
        rating: 4.5,
        reviews: [],
        deal: null
    },
    {
        id: 6,
        name: "Tech Support Plus",
        category: "services",
        description: "Computer repair and tech support for home and small business. On-site service available.",
        address: "987 Cedar Lane",
        phone: "(555) 678-9012",
        rating: 4.9,
        reviews: [
            {
                author: "Jennifer Martinez",
                rating: 5,
                comment: "Fixed my laptop in no time! Very professional.",
                date: "2025-01-13"
            },
            {
                author: "David Brown",
                rating: 5,
                comment: "Excellent service and fair pricing.",
                date: "2025-01-11"
            },
            {
                author: "Amanda Taylor",
                rating: 4,
                comment: "Helpful staff and quick turnaround.",
                date: "2025-01-09"
            }
        ],
        deal: {
            title: "Senior Discount",
            description: "10% off for seniors 65+",
            code: "SENIOR10",
            expires: "2025-12-31"
        }
    }
];

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Initialize application data from localStorage
 * Falls back to sample data if no stored data exists
 */
function initializeData() {
    const storedBusinesses = localStorage.getItem('businesses');
    const storedFavorites = localStorage.getItem('favorites');
    
    if (storedBusinesses) {
        AppData.businesses = JSON.parse(storedBusinesses);
    } else {
        AppData.businesses = JSON.parse(JSON.stringify(SAMPLE_BUSINESSES));
        saveBusinesses();
    }
    
    if (storedFavorites) {
        AppData.favorites = JSON.parse(storedFavorites);
    } else {
        AppData.favorites = [];
        saveFavorites();
    }
}

/**
 * Save businesses array to localStorage
 */
function saveBusinesses() {
    localStorage.setItem('businesses', JSON.stringify(AppData.businesses));
}

/**
 * Save favorites array to localStorage
 */
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(AppData.favorites));
}

/**
 * Calculate average rating from reviews array
 * @param {Array} reviews - Array of review objects
 * @returns {number} Average rating rounded to 1 decimal place
 */
function calculateRating(reviews) {
    if (!reviews || reviews.length === 0) {
        return 0;
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * Generate star rating display string
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string with star symbols
 */
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '½';
    stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
    return stars;
}

/**
 * Format date string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate rating value (1-5)
 * @param {number} rating - Rating to validate
 * @returns {boolean} True if valid rating
 */
function validateRating(rating) {
    return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}

/**
 * Validate text input (not empty, appropriate length)
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length required
 * @param {number} maxLength - Maximum length allowed
 * @returns {object} Validation result with isValid boolean and error message
 */
function validateText(text, minLength = 1, maxLength = 500) {
    if (!text || text.trim().length === 0) {
        return { isValid: false, error: 'This field is required.' };
    }
    if (text.trim().length < minLength) {
        return { isValid: false, error: `Must be at least ${minLength} characters.` };
    }
    if (text.length > maxLength) {
        return { isValid: false, error: `Must not exceed ${maxLength} characters.` };
    }
    return { isValid: true, error: '' };
}

/* ============================================
   BOT VERIFICATION SYSTEM
   ============================================ */

/**
 * Verification questions to prevent bot activity
 * Simple math questions that humans can easily solve
 */
const VERIFICATION_QUESTIONS = [
    { question: "What is 5 + 3?", answer: "8" },
    { question: "What is 10 - 4?", answer: "6" },
    { question: "What is 2 × 3?", answer: "6" },
    { question: "What is 12 ÷ 4?", answer: "3" },
    { question: "What is 7 + 9?", answer: "16" },
    { question: "What is 15 - 8?", answer: "7" },
    { question: "What is 4 × 2?", answer: "8" },
    { question: "What is 20 ÷ 5?", answer: "4" }
];

let currentVerificationQuestion = null;

/**
 * Initialize bot verification on page load
 * Checks if user is already verified, shows modal if not
 */
function initVerification() {
    const verified = sessionStorage.getItem('verified');
    if (verified === 'true') {
        AppData.verified = true;
        return;
    }
    
    showVerificationModal();
}

/**
 * Show verification modal with a random question
 */
function showVerificationModal() {
    const modal = document.getElementById('verificationModal');
    const questionElement = document.getElementById('verificationQuestion');
    const answerInput = document.getElementById('verificationAnswer');
    const errorElement = document.getElementById('verificationError');
    
    // Select random verification question
    const randomIndex = Math.floor(Math.random() * VERIFICATION_QUESTIONS.length);
    currentVerificationQuestion = VERIFICATION_QUESTIONS[randomIndex];
    
    questionElement.textContent = currentVerificationQuestion.question;
    answerInput.value = '';
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    
    modal.classList.add('active');
    answerInput.focus();
    
    // Allow Enter key to submit
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyUser();
        }
    });
}

/**
 * Verify user's answer to verification question
 */
function verifyUser() {
    const answerInput = document.getElementById('verificationAnswer');
    const errorElement = document.getElementById('verificationError');
    const userAnswer = answerInput.value.trim();
    
    // Input validation
    const validation = validateText(userAnswer, 1, 10);
    if (!validation.isValid) {
        errorElement.textContent = validation.error;
        errorElement.classList.add('show');
        return;
    }
    
    // Check if answer is correct (case-insensitive)
    if (userAnswer.toLowerCase() === currentVerificationQuestion.answer.toLowerCase()) {
        AppData.verified = true;
        sessionStorage.setItem('verified', 'true');
        document.getElementById('verificationModal').classList.remove('active');
    } else {
        errorElement.textContent = 'Incorrect answer. Please try again.';
        errorElement.classList.add('show');
        // Select new question after incorrect answer
        const randomIndex = Math.floor(Math.random() * VERIFICATION_QUESTIONS.length);
        currentVerificationQuestion = VERIFICATION_QUESTIONS[randomIndex];
        document.getElementById('verificationQuestion').textContent = currentVerificationQuestion.question;
        answerInput.value = '';
        answerInput.focus();
    }
}

/* ============================================
   BUSINESS DISPLAY FUNCTIONS
   ============================================ */

/**
 * Render business cards in the specified container
 * @param {Array} businesses - Array of business objects to display
 * @param {string} containerId - ID of the container element
 * @param {boolean} showFavoriteButton - Whether to show favorite toggle button
 */
function renderBusinesses(businesses, containerId, showFavoriteButton = true) {
    const container = document.getElementById(containerId);
    
    if (!businesses || businesses.length === 0) {
        container.innerHTML = '<p class="empty-message">No businesses found. Try adjusting your filters.</p>';
        return;
    }
    
    container.innerHTML = businesses.map(business => {
        const rating = calculateRating(business.reviews);
        const reviewCount = business.reviews ? business.reviews.length : 0;
        const isFavorite = AppData.favorites.includes(business.id);
        const categoryClass = `category-${business.category}`;
        const categoryLabel = business.category.charAt(0).toUpperCase() + business.category.slice(1);
        
        return `
            <div class="business-card" onclick="openBusinessDetail(${business.id})">
                <div class="business-card-header">
                    <h3 class="business-name">${escapeHtml(business.name)}</h3>
                    <span class="business-category ${categoryClass}">${categoryLabel}</span>
                </div>
                <div class="business-card-body">
                    <div class="business-rating">
                        <span class="rating-stars">${getStarRating(rating)}</span>
                        <span class="rating-value">${rating.toFixed(1)}</span>
                        <span class="rating-count">(${reviewCount} review${reviewCount !== 1 ? 's' : ''})</span>
                    </div>
                    <p class="business-description">${escapeHtml(business.description)}</p>
                    ${business.deal ? `<p style="color: var(--accent-color); font-weight: 600;">Special Deal Available!</p>` : ''}
                </div>
                <div class="business-card-footer" onclick="event.stopPropagation()">
                    <button class="btn btn-primary btn-small" onclick="openBusinessDetail(${business.id})">View Details</button>
                    ${showFavoriteButton ? `
                        <button class="btn btn-favorite btn-small ${isFavorite ? 'active' : ''}" 
                                onclick="toggleFavorite(${business.id})">
                            ${isFavorite ? '★ Saved' : '☆ Save'}
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Filter businesses based on category
 * @param {string} category - Category filter ('all', 'food', 'retail', 'services')
 * @returns {Array} Filtered business array
 */
function filterByCategory(category) {
    if (category === 'all') {
        return AppData.businesses;
    }
    return AppData.businesses.filter(business => business.category === category);
}

/**
 * Search businesses by name
 * @param {string} searchTerm - Search query
 * @returns {Array} Filtered business array
 */
function searchBusinesses(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return AppData.businesses;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return AppData.businesses.filter(business => 
        business.name.toLowerCase().includes(term) ||
        business.description.toLowerCase().includes(term) ||
        business.address.toLowerCase().includes(term)
    );
}

/**
 * Sort businesses based on selected criteria
 * @param {Array} businesses - Array of businesses to sort
 * @param {string} sortBy - Sort criteria ('name', 'rating-high', 'rating-low', 'reviews')
 * @returns {Array} Sorted business array
 */
function sortBusinesses(businesses, sortBy) {
    const sorted = [...businesses];
    
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        
        case 'rating-high':
            return sorted.sort((a, b) => {
                const ratingA = calculateRating(a.reviews);
                const ratingB = calculateRating(b.reviews);
                return ratingB - ratingA;
            });
        
        case 'rating-low':
            return sorted.sort((a, b) => {
                const ratingA = calculateRating(a.reviews);
                const ratingB = calculateRating(b.reviews);
                return ratingA - ratingB;
            });
        
        case 'reviews':
            return sorted.sort((a, b) => {
                const countA = a.reviews ? a.reviews.length : 0;
                const countB = b.reviews ? b.reviews.length : 0;
                return countB - countA;
            });
        
        default:
            return sorted;
    }
}

/**
 * Apply all filters, search, and sorting to businesses
 * @param {string} category - Category filter
 * @param {string} searchTerm - Search query
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Processed business array
 */
function getFilteredBusinesses(category, searchTerm, sortBy) {
    let businesses = filterByCategory(category);
    businesses = searchBusinesses(searchTerm);
    businesses = sortBusinesses(businesses, sortBy);
    return businesses;
}

/**
 * Update business list display with current filters
 */
function updateBusinessList() {
    const category = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchInput').value;
    const sortBy = document.getElementById('sortBy').value;
    
    const businesses = getFilteredBusinesses(category, searchTerm, sortBy);
    renderBusinesses(businesses, 'businessList');
    updateStatistics();
}

/* ============================================
   STATISTICS FUNCTIONS
   ============================================ */

/**
 * Update statistics dashboard with current business data
 */
function updateStatistics() {
    const totalBusinesses = AppData.businesses.length;
    const allReviews = AppData.businesses.flatMap(b => b.reviews || []);
    const totalReviews = allReviews.length;
    
    let avgRating = 0;
    if (allReviews.length > 0) {
        const sum = allReviews.reduce((acc, review) => acc + review.rating, 0);
        avgRating = sum / allReviews.length;
    }
    
    document.getElementById('totalBusinesses').textContent = totalBusinesses;
    document.getElementById('avgRating').textContent = avgRating.toFixed(1);
    document.getElementById('totalReviews').textContent = totalReviews;
}

/* ============================================
   FAVORITES FUNCTIONALITY
   ============================================ */

/**
 * Toggle favorite status for a business
 * @param {number} businessId - ID of the business
 */
function toggleFavorite(businessId) {
    if (!AppData.verified) {
        showVerificationModal();
        return;
    }
    
    const index = AppData.favorites.indexOf(businessId);
    
    if (index === -1) {
        // Add to favorites
        AppData.favorites.push(businessId);
    } else {
        // Remove from favorites
        AppData.favorites.splice(index, 1);
    }
    
    saveFavorites();
    updateBusinessList();
    updateFavoritesSection();
}

/**
 * Check if a business is favorited
 * @param {number} businessId - ID of the business
 * @returns {boolean} True if business is in favorites
 */
function isFavorite(businessId) {
    return AppData.favorites.includes(businessId);
}

/**
 * Get array of favorited business objects
 * @returns {Array} Array of favorite business objects
 */
function getFavoriteBusinesses() {
    return AppData.businesses.filter(business => AppData.favorites.includes(business.id));
}

/**
 * Update favorites section display
 */
function updateFavoritesSection() {
    const favorites = getFavoriteBusinesses();
    renderBusinesses(favorites, 'favoritesList', false);
    
    if (favorites.length === 0) {
        document.getElementById('favoritesList').innerHTML = 
            '<p class="empty-message">No favorites yet. Start adding businesses you love!</p>';
    }
}

/* ============================================
   BUSINESS DETAIL MODAL
   ============================================ */

/**
 * Open business detail modal with full information
 * @param {number} businessId - ID of the business to display
 */
function openBusinessDetail(businessId) {
    const business = AppData.businesses.find(b => b.id === businessId);
    
    if (!business) {
        alert('Business not found.');
        return;
    }
    
    const modal = document.getElementById('businessModal');
    const content = document.getElementById('businessModalContent');
    const rating = calculateRating(business.reviews);
    const reviewCount = business.reviews ? business.reviews.length : 0;
    const isFavorited = isFavorite(business.id);
    const categoryClass = `category-${business.category}`;
    const categoryLabel = business.category.charAt(0).toUpperCase() + business.category.slice(1);
    
    content.innerHTML = `
        <div class="business-detail">
            <div class="detail-header">
                <h2 class="detail-name">${escapeHtml(business.name)}</h2>
                <span class="business-category ${categoryClass}">${categoryLabel}</span>
                <div class="detail-rating">
                    <span class="rating-stars">${getStarRating(rating)}</span>
                    <span class="rating-value">${rating.toFixed(1)}</span>
                    <span class="rating-count">(${reviewCount} review${reviewCount !== 1 ? 's' : ''})</span>
                </div>
                <p><strong>Address:</strong> ${escapeHtml(business.address)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(business.phone)}</p>
                <p style="margin-top: 1rem;">${escapeHtml(business.description)}</p>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-favorite ${isFavorited ? 'active' : ''}" 
                            onclick="toggleFavorite(${business.id}); openBusinessDetail(${business.id})">
                        ${isFavorited ? '★ Remove from Favorites' : '☆ Add to Favorites'}
                    </button>
                </div>
            </div>
            
            ${business.deal ? `
                <div class="deal-card" style="margin-top: 2rem;">
                    <div class="deal-business">${escapeHtml(business.name)}</div>
                    <div class="deal-title">${escapeHtml(business.deal.title)}</div>
                    <div class="deal-description">${escapeHtml(business.deal.description)}</div>
                    <div class="deal-code">Code: ${escapeHtml(business.deal.code)}</div>
                    <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.9;">
                        Expires: ${formatDate(business.deal.expires)}
                    </p>
                </div>
            ` : ''}
            
            <div class="reviews-section">
                <h3 style="margin-bottom: 1rem;">Customer Reviews</h3>
                
                <div class="review-form">
                    <h4>Write a Review</h4>
                    <form id="reviewForm" onsubmit="submitReview(event, ${business.id})">
                        <div class="form-group">
                            <label for="reviewAuthor">Your Name *</label>
                            <input type="text" id="reviewAuthor" name="author" required 
                                   maxlength="50" placeholder="Enter your name">
                            <span id="reviewAuthorError" class="error-message"></span>
                        </div>
                        
                        <div class="form-group">
                            <label for="reviewRating">Rating *</label>
                            <select id="reviewRating" name="rating" required>
                                <option value="">Select a rating</option>
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Good</option>
                                <option value="2">2 - Fair</option>
                                <option value="1">1 - Poor</option>
                            </select>
                            <span id="reviewRatingError" class="error-message"></span>
                        </div>
                        
                        <div class="form-group">
                            <label for="reviewComment">Your Review *</label>
                            <textarea id="reviewComment" name="comment" required 
                                      maxlength="500" placeholder="Share your experience..."></textarea>
                            <span id="reviewCommentError" class="error-message"></span>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Submit Review</button>
                        <span id="reviewSubmitSuccess" class="success-message"></span>
                    </form>
                </div>
                
                <div class="review-list">
                    ${business.reviews && business.reviews.length > 0 ? 
                        business.reviews.map(review => `
                            <div class="review-item">
                                <div class="review-header">
                                    <span class="review-author">${escapeHtml(review.author)}</span>
                                    <span class="review-date">${formatDate(review.date)}</span>
                                </div>
                                <div class="rating-stars" style="margin: 0.5rem 0;">${getStarRating(review.rating)}</div>
                                <p class="review-text">${escapeHtml(review.comment)}</p>
                            </div>
                        `).join('') : 
                        '<p class="empty-message">No reviews yet. Be the first to review!</p>'
                    }
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

/**
 * Close business detail modal
 */
function closeBusinessModal() {
    document.getElementById('businessModal').classList.remove('active');
}

/**
 * Submit a new review for a business
 * @param {Event} event - Form submit event
 * @param {number} businessId - ID of the business being reviewed
 */
function submitReview(event, businessId) {
    event.preventDefault();
    
    if (!AppData.verified) {
        showVerificationModal();
        return;
    }
    
    const author = document.getElementById('reviewAuthor').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value.trim();
    
    // Clear previous error messages
    document.getElementById('reviewAuthorError').classList.remove('show');
    document.getElementById('reviewRatingError').classList.remove('show');
    document.getElementById('reviewCommentError').classList.remove('show');
    document.getElementById('reviewSubmitSuccess').classList.remove('show');
    
    let hasError = false;
    
    // Validate author name
    const authorValidation = validateText(author, 1, 50);
    if (!authorValidation.isValid) {
        document.getElementById('reviewAuthorError').textContent = authorValidation.error;
        document.getElementById('reviewAuthorError').classList.add('show');
        hasError = true;
    }
    
    // Validate rating
    if (!validateRating(rating)) {
        document.getElementById('reviewRatingError').textContent = 'Please select a valid rating.';
        document.getElementById('reviewRatingError').classList.add('show');
        hasError = true;
    }
    
    // Validate comment
    const commentValidation = validateText(comment, 10, 500);
    if (!commentValidation.isValid) {
        document.getElementById('reviewCommentError').textContent = commentValidation.error;
        document.getElementById('reviewCommentError').classList.add('show');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Find business and add review
    const business = AppData.businesses.find(b => b.id === businessId);
    if (!business) {
        alert('Business not found.');
        return;
    }
    
    // Initialize reviews array if it doesn't exist
    if (!business.reviews) {
        business.reviews = [];
    }
    
    // Add new review
    const newReview = {
        author: author,
        rating: rating,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };
    
    business.reviews.push(newReview);
    saveBusinesses();
    
    // Show success message
    document.getElementById('reviewSubmitSuccess').textContent = 'Review submitted successfully!';
    document.getElementById('reviewSubmitSuccess').classList.add('show');
    
    // Reset form
    document.getElementById('reviewForm').reset();
    
    // Refresh business detail view
    setTimeout(() => {
        openBusinessDetail(businessId);
    }, 1500);
}

/* ============================================
   DEALS SECTION
   ============================================ */

/**
 * Update special deals section display
 */
function updateDealsSection() {
    const dealsList = document.getElementById('dealsList');
    const businessesWithDeals = AppData.businesses.filter(b => b.deal !== null);
    
    if (businessesWithDeals.length === 0) {
        dealsList.innerHTML = '<p class="empty-message">No special deals available at this time.</p>';
        return;
    }
    
    dealsList.innerHTML = businessesWithDeals.map(business => `
        <div class="deal-card">
            <div class="deal-business">${escapeHtml(business.name)}</div>
            <div class="deal-title">${escapeHtml(business.deal.title)}</div>
            <div class="deal-description">${escapeHtml(business.deal.description)}</div>
            <div class="deal-code">Code: ${escapeHtml(business.deal.code)}</div>
            <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.9;">
                Expires: ${formatDate(business.deal.expires)}
            </p>
            <button class="btn btn-primary" style="margin-top: 1rem;" 
                    onclick="openBusinessDetail(${business.id}); closeBusinessModal(); setTimeout(() => openBusinessDetail(${business.id}), 100)">
                View Business Details
            </button>
        </div>
    `).join('');
}

/* ============================================
   NAVIGATION FUNCTIONALITY
   ============================================ */

/**
 * Show specified section and hide others
 * @param {string} sectionId - ID of the section to show
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Add active class to corresponding nav link
    const navLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    // Update content based on section
    switch (sectionId) {
        case 'home':
            updateBusinessList();
            break;
        case 'browse':
            const businesses = getFilteredBusinesses(
                'all',
                '',
                document.getElementById('sortBy').value
            );
            renderBusinesses(businesses, 'browseBusinessList');
            break;
        case 'favorites':
            updateFavoritesSection();
            break;
        case 'deals':
            updateDealsSection();
            break;
    }
}

/* ============================================
   EVENT LISTENERS SETUP
   ============================================ */

/**
 * Initialize all event listeners when DOM is loaded
 */
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
    
    // Verification modal
    document.getElementById('verifyBtn').addEventListener('click', verifyUser);
    
    // Close modals
    document.getElementById('closeModal').addEventListener('click', closeBusinessModal);
    document.getElementById('businessModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeBusinessModal();
        }
    });
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', updateBusinessList);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            updateBusinessList();
        }
    });
    
    // Filter and sort changes
    document.getElementById('categoryFilter').addEventListener('change', updateBusinessList);
    document.getElementById('sortBy').addEventListener('change', updateBusinessList);
    
    // Real-time search (optional - updates as user types)
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(updateBusinessList, 300);
    });
}

/* ============================================
   APPLICATION INITIALIZATION
   ============================================ */

/**
 * Initialize the application when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    initializeData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize verification (will show modal if not verified)
    initVerification();
    
    // Initial display
    updateBusinessList();
    updateDealsSection();
    
    console.log('Byte-Sized Business Boost application initialized successfully!');
    console.log(`Loaded ${AppData.businesses.length} businesses`);
});
