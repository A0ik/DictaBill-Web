import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Rate limiting : anonyme=10/h, authentifié=60/h (par user_id ou IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getIdentifier(request: NextRequest): { id: string; limit: number } {
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    try {
      const parts = auth.slice(7).split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (payload?.sub) return { id: `user:${payload.sub}`, limit: 60 };
      }
    } catch {}
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  return { id: `ip:${ip}`, limit: 10 };
}

function checkRateLimit(request: NextRequest): { allowed: boolean; limit: number } {
  const { id, limit } = getIdentifier(request);
  const now = Date.now();
  const entry = rateLimitMap.get(id);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(id, { count: 1, resetAt: now + 3_600_000 });
    return { allowed: true, limit };
  }
  if (entry.count >= limit) return { allowed: false, limit };
  entry.count++;
  return { allowed: true, limit };
}

// OpenRouter helper — falls back to Groq LLaMA if no OpenRouter key
async function extractWithLLM(transcript: string, today: string): Promise<any> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  const systemPrompt = `Tu es un assistant de facturation français expert. Extrais les informations d'une facture à partir d'une transcription vocale et retourne un JSON valide.

Champs à extraire :
- client_name (string) : nom du client ou de l'entreprise
- document_type (string) : "invoice" | "quote" | "credit_note" — "invoice" par défaut, "quote" si "devis", "credit_note" si "avoir"
- items (array) : liste de lignes de facturation, chaque ligne = { description: string, quantity: number, unit_price: number (HT), vat_rate: number }
- issue_date (string YYYY-MM-DD) : date d'émission, aujourd'hui si non précisé = ${today}
- due_date (string YYYY-MM-DD ou "") : date d'échéance calculée depuis ${today} si un délai est mentionné (ex: "30 jours" → ${new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]})
- notes (string ou "") : informations complémentaires, conditions particulières

Règles :
- vat_rate par défaut = 20. Si "sans TVA" ou "auto-entrepreneur" → 0. Si "TVA 10%" → 10
- unit_price TOUJOURS en HT. Si le prix est TTC avec TVA 20%, divise par 1.20
- Si plusieurs prestations distinctes → plusieurs items
- Si la quantité n'est pas précisée → 1
- Réponds UNIQUEMENT avec le JSON, aucun texte autour`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Transcription vocale : "${transcript}"` },
  ];

  // Try OpenRouter first (better models available)
  if (OPENROUTER_API_KEY) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://dictabill.com',
          'X-Title': 'DictaBill',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          temperature: 0,
          response_format: { type: 'json_object' },
          messages,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content ?? '{}';
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[transcribe] OpenRouter failed, falling back to Groq:', e);
    }
  }

  // Fallback: Groq LLaMA
  if (GROQ_API_KEY) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0,
        response_format: { type: 'json_object' },
        messages,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content ?? '{}';
      return JSON.parse(raw);
    }
  }

  throw new Error('No LLM available (set OPENROUTER_API_KEY or GROQ_API_KEY)');
}

export async function POST(request: NextRequest) {
  const { allowed, limit } = checkRateLimit(request);
  if (!allowed) {
    return NextResponse.json(
      { error: `Limite atteinte. Maximum ${limit} transcriptions par heure.` },
      { status: 429 },
    );
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file' }, { status: 400 });
    }

    // ── Step 1 : Transcription Groq Whisper ──────────────────────────────
    const whisperForm = new FormData();
    whisperForm.append('file', audioFile, 'audio.webm');
    whisperForm.append('model', 'whisper-large-v3-turbo');
    whisperForm.append('language', 'fr');
    whisperForm.append('response_format', 'json');

    const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
      body: whisperForm,
    });

    if (!whisperRes.ok) {
      const err = await whisperRes.text();
      console.error('[transcribe] Groq Whisper error:', err);
      return NextResponse.json({ error: 'Transcription failed', detail: err }, { status: 500 });
    }

    const { text: transcript } = await whisperRes.json();

    if (!transcript?.trim()) {
      return NextResponse.json({
        voice_transcript: '',
        client_name: '',
        document_type: 'invoice',
        items: [{ description: '', quantity: 1, unit_price: 0, vat_rate: 20 }],
        issue_date: today,
        due_date: '',
        notes: '',
      });
    }

    // ── Step 2 : Extraction structurée via OpenRouter ou Groq ─────────────
    let extracted: any = {};
    try {
      extracted = await extractWithLLM(transcript, today);
    } catch (err) {
      console.error('[transcribe] LLM extraction failed:', err);
      // Graceful fallback: put transcript in description
      return NextResponse.json({
        voice_transcript: transcript,
        client_name: '',
        document_type: 'invoice',
        items: [{ description: transcript, quantity: 1, unit_price: 0, vat_rate: 20 }],
        issue_date: today,
        due_date: '',
        notes: '',
      });
    }

    const items =
      Array.isArray(extracted.items) && extracted.items.length > 0
        ? extracted.items.map((it: any) => ({
            description: String(it.description ?? ''),
            quantity: Number(it.quantity) || 1,
            unit_price: Number(it.unit_price) || 0,
            vat_rate: Number(it.vat_rate) ?? 20,
          }))
        : [{ description: '', quantity: 1, unit_price: 0, vat_rate: 20 }];

    return NextResponse.json({
      voice_transcript: transcript,
      client_name: extracted.client_name || '',
      document_type: extracted.document_type || 'invoice',
      items,
      issue_date: extracted.issue_date || today,
      due_date: extracted.due_date || '',
      notes: extracted.notes || '',
    });
  } catch (err: any) {
    console.error('[transcribe] Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
