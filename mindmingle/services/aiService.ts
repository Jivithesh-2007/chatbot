import { GoogleGenAI, Content } from "@google/genai";
import { Message } from "../types";

// FIX: Initialize the Google GenAI client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Replaced mock AI response with a call to the Gemini API.
// The function now takes chat history for contextual responses.
export const generateAiResponse = async (
  history: Message[],
  newPrompt: string
): Promise<string> => {
  try {
    const contents: Content[] = history
      .filter((m) => m.content && !m.isTyping)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    contents.push({ role: "user", parts: [{ text: newPrompt }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    const text = response.text;
    if (text) {
      return text;
    } else {
      return "I'm sorry, I couldn't generate a response. Please try again.";
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "An error occurred while getting a response from the AI.";
  }
};
