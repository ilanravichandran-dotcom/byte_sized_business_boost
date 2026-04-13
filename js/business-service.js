/**
 * Business Service Module
 * Handles filtering, searching, sorting, and business calculations
 */

const BusinessService = (() => {
    /**
     * Calculate average rating from reviews
     */
    function calculateRating(reviews) {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10;
    }

    /**
     * Get star rating display string
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
     * Filter businesses by category
     */
    function filterByCategory(businesses, category) {
        if (!category || category === 'all') return businesses;
        return businesses.filter(b => b.category === category);
    }

    /**
     * Search businesses by name, description, or address
     */
    function searchBusinesses(businesses, searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return businesses;
        }
        const term = searchTerm.toLowerCase().trim();
        return businesses.filter(b =>
            (b.name && b.name.toLowerCase().includes(term)) ||
            (b.description && b.description.toLowerCase().includes(term)) ||
            (b.address && b.address.toLowerCase().includes(term))
        );
    }

    /**
     * Sort businesses by criteria
     */
    function sortBusinesses(businesses, sortBy) {
        const sorted = [...businesses];
        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'rating-high':
                return sorted.sort((a, b) => calculateRating(b.reviews) - calculateRating(a.reviews));
            case 'rating-low':
                return sorted.sort((a, b) => calculateRating(a.reviews) - calculateRating(b.reviews));
            case 'reviews':
                return sorted.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
            default:
                return sorted;
        }
    }

    /**
     * Apply all filters and sorting
     */
    function getFiltered(businesses, category, searchTerm, sortBy) {
        let result = filterByCategory(businesses, category);
        result = searchBusinesses(result, searchTerm);
        result = sortBusinesses(result, sortBy);
        return result;
    }

    /**
     * Get businesses with deals
     */
    function getBusinessesWithDeals(businesses) {
        return businesses.filter(b => b.deal !== null);
    }

    /**
     * Get favorite businesses
     */
    function getFavorites(businesses, favorites) {
        return businesses.filter(b => favorites.includes(b.id));
    }

    /**
     * Format date string
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Calculate statistics
     */
    function getStatistics(businesses) {
        const allReviews = businesses.flatMap(b => b.reviews || []);
        const avgRating = allReviews.length > 0
            ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10
            : 0;

        return {
            totalBusinesses: businesses.length,
            totalReviews: allReviews.length,
            avgRating: avgRating
        };
    }

    return {
        calculateRating,
        getStarRating,
        filterByCategory,
        searchBusinesses,
        sortBusinesses,
        getFiltered,
        getBusinessesWithDeals,
        getFavorites,
        formatDate,
        escapeHtml,
        getStatistics
    };
})();
