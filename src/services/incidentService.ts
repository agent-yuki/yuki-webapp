import { supabase } from '../lib/supabaseClient';
import { SecurityIncident } from '../types';

export const INCIDENTS_PER_PAGE = 20;

export const incidentService = {
  /**
   * Fetch public incidents with pagination
   */
  async getPublicIncidents(page = 0, limit = INCIDENTS_PER_PAGE) {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('security_incidents')
      .select('*, profiles(email, avatar_url, full_name)', { count: 'exact' })
      .eq('visibility', 'PUBLIC')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    
    return { 
      data: (data || []) as unknown as SecurityIncident[], 
      count 
    };
  },

  /**
   * Fetch a specific user's incidents
   */
  async getUserIncidents(userId: string, page = 0, limit = INCIDENTS_PER_PAGE) {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('security_incidents')
      .select('*, profiles(email, avatar_url, full_name)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return { 
      data: (data || []) as unknown as SecurityIncident[], 
      count 
    };
  },

  /**
   * Get a single incident by ID
   */
  async getIncidentById(id: string) {
    const { data, error } = await supabase
      .from('security_incidents')
      .select('*, profiles(email, avatar_url, full_name)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as unknown as SecurityIncident;
  },

  /**
   * Get user credit balance
   */
  async getUserCredits(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();
    
    // if (error) throw error; // maybeSingle doesn't error on 0 rows, so this catch handles actual DB errors
    if (error && error.code !== 'PGRST116') throw error; // Just in case, but maybeSingle handles 116.
    
    return data?.credits ?? 0;
  },

  /**
   * Create a new incident record
   */
  async createIncident(incidentData: Partial<SecurityIncident>) {
    // Ensure profile exists loop (simplified check)
    if (incidentData.user_id) {
       const { data: profile } = await supabase.from('profiles').select('id, credits').eq('id', incidentData.user_id).maybeSingle();
       
       // Auto-fix profile if missing
       if (!profile) {
          await supabase.from('profiles').insert({ id: incidentData.user_id }).select().maybeSingle(); 
       } else {
          // Check Credits
          if ((profile.credits || 0) <= 0) {
             throw new Error('Insufficient credits. Please upgrade your plan.');
          }
       }
    }

    const { data, error } = await supabase
      .from('security_incidents')
      .insert(incidentData)
      .select()
      .maybeSingle();

    if (error) throw error;

    // NOTE: Credits are deducted in /api/analyze BEFORE calling this service.
    // Do NOT deduct again here to prevent double-charging users.

    return data;
  }
};
