import { SupabaseClient } from '@supabase/supabase-js';
import { Image } from 'react-native';
import { Database } from '../databasetypes';
import { SB_STORAGE_CONFIG } from './api';
import * as types from './utils.js';



/**
 * Sets a new username for a user.
 * 
 * @param newUsername the new username to set for the user, required to be <= 15 characters
 * @param user the user to change the username for
 * @param supabaseClient the Supabase client to use for the database operations
 */
export async function changeUsername(newUsername: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('usersettings') 
        .update({ username: newUsername.toLowerCase() }) 
        .eq('id', userId); 

    if (error) {
        console.error('Error changing username:', error.message);
        throw error;
    }
}

export async function createAvatarLink(userId: string): Promise<string> {
    const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${userId}.jpg`;
    const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
  
    // Check if the profile picture exists
    if(await Image.prefetch(profilePicUrl)) {
        return profilePicUrl
    }

    //if it doesn't use the default
    return defaultPicUrl
}

/**
 * Changes the user's first name.
 * 
 * @param name the new first name to set for the user, required to be <= 15 characters, nonempty
 * @param user the user to change the first name for
 * @param supabaseClient the Supabase client to use for the database operations
 */
export async function changeFirstName(name: string, user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ first_name: name }) 
      .eq('id', user.user_id); 

  if (error) {
      console.error('Error changing first name:', error.message);
      throw error;
  }
}

/**
 * Changes the user's last name.
 * 
 * @param name the new last name to set for the user, required to be <= 15 characters, nonempty
 * @param user the user to change the last name for
 * @param supabaseClient the Supabase client to use for the database operations
 */
export async function changeLastName(name: string, user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ last_name: name }) 
      .eq('id', user.user_id); 

  if (error) {
      console.error('Error changing last name:', error.message);
      throw error;
  }
}

/**
 * Changes the user's middle name.
 * 
 * @param name the new middle name to set for the user, required to be <= 15 characters
 * @param user the user to change the middle name for
 * @param supabaseClient the Supabase client to use for the database operations
 */
export async function changeMiddleName(name: string, user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ middle_name: name }) 
      .eq('id', user.user_id); 

  if (error) {
      console.error('Error changing middle name:', error.message);
      throw error;
  }
}

/**
 * Changes the user's public or private status.
 * 
 * @param public_or_private 'public' or 'private' to set the user's status
 * @param user the user to change the status for
 * @param supabaseClient the Supabase client to use for the database operations
 */
export async function changePublicOrPrivate(public_or_private: 'public' | 'private', user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ public_or_private: public_or_private }) 
      .eq('id', user.user_id); 

  if (error) {
      console.error('Error changing public or private name:', error.message);
      throw error;
  }
}

/**
 * the function changes the user's bio.
 * 
 * @param newBio the new bio to set for the user, required to be <= 300 characters
 * @param user the user to change the bio for
 * @param supabaseClient the Supabase client to use for the database operations
 */
export async function changeBio(newBio: string, user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ bio: newBio }) 
      .eq('id', user.user_id); 

  if (error) {
      console.error('Error changing bio:', error.message);
      throw error;
  }
}

/**
 * The function sets a new profile picture for a user.
 * 
 * @param supabaseClient the Supabase client to use for the database operations
 * @param user the user to change the profile picture for
 * @param image the image to upload
 */
export async function setProfilePic(supabaseClient: SupabaseClient<Database>, user: types.User, image: types.Image): Promise<void> {
    throw new Error('setProfilePic function is not implemented yet.');
}

/**
 * Sets the profile picture back to default
 * 
 * @param supabaseClient the Supabase client to use for the database operations
 * @param user the user to delete the profile picture for
 */
export async function deleteProfilePic(supabaseClient: SupabaseClient<Database>, user: types.User): Promise<void> {
    throw new Error('deleteProfilePic function is not implemented yet.');
}