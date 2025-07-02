import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../databasetypes';
import * as types from './utils.js';

export async function createFollowerRequest(follower_id: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('follow_request')
        .insert({ followed_id: follower_id });
    if (error) {
        console.error('Error creating follower request:', error.message);
        throw error;
    }

    console.log('Follower request created:', data);
}

export async function acceptFollowerRequest(requester_id: string, my_id:string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .insert({ follower_id: requester_id, followed_id: my_id });

    if (error) {
        console.error('Error accepting follower request:', error.message);
        throw error;
    }

    console.log('Follower request accepted:', data);
}

export async function rejectOrRevokeFollowerRequest(requester_id: string, followed_id:string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('follow_request')
        .delete()
        .match({ requester: requester_id, followed_id: followed_id });

    if (error) {
        console.error('Error rejecting follower request:', error.message);
        throw error;
    }

    console.log('Follower request rejected:', data);
}

export async function unFollow(myId: string, following: string, supabaseClient: SupabaseClient<Database>) {
    const {data, error} = await supabaseClient
        .from('people_to_following')
        .delete()
        .match({follower_id: myId, followed_id: following})

    if (error) {
        console.error('Error unfollowing user:', error.message);
        throw error;
    }

    console.log('unfollowed person')
}

export async function removeFollower(myId: string, following: string, supabaseClient: SupabaseClient<Database>) {
    const {data, error} = await supabaseClient
        .from('people_to_following')
        .delete()
        .match({follower_id: following, followed_id: myId})

    if (error) {
        console.error('Error unfollowing user:', error.message);
        throw error;
    }

    console.log('unfollowed person')
}

/**
 * This function retrieves all the people that a user follows.
 * 
 * @param userId the user to check
 * @param supabaseClient the database client to use
 * @returns All the poeple that userId follows, with their id and username.
 */
export async function getFollowsThesePeople( userId: string, supabaseClient: SupabaseClient<Database>): Promise<{id: string, username:string}[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('followed_id, usersettings!followed_id (username)')
        .eq('follower_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return data
        .filter((following) => following.usersettings?.username !== null)
        .map((following) => ({
            id: following.followed_id,
            username: following.usersettings!.username as string
        }));
}

/**
 * This function retrieves all the people that follow a user.
 * 
 * @param userId the user to check
 * @param supabaseClient the database client to use
 * @returns All the people that follow userId, with their id and username.
 */
export async function getFollowedByThesePeople(userId: string, supabaseClient: SupabaseClient<Database>):  Promise<{id: string, username:string}[]> {
    const { data, error } = await supabaseClient
        .from('people_to_following')
        .select('follower_id, usersettings!follower_id (username)')
        .eq('followed_id', userId);

    if (error) {
        console.error('Error fetching followers:', error.message);
        throw error;
    }

    return  data
    .filter((following) => following.usersettings?.username !== null)
    .map((following) => ({
        id: following.follower_id,
        username: following.usersettings!.username as string
    }));
}

/**
 * Gets all messages between two users.
 * 
 * @param me the user who is requesting the messages
 * @param other the other user to get messages with
 * @param supabaseClient the Supabase client to use for the database operations
 * @returns the messages between the two users, sorted by creation date.
 */
export async function getAllMessagesBetween(me: types.User, other: types.User, supabaseClient: SupabaseClient<Database>): Promise<types.FrinedChat> {
    const { data, error } = await supabaseClient
        .from('messages')
        .select('*')
            .eq('receiver_id', me.user_id )
            .eq('sender_id', other.user_id);
    
    const { data: reverseMessages, error: reverseError } = await supabaseClient
        .from('messages')
        .select('*')
        .eq('receiver_id', other.user_id)
        .eq('sender_id', me.user_id);

    if (reverseError) {
        console.error('Error fetching reverse messages:', reverseError.message);
        throw reverseError;
    }

    const combinedMessages = [...(data || []), ...(reverseMessages || [])];

    if (error) {
        console.error('Error fetching group messages:', error.message);
        throw error;
    }
    throw new Error('unimplemented')
    //const result = (await Promise.all(combinedMessages.map((message) => createMessageTypeWithData(message)))).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    //return {
       // otherUser: other,
       // messages: result
    //}
}

/**
 * Sends a message from one user to another.
 * 
 * @param content the content of the message to post
 * @param sender the user who is sending the message
 * @param reciever the user who is receiving the message
 * @param supabaseClient the Supabase client to use for the database operations
 * @returns the message that was sent, as a Message type.
 */
export async function sendMessage(content: string, sender: types.User, reciever: types.User, supabaseClient: SupabaseClient<Database>): Promise<types.Message> {
    const { data, error } = await supabaseClient
        .from('messages')
        .insert({ content, messenger_id: sender.user_id, receiver_id: reciever.user_id, receiver_deleted: false, sender_deleted: false })
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error posting message:', error.message);
        throw error;
    }
    throw new Error('unimplemented')
    //return createMessageTypeWithData(data[0]);
}

