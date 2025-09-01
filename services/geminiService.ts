import { GoogleGenAI, Type } from "@google/genai";
import { Client } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const parseClientInfo = async (text: string): Promise<Client> => {
  if (!text.trim()) {
    return { name: '' };
  }

  const prompt = `
    Extraia o nome do cliente do texto a seguir.
    Se a informação estiver faltando, deixe o campo correspondente como uma string vazia.
    
    Texto: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The full name of the client.",
            },
          },
          required: ["name"],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    return jsonResponse as Client;
    
  } catch (error) {
    console.error("Erro ao analisar informações do cliente com a API Gemini:", error);
    throw new Error("Falha ao analisar as informações do cliente. Tente novamente ou insira manualmente.");
  }
};