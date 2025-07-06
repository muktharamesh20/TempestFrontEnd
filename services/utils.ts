import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "../databasetypes";
import { getUserId } from "./api";

export type Post = {
    image: Image, caption: Text, categories: Category, ownerId: UserId, id: PostId, createdAt: Date, likeCount: number
        , likedByMe: boolean, inspiredCount: number, comments: MainComment[], linkedObject: Event | Todo
};

export type Like = {
    id: string;
    username: string;
    avatar: string;
}
export type ModalPersonType = {
    id: string;
    username: string;
}
export type Comment = {
    id: string;
    author: string;
    authorId: string;
    content: string;
    avatar: string;
    parentId?: string;
    timeCreated: Date; // Unix timestamp in milliseconds
}

export type postDetails = {
    postId: string;
    personID: string;
    username: string;
    thoughts: string;
    taskOrEventName: string;
    myPost: boolean;
    taskID?: string;
    eventID?: string;
    hashtags?: string[];
    timeCreated: Date;
    likes: number; // New prop for likes
    comments: number; // New prop for comments
    alreadyLiked: boolean;
    alreadySaved: boolean;
    archived: boolean;

}
export type MainComment = { id: CommentId, owner: User, content: Text, createdAt: Date, replies: ReplyComment[], deleted: boolean };
export type ReplyComment = { id: CommentId, owner: User, content: Text, createdAt: Date, replyTo: MainComment };
export type Calendar = { forNow: null }
export type Group = { forNow: null, group_id: GroupId, onlyAdminsInvite: boolean, onlyAdminsAssignTodos: boolean }
export type UserHomePage = { id: CategoryId, CategoryName: string, orderNum: number, posts: Post[], tags: Post[], followers: UserList, following: UserList, profile: User, mutual_groups: GroupList };
export type GroupHomePage = { CategoryName: string, orderNum: number, posts: Post[], tags: Post[], members: UserList, profile: User };
export type Feed = { posts: postDetails[] }
export type Album = { posts: Post[], album_name: 'Liked' | 'Saved' }
export type Message = { id: string, content: Text, createdAt: Date, senderId: string }
export type GroupChat = { group: Group, members: GroupUserList, messages: Message[] }; //in order
export type FrinedChat = { otherUser: User, messages: Message[] };
export type Todo = { forNow: null, todoID: TodoId, title: Text, description: Text, dueDate: Date | null, completed: boolean, assignedTo: UserList, createdBy: UserId, groupId: GroupId | null, repeatPeriod: RepeatPeriod, repeatDays: Day[], canModify: boolean, canDelete: boolean };
export type GroupTodo = { todo: Todo, assigned_by: User, type: 'all_members' | 'personal' | 'group', group: Group };
export type KanbanBoard = { forNow: null }
export type Event = { forNow: null, eventID: EventId, canModify: boolean, canDelete: boolean }
export type GroupEvent = { group: Group, forNow: null, eventID: EventId, canModify: boolean, canDelete: boolean }
export type Notification = { forNow: null }
export type NotificationList = { forNow: null }
export type User = { forNow: null, user_id: UserId } //like a follower list... just the basics
export type GroupUser = { user: User, role: Role, group: Group }
export type UserList = User[]
export type GroupUserList = GroupUser[]
export type GroupList = Group[]
export type Image = { forNow: null }
export type DefaultProfilePicture = null
export type ProfilePicture = { forNow: null }
export type UserSettingsPage = { forNow: null }
export type GroupSettingsPage = { forNow: null }
export type Setting = { forNow: null, canModify: boolean, canDelete: boolean }
export type Category = { name: string, id: string, visible: boolean, color: string};
export type Text = string;
export type UserId = string;
export type CommentId = string;
export type PostId = string;
export type GroupId = string;
export type EventId = string;
export type TodoId = string;
export type CategoryId = string;
export type Role = 'admin' | 'owner' | 'general';
export type RepeatPeriod = 'NONE' | 'Weekly' | 'Monthly' | 'BiWeekly' | 'Daily' | 'Yearly';
export type Day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';
export type ViewershipTag = { name: string, id: string, fornow: null };

