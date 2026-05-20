export interface RichLink {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  target_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface RichLinkClick {
  id: string;
  link_id: string;
  user_agent: string | null;
  referer: string | null;
  clicked_at: string;
}