/**
 * Deletes a message for everyone in the chat.
 * 
 * @param message the message to delete for everyone
 * @param supabaseClient the Supabase client to use for the database operations
 */
export async function deleteMessageForEveryone(message: types.Message, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('messages')
        .delete()
        .eq('id', message.id);

    if (error) {
        console.error('Error deleting message:', error.message);
        throw error;
    }
}

/**
 * The function deletes a message for the user who is deleting it.
 * 
 * @param message the message to delete for the user
 * @param supabaseClient the Supabase client to use for the database operations
 */
export async function deleteMessageForMe(message: types.Message, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('messages')
        .update({ sender_deleted: true })
        .eq('id', message.id);

    if (error) {
        console.error('Error deleting message for me:', error.message);
        throw error;
    }
}


export async function getTaggedPostsFrom(userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('post_to_tagged_people')
        .select('post_id, posts!post_id (*)')
        .eq('person_id', userId);

    if (error) {
        console.error('Error fetching tagged posts:', error.message);
        throw error;
    }

    const postIds = data.map(tag => tag.post_id);
    throw new Error('unimplemented')
    //return getBulkPostInfoById(postIds, supabaseClient);
}

export async function toggleCloseFrined(myId: string, userId: string, isCloseFriend: boolean, supabaseClient: SupabaseClient<Database>): Promise<void> {
    //throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
    if (isCloseFriend) {
        const { error } = await supabaseClient
          .from('people_to_close_friends')
          .insert({ person_id: myId, close_friend: userId });
      
        if (error) {
          console.error('Error adding close friend:', error.message);
        }
      } else {
        const { error } = await supabaseClient
          .from('people_to_close_friends')
          .delete()
          .eq('person_id', myId)
          .eq('close_friend', userId);
      
        if (error) {
          console.error('Error removing close friend:', error.message);
        }
      }
      
}

/**
 * This function retrieves all close friends of a user.
 * 
 * @param myUser the user who is requesting the close friends
 * @param supabaseClient the Supabase client to use for the database operations
 * @returns the list of close friends for the user, as an array of User types.
 */
export async function getAllCloseFriends(myUser: types.User, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('people_to_close_friends')
        .select('close_friend, usersettings!close_friend (*)')
        .eq('person_id', myUser.user_id);

    if (error) {
        console.error('Error fetching close friends:', error.message);
        throw error;
    }

    //return await Promise.all(data.map((friend) => types.createUserTypeWithData(friend.usersettings)));
}

// export async function viewCalendarOf(userId: string, supabaseClient: SupabaseClient<Database>): Calendar {
//     throw new Error('Function not implemented.'); // This function is not fully implemented yet, so we throw an error for now.
//     const { data, error } = await supabaseClient
//         .from('calendar_events')
//         .select('*')
//         .eq('user_id', userId);

//     if (error) {
//         console.error('Error fetching calendar events:', error.message);
//         throw error;
//     }

//     return data.map(event => ({
//         id: event.id,
//         title: event.title,
//         start: new Date(event.start),
//         end: new Date(event.end)
//     }));
// }