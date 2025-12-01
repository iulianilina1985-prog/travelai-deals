import { supabase } from '../lib/supabase';

/**
 * Enhanced Supabase service for travel deals management 
 * with comprehensive search, filtering, and AI chat integration capabilities
 */
class DealsService {
  /**
   * Intelligent travel search that combines text parsing with Supabase data
   * @param {string} searchQuery - Natural language search query from user
   * @returns {Promise<Object>} Search results with data and error handling
   */
  async searchTravelDeals(searchQuery) {
    try {
      // Parse user query to extract search parameters
      const searchParams = this.parseUserQuery(searchQuery);

      console.log('Parsed search parameters:', searchParams);

      // Use Supabase RPC function with parsed parameters
      const { data, error } = await supabase?.rpc('search_travel_deals', {
        search_destination: searchParams?.destination,
        min_price: searchParams?.minPrice,
        max_price: searchParams?.maxPrice,
        departure_start: searchParams?.departureStart,
        departure_end: searchParams?.departureEnd,
        travelers_count: searchParams?.travelers,
        deal_category: searchParams?.category,
        limit_count: searchParams?.limit ?? 10,
        offset_count: 0
      });

      if (error) {
        console.error('Error searching travel deals:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Search deals error:', error);
      return { data: null, error: { message: 'Search failed. Please try again.' } };
    }
  }

  /**
   * Advanced natural language processing to extract search parameters
   * @param {string} query - User's natural language input
   * @returns {Object} Parsed search parameters
   */
  parseUserQuery(query) {
    const lowerQuery = query?.toLowerCase() || '';
    const params = {};

    // Extract destinations - comprehensive mapping
    const destinations = {
      'paris': 'Paris', 'pariz': 'Paris',
      'roma': 'Roma', 'rome': 'Roma',
      'londra': 'Londra', 'london': 'Londra',
      'barcelona': 'Barcelona',
      'amsterdam': 'Amsterdam',
      'praga': 'Praga', 'prague': 'Praga',
      'viena': 'Viena', 'vienna': 'Viena',
      'berlin': 'Berlin',
      'madrid': 'Madrid',
      'lisabona': 'Lisabona', 'lisbon': 'Lisabona',
      'grecia': 'Grecia', 'greece': 'Grecia', 'santorini': 'Grecia', 'mykonos': 'Grecia',
      'italia': 'Italia', 'italy': 'Italia', 'florence': 'Italia', 'venetia': 'Italia',
      'franța': 'Franța', 'france': 'Franța', 'nisa': 'Franța', 'cannes': 'Franța',
      'spania': 'Spania', 'spain': 'Spania', 'sevilla': 'Spania', 'valencia': 'Spania',
      'germania': 'Germania', 'germany': 'Germania', 'munchen': 'Germania',
      'românia': 'România', 'romania': 'România', 'brașov': 'România', 'cluj': 'România',
      'portugalia': 'Portugalia', 'portugal': 'Portugalia', 'porto': 'Portugalia',
      'olanda': 'Olanda', 'netherlands': 'Olanda', 'haga': 'Olanda'
    };

    // Find destination match
    for (const [keyword, destination] of Object.entries(destinations)) {
      if (lowerQuery?.includes(keyword)) {
        params.destination = destination;
        break;
      }
    }

    // Extract categories - enhanced mapping
    const categories = {
      'city break': 'city-break',
      'city-break': 'city-break',
      'cultural': 'cultural',
      'cultură': 'cultural',
      'istoric': 'cultural',
      'muzeu': 'cultural',
      'plajă': 'beach',
      'beach': 'beach',
      'mare': 'beach',
      'ocean': 'beach',
      'soare': 'beach',
      'aventură': 'adventure',
      'adventure': 'adventure',
      'hiking': 'adventure',
      'munte': 'adventure',
      'escaladă': 'adventure',
      'lux': 'luxury',
      'luxury': 'luxury',
      'premium': 'luxury',
      'exclusiv': 'luxury',
      'business': 'business',
      'conferință': 'business',
      'corporate': 'business',
      'familie': 'family',
      'family': 'family',
      'copii': 'family',
      'kids': 'family'
    };

    for (const [keyword, category] of Object.entries(categories)) {
      if (lowerQuery?.includes(keyword)) {
        params.category = category;
        break;
      }
    }

    // Enhanced price extraction with multiple patterns
    const pricePatterns = [
    /(\d+)\s*(?:euro|eur|€)/gi,
    /(\d+)\s*lei/gi,
    /sub\s*(\d+)/gi,
    /peste\s*(\d+)/gi,
    /maxim\s*(\d+)/gi,
    /minim\s*(\d+)/gi,
    /între\s*(\d+)\s*și\s*(\d+)/gi];


    let allPrices = [];
    pricePatterns?.forEach((pattern) => {
      const matches = lowerQuery?.match(pattern);
      if (matches) {
        matches?.forEach((match) => {
          const nums = match?.match(/\d+/g);
          if (nums) {
            allPrices?.push(...nums?.map((n) => parseInt(n)));
          }
        });
      }
    });

    if (allPrices?.length > 0) {
      if (lowerQuery?.includes('sub') || lowerQuery?.includes('mai puțin') || lowerQuery?.includes('maxim')) {
        params.maxPrice = Math.min(...allPrices);
      } else if (lowerQuery?.includes('peste') || lowerQuery?.includes('mai mult') || lowerQuery?.includes('minim')) {
        params.minPrice = Math.max(...allPrices);
      } else if (lowerQuery?.includes('între') && allPrices?.length >= 2) {
        params.minPrice = Math.min(...allPrices);
        params.maxPrice = Math.max(...allPrices);
      } else if (allPrices?.length === 2) {
        params.minPrice = Math.min(...allPrices);
        params.maxPrice = Math.max(...allPrices);
      } else {
        params.maxPrice = allPrices?.[0]; // Default to max price
      }
    }

    // Extract travelers count with multiple patterns
    const travelerPatterns = [
    /(\d+)\s*(?:persoane|oameni|adulți|travelers|people)/gi,
    /pentru\s*(\d+)/gi,
    /(\d+)\s*pax/gi];


    travelerPatterns?.forEach((pattern) => {
      const match = lowerQuery?.match(pattern);
      if (match && !params?.travelers) {
        params.travelers = parseInt(match?.[1]);
      }
    });

    // Enhanced date extraction
    const months = {
      'ianuarie': '01', 'februarie': '02', 'martie': '03', 'aprilie': '04',
      'mai': '05', 'iunie': '06', 'iulie': '07', 'august': '08',
      'septembrie': '09', 'octombrie': '10', 'noiembrie': '11', 'decembrie': '12',
      'january': '01', 'february': '02', 'march': '03', 'april': '04',
      'may': '05', 'june': '06', 'july': '07', 'august': '08',
      'september': '09', 'october': '10', 'november': '11', 'december': '12'
    };

    // Look for specific months
    for (const [monthName, monthNum] of Object.entries(months)) {
      if (lowerQuery?.includes(monthName)) {
        const currentYear = new Date()?.getFullYear();
        const currentMonth = new Date()?.getMonth() + 1;
        const targetMonth = parseInt(monthNum);

        // If the month is in the past this year, assume next year
        const year = targetMonth < currentMonth ? currentYear + 1 : currentYear;

        params.departureStart = `${year}-${monthNum}-01`;
        params.departureEnd = `${year}-${monthNum}-${new Date(year, targetMonth, 0)?.getDate()}`;
        break;
      }
    }

    // Look for relative time expressions
    if (lowerQuery?.includes('weekend') || lowerQuery?.includes('săptămâna viitoare')) {
      const nextWeekend = new Date();
      nextWeekend?.setDate(nextWeekend?.getDate() + (6 - nextWeekend?.getDay()));
      params.departureStart = nextWeekend?.toISOString()?.split('T')?.[0];
    }

    if (lowerQuery?.includes('luna viitoare')) {
      const nextMonth = new Date();
      nextMonth?.setMonth(nextMonth?.getMonth() + 1);
      nextMonth?.setDate(1);
      params.departureStart = nextMonth?.toISOString()?.split('T')?.[0];
    }

    // Set reasonable default limit for chat interface
    params.limit = 5;

    return params;
  }

  /**
   * Get all active travel deals with optional filters
   * @param {Object} filters - Filtering options
   * @returns {Promise<Object>} Deals with error handling
   */
  async getDeals(filters = {}) {
    try {
      let query = supabase?.from('travel_deals')?.select('*')?.eq('status', 'active')?.gt('expiry_date', new Date()?.toISOString()?.split('T')?.[0])?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.destination) {
        query = query?.ilike('destination', `%${filters?.destination}%`);
      }

      if (filters?.minPrice) {
        query = query?.gte('current_price', filters?.minPrice);
      }

      if (filters?.maxPrice) {
        query = query?.lte('current_price', filters?.maxPrice);
      }

      if (filters?.departureStart) {
        query = query?.gte('departure_date', filters?.departureStart);
      }

      if (filters?.departureEnd) {
        query = query?.lte('departure_date', filters?.departureEnd);
      }

      if (filters?.category && filters?.category !== 'all') {
        query = query?.eq('category', filters?.category);
      }

      if (filters?.travelers) {
        query = query?.gte('travelers', filters?.travelers);
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters?.sortBy) {
          case 'price-asc':
            query = query?.order('current_price', { ascending: true });
            break;
          case 'price-desc':
            query = query?.order('current_price', { ascending: false });
            break;
          case 'rating':
            query = query?.order('rating', { ascending: false });
            break;
          case 'expiry':
            query = query?.order('expiry_date', { ascending: true });
            break;
          case 'newest':
          default:
            query = query?.order('created_at', { ascending: false });
            break;
        }
      }

      // Apply pagination
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      if (filters?.offset) {
        query = query?.range(filters?.offset, filters?.offset + (filters?.limit || 20) - 1);
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
      return { data: null, error: { message: 'Failed to fetch deals.' } };
    }
  }

