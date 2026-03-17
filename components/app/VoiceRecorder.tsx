'use client';
import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  loading?: boolean;
  accentColor?: string;
  exampleText?: string;
  disabled?: boolean;
}

export default function VoiceRecorder({ onRecordingComplete, loading, accentColor = '#1D9E75', exampleText, disabled }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
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
      alert('Microphone access denied. Please allow microphone access in your browser.');
    }
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Mic button */}
      <button
        onClick={recording ? stop : start}
        disabled={loading || disabled}
        className={cn(
          'relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50',
          recording ? 'scale-110' : 'hover:scale-105'
        )}
        style={{ backgroundColor: recording ? '#EF4444' : accentColor }}
      >
        {/* Pulse ring when recording */}
        {recording && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#EF4444' }} />
            <span className="absolute inset-[-8px] rounded-full border-2 border-red-400/40 animate-pulse" />
          </>
        )}
        {loading ? (
          <Loader2 size={32} color="white" className="animate-spin" />
        ) : recording ? (
          <Square size={28} color="white" fill="white" />
        ) : (
          <Mic size={32} color="white" />
        )}
      </button>

      {/* Waveform when recording */}
      {recording && (
        <div className="flex items-center gap-1 h-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="wave-bar w-1.5 rounded-full"
              style={{ height: '100%', backgroundColor: accentColor, animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      )}

      {/* Status text */}
      <div className="text-center">
        {loading ? (
          <p className="text-sm font-medium text-gray-600 animate-pulse">Transcription en cours…</p>
        ) : recording ? (
          <p className="text-sm font-semibold text-red-500">{formatDuration(duration)} — Cliquez pour arrêter</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-500 mb-2">Cliquez sur le micro pour dicter</p>
            {exampleText && (
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed px-4 py-2.5 rounded-xl"
                 style={{ backgroundColor: accentColor + '10', borderLeft: `3px solid ${accentColor}` }}>
                {exampleText}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
