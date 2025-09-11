import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { ResetPasswordEmail } from './_templates/reset-password-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    const payload = await req.json()
    
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = payload as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    // Only handle password recovery
    if (email_action_type !== 'recovery') {
      return new Response(
        JSON.stringify({ message: 'Not a password recovery request' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    console.log('Processing password recovery for:', user.email)

    // Render the React email template
    const html = await renderAsync(
      React.createElement(ResetPasswordEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to: redirect_to || 'https://lovable.dev/projects/lptyhenryzhztdwpkvsc',
        email_action_type,
        user_email: user.email,
      })
    )

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'OmraBonsPlans.fr Sécurité <security@omrabonsplans.fr>',
      to: [user.email],
      subject: '🔐 Réinitialisation de votre mot de passe - OmraBonsPlans.fr',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Password recovery email sent successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password recovery email sent',
        email_id: data?.id 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )

  } catch (error: any) {
    console.error('Error in send-reset-password-email function:', error)
    
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Internal server error',
          code: error.code || 'UNKNOWN_ERROR'
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})