import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting scheduled exchange rate update...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const exchangerateApiKey = Deno.env.get('EXCHANGERATE_API_KEY');
    let eurToSar = 3.95; // Fallback value
    
    try {
      if (!exchangerateApiKey) {
        console.warn('EXCHANGERATE_API_KEY not found, using fallback APIs');
        throw new Error('ExchangeRate API key not configured');
      }
      
      // Use ExchangeRate-API with API key
      const exchangeResponse = await fetch(
        `https://v6.exchangerate-api.com/v6/${exchangerateApiKey}/latest/EUR`
      );
      
      if (exchangeResponse.ok) {
        const exchangeData = await exchangeResponse.json();
        console.log('ExchangeRate-API data:', exchangeData);
        
        if (exchangeData.conversion_rates && exchangeData.conversion_rates.SAR) {
          eurToSar = exchangeData.conversion_rates.SAR;
          console.log('Using ExchangeRate-API rate:', eurToSar);
        } else {
          console.warn('Invalid response from ExchangeRate-API, trying fallback');
          throw new Error('Invalid response from ExchangeRate-API');
        }
      } else {
        console.warn('ExchangeRate-API failed:', exchangeResponse.status, exchangeResponse.statusText);
        throw new Error('ExchangeRate-API failed');
      }
    } catch (exchangerateError) {
      console.warn('ExchangeRate-API error:', exchangerateError.message);
      
      try {
        // Fallback to Frankfurter API (European Central Bank data, completely free)
        const exchangeResponse = await fetch('https://api.frankfurter.app/latest?from=EUR&to=SAR');
        
        if (exchangeResponse.ok) {
          const exchangeData = await exchangeResponse.json();
          console.log('Frankfurter fallback exchange data:', exchangeData);
          
          if (exchangeData.rates && exchangeData.rates.SAR) {
            eurToSar = exchangeData.rates.SAR;
            console.log('Using Frankfurter fallback rate:', eurToSar);
          }
        } else {
          console.warn('Frankfurter fallback API failed:', exchangeResponse.status, exchangeResponse.statusText);
          throw new Error('Frankfurter fallback API failed');
        }
      } catch (frankfurterError) {
        console.warn('Frankfurter fallback API error:', frankfurterError.message);
        
        try {
          // Final fallback to ExchangeRate-API (free tier)
          const fallbackResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('ExchangeRate-API final fallback data:', fallbackData);
            
            if (fallbackData.rates && fallbackData.rates.SAR) {
              eurToSar = fallbackData.rates.SAR;
              console.log('Using ExchangeRate-API final fallback rate:', eurToSar);
            }
          } else {
            console.warn('All exchange APIs failed, using hardcoded fallback value');
          }
        } catch (finalError) {
          console.warn('All exchange APIs failed, using hardcoded fallback value:', eurToSar);
        }
      }
    }

    // Update the exchange rate in the database using upsert
    const { error: updateError } = await supabase
      .from('exchange_rates')
      .upsert({ 
        base_currency: 'EUR',
        target_currency: 'SAR',
        rate: Number(eurToSar.toFixed(4)), 
        last_updated: new Date().toISOString() 
      }, { 
        onConflict: 'base_currency,target_currency',
        ignoreDuplicates: false 
      });

    if (updateError) {
      console.error('Error updating exchange rate in database:', updateError);
      throw updateError;
    }

    console.log('✅ Exchange rate updated successfully:', eurToSar);

    return new Response(JSON.stringify({
      success: true,
      rate: Number(eurToSar.toFixed(4)),
      updated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error updating exchange rates:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: (error as Error).message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});