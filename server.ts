import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// 1. Multi-turn Gemini Chatbot Endpoint (Yun AI)
app.post("/api/chat", async (req, res) => {
  try {
    const {
      prompt,
      history = [],
      model = "gemini-3.8-flash",
      role = "default",
      useSearchGrounding = false,
    } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required." });
      return;
    }

    if (!ai) {
      res.json({
        text: "Jambo rafiki yangu! Yun is right here. The server is currently running in local offline mode without an API key, but you can still access all the curriculum syllabi, NECTA past papers, and video lessons on this portal. Once configured, I will be delighted to answer any question for you!",
        groundingSources: [],
        modelUsed: "offline",
      });
      return;
    }

    // Friendly, warm, polite, and encouraging system instructions for Yun
    let systemInstruction = `You are Yun, a warm, polite, respectful, and encouraging AI Tutor & Study Buddy for Tanzanian students (Primary Grade 1–7, O-Level Form 1–4, and A-Level Form 5–6).

Core Personality & Demeanor:
- Always respond NICELY, politely, respectfully, and with genuine warmth and enthusiasm.
- Greet the student kindly in English and Kiswahili (e.g., "Habari!", "Karibu sana!", "Hello friend! It's wonderful to learn with you today.").
- Validate and celebrate curiosity (e.g., "Swali zuri sana!", "That is an excellent question!", "You are asking great questions!").
- Maintain a supportive, patient, and uplifting tone. Never sound cold, dismissive, or robotic. If a student is struggling or feeling discouraged, gently reassure them: "Don't worry at all, let's break this down step-by-step together!"

Adaptive Conversational Intelligence:
1. GREETINGS & CASUAL MESSAGES (e.g. "hi", "hello", "habari", "mambo", "how are you?", "who are you?", "asante", "thank you"):
   - Respond warmly, conversationally, and politely in 2-3 friendly paragraphs.
   - Introduce yourself warmly as Yun, their friendly Tanzanian AI study companion.
   - Inquire politely how they are doing and invite them to share what subject, topic, or homework problem they want to work on.
   - DO NOT output an unprompted, rigid 6-part academic lecture on a simple greeting!

2. ACADEMIC & HOMEWORK QUESTIONS (Math, Physics, Chemistry, Biology, Geography, History, Kiswahili, Civics, etc.):
   - Structure your explanation clearly, nicely, and patiently.
   - Give step-by-step worked examples with formulas and intermediate steps clearly visible.
   - Bilingual clarity: translate key technical or complex English terms into clear Kiswahili so students grasp the underlying concepts deeply.
   - Provide relatable real-world Tanzanian examples where applicable (e.g., Tanzanite formation in Mererani, atmospheric pressure on Mount Kilimanjaro, Lake Victoria ecosystem, Julius Nyerere Hydropower at Rufiji, Serengeti migration).
   - Provide a practical NECTA Exam Pro-Tip where relevant (common pitfalls, how examiners award step marks).
   - Close with a polite, encouraging check-in (e.g., "Je, hatua hizi ziko wazi? / Does this make sense, or would you like another example?").

Language:
- Naturally bilingual in English and Kiswahili. If the student writes in Kiswahili, respond primarily in fluent, polite Kiswahili. If the student writes in English, respond in English with helpful Kiswahili glossaries.`;

    if (role === "necta_examiner") {
      systemInstruction = `You are a supportive, encouraging Senior NECTA Examiner and Secondary Curriculum Specialist for Tanzania Form 1-6 & Primary examinations. Always respond politely, constructively, and warmly. Demystify national examination marking schemes, explain how step-by-step marks are awarded in Paper 1 and Paper 2, highlight common student mistakes with kindness, and provide high-yield revision strategies.`;
    } else if (role === "stem_mentor") {
      systemInstruction = `You are an inspiring, patient STEM Laboratory Mentor and Science/Math Specialist for Tanzanian students. Always respond nicely, politely, and with infectious curiosity. Break down complex scientific formulas, chemical equations, physics laws, and mathematical proofs step-by-step with real-world Tanzanian applications.`;
    } else if (role === "kiswahili_fasihi") {
      systemInstruction = `Wewe ni Mwalimu mkarimu, mpole, na mwenye weledi wa hali ya juu wa Lugha na Fasihi ya Kiswahili kwa shule za Tanzania. Jibu kila wakati kwa lugha fasaha, yenye adabu na heshima. Eleza kwa kina na ufasaha Fasihi Simulizi, Fasihi Andishi, Sarufi, Insha, Ushairi, na Tamthilia zinazotahiniwa na NECTA.`;
    }

    // Map history to Gemini format
    const formattedHistory = history.map((msg: { role: string; text: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const chatConfig: any = {
      systemInstruction,
    };

    if (useSearchGrounding) {
      chatConfig.tools = [{ googleSearch: {} }];
    }

    // Determine model alias - prefer gemini-3.8-flash as the primary reliable model
    let selectedModel = model;
    if (
      !selectedModel ||
      selectedModel === "gemini-3.5-flash" ||
      selectedModel === "flash" ||
      selectedModel === "gemini-flash" ||
      selectedModel === "gemini-flash-latest"
    ) {
      selectedModel = "gemini-3.8-flash";
    } else if (selectedModel === "pro" || selectedModel === "gemini-pro" || selectedModel === "gemini-3.1-pro") {
      selectedModel = "gemini-3.1-pro-preview";
    } else if (selectedModel === "lite" || selectedModel === "gemini-lite" || selectedModel === "gemini-3.1-flash-lite") {
      selectedModel = "gemini-3.1-flash-lite";
    }

    let response: any = null;
    let modelUsed = selectedModel;

    // Execute with automatic graceful model fallback
    try {
      const chat = ai.chats.create({
        model: selectedModel,
        config: chatConfig,
        history: formattedHistory,
      });
      response = await chat.sendMessage({ message: prompt });
    } catch (primaryErr: any) {
      console.warn(`Primary model ${selectedModel} failed, trying fallback:`, primaryErr?.message || primaryErr);
      
      // Fallback 1: gemini-3.8-flash (if primary wasn't already 3.8-flash)
      if (selectedModel !== "gemini-3.8-flash") {
        try {
          const fallbackChat = ai.chats.create({
            model: "gemini-3.8-flash",
            config: chatConfig,
            history: formattedHistory,
          });
          response = await fallbackChat.sendMessage({ message: prompt });
          modelUsed = "gemini-3.8-flash";
        } catch (fbErr: any) {
          console.warn("Fallback to gemini-3.8-flash failed, trying gemini-3.1-flash-lite:", fbErr?.message || fbErr);
        }
      }

      // Fallback 2: gemini-3.1-flash-lite (fast & resilient)
      if (!response || !response.text) {
        try {
          const liteChat = ai.chats.create({
            model: "gemini-3.1-flash-lite",
            config: chatConfig,
            history: formattedHistory,
          });
          response = await liteChat.sendMessage({ message: prompt });
          modelUsed = "gemini-3.1-flash-lite";
        } catch (liteErr: any) {
          console.error("All AI model attempts encountered an error:", liteErr?.message || liteErr);
        }
      }
    }

    let text = response?.text;
    if (!text) {
      text = "Jambo rafiki yangu! Yun is right here. I experienced a momentary network delay while thinking, but I am ready to help you. Please ask your question again, or let me know what topic you'd like to explore, and I will walk you through it step-by-step!";
      modelUsed = "yun-fallback";
    }

    // Extract search grounding metadata if available
    let groundingSources: { title: string; uri: string }[] = [];
    const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      groundingSources = chunks
        .filter((chunk: any) => chunk.web && chunk.web.uri)
        .map((chunk: any) => ({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri,
        }));
    }

    res.json({
      text,
      groundingSources,
      modelUsed,
    });
  } catch (error: any) {
    console.error("Chat API Unexpected Error:", error);
    // Respond nicely and politely even in error cases!
    res.json({
      text: "Jambo! Asante kwa kuniuliza. Yun amepata changamoto ndogo ya kiufundi kwa muda mfupi, lakini nipo tayari kukusaidia. Tafadhali jaribu kutuma tena swali lako au chagua mada nyingine ya somo lako tufanye kazi pamoja!",
      groundingSources: [],
      modelUsed: "yun-polite-recovery",
    });
  }
});

// 2. Google Search Grounding Endpoint (Real-Time Educational Research & NECTA Updates)
app.post("/api/search", async (req, res) => {
  try {
    if (!ai) {
      res.status(500).json({ error: "GEMINI_API_KEY missing on server." });
      return;
    }

    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: "Search query is required." });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Search for accurate, up-to-date real-time educational information, NECTA curriculum details, or current facts about: "${query}". Provide a clear, structured, well-formatted summary with key facts and bullet points.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an educational search research assistant for Tanzanian students and teachers. Summarize findings clearly with high accuracy and cite real-world data.",
      },
    });

    const text = response.text || "No search results returned.";

    let groundingSources: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      groundingSources = chunks
        .filter((chunk: any) => chunk.web && chunk.web.uri)
        .map((chunk: any) => ({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri,
        }));
    }

    res.json({
      text,
      groundingSources,
      query,
    });
  } catch (error: any) {
    console.error("Search Grounding API Error:", error);
    res.status(500).json({ error: error.message || "Failed to search web." });
  }
});

