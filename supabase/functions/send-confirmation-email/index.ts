import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { ConfirmationEmail } from './_templates/confirmation-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

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
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    // Verify webhook signature if hook secret is configured
    if (hookSecret) {
      const wh = new Webhook(hookSecret)
      try {
        const {
          user,
          email_data: { token, token_hash, redirect_to, email_action_type },
        } = wh.verify(payload, headers) as {
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

        // Only handle signup confirmations
        if (email_action_type !== 'signup') {
          return new Response(
            JSON.stringify({ message: 'Not a signup confirmation request' }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          )
        }

        console.log('Processing signup confirmation for:', user.email)

        // Render the React email template
        const html = await renderAsync(
          React.createElement(ConfirmationEmail, {
            supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
            token,
            token_hash,
            redirect_to: redirect_to || 'https://0d32be0f-306d-480b-b7fd-a00d6f7142c4.lovableproject.com/',
            email_action_type,
            user_email: user.email,
          })
        )

        // Send the email
        const { data, error } = await resend.emails.send({
          from: 'OmraBonsPlans.fr <noreply@omrabonsplans.fr>',
          to: [user.email],
          subject: '🕌 Confirmez votre compte - OmraBonsPlans.fr',
          html,
        })

        if (error) {
          console.error('Resend error:', error)
          throw error
        }

        console.log('Confirmation email sent successfully:', data)

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Confirmation email sent',
            email_id: data?.id 
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        )

      } catch (webhookError: any) {
        console.error('Webhook verification failed:', webhookError)
        // Fallback: try to parse as direct request
      }
    }

    // Fallback: parse as direct JSON request (for testing or non-webhook usage)
    const directPayload = JSON.parse(payload) as {
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

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = directPayload

    console.log('Processing direct confirmation request for:', user.email)

    // Render the React email template
    const html = await renderAsync(
      React.createElement(ConfirmationEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to: redirect_to || 'https://0d32be0f-306d-480b-b7fd-a00d6f7142c4.lovableproject.com/',
        email_action_type,
        user_email: user.email,
      })
    )

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'OmraBonsPlans.fr <noreply@omrabonsplans.fr>',
      to: [user.email],
      subject: '🕌 Confirmez votre compte - OmraBonsPlans.fr',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Confirmation email sent successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent',
        email_id: data?.id 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )

  } catch (error: any) {
    console.error('Error in send-confirmation-email function:', error)
    
    return new Response(
      JSON.stringify({
        error: {
          message: (error as Error).message || 'Internal server error',
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