  /**
   * Enhanced method to get travel recommendations based on user preferences
   * @param {string} userId - User ID for personalized recommendations
   * @param {string} searchQuery - User's search query
   * @returns {Promise<Object>} Personalized travel recommendations
   */
  async getPersonalizedRecommendations(userId, searchQuery = '') {
    try {
      // Get user preferences first
      let userPreferences = null;
      if (userId) {
        const { data: preferences } = await supabase?.from('travel_preferences')?.select('*')?.eq('user_id', userId)?.single();

        userPreferences = preferences;
      }

      let searchParams = this.parseUserQuery(searchQuery);

      // Enhance search with user preferences
      if (userPreferences) {
        // Apply budget constraints from preferences
        if (!searchParams?.maxPrice && userPreferences?.budget_max) {
          searchParams.maxPrice = userPreferences?.budget_max;
        }
        if (!searchParams?.minPrice && userPreferences?.budget_min) {
          searchParams.minPrice = userPreferences?.budget_min;
        }

        // Apply preferred destinations if no specific destination in query
        if (!searchParams?.destination && userPreferences?.preferred_destinations?.length > 0) {
          searchParams.destination = userPreferences?.preferred_destinations?.[0];
        }

        // Apply travel style as category if no specific category
        if (!searchParams?.category && userPreferences?.travel_style) {
          const styleToCategory = {
            'cultural': 'cultural',
            'adventure': 'adventure',
            'luxury': 'luxury',
            'business': 'business',
            'family': 'family',
            'relaxation': 'beach'
          };
          searchParams.category = styleToCategory?.[userPreferences?.travel_style];
        }
      }

      // Search with enhanced parameters
      return await this.searchTravelDeals(searchQuery);
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return { data: this.getFallbackRecommendations(), error: null };
    }
  }

