import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY;
  const url = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions';
  const model = process.env.OPENROUTER_API_KEY
    ? 'anthropic/claude-3-haiku'
    : 'llama-3.1-8b-instant';

  if (!key) return NextResponse.json({ error: 'No AI API key configured' }, { status: 500 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // Extract readable text from the file (works for text-based PDFs and plain text)
    const buffer = Buffer.from(await file.arrayBuffer());
    const rawText = buffer.toString('utf-8', 0, Math.min(buffer.length, 8000));
    // Keep only printable ASCII — strip binary garbage
    const extracted = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, '  ').trim();

    const systemPrompt = `Tu es un designer expert en templates de factures HTML professionnelles.
Analyse le contenu d'un document fourni et génère un template HTML de facture qui imite son style visuel (couleurs, typographie, mise en page, logo placement, etc.).

RÈGLES STRICTES :
- Utilise uniquement du HTML avec styles inline (pas de fichiers externes, pas de CDN)
- N'utilise PAS de balises <html>, <head>, <body> — juste le contenu du document
- Format A4, max-width 794px
- Utilise ces placeholders EXACTEMENT tels quels : {{NUMBER}} {{ISSUE_DATE}} {{DUE_DATE}} {{CLIENT_NAME}} {{CLIENT_ADDRESS}} {{CLIENT_CITY}} {{CLIENT_EMAIL}} {{COMPANY_NAME}} {{COMPANY_ADDRESS}} {{COMPANY_CITY}} {{SIRET}} {{VAT_NUMBER}} {{ITEMS_ROWS}} {{SUBTOTAL}} {{VAT}} {{TOTAL}} {{NOTES}} {{ACCENT_COLOR}}
- Les lignes d'items utilisent le placeholder {{ITEMS_ROWS}} qui est du HTML de lignes <tr>
- Retourne UNIQUEMENT le HTML, sans markdown, sans explication`;

    const userContent = extracted.length > 100
      ? `Voici le contenu extrait d'une facture existante. Génère un template HTML qui reproduit fidèlement son style :\n\n${extracted.slice(0, 4000)}`
      : `Génère un template HTML de facture professionnel moderne, sobre et élégant.`;

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
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      }),
    });

    if (!res.ok) throw new Error('AI generation failed: ' + await res.text());
    const data = await res.json();
    let html = (data.choices?.[0]?.message?.content ?? '').trim();

    // Strip possible markdown code fences
    html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/, '').trim();

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error('[analyze-template]', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
