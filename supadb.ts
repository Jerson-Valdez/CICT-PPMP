import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getAccessToken(): Promise<string | undefined> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token;
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getUserID(token: string): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }

  return data.user.id;
}