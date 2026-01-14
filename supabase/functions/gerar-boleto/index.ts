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
    const ASAAS_API_TOKEN = Deno.env.get('ASAAS_API_TOKEN');
    
    if (!ASAAS_API_TOKEN) {
      throw new Error('ASAAS_API_TOKEN não configurado');
    }

    const payload = await req.json();

    const response = await fetch('https://n8n.rockethub.com.br/webhook/bcb1-62f6d45cf804/asaas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_token': ASAAS_API_TOKEN
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API externa:', errorText);
      return new Response(
        JSON.stringify({ error: `Erro ao gerar boleto: ${response.status}`, details: errorText }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro na edge function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
