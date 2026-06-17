/**
 * Demo seed data for Andhra Pradesh MVP.
 * Used when Supabase is not configured — enables hackathon/demo without backend setup.
 */
import type {
  CropAnalysis,
  CropListing,
  EmergencyAlert,
  GovScheme,
  MarketPrice,
  NewsArticle,
  PriceForecast,
  Profile,
  Recommendation,
} from "@/types";

export const DEMO_USERS: Record<
  string,
  Profile & { password: string; farmer?: { land_size_acres: number; primary_crops: string[]; village: string; mandal: string } }
> = {
  "farmer@demo.ap": {
    id: "demo-farmer-001",
    role: "farmer",
    full_name: "Rama Rao",
    phone: "+91 9876543210",
    district: "Krishna",
    state: "Andhra Pradesh",
    preferred_language: "te",
    created_at: "2025-01-15T00:00:00Z",
    password: "demo1234",
    farmer: {
      land_size_acres: 3.5,
      primary_crops: ["paddy", "chilli"],
      village: "Vuyyuru",
      mandal: "Vuyyuru",
    },
  },
  "buyer@demo.ap": {
    id: "demo-buyer-001",
    role: "buyer",
    full_name: "Srinivas Traders",
    phone: "+91 9123456789",
    district: "Guntur",
    state: "Andhra Pradesh",
    preferred_language: "en",
    created_at: "2025-02-01T00:00:00Z",
    password: "demo1234",
  },
  "admin@demo.ap": {
    id: "demo-admin-001",
    role: "admin",
    full_name: "AP Agri Admin",
    phone: "+91 9000000001",
    district: "Krishna",
    state: "Andhra Pradesh",
    preferred_language: "en",
    created_at: "2025-01-01T00:00:00Z",
    password: "demo1234",
  },
};

export const DEMO_SCHEMES: GovScheme[] = [
  {
    id: "sch-001",
    title: "YSR Rythu Bharosa",
    title_te: "YSR రైతు భరోసా",
    ministry: "Government of AP",
    category: "Income Support",
    state: "Andhra Pradesh",
    benefits: "₹13,500 per year in three installments to eligible farmers",
    eligibility_criteria: { landholder: true, ap_resident: true },
    application_url: "https://rythubharosa.ap.gov.in",
    is_active: true,
  },
  {
    id: "sch-002",
    title: "PM-KISAN",
    title_te: "PM-KISAN",
    ministry: "Ministry of Agriculture",
    category: "Central Scheme",
    state: "Andhra Pradesh",
    benefits: "₹6,000 per year in three equal installments",
    eligibility_criteria: { landholder: true },
    application_url: "https://pmkisan.gov.in",
    is_active: true,
  },
  {
    id: "sch-003",
    title: "YSR Free Crop Insurance",
    title_te: "YSR ఉచిత పంట బీమా",
    ministry: "Government of AP",
    category: "Insurance",
    state: "Andhra Pradesh",
    benefits: "Free crop insurance coverage for notified crops",
    eligibility_criteria: { ap_farmer: true, notified_crop: true },
    is_active: true,
  },
  {
    id: "sch-004",
    title: "AP Micro Irrigation Project",
    title_te: "AP సూక్ష్మ నీటిపారుదల",
    ministry: "Government of AP",
    category: "Irrigation",
    state: "Andhra Pradesh",
    benefits: "Subsidy up to 90% for drip and sprinkler systems",
    eligibility_criteria: { min_land: 0.5, max_land: 25 },
    is_active: true,
  },
  {
    id: "sch-005",
    title: "Natural Farming Support",
    title_te: "సహజ వ్యవసాయ మద్దతు",
    ministry: "Government of AP",
    category: "Sustainable Farming",
    state: "Andhra Pradesh",
    benefits: "Training, inputs, and certification support for ZBNF",
    eligibility_criteria: { willing_to_convert: true },
    is_active: true,
  },
];

