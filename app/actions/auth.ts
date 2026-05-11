'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const whatsapp = formData.get('whatsapp') as string

  if (!email || !whatsapp) {
    return { error: 'Email and WhatsApp number are required.' }
  }

  // Clean input
  const cleanEmail = email.toLowerCase().trim()
  const cleanWhatsapp = whatsapp.trim()

  const { error } = await supabase
    .from('users')
    .insert({
      email: cleanEmail,
      whatsapp_number: cleanWhatsapp
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'That email or WhatsApp number is already signed up.' }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  // If you wanted to do actual Supabase Auth signup:
  // const { error } = await supabase.auth.signUp({
  //   email: cleanEmail,
  //   password: '...', // User didn't provide password in the UI
  // })

  return { success: true }
}
