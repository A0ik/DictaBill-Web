'use client';
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Client, Invoice, InvoiceItem, DocumentType, DashboardStats } from '@/types';

function generateId() {
  return crypto.randomUUID();
}

interface DataState {
  clients: Client[];
  invoices: Invoice[];
  stats: DashboardStats | null;
  loading: boolean;
  fetchClients: () => Promise<void>;
  createClient: (data: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Client>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  fetchInvoices: () => Promise<void>;
  createInvoice: (data: {
    client_id?: string;
    client_name_override?: string;
    document_type: DocumentType;
    issue_date: string;
    due_date?: string;
    items: Omit<InvoiceItem, 'id' | 'total'>[];
    notes?: string;
  }, profile: any) => Promise<Invoice>;
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<void>;
  updateInvoiceStatus: (id: string, status: string) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  computeStats: () => void;
  clearData: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  clients: [],
  invoices: [],
  stats: null,
  loading: false,

  clearData: () => set({ clients: [], invoices: [], stats: null }),

  fetchClients: async () => {
    const { data, error } = await supabase.from('clients').select('*').order('name');
    if (error) { console.error(error); return; }
    set({ clients: data || [] });
  },

  createClient: async (clientData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');
    const { data, error } = await supabase.from('clients').insert({ ...clientData, user_id: user.id }).select().single();
    if (error) throw error;
    set((s) => ({ clients: [...s.clients, data].sort((a, b) => a.name.localeCompare(b.name)) }));
    return data;
  },

  updateClient: async (id, updates) => {
    const { data, error } = await supabase.from('clients').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    set((s) => ({ clients: s.clients.map((c) => (c.id === id ? data : c)) }));
  },

  deleteClient: async (id) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
  },

  fetchInvoices: async () => {
    const { data, error } = await supabase.from('invoices').select('*, client:clients(*)').order('created_at', { ascending: false });
    if (error) { console.error(error); return; }
    set({ invoices: data || [] });
    get().computeStats();
  },

  createInvoice: async (formData, profile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const items = formData.items.map((item) => ({
      ...item,
      id: generateId(),
      total: item.quantity * item.unit_price,
    }));
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const vatAmount = items.reduce((s, i) => s + i.total * (i.vat_rate / 100), 0);
    const total = subtotal + vatAmount;

    const docType = formData.document_type;
    const prefix = docType === 'quote' ? 'DEVIS' : docType === 'credit_note' ? 'AVOIR' : (profile.invoice_prefix || 'FACT');
    const year = new Date().getFullYear();
    const num = String((profile.invoice_count || 0) + 1).padStart(3, '0');
    const number = `${prefix}-${year}-${num}`;

    const { data, error } = await supabase.from('invoices').insert({
      user_id: user.id,
      client_id: formData.client_id || null,
      client_name_override: formData.client_name_override || null,
      number,
      document_type: docType,
      status: 'draft',
      issue_date: formData.issue_date,
      due_date: formData.due_date || null,
      items,
      subtotal,
      vat_amount: vatAmount,
      total,
      notes: formData.notes || null,
    }).select('*, client:clients(*)').single();

    if (error) throw error;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const isNewMonth = (profile.invoice_month || '') !== currentMonth;
    const prevMonthly = isNewMonth ? 0 : (profile.monthly_invoice_count || 0);
    await supabase.from('profiles').update({
      invoice_count: (profile.invoice_count || 0) + 1,
      monthly_invoice_count: prevMonthly + 1,
      invoice_month: currentMonth,
    }).eq('id', user.id);

    set((s) => ({ invoices: [data, ...s.invoices] }));
    get().computeStats();
    return data;
  },

  updateInvoice: async (id, updates) => {
    const items = updates.items?.map((item: any) => ({ ...item, total: item.quantity * item.unit_price }));
    const subtotal = items ? items.reduce((s: number, i: any) => s + i.total, 0) : undefined;
    const vatAmount = items ? items.reduce((s: number, i: any) => s + i.total * (i.vat_rate / 100), 0) : undefined;
    const total = subtotal !== undefined && vatAmount !== undefined ? subtotal + vatAmount : undefined;

    const payload: any = { ...updates, updated_at: new Date().toISOString() };
    if (items) { payload.items = items; payload.subtotal = subtotal; payload.vat_amount = vatAmount; payload.total = total; }

    const { data, error } = await supabase.from('invoices').update(payload).eq('id', id).select('*, client:clients(*)').single();
    if (error) throw error;
    set((s) => ({ invoices: s.invoices.map((inv) => (inv.id === id ? data : inv)) }));
    get().computeStats();
  },

  updateInvoiceStatus: async (id, status) => {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (status === 'paid') updates.paid_at = new Date().toISOString();
    if (status === 'sent') updates.sent_at = new Date().toISOString();
    const { data, error } = await supabase.from('invoices').update(updates).eq('id', id).select('*, client:clients(*)').single();
    if (error) throw error;
    set((s) => ({ invoices: s.invoices.map((inv) => (inv.id === id ? data : inv)) }));
    get().computeStats();
  },

  deleteInvoice: async (id) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
    set((s) => ({ invoices: s.invoices.filter((inv) => inv.id !== id) }));
    get().computeStats();
  },

  computeStats: () => {
    const { invoices } = get();
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const invoicesOnly = invoices.filter((inv) => inv.document_type === 'invoice' || !inv.document_type);
    const mrr = invoicesOnly
      .filter((inv) => inv.status === 'paid' && (inv.paid_at || inv.issue_date || '').startsWith(thisMonth))
      .reduce((s, inv) => s + inv.total, 0);
    const pendingInvoices = invoicesOnly.filter((inv) => inv.status === 'sent');
    const overdueInvoices = invoicesOnly.filter((inv) => inv.status === 'overdue');

    set({
      stats: {
        mrr,
        pendingCount: pendingInvoices.length,
        pendingRevenue: pendingInvoices.reduce((s, inv) => s + inv.total, 0),
        overdueCount: overdueInvoices.length,
        overdueRevenue: overdueInvoices.reduce((s, inv) => s + inv.total, 0),
      },
    });
  },
}));
