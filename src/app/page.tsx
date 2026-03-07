import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { normalizeLocaleFromAcceptLanguage } from '@/i18n/config';

export default async function RootRedirectPage() {
  const requestHeaders = await headers();
  const preferred = normalizeLocaleFromAcceptLanguage(requestHeaders.get('accept-language'));
  redirect(`/${preferred}`);
}
