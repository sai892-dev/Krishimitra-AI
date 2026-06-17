-- KrishiMitra AI — Andhra Pradesh agriculture platform
-- Migration 001: Core schema

CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');
CREATE TYPE alert_type AS ENUM ('weather', 'cyclone', 'pest');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'expired');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'farmer',
  full_name TEXT NOT NULL,
  phone TEXT,
  district TEXT,
  state TEXT DEFAULT 'Andhra Pradesh',
  preferred_language TEXT DEFAULT 'te' CHECK (preferred_language IN ('en', 'te')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE farmer_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  land_size_acres DECIMAL(10,2),
  primary_crops TEXT[] DEFAULT '{}',
  soil_type TEXT,
  irrigation_type TEXT,
  farming_since INT,
  location_lat DECIMAL(9,6),
  location_lng DECIMAL(9,6),
  village TEXT,
  mandal TEXT
);

CREATE TABLE buyer_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  business_type TEXT
);

CREATE TABLE crop_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES profiles(id),
  image_url TEXT NOT NULL,
  crop_type TEXT,
  disease_name TEXT,
  confidence DECIMAL(5,2),
  severity TEXT,
  treatment_recommendations JSONB,
  raw_ai_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gov_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_te TEXT,
  ministry TEXT,
  category TEXT,
  state TEXT DEFAULT 'Andhra Pradesh',
  eligibility_criteria JSONB,
  benefits TEXT,
  application_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scheme_bookmarks (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scheme_id UUID REFERENCES gov_schemes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, scheme_id)
);

CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_te TEXT,
  summary TEXT,
  summary_te TEXT,
  category TEXT,
  source TEXT,
  source_url TEXT,
  published_at TIMESTAMPTZ,
  district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crop_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES profiles(id),
  crop_name TEXT NOT NULL,
  variety TEXT,
  quantity_kg DECIMAL(12,2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  expected_price_per_kg DECIMAL(10,2) NOT NULL,
  description TEXT,
  status listing_status DEFAULT 'active',
  harvest_date DATE,
  district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES crop_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE marketplace_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES crop_listings(id),
  buyer_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name TEXT NOT NULL,
  market_name TEXT NOT NULL,
  district TEXT,
  price_per_quintal DECIMAL(10,2) NOT NULL,
  recorded_date DATE NOT NULL,
  UNIQUE (crop_name, market_name, recorded_date)
);

CREATE TABLE price_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name TEXT NOT NULL,
  market_name TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  predicted_price DECIMAL(10,2),
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  confidence DECIMAL(5,2),
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE emergency_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type alert_type NOT NULL,
  severity alert_severity NOT NULL,
  title TEXT NOT NULL,
  title_te TEXT,
  message TEXT NOT NULL,
  message_te TEXT,
  affected_districts TEXT[],
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  recommendation_type TEXT,
  content JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_listings_district ON crop_listings(district) WHERE status = 'active';
CREATE INDEX idx_market_prices_crop_date ON market_prices(crop_name, recorded_date DESC);
CREATE INDEX idx_alerts_active ON emergency_alerts(is_active, valid_until);
