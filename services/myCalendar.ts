import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../databasetypes';
import * as types from './utils.js';



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

export async function createPersonalTodo(todoDetails: { person_id: string, title: string, deadline: string, priority: number, end_repeat: string, repeat_every: types.RepeatPeriod, weekdays: number[], habit: boolean, backlog: boolean, soft_deadline_of?: string, notes?: string}, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
    const { data, error } = await supabaseClient
        .from('todo')
        .insert(todoDetails);

    if (error) {
        console.error('Error creating todo:', error.message);
        throw error;
    }

    if (!data || !data[0]) {
        throw new Error('Failed to create subtodo: No data returned.');
    }
    return data[0] as types.TodoDetails;
}

export async function createFriendTodo(todoDetails: { person_id: string, title: string, deadline: string, priority: number, end_repeat: string, repeat_every: types.RepeatPeriod, weekdays: number[], habit: boolean, backlog: boolean, soft_deadline_of?: string, notes?: string}, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
    const { data, error } = await supabaseClient
        .from('todo')
        .insert(todoDetails);

    if (error) {
        console.error('Error creating friend todo:', error.message);
        throw error;
    }

    if (!data || !data[0]) {
        throw new Error('Failed to create subtodo: No data returned.');
    }
    return data[0] as types.TodoDetails;
}

export async function createGroupTodo(todoDetails: { group_id: string, title: string, all_members_must_complete: boolean, deadline: string, priority: number, end_repeat: string, repeat_every: types.RepeatPeriod, weekdays: number[], habit: boolean, backlog: boolean, soft_deadline_of?: string, notes?: string}, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
    const { data, error } = await supabaseClient
        .from('todo')
        .insert(todoDetails);

    if (error) {
        console.error('Error creating friend todo:', error.message);
        throw error;
    }

    if (!data || !data[0]) {
        throw new Error('Failed to create subtodo: No data returned.');
    }
    return data[0] as types.TodoDetails;
}

export async function createPersonalOrGroupEvent(eventDetails: {group_id?: string; title: string; start_date: string; end_date: string; end_repeat: string; event_color: string; is_all_day: boolean; location: string | null; repeat: types.RepeatPeriod; weekdays: number[]}, supabaseClient: SupabaseClient<Database>): Promise<types.EventDetails> {
    const { data, error } = await supabaseClient
        .from('event')
        .insert({...eventDetails,  description: ''});

    if (error) {
        console.error('Error creating event:', error.message);
        throw error;
    }

    if (!data || !data[0]) {
        throw new Error('Failed to create subtodo: No data returned.');
    }
    return data[0] as types.EventDetails;
}

export async function inviteFriendtoPerosonalEvent(eventDetails: { title: string; description: string; date: string; user: types.User }, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
    const { error } = await supabaseClient
        .from('event')
        .insert(eventDetails);

    if (error) {
        console.error('Error creating event:', error.message);
        throw error;
    }
}

export async function deleteTodoAll(todoId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('todo')
        .delete()
        .eq('id', todoId);

    if (error) {
        console.error('Error deleting todo:', error.message);
        throw error;
    }
}

export async function deleteTodoMyself(todoId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('people_to_deleted_group_todos')
        .insert({todo_id: todoId})

    if (error) {
        console.error('Error deleting todo myself:', error.message);
        throw error;
    }
}

export async function deleteEventAll(eventId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('event')
        .delete()
        .eq('id', eventId);

    if (error) {
        console.error('Error deleting event:', error.message);
        throw error;
    }
}

export async function deleteEventMyself(eventId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('people_to_deleted_group_events')
        .insert({event_id: eventId})

    if (error) {
        console.error('Error deleting todo myself:', error.message);
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