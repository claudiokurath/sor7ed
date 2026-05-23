import React from 'react';
import { createClient } from '@/lib/supabase/server';

export interface SiteConfigItem {
  key: string;
  name: string;
  value_text: string | null;
  value_color: string | null;
  image_url: string | null;
  active: boolean;
}

export type SiteConfigMap = Record<string, {
  text: string;
  color: string;
  image: string;
  active: boolean;
}>;

// Helper to highlight words wrapped in *asterisks* using the accent color
export function renderFormattedText(text: string | null | undefined, highlightColor: string): React.ReactNode[] {
  if (!text) return [];
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const clean = part.slice(1, -1);
      return React.createElement('span', { key: index, style: { color: highlightColor } }, clean);
    }
    return part;
  });
}

// Hardcoded default values for styling, text, and images across the website
const DEFAULT_CONFIG: Record<string, { text: string; color: string; image: string; active: boolean }> = {
  home_hero: { text: '', color: '', image: '/Images/home/hero.jpg', active: true },
  intelligence_hero: { text: '', color: '', image: '/HERO.png', active: true },
  og_explore: { text: '', color: '', image: '/Images/og-explore.png', active: true },
  home_bg_color: { text: '', color: '#000000', image: '', active: true },
  home_accent_color: { text: '', color: '#00C4C4', image: '', active: true },
  home_accent_sec_color: { text: '', color: '#E8453C', image: '', active: true },
  home_hero_title: { text: 'Life admin, *actually* sor7ed.', color: '', image: '', active: true },
  home_hero_subtitle: { text: 'Practical protocols for neurodivergent adults — delivered straight to WhatsApp. No app, no overwhelm.', color: '', image: '', active: true },

  // explore page
  explore_hero_title: { text: 'Everything maps to *one* of seven areas', color: '', image: '', active: true },
  explore_hero_subtitle: { text: 'SOR7ED covers the seven areas most affected by executive dysfunction, ADHD, autism, and burnout. Pick yours.', color: '', image: '', active: true },
  explore_bg_color: { text: '', color: '#000000', image: '', active: true },
  explore_accent_color: { text: '', color: '#00C4C4', image: '', active: true },

  // tools page
  tools_hero_title: { text: '*Tools*', color: '', image: '', active: true },
  tools_hero_subtitle: { text: 'High-value audits designed for neurodivergent minds. Complete the assessment to unlock your personalised protocol on WhatsApp.', color: '', image: '', active: true },
  tools_bg_color: { text: '', color: '#000000', image: '', active: true },
  tools_accent_color: { text: '', color: '#E8453C', image: '', active: true },

  // intelligence page
  intelligence_hero_title: { text: 'All the things your *brain* has been waiting for', color: '', image: '', active: true },
  intelligence_hero_subtitle: { text: 'Most mental health content wasn\'t written for people who forget to drink water, not people who forget they\'re human.', color: '', image: '', active: true },
  intelligence_bg_color: { text: '', color: '#000000', image: '', active: true },
  intelligence_accent_color: { text: '', color: '#00C4C4', image: '', active: true },
};

export async function getSiteConfig(): Promise<SiteConfigMap> {
  const config = { ...DEFAULT_CONFIG };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('active', true);
      
    if (error) {
      // Gracefully log but don't crash to ensure 100% website uptime
      console.warn('[Config] Failed to fetch site_config from Supabase, using defaults:', error.message);
      return config;
    }
    
    if (data) {
      data.forEach((item: SiteConfigItem) => {
        config[item.key] = {
          text: item.value_text || DEFAULT_CONFIG[item.key]?.text || '',
          color: item.value_color || DEFAULT_CONFIG[item.key]?.color || '',
          image: item.image_url || DEFAULT_CONFIG[item.key]?.image || '',
          active: item.active
        };
      });
    }
  } catch (err: any) {
    console.warn('[Config] Exception fetching site_config:', err.message);
  }
  return config;
}
