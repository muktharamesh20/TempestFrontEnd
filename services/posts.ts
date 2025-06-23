import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../databasetypes';
import { getUserId } from './api';
import * as types from './utils';



export async function likePost(postId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('people_to_liked')
        .upsert({ post_id: postId});

    // if (error) {
    //     console.error('Error liking post:', error.message);
    //     throw error;
    // }
}

export async function unlikePost(postId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('people_to_liked')
        .delete()
        .eq('post_id', postId)
        .eq('person_id', await getUserId().then((value) => value[0]));

    // if (error) {
    //     console.error('Error unliking post:', error.message);
    //     throw error;
    // }
}

export async function getAllLikedPosts(user: types.User, databaseClient: SupabaseClient<Database>): Promise<types.Album> {
    const { data, error } = await databaseClient
        .from('people_to_liked')
        .select('post_id, post!post_id (*)')
        .eq('user_id', user.user_id);

    if (error) {
        console.error('Error fetching liked posts:', error.message);
        throw error;
    }

    return {posts: await types.createPostTypeWithData(data.map(record => record.post)), album_name: 'Liked'};
}

export async function getAllLikes(
    postId: string,
    databaseClient: SupabaseClient<Database>
  ): Promise<types.Like[]> {
    const { data, error } = await databaseClient
      .from('people_to_liked')
      .select('person_id, usersettings!person_id (username)')
      .eq('post_id', postId);
  
    if (error) {
      console.error('Error fetching likes:', error.message);
      throw error;
    }
    console.log(data)
    // Await all avatars because createAvatarLink returns Promise<string>
    const likes = data.map((value) => {return ({
        id: value.person_id,
        username: value.usersettings.username ?? '',
        avatar: value.person_id
      })});
    console.log(likes)
  
    return likes;
  }

  export async function getAllComments(postId: string, databaseClient: SupabaseClient<Database>): 
  Promise<types.Comment[]> {
    const {data, error} = await databaseClient
        .from('post_to_comment')
        .select('id, person_id, usersettings!person_id (username), comment_content, reply_to, created_at')
        .eq('post_id', postId);

    if (error) {
        console.error('Error fetching comments:', error.message);
        throw error;
    }

    const comments = await Promise.all(
        data.map((value) => ({
            id:value.id,
            author:value.usersettings.username ?? '',
            authorId:value.person_id,
            content:value.comment_content,
            avatar:value.id,
            parentId:value.reply_to || undefined,
            timeCreated:new Date(value.created_at)
        }))
    )

    return comments
        
  }
  
  

export async function savePost(postId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('people_to_saved')
        .upsert({ post_id: postId});

    if (error) {
        console.error('Error saving post:', error.message);
        throw error;
    }
}

export async function unSavePost(postId: string, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('people_to_saved')
        .delete()
        .eq('post_id', postId)
        .eq('person_id', (await getUserId())[0] );

    if (error) {
        console.error('Error unsaving post:', error.message);
        throw error;
    }
}

export async function getAllSavedPosts(user: types.User, databaseClient: SupabaseClient<Database>): Promise<types.Album> {
    const { data, error } = await databaseClient
        .from('people_to_saved')
        .select('post_id, post!post_id (*)')
        .eq('user_id', user.user_id);

    if (error) {
        console.error('Error fetching saved posts:', error.message);
        throw error;
    }

    return {posts: await types.createPostTypeWithData(data.map(record => record.post)), album_name: 'Saved'};
}

/**
 * Marks a post as inspired by incrementing the inspired_by_count in the database.
 * 
 * @param post the post to mark as inspired
 * @param databaseClient the Supabase client to use for the database operations
 */
export async function inspiredByPost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<void> {
    const {data, error} = await databaseClient.rpc('increment_inspired_by_count', {p_post_id: post.id});

    if (error) {
        console.error('Error marking post as inspired:', error.message);
        throw error;
    }
}

/**
 * This function creates a new post in the database.
 * 
 * @param postDetails the details of the post to create, including title, content, and authorId
 * @param databaseClient the Supabase client to use for the database operations
 */
export async function createPost(postDetails: { description: string | null; event_id: string | null; owner_id: string; title: string; todo_id: string | null}, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('post')
        .insert({ ...postDetails, imageLink: "doesn't matter" });

    if (error) {
        console.error('Error creating post:', error.message);
        throw error;
    }
}

