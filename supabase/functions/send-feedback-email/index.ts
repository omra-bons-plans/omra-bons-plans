import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackEmailRequest {
  prenom: string;
  nom: string;
  mail: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prenom, nom, mail, message }: FeedbackEmailRequest = await req.json();

    console.log("Received feedback:", { prenom, nom, mail, messageLength: message.length });

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "OmraBonsPlans <contact@omrabonsplans.fr>",
      to: ["contact@omrabonsplans.fr"],
      reply_to: mail,
      subject: `Nouveau feedback de ${prenom} ${nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Nouveau feedback reçu
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Prénom :</strong> ${prenom}</p>
            <p><strong>Nom :</strong> ${nom}</p>
            <p><strong>Email :</strong> <a href="mailto:${mail}">${mail}</a></p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message :</h3>
            <div style="background-color: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="font-size: 12px; color: #666;">
            Ce message a été envoyé depuis le formulaire "Aidez-nous à nous améliorer" d'OmraBonsPlans.fr
          </p>
        </div>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "OmraBonsPlans <contact@omrabonsplans.fr>",
      to: [mail],
      subject: "Merci pour votre message !",
      html: `
        <h1>Bonjour ${prenom},</h1>
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
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);