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
    if (!ai) {
      res.status(500).json({
        error: "GEMINI_API_KEY environment variable is missing on the server.",
      });
      return;
    }

    const {
      prompt,
      history = [],
      model = "gemini-3.5-flash",
      role = "default",
      useSearchGrounding = false,
    } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required." });
      return;
    }

    // System instructions based on role
    let systemInstruction = `You are Yun, an advanced, highly intelligent AI Tutor and Curiosity Catalyst specialized for Tanzanian students from Primary (Grade 1-7), O-Level Secondary (Form 1-4), and High School A-Level (Form 5-6).
Your Identity & Persona:
- You operate with deep reasoning, comprehensive step-by-step logic, curiosity-sparking hooks ("Did You Know?"), and crystal-clear explanations.
- You are bilingual in English and Kiswahili. Provide key technical terms or summaries in Kiswahili to aid comprehension for Tanzanian students.
- Always spark CURIOSITY with real-world Tanzania connections (e.g., Lake Victoria, Tanzanite, Mount Kilimanjaro, Serengeti vectors).
- Provide long, deep, structured breakdowns:
  1. 🌟 Curiosity Hook ("Did You Know?")
  2. 🧠 Deep Concept Breakdown
  3. 📐 Step-by-Step Worked Example / Solution
  4. 🇹🇿 Real-World Tanzania Connection
  5. 💡 Probing Curiosity Question ("What if...?")
  6. 📝 NECTA Exam Pro-Tip`;

    if (role === "necta_examiner") {
      systemInstruction = `You are an expert NECTA Senior Examiner and Secondary Curriculum Specialist for Tanzania Form 1-6 & Primary examinations. Provide exact marking scheme guidelines, common examination pitfalls, step-by-step working out for Form 4 & Form 6 national papers, and exam preparation strategies.`;
    } else if (role === "stem_mentor") {
      systemInstruction = `You are a STEM Laboratory Mentor and Physics/Chemistry/Biology/Math Specialist for Tanzanian students. Explain practical experiments, scientific formulas, dimensional analysis, reaction mechanisms, and real-world Tanzanian industrial applications.`;
    } else if (role === "kiswahili_fasihi") {
      systemInstruction = `Wewe ni Mwalimu na Mbingwa wa Lugha na Fasihi ya Kiswahili kwa Sekondari na Shule za Msingi Tanzania. Eleza kwa undani Fasihi Simulizi, Fasihi Andishi, Sarufi, Insha, Ushairi, na Tamthilia zinazotahiniwa na NECTA.`;
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

    // Determine model alias
    let selectedModel = model;
    if (model === "pro" || model === "gemini-pro") {
      selectedModel = "gemini-3.1-pro-preview";
    } else if (model === "lite" || model === "gemini-lite") {
      selectedModel = "gemini-3.1-flash-lite";
    } else if (model === "flash" || model === "gemini-flash") {
      selectedModel = "gemini-3.5-flash";
    }

    const chat = ai.chats.create({
      model: selectedModel,
      config: chatConfig,
      history: formattedHistory,
    });

    const response = await chat.sendMessage({ message: prompt });
    const text = response.text || "I'm having a little trouble thinking right now. Please try again.";

    // Extract search grounding metadata if available
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
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred during chat.",
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
      model: "gemini-3.5-flash",
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
        model: "gemini-3.5-flash", // General tasks model
        contents: prompt,
      });

      res.json({ result: response.text });
      return;
    }

    if (task === "study_plan") {
      const prompt = `Create an intensive 7-day NECTA study roadmap for a ${grade || "Form 4"} student taking ${subject || "Mathematics and Science"}. Break it down into daily 2-hour actionable modules with topic targets, practice problems, and rest intervals.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
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