  /**
   * Get fallback recommendations when search fails
   * @returns {Array} Static array of popular deals
   */
  getFallbackRecommendations() {
    return [
    {
      id: 'fallback-1',
      title: 'Paris - City Break de Weekend',
      destination: 'Paris, Franța',
      current_price: 299,
      original_price: 399,
      rating: 4.8,
      image_url: "https://images.unsplash.com/photo-1515577416044-7af10f799477",
      image_alt: 'Turnul Eiffel iluminat noaptea cu Seine în prim-plan',
      description: 'Descoperă farmecul Parisului într-un city break memorabil.',
      category: 'city-break',
      departure_date: '2025-12-15',
      return_date: '2025-12-18',
      duration: 3,
      hotel_name: 'Hotel des Arts Montmartre',
      hotel_rating: 8.2,
      hotel_stars: 4,
      provider: 'TravelDeals',
      is_new: false
    }];

  }

  // Get single deal by ID
  async getDealById(dealId) {
    try {
      const { data, error } = await supabase?.from('travel_deals')?.select('*')?.eq('id', dealId)?.eq('status', 'active')?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch deal details.' } };
    }
  }

  // Get user's saved deals
  async getSavedDeals(userId = null) {
    try {
      let query = supabase?.from('saved_deals')?.select(`
          *,
          deal:travel_deals(*)
        `)?.order('saved_at', { ascending: false });

      if (userId) {
        query = query?.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error };
      }

      // Extract deal data and merge with saved info
      const savedDeals = data?.map((saved) => ({
        ...saved?.deal,
        saved_at: saved?.saved_at,
        saved_id: saved?.id,
        notes: saved?.notes
      })) || [];

      return { data: savedDeals, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch saved deals.' } };
    }
  }

