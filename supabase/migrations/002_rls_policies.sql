-- Migration 002: Row Level Security policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own; admins read all
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Farmer profiles
CREATE POLICY "Farmers manage own profile" ON farmer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Crop analyses: farmers own their analyses
CREATE POLICY "Farmers manage own analyses" ON crop_analyses
  FOR ALL USING (auth.uid() = farmer_id);

-- Listings: anyone reads active; farmers manage own
CREATE POLICY "Public read active listings" ON crop_listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Farmers manage own listings" ON crop_listings
  FOR ALL USING (auth.uid() = farmer_id);

-- Inquiries: buyers create; farmers/buyers read own
CREATE POLICY "Buyers create inquiries" ON marketplace_inquiries
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users read related inquiries" ON marketplace_inquiries
  FOR SELECT USING (
    auth.uid() = buyer_id OR
    EXISTS (
      SELECT 1 FROM crop_listings
      WHERE crop_listings.id = marketplace_inquiries.listing_id
      AND crop_listings.farmer_id = auth.uid()
    )
  );

-- Public read for schemes, news, alerts, market prices
ALTER TABLE gov_schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read schemes" ON gov_schemes FOR SELECT USING (is_active = true);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read news" ON news_articles FOR SELECT USING (true);

ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read alerts" ON emergency_alerts FOR SELECT USING (is_active = true);

ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read prices" ON market_prices FOR SELECT USING (true);

-- Chat: users own sessions
CREATE POLICY "Users manage own chat" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users read own messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );
