'use server'

import { createClient } from '@supabase/supabase-js'

// We use a dedicated Service Role client here because signups 
// need to bypass RLS to insert new records before a user is "logged in".
const getServiceClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function signup(prevState: any, formData: FormData) {
  const supabase = getServiceClient()

  const email = formData.get('email') as string
  const whatsapp = formData.get('whatsapp') as string

  if (!email || !whatsapp) {
    return { error: 'Email and WhatsApp number are required.' }
  }

  // Clean input
  const cleanEmail = email.toLowerCase().trim()
  const cleanWhatsapp = whatsapp.trim().replace(/\s+/g, '') // Remove spaces from phone

  console.log(`Attempting signup for: ${cleanEmail}`);

  try {
    const { error } = await supabase
      .from('users')
      .insert({
        email: cleanEmail,
        whatsapp_number: cleanWhatsapp
      })

    if (error) {
      console.error('Signup DB Error:', error)
      if (error.code === '23505') {
        return { error: 'That email or WhatsApp number is already signed up.' }
      }
      return { error: `Database error: ${error.message}` }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Signup Critical Error:', err)
    return { error: 'Something went wrong. Please try again.' }
  }
}
