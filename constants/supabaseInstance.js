import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from './index';

export function createSupabaseClient(token) {
    return createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    });
}
