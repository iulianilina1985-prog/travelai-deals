// src/services/favoritesService.js
// Service for managing user favorites in Supabase

import { supabase } from '../lib/supabase';

export const favoritesService = {
    /**
     * Get all favorites for the current user
     * @returns {Promise<{data: Array, error: any}>}
     */
    async getFavorites() {
        try {
            const { data, error } = await supabase
                .from('user_favorites')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform to offer format
            const offers = data?.map(fav => ({
                ...fav.offer_snapshot,
                favoriteId: fav.id,
                isFavorite: true
            })) || [];

            return { data: offers, error: null };
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return { data: [], error };
        }
    },

    /**
     * Add an offer to favorites
     * @param {Object} offer - The offer object to save
     * @returns {Promise<{data: any, error: any}>}
     */
    async addFavorite(offer) {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await supabase
                .from('user_favorites')
                .insert({
                    user_id: user.id,
                    offer_id: offer.id,
                    offer_type: offer.type,
                    provider: offer.provider,
                    offer_snapshot: offer,
                    affiliate_link: offer.cta?.url || ''
                })
                .select()
                .single();

            if (error) throw error;

            return { data, error: null };
        } catch (error) {
            console.error('Error adding favorite:', error);
            return { data: null, error };
        }
    },

    /**
     * Remove an offer from favorites
     * @param {string} offerId - The offer ID to remove
     * @returns {Promise<{error: any}>}
     */
    async removeFavorite(offerId) {
        try {
            const { error } = await supabase
                .from('user_favorites')
                .delete()
                .eq('offer_id', offerId);

            if (error) throw error;

            return { error: null };
        } catch (error) {
            console.error('Error removing favorite:', error);
            return { error };
        }
    },

    /**
     * Check if an offer is favorited
     * @param {string} offerId - The offer ID to check
     * @returns {Promise<boolean>}
     */
    async isFavorite(offerId) {
        try {
            const { data } = await supabase
                .from('user_favorites')
                .select('id')
                .eq('offer_id', offerId)
                .maybeSingle();

            return !!data;
        } catch (error) {
            console.error('Error checking favorite:', error);
            return false;
        }
    },

    /**
     * Get favorite count for current user
     * @returns {Promise<number>}
     */
    async getFavoriteCount() {
        try {
            const { count, error } = await supabase
                .from('user_favorites')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            return count || 0;
        } catch (error) {
            console.error('Error getting favorite count:', error);
            return 0;
        }
    }
};

export default favoritesService;
