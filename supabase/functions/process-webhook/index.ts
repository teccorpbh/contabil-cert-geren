import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PedidoData {
  orderId: string;
  productDetails: any;
  clientProfile: {
    type?: string;
    name?: string;
    surname?: string;
    socialReason?: string;
    tradeName?: string;
    cpf?: string;
    cnpj?: string;
    email?: string;
    phoneOne?: string;
    cep?: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    municipalRegistration?: string;
    stateRegistration?: string;
  };
  paymentHistory: any[];
  supportObservations: string;
  documents: any[];
  debugInfo: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing webhook request...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the request body
    const requestData = await req.json();
    console.log('Request data received:', JSON.stringify(requestData, null, 2));

    // Extract authorization header to get user context
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Extract id_pedido from request
    const { id_pedido } = requestData;
    if (!id_pedido) {
      throw new Error('id_pedido is required');
    }

    console.log('Fetching order data from n8n webhook...');
    
    // Call n8n webhook to get order data
    const webhookUrl = "https://n8n.rockethub.com.br/webhook/b8d8-0cd103ef0fb1/segura";
    
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_token': 'Z6tDbRPCXdljVLCLsaGh0yiVbwEYCiNT',
      },
      body: JSON.stringify({
        id_pedido: id_pedido
      })
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook error: ${n8nResponse.status}`);
    }

    const n8nData = await n8nResponse.json();
    console.log('n8n response:', JSON.stringify(n8nData, null, 2));

    if (!n8nData.success) {
      throw new Error('Order not found in n8n system');
    }

    // Extract client profile from n8n data
    const clientProfile = n8nData.data?.clientProfile;
    if (!clientProfile) {
      throw new Error('Client profile not found in order data');
    }
    
    // Check if client already exists by CPF/CNPJ
    const cpfCnpj = clientProfile.cpf || clientProfile.cnpj;
    if (!cpfCnpj) {
      throw new Error('CPF or CNPJ is required');
    }

    // Check if client already exists by CPF/CNPJ (read-only check)
    const { data: existingClient } = await supabase
      .from('clientes')
      .select('*')
      .eq('cpf_cnpj', cpfCnpj)
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('Client check:', existingClient ? 'exists' : 'does not exist');

    // Check if there's scheduling information in the status
    const orderStatus = n8nData.data?.orderDetails?.status;
    let agendamentoDetectado = false;
    let dataAgendamento = null;
    
    if (orderStatus && orderStatus.includes('Agendado')) {
      console.log('Scheduling detected in status:', orderStatus);
      
      // Parse scheduling date from status string like "Agendado Dia 18/08/2025 14:00"
      const dateMatch = orderStatus.match(/Agendado Dia (\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2})/);
      
      if (dateMatch) {
        const [, dateStr, timeStr] = dateMatch;
        const [day, month, year] = dateStr.split('/');
        const [hour, minute] = timeStr.split(':');
        
        // Create Date object in local timezone
        const agendamentoDate = new Date(
          parseInt(year),
          parseInt(month) - 1, // JavaScript months are 0-indexed
          parseInt(day),
          parseInt(hour),
          parseInt(minute)
        );
        
        agendamentoDetectado = true;
        dataAgendamento = agendamentoDate.toISOString();
        console.log('Parsed agendamento date:', agendamentoDate);
      }
    }

    // Return the processed data without creating any records
    const response = {
      success: true,
      clienteExiste: !!existingClient,
      clienteExistenteId: existingClient?.id || null,
      agendamentoDetectado,
      dataAgendamento,
      ...n8nData, // Include all original n8n data
    };

    console.log('Webhook processed successfully');
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})