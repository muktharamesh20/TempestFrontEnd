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

console.log(process.env.PROJECT_ID)