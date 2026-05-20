import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { SaveCard } from '@/types/whatsapp';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

async function getSaveCard(id: string): Promise<SaveCard | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('saved_items')
    .select('*')
    .eq('id', id)
    .single();
  return data ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getSaveCard(id);

  if (!item) {
    return {
      title: 'Saved on SOR7ED',
      description: 'Your saved item from SOR7ED.',
    };
  }

  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      url: `${SITE_URL}/s/${id}`,
      siteName: 'SOR7ED',
      images: [{
        url: item.og_image_url,
        width: 1200,
        height: 630,
        alt: item.title,
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.description,
      images: [item.og_image_url],
    },
  };
}

export default async function SaveCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getSaveCard(id);

  if (!item) notFound();

  // Redirect immediately to target URL when tapped in WhatsApp
  redirect(item.target_url);
}
