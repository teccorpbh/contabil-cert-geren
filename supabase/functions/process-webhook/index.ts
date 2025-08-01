import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PedidoData {
  orderId: string;
  productDetails: any;
  clientProfile: {
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

    const pedidoData: PedidoData = requestData;
    
    // Check if client already exists by CPF/CNPJ
    const cpfCnpj = pedidoData.clientProfile.cpf || pedidoData.clientProfile.cnpj;
    if (!cpfCnpj) {
      throw new Error('CPF or CNPJ is required');
    }

    const { data: existingClient } = await supabase
      .from('clientes')
      .select('*')
      .eq('cpf_cnpj', cpfCnpj)
      .eq('user_id', user.id)
      .maybeSingle();

    let clienteId = existingClient?.id;

    // If client doesn't exist, create it
    if (!existingClient) {
      console.log('Creating new client...');
      
      const newClient = {
        nome_razao_social: pedidoData.clientProfile.socialReason || pedidoData.clientProfile.tradeName || 'Cliente Não Identificado',
        cpf_cnpj: cpfCnpj,
        tipo_pessoa: pedidoData.clientProfile.cpf ? 'PF' as const : 'PJ' as const,
        email: pedidoData.clientProfile.email,
        telefone: pedidoData.clientProfile.phoneOne,
        cep: pedidoData.clientProfile.cep,
        endereco: pedidoData.clientProfile.address,
        numero: pedidoData.clientProfile.number,
        complemento: pedidoData.clientProfile.complement,
        bairro: pedidoData.clientProfile.neighborhood,
        cidade: pedidoData.clientProfile.city,
        estado: pedidoData.clientProfile.state,
        inscricao_municipal: pedidoData.clientProfile.municipalRegistration,
        inscricao_estadual: pedidoData.clientProfile.stateRegistration,
        status: 'Ativo' as const,
        user_id: user.id,
      };

      const { data: createdClient, error: createError } = await supabase
        .from('clientes')
        .insert([newClient])
        .select()
        .single();

      if (createError) {
        console.error('Error creating client:', createError);
        throw createError;
      }

      clienteId = createdClient.id;
      console.log('Client created successfully:', clienteId);
    } else {
      console.log('Using existing client:', clienteId);
    }

    // Return the processed data with client information
    const response = {
      success: true,
      clienteId,
      clienteExistente: !!existingClient,
      dadosCompletos: pedidoData,
      dadosCliente: existingClient || {
        nome_razao_social: pedidoData.clientProfile.socialReason || pedidoData.clientProfile.tradeName,
        cpf_cnpj: cpfCnpj,
        tipo_pessoa: pedidoData.clientProfile.cpf ? 'PF' : 'PJ',
        email: pedidoData.clientProfile.email,
        telefone: pedidoData.clientProfile.phoneOne,
      }
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