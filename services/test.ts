import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { Database, Tables, Enums } from '../databasetypes'
import {signInAndGetToken, signOut, getSupabaseClient, decodeToken, createUser, deleteAccount} from './auth'
import assert from 'assert'
import dotenv from 'dotenv';
import { get } from 'http'
import { create } from 'domain'
import * as types from './utils.js'

//allows us to use process.env to get environment variables
dotenv.config();

// Create a single supabase client for interacting with your database
/* const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? assert.fail('NEXT_PUBLIC_SUPABASE_URL is not defined'),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? assert.fail('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined'), {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: false,
          persistSession: true,
          detectSessionInUrl: true
        }
      }) */

//helper functions to interact with the database
type friend = {
    followed_id: string;
    follower_id: string;
};

export async function deleteTestingUsers(supabaseClient: SupabaseClient<Database>): Promise<void> {
    await signInAndGetToken('a@a.com', 'Alphabet08', supabaseClient);
    await deleteAccount(supabaseClient);
    await signInAndGetToken('b@b.com', 'Alphabet08', supabaseClient);
    await deleteAccount(supabaseClient);
    await signInAndGetToken('c@c.com', 'Alphabet08', supabaseClient);
    await deleteAccount(supabaseClient);
    await signInAndGetToken('d@d.com', 'Alphabet08', supabaseClient);
    await deleteAccount(supabaseClient);
    await signInAndGetToken('e@e.com', 'Alphabet08', supabaseClient);
    await deleteAccount(supabaseClient);
    await signInAndGetToken('f@f.com', 'Alphabet08', supabaseClient);
    await deleteAccount(supabaseClient);
}

export async function createTestingUsers(supabaseClient: SupabaseClient<Database>): Promise<void> {
    await createUser('a@a.com', 'Alphabet08', supabaseClient);
    await createUser('b@b.com', 'Alphabet08', supabaseClient);
    await createUser('c@c.com', 'Alphabet08', supabaseClient);
    await createUser('d@d.com', 'Alphabet08', supabaseClient);
    await createUser('e@e.com', 'Alphabet08', supabaseClient);
    await createUser('f@f.com', 'Alphabet08', supabaseClient);
}

async function getViewershipTag(supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('viewership_tags')
        .select('*');
    if (error) {
        console.error('Error fetching viewership tag:', error.message);
        throw error;
    }

    console.log('Viewership tag data:', data);
}


async function getFollowerListUserName( userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('usersettings!follower_id  (username)')
        .eq('followed_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return(data.map((following) => following.usersettings.username).filter((username) => username !== null && username !== undefined));
}

async function getFollowingListUserName(userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('usersettings!followed_id  (username)')
        .eq('follower_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return(data.map((following) => following.usersettings.username).filter((username) => username !== null && username !== undefined));
}


async function getPostsFromUser(userId: string, supabaseClient: SupabaseClient<Database>): Promise<string[]> {
    const { data, error } = await supabaseClient
        .from('post')
        .select('*')
        .eq('owner_id', userId);

    if (error) {
        console.error('Error fetching posts:', error.message);
        throw error;
    }

    console.log('Posts data:', data.map(post => (post.title)));
    return data.map(post => (post.id));
}


//--------------------------------------------Main Function--------------------------------------------------//
async function main(): Promise<void> {
    const user20 = '631fc63b-98d6-4434-a6b8-6c5c6d584069';
    const abc = '70f8a317-c06b-471b-a51c-4b61a5fc35fa';
    const another = 'a08d9256-23f9-426e-9e36-a53d504c92e0';
    const user21 = 'da2b0a4b-ca12-40a2-b6cd-aa08e64493cb';
    const onefinal = 'f4790ec6-eb7f-4190-b778-27909cafa49f';
    const supabase = await getSupabaseClient();
    let [token, refreshToken, user_id] = await signInAndGetToken('muktharamesh21@gmail.com', 'abcabc', supabase);
    await getViewershipTag(supabase);
    console.log("User id:", user_id);

    //await createFollowerRequest(user_id, abc, supabase);
    //await rejectOrRevokeFollowerRequest(user_id, user20, supabase);
    //await acceptFollowerRequest(abc, user_id, supabase);
    console.log(await getPostsFromUser(user20, supabase));
    signOut(token, supabase);
}

main()