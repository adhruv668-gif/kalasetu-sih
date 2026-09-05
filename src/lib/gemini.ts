import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({ apiKey });

export const extractProductDetails = async (transcript: string) => {
  if (!apiKey) throw new Error("Gemini API key not configured");

  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: `Extract the following product details from this artisan's spoken description: "${transcript}". 
      Return JSON with these exact keys: title, description, category, tags (comma separated string), materialsCost (number or 0), laborHours (number or 0).
      Ensure the description sounds professional but authentic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          tags: { type: Type.STRING },
          materialsCost: { type: Type.NUMBER },
          laborHours: { type: Type.NUMBER }
        },
        required: ["title", "description", "category", "tags", "materialsCost", "laborHours"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const extractProductDetailsFromImage = async (base64Image: string, mimeType: string) => {
  if (!apiKey) throw new Error("Gemini API key not configured");

  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: [
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      },
      "Look at this image of an artisan's handmade product. Generate a professional product title, description, appropriate category, and tags (comma separated). For materialsCost and laborHours, make a very rough guess if you can tell, otherwise return 0."
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          tags: { type: Type.STRING },
          materialsCost: { type: Type.NUMBER },
          laborHours: { type: Type.NUMBER }
        },
        required: ["title", "description", "category", "tags", "materialsCost", "laborHours"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
