import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  nom: string;
  prenom: string;
  mail: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { nom, prenom, mail, message } = body as ContactEmailRequest;

    // Validation des champs requis
    if (!nom || !prenom || !mail || !message) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont obligatoires" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validation des longueurs
    if (nom.trim().length < 2 || nom.trim().length > 100) {
      return new Response(
        JSON.stringify({ error: "Le nom doit contenir entre 2 et 100 caractères" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (prenom.trim().length < 2 || prenom.trim().length > 100) {
      return new Response(
        JSON.stringify({ error: "Le prénom doit contenir entre 2 et 100 caractères" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (!EMAIL_REGEX.test(mail.trim()) || mail.length > 254) {
      return new Response(
        JSON.stringify({ error: "Adresse email invalide" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (message.trim().length < 10 || message.trim().length > 5000) {
      return new Response(
        JSON.stringify({ error: "Le message doit contenir entre 10 et 5000 caractères" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const safeNom = escapeHtml(nom.trim());
    const safePrenom = escapeHtml(prenom.trim());
    const safeMail = mail.trim().toLowerCase();
    const safeMessage = escapeHtml(message.trim());

    console.log("Received contact form submission:", { nom: safeNom, prenom: safePrenom, mail: safeMail });

    const emailResponse = await resend.emails.send({
      from: "OmraBonsPlans <contact@omrabonsplans.fr>",
      to: ["contact@omrabonsplans.fr"],
      reply_to: safeMail,
      subject: `Nouveau message de contact de ${safePrenom} ${safeNom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nom :</strong> ${safeNom}</p>
            <p><strong>Prénom :</strong> ${safePrenom}</p>
            <p><strong>Email :</strong> <a href="mailto:${safeMail}">${safeMail}</a></p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message :</h3>
            <div style="background-color: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
              ${safeMessage.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="font-size: 12px; color: #666;">
            Ce message a été envoyé depuis le formulaire de contact d'OmraBonsPlans.fr
          </p>
        </div>
      `,
    });

    console.log("Contact email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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