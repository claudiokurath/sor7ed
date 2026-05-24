// app/s/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

// Server-side metadata generation for social media crawlers
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()

  try {
    const { data: link, error } = await supabase
      .from('rich_links')
      .select('title, description, target_url, image_url')
      .eq('slug', params.id)
      .single()

    if (error || !link) {
      console.error('Link metadata fetch failed:', { slug: params.id, error })
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
          ? [
              {
                url: link.image_url,
                width: 1200,
                height: 630,
                alt: link.title,
              },
            ]
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

// Main page component with redirect logic
export default async function RichLinkPage({ params }: Props) {
  const supabase = createClient()

  try {
    const { data: link, error } = await supabase
      .from('rich_links')
      .select('*')
      .eq('slug', params.id)
      .single()

    // Handle non-existent links with proper 404
    if (error || !link) {
      console.error('Link not found:', { 
        slug: params.id, 
        error: error?.message,
        timestamp: new Date().toISOString()
      })
      notFound()
    }

    // Track the click with enhanced user agent information
    const headersList = headers()
    const userAgent = headersList.get('user-agent') ?? 'unknown'
    const referer = headersList.get('referer')

    // Insert click tracking (non-blocking)
    supabase.from('rich_link_clicks').insert({
      link_id: link.id,
      user_agent: userAgent,
    }).then(({ error: clickError }) => {
      if (clickError) {
        console.error('Click tracking failed:', {
          linkId: link.id,
          slug: params.id,
          error: clickError.message,
          userAgent,
          referer
        })
      }
    })

    // Server-side redirect to target URL
    redirect(link.target_url)

  } catch (error) {
    console.error('Rich link page error:', {
      slug: params.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
    notFound()
  }
}
