import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ExtractedClient {
  name: string;
  email?: string;
  phone?: string;
  siret?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  vat_number?: string;
  notes?: string;
}

// ── CSV parser (no external dep needed) ──────────────────────────────────────
function parseCSVText(text: string): ExtractedClient[] {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];

  // Detect separator
  const sep = lines[0].includes(';') ? ';' : ',';
  const raw = lines.map((l) => l.split(sep).map((v) => v.trim().replace(/^"|"$/g, '')));
  const headers = raw[0].map((h) => h.toLowerCase().replace(/\s+/g, '_'));

  const fieldMap: Record<string, keyof ExtractedClient> = {
    name: 'name', nom: 'name', company: 'name', entreprise: 'name', client: 'name',
    email: 'email', mail: 'email', courriel: 'email',
    phone: 'phone', tel: 'phone', telephone: 'phone', mobile: 'phone',
    siret: 'siret',
    address: 'address', adresse: 'address', rue: 'address',
    postal_code: 'postal_code', code_postal: 'postal_code', cp: 'postal_code',
    city: 'city', ville: 'city',
    vat_number: 'vat_number', tva: 'vat_number', numero_tva: 'vat_number',
    notes: 'notes', commentaire: 'notes',
  };

  const clients: ExtractedClient[] = [];
  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];
    const client: ExtractedClient = { name: '' };
    headers.forEach((h, idx) => {
      const field = fieldMap[h];
      if (field && row[idx]) (client as any)[field] = row[idx];
    });
    if (client.name) clients.push(client);
  }
  return clients;
}

// ── Excel parser ──────────────────────────────────────────────────────────────
async function parseExcel(buffer: ArrayBuffer): Promise<ExtractedClient[]> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const fieldMap: Record<string, keyof ExtractedClient> = {
    name: 'name', nom: 'name', company: 'name', entreprise: 'name', client: 'name',
    email: 'email', mail: 'email',
    phone: 'phone', tel: 'phone', telephone: 'phone',
    siret: 'siret',
    address: 'address', adresse: 'address',
    postal_code: 'postal_code', 'code postal': 'postal_code', cp: 'postal_code',
    city: 'city', ville: 'city',
    vat_number: 'vat_number', tva: 'vat_number',
    notes: 'notes',
  };

  return rows
    .map((row) => {
      const client: ExtractedClient = { name: '' };
      Object.entries(row).forEach(([key, val]) => {
        const norm = key.toLowerCase().trim();
        const field = fieldMap[norm];
        if (field && val) (client as any)[field] = String(val).trim();
      });
      return client;
    })
    .filter((c) => c.name);
}

// ── PDF / text via OpenRouter ─────────────────────────────────────────────────
async function extractFromText(text: string): Promise<ExtractedClient[]> {
  const key = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY;
  const url = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions';
  const model = process.env.OPENROUTER_API_KEY
    ? 'anthropic/claude-3-haiku'
    : 'llama-3.1-8b-instant';

  if (!key) throw new Error('No AI API key configured');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(process.env.OPENROUTER_API_KEY ? {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://dictabill.com',
        'X-Title': 'DictaBill',
      } : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant expert en extraction de données clients. Extrais tous les clients/entreprises présents dans le texte fourni.

Retourne un JSON avec un champ "clients" (tableau) où chaque client a ces champs (tous optionnels sauf name) :
- name (string) : nom de l'entreprise ou du contact
- email (string)
- phone (string)
- siret (string) : numéro SIRET (14 chiffres)
- address (string) : rue et numéro
- postal_code (string)
- city (string)
- vat_number (string) : numéro TVA intracommunautaire
- notes (string)

Si un champ n'est pas trouvé, omets-le. Retourne UNIQUEMENT le JSON.`,
        },
        {
          role: 'user',
          content: `Texte à analyser :\n\n${text.slice(0, 8000)}`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error('AI extraction failed: ' + await res.text());
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.clients) ? parsed.clients.filter((c: any) => c.name) : [];
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const name = file.name.toLowerCase();
    const buffer = await file.arrayBuffer();
    let clients: ExtractedClient[] = [];

    if (name.endsWith('.csv') || file.type === 'text/csv') {
      const text = new TextDecoder('utf-8').decode(buffer);
      clients = parseCSVText(text);
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls') || file.type.includes('spreadsheet')) {
      clients = await parseExcel(buffer);
    } else if (name.endsWith('.pdf') || file.type === 'application/pdf') {
      // Extract text from PDF via pdf-parse or send raw text via AI
      // Use AI to extract from the first 8KB of text representation
      const text = new TextDecoder('latin1').decode(buffer);
      clients = await extractFromText(text);
    } else {
      // Try as plain text / unknown
      const text = new TextDecoder('utf-8').decode(buffer);
      // Try CSV first
      clients = parseCSVText(text);
      if (clients.length === 0) {
        clients = await extractFromText(text);
      }
    }

    // Deduplicate by name
    const seen = new Set<string>();
    const unique = clients.filter((c) => {
      if (seen.has(c.name.toLowerCase())) return false;
      seen.add(c.name.toLowerCase());
      return true;
    });

    return NextResponse.json({ clients: unique, count: unique.length });
  } catch (err: any) {
    console.error('[import-clients]', err);
    return NextResponse.json({ error: err.message || 'Import failed' }, { status: 500 });
  }
}
