import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVendas } from "@/hooks/useVendas";
import { useVendedores } from "@/hooks/useVendedores";
import { useIndicadores } from "@/hooks/useIndicadores";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { parseCurrencyToNumber } from "@/lib/utils";

interface PedidoData {
  success: string;
  timestamp: string;
  clienteId?: string; // ID do cliente criado/encontrado pela edge function
  debug: {
    orderNumber?: string;
    lastPaymentStatus?: string;
    lastPaymentDate?: string;
    documentsOk?: string;
    [key: string]: any;
  };
  data: {
    orderDetails: {
      orderNumber: string;
      status: string;
      clientId: string;
      saleId: string;
      detectedClientCategory: string;
    };
    clientProfile: {
      type: string;
      name?: string;
      surname?: string;
      cnpj?: string;
      cpf?: string;
      socialReason?: string;
      tradeName?: string;
      municipalRegistration?: string;
      stateRegistration?: string;
      phoneOne?: string;
      phoneTwo?: string;
      email?: string;
      cep?: string;
      address?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
    };
    productData: {
      productNameSelected: string;
      productFullNameDisplay: string;
      validity: string;
      clientFinalPrice?: string;
      value: string;
      hasAdditionalValue?: string;
      additionalValue?: string;
      hasInvoice?: string;
    };
    files: Array<{
      documentType: string;
      status: string;
    }>;
    supportObservations?: string;
    paymentHistory: Array<{
      reference?: string;
      action: string;
      transactionId?: string;
      errorId?: string;
      message: string;
      date: string;
    }>;
  };
}

