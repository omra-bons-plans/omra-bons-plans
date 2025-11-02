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
      admin_access_codes: {
        Row: {
          code: string
          created_at: string
          device_fingerprint: string | null
          expires_at: string
          id: string
          ip_address: unknown
          last_activity_at: string | null
          last_request_at: string | null
          request_count: number | null
          session_expires_at: string | null
          session_ip: unknown
          session_token: string | null
          used_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          device_fingerprint?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown
          last_activity_at?: string | null
          last_request_at?: string | null
          request_count?: number | null
          session_expires_at?: string | null
          session_ip?: unknown
          session_token?: string | null
          used_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          last_activity_at?: string | null
          last_request_at?: string | null
          request_count?: number | null
          session_expires_at?: string | null
          session_ip?: unknown
          session_token?: string | null
          used_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_device_authorizations: {
        Row: {
          admin_user_id: string
          authorized_at: string | null
          authorized_by: string | null
          created_at: string
          device_fingerprint: string
          expires_at: string | null
          id: string
          ip_address: unknown
          notes: string | null
          status: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id: string
          authorized_at?: string | null
          authorized_by?: string | null
          created_at?: string
          device_fingerprint: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          notes?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string
          authorized_at?: string | null
          authorized_by?: string | null
          created_at?: string
          device_fingerprint?: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          notes?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
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
          city: string[]
          gender: string
          languages: string[]
          pricing: Json | null
          vehicle_seats: number
        }
        Insert: {
          ad_id: string
          city: string[]
          gender: string
          languages?: string[]
          pricing?: Json | null
          vehicle_seats: number
        }
        Update: {
          ad_id?: string
          city?: string[]
          gender?: string
          languages?: string[]
          pricing?: Json | null
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
          pricing: Json | null
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
          pricing?: Json | null
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
          pricing?: Json | null
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
          walking_minutes: number | null
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
          walking_minutes?: number | null
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
          walking_minutes?: number | null
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
          arrival_airport: string | null
          carry_on_bags_count: number | null
          carry_on_bags_weight: number | null
          checked_bags_count: number | null
          checked_bags_weight: number | null
          departure_airport: string | null
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
          arrival_airport?: string | null
          carry_on_bags_count?: number | null
          carry_on_bags_weight?: number | null
          checked_bags_count?: number | null
          checked_bags_weight?: number | null
          departure_airport?: string | null
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
          arrival_airport?: string | null
          carry_on_bags_count?: number | null
          carry_on_bags_weight?: number | null
          checked_bags_count?: number | null
          checked_bags_weight?: number | null
          departure_airport?: string | null
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
          carry_on_bags_count: number | null
          carry_on_bags_weight: number | null
          checked_bags_count: number | null
          checked_bags_weight: number | null
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
          carry_on_bags_count?: number | null
          carry_on_bags_weight?: number | null
          checked_bags_count?: number | null
          checked_bags_weight?: number | null
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
          carry_on_bags_count?: number | null
          carry_on_bags_weight?: number | null
          checked_bags_count?: number | null
          checked_bags_weight?: number | null
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
      airline_presets: {
        Row: {
          airline_name: string
          created_at: string
          id: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          airline_name: string
          created_at?: string
          id?: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          airline_name?: string
          created_at?: string
          id?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string
          contact_instagram: string | null
          contact_phone: string | null
          contact_phone_country: string | null
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
          scheduled_publish_at: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category: string
          contact_instagram?: string | null
          contact_phone?: string | null
          contact_phone_country?: string | null
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
          scheduled_publish_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          contact_instagram?: string | null
          contact_phone?: string | null
          contact_phone_country?: string | null
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
          scheduled_publish_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_blog_posts_author_id"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          mentions: string[] | null
          message: string
          parent_id: string | null
          topic_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentions?: string[] | null
          message: string
          parent_id?: string | null
          topic_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mentions?: string[] | null
          message?: string
          parent_id?: string | null
          topic_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "chat_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_topics: {
        Row: {
          color: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_pinned: boolean | null
          last_message_at: string | null
          message_count: number | null
          theme: string
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_pinned?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          theme: string
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_pinned?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          theme?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      click_stats: {
        Row: {
          ad_id: string
          click_type: string
          created_at: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          ad_id: string
          click_type: string
          created_at?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          ad_id?: string
          click_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown
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
      exchange_rates: {
        Row: {
          base_currency: string
          created_at: string
          id: string
          last_updated: string
          rate: number
          target_currency: string
        }
        Insert: {
          base_currency?: string
          created_at?: string
          id?: string
          last_updated?: string
          rate: number
          target_currency?: string
        }
        Update: {
          base_currency?: string
          created_at?: string
          id?: string
          last_updated?: string
          rate?: number
          target_currency?: string
        }
        Relationships: []
      }
      hajj_newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          ip_address: unknown
          subscribed_at: string
          user_agent: string | null
        }
        Insert: {
          email: string
          id?: string
          ip_address?: unknown
          subscribed_at?: string
          user_agent?: string | null
        }
        Update: {
          email?: string
          id?: string
          ip_address?: unknown
          subscribed_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      hotel_presets: {
        Row: {
          city: string
          created_at: string
          hotel_name: string
          id: string
          stars: number | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          city: string
          created_at?: string
          hotel_name: string
          id?: string
          stars?: number | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          city?: string
          created_at?: string
          hotel_name?: string
          id?: string
          stars?: number | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
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
      omra_offers: {
        Row: {
          agency_name: string
          agency_url: string
          airline: string | null
          board: string | null
          created_at: string
          currency_raw: string | null
          date_end: string | null
          date_start: string | null
          departure_city: string
          distance_to_haram_m: number | null
          duration_nights: number | null
          error_message: string | null
          flights_included: boolean
          formula_type: string
          guide_language: string[] | null
          hotel_makkah: string | null
          hotel_makkah_stars: number | null
          hotel_medina_stars: number | null
          hotel_medinah: string | null
          id: string
          is_complet: boolean
          makkah_nights: number | null
          medina_nights: number | null
          month_departure: string
          notes: string | null
          offer_title: string
          offer_url: string
          price_eur: number
          scraped_at: string
          source_hash: string
          status: string
          updated_at: string
          visa_included: boolean | null
        }
        Insert: {
          agency_name: string
          agency_url: string
          airline?: string | null
          board?: string | null
          created_at?: string
          currency_raw?: string | null
          date_end?: string | null
          date_start?: string | null
          departure_city: string
          distance_to_haram_m?: number | null
          duration_nights?: number | null
          error_message?: string | null
          flights_included?: boolean
          formula_type: string
          guide_language?: string[] | null
          hotel_makkah?: string | null
          hotel_makkah_stars?: number | null
          hotel_medina_stars?: number | null
          hotel_medinah?: string | null
          id?: string
          is_complet?: boolean
          makkah_nights?: number | null
          medina_nights?: number | null
          month_departure: string
          notes?: string | null
          offer_title: string
          offer_url: string
          price_eur: number
          scraped_at?: string
          source_hash: string
          status?: string
          updated_at?: string
          visa_included?: boolean | null
        }
        Update: {
          agency_name?: string
          agency_url?: string
          airline?: string | null
          board?: string | null
          created_at?: string
          currency_raw?: string | null
          date_end?: string | null
          date_start?: string | null
          departure_city?: string
          distance_to_haram_m?: number | null
          duration_nights?: number | null
          error_message?: string | null
          flights_included?: boolean
          formula_type?: string
          guide_language?: string[] | null
          hotel_makkah?: string | null
          hotel_makkah_stars?: number | null
          hotel_medina_stars?: number | null
          hotel_medinah?: string | null
          id?: string
          is_complet?: boolean
          makkah_nights?: number | null
          medina_nights?: number | null
          month_departure?: string
          notes?: string | null
          offer_title?: string
          offer_url?: string
          price_eur?: number
          scraped_at?: string
          source_hash?: string
          status?: string
          updated_at?: string
          visa_included?: boolean | null
        }
        Relationships: []
      }
      omra_offers_next: {
        Row: {
          agency_name: string
          agency_url: string
          board: string | null
          created_at: string
          currency_raw: string | null
          date_end: string | null
          date_start: string | null
          departure_city: string
          distance_to_haram_m: number | null
          duration_nights: number | null
          error_message: string | null
          flights_included: boolean
          formula_type: string
          guide_language: string[] | null
          hotel_makkah: string | null
          hotel_makkah_stars: number | null
          hotel_medina_stars: number | null
          hotel_medinah: string | null
          id: string
          makkah_nights: number | null
          medina_nights: number | null
          month_departure: string
          notes: string | null
          offer_title: string
          offer_url: string
          price_eur: number
          scraped_at: string
          source_hash: string
          status: string
          updated_at: string
          visa_included: boolean | null
        }
        Insert: {
          agency_name: string
          agency_url: string
          board?: string | null
          created_at?: string
          currency_raw?: string | null
          date_end?: string | null
          date_start?: string | null
          departure_city: string
          distance_to_haram_m?: number | null
          duration_nights?: number | null
          error_message?: string | null
          flights_included?: boolean
          formula_type: string
          guide_language?: string[] | null
          hotel_makkah?: string | null
          hotel_makkah_stars?: number | null
          hotel_medina_stars?: number | null
          hotel_medinah?: string | null
          id?: string
          makkah_nights?: number | null
          medina_nights?: number | null
          month_departure: string
          notes?: string | null
          offer_title: string
          offer_url: string
          price_eur: number
          scraped_at?: string
          source_hash: string
          status?: string
          updated_at?: string
          visa_included?: boolean | null
        }
        Update: {
          agency_name?: string
          agency_url?: string
          board?: string | null
          created_at?: string
          currency_raw?: string | null
          date_end?: string | null
          date_start?: string | null
          departure_city?: string
          distance_to_haram_m?: number | null
          duration_nights?: number | null
          error_message?: string | null
          flights_included?: boolean
          formula_type?: string
          guide_language?: string[] | null
          hotel_makkah?: string | null
          hotel_makkah_stars?: number | null
          hotel_medina_stars?: number | null
          hotel_medinah?: string | null
          id?: string
          makkah_nights?: number | null
          medina_nights?: number | null
          month_departure?: string
          notes?: string | null
          offer_title?: string
          offer_url?: string
          price_eur?: number
          scraped_at?: string
          source_hash?: string
          status?: string
          updated_at?: string
          visa_included?: boolean | null
        }
        Relationships: []
      }
      omra_scraper_config: {
        Row: {
          agency_name: string
          agency_url: string
          api_config: Json | null
          created_at: string
          error_count: number | null
          id: string
          is_active: boolean | null
          last_scrape_at: string | null
          last_scrape_status: string | null
          rate_limit_ms: number | null
          respect_robots: boolean | null
          scraper_type: string
          selectors: Json | null
          updated_at: string
        }
        Insert: {
          agency_name: string
          agency_url: string
          api_config?: Json | null
          created_at?: string
          error_count?: number | null
          id?: string
          is_active?: boolean | null
          last_scrape_at?: string | null
          last_scrape_status?: string | null
          rate_limit_ms?: number | null
          respect_robots?: boolean | null
          scraper_type?: string
          selectors?: Json | null
          updated_at?: string
        }
        Update: {
          agency_name?: string
          agency_url?: string
          api_config?: Json | null
          created_at?: string
          error_count?: number | null
          id?: string
          is_active?: boolean | null
          last_scrape_at?: string | null
          last_scrape_status?: string | null
          rate_limit_ms?: number | null
          respect_robots?: boolean | null
          scraper_type?: string
          selectors?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      omra_scraper_logs: {
        Row: {
          agency_name: string
          completed_at: string | null
          duration_ms: number | null
          error_details: Json | null
          id: string
          offers_added: number | null
          offers_errors: number | null
          offers_scraped: number | null
          offers_updated: number | null
          run_id: string
          started_at: string
          status: string
        }
        Insert: {
          agency_name: string
          completed_at?: string | null
          duration_ms?: number | null
          error_details?: Json | null
          id?: string
          offers_added?: number | null
          offers_errors?: number | null
          offers_scraped?: number | null
          offers_updated?: number | null
          run_id: string
          started_at?: string
          status: string
        }
        Update: {
          agency_name?: string
          completed_at?: string | null
          duration_ms?: number | null
          error_details?: Json | null
          id?: string
          offers_added?: number | null
          offers_errors?: number | null
          offers_scraped?: number | null
          offers_updated?: number | null
          run_id?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      omra_update_runs: {
        Row: {
          agency_results: Json | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          offers_fetched: number | null
          offers_rejected: number | null
          offers_validated: number | null
          run_type: string
          started_at: string
          status: string
          swap_executed: boolean | null
        }
        Insert: {
          agency_results?: Json | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          offers_fetched?: number | null
          offers_rejected?: number | null
          offers_validated?: number | null
          run_type?: string
          started_at?: string
          status?: string
          swap_executed?: boolean | null
        }
        Update: {
          agency_results?: Json | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          offers_fetched?: number | null
          offers_rejected?: number | null
          offers_validated?: number | null
          run_type?: string
          started_at?: string
          status?: string
          swap_executed?: boolean | null
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          profile_id: string
          user_agent: string | null
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown
          profile_id: string
          user_agent?: string | null
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
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
          professional_email: string | null
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
          professional_email?: string | null
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
          professional_email?: string | null
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
      review_replies: {
        Row: {
          ad_owner_id: string
          created_at: string
          id: string
          reply_text: string
          review_id: string
          updated_at: string
        }
        Insert: {
          ad_owner_id: string
          created_at?: string
          id?: string
          reply_text: string
          review_id: string
          updated_at?: string
        }
        Update: {
          ad_owner_id?: string
          created_at?: string
          id?: string
          reply_text?: string
          review_id?: string
          updated_at?: string
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
      role_audit_log: {
        Row: {
          action_timestamp: string
          admin_user_id: string
          id: string
          ip_address: unknown
          new_role: Database["public"]["Enums"]["app_role"]
          old_role: Database["public"]["Enums"]["app_role"] | null
          target_user_id: string
          user_agent: string | null
        }
        Insert: {
          action_timestamp?: string
          admin_user_id: string
          id?: string
          ip_address?: unknown
          new_role: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          target_user_id: string
          user_agent?: string | null
        }
        Update: {
          action_timestamp?: string
          admin_user_id?: string
          id?: string
          ip_address?: unknown
          new_role?: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          target_user_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      scraping_attempts: {
        Row: {
          blocked_reason: string | null
          created_at: string
          first_seen_at: string
          id: string
          ip_address: unknown
          is_blocked: boolean | null
          last_seen_at: string
          request_count: number | null
          request_path: string
          user_agent: string | null
        }
        Insert: {
          blocked_reason?: string | null
          created_at?: string
          first_seen_at?: string
          id?: string
          ip_address: unknown
          is_blocked?: boolean | null
          last_seen_at?: string
          request_count?: number | null
          request_path: string
          user_agent?: string | null
        }
        Update: {
          blocked_reason?: string | null
          created_at?: string
          first_seen_at?: string
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          last_seen_at?: string
          request_count?: number | null
          request_path?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      topic_requests: {
        Row: {
          created_at: string
          description: string | null
          id: string
          justification: string | null
          requested_by: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          theme: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          justification?: string | null
          requested_by: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          theme: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          justification?: string | null
          requested_by?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          theme?: string
          title?: string
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
      weather_data: {
        Row: {
          city: string
          created_at: string
          description: string
          humidity: number | null
          icon: string | null
          id: string
          last_updated: string
          temp_max: number | null
          temp_min: number | null
          temperature: number
          wind_speed: number | null
        }
        Insert: {
          city: string
          created_at?: string
          description: string
          humidity?: number | null
          icon?: string | null
          id?: string
          last_updated?: string
          temp_max?: number | null
          temp_min?: number | null
          temperature: number
          wind_speed?: number | null
        }
        Update: {
          city?: string
          created_at?: string
          description?: string
          humidity?: number | null
          icon?: string | null
          id?: string
          last_updated?: string
          temp_max?: number | null
          temp_min?: number | null
          temperature?: number
          wind_speed?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize_admin_device: {
        Args: {
          p_action: string
          p_authorizer_id: string
          p_expiry_days?: number
          p_notes?: string
          p_request_id: string
        }
        Returns: Json
      }
      authorize_admin_device_auto: {
        Args: {
          p_admin_user_id: string
          p_device_fingerprint: string
          p_expiry_days?: number
          p_ip_address: unknown
          p_user_agent: string
        }
        Returns: Json
      }
      check_admin_code_rate_limit: {
        Args: { p_user_id: string }
        Returns: Json
      }
      check_admin_device_fingerprint: {
        Args: {
          p_device_fingerprint: string
          p_ip_address: unknown
          p_user_agent: string
          p_user_id: string
        }
        Returns: Json
      }
      check_device_authorization: {
        Args: { p_admin_user_id: string; p_device_fingerprint: string }
        Returns: Json
      }
      cleanup_expired_admin_codes: { Args: never; Returns: undefined }
      cleanup_old_admin_codes: { Args: never; Returns: undefined }
      generate_blog_slug: {
        Args: { post_id?: string; title_text: string }
        Returns: string
      }
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
      get_last_successful_update: { Args: never; Returns: Json }
      get_next_scheduled_update: { Args: never; Returns: string }
      get_omra_offers: {
        Args: {
          filter_city?: string
          filter_formula?: string
          filter_month?: string
          max_distance?: number
          max_price?: number
          min_duration?: number
          min_price?: number
        }
        Returns: {
          agency_name: string
          agency_url: string
          board: string
          date_end: string
          date_start: string
          departure_city: string
          distance_to_haram_m: number
          duration_nights: number
          flights_included: boolean
          formula_type: string
          hotel_makkah: string
          hotel_medinah: string
          id: string
          makkah_nights: number
          medina_nights: number
          month_departure: string
          offer_title: string
          offer_url: string
          price_eur: number
          visa_included: boolean
        }[]
      }
      get_public_profile: {
        Args: { profile_id: string }
        Returns: {
          bio: string
          company_name: string
          created_at: string
          experience_years: number
          facebook: string
          first_name: string
          full_name: string
          id: string
          instagram: string
          is_professional: boolean
          languages_spoken: string[]
          profile_image: string
          profile_views: number
          slug: string
          specialties: string[]
          updated_at: string
          website: string
        }[]
      }
      get_public_profiles: {
        Args: { limit_count?: number; offset_count?: number }
        Returns: {
          bio: string
          company_name: string
          created_at: string
          experience_years: number
          facebook: string
          first_name: string
          full_name: string
          id: string
          instagram: string
          is_professional: boolean
          languages_spoken: string[]
          profile_image: string
          profile_views: number
          slug: string
          specialties: string[]
          updated_at: string
          website: string
        }[]
      }
      get_recent_role_changes: {
        Args: { limit_count?: number }
        Returns: {
          action_timestamp: string
          admin_email: string
          ip_address: unknown
          new_role: Database["public"]["Enums"]["app_role"]
          old_role: Database["public"]["Enums"]["app_role"]
          target_email: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_airline_usage: {
        Args: { p_airline_name: string }
        Returns: undefined
      }
      increment_hotel_usage: {
        Args: { p_city: string; p_hotel_name: string; p_stars: number }
        Returns: undefined
      }
      increment_profile_views: { Args: { profile_id: string }; Returns: number }
      is_ad_expired: { Args: { publish_end_date: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      mark_stale_omra_offers: { Args: never; Returns: number }
      request_device_authorization: {
        Args: {
          p_admin_user_id: string
          p_device_fingerprint: string
          p_ip_address: unknown
          p_user_agent: string
        }
        Returns: string
      }
      secure_role_change: {
        Args: {
          admin_ip?: unknown
          admin_user_agent?: string
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: Json
      }
      should_auto_delete_ad: {
        Args: { publish_end_date: string }
        Returns: boolean
      }
      verify_admin_session: {
        Args: {
          p_current_ip: unknown
          p_session_token: string
          p_user_id: string
        }
        Returns: Json
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
        | "topic_request"
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
        "topic_request",
      ],
    },
  },
} as const
