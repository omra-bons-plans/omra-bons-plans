export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          category: string
          cover_image: string | null
          created_at: string
          currency: string
          description: string
          id: string
          images: string[] | null
          is_draft: boolean | null
          is_paused: boolean | null
          is_promotion: boolean | null
          is_published: boolean | null
          location: string | null
          original_price: number | null
          price: number
          promotion_end_date: string | null
          publish_end_date: string
          show_email: boolean | null
          show_phone: boolean | null
          show_professional_phone: boolean | null
          show_whatsapp: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          cover_image?: string | null
          created_at?: string
          currency?: string
          description: string
          id?: string
          images?: string[] | null
          is_draft?: boolean | null
          is_paused?: boolean | null
          is_promotion?: boolean | null
          is_published?: boolean | null
          location?: string | null
          original_price?: number | null
          price: number
          promotion_end_date?: string | null
          publish_end_date: string
          show_email?: boolean | null
          show_phone?: boolean | null
          show_professional_phone?: boolean | null
          show_whatsapp?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          cover_image?: string | null
          created_at?: string
          currency?: string
          description?: string
          id?: string
          images?: string[] | null
          is_draft?: boolean | null
          is_paused?: boolean | null
          is_promotion?: boolean | null
          is_published?: boolean | null
          location?: string | null
          original_price?: number | null
          price?: number
          promotion_end_date?: string | null
          publish_end_date?: string
          show_email?: boolean | null
          show_phone?: boolean | null
          show_professional_phone?: boolean | null
          show_whatsapp?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ads_babysitting: {
        Row: {
          ad_id: string
          city: string
          gender: string
          languages: string[]
        }
        Insert: {
          ad_id: string
          city: string
          gender: string
          languages?: string[]
        }
        Update: {
          ad_id?: string
          city?: string
          gender?: string
          languages?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "ads_babysitting_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: true
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ads_chauffeurs: {
        Row: {
          ad_id: string
          city: string
          gender: string
          languages: string[]
          vehicle_seats: number
        }
        Insert: {
          ad_id: string
          city: string
          gender: string
          languages?: string[]
          vehicle_seats: number
        }
        Update: {
          ad_id?: string
          city?: string
          gender?: string
          languages?: string[]
          vehicle_seats?: number
        }
        Relationships: [
          {
            foreignKeyName: "ads_chauffeurs_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: true
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ads_guides: {
        Row: {
          ad_id: string
          city: string
          gender: string
          languages: string[]
          offers_courses: boolean | null
          offers_omra_badal: boolean | null
          offers_omra_guidance: boolean | null
          offers_other: boolean | null
          offers_visits: boolean | null
          offers_wheelchair_help: boolean | null
          other_services_description: string | null
          years_experience: number
        }
        Insert: {
          ad_id: string
          city: string
          gender: string
          languages?: string[]
          offers_courses?: boolean | null
          offers_omra_badal?: boolean | null
          offers_omra_guidance?: boolean | null
          offers_other?: boolean | null
          offers_visits?: boolean | null
          offers_wheelchair_help?: boolean | null
          other_services_description?: string | null
          years_experience: number
        }
        Update: {
          ad_id?: string
          city?: string
          gender?: string
          languages?: string[]
          offers_courses?: boolean | null
          offers_omra_badal?: boolean | null
          offers_omra_guidance?: boolean | null
          offers_other?: boolean | null
          offers_visits?: boolean | null
          offers_wheelchair_help?: boolean | null
          other_services_description?: string | null
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "ads_guides_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: true
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ads_hebergements: {
        Row: {
          accommodation_type: string
          ad_id: string
          available_from: string | null
          available_to: string | null
          beds_count: number | null
          city: string
          distance_to_mosque: string | null
          has_ac: boolean | null
          has_fridge: boolean | null
          has_living_room: boolean | null
          has_tv: boolean | null
          has_washing_machine: boolean | null
          has_wifi: boolean | null
          name: string
          rooms_count: number | null
          video_url: string | null
        }
        Insert: {
          accommodation_type: string
          ad_id: string
          available_from?: string | null
          available_to?: string | null
          beds_count?: number | null
          city: string
          distance_to_mosque?: string | null
          has_ac?: boolean | null
          has_fridge?: boolean | null
          has_living_room?: boolean | null
          has_tv?: boolean | null
          has_washing_machine?: boolean | null
          has_wifi?: boolean | null
          name: string
          rooms_count?: number | null
          video_url?: string | null
        }
        Update: {
          accommodation_type?: string
          ad_id?: string
          available_from?: string | null
          available_to?: string | null
          beds_count?: number | null
          city?: string
          distance_to_mosque?: string | null
          has_ac?: boolean | null
          has_fridge?: boolean | null
          has_living_room?: boolean | null
          has_tv?: boolean | null
          has_washing_machine?: boolean | null
          has_wifi?: boolean | null
          name?: string
          rooms_count?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_hebergements_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: true
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ads_sejours: {
        Row: {
          ad_id: string
          airline: string | null
          departure_date: string | null
          formula_type: string
          mecca_hotel_distance: string | null
          mecca_hotel_name: string | null
          medina_hotel_distance: string | null
          medina_hotel_name: string | null
          nights_mecca: number | null
          nights_medina: number | null
          return_date: string | null
        }
        Insert: {
          ad_id: string
          airline?: string | null
          departure_date?: string | null
          formula_type: string
          mecca_hotel_distance?: string | null
          mecca_hotel_name?: string | null
          medina_hotel_distance?: string | null
          medina_hotel_name?: string | null
          nights_mecca?: number | null
          nights_medina?: number | null
          return_date?: string | null
        }
        Update: {
          ad_id?: string
          airline?: string | null
          departure_date?: string | null
          formula_type?: string
          mecca_hotel_distance?: string | null
          mecca_hotel_name?: string | null
          medina_hotel_distance?: string | null
          medina_hotel_name?: string | null
          nights_mecca?: number | null
          nights_medina?: number | null
          return_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_sejours_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: true
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ads_vols: {
        Row: {
          ad_id: string
          airline: string
          arrival_airport: string | null
          departure_airport: string | null
          departure_date: string | null
          has_stopover: boolean | null
          return_date: string | null
          stopover_details: string | null
        }
        Insert: {
          ad_id: string
          airline: string
          arrival_airport?: string | null
          departure_airport?: string | null
          departure_date?: string | null
          has_stopover?: boolean | null
          return_date?: string | null
          stopover_details?: string | null
        }
        Update: {
          ad_id?: string
          airline?: string
          arrival_airport?: string | null
          departure_airport?: string | null
          departure_date?: string | null
          has_stopover?: boolean | null
          return_date?: string | null
          stopover_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_vols_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: true
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          images: string[] | null
          is_published: boolean | null
          location_address: string | null
          location_city: string | null
          location_latitude: number | null
          location_longitude: number | null
          published_at: string | null
          tags: string[] | null
          title: string
          updated_at: string
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          location_address?: string | null
          location_city?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          published_at?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          location_address?: string | null
          location_city?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          published_at?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      click_stats: {
        Row: {
          ad_id: string
          click_type: string
          created_at: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          ad_id: string
          click_type: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          ad_id?: string
          click_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "click_stats_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_id: string | null
          related_type: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_id?: string | null
          related_type?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          profile_id: string
          user_agent: string | null
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          profile_id: string
          user_agent?: string | null
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          profile_id?: string
          user_agent?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          company_address: string | null
          company_name: string | null
          created_at: string
          email: string | null
          experience_years: number | null
          facebook: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          instagram: string | null
          is_professional: boolean | null
          kuniya: string | null
          languages_spoken: string[] | null
          phone: string | null
          phone_country: string | null
          professional_phone: string | null
          professional_phone_country: string | null
          profile_image: string | null
          profile_views: number | null
          public_profile: boolean | null
          slug: string | null
          specialties: string[] | null
          updated_at: string
          website: string | null
          whatsapp: string | null
          whatsapp_country: string | null
        }
        Insert: {
          bio?: string | null
          company_address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          facebook?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          instagram?: string | null
          is_professional?: boolean | null
          kuniya?: string | null
          languages_spoken?: string[] | null
          phone?: string | null
          phone_country?: string | null
          professional_phone?: string | null
          professional_phone_country?: string | null
          profile_image?: string | null
          profile_views?: number | null
          public_profile?: boolean | null
          slug?: string | null
          specialties?: string[] | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
          whatsapp_country?: string | null
        }
        Update: {
          bio?: string | null
          company_address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          facebook?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          instagram?: string | null
          is_professional?: boolean | null
          kuniya?: string | null
          languages_spoken?: string[] | null
          phone?: string | null
          phone_country?: string | null
          professional_phone?: string | null
          professional_phone_country?: string | null
          profile_image?: string | null
          profile_views?: number | null
          public_profile?: boolean | null
          slug?: string | null
          specialties?: string[] | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
          whatsapp_country?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          ad_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          ad_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          ad_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_profile_slug: {
        Args: {
          user_first_name: string
          user_full_name: string
          user_id: string
        }
        Returns: string
      }
      get_ad_rating: {
        Args: { ad_id: string }
        Returns: {
          avg_rating: number
          review_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_profile_views: {
        Args: { profile_id: string }
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      notification_type:
        | "profile_view"
        | "ad_comment"
        | "contact_request"
        | "ad_status_change"
        | "ad_expiring"
        | "system"
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
    Enums: {
      app_role: ["admin", "user"],
      notification_type: [
        "profile_view",
        "ad_comment",
        "contact_request",
        "ad_status_change",
        "ad_expiring",
        "system",
      ],
    },
  },
} as const
