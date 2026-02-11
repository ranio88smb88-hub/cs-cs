
import { GoogleGenAI, Type } from "@google/genai";
import { SheetRow } from "../types";

export const analyzeSheetData = async (data: SheetRow[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this CRM data from a spreadsheet and provide business insights in JSON format.
  Data: ${JSON.stringify(data)}
  
  Focus on:
  - Total potential value
  - Conversion trends
  - Specific suggestions to improve sales.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          trend: { 
            type: Type.STRING,
            description: "One of: positive, negative, neutral"
          }
        },
        required: ["summary", "suggestions", "trend"]
      }
    }
  });

  return JSON.parse(response.text);
};
