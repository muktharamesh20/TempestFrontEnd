import { supabase } from "@/constants/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

//https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[asset-name]
export const SB_STORAGE_CONFIG = {
    BASE_URL: `https://${process.env.EXPO_PUBLIC_PROJECT_ID}.supabase.co/storage/v1/object/public/profile-images/`,
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        apikey: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

/**
 * 
 * @returns [actualUserId, actualUsername] if user is logged in and has a username set
 */
export async function getUserId() {
    const currUserId = (await AsyncStorage.getItem('userId'))?.split(',');
    if (currUserId) {
        console.log(currUserId)
        return [currUserId[0], currUserId[1]]
    }
    if ((await (supabase.auth.getSession())).data.session) {
        const actualUserId = (await supabase.auth.getUser()).data.user?.id
        if (actualUserId) {
            const actualUsername = (await supabase.from('usersettings').select('username').eq('id', actualUserId)).data;
            if (actualUsername) {
                const username = actualUsername[0].username;
                if (username) {
                    await AsyncStorage.setItem('userId', `${actualUserId},${username}`);
                    console.log('done!', actualUserId, username)
                    return [actualUserId, username]
                } else {
                    throw new Error('Need to set username?')
                }
            }
        }
    }
    supabase.auth.signOut()
    throw new Error('No session detected!')
}

export async function resetUserId() {
    console.log( 'resetting!');
    await AsyncStorage.removeItem('userId');
    console.log('UserId reset!');
}