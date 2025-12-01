import { supabase } from '../lib/supabase';

class UserService {
  // Get current user profile
  async getUserProfile(userId = null) {
    try {
      const targetUserId = userId || (await supabase?.auth?.getUser())?.data?.user?.id;
      
      if (!targetUserId) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', targetUserId)?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          data: null, 
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or inactive.' 
          } 
        };
      }
      return { data: null, error: { message: 'Failed to fetch user profile.' } };
    }
  }

  // Update user profile
  async updateUserProfile(updates) {
    try {
      const currentUser = await supabase?.auth?.getUser();
      if (!currentUser?.data?.user?.id) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      const { data, error } = await supabase?.from('user_profiles')?.update({
          first_name: updates?.firstName,
          last_name: updates?.lastName,
          phone: updates?.phone,
          date_of_birth: updates?.dateOfBirth,
          avatar_url: updates?.avatarUrl,
          marketing_emails: updates?.marketingEmails,
          updated_at: new Date()?.toISOString()
        })?.eq('id', currentUser?.data?.user?.id)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to update profile.' } };
    }
  }

  // Get user travel preferences
  async getTravelPreferences(userId = null) {
    try {
      const targetUserId = userId || (await supabase?.auth?.getUser())?.data?.user?.id;
      
      if (!targetUserId) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      const { data, error } = await supabase?.from('travel_preferences')?.select('*')?.eq('user_id', targetUserId)?.single();

      if (error && error?.code !== 'PGRST116') { // Not found is ok
        return { data: null, error };
      }

      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch travel preferences.' } };
    }
  }

  // Update travel preferences
  async updateTravelPreferences(preferences) {
    try {
      const currentUser = await supabase?.auth?.getUser();
      if (!currentUser?.data?.user?.id) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      // Check if preferences exist
      const { data: existing } = await this.getTravelPreferences();
      
      const preferenceData = {
        user_id: currentUser?.data?.user?.id,
        preferred_destinations: preferences?.preferredDestinations || [],
        travel_frequency: preferences?.travelFrequency,
        budget_min: preferences?.budgetMin,
        budget_max: preferences?.budgetMax,
        travel_style: preferences?.travelStyle,
        preferred_airlines: preferences?.preferredAirlines || [],
        special_requirements: preferences?.specialRequirements,
        updated_at: new Date()?.toISOString()
      };

      let data, error;

      if (existing?.id) {
        // Update existing preferences
        const result = await supabase?.from('travel_preferences')?.update(preferenceData)?.eq('user_id', currentUser?.data?.user?.id)?.select()?.single();
        data = result.data;
        error = result.error;
      } else {
        // Create new preferences
        const result = await supabase?.from('travel_preferences')?.insert(preferenceData)?.select()?.single();
        data = result.data;
        error = result.error;
      }

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to update travel preferences.' } };
    }
  }

  // Get user subscription info
  async getUserSubscription(userId = null) {
    try {
      const targetUserId = userId || (await supabase?.auth?.getUser())?.data?.user?.id;
      
      if (!targetUserId) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      const { data, error } = await supabase?.from('subscriptions')?.select('*')?.eq('user_id', targetUserId)?.eq('status', 'active')?.order('created_at', { ascending: false })?.limit(1)?.single();

      if (error && error?.code !== 'PGRST116') { // Not found is ok
        return { data: null, error };
      }

      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch subscription info.' } };
    }
  }

  // Get user dashboard statistics
  async getUserDashboardStats(userId = null) {
    try {
      const targetUserId = userId || (await supabase?.auth?.getUser())?.data?.user?.id;
      
      if (!targetUserId) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      const { data, error } = await supabase?.rpc('get_user_dashboard_stats', {
        user_uuid: targetUserId
      });

      if (error) {
        return { data: null, error };
      }

      return { data: data || {}, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch dashboard statistics.' } };
    }
  }

  // Get user notifications
  async getUserNotifications(userId = null, options = {}) {
    try {
      const targetUserId = userId || (await supabase?.auth?.getUser())?.data?.user?.id;
      
      if (!targetUserId) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      let query = supabase?.from('notifications')?.select('*')?.eq('user_id', targetUserId)?.order('created_at', { ascending: false });

      if (options?.unreadOnly) {
        query = query?.eq('is_read', false);
      }

      if (options?.type) {
        query = query?.eq('type', options?.type);
      }

      if (options?.limit) {
        query = query?.limit(options?.limit);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to fetch notifications.' } };
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await supabase?.from('notifications')?.update({ is_read: true })?.eq('id', notificationId)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to mark notification as read.' } };
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(userId = null) {
    try {
      const targetUserId = userId || (await supabase?.auth?.getUser())?.data?.user?.id;
      
      if (!targetUserId) {
        return { error: { message: 'User not authenticated.' } };
      }

      const { error } = await supabase?.from('notifications')?.update({ is_read: true })?.eq('user_id', targetUserId)?.eq('is_read', false);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to mark all notifications as read.' } };
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase?.from('notifications')?.delete()?.eq('id', notificationId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to delete notification.' } };
    }
  }

  // Create analytics event
  async trackEvent(eventType, eventName, properties = {}) {
    try {
      const currentUser = await supabase?.auth?.getUser();
      
      const { data, error } = await supabase?.from('analytics_events')?.insert({
          user_id: currentUser?.data?.user?.id || null,
          event_type: eventType,
          event_name: eventName,
          properties,
          session_id: this.getSessionId(),
          user_agent: navigator?.userAgent || null
        })?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to track event.' } };
    }
  }

  // Helper to get or generate session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('travel_ai_session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
      sessionStorage.setItem('travel_ai_session_id', sessionId);
    }
    
    return sessionId;
  }

  // Update user email preferences
  async updateEmailPreferences(preferences) {
    try {
      const currentUser = await supabase?.auth?.getUser();
      if (!currentUser?.data?.user?.id) {
        return { data: null, error: { message: 'User not authenticated.' } };
      }

      const { data, error } = await supabase?.from('user_profiles')?.update({
          marketing_emails: preferences?.marketingEmails,
          updated_at: new Date()?.toISOString()
        })?.eq('id', currentUser?.data?.user?.id)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Failed to update email preferences.' } };
    }
  }

  // Deactivate user account
  async deactivateAccount() {
    try {
      const currentUser = await supabase?.auth?.getUser();
      if (!currentUser?.data?.user?.id) {
        return { error: { message: 'User not authenticated.' } };
      }

      const { error } = await supabase?.from('user_profiles')?.update({
          is_active: false,
          updated_at: new Date()?.toISOString()
        })?.eq('id', currentUser?.data?.user?.id);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to deactivate account.' } };
    }
  }

  // Subscribe to user profile changes
  subscribeToUserProfile(userId, callback) {
    return supabase?.channel(`user_profile_${userId}`)?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${userId}`
        },
        callback
      )?.subscribe();
  }

  // Subscribe to user notifications
  subscribeToNotifications(userId, callback) {
    return supabase?.channel(`notifications_${userId}`)?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )?.subscribe();
  }

  // Unsubscribe from real-time updates
  unsubscribeFromUpdates(subscription) {
    if (subscription) {
      return supabase?.removeChannel(subscription);
    }
  }
}

export const userService = new UserService();
export default userService;