/**
 * Deletes a post from the database.
 * 
 * @param post the post to delete
 * @param databaseClient the Supabase client to use for the database operations
 */
export async function deletePost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('post')
        .delete()
        .eq('id', post.id);

    if (error) {
        console.error('Error deleting post:', error.message);
        throw error;
    }
}

/**
 *  Archives a post. Requires that you own the post, and it's not already archived
 * 
 * @param post the post to archive
 * @param databaseClient the Supabase client to use for the database operations
 */
export async function archivePost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<types.Post> {
    const { data, error } = await databaseClient
        .from('post_to_viewership_tags')
        .insert({ post_id: post.id, vt_id: '3f60393f-ac00-475b-a27c-4f906ae5497f' }).select('post_id, post!post_id (*)');

    if (error) {
        console.error('Error archiving post:', error.message);
        throw error;
    }

    return post;
}

/**
 * Unarchives a post. Requires that you own the post, and it's already archived
 * 
 * @param post the post to unarchive
 * @param databaseClient the Supabase client to use for the database operations
 * @returns the unarchived post
 */
export async function unarchivePost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<types.Post> {
    const { data, error } = await databaseClient
    .from('post_to_viewership_tags')
    .delete()
    .eq('post_id', post.id)
    .eq('vt_id', '3f60393f-ac00-475b-a27c-4f906ae5497f')
    .select('post_id, post!post_id (*)');

    if (error) {
        console.error('Error archiving post:', error.message);
        throw error;
    }

    return post;
}

/**
 * the function retrieves the viewership tags of a post.  Requires that you own the post.
 * 
 * @param post the post to get the viewership tags for
 * @param databaseClient the Supabase client to use for the database operations
 * @returns the viewership tags of the post
 */
export async function getViewershipTagsOfMyPost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<types.ViewershipTag[]> {
    const { data, error } = await databaseClient
        .from('post_to_viewership_tags')
        .select('vt_id')
        .eq('post_id', post.id);

    if (error) {
        console.error('Error fetching viewership tags of post:', error.message);
        throw error;
    }

    const data2 = data;
    let result: types.ViewershipTag[] = [];

    if (data) {
        const { data, error } = await databaseClient
            .from('viewership_tags')
            .select('*')
            .in('id', data2.map(record => record.vt_id));

        if (error) {
            console.error('Error fetching viewership tags:', error.message);
            throw error;
        }

        result = await Promise.all(data?.map(record => types.createViewershipTagTypeWithData(record)) || []);
    }

    return result;
}

/**
 * Creates a viewership tag in the database and adds the specified users to it.
 * 
 * @param me the user creating the viewership tag
 * @param tag_name the name of the viewership tag to create
 * @param color the color of the viewership tag to create, in hex format (e.g., '#FF5733')
 * @param users_to_add the users to add to the viewership tag
 * @param databaseClient the database client to use for the database operations
 * @returns the viewership tag that was created
 */
export async function createViewershipTag(me: types.User, tag_name: string, color: string, users_to_add: types.User[], databaseClient: SupabaseClient<Database>): Promise<types.ViewershipTag> {
    const { data, error } = await databaseClient
        .from('viewership_tags')
        .insert({ owner_id: me.user_id, tag_color: color, tag_name: tag_name })
        .select('*')
        .single();

    if (error) {
        console.error('Error creating viewership tag:', error.message);
        throw error;
    }
    const vt = await types.createViewershipTagTypeWithData(data);
    changeViewershipTagMembers(me, vt, users_to_add, databaseClient);

    return vt;
}

/**
 * This function deletes a viewership tag from the database.
 * 
 * @param vt the viewership tag to delete
 * @param databaseClient the database client to use for the database operations
 */
export async function deleteViewershipTag(vt: types.ViewershipTag, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('viewership_tags')
        .delete()
        .eq('id', vt.id);

    if (error) {
        console.error('Error deleting viewership tag:', error.message);
        throw error;
    }
}

/**
 * Changes the members of the viewership tag.
 * 
 * @param me the user making the changes
 * @param vt the viewership tag to change members of
 * @param newUsers the new list of users for the viewership tag
 * @param databaseClient the database client to use for the database operations
 */
