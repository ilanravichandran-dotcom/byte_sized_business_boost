/**
 * Data Manager Module
 * Handles all data initialization, localStorage persistence, and Supabase syncing
 */

const DataManager = (() => {
    const STORAGE_KEYS = {
        BUSINESSES: 'businesses',
        FAVORITES: 'favorites',
        CLIENT_ID: 'bsbb_client_id'
    };

    /**
     * Get or create a client ID for this user
     */
    function getClientId() {
        let id = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);
        if (!id) {
            id = 'client_' + Math.random().toString(36).slice(2, 10);
            localStorage.setItem(STORAGE_KEYS.CLIENT_ID, id);
        }
        return id;
    }

    /**
     * Initialize Supabase client if environment variables are set
     */
    function initSupabase() {
        try {
            const url = window.SUPABASE_URL;
            const key = window.SUPABASE_ANON_KEY;
            if (url && key && url.toLowerCase().includes('supabase') && key.length > 10 && window.supabase) {
                window.supabaseClient = window.supabase.createClient(url, key);
                console.log('✓ Supabase initialized');
                return true;
            } else {
                console.log('ℹ Supabase not configured — running in local-only mode');
                return false;
            }
        } catch (e) {
            console.warn('✗ Supabase init failed:', e);
            return false;
        }
    }

    /**
     * Sync reviews and favorites from Supabase
     */
    async function syncFromSupabase(businesses) {
        if (!window.supabaseClient) return;

        try {
            const { data: reviews } = await window.supabaseClient.from('reviews').select('*');
            if (Array.isArray(reviews)) {
                reviews.forEach(r => {
                    const biz = businesses.find(b => b.id === r.business_id);
                    if (biz) {
                        biz.reviews = biz.reviews || [];
                        const exists = biz.reviews.some(local => local.author === r.author && local.date === r.date && local.comment === r.comment);
                        if (!exists) {
                            biz.reviews.push({ author: r.author, rating: r.rating, comment: r.comment, date: r.date });
                        }
                    }
                });
                saveBusinesses(businesses);
            }

            const clientId = getClientId();
            const { data: favs } = await window.supabaseClient.from('favorites').select('*').eq('user_id', clientId);
            return Array.isArray(favs) ? favs.map(f => f.business_id) : [];
        } catch (e) {
            console.warn('✗ Supabase sync error:', e.message);
            return [];
        }
    }

    /**
     * Save review to Supabase
     */
    async function saveReviewToSupabase(businessId, review) {
        if (!window.supabaseClient) return;
        try {
            await window.supabaseClient.from('reviews').insert([{
                business_id: businessId,
                author: review.author,
                rating: review.rating,
                comment: review.comment,
                date: review.date
            }]);
        } catch (e) {
            console.warn('✗ Failed to save review to Supabase:', e.message);
        }
    }

    /**
     * Sync favorite to Supabase
     */
    async function syncFavoriteToSupabase(businessId, isFavorite) {
        if (!window.supabaseClient) return;
        const clientId = getClientId();
        try {
            if (isFavorite) {
                await window.supabaseClient.from('favorites').upsert(
                    { user_id: clientId, business_id: businessId },
                    { onConflict: ['user_id', 'business_id'] }
                );
            } else {
                await window.supabaseClient.from('favorites').delete().match({ user_id: clientId, business_id: businessId });
            }
        } catch (e) {
            console.warn('✗ Failed to sync favorite to Supabase:', e.message);
        }
    }

    /**
     * Save businesses to localStorage
     */
    function saveBusinesses(businesses) {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
    }

    /**
     * Save favorites to localStorage
     */
    function saveFavorites(favorites) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }

    /**
     * Load businesses from localStorage or external source
     */
    async function loadBusinesses() {
        const stored = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) {
                console.warn('✗ Failed to parse stored businesses');
            }
        }

        // Try to load from external JSON
        try {
            if (location && location.protocol && location.protocol.startsWith('http')) {
                let resp = await fetch('data/businesses.json');
                if ((!resp || !resp.ok) && location.hostname) {
                    const abs = `${location.protocol}//${location.host}/data/businesses.json`;
                    resp = await fetch(abs);
                }
                if (resp && resp.ok) {
                    const data = await resp.json();
                    if (Array.isArray(data) && data.length > 0) {
                        saveBusinesses(data);
                        console.log(`✓ Loaded ${data.length} businesses from external JSON`);
                        return data;
                    }
                }
            }
        } catch (e) {
            console.warn('✗ Could not load external businesses.json:', e);
        }

        console.log('ℹ No businesses data found');
        return [];
    }

    /**
     * Load favorites from localStorage
     */
    function loadFavorites() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('✗ Failed to parse stored favorites');
            return [];
        }
    }

    return {
        getClientId,
        initSupabase,
        syncFromSupabase,
        saveReviewToSupabase,
        syncFavoriteToSupabase,
        saveBusinesses,
        saveFavorites,
        loadBusinesses,
        loadFavorites
    };
})();
