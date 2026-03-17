'use client';
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user });
        await get().fetchProfile(session.user.id);
      }
    } catch (e) {
      console.error('[authStore] init error:', e);
    } finally {
      set({ initialized: true });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        set({ user: session.user });
        await get().fetchProfile(session.user.id);
      } else {
        set({ user: null, profile: null });
      }
    });
  },

  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') return;
    if (data) set({ profile: data });
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) throw new Error('Non authentifié');
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, email: user.email, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    if (data) set({ profile: data });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));
