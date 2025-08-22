import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../databasetypes";
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

export interface drawerProps {
    isPublic: boolean;
    categoryId: string;
    categoryName: string;
    categoryColor: string;
  }

export interface CalendarDrawerProps {
  categories: drawerProps[];
  handleCategoryToggle: (categoryId: string, newValue: boolean) => void;
  groups: calendarGroupProps[];
  people: calendarPersonProps[];
  handlePersonToggle: (personId: string, newValue: boolean) => void;
  handleGroupToggle: (groupId: string, newValue: boolean) => void;
  setView: (view: 'day' | 'week' | 'month') => void;
}

export interface calendarGroupProps { groupId: string; groupName: string; isChecked: boolean }
export interface calendarPersonProps { personId: string; personName: string; isChecked: boolean }

export interface calendarProps {
    events: EventDetailsForNow[];
    viewingDate: Date;
    setViewingDateFunc: (date: Date) => void;
    categories: drawerProps[];
    handleCategoryToggle: (categoryId: string, newValue: boolean) => void;
    groups: calendarGroupProps[];
    handleGroupToggle: (groupId: string, newValue: boolean) => void;
    people: calendarPersonProps[];
    handlePersonToggle: (personId: string, newValue: boolean) => void;
    setView: (view: 'day' | 'week' | 'month') => void;
    hourHeight: number;
    setHourHeight: React.Dispatch<React.SetStateAction<number>>;
    onEventPress: (event: EventDetailsForNow) => void;
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

enum Priority {

}

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
// export interface EventDetails {
//     color: string;
//     description: string;
//     end_date: string;
//     end_repeat: string | null;
//     end_time: string;
//     group_id: string | null;
//     id: string;
//     is_all_day: boolean;
//     location: string | null;
//     owner_id: string | null;
//     start_date: string;
//     start_time: string;
//     title: string;
//     working_on_this_todo: string | null;
// }

export const dummyPost: postDetails = { postId: "dummy", taskOrEventName: "Dummy Post", personID: "0", myPost: true, username: 'dummyUser', thoughts: "This is a dummy post for testing purposes.", hashtags: ['test', 'dummy'], timeCreated: new Date("2023-10-01T12:00:00Z"), likes: 0, comments: 0, alreadyLiked: false, alreadySaved: false, archived: false };

export interface EventDetailsForNow {
    title: string;
    start: Date;
    end: Date;
    color: string;
    end_repeat: Date;
    days: number[]; //0 is sunday, 6 is saturday
    repeat_schedule: 'weekly' | 'monthly' | 'biweekly' | 'daily' | 'none' | 'yearly';
    isAllDay?: boolean;
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
export type Subtodo = {
    id: string;
    title: string;
    completed: boolean;
    dueDate: string;
};
export interface SubtodoTimelineProps {
    subtodos: Subtodo[];
    setSubtodos: React.Dispatch<React.SetStateAction<Subtodo[]>>;
    isEditing: boolean;
}

export type TodoDetails = {
    all_members_must_complete: boolean
    assigned_by: string
    completed_by: string | null
    created_at: string
    deadline: string | null
    end_repeat: string | null
    group_id: string | null
    habit: boolean
    id: string
    notes: string
    person_id: string | null
    priority: number | null
    repeat_every: string
    start_date: string | null
    title: string
    todo_color: string | null
    weekdays: number[]
    location: string | null
    privacy: number
}

export type SubtodoDetails = {
    // created_by: string
    deadline: string
    id: string
    location: string
    priority: number
    subtodo_of: string
    title: string
    // deleted: boolean
}

export type SubtodoDetailsNoId = {
    // created_by: string
    deadline: string
    id: string
    location: string
    priority: number
    subtodo_of: string
    title: string
    // deleted: boolean
}

export type ModifiedTodoDetails = {
    all_group_members_todo_started: boolean | null
    categories_override: boolean
    completed_at: string | null
    deleted_override: boolean
    due_time_override: string | null
    location_override: string | null
    my_id: string
    parent_id: string
    priority_color_overridden: number | null
    privacy_overridden: number | null
    started_subtodos: boolean
    subtodos_overriden: boolean
    utc_start_of_day: string
    title_override: string | null
    /// if the todo  is "future"
    // repeitition_override: string | null
    // weekdays_override: number[] | null
}

export type ModifiedTodoDetailsNoID = {
  all_group_members_todo_started: boolean | null
  categories_override: boolean
  completed_at: string | null
  deleted_override: boolean
  due_time_override: string | null
  location_override: string | null
  parent_id: string
  priority_color_overridden: number | null
  privacy_overridden: number | null
  started_subtodos: boolean
  subtodos_overriden: boolean
  utc_start_of_day: string
  title_override: string | null
  /// if the todo  is "future"
  repeitition_override: string | null
  weekdays_override: number[] | null
}

export type ModifiedSubTodoDetails = {
    deadline: string
    location: string
    my_id: string
    overridden_todo: string
    priority: number
    title: string
}

export type ModifiedSubTodoDetailsNoID = {
  deadline: string
  location: string
  overridden_todo: string
  priority: number
  title: string
}

export type EventDetails = {
    created_at: string | null
    description: string
    end_date: string
    end_repeat: string | null
    event_color: string | null
    group_id: string | null
    id: string
    is_all_day: boolean
    location: string | null
    owner_id: string
    repeat: string
    start_date: string
    title: string
    weekdays: number[]
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