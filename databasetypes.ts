export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      all_event_to_viewership_tags: {
        Row: {
          event_id: string
          person_id: string
          vt_id: string
        }
        Insert: {
          event_id: string
          person_id: string
          vt_id: string
        }
        Update: {
          event_id?: string
          person_id?: string
          vt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_event_to_viewership_tags_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_event_to_viewership_tags_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_group_to_viewership_tags_post_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_group_to_viewership_tags_vt_id_fkey"
            columns: ["vt_id"]
            isOneToOne: false
            referencedRelation: "viewership_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      all_group_members_todos_completed: {
        Row: {
          person_id: string
          todo_copied: string
        }
        Insert: {
          person_id: string
          todo_copied: string
        }
        Update: {
          person_id?: string
          todo_copied?: string
        }
        Relationships: [
          {
            foreignKeyName: "all_group_members_todos_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "all_group_members_todos_todo_copied_fkey"
            columns: ["todo_copied"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
        ]
      }
      all_todo_to_viewership_tags: {
        Row: {
          person_id: string
          todo_id: string
          vt_id: string
        }
        Insert: {
          person_id: string
          todo_id: string
          vt_id: string
        }
        Update: {
          person_id?: string
          todo_id?: string
          vt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_group_to_viewership_tags_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_viewership_tags_post_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_viewership_tags_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_viewership_tags_vt_id_fkey"
            columns: ["vt_id"]
            isOneToOne: false
            referencedRelation: "viewership_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_category_tags: {
        Row: {
          appear_on_profile: boolean
          category_name: string
          id: string
          person_who_owns_tag: string
          tag_color: string | null
        }
        Insert: {
          appear_on_profile?: boolean
          category_name: string
          id?: string
          person_who_owns_tag?: string
          tag_color?: string | null
        }
        Update: {
          appear_on_profile?: boolean
          category_name?: string
          id?: string
          person_who_owns_tag?: string
          tag_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_category_tags_person_who_owns_tag_fkey"
            columns: ["person_who_owns_tag"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      event: {
        Row: {
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
        Insert: {
          created_at?: string | null
          description: string
          end_date: string
          end_repeat?: string | null
          event_color?: string | null
          group_id?: string | null
          id?: string
          is_all_day?: boolean
          location?: string | null
          owner_id?: string
          repeat?: string
          start_date: string
          title: string
          weekdays: number[]
        }
        Update: {
          created_at?: string | null
          description?: string
          end_date?: string
          end_repeat?: string | null
          event_color?: string | null
          group_id?: string | null
          id?: string
          is_all_day?: boolean
          location?: string | null
          owner_id?: string
          repeat?: string
          start_date?: string
          title?: string
          weekdays?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "event_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "event_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_request: {
        Row: {
          created_at: string
          followed_id: string
          requester: string
        }
        Insert: {
          created_at?: string
          followed_id: string
          requester?: string
        }
        Update: {
          created_at?: string
          followed_id?: string
          requester?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_request_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_request_requester_fkey"
            columns: ["requester"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      group_calendar_category_tags: {
        Row: {
          category_name: string | null
          group_tag_is_associated_with: string
          id: string
          tag_color: string
        }
        Insert: {
          category_name?: string | null
          group_tag_is_associated_with: string
          id?: string
          tag_color: string
        }
        Update: {
          category_name?: string | null
          group_tag_is_associated_with?: string
          id?: string
          tag_color?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_calendar_category_tags_group_tag_is_associated_with_fkey"
            columns: ["group_tag_is_associated_with"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      group_chat_messages: {
        Row: {
          by_person: string
          created_at: string
          group_id: string
          message: string
        }
        Insert: {
          by_person?: string
          created_at?: string
          group_id: string
          message: string
        }
        Update: {
          by_person?: string
          created_at?: string
          group_id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_chat_messages_by_person_fkey"
            columns: ["by_person"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_chat_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      group_todos_and_events_to_vts: {
        Row: {
          group_id: string
          person_id: string
          vt_id: string
        }
        Insert: {
          group_id: string
          person_id: string
          vt_id: string
        }
        Update: {
          group_id?: string
          person_id?: string
          vt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_todos_and_events_to_vts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "group_todos_and_events_to_vts_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_todos_and_events_to_vts_vt_id_fkey"
            columns: ["vt_id"]
            isOneToOne: false
            referencedRelation: "viewership_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          admins_change_settings: boolean
          admins_create_events: boolean
          admins_invite: boolean
          admins_un_assign_todos: boolean
          created_at: string | null
          description: string
          group_id: string
          owner: string
          profile_picture: string
          public_special_events: boolean
          title: string
        }
        Insert: {
          admins_change_settings?: boolean
          admins_create_events?: boolean
          admins_invite?: boolean
          admins_un_assign_todos?: boolean
          created_at?: string | null
          description?: string
          group_id?: string
          owner?: string
          profile_picture: string
          public_special_events: boolean
          title: string
        }
        Update: {
          admins_change_settings?: boolean
          admins_create_events?: boolean
          admins_invite?: boolean
          admins_un_assign_todos?: boolean
          created_at?: string | null
          description?: string
          group_id?: string
          owner?: string
          profile_picture?: string
          public_special_events?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_request: {
        Row: {
          created_at: string | null
          group_id: string
          requester: string
          user_to_invite: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          requester?: string
          user_to_invite: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          requester?: string
          user_to_invite?: string
        }
        Relationships: [
          {
            foreignKeyName: "invite_request_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "invite_request_requester_fkey"
            columns: ["requester"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invite_request_user_to_invite_fkey"
            columns: ["user_to_invite"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      join_request: {
        Row: {
          asker: string
          created_at: string
          group_id: string
        }
        Insert: {
          asker?: string
          created_at?: string
          group_id: string
        }
        Update: {
          asker?: string
          created_at?: string
          group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follwer_request_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "join_request_asker_fkey"
            columns: ["asker"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          documentLink: string | null
          message_id: string
          messenger_id: string
          postLinked: string | null
          read: boolean
          receiver_deleted: boolean
          receiver_id: string
          reply_to: string | null
          sender_deleted: boolean
        }
        Insert: {
          content: string
          created_at?: string
          documentLink?: string | null
          message_id?: string
          messenger_id: string
          postLinked?: string | null
          read?: boolean
          receiver_deleted?: boolean
          receiver_id: string
          reply_to?: string | null
          sender_deleted?: boolean
        }
        Update: {
          content?: string
          created_at?: string
          documentLink?: string | null
          message_id?: string
          messenger_id?: string
          postLinked?: string | null
          read?: boolean
          receiver_deleted?: boolean
          receiver_id?: string
          reply_to?: string | null
          sender_deleted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "messages_messenger_id_fkey"
            columns: ["messenger_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_postLinked_fkey"
            columns: ["postLinked"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["message_id"]
          },
        ]
      }
      people_to_close_friends: {
        Row: {
          close_friend: string
          person_id: string
        }
        Insert: {
          close_friend: string
          person_id?: string
        }
        Update: {
          close_friend?: string
          person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_close_friends_person_id_close_friend_fkey"
            columns: ["person_id", "close_friend"]
            isOneToOne: true
            referencedRelation: "people_to_following"
            referencedColumns: ["followed_id", "follower_id"]
          },
        ]
      }
      people_to_deleted_group_events: {
        Row: {
          event_id: string
          user_id: string
        }
        Insert: {
          event_id: string
          user_id?: string
        }
        Update: {
          event_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_delete_added_group_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_delete_added_group_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_deleted_group_todos: {
        Row: {
          todo_id: string
          user_id: string
        }
        Insert: {
          todo_id: string
          user_id?: string
        }
        Update: {
          todo_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_deleted_group_todos_event_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_deleted_group_todos_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_deleted_group_todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_following: {
        Row: {
          followed_id: string
          follower_id: string
        }
        Insert: {
          followed_id: string
          follower_id: string
        }
        Update: {
          followed_id?: string
          follower_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_following_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people-to-following_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_group: {
        Row: {
          group_id: string
          person_id: string
          public_on_calendar: boolean
          role: string
          show_on_calendar: boolean
          silence_notifications: boolean
        }
        Insert: {
          group_id: string
          person_id: string
          public_on_calendar?: boolean
          role?: string
          show_on_calendar?: boolean
          silence_notifications?: boolean
        }
        Update: {
          group_id?: string
          person_id?: string
          public_on_calendar?: boolean
          role?: string
          show_on_calendar?: boolean
          silence_notifications?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "people_to_group_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "people_to_group_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_group_person_id_fkey1"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_liked: {
        Row: {
          person_id: string
          post_id: string
        }
        Insert: {
          person_id?: string
          post_id: string
        }
        Update: {
          person_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_liked_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_liked_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_nudges: {
        Row: {
          person_id: string
          todo_id: string
        }
        Insert: {
          person_id: string
          todo_id: string
        }
        Update: {
          person_id?: string
          todo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_nudges_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_nudges_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_saved: {
        Row: {
          person_id: string
          post_id: string
        }
        Insert: {
          person_id?: string
          post_id: string
        }
        Update: {
          person_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_saved_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_saved_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_viewed: {
        Row: {
          person_id: string
          post_id: string
        }
        Insert: {
          person_id: string
          post_id: string
        }
        Update: {
          person_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_viewed_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_viewed_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_viewership_tag: {
        Row: {
          owner_id: string
          person_associated: string
          viewership_tag: string
        }
        Insert: {
          owner_id: string
          person_associated: string
          viewership_tag: string
        }
        Update: {
          owner_id?: string
          person_associated?: string
          viewership_tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_viewership_tag_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_viewership_tag_person_associated_fkey"
            columns: ["person_associated"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_viewership_tag_viewership_tag_fkey"
            columns: ["viewership_tag"]
            isOneToOne: false
            referencedRelation: "viewership_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      person_to_blocked: {
        Row: {
          blocked_id: string
          person_id: string
        }
        Insert: {
          blocked_id: string
          person_id?: string
        }
        Update: {
          blocked_id?: string
          person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "person_to_blocked_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_to_blocked_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      post: {
        Row: {
          archived: boolean
          created_at: string
          description: string | null
          event_id: string | null
          highlighted_by_owner: boolean
          id: string
          imageLink: string
          inspired_by_count: number
          liked_count: number
          owner_id: string
          title: string
          todo_id: string | null
        }
        Insert: {
          archived?: boolean
          created_at?: string
          description?: string | null
          event_id?: string | null
          highlighted_by_owner?: boolean
          id?: string
          imageLink: string
          inspired_by_count?: number
          liked_count?: number
          owner_id: string
          title: string
          todo_id?: string | null
        }
        Update: {
          archived?: boolean
          created_at?: string
          description?: string | null
          event_id?: string | null
          highlighted_by_owner?: boolean
          id?: string
          imageLink?: string
          inspired_by_count?: number
          liked_count?: number
          owner_id?: string
          title?: string
          todo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
        ]
      }
      post_to_category: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_to_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_category_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      post_to_comment: {
        Row: {
          comment_content: string
          created_at: string
          id: string
          person_id: string
          post_id: string
          reply_to: string | null
        }
        Insert: {
          comment_content: string
          created_at?: string
          id?: string
          person_id: string
          post_id: string
          reply_to?: string | null
        }
        Update: {
          comment_content?: string
          created_at?: string
          id?: string
          person_id?: string
          post_id?: string
          reply_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_to_comment_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_comment_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_comment_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "post_to_comment"
            referencedColumns: ["id"]
          },
        ]
      }
      post_to_group_category: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_to_group_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_group_category_category_id_fkey1"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "group_calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_group_category_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_group_category_post_id_fkey1"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      post_to_tagged_people: {
        Row: {
          person_id: string
          post_id: string
        }
        Insert: {
          person_id: string
          post_id: string
        }
        Update: {
          person_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_to_tagged_people_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_tagged_people_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      post_to_viewership_tags: {
        Row: {
          post_id: string
          vt_id: string
        }
        Insert: {
          post_id: string
          vt_id: string
        }
        Update: {
          post_id?: string
          vt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_to_viewership_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_viewership_tags_vt_id_fkey"
            columns: ["vt_id"]
            isOneToOne: false
            referencedRelation: "viewership_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      push_tokens: {
        Row: {
          token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subtodo: {
        Row: {
          created_by: string
          deadline: string
          id: string
          location: string
          priority: number
          subtodo_of: string
          title: string
        }
        Insert: {
          created_by: string
          deadline: string
          id?: string
          location: string
          priority: number
          subtodo_of?: string
          title: string
        }
        Update: {
          created_by?: string
          deadline?: string
          id?: string
          location?: string
          priority?: number
          subtodo_of?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtodo_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtodo_subtodo_of_fkey"
            columns: ["subtodo_of"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
        ]
      }
      subtodo_overrides: {
        Row: {
          created_by: string | null
          deadline: string
          location: string
          my_id: string
          overridden_todo: string
          priority: number
          title: string
        }
        Insert: {
          created_by?: string | null
          deadline: string
          location: string
          my_id?: string
          overridden_todo: string
          priority: number
          title: string
        }
        Update: {
          created_by?: string | null
          deadline?: string
          location?: string
          my_id?: string
          overridden_todo?: string
          priority?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtodo_overrides_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtodo_overrides_overridden_todo_fkey"
            columns: ["overridden_todo"]
            isOneToOne: false
            referencedRelation: "todo_overrides"
            referencedColumns: ["my_id"]
          },
        ]
      }
      subtodos_completed: {
        Row: {
          completed_at: string
          imagelink: string
          parent_modified_todo: string
          parent_subtodo: string
        }
        Insert: {
          completed_at?: string
          imagelink?: string
          parent_modified_todo: string
          parent_subtodo: string
        }
        Update: {
          completed_at?: string
          imagelink?: string
          parent_modified_todo?: string
          parent_subtodo?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtodos_completed_parent_modified_todo_fkey"
            columns: ["parent_modified_todo"]
            isOneToOne: false
            referencedRelation: "todo_overrides"
            referencedColumns: ["my_id"]
          },
          {
            foreignKeyName: "subtodos_completed_parent_subtodo_fkey"
            columns: ["parent_subtodo"]
            isOneToOne: false
            referencedRelation: "subtodo_overrides"
            referencedColumns: ["my_id"]
          },
          {
            foreignKeyName: "subtodos_completed_parent_subtodo_fkey1"
            columns: ["parent_subtodo"]
            isOneToOne: false
            referencedRelation: "subtodo"
            referencedColumns: ["id"]
          },
        ]
      }
      todo: {
        Row: {
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
        }
        Insert: {
          all_members_must_complete?: boolean
          assigned_by?: string
          completed_by?: string | null
          created_at?: string
          deadline?: string | null
          end_repeat?: string | null
          group_id?: string | null
          habit?: boolean
          id?: string
          notes?: string
          person_id?: string | null
          priority?: number | null
          repeat_every?: string
          start_date?: string | null
          title: string
          todo_color?: string | null
          weekdays: number[]
        }
        Update: {
          all_members_must_complete?: boolean
          assigned_by?: string
          completed_by?: string | null
          created_at?: string
          deadline?: string | null
          end_repeat?: string | null
          group_id?: string | null
          habit?: boolean
          id?: string
          notes?: string
          person_id?: string | null
          priority?: number | null
          repeat_every?: string
          start_date?: string | null
          title?: string
          todo_color?: string | null
          weekdays?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "todo_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "todo_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_overrides: {
        Row: {
          all_group_members_todo_started: boolean | null
          categories_override: boolean
          completed_at: string | null
          deleted_override: boolean
          due_time_override: string | null
          imagelink: string
          location_override: string | null
          my_id: string
          parent_id: string
          priority_color_overridden: number | null
          privacy_overridden: number | null
          started_subtodos: boolean
          subtodos_overriden: boolean
          title_override: string | null
          utc_start_of_day: string
        }
        Insert: {
          all_group_members_todo_started?: boolean | null
          categories_override?: boolean
          completed_at?: string | null
          deleted_override?: boolean
          due_time_override?: string | null
          imagelink?: string
          location_override?: string | null
          my_id?: string
          parent_id?: string
          priority_color_overridden?: number | null
          privacy_overridden?: number | null
          started_subtodos?: boolean
          subtodos_overriden?: boolean
          title_override?: string | null
          utc_start_of_day: string
        }
        Update: {
          all_group_members_todo_started?: boolean | null
          categories_override?: boolean
          completed_at?: string | null
          deleted_override?: boolean
          due_time_override?: string | null
          imagelink?: string
          location_override?: string | null
          my_id?: string
          parent_id?: string
          priority_color_overridden?: number | null
          privacy_overridden?: number | null
          started_subtodos?: boolean
          subtodos_overriden?: boolean
          title_override?: string | null
          utc_start_of_day?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_overrides_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_to_category: {
        Row: {
          category_id: string
          person_id: string
          todo_id: string
        }
        Insert: {
          category_id: string
          person_id: string
          todo_id: string
        }
        Update: {
          category_id?: string
          person_id?: string
          todo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_to_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_category_category_id_fkey1"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_category_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_category_post_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_category_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
        ]
      }
      usersettings: {
        Row: {
          allow_push_notifications: boolean
          bio: string | null
          id: string
          last_active_ping: string
          public_or_private: string
          username: string | null
        }
        Insert: {
          allow_push_notifications?: boolean
          bio?: string | null
          id?: string
          last_active_ping?: string
          public_or_private?: string
          username?: string | null
        }
        Update: {
          allow_push_notifications?: boolean
          bio?: string | null
          id?: string
          last_active_ping?: string
          public_or_private?: string
          username?: string | null
        }
        Relationships: []
      }
      viewership_tags: {
        Row: {
          followers_or_all: string | null
          group_id: string | null
          id: string
          owner_id: string | null
          tag_color: string
          tag_name: string
        }
        Insert: {
          followers_or_all?: string | null
          group_id?: string | null
          id?: string
          owner_id?: string | null
          tag_color: string
          tag_name?: string
        }
        Update: {
          followers_or_all?: string | null
          group_id?: string | null
          id?: string
          owner_id?: string | null
          tag_color?: string
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewership_tags_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "viewership_tags_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_remove_group_member: {
        Args: {
          p_group_id: string
          p_target_person_id: string
          p_target_role: string
        }
        Returns: boolean
      }
      can_view_event: {
        Args: { event_id: string }
        Returns: boolean
      }
      can_view_post: {
        Args: { post_id: string }
        Returns: boolean
      }
      can_view_post_definer: {
        Args: { post_id: string }
        Returns: boolean
      }
      can_view_post_invoker: {
        Args: { post_id: string } | { post_id: string; owner_id: string }
        Returns: boolean
      }
      delete_specific_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_feed: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          archived: boolean
          created_at: string
          description: string
          todo_id: string
          event_id: string
          owner_id: string
          inspired_by_count: number
          liked_count: number
          comment_count: number
          title: string
          imageLink: string
          highlighted_by_owner: boolean
          username: string
          alreadyliked: boolean
          alreadysaved: boolean
        }[]
      }
      get_group_ids_for_user: {
        Args: { uid: string }
        Returns: string[]
      }
      get_user_profile_summary: {
        Args: { target_id: string }
        Returns: Database["public"]["CompositeTypes"]["user_profile_summary"]
      }
      increment_inspired_by_count: {
        Args: { p_post_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { group_id: string }
        Returns: boolean
      }
      is_admin_or_owner: {
        Args: { group_id: string }
        Returns: boolean
      }
      is_archived: {
        Args: { post_id: string }
        Returns: boolean
      }
      is_following: {
        Args: { follower: string; followed: string }
        Returns: boolean
      }
      is_in_group: {
        Args: { group_id: string }
        Returns: boolean
      }
      is_owner: {
        Args: { group_id: string }
        Returns: boolean
      }
      viewership_tag_allows_viewer: {
        Args:
          | { viewership_tag_id: string; owner_of_vt: string }
          | {
              viewership_tag_id: string
              owner_of_vt: string
              curr_viewer: string
            }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      user_profile_summary: {
        username: string | null
        bio: string | null
        numposts: number | null
        numfollowers: number | null
        numfollowing: number | null
        yourequestedfollow: boolean | null
        theyrequestedfollow: boolean | null
        youfollowing: boolean | null
        theyfollowing: boolean | null
        youclosefriend: boolean | null
        theyclosefriend: boolean | null
        youblockedthem: boolean | null
        theyblockedyou: boolean | null
        isprivate: boolean | null
        isownprofile: boolean | null
        categories: Json | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
