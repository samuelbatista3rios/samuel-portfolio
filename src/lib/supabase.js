import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase client — null when env vars are not configured
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Load portfolio data from Supabase.
 * Returns the parsed data object, or null on failure / not configured.
 */
export async function loadPortfolioData() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("portfolio_data")
      .select("data")
      .eq("id", 1)
      .single();
    if (error) return null;
    return data?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Save portfolio data to Supabase (upsert row id=1).
 * Returns true on success, false on failure / not configured.
 */
export async function savePortfolioData(portfolioData) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("portfolio_data")
      .upsert({ id: 1, data: portfolioData, updated_at: new Date().toISOString() });
    return !error;
  } catch {
    return false;
  }
}
