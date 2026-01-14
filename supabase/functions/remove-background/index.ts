import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: 'No image file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const REMOVE_BG_API_KEY = Deno.env.get('REMOVE_BG_API_KEY');
    if (!REMOVE_BG_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'REMOVE_BG_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing image with remove.bg:', imageFile.name, 'Size:', imageFile.size);

    // Prepare form data for remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', imageFile);
    removeBgFormData.append('size', 'full'); // Full resolution for HD quality
    removeBgFormData.append('bg_color', 'FFFFFF'); // White background
    removeBgFormData.append('format', 'png'); // PNG for best quality

    // Call remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('remove.bg API error:', response.status, errorData);
      
      // Handle specific error codes
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'Crédits remove.bg épuisés. Veuillez recharger votre compte.',
            details: errorData
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de la suppression du fond',
          details: errorData
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the processed image as array buffer
    const imageBuffer = await response.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    console.log('Image processed successfully, output size:', imageBuffer.byteLength);

    return new Response(
      JSON.stringify({ 
        success: true,
        image: `data:image/png;base64,${base64Image}`,
        credits_charged: response.headers.get('X-Credits-Charged') || '1'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing image:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process image' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
