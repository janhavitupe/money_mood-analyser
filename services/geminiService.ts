
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AnalysisResult } from "../types";

export const analyzeSpendingPatterns = async (transactions: Transaction[]): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is missing. Please ensure the environment variable is set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze these personal spending transactions (amounts are in Indian Rupees - INR) and provide psychological insights. 
  Focus on behavior patterns common in urban India:
  1. Impulse spending (Quick UPI transfers, small irregular shopping)
  2. Post-payday splurges (Big purchases right after the 1st of the month)
  3. Weekend overspending (Heavy Zomato/Swiggy or dining on Sat/Sun)
  4. Late-night purchases (Spending between 11PM and 5AM on apps)
  5. Subscription fatigue (Small recurring monthly charges)

  Transactions:
  ${transactions.map(t => `${t.date} | ₹${t.amount} | ${t.category} | ${t.description}`).join('\n')}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          profile: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: 'Discipline score 0-100' },
              primaryTrait: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ['score', 'primaryTrait', 'riskLevel', 'summary']
          },
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING },
                tag: { type: Type.STRING }
              },
              required: ['title', 'description', 'severity', 'tag']
            }
          },
          psychologicalProfile: {
            type: Type.STRING,
            description: 'A few paragraphs explaining the psychology behind the user behavior in a modern Indian context.'
          }
        },
        required: ['profile', 'insights', 'psychologicalProfile']
      }
    }
  });

  if (!response.text) {
    throw new Error("Empty response from AI model");
  }

  return JSON.parse(response.text);
};
