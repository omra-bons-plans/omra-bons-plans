import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nom, prenom, mail, message }: ContactEmailRequest = await req.json();

    console.log("Received contact form submission:", { nom, prenom, mail });

    const emailResponse = await resend.emails.send({
      from: "OmraBonsPlans <contact@omrabonsplans.fr>",
      to: ["contact@omrabonsplans.fr"],
      reply_to: mail,
      subject: `Nouveau message de contact de ${prenom} ${nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nom :</strong> ${nom}</p>
            <p><strong>Prénom :</strong> ${prenom}</p>
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