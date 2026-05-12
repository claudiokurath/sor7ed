'use server'

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

// We use a dedicated Service Role client here because signups 
// need to bypass RLS to insert new records before a user is "logged in".
const getServiceClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function handleSignupOrLogin(prevState: any, formData: FormData) {
  const supabase = getServiceClient()
  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const whatsapp = formData.get('whatsapp') as string
  const isLogin = formData.get('isLogin') === 'true'

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

    console.log(`Attempting signup for: ${cleanEmail}`)

    try {
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          first_name: cleanFirstName,
          email: cleanEmail,
          whatsapp_number: cleanWhatsapp
        })

      if (dbError) {
        console.error('Signup DB Error:', dbError)
        if (dbError.code === '23505') {
          return { error: 'That email or WhatsApp number is already signed up. Try signing in!' }
        }
        return { error: `Database error: ${dbError.message}` }
      }
    } catch (err: any) {
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

    return { success: true }
  } catch (err: any) {
    console.error('Auth Critical Error:', err)
    return { error: 'Failed to send magic link. Please try again.' }
  }
}