export async function changeViewershipTagMembers(
    me: types.User,
    vt: types.ViewershipTag,
    newUsers: types.User[],
    databaseClient: SupabaseClient<Database>
): Promise<void> {
    // Extract user IDs from the provided list
    const newUserIds = newUsers.map(user => user.user_id);

    // Upsert the new users for the viewership tag
    const { error: insertError } = await databaseClient
        .from('people_to_viewership_tag')
        .upsert(newUsers.map(user => ({
            viewership_tag: vt.id,
            person_associated: user.user_id,
            owner_id: me.user_id
        })));

    if (insertError) {
        console.error('Error inserting/updating users in viewership tag:', insertError.message);
        throw insertError;
    }

    // Delete users that are not in the provided list
    const { error: deleteError } = await databaseClient
        .from('people_to_viewership_tag')
        .delete()
        .eq('vt_id', vt.id)
        .eq('owner_id', me.user_id)
        .not('person_associated', 'in', newUserIds); // Delete rows where person_associated is NOT in the list

    if (deleteError) {
        console.error('Error deleting users from viewership tag:', deleteError.message);
        throw deleteError;
    }
}

/**
 * Gets all of the user's viewership tags.
 * 
 * @param databaseClient the database client to use for the database operations
 * @returns an array of viewership tags
 */
export async function getAllViewershipTags(databaseClient: SupabaseClient<Database>): Promise<types.ViewershipTag[]> {
    const { data, error } = await databaseClient
        .from('viewership_tags')
        .select('*');

    if (error) {
        console.error('Error fetching viewership tags:', error.message);
        throw error;
    }

    return await Promise.all(data.map(record => types.createViewershipTagTypeWithData(record)));
}

/**
 * Changes the viewership tags of a post.
 * 
 * @param post the post to change the viewership tags of
 * @param newViewershipTags the new viewership tags to set for the post
 * @param databaseClient the database client to use for the database operations
 */
export async function changeVTsOfPost(post: types.Post, newViewershipTags: types.ViewershipTag[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const viewershipTagIds = newViewershipTags.map(tag => tag.id);

    const { error: insertError } = await databaseClient
        .from('post_to_viewership_tags')
        .upsert(newViewershipTags.map(tag => ({ post_id: post.id, vt_id: tag.id })));

    if (insertError) {
        console.error('Error inserting/updating viewership tags:', insertError.message);
        throw insertError;
    }

    const { error: deleteError } = await databaseClient
        .from('post_to_viewership_tags')
        .delete()
        .eq('post_id', post.id)
        .not('vt_id', 'in', viewershipTagIds); 

    if (deleteError) {
        console.error('Error deleting viewership tags:', deleteError.message);
        throw deleteError;
    }
}

/**
 * Changes the categories of a post.
 * 
 * @param post the post to change the categories of
 * @param categories the new categories to set for the post
 * @param databaseClient the database client to use for the database operations
 */
export async function changeCategoriesOfPost(post: types.Post, categories: types.Category[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error: insertError } = await databaseClient
        .from('post_to_category')
        .upsert(categories.map(category => ({ category_id: category.id, post_id: post.id })));

    if (insertError) {
        console.error('Error changing categories:', insertError.message);
        throw insertError;
    }

    const { error: deleteError } = await databaseClient
        .from('post_to_category')
        .delete()
        .eq('post_id', post.id)
        .not('category_id','in', categories.map(category => category.id));

    if (deleteError) {
        console.error('Error changing categories:', deleteError.message);
        throw deleteError;
    }
}

/**
 * Changes the categories of a todo.
 * 
 * @param todo the todo to change the categories of
 * @param categories the new categories to set for the todo
 * @param databaseClient the database client to use for the database operations
 */
export async function changeCategoriesOfTodo(todo: types.Todo, categories: types.Category[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error: insertError } = await databaseClient
        .from('todo_to_category')
        .upsert(categories.map(category => ({ category_id: category.id, todo_id: todo.todoID })));

    if (insertError) {
        console.error('Error changing categories:', insertError.message);
        throw insertError;
    }

    const { error: deleteError } = await databaseClient
        .from('todo_to_category')
        .delete()
        .eq('todo_id', todo.todoID)
        .not('category_id','in', categories.map(category => category.id));

    if (deleteError) {
        console.error('Error changing categories:', deleteError.message);
        throw deleteError;
    }
}

/**
 * Changes the categories displayed in a user's profile.
 * 
 * @param user the user whose profile categories are being changed
 * @param categories the categories to display in the user's profile
 * @param databaseClient the database client to use for the database operations
 */
export async function changeDisplayedCategoriesInProfile(user: types.User, categories: types.Category[], databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error: insertError } = await databaseClient
        .from('calendar_category_tags')
        .update({ appear_on_profile: true })
        .eq('id', user.user_id)
        .in ('category_id', categories.map(category => category.id));

    if (insertError) {
        console.error('Error changing displayed categories in profile:', insertError.message);
        throw insertError;
    }

    const { error: deletError } = await databaseClient
        .from('calendar_category_tags')
        .update({ appear_on_profile: false })
        .eq('id', user.user_id)
        .not('category_id', 'in', categories.map(category => category.id));

    if (deletError) {
        console.error('Error changing displayed categories in profile:', deletError.message);
        throw deletError;
    }
} 

