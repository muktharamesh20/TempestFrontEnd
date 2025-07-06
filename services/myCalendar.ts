import { SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { Database } from '../databasetypes'
import * as types from './utils.js'

//allows us to use process.env to get environment variables
dotenv.config();

export async function getMyCalendar(user: types.User, supabaseClient: SupabaseClient<Database>, from: Date, to: Date): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('calendar')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching calendar:', error.message);
        throw error;
    }

    return data;
}

export async function createTodo(todoDetails: { title: string; description: string; dueDate: string; user: types.User }, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('todos')
        .insert(todoDetails);

    if (error) {
        console.error('Error creating todo:', error.message);
        throw error;
    }
}

export async function createEvent(eventDetails: { title: string; description: string; date: string; user: types.User }, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('events')
        .insert(eventDetails);

    if (error) {
        console.error('Error creating event:', error.message);
        throw error;
    }
}

export async function getKanban(user: types.User, supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('kanban')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching kanban:', error.message);
        throw error;
    }

    return data;
}

export async function deleteTodo(todo: types.Todo, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('todos')
        .delete()
        .eq('id', todoId);

    if (error) {
        console.error('Error deleting todo:', error.message);
        throw error;
    }
}

export async function deleteEvent(event: types.Event, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('events')
        .delete()
        .eq('id', eventId);

    if (error) {
        console.error('Error deleting event:', error.message);
        throw error;
    }
}

export async function getAllViewershipTags(supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('viewership_tags')
        .select('*');

    if (error) {
        console.error('Error fetching viewership tags:', error.message);
        throw error;
    }

    return data;
}



export async function changeViewershipTagsOfTodo(todo: types.Todo, tags: string[], supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('todos')
        .update({ viewership_tags: tags })
        .eq('id', todoId);

    if (error) {
        console.error('Error changing viewership tags of todo:', error.message);
        throw error;
    }
}

export async function changeViewershipTagsOfEvent(eventId: string, tags: string[], supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('events')
        .update({ viewership_tags: tags })
        .eq('id', eventId);

    if (error) {
        console.error('Error changing viewership tags of event:', error.message);
        throw error;
    }
}

export async function changeViewershipTagsOfCategories(categoryId: string, tags: string[], supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('categories')
        .update({ viewership_tags: tags })
        .eq('id', categoryId);

    if (error) {
        console.error('Error changing viewership tags of categories:', error.message);
        throw error;
    }
}

export async function inviteToEvent(eventId: string, inviteeId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('event_invites')
        .insert({ event_id: eventId, invitee_id: inviteeId });

    if (error) {
        console.error('Error inviting to event:', error.message);
        throw error;
    }
}

export async function acceptInviteToEvent(eventId: string, user: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('event_invites')
        .update({ accepted: true })
        .eq('event_id', eventId)
        .eq('invitee_id', userId);

    if (error) {
        console.error('Error accepting invite to event:', error.message);
        throw error;
    }
}

export async function editTodo(todo: types.Todo, updatedDetails: object, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('todos')
        .update(updatedDetails)
        .eq('id', todoId);

    if (error) {
        console.error('Error editing todo:', error.message);
        throw error;
    }
}

export async function editEvent(eventId: string, updatedDetails: object, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('events')
        .update(updatedDetails)
        .eq('id', eventId);

    if (error) {
        console.error('Error editing event:', error.message);
        throw error;
    }
}