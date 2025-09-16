export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          email: string | null
          enable_reminders: boolean
          id: string
          name: string | null
        }
        Insert: {
          email?: string | null
          enable_reminders?: boolean
          id: string
          name?: string | null
        }
        Update: {
          email?: string | null
          enable_reminders?: boolean
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      reminder_job_logs: {
        Row: {
          error: string | null
          finished_at: string | null
          id: number
          job_id: string
          note: string | null
          raw_response: Json | null
          request_status: string | null
          response: Json | null
          run_at: string | null
          started_at: string | null
          status_code: number | null
        }
        Insert: {
          error?: string | null
          finished_at?: string | null
          id?: number
          job_id: string
          note?: string | null
          raw_response?: Json | null
          request_status?: string | null
          response?: Json | null
          run_at?: string | null
          started_at?: string | null
          status_code?: number | null
        }
        Update: {
          error?: string | null
          finished_at?: string | null
          id?: number
          job_id?: string
          note?: string | null
          raw_response?: Json | null
          request_status?: string | null
          response?: Json | null
          run_at?: string | null
          started_at?: string | null
          status_code?: number | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          archived: boolean
          completed: boolean
          createdAt: string
          description: string | null
          id: number
          is_reminder_sent: boolean | null
          priority: string
          reminderTime: string | null
          title: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          archived: boolean
          completed: boolean
          createdAt?: string
          description?: string | null
          id?: number
          is_reminder_sent?: boolean | null
          priority: string
          reminderTime?: string | null
          title: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          archived?: boolean
          completed?: boolean
          createdAt?: string
          description?: string | null
          id?: number
          is_reminder_sent?: boolean | null
          priority?: string
          reminderTime?: string | null
          title?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      call_send_reminder: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      call_send_reminder_by_claude: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      debug_http_structure: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_users_with_tasks_and_reminders: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          id: string
          reminders: Json
          tasks: Json
        }[]
      }
      get_users_with_tasks_to_remind: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          id: string
          tasks: Json
        }[]
      }
      process_http_responses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
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
  public: {
    Enums: {},
  },
} as const