// 3. Gemini Intelligence Endpoint (Note Analysis, Essay Editing, Custom Quiz, Study Recommendations)
app.post("/api/intelligence", async (req, res) => {
  try {
    if (!ai) {
      res.status(500).json({ error: "GEMINI_API_KEY missing on server." });
      return;
    }

    const { task, content, subject, grade, topic } = req.body;

    if (task === "generate_quiz") {
      const prompt = `Generate a high-quality NECTA multiple-choice question for a ${grade || "Form 4"} student studying ${subject || "General Science"}, specifically about topic "${topic || "General Knowledge"}". Include 4 realistic distractor options, correct index (0-3), and detailed explanation with Tanzania curriculum context.`;

      const schema: Schema = {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "The exam question" },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Four multiple choice options",
          },
          correctIndex: { type: Type.INTEGER, description: "Correct option index 0-3" },
          explanation: { type: Type.STRING, description: "Detailed explanation of correct answer" },
          nectaTip: { type: Type.STRING, description: "Pro-tip for answering in NECTA exams" },
        },
        required: ["question", "options", "correctIndex", "explanation"],
      };

      const result = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite", // Fast intelligence model for quiz generation
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      const parsed = result.text ? JSON.parse(result.text) : null;
      res.json({ quiz: parsed });
      return;
    }

    if (task === "analyze_notes") {
      const prompt = `Analyze the following study notes thoroughly for a student in Tanzania:\n\n${content}\n\nProvide:
1. 📌 Key Executive Summary
2. 💡 Essential Core Concepts & Definitions
3. 📐 Step-by-Step Worked Formulas / Frameworks
4. 📝 3 NECTA-Style Exam Practice Questions with Answers
5. 🇹🇿 Real-world Tanzanian practical application example`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview", // Complex reasoning model
        contents: prompt,
        config: {
          systemInstruction: "You are an expert Tanzanian Secondary Academic Advisor and Curriculum Inspector.",
        },
      });

      res.json({ analysis: response.text });
      return;
    }

    if (task === "edit_text") {
      const prompt = `Review, proofread, and polish the following academic text/essay written by a Tanzanian student:\n\n"${content}"\n\nProvide:
1. ✏️ Polished & Improved Version (Enhanced vocabulary, flawless grammar, academic clarity)
2. 🔍 Breakdown of Grammatical & Style Improvements Made
3. 🇹🇿 Swahili Translation / Key Term Equivalents where helpful`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash", // Modern general tasks model
        contents: prompt,
      });

      res.json({ result: response.text });
      return;
    }

    if (task === "study_plan") {
      const prompt = `Create an intensive 7-day NECTA study roadmap for a ${grade || "Form 4"} student taking ${subject || "Mathematics and Science"}. Break it down into daily 2-hour actionable modules with topic targets, practice problems, and rest intervals.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({ plan: response.text });
      return;
    }

    res.status(400).json({ error: "Unknown intelligence task." });
  } catch (error: any) {
    console.error("Intelligence API Error:", error);
    res.status(500).json({ error: error.message || "Failed intelligence operation." });
  }
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Education TZ Express + Vite Server listening on port ${PORT}`);
  });
}

startServer();