  // Save a deal for the current user
  async saveDeal(dealId, notes = '') {
    try {
      const { data, error } = await supabase?.from('saved_deals')?.insert({
        deal_id: dealId,
        user_id: (await supabase?.auth?.getUser())?.data?.user?.id,
        notes
      })?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to save deal.' } };
    }
  }

  // Remove a saved deal
  async removeSavedDeal(savedDealId) {
    try {
      const { error } = await supabase?.from('saved_deals')?.delete()?.eq('id', savedDealId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to remove saved deal.' } };
    }
  }

  // Remove saved deal by deal ID (for convenience)
  async removeSavedDealByDealId(dealId) {
    try {
      const { error } = await supabase?.from('saved_deals')?.delete()?.eq('deal_id', dealId)?.eq('user_id', (await supabase?.auth?.getUser())?.data?.user?.id);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to remove saved deal.' } };
    }
  }

  // Update notes for saved deal
  async updateSavedDealNotes(savedDealId, notes) {
    try {
      const { data, error } = await supabase?.from('saved_deals')?.update({ notes })?.eq('id', savedDealId)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to update notes.' } };
    }
  }

  // Check if deal is saved by current user
  async isDealSaved(dealId) {
    try {
      const { data, error } = await supabase?.from('saved_deals')?.select('id')?.eq('deal_id', dealId)?.eq('user_id', (await supabase?.auth?.getUser())?.data?.user?.id)?.maybeSingle();

      if (error) {
        return { saved: false, error };
      }

      return { saved: !!data, savedId: data?.id || null, error: null };
    } catch (error) {
      return { saved: false, error: { message: 'Failed to check if deal is saved.' } };
    }
  }

  // Get trending/popular deals
  async getTrendingDeals(limit = 10) {
    try {
      const { data, error } = await supabase?.from('travel_deals')?.select('*')?.eq('status', 'active')?.gt('expiry_date', new Date()?.toISOString()?.split('T')?.[0])?.order('rating', { ascending: false })?.order('reviews_count', { ascending: false })?.limit(limit);

      if (error) {
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch trending deals.' } };
    }
  }

  // Get deals by category
  async getDealsByCategory(category, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('travel_deals')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error };
    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: { message: 'Failed to fetch deals by category.' } };
  }
}


  // Subscribe to real-time deal updates
  subscribeToDeals(callback) {
    return supabase?.channel('travel_deals_changes')?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'travel_deals'
      },
      callback
    )?.subscribe();
  }

  // Unsubscribe from real-time updates
  unsubscribeFromDeals(subscription) {
    if (subscription) {
      return supabase?.removeChannel(subscription);
    }
  }
}

export const dealsService = new DealsService();
export default dealsService;