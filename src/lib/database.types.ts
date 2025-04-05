import { Database as SupabaseDatabase } from "@/integrations/supabase/types";
import { Json } from '@/integrations/supabase/types';

// Extend the existing Supabase Database type with our custom tables
export interface ExtendedDatabase {
  public: {
    Tables: {
      // Include existing tables from the base Database type
      messages: SupabaseDatabase['public']['Tables']['messages'] & {
        Row: {
          attachment?: Json | null;
          attachment_name?: string | null;
          attachment_type?: string | null;
          attachment_url?: string | null;
          attachment_size?: number | null;
        };
        Insert: {
          attachment?: Json | null;
          attachment_name?: string | null;
          attachment_type?: string | null;
          attachment_url?: string | null;
          attachment_size?: number | null;
        };
        Update: {
          attachment?: Json | null;
          attachment_name?: string | null;
          attachment_type?: string | null;
          attachment_url?: string | null;
          attachment_size?: number | null;
        };
      };
      ratings: {
        Row: {
          id: string;
          task_id: string;
          rater_id: string;
          rated_id: string;
          rating: number;
          is_for_creator: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          rater_id: string;
          rated_id: string;
          rating: number;
          is_for_creator: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          rater_id?: string;
          rated_id?: string;
          rating?: number;
          is_for_creator?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ratings_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ratings_rater_id_fkey";
            columns: ["rater_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ratings_rated_id_fkey";
            columns: ["rated_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: SupabaseDatabase['public']['Tables']['profiles'] & {
        Row: {
          requestor_rating: number;
          doer_rating: number;
        };
        Insert: {
          requestor_rating?: number;
          doer_rating?: number;
        };
        Update: {
          requestor_rating?: number;
          doer_rating?: number;
        };
      };
      tasks: SupabaseDatabase['public']['Tables']['tasks'] & {
        Row: {
          requestor_verification_code: string | null;
          doer_verification_code: string | null;
          is_requestor_verified: boolean;
          is_doer_verified: boolean;
          is_requestor_rated: boolean;
          is_doer_rated: boolean;
        };
        Insert: {
          requestor_verification_code?: string | null;
          doer_verification_code?: string | null;
          is_requestor_verified?: boolean;
          is_doer_verified?: boolean;
          is_requestor_rated?: boolean;
          is_doer_rated?: boolean;
        };
        Update: {
          requestor_verification_code?: string | null;
          doer_verification_code?: string | null;
          is_requestor_verified?: boolean;
          is_doer_verified?: boolean;
          is_requestor_rated?: boolean;
          is_doer_rated?: boolean;
        };
      };

      // Add custom tables
      task_applications: {
        Row: {
          id: string;
          task_id: string;
          applicant_id: string;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          applicant_id: string;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          applicant_id?: string;
          message?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "task_applications_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          }
        ];
      };

      chats: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user1_id?: string;
          user2_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      ratings: {
        Row: {
          id: string;
          task_id: string;
          rater_id: string;
          rated_id: string;
          rating: number;
          is_for_creator: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          rater_id: string;
          rated_id: string;
          rating: number;
          is_for_creator: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          rater_id?: string;
          rated_id?: string;
          rating?: number;
          is_for_creator?: boolean;
          created_at?: string;
        };
      },
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      }
    };
    Views: SupabaseDatabase['public']['Views'];
    Functions: SupabaseDatabase['public']['Functions'];
    Enums: SupabaseDatabase['public']['Enums'];
    CompositeTypes: SupabaseDatabase['public']['CompositeTypes'];
  };
}

// Define Json type since it's used in the database types
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];