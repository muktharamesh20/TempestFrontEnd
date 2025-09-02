import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../databasetypes';
import * as types from './utils.js';



export async function getMyCalendar(user: types.User, supabaseClient: SupabaseClient<Database>, from: Date, to: Date): Promise<any[]> {
    throw new Error('Not implemented yet');
}

export async function getMyEvents(
    userId: string,
    supabaseClient: SupabaseClient<Database>
  ): Promise<types.EventDetails[]> {
  
    // First, get the groups the user belongs to
    const { data: groupsData, error: groupsError } = await supabaseClient
      .from('people_to_group')
      .select('group_id')
      .eq('person_id', userId);
  
    if (groupsError) throw groupsError;
  
    const groupIds = groupsData?.map(g => g.group_id) || [];
  
    // Then fetch events
    const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .or(`owner_id.eq.${userId},group_id.in.(${groupIds.join(',')})`)
    
    console.log(error, data, "hola")
    if (error) throw error;
  
    return data as types.EventDetails[];
  }
  

export async function createPersonalTodo(todoDetails: { person_id: string, title: string, deadline: string, priority: number, end_repeat: string, repeat_every: types.RepeatPeriod, weekdays: number[], habit: boolean, backlog: boolean,location: string, privacy: number}, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
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

export async function createFriendTodo(todoDetails: { person_id: string, title: string, deadline: string, priority: number, end_repeat: string, repeat_every: types.RepeatPeriod, weekdays: number[], habit: boolean, backlog: boolean, location: string, privacy: number}, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
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

export async function createGroupTodo(todoDetails: { group_id: string, title: string, all_members_must_complete: boolean, deadline: string, priority: number, end_repeat: string, repeat_every: types.RepeatPeriod, weekdays: number[], habit: boolean, backlog: boolean, location: string}, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
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
        .from('events')
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

/**
 * It appears in friend's calendar, and they can choose to accept or decline... they do not have permission to edit the event
 * If they delete, it only deletes from their calendar
 * If they accept, it shows up in their calendar and they show as attending in the event details
 * 
 * @param eventDetails 
 * @param supabaseClient 
 */
export async function inviteFriendtoPerosonalEvent(eventDetails: { title: string; description: string; date: string; user: types.User }, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
    const { error } = await supabaseClient
        .from('events')
        .insert(eventDetails);

    if (error) {
        console.error('Error creating event:', error.message);
        throw error;
    }
}

/**
 * It appears in group's calendar, and specific memberers are invited to RSVP
 * If they accept or decline, it doesn't affect their calendar... it just shows up as accepted or declined in the event details
 * 
 * Potentially, they all appear in the group calendar, but only those who accepted appear in their personal calendar
 * OR, it appears in the group calendar, and whovever created the event can automatically add it to a certain group of people's private calendar without their consent, unless they click not going
 * 
 * @param eventDetails 
 * @param supabaseClient 
 */
export async function inviteGroupMembersToRSVPForEvent(eventDetails: { title: string; description: string; date: string; user: types.User }, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
    const { error } = await supabaseClient
        .from('evenst')
        .insert(eventDetails);

    if (error) {
        console.error('Error creating event:', error.message);
        throw error;
    }
}

/**
 * Only based on what you can currently view in their calendar (i.e. if they have private events, you can't see if they are busy during that time)
 * 
 * @param startdate 
 * @param enddate 
 * @param friends 
 * @param supabaseClient 
 */
export async function findWhichFriendsAreBusy(startdate: string, enddate: string, friends: types.User[], supabaseClient: SupabaseClient<Database>): Promise<{user: types.User; busy: boolean}[]> {
    throw new Error('Not implemented yet');
}

/**
 * See inviteGroupMembersToRSVPForEvent and inviteFriendtoPerosonalEvent
 * 
 * @param eventDetails 
 * @param supabaseClient 
 */
export async function acceptInviteToEvent(eventDetails: { title: string; description: string; date: string; user: types.User }, supabaseClient: SupabaseClient<Database>): Promise<types.TodoDetails> {
    const { error } = await supabaseClient
        .from('events')
        .insert(eventDetails);

    if (error) {
        console.error('Error creating event:', error.message);
        throw error;
    }
}

///

export async function deletGroupTodoAll(todoId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('todo')
        .delete()
        .eq('id', todoId);

    if (error) {
        console.error('Error deleting todo:', error.message);
        throw error;
    }
}

export async function deleteGroupTodo(todoId: string, taget: "myself" | "all", supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('people_to_deleted_group_todos')
        .insert({todo_id: todoId})

    if (error) {
        console.error('Error deleting todo myself:', error.message);
        throw error;
    }
}

export async function deleteGroupEvent(eventId: string, taget: "myself" | "all", supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('people_to_deleted_group_events')
        .insert({event_id: eventId})

    if (error) {
        console.error('Error deleting todo myself:', error.message);
        throw error;
    }
}

export async function getKanban(user: types.User, supabaseClient: SupabaseClient<Database>): Promise<any[]> {
    throw new Error('Not implemented yet');
}

export async function deletePersonalEvent(eventId:string, target: 'today' | 'future' | 'all', supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('target', target);

    if (error) {
        console.error('Error deleting personal event:', error.message);
        throw error;
    }
}

export async function deletePersonalTodo(todoId: string, target: 'today' | 'future' | 'all', supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('todo')
        .delete()
        .eq('id', todoId)
        .eq('target', target);

    if (error) {
        console.error('Error deleting personal todo:', error.message);
        throw error;
    }
}


import { updatePersonalTodoFile } from './updatePersonalTodo';


export async function updatePersonalTodo(
  todoId: string,
  utc_start_of_day: string,
  target: 'today' | 'future' | 'all',
  previous: types.TodoDetails,
  updates: Partial<types.ModifiedTodoDetails>,
  supabaseClient: SupabaseClient<Database>,
  newCategories: types.CategoryId[]
): Promise<void> {
  updatePersonalTodoFile(todoId, utc_start_of_day, target, previous, updates, supabaseClient, newCategories);
}

/** does not update categories, privacy
 * 
 * */
export async function updatePersonalSubTodo(todoId: string, target: 'today' | 'future' | 'all', updates: {subtodoDeleteId: string, subtodoToAdd: types.SubtodoDetails}[], supabaseClient: SupabaseClient<Database>): Promise<void> {
    if (target === 'today') {
        
    } else if (target === 'future') {

    } else if (target === 'all') {

    } else {
        throw new Error('Invalid target specified for updating personal subtodo');
    }
}

export async function updatePersonalEvent(eventId: string, target: 'today' | 'future' | 'all', updates: Partial<types.EventDetails>, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('events')
        .update(updates)
        .eq('id', eventId);

    if (error) {
        console.error('Error updating personal event:', error.message);
        throw error;
    }
}



/////////////////////////Helper Functions for updating todos//////////////////////////////////
async function updateRepititionPersonalTodo(todoId: string, target: 'today' | 'future' | 'all', previous: types.TodoDetails, updates: Partial<types.TodoDetails>, supabaseClient: SupabaseClient<Database>): Promise<void> {
    // This function should handle the logic for updating the repetition of a personal todo
    // It may involve creating new todos based on the repetition settings
    throw new Error('Not implemented yet');
}

async function updatePrivacyPersonalTodo(todoId: string, target: 'today' | 'future' | 'all', previous: types.TodoDetails, updates: Partial<types.TodoDetails>, supabaseClient: SupabaseClient<Database>): Promise<void> {
    // This function should handle the logic for updating the privacy of a personal todo
    // It may involve changing the visibility settings in the database
    throw new Error('Not implemented yet');
}

async function updateCategoriesPersonalTodo(todoId: string, target: 'today' | 'future' | 'all', previous: types.TodoDetails, updates: Partial<types.TodoDetails>, supabaseClient: SupabaseClient<Database>): Promise<void> {
    // This function should handle the logic for updating the categories of a personal todo
    // It may involve changing the category associations in the database
    throw new Error('Not implemented yet');
}

async function updateOtherPersonalTodo(todoId: string, target: 'today' | 'future' | 'all', previous: types.TodoDetails, updates: Partial<types.TodoDetails>, supabaseClient: SupabaseClient<Database>): Promise<void> {
    // This function should handle any other updates that are not covered by the specific functions above
    // It may involve updating other fields in the database
    throw new Error('Not implemented yet');
}

/////////////////////////////Completing Todos and Events////////////////////////////////////
export async function completeAllMembersTodo(todoId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('todo')
        .update({ completed: true })
        .eq('id', todoId);

    if (error) {
        console.error('Error completing all members todo:', error.message);
        throw error;
    }
}

export async function completeGroupTodo(todoId: string, personId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('people_completed_group_todos')
        .insert({ todo_id: todoId, person_id: personId });

    if (error) {
        console.error('Error completing group todo:', error.message);
        throw error;
    }
}

export async function completePersonalTodo(todoId: string, personId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('people_completed_personal_todos')
        .insert({ todo_id: todoId, person_id: personId });

    if (error) {
        console.error('Error completing personal todo:', error.message);
        throw error;
    }
}

export async function completeGroupSubtodo(todoId: string, personId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('people_completed_group_subtodos')
        .insert({ todo_id: todoId, person_id: personId });

    if (error) {
        console.error('Error completing group subtodo:', error.message);
        throw error;
    }
}

export async function completePersonalSubtodo(todoId: string, personId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabaseClient
        .from('people_completed_personal_subtodos')
        .insert({ todo_id: todoId, person_id: personId });

    if (error) {
        console.error('Error completing personal subtodo:', error.message);
        throw error;
    }
}
