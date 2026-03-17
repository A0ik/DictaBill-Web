'use client';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import '@/i18n';

export function useT() {
  const { t, i18n } = useI18nTranslation();
  return { t, lang: i18n.language as 'fr' | 'en', i18n };
}
