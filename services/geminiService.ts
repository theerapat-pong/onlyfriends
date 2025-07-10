import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chat: Chat | null = null;

function initializeChat() {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are an assistant bot in a chat room called "onlyfriends". Your name is Gemini Bot.
- You interact with users based on commands they send.
- You will receive pre-validated commands. Your primary role is to provide a confirmation message in Thai.
- If you receive a message like "/setrank [ชื่อสี] [UID]", you MUST respond with: "ดำเนินการเปลี่ยนสีให้ [UID] เป็น [ชื่อสี] เรียบร้อยแล้ว". For example, for "/setrank สีแดง M1NT23", you respond "ดำเนินการเปลี่ยนสีให้ M1NT23 เป็นสีแดงเรียบร้อยแล้ว".
- For any other command starting with "/", respond helpfully and concisely.
- You MUST IGNORE all messages that DO NOT start with a forward slash "/". Do not respond to general chat.
- Your responses should be in a neutral, helpful tone.`,
    },
  });
}

export const getBotResponse = async (message: string): Promise<string> => {
  if (!chat) {
    initializeChat();
  }

  if (!chat) {
    // This should not happen if initialization is correct.
    return "Error: Chat not initialized.";
  }
  
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text ?? '';
  } catch(e) {
    console.error("Error sending message to Gemini:", e);
    // In case of an error, re-initialize the chat for the next attempt
    initializeChat(); 
    throw new Error("Failed to get response from bot.");
  }
};