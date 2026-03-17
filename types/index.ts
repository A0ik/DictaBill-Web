export type SubscriptionTier = 'free' | 'solo' | 'pro';
export type DocumentType = 'invoice' | 'quote' | 'credit_note';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'accepted' | 'refused';

export interface Profile {
  id: string;
  email: string;
  company_name?: string;
  siret?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  vat_number?: string;
  logo_url?: string;
  template_id?: number;
  accent_color?: string;
  legal_status?: string;
  sector?: string;
  subscription_tier?: SubscriptionTier;
  invoice_count?: number;
  monthly_invoice_count?: number;
  invoice_month?: string;
  invoice_prefix?: string;
  onboarding_done?: boolean;
  stripe_account_id?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  custom_template_html?: string;
  language?: 'fr' | 'en';
  expo_push_token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  siret?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  vat_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
  total: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id?: string;
  client?: Client;
  client_name_override?: string;
  number: string;
  document_type: DocumentType;
  status: InvoiceStatus;
  linked_invoice_id?: string;
  issue_date: string;
  due_date?: string;
  items: InvoiceItem[];
  subtotal: number;
  vat_amount: number;
  total: number;
  notes?: string;
  pdf_url?: string;
  payment_link?: string;
  voice_transcript?: string;
  sent_at?: string;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  mrr: number;
  pendingCount: number;
  pendingRevenue: number;
  overdueCount: number;
  overdueRevenue: number;
}