/**
 * Returns 15 posts the user has not viewed yet.  Will return posts that the user has already viewed if there are not enough new posts.
 * 
 * @param user the user for whom the feed is being requested
 * @param viewed_posts the posts that have been viewed in the last feed
 * @param databaseClient the database client to use for the database operations
 */
export async function getFeed(user: types.User, viewed_posts: types.Post[], databaseClient: SupabaseClient<Database>): Promise<types.Feed> {
    //when a new feed is requested, mark anything viewed from the last feed as viewed
    const { error: markViewedError } = await databaseClient
        .from('people_to_viewed')
        .upsert(viewed_posts.map(post => ({ post_id: post.id, person_id: user.user_id })));

    const { data, error } = await databaseClient
    .rpc('get_feed');

    if (error) {
        console.error('Error fetching feed:', error.message);
        throw error;
    }
    throw new Error('unimplemented');
    //return {posts: await types.createPostTypeWithData(data)};
}

/**
 * Returns 15 posts the user has not viewed yet.  Will return posts that the user has already viewed if there are not enough new posts.
 * 
 * @param user the user for whom the feed is being requested
 * @param viewed_posts the posts that have been viewed in the last feed
 * @param databaseClient the database client to use for the database operations
 */
export async function getFeedNew(databaseClient: SupabaseClient<Database>): Promise<types.Feed> {
    //when a new feed is requested, mark anything viewed from the last feed as viewed

    const { data, error } = await databaseClient
    .rpc('get_feed');

    if (error) {
        console.error('Error fetching feed:', error.message);
        throw error;
    }

    return {posts: await types.createPostDetailsTypeWithData(data)};
}

export async function addCommentToPost(postId: string, commentDetails: types.Comment, databaseClient: SupabaseClient<Database>): Promise<void> {
    // const { error } = await databaseClient
    //     .from('comments')
    //     .insert({ post_id: post.id, ...commentDetails });

    // if (error) {
    //     console.error('Error adding comment to post:', error.message);
    //     throw error;
    // }
    const {error} = await databaseClient
            .from('post_to_comment')
            .insert({id: commentDetails.id, comment_content:commentDetails.content, post_id: postId, person_id:commentDetails.authorId, reply_to: commentDetails.parentId})

   if (error){
        console.error('Error adding comment to post:', error.message);
        throw error;
    }
}

export async function replyToComment(commentId: string, replyDetails: { content: string; authorId: string }, databaseClient: SupabaseClient<Database>): Promise<void> {
    // const { error } = await databaseClient
    //     .from('comment_replies')
    //     .insert({ comment_id: commentId, ...replyDetails });

    // if (error) {
    //     console.error('Error replying to comment:', error.message);
    //     throw error;
    // }
    throw new Error('unimplemented');
}

/**
 * Highlights a post so it appears prominently in the user's profile.
 * 
 * @param post the post to highlight
 * @param databaseClient the database client to use for the database operations
 */
export async function highlightPost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('post')
        .update({ highlighted_by_owner: true })
        .eq('id', post.id);

    if (error) {
        console.error('Error highlighting post:', error.message);
        throw error;
    }
}

/**
 * Unhighlights a post.
 * 
 * @param post the post to unhighlight
 * @param databaseClient the Supabase client to use for the database operations
 */
export async function unHighlightPost(post: types.Post, databaseClient: SupabaseClient<Database>): Promise<void> {
    const { error } = await databaseClient
        .from('post')
        .update({ highlighted_by_owner: false })
        .eq('id', post.id);

    if (error) {
        console.error('Error highlighting post:', error.message);
        throw error;
    }
}