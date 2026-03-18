'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Download, Send, CheckCircle, Copy, Trash2, Pencil, Save, X, ArrowLeft, Mail, Loader2, Sparkles, Lock, FileCode2
} from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import { useT } from '@/hooks/useTranslation';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getDocumentLabel } from '@/lib/utils';
import AppHeader from '@/components/app/AppHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import type { Invoice, InvoiceItem } from '@/types';
import Link from 'next/link';
import {
  INVOICE_TEMPLATES,
  canUseTemplate,
  renderTemplate,
  type TemplateId,
} from '@/lib/invoiceTemplates';
import { useSubscription } from '@/hooks/useSubscription';
import { generateFacturXML, embedFacturXInPDF } from '@/lib/facturx';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, lang } = useT();
  const { invoices, fetchInvoices, updateInvoice, updateInvoiceStatus, deleteInvoice, createInvoice } = useDataStore();
  const { profile } = useAuthStore();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [aiModal, setAiModal] = useState(false);
  const [aiStyle, setAiStyle] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiHtml, setAiHtml] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [templateTab, setTemplateTab] = useState<'templates' | 'ai'>('templates');
  const [facturxLoading, setFacturxLoading] = useState(false);
  const { canFacturX } = useSubscription();

  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editItems, setEditItems] = useState<InvoiceItem[]>([]);

  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  useEffect(() => {
    if (invoices.length === 0) fetchInvoices();
  }, []);

  useEffect(() => {
    const found = invoices.find((inv) => inv.id === id) || null;
    setInvoice(found);
    if (found) {
      setNotes(found.notes || '');
      setDueDate(found.due_date || '');
      setEditItems(found.items || []);
    }
  }, [invoices, id]);

  const handleSave = async () => {
    if (!invoice) return;
    setSaving(true);
    try {
      await updateInvoice(invoice.id, {
        notes,
        due_date: dueDate || undefined,
        items: editItems as any,
      });
      toast.success(t('settings.saved'));
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!invoice) return;
    try {
      await updateInvoiceStatus(invoice.id, 'paid');
      toast.success(t('invoices.markPaid'));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleMarkSent = async () => {
    if (!invoice) return;
    // Pre-fill email from client if available
    setSendEmail(invoice.client?.email || '');
    setSendModal(true);
  };

  const handleSendEmail = async () => {
    if (!invoice || !profile) return;
    const email = sendEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Adresse email invalide');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice, profile, recipientEmail: email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur envoi');
      await updateInvoiceStatus(invoice.id, 'sent');
      toast.success('Facture envoyée !');
      setSendModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;
    if (!confirm(t('invoices.deleteConfirm'))) return;
    try {
      await deleteInvoice(invoice.id);
      router.push('/invoices');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleGenerateAiPDF = async () => {
    if (!invoice || !profile) return;
    setAiGenerating(true);
    try {
      const res = await fetch('/api/generate-invoice-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice, profile, style: aiStyle || 'moderne et professionnel' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAiHtml(data.html);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleDownloadAiPDF = async () => {
    if (!aiHtml || !invoice) return;
    setGeneratingPDF(true);
    try {
      const container = document.createElement('div');
      container.innerHTML = aiHtml;
      container.style.cssText = 'position:fixed;top:0;left:0;width:794px;background:white;z-index:-9999;visibility:hidden;';
      document.body.appendChild(container);
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
      document.body.removeChild(container);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvas.toDataURL('image/png');
      const pageWidth = 210;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, Math.min(imgHeight, 297));
      pdf.save(`${invoice.number}-custom.pdf`);
      setAiModal(false);
    } catch (err: any) {
      toast.error('Erreur génération PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    setGeneratingPDF(true);
    try {
      const element = document.getElementById('invoice-printable');
      if (!element) return;
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let y = 0;
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multi-page support
        while (y < imgHeight) {
          pdf.addImage(imgData, 'PNG', 0, -y, imgWidth, imgHeight);
          y += pageHeight;
          if (y < imgHeight) pdf.addPage();
        }
      }
      pdf.save(`${invoice.number}.pdf`);
    } catch (err) {
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleApplyTemplate = (tplId: TemplateId) => {
    if (!invoice || !profile) return;
    setSelectedTemplate(tplId);
    const html = renderTemplate(tplId, { invoice, profile });
    setTemplateHtml(html);
  };

  const handleDownloadTemplatePDF = async () => {
    if (!templateHtml || !invoice) return;
    setGeneratingPDF(true);
    try {
      const container = document.createElement('div');
      container.innerHTML = templateHtml;
      container.style.cssText = 'position:fixed;top:0;left:0;width:794px;background:white;z-index:-9999;visibility:hidden;';
      document.body.appendChild(container);
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
      document.body.removeChild(container);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvas.toDataURL('image/png');
      const pageWidth = 210;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, Math.min(imgHeight, 297));
      pdf.save(`${invoice.number}-${selectedTemplate}.pdf`);
      setAiModal(false);
    } catch {
      toast.error('Erreur génération PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDownloadFacturX = async () => {
    if (!invoice || !profile) return;
    setFacturxLoading(true);
    try {
      const element = document.getElementById('invoice-printable');
      if (!element) return;
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let y = 0;
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
      } else {
        while (y < imgHeight) {
          pdf.addImage(imgData, 'PNG', 0, -y, pageWidth, imgHeight);
          y += pageHeight;
          if (y < imgHeight) pdf.addPage();
        }
      }
      const pdfBytes = pdf.output('arraybuffer');
      const xmlString = generateFacturXML(invoice, profile);
      const facturxBytes = await embedFacturXInPDF(pdfBytes, xmlString, invoice.number);
      const blob = new Blob([facturxBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.number}-facturx.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Factur-X téléchargé !');
    } catch {
      toast.error('Erreur génération Factur-X');
    } finally {
      setFacturxLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!invoice || !profile) return;
    try {
      const dup = await createInvoice(
        {
          client_id: invoice.client_id || undefined,
          client_name_override: invoice.client_name_override || undefined,
          document_type: invoice.document_type,
          issue_date: new Date().toISOString().split('T')[0],
          due_date: invoice.due_date || undefined,
          items: invoice.items.map(({ description, quantity, unit_price, vat_rate }) => ({
            description, quantity, unit_price, vat_rate,
          })),
          notes: invoice.notes || undefined,
        },
        profile
      );
      toast.success('Dupliqué !');
      router.push(`/invoices/${dup.id}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const updateEditItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setEditItems((prev) =>
      prev.map((it, i) =>
        i === idx
          ? { ...it, [field]: value, total: (field === 'quantity' ? Number(value) : it.quantity) * (field === 'unit_price' ? Number(value) : it.unit_price) }
          : it
      )
    );
  };

  if (!invoice) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader title="Document" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const clientName = invoice.client?.name || invoice.client_name_override || '—';
  const displayItems = editing ? editItems : invoice.items;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="no-print">
        <AppHeader title={invoice.number} />
      </div>

      <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full space-y-5">
        {/* Back + status + actions */}
        <div className="no-print flex items-center justify-between gap-3 flex-wrap">
          <Link href="/invoices" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800">
            <ArrowLeft size={16} /> {t('common.back')}
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
              {getStatusLabel(invoice.status, lang)}
            </span>
            {editing ? (
              <>
                <Button onClick={handleSave} loading={saving} size="sm" className="gap-1.5">
                  <Save size={14} /> {t('common.save')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="gap-1.5">
                  <X size={14} /> {t('common.cancel')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF} loading={generatingPDF} className="gap-1.5">
                  {generatingPDF ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Télécharger PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setAiModal(true); setAiHtml(null); }} className="gap-1.5">
                  <Sparkles size={14} className="text-primary-500" />
                  PDF personnalisé IA
                </Button>
                {canFacturX ? (
                  <Button variant="outline" size="sm" onClick={handleDownloadFacturX} loading={facturxLoading} className="gap-1.5">
                    {facturxLoading ? <Loader2 size={14} className="animate-spin" /> : <FileCode2 size={14} className="text-[#1D9E75]" />}
                    Factur-X
                  </Button>
                ) : (
                  <button
                    title="Factur-X disponible avec l'abonnement Pro"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-400 cursor-not-allowed"
                  >
                    <Lock size={12} /> Factur-X
                  </button>
                )}
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
                  <Pencil size={14} /> {t('invoices.editBtn')}
                </Button>
                {invoice.status === 'draft' && (
                  <Button size="sm" variant="secondary" onClick={handleMarkSent} className="gap-1.5">
                    <Mail size={14} /> Envoyer par email
                  </Button>
                )}
                {invoice.status !== 'paid' && (
                  <Button size="sm" onClick={handleMarkPaid} className="gap-1.5">
                    <CheckCircle size={14} /> {t('invoices.markPaid')}
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={handleDuplicate} className="gap-1.5">
                  <Copy size={14} /> {t('invoices.duplicateBtn')}
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete} className="gap-1.5">
                  <Trash2 size={14} />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ── Printable invoice document ── */}
        <div id="invoice-printable" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Invoice header */}
          <div className="p-8 md:p-10">
            <div className="flex items-start justify-between gap-6 flex-wrap mb-10">
              {/* Sender info */}
              <div>
                {profile?.logo_url && (
                  <img src={profile.logo_url} alt="Logo" className="h-10 mb-4 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                )}
                <h2 className="text-xl font-black text-gray-900">{profile?.company_name || 'Mon Entreprise'}</h2>
                {profile?.address && <p className="text-sm text-gray-500 mt-0.5">{profile.address}</p>}
                {profile?.city && <p className="text-sm text-gray-500">{profile?.postal_code} {profile.city}</p>}
                {profile?.siret && <p className="text-xs text-gray-400 mt-2">SIRET : {profile.siret}</p>}
                {profile?.vat_number && <p className="text-xs text-gray-400">TVA : {profile.vat_number}</p>}
              </div>

              {/* Document badge + number */}
              <div className="text-right">
                <div className="inline-block bg-primary-500 text-white px-5 py-2 rounded-xl mb-3">
                  <p className="font-bold text-sm">{getDocumentLabel(invoice.document_type, lang)}</p>
                </div>
                <p className="text-2xl font-black text-gray-900">{invoice.number}</p>
                <p className="text-sm text-gray-400 mt-1">{t('invoices.issueDate')} : {formatDate(invoice.issue_date, locale)}</p>
                {invoice.due_date && !editing && (
                  <p className="text-sm text-gray-400">{t('invoices.dueDate')} : {formatDate(invoice.due_date, locale)}</p>
                )}
                {editing && (
                  <div className="mt-2 text-left">
                    <Input label={t('invoices.dueDate')} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                )}
              </div>
            </div>

            {/* Client block */}
            <div className="bg-gray-50 rounded-xl p-5 mb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Destinataire</p>
              <p className="font-bold text-gray-900 text-base">{clientName}</p>
              {invoice.client?.address && <p className="text-sm text-gray-600">{invoice.client.address}</p>}
              {invoice.client?.city && <p className="text-sm text-gray-600">{invoice.client?.postal_code} {invoice.client.city}</p>}
              {invoice.client?.email && <p className="text-sm text-gray-500 mt-1">{invoice.client.email}</p>}
              {invoice.client?.siret && <p className="text-xs text-gray-400 mt-1">SIRET : {invoice.client.siret}</p>}
            </div>

            {/* Items table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="text-left py-3 px-4 text-xs font-bold rounded-l-xl">Description</th>
                    <th className="text-center py-3 px-4 text-xs font-bold">Qté</th>
                    <th className="text-right py-3 px-4 text-xs font-bold">Prix HT</th>
                    <th className="text-right py-3 px-4 text-xs font-bold">TVA</th>
                    <th className="text-right py-3 px-4 text-xs font-bold rounded-r-xl">Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="py-3 px-4">
                        {editing ? (
                          <input
                            value={item.description}
                            onChange={(e) => updateEditItem(idx, 'description', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-400"
                          />
                        ) : (
                          <span className="text-sm text-gray-800">{item.description}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {editing ? (
                          <input type="number" value={item.quantity} onChange={(e) => updateEditItem(idx, 'quantity', Number(e.target.value))}
                            className="w-16 text-sm border border-gray-200 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-primary-400" />
                        ) : (
                          <span className="text-sm text-gray-600">{item.quantity}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {editing ? (
                          <input type="number" value={item.unit_price} onChange={(e) => updateEditItem(idx, 'unit_price', Number(e.target.value))}
                            className="w-24 text-sm border border-gray-200 rounded-lg px-2 py-1 text-right focus:outline-none focus:ring-1 focus:ring-primary-400" />
                        ) : (
                          <span className="text-sm text-gray-600">{formatCurrency(item.unit_price, locale)}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {editing ? (
                          <input type="number" value={item.vat_rate} onChange={(e) => updateEditItem(idx, 'vat_rate', Number(e.target.value))}
                            className="w-16 text-sm border border-gray-200 rounded-lg px-2 py-1 text-right focus:outline-none focus:ring-1 focus:ring-primary-400" />
                        ) : (
                          <span className="text-sm text-gray-600">{item.vat_rate}%</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.quantity * item.unit_price, locale)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{t('invoices.subtotal')}</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(invoice.subtotal, locale)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{t('invoices.vat')}</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(invoice.vat_amount, locale)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t-2 border-gray-900">
                  <span>{t('invoices.total')}</span>
                  <span>{formatCurrency(invoice.total, locale)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(invoice.notes || editing) && (
              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('invoices.notes')}</p>
                {editing ? (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                  />
                ) : (
                  <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
                )}
              </div>
            )}

            {/* Legal footer */}
            <div className="border-t border-gray-100 pt-6 mt-6 text-xs text-gray-400 text-center">
              {profile?.siret && <span>SIRET {profile.siret} · </span>}
              {profile?.vat_number && <span>TVA {profile.vat_number} · </span>}
              <span>Document généré par DictaBill</span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Templates modal */}
      <Modal open={aiModal} onClose={() => { setAiModal(false); setTemplateHtml(null); setSelectedTemplate(null); setAiHtml(null); }} title="Choisir un template de facture">
        <div className="px-6 py-5 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTemplateTab('templates')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${templateTab === 'templates' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Templates
            </button>
            <button
              onClick={() => setTemplateTab('ai')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${templateTab === 'ai' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Sparkles size={11} /> IA personnalisé
            </button>
          </div>

          {/* Templates tab */}
          {templateTab === 'templates' && (
            <>
              {!templateHtml ? (
                <>
                  <p className="text-xs text-gray-400">Sélectionnez un template. Solo et Pro débloquent des designs supplémentaires.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {INVOICE_TEMPLATES.map((tpl) => {
                      const unlocked = canUseTemplate(tpl.id, profile?.subscription_tier);
                      return (
                        <button
                          key={tpl.id}
                          onClick={() => unlocked && handleApplyTemplate(tpl.id)}
                          className={`relative rounded-xl border-2 overflow-hidden text-left transition-all ${
                            selectedTemplate === tpl.id
                              ? 'border-primary-500'
                              : unlocked
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'border-gray-100 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="h-20 w-full" style={{ background: tpl.preview }} />
                          <div className="p-3">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-gray-900">{tpl.name}</span>
                              {!unlocked && <Lock size={11} className="text-gray-400 flex-shrink-0" />}
                              {tpl.tier !== 'free' && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${tpl.tier === 'pro' ? 'bg-[#0D0D0D] text-white' : 'bg-primary-100 text-primary-700'}`}>
                                  {tpl.tier}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">{tpl.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <Button onClick={() => selectedTemplate && handleApplyTemplate(selectedTemplate)} disabled={!selectedTemplate} fullWidth>
                    Prévisualiser
                  </Button>
                </>
              ) : (
                <>
                  <div
                    className="border border-gray-200 rounded-xl overflow-auto max-h-96 bg-white"
                    style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '167%', height: 380 }}
                    dangerouslySetInnerHTML={{ __html: templateHtml }}
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleDownloadTemplatePDF} loading={generatingPDF} fullWidth className="gap-2">
                      <Download size={14} /> Télécharger ce PDF
                    </Button>
                    <Button variant="ghost" onClick={() => { setTemplateHtml(null); setSelectedTemplate(null); }} className="gap-1.5 whitespace-nowrap">
                      ← Changer
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {/* AI tab */}
          {templateTab === 'ai' && (
            <>
              {!aiHtml ? (
                <>
                  <p className="text-sm text-gray-500">
                    Décrivez le style souhaité. L&apos;IA génère un template HTML unique.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Moderne minimaliste', 'Sombre et premium', 'Coloré et créatif', 'Classique professionnel'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setAiStyle(s)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all text-left ${
                          aiStyle === s ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <input
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 placeholder:text-gray-400"
                    placeholder="ex: fond noir, accent violet, typographie moderne"
                    value={aiStyle}
                    onChange={(e) => setAiStyle(e.target.value)}
                  />
                  <Button onClick={handleGenerateAiPDF} loading={aiGenerating} fullWidth className="gap-2">
                    <Sparkles size={15} />
                    {aiGenerating ? 'Génération en cours…' : 'Générer le template IA'}
                  </Button>
                </>
              ) : (
                <>
                  <div
                    className="border border-gray-200 rounded-xl overflow-auto max-h-96 bg-white p-4 text-xs"
                    dangerouslySetInnerHTML={{ __html: aiHtml }}
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleDownloadAiPDF} loading={generatingPDF} fullWidth className="gap-2">
                      <Download size={14} /> Télécharger ce PDF
                    </Button>
                    <Button variant="ghost" onClick={() => setAiHtml(null)} className="gap-1.5">
                      <Sparkles size={14} /> Régénérer
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* Send email modal */}
      <Modal open={sendModal} onClose={() => setSendModal(false)} title="Envoyer la facture par email">
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            La facture <span className="font-semibold">{invoice?.number}</span> sera envoyée par email au destinataire ci-dessous.
          </p>
          <Input
            label="Adresse email du destinataire"
            type="email"
            value={sendEmail}
            onChange={(e) => setSendEmail(e.target.value)}
            placeholder="client@exemple.fr"
          />
          <div className="flex gap-3">
            <Button loading={sending} onClick={handleSendEmail} fullWidth className="gap-2">
              <Send size={15} /> Envoyer
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setSendModal(false)}>Annuler</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