export async function asyncTimer(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class NotImplementedError extends Error {
    constructor(functionName: string) {
        super(`${functionName} is not implemented.`);
        this.name = 'NotImplementedError';
    }
}

export function getBatchUsers(userIds: UserId[], supabaseClient: SupabaseClient<Database>): Promise<UserList> {
    throw new NotImplementedError('getBatchUsers');
}

/**
 * Given group details, creates a group and returns the created group.
 * 
 * @param groupDetails 
 * @param supabaseClient 
 */
export async function createGroupTypeWithData(groupDetails:
    { name: string; description: Text; profilePicture: ProfilePicture | DefaultProfilePicture, public_special_events: boolean, title: string }): Promise<Group> {
    throw new NotImplementedError('createGroupTypeWithData');
}


export interface ProfileSummary {
    username: string | null;
    bio: string | null;
    numposts: number;
    numfollowers: number;
    numfollowing: number;
    yourequestedfollow: boolean;
    theyrequestedfollow: boolean;
    youfollowing: boolean;
    theyfollowing: boolean;
    youclosefriend: boolean;
    theyclosefriend: boolean;
    youblockedthem: boolean;
    theyblockedyou: boolean;
    isprivate: boolean;
    isownprofile: boolean;
    categories: {
        categoryName: string;
        posts: { id: string, imageLink: string }[];
    }[];
}

/**
 * Given event details, creates an event and returns the created event.
 * 
 * @param eventDetails
 * @param supabaseClient
 */
export interface EventDetails {
    color: string;
    description: string;
    end_date: string;
    end_repeat: string | null;
    end_time: string;
    group_id: string | null;
    id: string;
    is_all_day: boolean;
    location: string | null;
    owner_id: string | null;
    start_date: string;
    start_time: string;
    title: string;
    working_on_this_todo: string | null;
}

export interface EventDetailsForNow {
    title: string;
    start: Date;
    end: Date;
    color: string;
    end_repeat: Date;
    days: number[]; //0 is sunday, 6 is saturday
    repeat_schedule: 'weekly' | 'monthly' | 'biweekly' | 'daily' | 'none';
}

//created
export async function createEventTypeWithData(eventDetails: EventDetails): Promise<Event> {
    throw new NotImplementedError('createEventTypeWithData');
}

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
        const random = Math.random() * 16 | 0;
        const value = char === 'x' ? random : (random & 0x3 | 0x8);
        return value.toString(16);
    });
}


type TodoDetails = {
    actual_time_taken: number | null;
    assigned_by: string;
    copy_of: string | null;
    create_seperate_todos: boolean;
    datetime_completed: string | null;
    deadline: string | null;
    end_repeat: string | null;
    estimated_time_mins: number | null;
    group_id: string | null;
    id: string;
    media_link: string | null;
    notes: string;
    person_id: string | null;
    priority: number | null;
    repeat_every: string;
    soft_deadline_of: string | null;
    specific_info_on_recorded_time: Json | null;
    start_date: string | null;
    title: string;
    total_recored_time_taken: number | null;
    weekdays: string[];
}

//created
export async function createTodoTypeWithData(todoDetails: TodoDetails): Promise<Todo> {
    throw new NotImplementedError('createEventTypeWithData');
}

export async function createGroupTodoTypeWithData(groupTodoDetails: { todo: Todo, group: Group, assigned_by: User, type: 'all_members' | 'personal' | 'group' }): Promise<GroupTodo> {
    throw new NotImplementedError('createGroupTodoTypeWithData');
}

//created
export async function createMessageTypeWithData(messageDetails: { content: string; created_at: string; message_id: string; messenger_id: string; receiver_deleted: boolean; receiver_id: string; sender_deleted: boolean; }): Promise<Message> {
    throw new NotImplementedError('createMessageTypeWithData');
}

