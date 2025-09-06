import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackEmailRequest {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, message }: FeedbackEmailRequest = await req.json();

    console.log("Received feedback:", { firstName, lastName, email, messageLength: message.length });

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "OmraBonsPlans <onboarding@resend.dev>",
      to: ["admin@omrabonsplans.fr"], // Remplacez par votre vraie adresse email
      subject: `Nouveau feedback de ${firstName} ${lastName}`,
      html: `
        <h1>Nouveau message de feedback</h1>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Informations de contact :</h3>
          <p><strong>Nom :</strong> ${firstName} ${lastName}</p>
          <p><strong>Email :</strong> ${email}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
          <h3>Message :</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Ce message a été envoyé depuis le formulaire de feedback d'OmraBonsPlans.fr
        </p>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "OmraBonsPlans <onboarding@resend.dev>",
      to: [email],
      subject: "Merci pour votre message !",
      html: `
        <h1>Bonjour ${firstName},</h1>
        <p>Nous avons bien reçu votre message et vous en remercions !</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3>Votre message :</h3>
          <p style="white-space: pre-wrap; font-style: italic;">"${message}"</p>
        </div>
        
        <p>Votre avis est très important pour nous et nous aide à améliorer continuellement nos services. Notre équipe examinera votre suggestion avec attention.</p>
        
        <p>Si votre message nécessite une réponse de notre part, nous vous recontacterons dans les plus brefs délais à cette adresse email.</p>
        
        <p>Merci encore pour votre confiance et votre engagement !</p>
        
        <p>Cordialement,<br>
        <strong>L'équipe OmraBonsPlans.fr</strong></p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Si vous n'êtes pas à l'origine de ce message, veuillez l'ignorer.
        </p>
      `,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);
    console.log("User email sent successfully:", userEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      adminEmail: adminEmailResponse,
      userEmail: userEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);