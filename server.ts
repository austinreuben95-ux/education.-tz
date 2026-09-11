import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema, ThinkingLevel } from "@google/genai";
import { ALL_NECTA_PAST_PAPERS } from "./src/data/nectaPastPapersData";

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

// Dynamic NECTA Past Papers API endpoint
app.get("/api/necta-past-papers", (req, res) => {
  try {
    const { level = "ALL", subject = "ALL", year = "ALL", q = "" } = req.query as Record<string, string>;

    // 1. Filter papers specific to the selected grade level
    const gradePapers = ALL_NECTA_PAST_PAPERS.filter((p) => {
      if (level && level !== "ALL" && p.level !== level) {
        return false;
      }
      return true;
    });

    // 2. Calculate dynamic available years & subjects specific to this grade level
    const subjectCounts: Record<string, number> = {};
    const yearCounts: Record<string, number> = {};

    gradePapers.forEach((paper) => {
      subjectCounts[paper.subject] = (subjectCounts[paper.subject] || 0) + 1;
      yearCounts[paper.year] = (yearCounts[paper.year] || 0) + 1;
    });

    const availableSubjects = Object.keys(subjectCounts)
      .sort()
      .map((name) => ({ name, count: subjectCounts[name] }));

    const availableYears = Object.keys(yearCounts)
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => ({ year: y, count: yearCounts[y] }));

    // 3. Apply subject, year, and search query filters
    const filteredPapers = gradePapers.filter((paper) => {
      if (subject && subject !== "ALL" && !paper.subject.toLowerCase().includes(subject.toLowerCase())) {
        return false;
      }
      if (year && year !== "ALL" && paper.year !== year) {
        return false;
      }
      if (q && q.trim()) {
        const searchTerm = q.trim().toLowerCase();
        const matchTitle = paper.title.toLowerCase().includes(searchTerm);
        const matchSubject = paper.subject.toLowerCase().includes(searchTerm);
        const matchLevel = paper.level.toLowerCase().includes(searchTerm) || paper.levelFull.toLowerCase().includes(searchTerm);
        const matchCode = paper.code ? paper.code.toLowerCase().includes(searchTerm) : false;
        const matchQuestions = paper.sampleQuestions.some((sq) =>
          sq.question.toLowerCase().includes(searchTerm)
        );
        if (!matchTitle && !matchSubject && !matchLevel && !matchCode && !matchQuestions) {
          return false;
        }
      }
      return true;
    });

    res.json({
      level,
      totalForLevel: gradePapers.length,
      filteredCount: filteredPapers.length,
      availableSubjects,
      availableYears,
      papers: filteredPapers,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error fetching NECTA past papers:", err);
    res.status(500).json({ error: "Failed to retrieve past papers." });
  }
});

// Download individual NECTA past paper endpoint
app.get("/api/necta-past-papers/download/:id", (req, res) => {
  try {
    const { id } = req.params;
    const paper = ALL_NECTA_PAST_PAPERS.find((p) => p.id === id);
    if (!paper) {
      return res.status(404).json({ error: "Past paper not found" });
    }

    const content = `===============================================================
THE NATIONAL EXAMINATIONS COUNCIL OF TANZANIA (NECTA)
${paper.levelFull.toUpperCase()} (${paper.level})
${paper.title.toUpperCase()}
Subject Code: ${paper.code || 'N/A'} | Examination Year: ${paper.year}
Time Allowed: ${paper.durationMinutes} Minutes | Number of Questions: ${paper.questionCount}
===============================================================

INSTRUCTIONS TO CANDIDATES:
1. This paper consists of questions based on the official NECTA syllabus for ${paper.levelFull}.
2. Answer all questions clearly. Show all mathematical and logical steps where applicable.
3. Write your Candidate Index Number clearly on every answer sheet.
4. Cell phones, programmable calculators, and unauthorized materials are strictly prohibited.

===============================================================
OFFICIAL NECTA EXAMINER (CIRA) REPORT & PITFALL ADVICE
===============================================================
Performance Summary:
${paper.examinerReport.summary}

Common Candidate Pitfalls & Error Analysis:
${paper.examinerReport.commonPitfalls.map((p, idx) => `  [${idx + 1}] ${p}`).join('\n')}

Chief Examiner's Guidance for Scoring Grade A:
${paper.examinerReport.examinerAdvice}

===============================================================
EXAMINATION QUESTIONS:
===============================================================
${paper.sampleQuestions.map((q) => {
  let text = `QUESTION ${q.qNum}: ${q.question}\n`;
  if (q.options && q.options.length > 0) {
    text += q.options.map((opt, i) => `   (${String.fromCharCode(65 + i)}) ${opt}`).join('\n') + '\n';
  }
  return text;
}).join('\n')}

===============================================================
OFFICIAL NECTA MARKING SCHEME & STEP-BY-STEP RUBRIC
===============================================================
${paper.sampleQuestions.map((q) => {
  return `QUESTION ${q.qNum}:
  Official Answer Key: ${q.answerKey}
  Marking Scheme Rubric & Step Allocation:
  ${q.markingNotes}
---------------------------------------------------------------`;
}).join('\n')}

===============================================================
Generated by EducationTZ - Tanzania National Exam Preparation
Official Website: https://www.necta.go.tz
===============================================================`;

    const filename = `NECTA_${paper.level}_${paper.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${paper.year}.txt`;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(content);
  } catch (err: any) {
    console.error("Error downloading NECTA past paper:", err);
    res.status(500).json({ error: "Failed to download past paper." });
  }
});

// Shared Yun AI Configuration & System Instruction Builder
const getYunChatSetup = ({
  prompt,
  history = [],
  model = "gemini-3.8-flash",
  role = "default",
  useSearchGrounding = false,
  deepThinking = true,
}: {
  prompt: string;
  history?: { role: string; text: string }[];
  model?: string;
  role?: string;
  useSearchGrounding?: boolean;
  deepThinking?: boolean;
}) => {
  // Base warm, encouraging, polite system instructions
  let systemInstruction = `You are Yun, a warm, polite, respectful, and highly intelligent AI Tutor & Study Buddy for Tanzanian students (Primary Grade 1–7, O-Level Form 1–4, and A-Level Form 5–6).

Core Demeanor:
- Always respond politely, respectfully, and with genuine warmth and enthusiasm.
- Greet the student kindly in English and Kiswahili (e.g., "Habari!", "Karibu sana!", "Hello friend! It's wonderful to learn with you today.").
- Celebrate curiosity: "Swali zuri sana!", "That is an excellent question!", "Let's explore this together!".
- Maintain a supportive, patient tone. Never sound cold or dismissive. If a student is struggling, reassure them: "Don't worry at all, let's break this down step-by-step together!"

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

  // Deep Thinking enhancement for thorough academic reasoning
  if (deepThinking) {
    systemInstruction += `\n\nDEEP THINKING & COGNITIVE RIGOR:
- Engage deep cognitive reasoning: do not jump directly to surface conclusions. Unpack the underlying principles, scientific laws, and axiomatic definitions first.
- First-Principles Derivation: Explain *why* a principle works, from basic physical/mathematical laws to final applications.
- Step-by-Step Mathematical Rigor:
  1. Clearly state the governing equation/formula before substituting values.
  2. Explicitly list Knowns, Target Variables, and standard SI Units.
  3. Show every intermediate algebraic rearrangement and arithmetic step (never skip steps).
  4. State the final answer with units and round off appropriately as required by NECTA.
- NECTA Examiner Evaluation:
  - Explain how marks are allocated step-by-step (e.g. Formula: 1mk, Data: 1mk, Substitution: 1mk, Final answer: 1mk).
  - Explicitly warn against common candidate pitfalls, sign errors, and misread qualifiers.
- Conceptual Contrast & "What If?": Briefly explain what happens if a key condition changes (e.g. "If temperature increases...", "If friction were zero...").`;
  }

  // Map history to Gemini format
  const formattedHistory = history.map((msg: { role: string; text: string }) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  // Resolve model aliases
  let resolvedModel = model;
  if (
    !resolvedModel ||
    resolvedModel === "gemini-3.5-flash" ||
    resolvedModel === "flash" ||
    resolvedModel === "gemini-flash" ||
    resolvedModel === "gemini-flash-latest"
  ) {
    resolvedModel = "gemini-3.8-flash";
  } else if (resolvedModel === "pro" || resolvedModel === "gemini-pro" || resolvedModel === "gemini-3.1-pro") {
    resolvedModel = "gemini-3.1-pro-preview";
  } else if (resolvedModel === "lite" || resolvedModel === "gemini-lite" || resolvedModel === "gemini-3.1-flash-lite") {
    resolvedModel = "gemini-3.1-flash-lite";
  }

  // Configure thinking level: HIGH for deep thinking, LOW for ultra-fast mode
  const chatConfig: any = {
    systemInstruction,
    thinkingConfig: {
      thinkingLevel: deepThinking ? ThinkingLevel.HIGH : ThinkingLevel.LOW,
    },
  };

  if (useSearchGrounding) {
    chatConfig.tools = [{ googleSearch: {} }];
  }

  return {
    systemInstruction,
    chatConfig,
    formattedHistory,
    resolvedModel,
  };
};

// 1a. Real-Time Streaming Gemini Chatbot Endpoint (Yun AI Fast Stream)
app.post("/api/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  if (typeof (res as any).flushHeaders === "function") {
    (res as any).flushHeaders();
  }

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const {
      prompt,
      history = [],
      model = "gemini-3.8-flash",
      role = "default",
      useSearchGrounding = false,
      deepThinking = true,
    } = req.body;

    if (!prompt) {
      sendEvent({ error: "Prompt is required.", done: true });
      res.end();
      return;
    }

    if (!ai) {
      sendEvent({
        text: "Jambo rafiki yangu! Yun is currently in local offline mode. Add your GEMINI_API_KEY in the environment to unlock full real-time deep reasoning!",
        done: true,
        modelUsed: "offline",
      });
      res.end();
      return;
    }

    const { chatConfig, formattedHistory, resolvedModel } = getYunChatSetup({
      prompt,
      history,
      model,
      role,
      useSearchGrounding,
      deepThinking,
    });

    let streamResponse: any = null;
    let modelUsed = resolvedModel;

    try {
      const chat = ai.chats.create({
        model: resolvedModel,
        config: chatConfig,
        history: formattedHistory,
      });
      streamResponse = await chat.sendMessageStream({ message: prompt });
    } catch (primaryErr: any) {
      console.warn(`Primary stream model ${resolvedModel} error:`, primaryErr?.message || primaryErr);

      // Fallback 1: gemini-3.8-flash
      if (resolvedModel !== "gemini-3.8-flash") {
        try {
          const fallbackChat = ai.chats.create({
            model: "gemini-3.8-flash",
            config: chatConfig,
            history: formattedHistory,
          });
          streamResponse = await fallbackChat.sendMessageStream({ message: prompt });
          modelUsed = "gemini-3.8-flash";
        } catch (fbErr: any) {
          console.warn("Fallback to 3.8-flash stream failed:", fbErr?.message || fbErr);
        }
      }

      // Fallback 2: gemini-3.1-flash-lite (fast & resilient)
      if (!streamResponse) {
        try {
          const liteConfig = { ...chatConfig, thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } };
          const liteChat = ai.chats.create({
            model: "gemini-3.1-flash-lite",
            config: liteConfig,
            history: formattedHistory,
          });
          streamResponse = await liteChat.sendMessageStream({ message: prompt });
          modelUsed = "gemini-3.1-flash-lite";
        } catch (liteErr: any) {
          console.error("All stream model attempts failed:", liteErr?.message || liteErr);
        }
      }
    }

    if (!streamResponse) {
      sendEvent({
        text: "Jambo! Yun experienced a temporary connection delay while thinking. Tafadhali jaribu tena baada ya sekunde chache, nipo tayari kukusaidia!",
        done: true,
        modelUsed: "yun-fallback",
      });
      res.end();
      return;
    }

    let accumulatedGrounding: { title: string; uri: string }[] = [];

    for await (const chunk of streamResponse) {
      const text = chunk.text;
      if (text) {
        sendEvent({ text, delta: text });
      }

      const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && Array.isArray(chunks)) {
        for (const c of chunks) {
          if (c.web && c.web.uri) {
            const exists = accumulatedGrounding.some((g) => g.uri === c.web.uri);
            if (!exists) {
              accumulatedGrounding.push({
                title: c.web.title || c.web.uri,
                uri: c.web.uri,
              });
            }
          }
        }
      }
    }

    sendEvent({
      done: true,
      modelUsed,
      groundingSources: accumulatedGrounding,
    });
    res.end();
  } catch (error: any) {
    console.error("Chat Stream API Unexpected Error:", error);
    sendEvent({
      error: error?.message || "An unexpected error occurred during streaming.",
      done: true,
    });
    res.end();
  }
});

// 1b. Standard Non-Streaming Gemini Chatbot Endpoint (Yun AI)
app.post("/api/chat", async (req, res) => {
  try {
    const {
      prompt,
      history = [],
      model = "gemini-3.8-flash",
      role = "default",
      useSearchGrounding = false,
      deepThinking = true,
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

    const { chatConfig, formattedHistory, resolvedModel } = getYunChatSetup({
      prompt,
      history,
      model,
      role,
      useSearchGrounding,
      deepThinking,
    });

    let response: any = null;
    let modelUsed = resolvedModel;

    // Execute with automatic graceful model fallback
    try {
      const chat = ai.chats.create({
        model: resolvedModel,
        config: chatConfig,
        history: formattedHistory,
      });
      response = await chat.sendMessage({ message: prompt });
    } catch (primaryErr: any) {
      console.warn(`Primary model ${resolvedModel} failed, trying fallback:`, primaryErr?.message || primaryErr);
      
      // Fallback 1: gemini-3.8-flash (if primary wasn't already 3.8-flash)
      if (resolvedModel !== "gemini-3.8-flash") {
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
          const liteConfig = { ...chatConfig, thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } };
          const liteChat = ai.chats.create({
            model: "gemini-3.1-flash-lite",
            config: liteConfig,
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

    if (task === "quiz_mistake_feedback") {
      const {
        question,
        options,
        studentAnswerIndex,
        studentAnswerText,
        correctAnswerIndex,
        correctAnswerText,
        subject,
        grade,
        topic,
        baseExplanation,
      } = req.body;

      if (!ai) {
        const fallback = generateLocalQuizMistakeFeedback({
          question,
          options,
          studentAnswerIndex,
          studentAnswerText,
          correctAnswerIndex,
          correctAnswerText,
          subject,
          grade,
          topic,
          baseExplanation,
        });
        res.json({ feedback: fallback });
        return;
      }

      const prompt = `You are Yun, an elite Tanzanian Curriculum Specialist and Senior NECTA Examiner.
A student took a practice quiz question and selected an INCORRECT answer.
Your mission is to provide personalized, encouraging, and pedagogically precise diagnostic feedback.
Explain the specific conceptual gap that led to choosing this distractor, contrast it with the correct answer, and tell the student EXACTLY where they must focus their revision to excel in NECTA exams.

CONTEXT:
- Subject: ${subject || "General Subject"}
- Grade / Level: ${grade || "Secondary (O-Level)"}
- Topic: ${topic || "Curriculum Unit"}

QUESTION:
"${question}"

OPTIONS:
${(options || []).map((opt: string, i: number) => `(${String.fromCharCode(65 + i)}) ${opt}`).join("\n")}

STUDENT'S ANSWER (INCORRECT):
Option ${studentAnswerIndex !== undefined && studentAnswerIndex !== null ? String.fromCharCode(65 + studentAnswerIndex) : "Selected"}: "${studentAnswerText || ""}"

OFFICIAL CORRECT ANSWER:
Option ${correctAnswerIndex !== undefined && correctAnswerIndex !== null ? String.fromCharCode(65 + correctAnswerIndex) : "Correct"}: "${correctAnswerText || ""}"

BASE EXPLANATION:
"${baseExplanation || ""}"

REQUIREMENTS:
1. 'conceptualGap': Explain the root misconception, formula misapplication, sign error, or false assumption that made this specific distractor tempting.
2. 'whyOptionIsIncorrect': Provide a sharp, direct explanation of why the chosen option is false, and why the correct answer is true.
3. 'underlyingPrinciple': Detail the core scientific law, mathematical theorem, grammatical rule, or factual principle governing this question.
4. 'whereToFocus':
   - 'primaryFocusTopic': Specific subtopic, formula, or syllabus chapter to study.
   - 'keyTakeaway': A high-yield rule of thumb, formula, or mnemonic.
   - 'actionSteps': 2 to 3 concrete revision tasks.
   - 'nectaTrapToAvoid': The common pitfall or trap NECTA examiners design around this concept.
5. 'bilingualQuickTip': A friendly, motivating bilingual tip (Swahili & English) encouraging the student.`;

      const mistakeSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          conceptualGap: {
            type: Type.STRING,
            description: "Diagnosis of the specific conceptual gap or reasoning flaw.",
          },
          whyOptionIsIncorrect: {
            type: Type.STRING,
            description: "Direct contrast between the incorrect option and correct option.",
          },
          underlyingPrinciple: {
            type: Type.STRING,
            description: "The governing syllabus rule, law, or formula.",
          },
          whereToFocus: {
            type: Type.OBJECT,
            properties: {
              primaryFocusTopic: {
                type: Type.STRING,
                description: "Subtopic or chapter to prioritize.",
              },
              keyTakeaway: {
                type: Type.STRING,
                description: "Memorable rule of thumb or formula.",
              },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 concrete revision tasks.",
              },
              nectaTrapToAvoid: {
                type: Type.STRING,
                description: "The specific NECTA exam trap to watch out for.",
              },
            },
            required: ["primaryFocusTopic", "keyTakeaway", "actionSteps", "nectaTrapToAvoid"],
          },
          bilingualQuickTip: {
            type: Type.STRING,
            description: "Bilingual motivating insight for Tanzanian learners.",
          },
        },
        required: [
          "conceptualGap",
          "whyOptionIsIncorrect",
          "underlyingPrinciple",
          "whereToFocus",
        ],
      };

      try {
        const result = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: mistakeSchema,
          },
        });

        if (result.text) {
          const parsed = JSON.parse(result.text);
          res.json({ feedback: { ...parsed, source: "gemini" } });
          return;
        }
      } catch (geminiErr) {
        console.warn("Gemini quiz mistake analysis fallback:", geminiErr);
      }

      const fallback = generateLocalQuizMistakeFeedback({
        question,
        options,
        studentAnswerIndex,
        studentAnswerText,
        correctAnswerIndex,
        correctAnswerText,
        subject,
        grade,
        topic,
        baseExplanation,
      });
      res.json({ feedback: fallback });
      return;
    }

    res.status(400).json({ error: "Unknown intelligence task." });
  } catch (error: any) {
    console.error("Intelligence API Error:", error);
    res.status(500).json({ error: error.message || "Failed intelligence operation." });
  }
});

// Dedicated Quiz Feedback endpoint
app.post("/api/quiz-feedback", async (req, res) => {
  const {
    question,
    options,
    studentAnswerIndex,
    studentAnswerText,
    correctAnswerIndex,
    correctAnswerText,
    subject,
    grade,
    topic,
    baseExplanation,
  } = req.body;

  if (!ai) {
    const fallback = generateLocalQuizMistakeFeedback({
      question,
      options,
      studentAnswerIndex,
      studentAnswerText,
      correctAnswerIndex,
      correctAnswerText,
      subject,
      grade,
      topic,
      baseExplanation,
    });
    res.json({ feedback: fallback });
    return;
  }

  try {
    const prompt = `You are Yun, an elite Tanzanian Curriculum Specialist and Senior NECTA Examiner.
A student took a practice quiz question and selected an INCORRECT answer.
Your mission is to provide personalized, encouraging, and pedagogically precise diagnostic feedback.
Explain the specific conceptual gap that led to choosing this distractor, contrast it with the correct answer, and tell the student EXACTLY where they must focus their revision to excel in NECTA exams.

CONTEXT:
- Subject: ${subject || "General Subject"}
- Grade / Level: ${grade || "Secondary (O-Level)"}
- Topic: ${topic || "Curriculum Unit"}

QUESTION:
"${question}"

OPTIONS:
${(options || []).map((opt: string, i: number) => `(${String.fromCharCode(65 + i)}) ${opt}`).join("\n")}

STUDENT'S ANSWER (INCORRECT):
Option ${studentAnswerIndex !== undefined && studentAnswerIndex !== null ? String.fromCharCode(65 + studentAnswerIndex) : "Selected"}: "${studentAnswerText || ""}"

OFFICIAL CORRECT ANSWER:
Option ${correctAnswerIndex !== undefined && correctAnswerIndex !== null ? String.fromCharCode(65 + correctAnswerIndex) : "Correct"}: "${correctAnswerText || ""}"

BASE EXPLANATION:
"${baseExplanation || ""}"

REQUIREMENTS:
1. 'conceptualGap': Explain the root misconception, formula misapplication, sign error, or false assumption that made this specific distractor tempting.
2. 'whyOptionIsIncorrect': Provide a sharp, direct explanation of why the chosen option is false, and why the correct answer is true.
3. 'underlyingPrinciple': Detail the core scientific law, mathematical theorem, grammatical rule, or factual principle governing this question.
4. 'whereToFocus':
   - 'primaryFocusTopic': Specific subtopic, formula, or syllabus chapter to study.
   - 'keyTakeaway': A high-yield rule of thumb, formula, or mnemonic.
   - 'actionSteps': 2 to 3 concrete revision tasks.
   - 'nectaTrapToAvoid': The common pitfall or trap NECTA examiners design around this concept.
5. 'bilingualQuickTip': A friendly, motivating bilingual tip (Swahili & English) encouraging the student.`;

    const mistakeSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        conceptualGap: {
          type: Type.STRING,
          description: "Diagnosis of the specific conceptual gap or reasoning flaw.",
        },
        whyOptionIsIncorrect: {
          type: Type.STRING,
          description: "Direct contrast between the incorrect option and correct option.",
        },
        underlyingPrinciple: {
          type: Type.STRING,
          description: "The governing syllabus rule, law, or formula.",
        },
        whereToFocus: {
          type: Type.OBJECT,
          properties: {
            primaryFocusTopic: {
              type: Type.STRING,
              description: "Subtopic or chapter to prioritize.",
            },
            keyTakeaway: {
              type: Type.STRING,
              description: "Memorable rule of thumb or formula.",
            },
            actionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 concrete revision tasks.",
            },
            nectaTrapToAvoid: {
              type: Type.STRING,
              description: "The specific NECTA exam trap to watch out for.",
            },
          },
          required: ["primaryFocusTopic", "keyTakeaway", "actionSteps", "nectaTrapToAvoid"],
        },
        bilingualQuickTip: {
          type: Type.STRING,
          description: "Bilingual motivating insight for Tanzanian learners.",
        },
      },
      required: [
        "conceptualGap",
        "whyOptionIsIncorrect",
        "underlyingPrinciple",
        "whereToFocus",
      ],
    };

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mistakeSchema,
      },
    });

    if (result.text) {
      const parsed = JSON.parse(result.text);
      res.json({ feedback: { ...parsed, source: "gemini" } });
      return;
    }
  } catch (err) {
    console.warn("Error in /api/quiz-feedback:", err);
  }

  const fallback = generateLocalQuizMistakeFeedback({
    question,
    options,
    studentAnswerIndex,
    studentAnswerText,
    correctAnswerIndex,
    correctAnswerText,
    subject,
    grade,
    topic,
    baseExplanation,
  });
  res.json({ feedback: fallback });
});

// Deterministic heuristic diagnostic generator
function generateLocalQuizMistakeFeedback(params: {
  question?: string;
  options?: string[];
  studentAnswerIndex?: number;
  studentAnswerText?: string;
  correctAnswerIndex?: number;
  correctAnswerText?: string;
  subject?: string;
  grade?: string;
  topic?: string;
  baseExplanation?: string;
}) {
  const subjectName = params.subject || "this subject";
  const topicName = params.topic || "this topic";
  const userAns = params.studentAnswerText || "the selected option";
  const correctAns = params.correctAnswerText || "the correct answer";
  const baseExpl = params.baseExplanation || "";

  return {
    conceptualGap: `You selected "${userAns}" while "${correctAns}" is the correct answer. In ${topicName}, students frequently pick this distractor when applying a partial formula, reversing terms, or confusing a definition with its inverse condition.`,
    whyOptionIsIncorrect: `Choosing "${userAns}" does not fully satisfy all required conditions. ${baseExpl ? baseExpl + " " : ""}In contrast, "${correctAns}" strictly matches the official NECTA syllabus standard for ${topicName}.`,
    underlyingPrinciple: `Mastering ${topicName} requires identifying all given variables and understanding why common distractor values are mathematically or conceptually invalid.`,
    whereToFocus: {
      primaryFocusTopic: `${topicName}: Core Definitions & Step-by-Step Calculations`,
      keyTakeaway: `Before selecting an answer, write down the formula, identify knowns vs unknowns, and verify units.`,
      actionSteps: [
        `Re-read the lesson note for "${topicName}" with special attention to key formulas and rules.`,
        `Work through 2 to 3 related NECTA past exam problems without looking at the answer key.`,
        `Ask Yun AI in the study chat to test you with a simplified practice question.`
      ],
      nectaTrapToAvoid: `NECTA examiners intentionally include common arithmetic missteps, inverted ratios, and sign errors as plausible options. Always double-check your working!`
    },
    bilingualQuickTip: `Kidokezo cha NECTA: Makosa katika majaribio ni fursa ya dhahabu ya kujifunza. Elewa kwanini jibu hili halikuwa sahihi ili ufaulu mtihani wako wa mwisho!`,
    source: "heuristic" as const
  };
}


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
