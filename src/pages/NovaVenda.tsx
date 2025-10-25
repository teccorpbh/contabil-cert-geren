import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVendas } from "@/hooks/useVendas";
import { useVendedores } from "@/hooks/useVendedores";
import { useIndicadores } from "@/hooks/useIndicadores";
import { useClientes } from "@/hooks/useClientes";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vendedores, loading: vendedoresLoading } = useVendedores();
  const { indicadores, loading: indicadoresLoading } = useIndicadores();
  const { createVenda } = useVendas();
  const { findClienteByCpfCnpj } = useClientes();

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
      // Chamar a edge function process-webhook
      const { data, error } = await supabase.functions.invoke('process-webhook', {
        body: {
          id_pedido: pedidoSegura,
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

      setPedidoData(data);
      setClienteId(data.clienteId);
      
      // Armazenar o preço de custo como referência (não preencher o valor de venda)
      if (data.data?.productData?.value) {
        setPrecoCusto(data.data.productData.value);
      }

      toast({
        title: "Sucesso",
        description: "Dados do pedido carregados com sucesso! Cliente criado/atualizado.",
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
      // Encontrar o vendedor selecionado
      const vendedorSelecionado = vendedores.find(v => v.id === responsavel);
      
      // Encontrar o indicador selecionado (se houver)
      const indicadorSelecionado = indicador ? indicadores.find(i => i.id === indicador) : null;

      // Nome do cliente (da busca ou manual)
      const nomeCliente = pedidoData?.data?.clientProfile?.type === 'PF' || pedidoData?.data?.clientProfile?.cpf
        ? `${pedidoData?.data?.clientProfile?.name?.trim() || ''} ${pedidoData?.data?.clientProfile?.surname?.trim() || ''}`.trim() || 'Cliente não identificado'
        : pedidoData?.data?.clientProfile?.socialReason || 
          pedidoData?.data?.clientProfile?.tradeName || 
          "Cliente não identificado";

      // Preparar dados da venda
      const vendaData = {
        pedidoSegura: pedidoSegura,
        cliente: nomeCliente,
        clienteId: clienteId,
        valor: valorVenda,
        responsavel: vendedorSelecionado?.nome || responsavel,
        vendedorId: responsavel,
        indicador: indicadorSelecionado?.nome || "",
        indicadorId: indicador && indicador !== "none" ? indicador : undefined,
        status: 'Pendente' as const,
        statusPagamento: 'Pendente' as const,
        data: new Date().toISOString()
      };

      await createVenda(vendaData);

      toast({
        title: "Sucesso",
        description: "Venda registrada com sucesso!",
      });

      // Redirecionar para a lista de vendas
      navigate('/vendas');

    } catch (error: any) {
      console.error('Erro ao salvar venda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a venda. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
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

              {/* Preço de Custo (Referência) */}
              {precoCusto && (
                <div className="space-y-2">
                  <Label htmlFor="custo">Preço de Custo (Referência)</Label>
                  <Input
                    id="custo"
                    value={precoCusto}
                    disabled
                    className="bg-slate-50"
                  />
                  <p className="text-sm text-slate-500">
                    Este é o preço de custo. Informe o preço de venda no campo abaixo.
                  </p>
                </div>
              )}

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
                          value={
                            pedidoData.data?.clientProfile?.type === 'PF' || pedidoData.data?.clientProfile?.cpf
                              ? `${pedidoData.data?.clientProfile?.name?.trim() || ''} ${pedidoData.data?.clientProfile?.surname?.trim() || ''}`.trim() || 'Cliente não identificado'
                              : pedidoData.data?.clientProfile?.socialReason || 
                                pedidoData.data?.clientProfile?.tradeName || 
                                'Cliente não identificado'
                          }
                          disabled 
                          className="bg-slate-50"
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
