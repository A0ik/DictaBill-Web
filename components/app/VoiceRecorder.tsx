'use client';
import { useState, useRef, useEffect } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  loading?: boolean;
  accentColor?: string;
  exampleText?: string;
  disabled?: boolean;
  visualizerBars?: number;
}

export default function VoiceRecorder({
  onRecordingComplete,
  loading,
  exampleText,
  disabled,
  visualizerBars = 48,
}: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsClient(true);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        onRecordingComplete(blob);
      };
      mr.start();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      alert('Accès micro refusé. Veuillez autoriser le microphone dans votre navigateur.');
    }
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    if (loading || disabled) return;
    if (recording) stop();
    else start();
  };

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        {/* Main button */}
        <button
          onClick={handleClick}
          disabled={loading || disabled}
          className={cn(
            'group w-16 h-16 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40',
            recording ? 'bg-none' : 'bg-none hover:bg-black/10'
          )}
          type="button"
          aria-label={recording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 text-black/70 animate-spin" />
          ) : recording ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-black cursor-pointer"
              style={{ animationDuration: '3s' }}
            />
          ) : (
            <Mic className="w-6 h-6 text-black/70" />
          )}
        </button>

        {/* Timer */}
        <span
          className={cn(
            'font-mono text-sm transition-opacity duration-300',
            recording || loading ? 'text-black/70' : 'text-black/30'
          )}
        >
          {formatDuration(duration)}
        </span>

        {/* Waveform */}
        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-0.5 rounded-full transition-all duration-300',
                recording
                  ? 'bg-black/50 animate-pulse'
                  : loading
                  ? 'bg-black/20 animate-pulse'
                  : 'bg-black/10 h-1'
              )}
              style={
                (recording || loading) && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        {/* Status label */}
        <p className="h-4 text-xs text-black/70">
          {loading
            ? 'Transcription en cours…'
            : recording
            ? 'Cliquez pour arrêter'
            : disabled
            ? 'Limite atteinte'
            : 'Cliquez pour parler'}
        </p>

        {/* Example text */}
        {!recording && !loading && exampleText && (
          <div className="mt-3 text-xs text-gray-400 text-center max-w-xs leading-relaxed px-4 py-2.5 rounded-xl bg-primary-50 border-l-2 border-primary-300 text-left">
            <span className="font-medium text-primary-600 block mb-0.5">Exemple :</span>
            {exampleText}
          </div>
        )}
      </div>
    </div>
  );
}
