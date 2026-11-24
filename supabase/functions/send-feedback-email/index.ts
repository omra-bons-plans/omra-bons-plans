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

// In-memory rate limit: max 5 requests per IP per hour
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Trop de requêtes. Réessayez dans une heure." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { prenom, nom, mail, message }: FeedbackEmailRequest = await req.json();

    if (!prenom || !nom || !mail || !message) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont obligatoires" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!EMAIL_REGEX.test(mail.trim()) || mail.length > 254) {
      return new Response(
        JSON.stringify({ error: "Adresse email invalide" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (message.trim().length < 1 || message.trim().length > 2000) {
      return new Response(
        JSON.stringify({ error: "Le message doit contenir entre 1 et 2000 caractères" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const safePrenom = escapeHtml(prenom.trim());
    const safeNom = escapeHtml(nom.trim());
    const safeMail = mail.trim().toLowerCase();
    const safeMessage = escapeHtml(message.trim());

    console.log("Received feedback:", { prenom: safePrenom, nom: safeNom, mail: safeMail, messageLength: safeMessage.length });

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "OmraBonsPlans <contact@omrabonsplans.fr>",
      to: ["contact@omrabonsplans.fr"],
      replyTo: safeMail,
      subject: `Nouveau feedback de ${safePrenom} ${safeNom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Nouveau feedback reçu
          </h2>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Prénom :</strong> ${safePrenom}</p>
            <p><strong>Nom :</strong> ${safeNom}</p>
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
            Ce message a été envoyé depuis le formulaire "Aidez-nous à nous améliorer" d'OmraBonsPlans.fr
          </p>
        </div>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "OmraBonsPlans <contact@omrabonsplans.fr>",
      to: [safeMail],
      subject: "Merci pour votre message !",
      html: `
        <h1>Bonjour ${safePrenom},</h1>
        <p>Nous avons bien reçu votre message et vous en remercions !</p>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3>Votre message :</h3>
          <p style="white-space: pre-wrap; font-style: italic;">"${safeMessage}"</p>
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
