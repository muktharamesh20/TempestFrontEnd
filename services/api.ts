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
//https://vjdjrmuhojwprugppufd.supabase.co/storage/v1/object/public/profile-images//blank-profile-pic.jpg

export async function getUserId() {
    const currUserId = await AsyncStorage.getItem('userId');
    if(currUserId){
        return currUserId
    }
    if((await (supabase.auth.getSession())).data.session){
        const actualUserId = (await supabase.auth.getUser()).data.user?.id
        if (actualUserId){
            await AsyncStorage.setItem('userId', actualUserId);
            return actualUserId
        } 
    }
    supabase.auth.signOut()
    throw new Error('No session detected!')
}

export async function resetUserId() {
    await AsyncStorage.removeItem('userId');
}