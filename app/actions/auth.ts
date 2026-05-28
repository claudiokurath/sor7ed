'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { randomInt } from 'crypto'

// Service Role client for bypassing RLS during signup
const getAdminClient = () => createAdminClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type ActionState = 
  | { error: string } 
  | { success: true; waVerifyCode?: string; waNumber?: string } 
  | null

async function syncToNotionCRM(firstName: string, email: string, whatsapp: string): Promise<void> {
  const dbId = process.env.NOTION_CRM_DB_ID
  const apiKey = process.env.NOTION_API_KEY
  
  if (!dbId || !apiKey) {
    console.warn('Notion CRM sync skipped: Missing environment variables')
    return
  }

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties: {
          Name: { title: [{ text: { content: firstName } }] },
          Email: { email: email },
          'Phone Number': { phone_number: whatsapp },
          'Member Status': { status: { name: 'Pending Verification' } },
          'Date Joined': { date: { start: new Date().toISOString().split('T')[0] } },
          'GDPR Consent': { checkbox: true },
          'Subscription Tier': { select: { name: 'Free' } },
          'WhatsApp Opted In': { checkbox: !!whatsapp },
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Notion CRM sync failed:', response.status, errorText)
    }
  } catch (error) {
    console.error('Notion CRM sync error:', error)
  }
}

export async function handleSignupOrLogin(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const adminClient = getAdminClient()
  const supabase = await createServerClient()
  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (host ? `${protocol}://${host}` : `${protocol}://localhost:3000`)

  const email = formData.get('email') as string | null
  const firstName = formData.get('firstName') as string | null
  const whatsapp = formData.get('whatsapp') as string | null
  const isLogin = formData.get('isLogin') === 'true'
  const rawNext = (formData.get('next') as string | null) || '/'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'
  
  let pendingWaVerifyCode: string | undefined

  if (!email) {
    return { error: 'Email is required.' }
  }

  const cleanEmail = email.toLowerCase().trim()

  if (!isLogin) {
    if (!firstName || !whatsapp) {
      return { error: 'First name and WhatsApp number are required for signup.' }
    }

    const cleanFirstName = firstName.trim()
    const cleanWhatsapp = whatsapp.trim().replace(/\s+/g, '')
    
    const waVerifyCode = randomInt(100000, 1000000).toString()
    pendingWaVerifyCode = waVerifyCode

    try {
      const { error: dbError } = await adminClient
        .from('users')
        .insert({
          first_name: cleanFirstName,
          email: cleanEmail,
          whatsapp_number: cleanWhatsapp,
          wa_verify_code: waVerifyCode,
        })

      if (dbError) {
        if (dbError.code === '23505') {
          return { error: 'That email or WhatsApp number is already signed up. Try signing in!' }
        }
        return { error: `Database error: ${dbError.message}` }
      }

      setImmediate(() => {
        syncToNotionCRM(cleanFirstName, cleanEmail, cleanWhatsapp)
          .catch(err => console.error('Notion CRM sync failed (non-critical):', err))
      })

    } catch (err: unknown) {
      console.error('Signup error:', err)
      return { error: 'Something went wrong saving your details.' }
    }
  }

  try {
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    return {
      success: true as const,
      ...(pendingWaVerifyCode ? { 
        waVerifyCode: pendingWaVerifyCode, 
        waNumber: '447591922247' 
      } : {}),
    }
  } catch (err: unknown) {
    console.error('Magic link error:', err)
    return { error: 'Failed to send magic link. Please try again.' }
  }
}
