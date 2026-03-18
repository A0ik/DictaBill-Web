import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Invoice, Profile } from '@/types';

export const dynamic = 'force-dynamic';

function buildInvoiceHtml(invoice: Invoice, profile: Profile): string {
  const clientName = invoice.client?.name || invoice.client_name_override || 'Client';
  const senderName = profile.company_name || 'Mon Entreprise';
  const accentColor = profile.accent_color || '#1D9E75';

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  const docLabel = invoice.document_type === 'quote'
    ? 'Devis'
    : invoice.document_type === 'credit_note'
    ? 'Avoir'
    : 'Facture';

  const itemsRows = invoice.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f1f1;font-size:14px;color:#374151">${item.description}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f1f1;font-size:14px;color:#374151;text-align:center">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f1f1;font-size:14px;color:#374151;text-align:right">${formatPrice(item.unit_price)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f1f1;font-size:14px;color:#374151;text-align:right">${item.vat_rate}%</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f1f1;font-size:14px;font-weight:600;color:#111827;text-align:right">${formatPrice(item.quantity * item.unit_price)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px">

    <!-- Header -->
    <div style="background:${accentColor};border-radius:16px 16px 0 0;padding:32px 40px;margin-bottom:0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <h1 style="margin:0;color:white;font-size:24px;font-weight:900">${senderName}</h1>
          ${profile.address ? `<p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">${profile.address}</p>` : ''}
          ${profile.city ? `<p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px">${profile.postal_code || ''} ${profile.city}</p>` : ''}
          ${profile.siret ? `<p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:11px">SIRET : ${profile.siret}</p>` : ''}
        </div>
        <div style="text-align:right">
          <div style="background:rgba(255,255,255,0.2);border-radius:8px;padding:6px 14px;display:inline-block">
            <p style="margin:0;color:white;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">${docLabel}</p>
          </div>
          <p style="margin:6px 0 0;color:white;font-size:20px;font-weight:900">${invoice.number}</p>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:12px">Émis le ${formatDate(invoice.issue_date)}</p>
          ${invoice.due_date ? `<p style="margin:2px 0 0;color:rgba(255,255,255,0.8);font-size:12px">Échéance : ${formatDate(invoice.due_date)}</p>` : ''}
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="background:white;border-radius:0 0 16px 16px;padding:32px 40px;box-shadow:0 4px 24px rgba(0,0,0,0.06)">

      <!-- Recipient -->
      <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:28px">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">Destinataire</p>
        <p style="margin:0;font-size:16px;font-weight:700;color:#111827">${clientName}</p>
        ${invoice.client?.address ? `<p style="margin:2px 0 0;font-size:13px;color:#6b7280">${invoice.client.address}</p>` : ''}
        ${invoice.client?.city ? `<p style="margin:0;font-size:13px;color:#6b7280">${invoice.client?.postal_code || ''} ${invoice.client.city}</p>` : ''}
      </div>

      <!-- Items table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="background:#111827">
            <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:white;border-radius:8px 0 0 0">Description</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:white">Qté</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;color:white">Prix HT</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;color:white">TVA</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;color:white;border-radius:0 8px 0 0">Total HT</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;margin-bottom:28px">
        <div style="min-width:220px">
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f1f1f1">
            <span style="font-size:13px;color:#6b7280">Sous-total HT</span>
            <span style="font-size:13px;font-weight:600;color:#374151">${formatPrice(invoice.subtotal)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f1f1f1">
            <span style="font-size:13px;color:#6b7280">TVA</span>
            <span style="font-size:13px;font-weight:600;color:#374151">${formatPrice(invoice.vat_amount)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 0 0">
            <span style="font-size:15px;font-weight:900;color:#111827">Total TTC</span>
            <span style="font-size:15px;font-weight:900;color:${accentColor}">${formatPrice(invoice.total)}</span>
          </div>
        </div>
      </div>

      ${invoice.notes ? `
      <div style="background:#f9fafb;border-radius:10px;padding:14px 16px;margin-bottom:24px">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">Notes</p>
        <p style="margin:0;font-size:13px;color:#374151">${invoice.notes}</p>
      </div>` : ''}

      <!-- Legal footer -->
      <div style="border-top:1px solid #f1f1f1;padding-top:20px;text-align:center">
        <p style="margin:0;font-size:11px;color:#9ca3af">
          ${profile.siret ? `SIRET ${profile.siret} · ` : ''}
          ${profile.vat_number ? `TVA ${profile.vat_number} · ` : ''}
          Document généré par DictaBill
        </p>
        ${invoice.due_date ? `<p style="margin:6px 0 0;font-size:12px;color:#6b7280">Pénalités de retard applicables dès le ${formatDate(invoice.due_date)} — Indemnité forfaitaire de recouvrement : 40€</p>` : ''}
      </div>
    </div>

    <!-- Footer -->
    <p style="text-align:center;margin-top:24px;font-size:11px;color:#9ca3af">
      Envoyé via <a href="https://dictabill.com" style="color:${accentColor};text-decoration:none">DictaBill</a>
    </p>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }

  let body: { invoice: Invoice; profile: Profile; recipientEmail: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { invoice, profile, recipientEmail } = body;

  if (!invoice || !profile || !recipientEmail) {
    return NextResponse.json({ error: 'invoice, profile and recipientEmail are required' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipientEmail)) {
    return NextResponse.json({ error: 'Invalid recipient email' }, { status: 400 });
  }

  const resend = new Resend(RESEND_API_KEY);

  const senderName = profile.company_name || 'DictaBill';
  const docLabel = invoice.document_type === 'quote'
    ? 'Devis'
    : invoice.document_type === 'credit_note'
    ? 'Avoir'
    : 'Facture';

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

  try {
    const { data, error } = await resend.emails.send({
      from: `${senderName} <factures@dictabill.com>`,
      to: [recipientEmail],
      subject: `${docLabel} ${invoice.number} — ${formatPrice(invoice.total)} TTC`,
      html: buildInvoiceHtml(invoice, profile),
    });

    if (error) {
      console.error('[send-invoice] Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (err: any) {
    console.error('[send-invoice] Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