//created
export async function createMessageTypeWithGroupData(messageDetails: { by_person: string; created_at: string; group_id: string; message: string; }): Promise<Message> {
    throw new NotImplementedError('createMessageTypeWithData');
}

//created
export async function createPostTypeWithData(postDetails: { created_at: string; description: string | null; event_id: string | null; highlighted_by_owner: boolean; id: string; imageLink: string; inspired_by_count: number; liked_count: number; owner_id: string; title: string; todo_id: string | null; }[]): Promise<Post[]> {
    throw new NotImplementedError('createPostTypeWithData');
}

type oldDetails = { created_at: string; description: string | null; event_id: string | null; highlighted_by_owner: boolean; id: string; imageLink: string; inspired_by_count: number; liked_count: number; owner_id: string; title: string; todo_id: string | null; comment_count: number; username: string; alreadyliked: boolean; alreadysaved: boolean; archived: boolean };


export async function createPostDetailsTypeWithData(postDetails: { created_at: string; description: string | null; event_id: string | null; highlighted_by_owner: boolean; id: string; imageLink: string; inspired_by_count: number; liked_count: number; owner_id: string; title: string; todo_id: string | null; comment_count: number; username: string; alreadyliked: boolean; alreadysaved: boolean, archived: boolean; }[]): Promise<postDetails[]> {
    async function convertPost(post: oldDetails): Promise<postDetails> {
        return { postId: post.id, personID: post.owner_id, username: post.username, thoughts: post.description ?? '', taskOrEventName: post.title, myPost: post.owner_id === (await getUserId().then((value) => value[0])), taskID: post.todo_id ?? undefined, eventID: post.event_id ?? undefined, hashtags: undefined, timeCreated: new Date(post.created_at), likes: post.liked_count, comments: post.comment_count, alreadyLiked: post.alreadyliked, alreadySaved: post.alreadysaved, archived: post.archived }
    }

    return Promise.all(postDetails.map(convertPost))
}

export async function createCommentTypeWithData(commentDetails: { content: Text; ownerId: UserId; postId: PostId; reply_to_id: CommentId | null }): Promise<Comment> {
    throw new NotImplementedError('createCommentTypeWithData');
}

export async function createNotificationTypeWithData(notificationDetails: { content: Text; userId: UserId; type: string }): Promise<Notification> {
    throw new NotImplementedError('createNotificationTypeWithData');
}

//correct input
export async function createUserTypeWithData(userDetails: { bio: string | null; email: string | null; first_name: string | null; id: string; last_name: string | null; middle_name: string | null; public_or_private: string; username: string | null; }): Promise<User> {
    throw new NotImplementedError('createUserTypeWithData');
}

//created
export async function createViewershipTagTypeWithData(viewershipTagDetails: { followers_or_all: string | null; group_id: string | null; id: string; owner_id: string | null; tag_color: string; tag_name: string; }): Promise<ViewershipTag> {
    throw new NotImplementedError('createViewershipTagWithData');
}

//might not need
export function getBulkPostInfoById(post_ids: string[], databaseClient: SupabaseClient<Database>): Promise<Post[]> {
    throw new Error('Function not implemented.');

    // return new Promise((resolve, reject) => {
    //     databaseClient
    //         .from('post')
    //         .select('id, title, content, created_at, author_id, author:usersettings!author_id (username)')
    //         .in('id', post_ids)
    //         .then(({ data, error }: QueryResult<Tables['post']>) => {
    //             if (error) {
    //                 console.error('Error fetching posts:', error.message);
    //                 reject(error);
    //             } else {
    //                 const posts = data.map(post => ({
    //                     id: post.id,
    //                     title: post.title,
    //                     content: post.content,
    //                     created_at: post.created_at,
    //                     author_id: post.author_id,
    //                     author_username: post.author?.username || ''
    //                 }));
    //                 resolve(posts);
    //             }
    //         });
    // });
}