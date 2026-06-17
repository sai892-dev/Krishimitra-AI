import { GoogleGenerativeAI } from "@google/generative-ai";
import { isGeminiConfigured } from "@/lib/utils";

let genAI: GoogleGenerativeAI | null = null;

function getClient() {
  if (!isGeminiConfigured()) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  return genAI;
}

export async function generateText(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const client = getClient();
  if (!client) {
    return "AI service not configured. Add GEMINI_API_KEY to enable this feature.";
  }

  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction,
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function analyzeCropImage(
  base64Image: string,
  mimeType: string
): Promise<string> {
  const client = getClient();
  if (!client) {
    return JSON.stringify({
      disease_name: "Leaf Curl Virus",
      confidence: 85,
      severity: "medium",
      crop_type: "Chilli",
      treatment: {
        immediate: ["Remove infected leaves", "Apply neem oil spray"],
        preventive: ["Use virus-free seedlings", "Control whiteflies"],
        organic: ["Garlic-chilli extract spray"],
      },
      demo: true,
    });
  }

  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `You are an agricultural plant pathologist for Andhra Pradesh, India.
Analyze this crop leaf image. Respond ONLY with valid JSON (no markdown):
{
  "disease_name": string,
  "confidence": number (0-100),
  "severity": "low"|"medium"|"high",
  "crop_type": string,
  "treatment": {
    "immediate": string[],
    "preventive": string[],
    "organic": string[]
  }
}`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType } },
  ]);
  return result.response.text();
}

export async function chatWithAssistant(
  messages: { role: string; content: string }[],
  language: "en" | "te",
  context?: string
): Promise<string> {
  const systemInstruction = `You are KrishiMitra, an agriculture advisor for Andhra Pradesh farmers.
Language preference: ${language === "te" ? "Respond primarily in Telugu with simple vocabulary" : "Respond in English"}.
Reference AP schemes (Rythu Bharosa, YSR Free Crop Insurance), local crops (paddy, chilli, cotton), and kharif/rabi seasons.
${context ? `Farmer context: ${context}` : ""}
Keep answers practical, concise, and actionable.`;

  const client = getClient();
  if (!client) {
    const lastMsg = messages[messages.length - 1]?.content ?? "";
    if (language === "te") {
      return `మీ ప్రశ్న "${lastMsg}" కోసం, AP రైతులకు స్థానిక వ్యవసాయ అధికారini సంప్రదించండి. Demo modeలో AI configure కాలేదు.`;
    }
    return `For "${lastMsg}", please contact your local agriculture officer. AI is not configured in demo mode.`;
  }

  const history = messages
    .slice(0, -1)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");
  const lastMessage = messages[messages.length - 1]?.content ?? "";

  return generateText(
    history ? `${history}\nuser: ${lastMessage}` : lastMessage,
    systemInstruction
  );
}

export async function explainScheme(
  schemeTitle: string,
  schemeDetails: string,
  language: "en" | "te",
  farmerProfile?: string
): Promise<string> {
  const langNote =
    language === "te"
      ? "Explain in simple Telugu that a rural farmer can understand."
      : "Explain in simple English for a small farmer.";

  return generateText(
    `${langNote}\n\nScheme: ${schemeTitle}\nDetails: ${schemeDetails}\n${farmerProfile ? `Farmer: ${farmerProfile}` : ""}\n\nProvide: 1) What it is 2) Who qualifies 3) How to apply 4) Expected benefit`,
    "You explain Indian government agriculture schemes clearly."
  );
}
