export interface ChatResponse {
  text: string;
  groundingSources?: { title: string; uri: string }[];
  modelUsed?: string;
}

export const sendMessageToYunDetailed = async (
  prompt: string,
  history: { role: 'user' | 'model'; text: string }[],
  model: string = 'gemini-3.5-flash',
  role: string = 'default',
  useSearchGrounding: boolean = false
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
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with ${res.status}`);
    }

    const data = await res.json();
    return {
      text: data.text || "I'm having a little trouble thinking right now. Please try again.",
      groundingSources: data.groundingSources || [],
      modelUsed: data.modelUsed,
    };
  } catch (error: any) {
    console.error('Error talking to Yun:', error);
    return {
      text: "Oops! Something went wrong communicating with the AI server. Please check your connection.",
      groundingSources: [],
    };
  }
};

export const sendMessageToYun = async (
  prompt: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  const result = await sendMessageToYunDetailed(prompt, history, 'gemini-3.5-flash', 'default', false);
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
