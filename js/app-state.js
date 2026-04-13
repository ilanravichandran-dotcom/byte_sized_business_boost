/**
 * Application State Module
 * Manages global application state and coordinates between modules
 */

const AppState = (() => {
    let appData = {
        businesses: [],
        favorites: [],
        verified: false
    };

    /**
     * Initialize the application
     */
    async function initialize() {
        console.log('🚀 Initializing LocalLens...');

        // Load data
        appData.businesses = await DataManager.loadBusinesses();
        appData.favorites = DataManager.loadFavorites();

        // Initialize Supabase
        const supabaseInitialized = DataManager.initSupabase();
        if (supabaseInitialized) {
            const syncedFavorites = await DataManager.syncFromSupabase(appData.businesses);
            if (syncedFavorites.length > 0) {
                appData.favorites = syncedFavorites;
                DataManager.saveFavorites(appData.favorites);
            }
        }

        // Setup event listeners
        setupEventListeners();

        // Initialize verification
        VerificationManager.initialize();

        // Initial display
        updateBusinessList();
        UIRenderer.renderDeals(appData.businesses);

        console.log(`✓ LocalLens initialized with ${appData.businesses.length} businesses`);
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                showSection(sectionId);
            });
        });

        // Verification
        const verifyBtn = document.getElementById('verifyBtn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => VerificationManager.verify());
        }

        // Modal close
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', closeBusinessDetail);
        }

        const businessModal = document.getElementById('businessModal');
        if (businessModal) {
            businessModal.addEventListener('click', (e) => {
                if (e.target === businessModal) closeBusinessDetail();
            });
        }

        // Search
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', updateBusinessList);
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') updateBusinessList();
            });

            let searchTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(updateBusinessList, 300);
            });
        }

        // Filters
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', updateBusinessList);
        }

        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', updateBusinessList);
        }

        // Report buttons
        const generateCSVBtn = document.getElementById('generateCSVBtn');
        if (generateCSVBtn) {
            generateCSVBtn.addEventListener('click', () => ReportGenerator.downloadCSV(appData.businesses));
        }

        const previewReportBtn = document.getElementById('previewReportBtn');
        if (previewReportBtn) {
            previewReportBtn.addEventListener('click', () => ReportGenerator.preview(appData.businesses));
        }

        const printReportBtn = document.getElementById('printReportBtn');
        if (printReportBtn) {
            printReportBtn.addEventListener('click', () => ReportGenerator.print(appData.businesses));
        }
    }

    /**
     * Update business list display
     */
    function updateBusinessList() {
        const category = document.getElementById('categoryFilter').value;
        const searchTerm = document.getElementById('searchInput').value;
        const sortBy = document.getElementById('sortBy').value;

        const businesses = BusinessService.getFiltered(appData.businesses, category, searchTerm, sortBy);
        UIRenderer.renderBusinesses(businesses, 'businessList');
        UIRenderer.updateStatistics(appData.businesses);
    }

    /**
     * Show section
     */
    function showSection(sectionId) {
        UIRenderer.showSection(sectionId);

        switch (sectionId) {
            case 'home':
                updateBusinessList();
                break;
            case 'browse':
                const businesses = BusinessService.getFiltered(
                    appData.businesses,
                    'all',
                    '',
                    document.getElementById('sortBy').value
                );
                UIRenderer.renderBusinesses(businesses, 'browseBusinessList');
                break;
            case 'favorites':
                updateFavoritesSection();
                break;
            case 'deals':
                UIRenderer.renderDeals(appData.businesses);
                break;
            case 'reports':
                // Reports section just needs the HTML to be visible
                break;
        }
    }

    /**
     * Update favorites section
     */
    function updateFavoritesSection() {
        const favorites = BusinessService.getFavorites(appData.businesses, appData.favorites);
        UIRenderer.renderBusinesses(favorites, 'favoritesList', false);

        if (favorites.length === 0) {
            document.getElementById('favoritesList').innerHTML =
                '<p class="empty-message">No favorites yet. Start adding businesses you love!</p>';
        }
    }

    /**
     * Toggle favorite
     */
    function toggleFavorite(businessId) {
        if (!VerificationManager.getIsVerified()) {
            VerificationManager.showModal();
            return;
        }

        const index = appData.favorites.indexOf(businessId);
        if (index === -1) {
            appData.favorites.push(businessId);
        } else {
            appData.favorites.splice(index, 1);
        }

        DataManager.saveFavorites(appData.favorites);
        const isNowFavorite = appData.favorites.includes(businessId);
        DataManager.syncFavoriteToSupabase(businessId, isNowFavorite);

        updateBusinessList();
        updateFavoritesSection();
    }

    /**
     * Open business detail
     */
    function openBusinessDetail(businessId) {
        const business = appData.businesses.find(b => b.id === businessId);
        if (!business) {
            alert('Business not found.');
            return;
        }
        UIRenderer.openBusinessDetail(business, appData.businesses, appData.favorites);
    }

    /**
     * Close business detail
     */
    function closeBusinessDetail() {
        UIRenderer.closeBusinessModal();
    }

    /**
     * Submit review
     */
    async function submitReview(event, businessId) {
        event.preventDefault();

        if (!VerificationManager.getIsVerified()) {
            VerificationManager.showModal();
            return;
        }

        const author = document.getElementById('reviewAuthor').value.trim();
        const rating = parseInt(document.getElementById('reviewRating').value);
        const comment = document.getElementById('reviewComment').value.trim();

        document.getElementById('reviewAuthorError').classList.remove('show');
        document.getElementById('reviewRatingError').classList.remove('show');
        document.getElementById('reviewCommentError').classList.remove('show');
        document.getElementById('reviewSubmitSuccess').classList.remove('show');

        let hasError = false;

        const authorValidation = VerificationManager.validateText(author, 1, 50);
        if (!authorValidation.isValid) {
            document.getElementById('reviewAuthorError').textContent = authorValidation.error;
            document.getElementById('reviewAuthorError').classList.add('show');
            hasError = true;
        }

        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            document.getElementById('reviewRatingError').textContent = 'Please select a valid rating.';
            document.getElementById('reviewRatingError').classList.add('show');
            hasError = true;
        }

        const commentValidation = VerificationManager.validateText(comment, 10, 500);
        if (!commentValidation.isValid) {
            document.getElementById('reviewCommentError').textContent = commentValidation.error;
            document.getElementById('reviewCommentError').classList.add('show');
            hasError = true;
        }

        if (hasError) return;

        const business = appData.businesses.find(b => b.id === businessId);
        if (!business) {
            alert('Business not found.');
            return;
        }

        if (!business.reviews) {
            business.reviews = [];
        }

        const newReview = {
            author: author,
            rating: rating,
            comment: comment,
            date: new Date().toISOString().split('T')[0]
        };

        business.reviews.push(newReview);
        DataManager.saveBusinesses(appData.businesses);
        DataManager.saveReviewToSupabase(businessId, newReview);

        document.getElementById('reviewSubmitSuccess').textContent = 'Review submitted successfully!';
        document.getElementById('reviewSubmitSuccess').classList.add('show');

        document.getElementById('reviewForm').reset();

        setTimeout(() => {
            openBusinessDetail(businessId);
        }, 1500);
    }

    /**
     * Get app data (read-only)
     */
    function getAppData() {
        return appData;
    }

    return {
        initialize,
        updateBusinessList,
        showSection,
        updateFavoritesSection,
        toggleFavorite,
        openBusinessDetail,
        closeBusinessDetail,
        submitReview,
        getAppData
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', AppState.initialize);
