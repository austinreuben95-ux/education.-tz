import { QuizMistakeFeedback } from '../types';

export interface ChatResponse {
  text: string;
  groundingSources?: { title: string; uri: string }[];
  modelUsed?: string;
}

export const sendMessageToYunDetailed = async (
  prompt: string,
  history: { role: 'user' | 'model'; text: string }[],
  model: string = 'gemini-3.8-flash',
  role: string = 'default',
  useSearchGrounding: boolean = false,
  deepThinking: boolean = true
): Promise<ChatResponse> => {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        history,
        model,
        role,
        useSearchGrounding,
        deepThinking,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with ${res.status}`);
    }

    const data = await res.json();
    return {
      text: data.text || "Jambo! I am here and ready to help you. What topic or concept would you like to explore today?",
      groundingSources: data.groundingSources || [],
      modelUsed: data.modelUsed,
    };
  } catch (error: any) {
    console.error('Error talking to Yun:', error);
    return {
      text: "Jambo! Asante kwa kuniuliza. Yun experienced a quick network delay while preparing your answer, but I am ready right here. Please try asking again, or feel free to select a topic from the curriculum syllabus above. Nipo hapa kukusaidia kufaulu!",
      groundingSources: [],
    };
  }
};

export const streamMessageToYunDetailed = async (
  prompt: string,
  history: { role: 'user' | 'model'; text: string }[],
  options: {
    model?: string;
    role?: string;
    useSearchGrounding?: boolean;
    deepThinking?: boolean;
    onChunk?: (delta: string, accumulatedText: string) => void;
  } = {}
): Promise<ChatResponse> => {
  const {
    model = 'gemini-3.8-flash',
    role = 'default',
    useSearchGrounding = false,
    deepThinking = true,
    onChunk,
  } = options;

  try {
    const res = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        history,
        model,
        role,
        useSearchGrounding,
        deepThinking,
      }),
    });

    if (!res.ok || !res.body) {
      // Gracefully fall back to standard non-stream endpoint
      return await sendMessageToYunDetailed(prompt, history, model, role, useSearchGrounding, deepThinking);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';
    let groundingSources: { title: string; uri: string }[] = [];
    let modelUsed = model;
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const jsonStr = trimmed.slice(6);
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.text) {
            accumulatedText += parsed.text;
            if (onChunk) {
              onChunk(parsed.text, accumulatedText);
            }
          }
          if (parsed.groundingSources && Array.isArray(parsed.groundingSources)) {
            groundingSources = parsed.groundingSources;
          }
          if (parsed.modelUsed) {
            modelUsed = parsed.modelUsed;
          }
          if (parsed.error && !accumulatedText) {
            throw new Error(parsed.error);
          }
        } catch (parseErr) {
          // ignore incomplete SSE chunk
        }
      }
    }

    if (!accumulatedText.trim()) {
      return await sendMessageToYunDetailed(prompt, history, model, role, useSearchGrounding, deepThinking);
    }

    return {
      text: accumulatedText,
      groundingSources,
      modelUsed,
    };
  } catch (err: any) {
    console.warn('Stream failed or interrupted, falling back to standard chat:', err);
    return await sendMessageToYunDetailed(prompt, history, model, role, useSearchGrounding, deepThinking);
  }
};

export const sendMessageToYun = async (
  prompt: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  const result = await sendMessageToYunDetailed(prompt, history, 'gemini-3.8-flash', 'default', false);
  return result.text;
};

export const searchWithGoogleGrounding = async (
  query: string
): Promise<{ text: string; groundingSources: { title: string; uri: string }[] }> => {
  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with ${res.status}`);
    }

    const data = await res.json();
    return {
      text: data.text || 'No results found.',
      groundingSources: data.groundingSources || [],
    };
  } catch (error: any) {
    console.error('Search Grounding error:', error);
    return {
      text: 'Failed to perform Google Search grounding. Please try again.',
      groundingSources: [],
    };
  }
};