export const DEMO_NEWS: NewsArticle[] = [
  {
    id: "news-001",
    title: "Paddy procurement begins in Krishna district",
    title_te: "కృష్ణా జిల్లాలో బియ్యం కొనుగోలు ప్రారంభం",
    summary: "AP Markfed opened 45 procurement centres across Krishna district for Sona Masuri paddy at MSP.",
    summary_te: "సోనా మసూరి బియ్యానికి MSP వద్ద 45 కొనుగోలు కేంద్రాలు ప్రారంభించబడ్డాయి.",
    category: "Procurement",
    source: "AP Agriculture Dept",
    district: "Krishna",
    published_at: "2026-06-14T08:00:00Z",
  },
  {
    id: "news-002",
    title: "Guntur chilli prices surge 8% on export demand",
    title_te: "ఎగుమతి డిమాండ్‌తో గుంటూరు మిరప ధరలు 8% పెరిగాయి",
    summary: "Teja and 341 varieties see strong demand from spice exporters ahead of monsoon.",
    summary_te: "మాన్సూన్‌కు ముందు మసాలా ఎగుమతిదారుల నుండి బలమైన డిమాండ్.",
    category: "Market",
    source: "Guntur Market Yard",
    district: "Guntur",
    published_at: "2026-06-13T10:30:00Z",
  },
  {
    id: "news-003",
    title: "Fall armyworm alert for cotton in Kurnool",
    title_te: "కర్నూలు పత్తిలో ఫాల్ ఆర్మీవర్మ్ అప్రమత్తత",
    summary: "Agriculture officials advise farmers to scout fields twice weekly and apply recommended pesticides.",
    summary_te: "రైతులు వారానికి రెండుసార్లు పొలాలను పరిశీలించాలని అధికారుల సూచన.",
    category: "Pest Alert",
    source: "AP Agri Extension",
    district: "Kurnool",
    published_at: "2026-06-12T06:00:00Z",
  },
];

export const DEMO_LISTINGS: CropListing[] = [
  {
    id: "list-001",
    farmer_id: "demo-farmer-001",
    farmer_name: "Rama Rao",
    farmer_phone: "+91 9876543210",
    crop_name: "Paddy (Sona Masuri)",
    variety: "Sona Masuri",
    quantity_kg: 5000,
    expected_price_per_kg: 28,
    description: "Fresh harvest, properly dried. Available for pickup from Vuyyuru.",
    status: "active",
    district: "Krishna",
    created_at: "2026-06-10T00:00:00Z",
  },
  {
    id: "list-002",
    farmer_id: "demo-farmer-002",
    farmer_name: "Lakshmi Devi",
    farmer_phone: "+91 9988776655",
    crop_name: "Guntur Teja Chilli",
    variety: "Teja",
    quantity_kg: 2000,
    expected_price_per_kg: 95,
    description: "Premium grade dry chilli, sun-dried for 15 days.",
    status: "active",
    district: "Guntur",
    created_at: "2026-06-08T00:00:00Z",
  },
  {
    id: "list-003",
    farmer_id: "demo-farmer-003",
    farmer_name: "Venkat Reddy",
    farmer_phone: "+91 9876501234",
    crop_name: "Cotton",
    variety: "Bt Cotton",
    quantity_kg: 8000,
    expected_price_per_kg: 62,
    description: "Grade A cotton bales, ready for ginning.",
    status: "active",
    district: "Kurnool",
    created_at: "2026-06-05T00:00:00Z",
  },
];

export const DEMO_ALERTS: EmergencyAlert[] = [
  {
    id: "alert-001",
    type: "weather",
    severity: "warning",
    title: "Heat wave warning for Rayalaseema",
    title_te: "రాయలసీమలో వేడి గాలి హెచ్చరిక",
    message: "Temperatures expected to reach 44°C in Kurnool and Anantapur. Avoid midday field work.",
    message_te: "కర్నూలు, అనంతపురంలో 44°C వరకు ఉష్ణోగ్రత. మధ్యాహ్నం పంట పనులు నివారించండి.",
    affected_districts: ["Kurnool", "Anantapur", "YSR Kadapa"],
    valid_until: "2026-06-18T00:00:00Z",
  },
  {
    id: "alert-002",
    type: "pest",
    severity: "critical",
    title: "Fall armyworm detected in Guntur chilli fields",
    title_te: "గుంటూరు మిరప పొలాల్లో ఫాల్ ఆర్మీవర్మ్",
    message: "Immediate scouting recommended. Contact local agriculture officer for treatment guidance.",
    message_te: "తక్షణ పరిశీలన అవసరం. చికిత్సకు స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి.",
    affected_districts: ["Guntur", "Prakasam"],
    valid_until: "2026-06-20T00:00:00Z",
  },
  {
    id: "alert-003",
    type: "cyclone",
    severity: "info",
    title: "Monsoon onset expected along north coastal AP",
    title_te: "ఉత్తర తీర AP లో మాన్సూన్ ప్రారంభం",
    message: "Prepare drainage in paddy fields. Secure nursery beds in Visakhapatnam and Srikakulam.",
    message_te: "బియ్యం పొలాల్లో drainage సిద్ధం చేయండి. నర్సరీలను సురక్షితం చేయండి.",
    affected_districts: ["Visakhapatnam", "Srikakulam", "Vizianagaram"],
    valid_until: "2026-06-25T00:00:00Z",
  },
];

