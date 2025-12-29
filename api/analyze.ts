import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing on server" });
    }

    const { transactions } = req.body;

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze these personal spending transactions (amounts are in Indian Rupees - INR) and provide psychological insights.

    Focus on:
    1. Impulse spending
    2. Post-payday splurges
    3. Weekend overspending
    4. Late-night purchases
    5. Subscription fatigue

    Transactions:
    ${transactions.map((t: any) =>
      `${t.date} | ₹${t.amount} | ${t.category} | ${t.description}`
    ).join("\n")}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            profile: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                primaryTrait: { type: Type.STRING },
                riskLevel: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ["score", "primaryTrait", "riskLevel", "summary"],
            },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  tag: { type: Type.STRING },
                },
                required: ["title", "description", "severity", "tag"],
              },
            },
            psychologicalProfile: {
              type: Type.STRING,
            },
          },
          required: ["profile", "insights", "psychologicalProfile"],
        },
      },
    });

    res.status(200).json(JSON.parse(response.text ?? "{}"));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
