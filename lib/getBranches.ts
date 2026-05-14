import { createClient } from '@/lib/supabase/server';

export type Branch = {
  id: string;
  num: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  description: string;
  cover_image: string;
};

export async function getBranches(): Promise<Branch[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('branches')
    .select('*')
    .order('num', { ascending: true });
  return data || [];
}