export const generateQuizQuestion = async (
  grade: string,
  subject: string,
  topic: string
): Promise<{ question: string; options: string[]; correctIndex: number; explanation: string; nectaTip?: string } | null> => {
  try {
    const res = await fetch('/api/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: 'generate_quiz',
        grade,
        subject,
        topic,
      }),
    });

    if (!res.ok) throw new Error('Quiz generation failed');
    const data = await res.json();
    return data.quiz || null;
  } catch (error) {
    console.error('Quiz generation error:', error);
    return {
      question: `What is the most fundamental concept regarding ${topic}?`,
      options: ['Core principles & formulas', 'Random guessing', 'Skipping practice', 'Memorizing blindly'],
      correctIndex: 0,
      explanation: 'Understanding the underlying core principles and formulas guarantees NECTA success!',
      nectaTip: 'Always show step-by-step working out in Paper 1 & Paper 2 calculations.',
    };
  }
};

export const analyzeNotesWithGemini = async (content: string): Promise<string> => {
  try {
    const res = await fetch('/api/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: 'analyze_notes',
        content,
      }),
    });

    if (!res.ok) throw new Error('Note analysis failed');
    const data = await res.json();
    return data.analysis || 'Analysis unavailable.';
  } catch (error) {
    console.error('Analyze notes error:', error);
    return 'Could not analyze notes at this moment.';
  }
};

export const editAndEnhanceTextWithGemini = async (content: string): Promise<string> => {
  try {
    const res = await fetch('/api/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: 'edit_text',
        content,
      }),
    });

    if (!res.ok) throw new Error('Text enhancement failed');
    const data = await res.json();
    return data.result || 'Enhancement unavailable.';
  } catch (error) {
    console.error('Text enhancement error:', error);
    return 'Could not enhance text at this moment.';
  }
};

export const getQuizMistakeFeedback = async (params: {
  question: string;
  options: string[];
  studentAnswerIndex: number;
  studentAnswerText: string;
  correctAnswerIndex: number;
  correctAnswerText: string;
  subject?: string;
  grade?: string;
  topic?: string;
  baseExplanation?: string;
}): Promise<QuizMistakeFeedback> => {
  try {
    const res = await fetch('/api/quiz-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error(`Quiz feedback endpoint responded with ${res.status}`);
    const data = await res.json();
    if (data.feedback) return data.feedback;
    throw new Error('No feedback returned');
  } catch (error) {
    console.error('Quiz feedback error:', error);
    return {
      conceptualGap: `You picked "${params.studentAnswerText || 'this choice'}" instead of the correct answer "${params.correctAnswerText}". In ${params.topic || 'this topic'}, students often make this mistake by overlooking subtle question qualifiers, applying incomplete formulas, or confusing inverse concepts.`,
      whyOptionIsIncorrect: `"${params.studentAnswerText}" does not fully satisfy all theoretical and calculation constraints. ${params.baseExplanation ? params.baseExplanation + ' ' : ''}"${params.correctAnswerText}" strictly adheres to official NECTA syllabus principles.`,
      underlyingPrinciple: `Mastering ${params.topic || 'this concept'} in ${params.subject || 'this subject'} requires breaking the problem down into given data, target variables, and official definition criteria.`,
      whereToFocus: {
        primaryFocusTopic: `${params.topic || 'Topic'}: Key Definitions & Formula Applications`,
        keyTakeaway: 'Always write down the formula, list your known variables, and test your answer against common distractors before finalizing.',
        actionSteps: [
          `Review the dedicated lesson notes for "${params.topic || 'this topic'}" in your syllabus hub.`,
          `Attempt 2-3 similar NECTA past paper problems under timed conditions.`,
          `Consult Yun AI in study chat for a step-by-step breakdown of this exact concept.`
        ],
        nectaTrapToAvoid: 'NECTA examiners deliberately place intermediate calculation results and sign inversions among the choices. Always verify each step!'
      },
      bilingualQuickTip: 'Kidokezo cha NECTA: Makosa katika majaribio ni fursa ya dhahabu ya kujifunza. Elewa kwanini jibu hili halikuwa sahihi ili ufaulu mtihani wako wa mwisho!',
      source: 'heuristic'
    };
  }
};

