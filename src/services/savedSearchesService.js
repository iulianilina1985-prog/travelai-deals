import { supabase } from '../lib/supabase';

class SavedSearchesService {
  // Get user's saved searches
  async getSavedSearches(userId = null) {
    try {
      let query = supabase?.from('saved_searches')?.select('*')?.order('created_at', { ascending: false });

      if (userId) {
        query = query?.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          data: null, 
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or inactive.' 
          } 
        };
      }
      return { data: null, error: { message: 'Failed to fetch saved searches.' } };
    }
  }

  // Create a new saved search
  async createSavedSearch(searchData) {
    try {
      const currentUser = await supabase?.auth?.getUser();
      if (!currentUser?.data?.user?.id) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      const { data, error } = await supabase?.from('saved_searches')?.insert({
          user_id: currentUser?.data?.user?.id,
          name: searchData?.name,
          destination: searchData?.destination,
          description: searchData?.description,
          departure_date_start: searchData?.departureStart,
          departure_date_end: searchData?.departureEnd,
          return_date_start: searchData?.returnStart,
          return_date_end: searchData?.returnEnd,
          travelers: searchData?.travelers || 2,
          budget_min: searchData?.budgetMin,
          budget_max: searchData?.budgetMax,
          preferred_airlines: searchData?.preferredAirlines || [],
          travel_style: searchData?.travelStyle,
          status: 'active',
          alerts_enabled: searchData?.alertsEnabled !== false
        })?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to create saved search.' } };
    }
  }

  // Update a saved search
  async updateSavedSearch(searchId, updates) {
    try {
      const { data, error } = await supabase?.from('saved_searches')?.update({
          name: updates?.name,
          destination: updates?.destination,
          description: updates?.description,
          departure_date_start: updates?.departureStart,
          departure_date_end: updates?.departureEnd,
          return_date_start: updates?.returnStart,
          return_date_end: updates?.returnEnd,
          travelers: updates?.travelers,
          budget_min: updates?.budgetMin,
          budget_max: updates?.budgetMax,
          preferred_airlines: updates?.preferredAirlines,
          travel_style: updates?.travelStyle,
          alerts_enabled: updates?.alertsEnabled,
          status: updates?.status,
          updated_at: new Date()?.toISOString()
        })?.eq('id', searchId)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to update saved search.' } };
    }
  }

  // Delete a saved search
  async deleteSavedSearch(searchId) {
    try {
      const { error } = await supabase?.from('saved_searches')?.delete()?.eq('id', searchId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to delete saved search.' } };
    }
  }

  // Toggle alerts for a saved search
  async toggleSearchAlerts(searchId, alertsEnabled) {
    try {
      const { data, error } = await supabase?.from('saved_searches')?.update({ 
          alerts_enabled: alertsEnabled,
          updated_at: new Date()?.toISOString()
        })?.eq('id', searchId)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to toggle search alerts.' } };
    }
  }

  // Toggle search status (active/paused)
  async toggleSearchStatus(searchId) {
    try {
      // First get current status
      const { data: currentSearch, error: fetchError } = await supabase?.from('saved_searches')?.select('status')?.eq('id', searchId)?.single();

      if (fetchError) {
        return { data: null, error: fetchError };
      }

      const newStatus = currentSearch?.status === 'active' ? 'paused' : 'active';

      const { data, error } = await supabase?.from('saved_searches')?.update({ 
          status: newStatus,
          updated_at: new Date()?.toISOString()
        })?.eq('id', searchId)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to toggle search status.' } };
    }
  }

  // Update search statistics (found deals, last checked, etc.)
  async updateSearchStats(searchId, stats) {
    try {
      const { data, error } = await supabase?.from('saved_searches')?.update({
          found_deals_count: stats?.foundDealsCount,
          new_deals_count: stats?.newDealsCount,
          last_checked_at: stats?.lastCheckedAt || new Date()?.toISOString(),
          last_notified_at: stats?.lastNotifiedAt,
          updated_at: new Date()?.toISOString()
        })?.eq('id', searchId)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to update search statistics.' } };
    }
  }

  // Get saved search by ID
  async getSavedSearchById(searchId) {
    try {
      const { data, error } = await supabase?.from('saved_searches')?.select('*')?.eq('id', searchId)?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch saved search.' } };
    }
  }

  // Get active searches for monitoring
  async getActiveSearches(userId = null) {
    try {
      let query = supabase?.from('saved_searches')?.select('*')?.eq('status', 'active')?.eq('alerts_enabled', true)?.order('last_checked_at', { ascending: true });

      if (userId) {
        query = query?.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch active searches.' } };
    }
  }

  // Duplicate a saved search
  async duplicateSavedSearch(searchId, newName) {
    try {
      // First fetch the original search
      const { data: originalSearch, error: fetchError } = await this.getSavedSearchById(searchId);
      
      if (fetchError) {
        return { data: null, error: fetchError };
      }

      // Create new search with copied data
      const newSearchData = {
        name: newName || `${originalSearch?.name} (Copy)`,
        destination: originalSearch?.destination,
        description: originalSearch?.description,
        departureStart: originalSearch?.departure_date_start,
        departureEnd: originalSearch?.departure_date_end,
        returnStart: originalSearch?.return_date_start,
        returnEnd: originalSearch?.return_date_end,
        travelers: originalSearch?.travelers,
        budgetMin: originalSearch?.budget_min,
        budgetMax: originalSearch?.budget_max,
        preferredAirlines: originalSearch?.preferred_airlines,
        travelStyle: originalSearch?.travel_style,
        alertsEnabled: true
      };

      return await this.createSavedSearch(newSearchData);
    } catch (error) {
      return { data: null, error: { message: 'Failed to duplicate saved search.' } };
    }
  }

  // Get user's search statistics
  async getUserSearchStats(userId = null) {
    try {
      const currentUser = userId || (await supabase?.auth?.getUser())?.data?.user?.id;
      
      if (!currentUser) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      const { data, error } = await supabase?.from('saved_searches')?.select('status, alerts_enabled, found_deals_count, new_deals_count')?.eq('user_id', currentUser);

      if (error) {
        return { data: null, error };
      }

      const stats = {
        total: data?.length || 0,
        active: data?.filter(s => s?.status === 'active')?.length || 0,
        paused: data?.filter(s => s?.status === 'paused')?.length || 0,
        withAlerts: data?.filter(s => s?.alerts_enabled)?.length || 0,
        totalFoundDeals: data?.reduce((sum, s) => sum + (s?.found_deals_count || 0), 0),
        totalNewDeals: data?.reduce((sum, s) => sum + (s?.new_deals_count || 0), 0)
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to get user search statistics.' } };
    }
  }

  // Subscribe to real-time saved searches updates
  subscribeToSavedSearches(callback) {
    return supabase?.channel('saved_searches_changes')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_searches'
        },
        callback
      )?.subscribe();
  }

  // Unsubscribe from real-time updates
  unsubscribeFromSavedSearches(subscription) {
    if (subscription) {
      return supabase?.removeChannel(subscription);
    }
  }
}

export const savedSearchesService = new SavedSearchesService();
export default savedSearchesService;