import type { Invoice, Profile } from '@/types';

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'dark';

export interface InvoiceTemplate {
  id: TemplateId;
  name: string;
  description: string;
  tier: 'free' | 'solo' | 'pro';
  preview: string; // CSS gradient or color for preview swatch
}

export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
  {
    id: 'classic',
    name: 'Classique',
    description: 'Sobre, légal, intemporel.',
    tier: 'free',
    preview: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
  },
  {
    id: 'modern',
    name: 'Moderne',
    description: 'En-tête coloré, mise en page aérée.',
    tier: 'solo',
    preview: 'linear-gradient(135deg, #1D9E75 0%, #0f7a5a 100%)',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Typographie seule, zéro décoration.',
    tier: 'solo',
    preview: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
  },
  {
    id: 'dark',
    name: 'Premium Dark',
    description: 'Fond noir, accents lumineux.',
    tier: 'pro',
    preview: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 100%)',
  },
];

export function canUseTemplate(tier: TemplateId, subscriptionTier?: string): boolean {
  const tpl = INVOICE_TEMPLATES.find((t) => t.id === tier);
  if (!tpl) return false;
  if (tpl.tier === 'free') return true;
  if (tpl.tier === 'solo') return subscriptionTier === 'solo' || subscriptionTier === 'pro';
  if (tpl.tier === 'pro') return subscriptionTier === 'pro';
  return false;
}

// ─── Template renderers ──────────────────────────────────────────────────────

interface TemplateData {
  invoice: Invoice;
  profile: Profile;
}

