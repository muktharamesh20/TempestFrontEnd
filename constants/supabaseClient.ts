import { Database } from "@/databasetypes";
import { getSupabaseClient } from "@/services/auth";
import { SupabaseClient } from "@supabase/supabase-js";

export const supabase: SupabaseClient<Database> = getSupabaseClient();
