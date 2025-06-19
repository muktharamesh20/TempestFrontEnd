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

export function compileNorfications(
    userId: string,
    supabaseClient: SupabaseClient<Database>
): Promise<{ id: string; message: string; timestamp: string }[]> {
    return new Promise((resolve, reject) => {
        supabaseClient
            .from('notifications')
            .select('id, message, timestamp')
            .eq('user_id', userId)
            .then(({ data, error }: QueryResult<Tables['notifications']>) => {
                if (error) {
                    console.error('Error fetching notifications:', error.message);
                    reject(error);
                } else {
                    resolve(data.map(notification => ({
                        id: notification.id,
                        message: notification.message,
                        timestamp: notification.timestamp
                    })));
                }
            });
    });
}