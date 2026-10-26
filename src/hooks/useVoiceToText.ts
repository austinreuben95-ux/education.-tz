import { useState, useRef, useEffect, useCallback } from 'react';
import { playMicStartSound, playMicStopSound } from '../utils/soundEffects';

export interface SupportedVoiceLang {
  code: string;
  name: string;
  bcp47: string;
  flag: string;
}

export const VOICE_LANGUAGES: SupportedVoiceLang[] = [
  { code: 'sw', name: 'Kiswahili', bcp47: 'sw-TZ', flag: '🇹🇿' },
  { code: 'en', name: 'English', bcp47: 'en-US', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', bcp47: 'fr-FR', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', bcp47: 'ar-SA', flag: '🇦🇪' },
  { code: 'es', name: 'Español', bcp47: 'es-ES', flag: '🇪🇸' },
  { code: 'zh', name: '中文', bcp47: 'zh-CN', flag: '🇨🇳' },
  { code: 'de', name: 'Deutsch', bcp47: 'de-DE', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', bcp47: 'pt-PT', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी', bcp47: 'hi-IN', flag: '🇮🇳' },
];

export interface UseVoiceToTextOptions {
  initialLanguage?: string; // code like 'sw' or 'en'
  continuous?: boolean;
  onTranscriptChange?: (text: string) => void;
  onInterimChange?: (interim: string) => void;
}

export const useVoiceToText = (options: UseVoiceToTextOptions = {}) => {
  const {
    initialLanguage = 'sw',
    continuous = true,
    onTranscriptChange,
    onInterimChange,
  } = options;

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedLangCode, setSelectedLangCode] = useState<string>(initialLanguage);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Check support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognitionClass);
    }
  }, []);

  // Timer effect while listening
  useEffect(() => {
    if (isListening) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const getBcp47ForCode = useCallback((code: string): string => {
    const found = VOICE_LANGUAGES.find((l) => l.code === code);
    return found ? found.bcp47 : 'sw-TZ';
  }, []);

  const startListening = useCallback(
    async (appendMode = true) => {
      setError(null);
      setInterimTranscript('');
      if (!appendMode) {
        setTranscript('');
        transcriptRef.current = '';
      }

      if (typeof window === 'undefined') return;

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        setError(
          'Voice speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.'
        );
        return;
      }

      // Check mic hardware & permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
        } catch (err: any) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError(
              'Microphone access is blocked. Please tap the lock or camera/mic icon in your browser address bar to allow microphone access.'
            );
            return;
          }
        }
      }

      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (_) {}
        }

        const recognition = new SpeechRecognitionClass();
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = getBcp47ForCode(selectedLangCode);
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          playMicStartSound();
        };

        recognition.onresult = (event: any) => {
          let finalChunk = '';
          let interimChunk = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i];
            if (res.isFinal) {
              finalChunk += res[0].transcript + ' ';
            } else {
              interimChunk += res[0].transcript;
            }
          }

          if (finalChunk) {
            const newFinal = finalChunk.trim();
            const prev = transcriptRef.current.trim();
            const updated = prev ? `${prev} ${newFinal}` : newFinal;
            setTranscript(updated);
            transcriptRef.current = updated;
            onTranscriptChange?.(updated);
          }

          setInterimTranscript(interimChunk);
          onInterimChange?.(interimChunk);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            setError('Microphone permission denied. Please allow microphone permissions in browser.');
          } else if (event.error === 'no-speech') {
            setError('No speech was detected. Please speak closer to your microphone and try again.');
          } else if (event.error === 'audio-capture') {
            setError('No microphone found on this device. Please connect a microphone.');
          } else if (event.error !== 'aborted') {
            setError(`Speech recognition note: ${event.error}`);
          }
          setIsListening(false);
          playMicStopSound();
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
          playMicStopSound();
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Failed to start speech recognition:', err);
        setError('Could not start microphone recording. Please try again.');
        setIsListening(false);
      }
    },
    [continuous, getBcp47ForCode, selectedLangCode, onTranscriptChange, onInterimChange]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    setInterimTranscript('');
    playMicStopSound();
  }, []);

  const toggleListening = useCallback(
    (appendMode = true) => {
      if (isListening) {
        stopListening();
      } else {
        startListening(appendMode);
      }
    },
    [isListening, startListening, stopListening]
  );

  const resetTranscript = useCallback(() => {
    setTranscript('');
    transcriptRef.current = '';
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    recordingSeconds,
    selectedLangCode,
    setSelectedLangCode,
    setTranscript,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
};