const NovaVenda = () => {
  const [pedidoSegura, setPedidoSegura] = useState("");
  const [valorVenda, setValorVenda] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [indicador, setIndicador] = useState("");
  const [pedidoData, setPedidoData] = useState<PedidoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [dataVenda, setDataVenda] = useState("");
  const [dataCertificado, setDataCertificado] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vendedores, loading: vendedoresLoading } = useVendedores();
  const { indicadores, loading: indicadoresLoading } = useIndicadores();
  const { createVenda } = useVendas();

  // Extrair data mais recente do paymentHistory quando pedidoData for carregado
  useEffect(() => {
    if (pedidoData?.data?.paymentHistory && pedidoData.data.paymentHistory.length > 0) {
      try {
        // Ordenar por data mais recente (formato: yyyy-MM-dd HH:mm:ss)
        const sortedHistory = [...pedidoData.data.paymentHistory].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        
        // Pegar data mais recente (já está no formato yyyy-MM-dd HH:mm:ss)
        const mostRecentDate = sortedHistory[0].date;
        // Extrair apenas a parte da data (yyyy-MM-dd)
        const datePart = mostRecentDate.split(' ')[0];
        
        // Preencher ambos os campos com a mesma data inicial
        setDataVenda(datePart);
        setDataCertificado(datePart);
        return;
      } catch (error) {
        console.error('Erro ao processar data do paymentHistory:', error);
      }
    }
    
    // Se não houver histórico ou houver erro, usar data atual
    const today = new Date().toISOString().split('T')[0];
    setDataVenda(today);
    setDataCertificado(today);
  }, [pedidoData]);

  const handleBuscarPedido = async () => {
    if (!pedidoSegura.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o número do pedido",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Limpar o pedido antes de enviar (remover espaços)
      const pedidoLimpo = pedidoSegura.trim();
      
      // Chamar a edge function process-webhook
      const { data, error } = await supabase.functions.invoke('process-webhook', {
        body: {
          id_pedido: pedidoLimpo,
          user_id: user.id
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        toast({
          title: "Pedido não encontrado",
          description: "Não foi possível obter os dados do pedido. Verifique o número informado.",
          variant: "destructive"
        });
        return;
      }

      console.log('Dados recebidos do n8n:', JSON.stringify(data, null, 2));
      setPedidoData(data);
      setClienteId(data.clienteExistenteId);
      
      // Armazenar o preço de custo como referência
      const precoCustoValue = data.data?.productData?.value || data.data?.productData?.clientFinalPrice || '';
      if (precoCustoValue) {
        setPrecoCusto(precoCustoValue);
        console.log('Preço de custo definido:', precoCustoValue);
      }

      const clienteMsg = data.clienteExiste 
        ? "Cliente já cadastrado encontrado." 
        : "Cliente será criado ao salvar a venda.";
      
      toast({
        title: "Sucesso",
        description: `Dados do pedido carregados com sucesso! ${clienteMsg}`,
      });

    } catch (error: any) {
      console.error('Erro ao buscar pedido:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao sistema. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarVenda = async () => {
    if (!pedidoSegura.trim() || !valorVenda.trim() || !responsavel.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // PASSO 1: Criar/Buscar Cliente
      let finalClienteId = clienteId;
      const clientProfile = pedidoData?.data?.clientProfile;
      
      if (!finalClienteId && clientProfile) {
        // Cliente não existe, criar agora
        const cpfCnpj = clientProfile.cpf || clientProfile.cnpj;
        
        // Determinar nome do cliente baseado no tipo
        let nomeCliente: string;
        if (clientProfile.type === 'PF' || clientProfile.cpf) {
          nomeCliente = `${clientProfile.name?.trim() || ''} ${clientProfile.surname?.trim() || ''}`.trim() 
                        || 'Cliente Não Identificado';
        } else {
          nomeCliente = clientProfile.socialReason || clientProfile.tradeName || 'Cliente Não Identificado';
        }
        
        const { data: clienteCriado, error: clienteError } = await supabase
          .from('clientes')
          .insert([{
            nome_razao_social: nomeCliente,
            cpf_cnpj: cpfCnpj,
            tipo_pessoa: clientProfile.cpf ? 'PF' as const : 'PJ' as const,
            email: clientProfile.email,
            telefone: clientProfile.phoneOne,
            cep: clientProfile.cep,
            endereco: clientProfile.address,
            numero: clientProfile.number,
            complemento: clientProfile.complement,
            bairro: clientProfile.neighborhood,
            cidade: clientProfile.city,
            estado: clientProfile.state,
            inscricao_municipal: clientProfile.municipalRegistration,
            inscricao_estadual: clientProfile.stateRegistration,
            status: 'Ativo' as const,
            user_id: user.id
          }])
          .select()
          .single();
        
        if (clienteError) throw new Error('Falha ao criar cliente');
        finalClienteId = clienteCriado!.id;
      }

      // PASSO 2: Criar Venda
      const orderStatus = pedidoData?.data?.orderDetails?.status;
      const vendaStatus = orderStatus === 'Concluído' ? 'Emitido' : 'Pendente';
      
      const vendedorSelecionado = vendedores.find(v => v.id === responsavel);
      
      // Determinar nome do cliente de forma robusta
      const nomeCliente = (() => {
        const cp = clientProfile;
        if (!cp) return 'Cliente não identificado';
        
        // PJ - tentar razão social ou nome fantasia
        if (cp.cnpj || cp.type === 'PJ') {
          const pjName = cp.socialReason || cp.tradeName;
          if (pjName && pjName.trim()) return pjName.trim();
        }
        
        // PF ou fallback - tentar nome + sobrenome
        const fullName = `${cp.name?.trim() || ''} ${cp.surname?.trim() || ''}`.trim();
        if (fullName) return fullName;
        
        // Último fallback - razão social/nome fantasia mesmo que seja PF
        return cp.socialReason?.trim() || cp.tradeName?.trim() || 'Cliente não identificado';
      })();

      const custoNumerico = parseCurrencyToNumber(precoCusto);
      const valorNumerico = parseCurrencyToNumber(valorVenda);
      
      if (valorNumerico <= 0) {
        toast({
          title: "Erro",
          description: "Valor da venda inválido",
          variant: "destructive"
        });
        return;
      }
      
      const { data: vendaCriada, error: vendaError } = await supabase
        .from('vendas')
        .insert([{
          pedido_segura: pedidoSegura,
          cliente: nomeCliente,
          cliente_id: finalClienteId,
          valor: valorNumerico,
          custo: custoNumerico,
          responsavel: vendedorSelecionado?.nome || responsavel,
          vendedor_id: responsavel,
          indicador_id: indicador && indicador !== "none" ? indicador : null,
          status: vendaStatus,
          status_pagamento: 'Pendente',
          data: `${dataVenda}T12:00:00Z`,
          user_id: user.id,
        }])
        .select()
        .single();

      if (vendaError) throw new Error('Falha ao criar venda');

      // PASSO 3: Criar Agendamento (se houver)
      if (orderStatus && orderStatus.includes('Agendado')) {
        const dateMatch = orderStatus.match(/Agendado Dia (\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2})/);
        
        if (dateMatch) {
          const [, dateStr, timeStr] = dateMatch;
          const [day, month, year] = dateStr.split('/');
          const [hour, minute] = timeStr.split(':');
          
          const agendamentoDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute)
          );
          
          await supabase.from('agendamentos').insert([{
            venda_id: vendaCriada.id,
            pedido_segura: pedidoSegura,
            cliente_id: finalClienteId,
            data_agendamento: agendamentoDate.toISOString(),
            status: 'Agendado',
            user_id: user.id
          }]);
        }
      }

        // PASSO 4: Criar Certificado (se status = "Concluído")
        if (orderStatus === 'Concluído') {
          const productName = pedidoData?.data?.productData?.productNameSelected || '';
          const tipoCertificado = productName.match(/A[13]/i)?.[0]?.toUpperCase() || 'A1';
          
          const validity = pedidoData?.data?.productData?.validity || '1 ano';
          const anos = parseInt(validity) || 1;
          
          // Usar dataCertificado do formulário ao invés de new Date()
          const baseDate = dataCertificado ? new Date(dataCertificado + 'T00:00:00') : new Date();
          const validade = new Date(baseDate);
          validade.setFullYear(validade.getFullYear() + anos);
          
          // Extrair preço de custo do productData
          const precoCustoValue = parseCurrencyToNumber(pedidoData?.data?.productData?.value);
          
          await supabase.from('certificados').insert([{
            tipo: tipoCertificado,
            documento: pedidoSegura,
            cliente: nomeCliente,
            validade: validade.toISOString().split('T')[0],
            status: 'Emitido',
            venda_id: vendaCriada.id,
            preco_custo: precoCustoValue,
            user_id: user.id
          }]);
        }

      toast({
        title: "Sucesso",
        description: "Venda registrada com sucesso!",
      });

      navigate('/vendas');

    } catch (error: any) {
      console.error('Erro ao salvar venda:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a venda. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Carregando dados...</p>
          </div>
        </div>
      )}
      <AppNavigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Nova Venda</h1>
            <p className="text-slate-600 mt-2">Registre uma nova venda de certificado digital</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Pedido Segura Online */}
              <div className="space-y-2">
                <Label htmlFor="pedido">Número do Pedido (Segura Online)</Label>
                <div className="flex gap-2">
                  <Input
                    id="pedido"
                    placeholder="Ex: SG123456"
                    value={pedidoSegura}
                    onChange={(e) => setPedidoSegura(e.target.value)}
                  />
                  <Button onClick={handleBuscarPedido} variant="outline" disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                <p className="text-sm text-slate-500">
                  Insira o número do pedido para buscar automaticamente os dados na Segura Online
                </p>
              </div>

              {/* Preço de Custo */}
              <div className="space-y-2">
                <Label htmlFor="custo">Preço de Custo</Label>
                <Input
                  id="custo"
                  placeholder="R$ 0,00"
                  value={precoCusto}
                  onChange={(e) => setPrecoCusto(e.target.value)}
                />
                <p className="text-sm text-slate-500">
                  Valor pago pela empresa ao fornecedor. Usado para calcular as comissões.
                </p>
              </div>

              {/* Valor da Venda */}
              <div className="space-y-2">
                <Label htmlFor="valor">Valor da Venda</Label>
                <Input
                  id="valor"
                  placeholder="R$ 0,00"
                  value={valorVenda}
                  onChange={(e) => setValorVenda(e.target.value)}
                />
              </div>

              {/* Data da Venda */}
              <div className="space-y-2">
                <Label htmlFor="dataVenda">Data da Venda</Label>
                <Input
                  id="dataVenda"
                  type="date"
                  value={dataVenda}
                  onChange={(e) => setDataVenda(e.target.value)}
                />
                <p className="text-sm text-slate-500">
                  Data em que a venda foi realizada (preenchida automaticamente com a data do último pagamento)
                </p>
              </div>

              {/* Data do Certificado */}
              <div className="space-y-2">
                <Label htmlFor="dataCertificado">Data do Certificado</Label>
                <Input
                  id="dataCertificado"
                  type="date"
                  value={dataCertificado}
                  onChange={(e) => setDataCertificado(e.target.value)}
                />
                <p className="text-sm text-slate-500">
                  Data base para cálculo da validade do certificado (preenchida automaticamente com a data do último pagamento)
                </p>
              </div>

              {/* Responsável pela Venda */}
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável pela Venda</Label>
                <Select value={responsavel} onValueChange={setResponsavel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendedoresLoading ? (
                      <SelectItem value="loading" disabled>Carregando vendedores...</SelectItem>
                    ) : vendedores.length > 0 ? (
                      vendedores.map((vendedor) => (
                        <SelectItem key={vendedor.id} value={vendedor.id}>
                          {vendedor.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>Nenhum vendedor cadastrado</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Indicador */}
              <div className="space-y-2">
                <Label htmlFor="indicador">Indicador (Opcional)</Label>
                <Select value={indicador} onValueChange={setIndicador}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o indicador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum indicador</SelectItem>
                    {indicadoresLoading ? (
                      <SelectItem value="loading" disabled>Carregando indicadores...</SelectItem>
                    ) : indicadores.length > 0 ? (
                      indicadores.map((indicador) => (
                        <SelectItem key={indicador.id} value={indicador.id}>
                          {indicador.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>Nenhum indicador cadastrado</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Dados do Certificado (preenchidos automaticamente) */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Dados do Certificado {pedidoData ? "(Carregados automaticamente)" : "(Preenchido automaticamente)"}
                </h3>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>Tipo de Certificado</Label>
                     <Input 
                       value={pedidoData?.data?.productData?.productNameSelected || ""} 
                       placeholder="A1 - Pessoa Física" 
                       disabled 
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>CPF/CNPJ</Label>
                     <Input 
                       value={pedidoData?.data?.clientProfile?.cpf || pedidoData?.data?.clientProfile?.cnpj || ""} 
                       placeholder="000.000.000-00" 
                       disabled 
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Validade</Label>
                     <Input 
                       value={pedidoData?.data?.productData?.validity || ""} 
                       placeholder="1 ano" 
                       disabled 
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Status</Label>
                     <Input 
                       value={pedidoData?.data?.orderDetails?.status || ""} 
                       placeholder="Pendente" 
                       disabled 
                     />
                   </div>
                 </div>
               </div>

               {/* Informações do Cliente (quando dados são carregados) */}
               {pedidoData && (
                 <div className="border-t pt-6">
                   <h3 className="text-lg font-semibold text-slate-900 mb-4">
                     Informações do Cliente
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cliente</Label>
                        <Input 
                          value={(() => {
                            const cp = pedidoData.data?.clientProfile;
                            if (!cp) return 'Cliente não identificado';
                            
                            // PJ - tentar razão social ou nome fantasia
                            if (cp.cnpj || cp.type === 'PJ') {
                              const pjName = cp.socialReason || cp.tradeName;
                              if (pjName && pjName.trim()) return pjName.trim();
                            }
                            
                            // PF ou fallback - tentar nome + sobrenome
                            const fullName = `${cp.name?.trim() || ''} ${cp.surname?.trim() || ''}`.trim();
                            if (fullName) return fullName;
                            
                            // Último fallback - razão social/nome fantasia mesmo que seja PF
                            return cp.socialReason?.trim() || cp.tradeName?.trim() || 'Cliente não identificado';
                          })()}
                          disabled 
                          className="bg-muted"
                        />
                      </div>
                     <div className="space-y-2">
                       <Label>Status do Pagamento</Label>
                       <Input
                         value={pedidoData.debug?.lastPaymentStatus || ""} 
                         disabled 
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Produto</Label>
                       <Input 
                         value={pedidoData.data?.productData?.productFullNameDisplay || ""} 
                         disabled 
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Número do Pedido</Label>
                       <Input 
                         value={pedidoData.data?.orderDetails?.orderNumber || ""} 
                         disabled 
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Email</Label>
                       <Input 
                         value={pedidoData.data?.clientProfile?.email || ""} 
                         disabled 
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Telefone</Label>
                       <Input 
                         value={pedidoData.data?.clientProfile?.phoneOne || ""} 
                         disabled 
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Endereço</Label>
                       <Input 
                         value={`${pedidoData.data?.clientProfile?.address || ""} ${pedidoData.data?.clientProfile?.number || ""}`} 
                         disabled 
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Cidade/Estado</Label>
                       <Input 
                         value={`${pedidoData.data?.clientProfile?.city || ""} - ${pedidoData.data?.clientProfile?.state || ""}`} 
                         disabled 
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>CEP</Label>
                       <Input 
                         value={pedidoData.data?.clientProfile?.cep || ""} 
                         disabled 
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Categoria do Cliente</Label>
                       <Input 
                         value={pedidoData.data?.orderDetails?.detectedClientCategory || ""} 
                         disabled 
                       />
                     </div>
                   </div>

                   {/* Documentos */}
                   {pedidoData.data?.files && pedidoData.data.files.length > 0 && (
                     <div className="mt-6">
                       <Label className="text-sm font-medium">Documentos Enviados</Label>
                       <div className="mt-2 space-y-2">
                         {pedidoData.data.files.map((doc, index) => (
                           <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                             <span className="text-sm">{doc.documentType}</span>
                             <span className={`text-xs px-2 py-1 rounded-full ${
                               doc.status.toLowerCase() === 'aprovado' ? 'bg-green-100 text-green-800' :
                               doc.status.toLowerCase() === 'rejeitado' ? 'bg-red-100 text-red-800' :
                               'bg-yellow-100 text-yellow-800'
                             }`}>
                               {doc.status}
                             </span>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Histórico de Pagamento */}
                   {pedidoData.data?.paymentHistory && pedidoData.data.paymentHistory.length > 0 && (
                     <div className="mt-6">
                       <Label className="text-sm font-medium">Histórico de Pagamento</Label>
                       <div className="mt-2 space-y-2">
                         {pedidoData.data.paymentHistory.map((hist, index) => (
                           <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                             <div>
                               <span className="text-sm font-medium">{hist.action}</span>
                               <span className="text-xs text-slate-500 ml-2">{hist.date}</span>
                               {hist.message && (
                                 <div className="text-xs text-slate-600 mt-1">{hist.message}</div>
                               )}
                             </div>
                             {hist.transactionId && (
                               <span className="text-xs text-slate-500">
                                 ID: {hist.transactionId}
                               </span>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Observações */}
                   {pedidoData.data?.supportObservations && (
                     <div className="mt-6">
                       <Label className="text-sm font-medium">Observações de Suporte</Label>
                       <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                         <p className="text-sm text-slate-700">{pedidoData.data.supportObservations}</p>
                       </div>
                     </div>
                   )}

                   {/* Informações Adicionais do Produto */}
                   {pedidoData.data?.productData && (
                     <div className="mt-6">
                       <Label className="text-sm font-medium">Detalhes do Produto</Label>
                       <div className="mt-2 grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label className="text-xs text-slate-500">Valor do Cliente</Label>
                           <Input 
                             value={pedidoData.data.productData.value || ""} 
                             disabled 
                           />
                         </div>
                         <div className="space-y-2">
                           <Label className="text-xs text-slate-500">Valor Adicional</Label>
                           <Input 
                             value={pedidoData.data.productData.hasAdditionalValue === "Sim" ? `R$ ${pedidoData.data.productData.additionalValue}` : "Não"} 
                             disabled 
                           />
                         </div>
                         <div className="space-y-2">
                           <Label className="text-xs text-slate-500">Possui Nota Fiscal</Label>
                           <Input 
                             value={pedidoData.data.productData.hasInvoice || "Não"} 
                             disabled 
                           />
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               )}

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={handleSalvarVenda} 
                  className="flex-1"
                  disabled={loading || !pedidoSegura.trim() || !valorVenda.trim() || !responsavel.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar Venda"}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/vendas')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NovaVenda;
