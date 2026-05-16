'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

// Service Role client for bypassing RLS during signup
const getAdminClient = () => createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type ActionState = { error: string } | { success: true; waVerifyCode?: string; waNumber?: string } | null

async function syncToNotionCRM(firstName: string, email: string, whatsapp: string) {
  const dbId = process.env.NOTION_CRM_DB_ID
  const apiKey = process.env.NOTION_API_KEY
  if (!dbId || !apiKey) return

  await fetch('https://api.notion.com/v1/pages', {
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
        Email: { email },
        WhatsApp: { phone_number: whatsapp },
        Status: { select: { name: 'Active' } },
        Source: { select: { name: 'Website' } },
        'Signed Up': { date: { start: new Date().toISOString().split('T')[0] } },
      },
    }),
  })
}

export async function handleSignupOrLogin(prevState: ActionState, formData: FormData) {
  const adminClient = getAdminClient()
  const supabase = await createServerClient()
  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const whatsapp = formData.get('whatsapp') as string
  const isLogin = formData.get('isLogin') === 'true'
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
    const waVerifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    pendingWaVerifyCode = waVerifyCode

    console.log(`Attempting signup for: ${cleanEmail}`)

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
        console.error('Signup DB Error:', dbError)
        if (dbError.code === '23505') {
          return { error: 'That email or WhatsApp number is already signed up. Try signing in!' }
        }
        return { error: `Database error: ${dbError.message}` }
      }

      // Mirror to Notion CRM — fire-and-forget, never blocks signup
      syncToNotionCRM(cleanFirstName, cleanEmail, cleanWhatsapp).catch(err =>
        console.error('Notion CRM sync failed (non-critical):', err)
      )
    } catch (err: unknown) {
      console.error('Signup DB Critical Error:', err)
      return { error: 'Something went wrong saving your details.' }
    }
  }

  // Send Magic Link
  try {
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    })

    if (authError) {
      console.error('Auth Error:', authError)
      return { error: authError.message }
    }

    return {
      success: true as const,
      ...(pendingWaVerifyCode ? { waVerifyCode: pendingWaVerifyCode, waNumber: '447591922247' } : {}),
    }
  } catch (err: unknown) {
    console.error('Auth Critical Error:', err)
    return { error: 'Failed to send magic link. Please try again.' }
  }
}
