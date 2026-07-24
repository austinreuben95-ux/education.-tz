import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';

// Safely initialize the client
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const sendMessageToYun = async (
  prompt: string, 
  history: { role: 'user' | 'model', text: string }[]
): Promise<string> => {
  if (!ai) {
    return "Jambo! It looks like my API key is missing. Please configure it to chat with me.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct history for context
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `You are Yun, an advanced, highly intelligent AI Tutor and Curiosity Catalyst built like Gemini and ChatGPT, specialized for Tanzanian students from Primary (Grade 1-7), O-Level Secondary (Form 1-4), and High School A-Level (Form 5-6).

Your Identity & Persona:
- You operate like Gemini and ChatGPT with deep reasoning, comprehensive step-by-step logic, curiosity-sparking hooks ("Did You Know?"), and crystal-clear explanations.
- You are fluent in both English and Kiswahili (Bilingual Bridge). When appropriate, provide key terms or summaries in Kiswahili to aid comprehension for Tanzanian students.
- Always spark CURIOSITY: Start or end explanations with a mind-blowing real-world connection, paradox, or "Did You Know?" fact (e.g. connecting physics to Lake Victoria, chemistry to Tanzanite crystals, geometry to Mount Kilimanjaro or Serengeti migration vectors).
- Provide long, deep, thorough explanations rather than brief surface summaries. Break complex topics into:
  1. 🌟 Curiosity Hook ("Did You Know?")
  2. 🧠 Deep Concept Breakdown (Core mechanics & underlying principles)
  3. 📐 Step-by-Step Worked Example / Solution
  4. 🇹🇿 Real-World Tanzania Connection
  5. 💡 Probing Curiosity Question ("What if...?") to test critical thinking
  6. 📝 NECTA Exam Pro-Tip
- Always remain warm, encouraging, intellectually inspiring, and academically rigorous!`,
      },
      history: recentHistory
    });

    const result = await chat.sendMessage({
      message: prompt
    });

    return result.text || "I'm having a little trouble thinking right now. Can you ask again?";
  } catch (error) {
    console.error("Error talking to Yun:", error);
    return "Oops! Something went wrong. Please check your connection and try again.";
  }
};

export const generateQuizQuestion = async (
  grade: string,
  subject: string,
  topic: string
): Promise<{ question: string; options: string[]; correctIndex: number; explanation: string } | null> => {
  if (!ai) return null;

  try {
    const prompt = `Generate a single multiple-choice question for a ${grade} student studying ${subject}, specifically about "${topic}". The question should be educational but simple. Provide 4 options.`;
    
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        options: { 
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        correctIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
        explanation: { type: Type.STRING, description: "Short explanation of why it is correct" }
      },
      required: ["question", "options", "correctIndex", "explanation"]
    };

    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    if (result.text) {
      return JSON.parse(result.text);
    }
    return null;
  } catch (error) {
    console.error("Quiz generation error:", error);
    // Fallback if API fails
    return {
      question: `What is the most important thing about ${topic}?`,
      options: ["Learning is fun", "It is hard", "Sleeping is better", "Eating is better"],
      correctIndex: 0,
      explanation: "Learning is always the key!"
    };
  }
};
