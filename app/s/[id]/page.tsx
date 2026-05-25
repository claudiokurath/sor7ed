// app/s/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  try {
    const { data: link, error } = await supabase
      .from('rich_links')
      .select('title, description, target_url, image_url')
      .eq('slug', id)
      .single()

    if (error || !link) {
      return {
        title: 'Link Not Found',
        description: 'This link does not exist or has been removed.',
      }
    }

    return {
      title: link.title,
      description: link.description || undefined,
      openGraph: {
        title: link.title,
        description: link.description || undefined,
        url: link.target_url,
        images: link.image_url
          ? [{ url: link.image_url, width: 1200, height: 630, alt: link.title }]
          : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: link.title,
        description: link.description || undefined,
        images: link.image_url ? [link.image_url] : [],
      },
    }
  } catch (error) {
    console.error('Metadata generation error:', error)
    return {
      title: 'Error Loading Link',
      description: 'An error occurred while loading this link.',
    }
  }
}

export default async function RichLinkPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  try {
    const { data: link, error } = await supabase
      .from('rich_links')
      .select('*')
      .eq('slug', id)
      .single()

    if (error || !link) {
      console.error('Link not found:', { slug: id, error: error?.message })
      notFound()
    }

    const headersList = await headers()
    const userAgent = headersList.get('user-agent') ?? 'unknown'

    supabase.from('rich_link_clicks').insert({
      link_id: link.id,
      user_agent: userAgent,
    }).then(({ error: clickError }) => {
      if (clickError) console.error('Click tracking failed:', clickError.message)
    })

    redirect(link.target_url)
  } catch (error) {
    console.error('Rich link page error:', {
      slug: id,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    notFound()
  }
}
