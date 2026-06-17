/** Andhra Pradesh regional constants — single source for filters, forms, and seed data */

export const AP_STATE = "Andhra Pradesh";

export const AP_DISTRICTS = [
  "Anantapur",
  "Chittoor",
  "East Godavari",
  "Guntur",
  "Krishna",
  "Kurnool",
  "Nellore",
  "Prakasam",
  "Srikakulam",
  "Visakhapatnam",
  "Vizianagaram",
  "West Godavari",
  "YSR Kadapa",
] as const;

export type APDistrict = (typeof AP_DISTRICTS)[number];

export const AP_CROPS = [
  { en: "Paddy", te: "బియ్యం", value: "paddy" },
  { en: "Cotton", te: "పత్తి", value: "cotton" },
  { en: "Chilli", te: "మిరప", value: "chilli" },
  { en: "Turmeric", te: "పసుపు", value: "turmeric" },
  { en: "Groundnut", te: "వేరుశనగ", value: "groundnut" },
  { en: "Maize", te: "మొక్కజొన్న", value: "maize" },
  { en: "Sugarcane", te: "చెరకు", value: "sugarcane" },
  { en: "Mango", te: "మామిడి", value: "mango" },
  { en: "Banana", te: "అరటి", value: "banana" },
] as const;

export const AP_MARKETS = [
  { name: "Guntur Chilli Market", district: "Guntur", crop: "chilli" },
  { name: "Vijayawada Rythu Bazar", district: "Krishna", crop: "paddy" },
  { name: "Kurnool Market Yard", district: "Kurnool", crop: "cotton" },
  { name: "Visakhapatnam APMC", district: "Visakhapatnam", crop: "paddy" },
  { name: "Tenali Market", district: "Guntur", crop: "paddy" },
] as const;

/** District HQ coordinates for Open-Meteo weather API */
export const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  Krishna: { lat: 16.51, lng: 80.65 },
  Guntur: { lat: 16.3, lng: 80.44 },
  "East Godavari": { lat: 17.0, lng: 81.78 },
  "West Godavari": { lat: 16.71, lng: 81.1 },
  Visakhapatnam: { lat: 17.69, lng: 83.22 },
  Kurnool: { lat: 15.83, lng: 78.05 },
  Anantapur: { lat: 14.68, lng: 77.6 },
  Chittoor: { lat: 13.22, lng: 79.1 },
  Nellore: { lat: 14.44, lng: 79.99 },
  Prakasam: { lat: 15.48, lng: 80.05 },
  Srikakulam: { lat: 18.29, lng: 83.9 },
  Vizianagaram: { lat: 18.11, lng: 83.4 },
  "YSR Kadapa": { lat: 14.47, lng: 78.82 },
};

export const USER_ROLES = ["farmer", "buyer", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
