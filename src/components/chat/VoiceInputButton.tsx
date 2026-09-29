import * as React from 'react';
import { motion } from 'framer-motion';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VoiceInputButtonProps {
  /** Called with the transcription once recording stops. */
  onTranscription?: (text: string) => void;
  /** Called with any error. */
  onError?: (message: string) => void;
  /** Visual size. */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state. */
  disabled?: boolean;
  className?: string;
}

// Minimal browser SpeechRecognition typings for TypeScript.
interface SpeechRecognitionResultAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionResultAlternative;
  isFinal: boolean;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * VoiceInputButton — dictation for the AI assistant.
 *
 * Uses the Web Speech API when available. When unavailable, the button
 * renders as disabled with an explanatory tooltip so users know voice is
 * not supported in their browser. Never silently no-ops.
 */
export function VoiceInputButton({
  onTranscription,
  onError,
  size = 'md',
  disabled = false,
  className,
}: VoiceInputButtonProps) {
  const [supported, setSupported] = React.useState<boolean | null>(null);
  const [recording, setRecording] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);

  React.useEffect(() => {
    setSupported(getSpeechRecognition() !== null);
  }, []);

  const start = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      onError?.('Voice input is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const results = event.results[0];
      if (results && results[0]) {
        onTranscription?.(results[0].transcript);
      }
    };
    recognition.onerror = (event) => {
      onError?.(`Voice error: ${event.error ?? 'unknown'}`);
      setRecording(false);
    };
    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const toggle = () => {
    if (recording) stop();
    else start();
  };

  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  }[size];

  const isDisabled = disabled || supported === false;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isDisabled}
      aria-label={
        recording
          ? 'Stop voice input'
          : supported === false
            ? 'Voice input not supported'
            : 'Start voice input'
      }
      title={supported === false ? 'Voice input is not supported in this browser' : undefined}
      className={cn(
        'relative rounded-lg border flex items-center justify-center transition-colors shrink-0',
        sizeClass,
        isDisabled
          ? 'border-ink/10 bg-pearl-soft text-mist cursor-not-allowed opacity-60'
          : recording
            ? 'border-danger/50 bg-danger/[0.08] text-danger-deep'
            : 'border-ink/10 bg-white text-mist-deep hover:text-ocean hover:border-ocean/40',
        className
      )}
    >
      {recording ? (
        <>
          <Square className="h-3.5 w-3.5 fill-current" />
          <motion.span
            className="absolute inset-0 rounded-lg border border-danger/40"
            animate={{ opacity: [0.4, 0, 0.4], scale: [1, 1.15, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );
}