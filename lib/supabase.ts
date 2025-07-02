import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveOnboarding({
    user_id,
    name,
    age,
    gender,
    goal,
    weight,
    height,
    dietary,
    subscribed
  }: {
    user_id: string;
    name: string;
    age: string;
    gender: string;
    goal: string;
    weight: string;
    height: string;
    dietary: string;
    subscribed: boolean;
  }) {
    const { data, error } = await supabase.from('user_profiles').upsert([
      {
        user_id,
        name,
        age,
        gender,
        goal,
        weight,
        height,
        dietary,
        subscribed
      }
    ]);
    if (error) throw error;
    return data;
  }