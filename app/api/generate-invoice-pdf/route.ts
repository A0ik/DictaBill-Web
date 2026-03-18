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

  if (!key) {
    return NextResponse.json({ error: 'No AI API key configured' }, { status: 500 });
  }

  try {
    const { invoice, profile, style } = await request.json();

    const itemsRows = invoice.items
      .map(
        (it: any) => `
      <tr>
        <td style="padding:10px 14px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6">${it.description}</td>
        <td style="padding:10px 14px;font-size:13px;color:#6b7280;text-align:center;border-bottom:1px solid #f3f4f6">${it.quantity}</td>
        <td style="padding:10px 14px;font-size:13px;color:#6b7280;text-align:right;border-bottom:1px solid #f3f4f6">${it.unit_price.toFixed(2)} €</td>
        <td style="padding:10px 14px;font-size:13px;color:#6b7280;text-align:right;border-bottom:1px solid #f3f4f6">${it.vat_rate}%</td>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;text-align:right;border-bottom:1px solid #f3f4f6">${(it.quantity * it.unit_price).toFixed(2)} €</td>
      </tr>`
      )
      .join('');

    const invoiceData = {
      number: invoice.number,
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date || '',
      clientName: invoice.client?.name || invoice.client_name_override || '',
      clientAddress: invoice.client?.address || '',
      clientCity: `${invoice.client?.postal_code || ''} ${invoice.client?.city || ''}`.trim(),
      clientEmail: invoice.client?.email || '',
      subtotal: invoice.subtotal.toFixed(2),
      vat: invoice.vat_amount.toFixed(2),
      total: invoice.total.toFixed(2),
      notes: invoice.notes || '',
      companyName: profile?.company_name || '',
      companyAddress: profile?.address || '',
      companyCity: `${profile?.postal_code || ''} ${profile?.city || ''}`.trim(),
      siret: profile?.siret || '',
      vatNumber: profile?.vat_number || '',
      accentColor: profile?.accent_color || '#1D9E75',
      itemsRows,
    };

    const systemPrompt = `Tu es un designer expert en factures professionnelles. Génère un template HTML complet pour une facture, en style "${style || 'moderne et professionnel'}".

IMPORTANT :
- Utilise uniquement du HTML inline + style tags (pas de fichiers externes)
- N'utilise PAS de balise <html>, <head>, <body> — juste le contenu
- Formate pour A4 (210mm × 297mm), max-width 794px
- Utilise la couleur accent : ${invoiceData.accentColor}
- Garde tous les placeholders {{FIELD}} exactement tels quels
- Le HTML doit être complet et rendu directement dans un div

Placeholders disponibles :
{{NUMBER}} {{ISSUE_DATE}} {{DUE_DATE}} {{CLIENT_NAME}} {{CLIENT_ADDRESS}} {{CLIENT_CITY}} {{CLIENT_EMAIL}}
{{COMPANY_NAME}} {{COMPANY_ADDRESS}} {{COMPANY_CITY}} {{SIRET}} {{VAT_NUMBER}}
{{ITEMS_ROWS}} {{SUBTOTAL}} {{VAT}} {{TOTAL}} {{NOTES}}

Retourne UNIQUEMENT le HTML, sans explication.`;

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
          { role: 'user', content: `Génère un template HTML facture style "${style || 'moderne'}". Couleur accent: ${invoiceData.accentColor}` },
        ],
      }),
    });

    if (!res.ok) throw new Error('AI generation failed: ' + await res.text());
    const data = await res.json();
    let html = data.choices?.[0]?.message?.content ?? '';

    // Replace placeholders with actual data
    html = html
      .replace(/\{\{NUMBER\}\}/g, invoiceData.number)
      .replace(/\{\{ISSUE_DATE\}\}/g, invoiceData.issueDate)
      .replace(/\{\{DUE_DATE\}\}/g, invoiceData.dueDate)
      .replace(/\{\{CLIENT_NAME\}\}/g, invoiceData.clientName)
      .replace(/\{\{CLIENT_ADDRESS\}\}/g, invoiceData.clientAddress)
      .replace(/\{\{CLIENT_CITY\}\}/g, invoiceData.clientCity)
      .replace(/\{\{CLIENT_EMAIL\}\}/g, invoiceData.clientEmail)
      .replace(/\{\{COMPANY_NAME\}\}/g, invoiceData.companyName)
      .replace(/\{\{COMPANY_ADDRESS\}\}/g, invoiceData.companyAddress)
      .replace(/\{\{COMPANY_CITY\}\}/g, invoiceData.companyCity)
      .replace(/\{\{SIRET\}\}/g, invoiceData.siret)
      .replace(/\{\{VAT_NUMBER\}\}/g, invoiceData.vatNumber)
      .replace(/\{\{ITEMS_ROWS\}\}/g, invoiceData.itemsRows)
      .replace(/\{\{SUBTOTAL\}\}/g, invoiceData.subtotal)
      .replace(/\{\{VAT\}\}/g, invoiceData.vat)
      .replace(/\{\{TOTAL\}\}/g, invoiceData.total)
      .replace(/\{\{NOTES\}\}/g, invoiceData.notes);

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error('[generate-invoice-pdf]', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
