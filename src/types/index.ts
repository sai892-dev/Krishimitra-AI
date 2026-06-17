import type { UserRole, APDistrict } from "@/lib/constants/ap";
import type { Language } from "@/lib/i18n/translations";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  district?: APDistrict | string;
  state: string;
  preferred_language: Language;
  avatar_url?: string;
  created_at: string;
}

export interface FarmerProfile {
  user_id: string;
  land_size_acres?: number;
  primary_crops: string[];
  soil_type?: string;
  irrigation_type?: string;
  village?: string;
  mandal?: string;
  location_lat?: number;
  location_lng?: number;
}

export interface CropAnalysis {
  id: string;
  farmer_id: string;
  image_url: string;
  crop_type?: string;
  disease_name?: string;
  confidence?: number;
  severity?: string;
  treatment_recommendations?: {
    immediate: string[];
    preventive: string[];
    organic: string[];
  };
  created_at: string;
}

export interface GovScheme {
  id: string;
  title: string;
  title_te?: string;
  ministry?: string;
  category?: string;
  state: string;
  eligibility_criteria?: Record<string, unknown>;
  benefits?: string;
  application_url?: string;
  is_active: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  title_te?: string;
  summary?: string;
  summary_te?: string;
  category?: string;
  source?: string;
  source_url?: string;
  published_at?: string;
  district?: string;
}

export interface CropListing {
  id: string;
  farmer_id: string;
  farmer_name?: string;
  farmer_phone?: string;
  crop_name: string;
  variety?: string;
  quantity_kg: number;
  expected_price_per_kg: number;
  description?: string;
  status: "active" | "sold" | "expired";
  district?: string;
  image_urls?: string[];
  created_at: string;
}

export interface MarketPrice {
  crop_name: string;
  market_name: string;
  district: string;
  price_per_quintal: number;
  recorded_date: string;
}

export interface PriceForecast {
  crop_name: string;
  market_name: string;
  forecast_date: string;
  predicted_price: number;
  trend: "up" | "down" | "stable";
  confidence: number;
}

export interface EmergencyAlert {
  id: string;
  type: "weather" | "cyclone" | "pest";
  severity: "info" | "warning" | "critical";
  title: string;
  title_te?: string;
  message: string;
  message_te?: string;
  affected_districts: string[];
  valid_until?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    description: string;
  };
  forecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    description: string;
  }>;
  district: string;
}

export interface Recommendation {
  id: string;
  type: string;
  title: string;
  title_te?: string;
  description: string;
  description_te?: string;
}
