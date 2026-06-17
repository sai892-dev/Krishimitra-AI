-- Migration 003: Andhra Pradesh seed data

INSERT INTO gov_schemes (title, title_te, ministry, category, state, benefits, eligibility_criteria, application_url) VALUES
('YSR Rythu Bharosa', 'YSR రైతు భరోసా', 'Government of AP', 'Income Support', 'Andhra Pradesh', '₹13,500 per year in three installments', '{"landholder": true, "ap_resident": true}', 'https://rythubharosa.ap.gov.in'),
('PM-KISAN', 'PM-KISAN', 'Ministry of Agriculture', 'Central Scheme', 'Andhra Pradesh', '₹6,000 per year in three installments', '{"landholder": true}', 'https://pmkisan.gov.in'),
('YSR Free Crop Insurance', 'YSR ఉచిత పంట బీమా', 'Government of AP', 'Insurance', 'Andhra Pradesh', 'Free crop insurance for notified crops', '{"ap_farmer": true}', NULL),
('AP Micro Irrigation Project', 'AP సూక్ష్మ నీటిపారుదల', 'Government of AP', 'Irrigation', 'Andhra Pradesh', 'Up to 90% subsidy for drip/sprinkler', '{"min_land": 0.5}', NULL);

INSERT INTO news_articles (title, title_te, summary, summary_te, category, source, district, published_at) VALUES
('Paddy procurement begins in Krishna district', 'కృష్ణా జిల్లాలో బియ్యం కొనుగోలు ప్రారంభం', 'AP Markfed opened 45 procurement centres for Sona Masuri paddy at MSP.', 'సోనా మసూరి బియ్యానికి 45 కొనుగోలు కేంద్రాలు.', 'Procurement', 'AP Agriculture Dept', 'Krishna', NOW() - INTERVAL '2 days'),
('Guntur chilli prices surge on export demand', 'గుంటూరు మిరప ధరలు పెరిగాయి', 'Teja variety sees strong export demand.', 'టేజా మిరపకు ఎగుమతి డిమాండ్.', 'Market', 'Guntur Market Yard', 'Guntur', NOW() - INTERVAL '3 days');

INSERT INTO emergency_alerts (type, severity, title, title_te, message, message_te, affected_districts, valid_until) VALUES
('weather', 'warning', 'Heat wave warning for Rayalaseema', 'రాయలసీమలో వేడి גלwave', 'Temperatures up to 44°C expected.', '44°C వరకు ఉష్ణోగ్రత.', ARRAY['Kurnool', 'Anantapur'], NOW() + INTERVAL '5 days'),
('pest', 'critical', 'Fall armyworm in Guntur chilli', 'గుంటూరు మిరపలో armyworm', 'Immediate scouting recommended.', 'తక్షణ పరిశీలన.', ARRAY['Guntur'], NOW() + INTERVAL '7 days');

-- Sample market prices (chilli, Guntur — last 30 days)
INSERT INTO market_prices (crop_name, market_name, district, price_per_quintal, recorded_date)
SELECT 'Chilli', 'Guntur Chilli Market', 'Guntur', 12000 + (random() * 1000)::int, (CURRENT_DATE - (n || ' days')::interval)::date
FROM generate_series(0, 29) AS n;
