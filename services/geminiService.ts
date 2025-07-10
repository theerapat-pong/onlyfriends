import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// This service is now stateless, no global variables needed.

export const getBotResponse = async (message: string): Promise<string> => {
  // The API key MUST be obtained from process.env.API_KEY as per guidelines.
  // This variable must be set in the execution environment.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable is not set. This is a required configuration.");
    throw new Error("API key for the bot is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const systemInstruction = `You are an assistant bot in a chat room called "onlyfriends". Your name is Gemini Bot.
- You interact with users based on commands they send.
- You will receive pre-validated commands. Your primary role is to provide a confirmation message in Thai.
- If you receive a message like "/setrank [ชื่อสี] [UID]", you MUST respond with: "ดำเนินการเปลี่ยนสีให้ [UID] เป็น [ชื่อสี] เรียบร้อยแล้ว". For example, for "/setrank สีแดง M1NT23", you respond "ดำเนินการเปลี่ยนสีให้ M1NT23 เป็นสีแดงเรียบร้อยแล้ว".
- For any other command starting with "/", respond helpfully and concisely.
- You MUST IGNORE all messages that DO NOT start with a forward slash "/". Do not respond to general chat.
- Your responses should be in a neutral, helpful tone.`;
  
  // The calling code in ChatRoom.tsx already ensures only commands are sent.
  // This check is a safeguard.
  if (!message.startsWith('/')) {
    return '';
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // Using response.text directly as per guidelines.
    return response.text;
  } catch (e) {
    console.error("Error calling Gemini API:", e);
    // Re-throw the error to be handled by the calling function in ChatRoom.tsx
    throw new Error("Failed to get response from bot.");
  }
};
