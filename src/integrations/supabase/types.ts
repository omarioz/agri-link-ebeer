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
  public: {
    Tables: {
      bids: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          id: string
          price: number | null
          product_id: string | null
          qty_kg: number | null
          status: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          price?: number | null
          product_id?: string | null
          qty_kg?: number | null
          status?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          price?: number | null
          product_id?: string | null
          qty_kg?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_routes: {
        Row: {
          id: string
          order_id: string | null
          path: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          path?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          path?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_routes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          id: string
          name: string | null
          primary_crops: string[] | null
          size_ha: number | null
          user_id: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          primary_crops?: string[] | null
          size_ha?: number | null
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          primary_crops?: string[] | null
          size_ha?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          payload: Json | null
          read: boolean | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          payload?: Json | null
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          payload?: Json | null
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          bid_id: string | null
          courier_name: string | null
          courier_phone: string | null
          created_at: string | null
          delivered_at: string | null
          id: string
          status: string | null
        }
        Insert: {
          bid_id?: string | null
          courier_name?: string | null
          courier_phone?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          bid_id?: string | null
          courier_name?: string | null
          courier_phone?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number | null
          farmer_id: string | null
          id: string
          paid_at: string | null
          requested_at: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          farmer_id?: string | null
          id?: string
          paid_at?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          farmer_id?: string | null
          id?: string
          paid_at?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          farmer_id: string | null
          harvest_date: string | null
          id: string
          min_price: number | null
          photo_url: string | null
          qty_kg: number | null
          status: string | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          min_price?: number | null
          photo_url?: string | null
          qty_kg?: number | null
          status?: string | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          min_price?: number | null
          photo_url?: string | null
          qty_kg?: number | null
          status?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          region: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          region?: string | null
          role: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          region?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