function formatNum(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function itemsTable(invoice: Invoice, headerBg: string, headerColor: string, altRowBg: string) {
  const rows = invoice.items
    .map(
      (it, i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : altRowBg}">
      <td style="padding:10px 14px;font-size:13px;color:#374151">${it.description}</td>
      <td style="padding:10px 14px;font-size:13px;color:#6b7280;text-align:center">${it.quantity}</td>
      <td style="padding:10px 14px;font-size:13px;color:#6b7280;text-align:right">${formatNum(it.unit_price)} €</td>
      <td style="padding:10px 14px;font-size:13px;color:#6b7280;text-align:right">${it.vat_rate}%</td>
      <td style="padding:10px 14px;font-size:13px;font-weight:700;text-align:right">${formatNum(it.quantity * it.unit_price)} €</td>
    </tr>`
    )
    .join('');

  return `
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead>
      <tr style="background:${headerBg}">
        <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:${headerColor};border-radius:6px 0 0 0">Description</th>
        <th style="padding:10px 14px;text-align:center;font-size:11px;font-weight:700;color:${headerColor}">Qté</th>
        <th style="padding:10px 14px;text-align:right;font-size:11px;font-weight:700;color:${headerColor}">Prix HT</th>
        <th style="padding:10px 14px;text-align:right;font-size:11px;font-weight:700;color:${headerColor}">TVA</th>
        <th style="padding:10px 14px;text-align:right;font-size:11px;font-weight:700;color:${headerColor};border-radius:0 6px 0 0">Total HT</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export function renderTemplate(templateId: TemplateId, data: TemplateData): string {
  const { invoice, profile } = data;
  const accent = profile.accent_color || '#1D9E75';
  const clientName = invoice.client?.name || invoice.client_name_override || '';
  const clientAddr = [
    invoice.client?.address,
    `${invoice.client?.postal_code || ''} ${invoice.client?.city || ''}`.trim(),
    invoice.client?.email,
  ]
    .filter(Boolean)
    .join('<br/>');

  switch (templateId) {
    case 'classic':
      return `
<div style="font-family:Georgia,serif;max-width:794px;margin:0 auto;padding:48px;color:#111;background:#fff">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
    <div>
      <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em">${profile.company_name || 'Mon Entreprise'}</div>
      ${profile.address ? `<div style="font-size:13px;color:#555;margin-top:4px">${profile.address}</div>` : ''}
      ${profile.city ? `<div style="font-size:13px;color:#555">${profile.postal_code || ''} ${profile.city}</div>` : ''}
      ${profile.siret ? `<div style="font-size:11px;color:#888;margin-top:8px">SIRET : ${profile.siret}</div>` : ''}
      ${profile.vat_number ? `<div style="font-size:11px;color:#888">TVA : ${profile.vat_number}</div>` : ''}
    </div>
    <div style="text-align:right">
      <div style="font-size:28px;font-weight:700;letter-spacing:-0.03em">${invoice.number}</div>
      <div style="font-size:12px;color:#888;margin-top:4px">Émise le ${invoice.issue_date}</div>
      ${invoice.due_date ? `<div style="font-size:12px;color:#888">Échéance : ${invoice.due_date}</div>` : ''}
    </div>
  </div>

  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:32px">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;margin-bottom:6px">Destinataire</div>
    <div style="font-weight:700;font-size:15px">${clientName}</div>
    <div style="font-size:13px;color:#6b7280;margin-top:4px;line-height:1.5">${clientAddr}</div>
  </div>

  ${itemsTable(invoice, '#111827', '#fff', '#f9fafb')}

  <div style="display:flex;justify-content:flex-end;margin-bottom:32px">
    <div style="width:240px">
      <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;padding:6px 0;border-bottom:1px solid #f3f4f6">
        <span>Sous-total HT</span><span style="font-weight:600;color:#111">${formatNum(invoice.subtotal)} €</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;padding:6px 0;border-bottom:1px solid #f3f4f6">
        <span>TVA</span><span style="font-weight:600;color:#111">${formatNum(invoice.vat_amount)} €</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:700;padding:10px 0;border-top:2px solid #111">
        <span>Total TTC</span><span>${formatNum(invoice.total)} €</span>
      </div>
    </div>
  </div>

  ${invoice.notes ? `<div style="border-top:1px solid #e5e7eb;padding-top:20px;font-size:12px;color:#6b7280">${invoice.notes}</div>` : ''}
  <div style="border-top:1px solid #e5e7eb;padding-top:16px;margin-top:24px;font-size:11px;color:#9ca3af;text-align:center">
    ${profile.siret ? `SIRET ${profile.siret} · ` : ''}Document généré par DictaBill
  </div>
</div>`;

    case 'modern':
      return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:794px;margin:0 auto;background:#fff;color:#111">
  <div style="background:${accent};padding:40px 48px;color:#fff">
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div>
        <div style="font-size:24px;font-weight:900;letter-spacing:-0.03em">${profile.company_name || 'Mon Entreprise'}</div>
        ${profile.address ? `<div style="font-size:13px;opacity:0.8;margin-top:2px">${profile.address}</div>` : ''}
        ${profile.city ? `<div style="font-size:13px;opacity:0.8">${profile.postal_code || ''} ${profile.city}</div>` : ''}
      </div>
      <div style="text-align:right">
        <div style="font-size:13px;opacity:0.7;text-transform:uppercase;letter-spacing:0.08em">Facture</div>
        <div style="font-size:28px;font-weight:900;letter-spacing:-0.03em;margin-top:2px">${invoice.number}</div>
      </div>
    </div>
  </div>

  <div style="padding:40px 48px">
    <div style="display:flex;justify-content:space-between;margin-bottom:36px">
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;margin-bottom:8px">Destinataire</div>
        <div style="font-weight:700;font-size:16px">${clientName}</div>
        <div style="font-size:13px;color:#6b7280;margin-top:4px;line-height:1.6">${clientAddr}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;margin-bottom:8px">Dates</div>
        <div style="font-size:13px;color:#374151">Émission : <strong>${invoice.issue_date}</strong></div>
        ${invoice.due_date ? `<div style="font-size:13px;color:#374151;margin-top:2px">Échéance : <strong>${invoice.due_date}</strong></div>` : ''}
      </div>
    </div>

    ${itemsTable(invoice, accent, '#fff', '#f0fdf9')}

    <div style="display:flex;justify-content:flex-end;margin-bottom:32px">
      <div style="width:260px;background:#f9fafb;border-radius:12px;padding:16px 20px">
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;padding:5px 0">
          <span>Sous-total HT</span><span>${formatNum(invoice.subtotal)} €</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;padding:5px 0">
          <span>TVA</span><span>${formatNum(invoice.vat_amount)} €</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:17px;font-weight:900;padding:10px 0;border-top:2px solid ${accent};margin-top:6px;color:${accent}">
          <span>Total TTC</span><span>${formatNum(invoice.total)} €</span>
        </div>
      </div>
    </div>

    ${invoice.notes ? `<div style="background:#f9fafb;border-radius:10px;padding:14px 18px;font-size:12px;color:#6b7280;margin-bottom:24px">${invoice.notes}</div>` : ''}
    <div style="font-size:11px;color:#9ca3af;text-align:center;padding-top:16px;border-top:1px solid #f3f4f6">
      ${profile.siret ? `SIRET ${profile.siret} · ` : ''}Document généré par DictaBill
    </div>
  </div>
</div>`;

    case 'minimal':
      return `
<div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:794px;margin:0 auto;padding:64px;background:#fff;color:#0D0D0D">
  <div style="margin-bottom:64px">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;margin-bottom:4px">Facture</div>
    <div style="font-size:40px;font-weight:900;letter-spacing:-0.04em;line-height:1">${invoice.number}</div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-bottom:48px">
    <div>
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;margin-bottom:10px">De</div>
      <div style="font-weight:700">${profile.company_name || 'Mon Entreprise'}</div>
      ${profile.address ? `<div style="font-size:13px;color:#6b7280;margin-top:2px">${profile.address}</div>` : ''}
      ${profile.city ? `<div style="font-size:13px;color:#6b7280">${profile.postal_code || ''} ${profile.city}</div>` : ''}
    </div>
    <div>
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;margin-bottom:10px">À</div>
      <div style="font-weight:700">${clientName}</div>
      <div style="font-size:13px;color:#6b7280;margin-top:2px;line-height:1.6">${clientAddr}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:48px">
    <div>
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;margin-bottom:4px">Date d'émission</div>
      <div style="font-size:14px;font-weight:600">${invoice.issue_date}</div>
    </div>
    ${invoice.due_date ? `<div>
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;margin-bottom:4px">Échéance</div>
      <div style="font-size:14px;font-weight:600">${invoice.due_date}</div>
    </div>` : ''}
  </div>

  ${itemsTable(invoice, '#0D0D0D', '#fff', '#fafafa')}

  <div style="display:flex;justify-content:flex-end;margin-bottom:48px">
    <div style="width:220px">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#9ca3af;padding:5px 0">
        <span>Sous-total HT</span><span>${formatNum(invoice.subtotal)} €</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#9ca3af;padding:5px 0">
        <span>TVA</span><span>${formatNum(invoice.vat_amount)} €</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:900;padding:12px 0;border-top:2px solid #0D0D0D;margin-top:4px;letter-spacing:-0.02em">
        <span>Total</span><span>${formatNum(invoice.total)} €</span>
      </div>
    </div>
  </div>

  <div style="font-size:10px;color:#d1d5db;text-align:center;padding-top:24px;border-top:1px solid #f3f4f6;letter-spacing:0.08em;text-transform:uppercase">
    ${profile.siret ? `SIRET ${profile.siret}  ·  ` : ''}DictaBill
  </div>
</div>`;

    case 'dark':
      return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:794px;margin:0 auto;background:#0D0D0D;color:#f9fafb">
  <div style="padding:48px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px">
      <div>
        <div style="font-size:22px;font-weight:900;letter-spacing:-0.03em;color:#fff">${profile.company_name || 'Mon Entreprise'}</div>
        ${profile.address ? `<div style="font-size:13px;color:#6b7280;margin-top:4px">${profile.address}</div>` : ''}
        ${profile.city ? `<div style="font-size:13px;color:#6b7280">${profile.postal_code || ''} ${profile.city}</div>` : ''}
        ${profile.siret ? `<div style="font-size:11px;color:#4b5563;margin-top:8px">SIRET : ${profile.siret}</div>` : ''}
      </div>
      <div style="text-align:right">
        <div style="display:inline-block;background:${accent};color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;padding:4px 12px;border-radius:20px;margin-bottom:8px">Facture</div>
        <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.03em">${invoice.number}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px">${invoice.issue_date}</div>
        ${invoice.due_date ? `<div style="font-size:12px;color:#6b7280">Éch. ${invoice.due_date}</div>` : ''}
      </div>
    </div>

    <div style="background:#1a1a1a;border-radius:12px;padding:20px 24px;margin-bottom:40px;border:1px solid #262626">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;margin-bottom:8px">Destinataire</div>
      <div style="font-weight:700;font-size:16px;color:#fff">${clientName}</div>
      <div style="font-size:13px;color:#9ca3af;margin-top:4px;line-height:1.6">${clientAddr}</div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <thead>
        <tr style="border-bottom:1px solid #262626">
          <th style="padding:12px 0;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280">Description</th>
          <th style="padding:12px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280">Qté</th>
          <th style="padding:12px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280">Prix HT</th>
          <th style="padding:12px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280">TVA</th>
          <th style="padding:12px 0 12px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280">Total HT</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items
          .map(
            (it) => `
          <tr style="border-bottom:1px solid #1a1a1a">
            <td style="padding:14px 0;font-size:14px;color:#e5e7eb">${it.description}</td>
            <td style="padding:14px 12px;font-size:13px;color:#9ca3af;text-align:center">${it.quantity}</td>
            <td style="padding:14px 12px;font-size:13px;color:#9ca3af;text-align:right">${formatNum(it.unit_price)} €</td>
            <td style="padding:14px 12px;font-size:13px;color:#9ca3af;text-align:right">${it.vat_rate}%</td>
            <td style="padding:14px 0;font-size:14px;font-weight:700;color:#fff;text-align:right">${formatNum(it.quantity * it.unit_price)} €</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <div style="display:flex;justify-content:flex-end;margin-bottom:40px">
      <div style="width:260px;border:1px solid #262626;border-radius:12px;overflow:hidden">
        <div style="display:flex;justify-content:space-between;padding:10px 16px;font-size:13px;color:#9ca3af;border-bottom:1px solid #262626">
          <span>Sous-total HT</span><span>${formatNum(invoice.subtotal)} €</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 16px;font-size:13px;color:#9ca3af;border-bottom:1px solid #262626">
          <span>TVA</span><span>${formatNum(invoice.vat_amount)} €</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:14px 16px;font-size:18px;font-weight:900;color:${accent};background:#111">
          <span>Total TTC</span><span>${formatNum(invoice.total)} €</span>
        </div>
      </div>
    </div>

    ${invoice.notes ? `<div style="background:#1a1a1a;border-radius:10px;padding:14px 18px;font-size:12px;color:#9ca3af;margin-bottom:32px;border:1px solid #262626">${invoice.notes}</div>` : ''}

    <div style="font-size:11px;color:#374151;text-align:center;padding-top:20px;border-top:1px solid #1a1a1a">
      ${profile.siret ? `SIRET ${profile.siret} · ` : ''}Document généré par DictaBill
    </div>
  </div>
</div>`;

    default:
      return '';
  }
}
