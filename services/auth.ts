import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthSessionMissingError, createClient, processLock, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../databasetypes';
import { unregisterPushNotificationsAsync } from './pushNotifications';

// Create a single supabase client for interacting with your database
export function getSupabaseClient(): SupabaseClient<Database> {
  const supabase = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? (() => { throw new Error('EXPO_PUBLIC_SUPABASE_URL is not defined'); })(),
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? (() => { throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY is not defined'); })(), {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  });
  return supabase;
}

/**
 * 
 * @param email email of the user to create
 * @param password password of the user to create
 * @param supabaseClient the Supabase client to use for creating the user
 * @throws Will throw an error if the user creation fails, e.g. if the email is already in use or the password is too weak.
 * @throws AuthWeakPasswordError if the password is too weak.
 */
export async function createUser(email: string, password: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
}


/**
 * Tries to sign the user in with a username and password, and returns the access token and refresh token.
 * 
 * @param email email of the user
 * @param password password of the user
 * @returns access token and refresh token and the userid as a tuple
 * @throws Will throw an error if the login fails
 * @throws AuthWeakPasswordError if weak password
 */
export async function signInAndGetToken(email: string, password: string, supabaseClient: SupabaseClient<Database>): Promise<[string, string, string]> {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    throw error
  }

  const accessToken = data.session.access_token
  const refreshToken = data.session.refresh_token

  return [accessToken, refreshToken, data.session.user.id];
}

/**
 * Signs out the user from both the client and server side.
 * 
 * @param token JWT token of the user to sign out
 * @param scope Optional scope to specify which sessions to sign out ('global', 'local', or 'others')
 * @throws Will throw an error if the sign out fails (already signed out, invalid token, etc.) Will throw 
 * AuthSessionMissingError if the token is invalid or the session has expired.
 */
export async function signOut(token: string, supabaseClient: SupabaseClient<Database>, scope?: 'global' | 'local' | 'others'): Promise<void> {
  //const { error } = await supabase.auth.signOut();
  const { error: revokeError } = await supabaseClient.auth.admin.signOut(token, scope);
  unregisterPushNotificationsAsync(false);

  if (revokeError) {
    if (revokeError instanceof AuthSessionMissingError) {
      console.error('Unauthorized: Invalid token or session expired');
    } else {
      console.error('Server-side sign out error:', revokeError.message);
    };
    throw revokeError;
  }
}

/**
 * Refreshes the access token using the provided refresh token.
 * Note: This will fail if the refresh token is expired or invalid.
 * @param refreshToken - The refresh token to use for signing in.
 * @return A tuple containing the new access token and refresh token.
 */
export async function useSupaBaseRefreshToken(refreshToken: string, supabaseClient: SupabaseClient<Database>): Promise<[string, string]> {
  const { data, error } = await supabaseClient.auth.refreshSession({ refresh_token: refreshToken });

  if (error) {
    console.error('Refresh token error:', error.message);
    throw error;
  }

  if (!data.session) {
    throw new Error('No session data returned from refreshSession');
  }

  const accessToken = data.session.access_token;
  const newRefreshToken = data.session.refresh_token;

  console.log('✅ New Access Token:', accessToken);
  console.log('🔁 New Refresh Token:', newRefreshToken);

  return [accessToken, newRefreshToken];
}


export async function oathSignIn(supabaseClient: SupabaseClient<Database>): Promise<[string, string]> {
  // This function is not implemented yet, but it will handle OAuth sign-in
  // using the Supabase client.
  supabaseClient.auth.signInWithOAuth({
    provider: 'google', // or any other OAuth provider supported by Supabase
    options: {
      redirectTo: 'http://localhost:3000/auth/callback', // replace with your redirect URL after they are confirmed
      scopes: 'email profile',
    }
  })
  throw new Error('OAuth sign-in is not implemented yet.');
}

export async function changePassword(supabaseClient: SupabaseClient<Database>, newPassword: string): Promise<void> {
  const { data, error } = await supabaseClient.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Error changing password:', error.message);
    throw error;
  }
}

export async function deleteAccount(supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { error } = await supabaseClient.functions.invoke('delete_user');
  if (error) {
    console.error('Error deleting account:', error.message);
    throw error;
  }
}