export const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-001",
    type: "crop",
    title: "Consider micro-irrigation subsidy",
    title_te: "సూక్ష్మ నీటిపారుదల subsidy consider చేయండి",
    description: "Your profile matches AP Micro Irrigation Project. Drip saves 40% water for chilli.",
    description_te: "AP Micro Irrigation Projectకు మీ profile అర్హత. మిరపకు 40% నీళ్ల ఆదా.",
  },
  {
    id: "rec-002",
    type: "market",
    title: "Chilli prices trending up in Guntur",
    title_te: "గుంటూరులో మిరప ధరలు పెరుగుతున్నాయి",
    description: "Hold harvest for 1-2 weeks if storage available. Export demand is strong.",
    description_te: "నిల్వ ఉంటే 1-2 వారాలు hold చేయండి. Export demand బలంగా ఉంది.",
  },
  {
    id: "rec-003",
    type: "scheme",
    title: "Rythu Bharosa next installment due",
    title_te: "రైతు భరోసా తదుపరి installment",
    description: "Ensure Aadhaar-linked bank account is updated before June 30.",
    description_te: "జూన్ 30కి ముందు Aadhaar-linked bank account update చేయండి.",
  },
];

/** Generate 90 days of historical market prices for charts */
export function generateMarketHistory(
  crop: string,
  market: string,
  district: string,
  basePrice: number
): MarketPrice[] {
  const prices: MarketPrice[] = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const noise = Math.sin(i / 7) * basePrice * 0.05 + (Math.random() - 0.5) * basePrice * 0.03;
    prices.push({
      crop_name: crop,
      market_name: market,
      district,
      price_per_quintal: Math.round(basePrice + noise),
      recorded_date: d.toISOString().split("T")[0],
    });
  }
  return prices;
}

export function generatePriceForecast(
  crop: string,
  market: string,
  lastPrice: number
): PriceForecast[] {
  const forecasts: PriceForecast[] = [];
  const today = new Date();
  let price = lastPrice;
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const change = (Math.random() - 0.45) * lastPrice * 0.02;
    price = Math.round(price + change);
    forecasts.push({
      crop_name: crop,
      market_name: market,
      forecast_date: d.toISOString().split("T")[0],
      predicted_price: price,
      trend: change > 50 ? "up" : change < -50 ? "down" : "stable",
      confidence: 75 + Math.random() * 15,
    });
  }
  return forecasts;
}

export const DEMO_MARKET_HISTORY = generateMarketHistory(
  "Chilli",
  "Guntur Chilli Market",
  "Guntur",
  12500
);

export const DEMO_PRICE_FORECAST = generatePriceForecast(
  "Chilli",
  "Guntur Chilli Market",
  DEMO_MARKET_HISTORY[DEMO_MARKET_HISTORY.length - 1].price_per_quintal
);

/** In-memory store for demo crop analyses (persists per server instance) */
export const demoAnalysesStore: CropAnalysis[] = [];

export const DEMO_CROP_ANALYSIS_RESULT = {
  disease_name: "Leaf Curl Virus",
  confidence: 87.5,
  severity: "medium" as const,
  crop_type: "Chilli",
  treatment: {
    immediate: [
      "Remove and destroy infected leaves",
      "Apply neem oil spray (5ml/L) every 7 days",
    ],
    preventive: [
      "Use virus-free seedlings",
      "Control whitefly population with yellow sticky traps",
    ],
    organic: [
      "Spray garlic-chilli extract solution",
      "Maintain field sanitation",
    ],
  },
};
