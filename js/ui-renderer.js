/**
 * UI Renderer Module
 * Handles all DOM rendering and UI updates
 */

const UIRenderer = (() => {
    /**
     * Render business cards
     */
    function renderBusinesses(businesses, containerId, showFavoriteButton = true) {
        const container = document.getElementById(containerId);

        if (!businesses || businesses.length === 0) {
            container.innerHTML = '<p class="empty-message">No businesses found. Try adjusting your filters.</p>';
            return;
        }

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        container.innerHTML = businesses.map(business => {
            const rating = BusinessService.calculateRating(business.reviews);
            const reviewCount = business.reviews ? business.reviews.length : 0;
            const isFavorite = favorites.includes(business.id);
            const categoryClass = `category-${business.category}`;
            const categoryLabel = business.category.charAt(0).toUpperCase() + business.category.slice(1);

            return `
                <div class="business-card" onclick="AppState.openBusinessDetail(${business.id})">
                    <div class="business-card-header">
                        <h3 class="business-name">${BusinessService.escapeHtml(business.name)}</h3>
                        <span class="business-category ${categoryClass}">${categoryLabel}</span>
                    </div>
                    <div class="business-card-body">
                        <div class="business-rating">
                            <span class="rating-stars">${BusinessService.getStarRating(rating)}</span>
                            <span class="rating-value">${rating.toFixed(1)}</span>
                            <span class="rating-count">(${reviewCount} review${reviewCount !== 1 ? 's' : ''})</span>
                        </div>
                        <p class="business-description">${BusinessService.escapeHtml(business.description)}</p>
                        ${business.deal ? `<p style="color: var(--accent-color); font-weight: 600;">Special Deal Available!</p>` : ''}
                    </div>
                    <div class="business-card-footer" onclick="event.stopPropagation()">
                        <button class="btn btn-primary btn-small" onclick="AppState.openBusinessDetail(${business.id})">View Details</button>
                        ${showFavoriteButton ? `
                            <button class="btn btn-favorite btn-small ${isFavorite ? 'active' : ''}" 
                                    onclick="AppState.toggleFavorite(${business.id})">
                                ${isFavorite ? '★ Saved' : '☆ Save'}
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Update statistics display
     */
    function updateStatistics(businesses) {
        const stats = BusinessService.getStatistics(businesses);
        document.getElementById('totalBusinesses').textContent = stats.totalBusinesses;
        document.getElementById('avgRating').textContent = stats.avgRating;
        document.getElementById('totalReviews').textContent = stats.totalReviews;
    }

    /**
     * Render deals section
     */
    function renderDeals(businesses) {
        const dealsList = document.getElementById('dealsList');
        const businessesWithDeals = BusinessService.getBusinessesWithDeals(businesses);

        if (businessesWithDeals.length === 0) {
            dealsList.innerHTML = '<p class="empty-message">No special deals available at this time.</p>';
            return;
        }

        dealsList.innerHTML = businessesWithDeals.map(business => `
            <div class="deal-card">
                <div class="deal-business">${BusinessService.escapeHtml(business.name)}</div>
                <div class="deal-title">${BusinessService.escapeHtml(business.deal.title)}</div>
                <div class="deal-description">${BusinessService.escapeHtml(business.deal.description)}</div>
                <div class="deal-code">Code: ${BusinessService.escapeHtml(business.deal.code)}</div>
                <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.9;">
                    Expires: ${BusinessService.formatDate(business.deal.expires)}
                </p>
                <button class="btn btn-primary" style="margin-top: 1rem;" 
                        onclick="AppState.openBusinessDetail(${business.id})">
                    View Business Details
                </button>
            </div>
        `).join('');
    }

    /**
     * Open business detail modal
     */
    function openBusinessDetail(business, businesses, favorites) {
        const modal = document.getElementById('businessModal');
        const content = document.getElementById('businessModalContent');
        const rating = BusinessService.calculateRating(business.reviews);
        const reviewCount = business.reviews ? business.reviews.length : 0;
        const isFavorited = favorites.includes(business.id);
        const categoryClass = `category-${business.category}`;
        const categoryLabel = business.category.charAt(0).toUpperCase() + business.category.slice(1);

        content.innerHTML = `
            <div class="business-detail">
                <div class="detail-header">
                    <h2 class="detail-name">${BusinessService.escapeHtml(business.name)}</h2>
                    <span class="business-category ${categoryClass}">${categoryLabel}</span>
                    <div class="detail-rating">
                        <span class="rating-stars">${BusinessService.getStarRating(rating)}</span>
                        <span class="rating-value">${rating.toFixed(1)}</span>
                        <span class="rating-count">(${reviewCount} review${reviewCount !== 1 ? 's' : ''})</span>
                    </div>
                    <p><strong>Address:</strong> ${BusinessService.escapeHtml(business.address)}</p>
                    <p><strong>Phone:</strong> ${BusinessService.escapeHtml(business.phone)}</p>
                    <p style="margin-top: 1rem;">${BusinessService.escapeHtml(business.description)}</p>
                    <div style="margin-top: 1rem;">
                        <button class="btn btn-favorite ${isFavorited ? 'active' : ''}" 
                                onclick="AppState.toggleFavorite(${business.id}); AppState.openBusinessDetail(${business.id})">
                            ${isFavorited ? '★ Remove from Favorites' : '☆ Add to Favorites'}
                        </button>
                    </div>
                </div>

                ${business.deal ? `
                    <div class="deal-card" style="margin-top: 2rem;">
                        <div class="deal-business">${BusinessService.escapeHtml(business.name)}</div>
                        <div class="deal-title">${BusinessService.escapeHtml(business.deal.title)}</div>
                        <div class="deal-description">${BusinessService.escapeHtml(business.deal.description)}</div>
                        <div class="deal-code">Code: ${BusinessService.escapeHtml(business.deal.code)}</div>
                        <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.9;">
                            Expires: ${BusinessService.formatDate(business.deal.expires)}
                        </p>
                    </div>
                ` : ''}

                <div class="reviews-section">
                    <h3 style="margin-bottom: 1rem;">Customer Reviews</h3>

                    <div class="review-form">
                        <h4>Write a Review</h4>
                        <form id="reviewForm" onsubmit="AppState.submitReview(event, ${business.id})">
                            <div class="form-group">
                                <label for="reviewAuthor">Your Name *</label>
                                <input type="text" id="reviewAuthor" name="author" required maxlength="50" placeholder="Enter your name">
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
                                <textarea id="reviewComment" name="comment" required maxlength="500" placeholder="Share your experience..."></textarea>
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
                                        <span class="review-author">${BusinessService.escapeHtml(review.author)}</span>
                                        <span class="review-date">${BusinessService.formatDate(review.date)}</span>
                                    </div>
                                    <div class="rating-stars" style="margin: 0.5rem 0;">${BusinessService.getStarRating(review.rating)}</div>
                                    <p class="review-text">${BusinessService.escapeHtml(review.comment)}</p>
                                </div>
                            `).join('')
                            : '<p class="empty-message">No reviews yet. Be the first to review!</p>'
                        }
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    /**
     * Close business modal
     */
    function closeBusinessModal() {
        document.getElementById('businessModal').classList.remove('active');
    }

    /**
     * Show section
     */
    function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }

        const navLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (navLink) {
            navLink.classList.add('active');
        }
    }

    return {
        renderBusinesses,
        updateStatistics,
        renderDeals,
        openBusinessDetail,
        closeBusinessModal,
        showSection
    };
})();
