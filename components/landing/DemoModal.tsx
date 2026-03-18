'use client';
import { useState, useRef } from 'react';
import { X, Mic, Square, Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface DemoResult {
  client_name?: string;
  items?: Array<{ description: string; quantity: number; unit_price: number; vat_rate: number }>;
  due_date?: string;
  notes?: string;
  voice_transcript?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DemoModal({ open, onClose }: Props) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  if (!open) return null;

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await analyze(blob);
      };
      mr.start(100);
      setRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 100);
    } catch {
      setError('Microphone non disponible. Autorise l\'accès dans ton navigateur.');
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const analyze = async (blob: Blob) => {
    setLoading(true);
    const fd = new FormData();
    fd.append('audio', blob, 'demo.webm');
    try {
      const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Erreur lors de l\'analyse. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError('');
    setElapsed(0);
  };

  const total = result?.items?.reduce(
    (s, it) => s + it.quantity * it.unit_price * (1 + it.vat_rate / 100), 0
  ) ?? 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900 text-lg">Essaie sans inscription</h2>
            <p className="text-xs text-gray-400 mt-0.5">Dicte ta facture, l'IA génère l'aperçu</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Example hint */}
          {!result && !loading && (
            <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
              <p className="text-[11px] font-bold text-primary-600 uppercase tracking-wide mb-1">Exemple à dire</p>
              <p className="text-sm text-primary-900 italic font-medium">
                "Facture pour Acme Corp, développement web, 1 500 euros HT, TVA 20 pourcent, paiement sous 30 jours"
              </p>
            </div>
          )}

          {/* Recording state */}
          {!result && !loading && (
            <div className="flex flex-col items-center gap-4 py-4">
              {!recording ? (
                <>
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center shadow-xl shadow-primary-200/50 transition-all active:scale-95"
                  >
                    <Mic size={32} color="white" />
                  </button>
                  <p className="text-sm font-semibold text-gray-600">Clique pour parler</p>
                </>
              ) : (
                <>
                  <button
                    onClick={stopRecording}
                    className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-200/50 transition-all ring-4 ring-red-200 animate-pulse"
                  >
                    <Square size={26} color="white" fill="white" />
                  </button>
                  <p className="text-sm font-semibold text-red-500">
                    Enregistrement — {elapsed}s — Clique pour arrêter
                  </p>
                  {/* Waveform animation */}
                  <div className="flex items-center gap-1 h-6">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="w-1 bg-red-400 rounded-full wave-bar" style={{ height: '100%', animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </>
              )}
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} className="text-primary-500 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-gray-800">L'IA analyse ta voix…</p>
              <p className="text-xs text-gray-400">Extraction du client, lignes, TVA, échéance…</p>
              <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-4 py-2.5">
                <CheckCircle2 size={16} />
                <p className="text-sm font-bold">Facture générée instantanément !</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                {result.voice_transcript && (
                  <p className="text-xs text-gray-400 italic border-b border-gray-100 pb-2">"{result.voice_transcript}"</p>
                )}
                {result.client_name && (
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400 font-medium">Client</span>
                    <span className="text-sm font-bold text-gray-900">{result.client_name}</span>
                  </div>
                )}
                {result.items?.map((it, i) => (
                  <div key={i} className="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700 flex-1 pr-2">{it.description}</span>
                    <span className="text-sm font-semibold text-gray-900 shrink-0">{it.quantity} × {it.unit_price.toFixed(2)}€</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t-2 border-gray-900">
                  <span className="text-sm font-black text-gray-900">Total TTC</span>
                  <span className="text-xl font-black text-primary-600">{total.toFixed(2)} €</span>
                </div>
              </div>

              <p className="text-xs text-center text-gray-400">Crée un compte gratuit pour télécharger le PDF et envoyer la facture</p>

              <div className="flex gap-3">
                <Link
                  href="/register"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-primary-200"
                >
                  Créer mon compte gratuitement <ArrowRight size={14} />
                </Link>
                <button onClick={reset} className="p-3 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
