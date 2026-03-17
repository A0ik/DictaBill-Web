'use client';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}

// Proxy to keep the same `supabase.auth.xxx` API but initialize lazily
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string) {
    return (getClient() as any)[prop];
  },
});
