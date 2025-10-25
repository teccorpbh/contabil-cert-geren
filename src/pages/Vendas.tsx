import { useState } from "react";
import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Edit, Trash, Receipt, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useVendas } from "@/hooks/useVendas";
import { useClientes } from "@/hooks/useClientes";
import VendaModal from "@/components/VendaModal";
import { addDays, format } from "date-fns";
const Vendas = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    vendas,
    createVenda,
    updateVenda,
    deleteVenda,
    getVenda
  } = useVendas();
  const {
    clientes
  } = useClientes();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVenda, setSelectedVenda] = useState<any>(null);
  const [loadingBoleto, setLoadingBoleto] = useState<string | null>(null);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Emitido":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getPagamentoStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const handleCreate = () => {
    setSelectedVenda(null);
    setModalMode('create');
    setModalOpen(true);
  };
  const handleView = (id: string) => {
    navigate(`/vendas/${id}`);
  };
  const handleEdit = (id: string) => {
    const venda = getVenda(id);
    setSelectedVenda(venda);
    setModalMode('edit');
    setModalOpen(true);
  };
  const handleDelete = (id: string) => {
    deleteVenda(id);
    toast({
      title: "Venda excluída",
      description: "A venda foi excluída com sucesso."
    });
  };
  const handleSave = (vendaData: any) => {
    if (modalMode === 'create') {
      createVenda(vendaData);
      toast({
        title: "Venda criada",
        description: "A venda foi criada com sucesso."
      });
    } else if (modalMode === 'edit' && selectedVenda) {
      updateVenda(selectedVenda.id, vendaData);
      toast({
        title: "Venda atualizada",
        description: "A venda foi atualizada com sucesso."
      });
    }
  };
  const handleGerarBoleto = async (vendaId: string) => {
    setLoadingBoleto(vendaId);
    try {
      const venda = getVenda(vendaId);
      if (!venda) {
        throw new Error('Venda não encontrada');
      }
      if (!venda.clienteId) {
        throw new Error('Venda não possui cliente associado');
      }
      const cliente = clientes.find(c => c.id === venda.clienteId);
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }

      // Validar campos obrigatórios do cliente
      if (!cliente.cpf_cnpj || !cliente.email || !cliente.endereco || !cliente.numero || !cliente.cidade || !cliente.estado || !cliente.cep) {
        throw new Error('Cliente possui dados incompletos. Verifique se todos os campos obrigatórios estão preenchidos (CPF/CNPJ, Email, Endereço Completo).');
      }

      // Calcular data de vencimento: hoje + 2 dias
      const dataVencimento = format(addDays(new Date(), 2), 'dd/MM/yyyy');

      const payload = {
        venda: {
          id: venda.id,
          pedido_segura: venda.pedidoSegura,
          valor: parseFloat(venda.valor.replace('R$', '').replace('.', '').replace(',', '.')),
          status: venda.status,
          status_pagamento: venda.statusPagamento,
          data: venda.data,
          data_vencimento: dataVencimento,
          responsavel: venda.responsavel,
          indicador: venda.indicador
        },
        cliente: {
          id: cliente.id,
          nome_razao_social: cliente.nome_razao_social,
          cpf_cnpj: cliente.cpf_cnpj,
          tipo_pessoa: cliente.tipo_pessoa,
          email: cliente.email,
          telefone: cliente.telefone,
          endereco: cliente.endereco,
          numero: cliente.numero,
          complemento: cliente.complemento,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          estado: cliente.estado,
          cep: cliente.cep
        }
      };
      const response = await fetch('https://n8n.rockethub.com.br/webhook/bcb1-62f6d45cf804/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_token': 'Z6tDbRPCXdljVLCLsaGh0yiVbwEYCiNT'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API:', errorText);
        throw new Error(`Erro ao gerar boleto: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Resposta completa da API:', responseData);

      // A API retorna um objeto (não array) com status e return
      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Resposta da API inválida ou vazia');
      }

      const apiResponse = responseData; // Acessa diretamente, não usa [0]

      // Verificar se o status é success
      if (!apiResponse || apiResponse.status !== 'success') {
        console.error('API retornou erro:', apiResponse);
        throw new Error('API retornou erro ou status inválido');
      }

      // Os dados do payment estão dentro de 'return'
      const paymentData = apiResponse.return;

      // Validar campos obrigatórios do retorno
      if (!paymentData || !paymentData.id || !paymentData.bankSlipUrl || !paymentData.invoiceUrl) {
        console.error('Dados incompletos no retorno:', paymentData);
        throw new Error('API retornou dados incompletos');
      }

      // Salvar URLs do boleto na venda
      await updateVenda(vendaId, {
        boletoUrl: paymentData.bankSlipUrl,
        invoiceUrl: paymentData.invoiceUrl,
        asaasPaymentId: paymentData.id,
        nossoNumero: paymentData.nossoNumero
      });

      toast({
        title: "Boleto gerado com sucesso!",
        description: `Boleto para a venda ${venda.pedidoSegura} foi gerado. Nosso Número: ${paymentData.nossoNumero}`,
        duration: 5000,
      });

      // Abrir o boleto em nova aba automaticamente
      if (paymentData.bankSlipUrl) {
        window.open(paymentData.bankSlipUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error: any) {
      console.error('Erro ao gerar boleto:', error);

      let errorMessage = error.message;

      // Traduzir erros comuns
      if (error.message.includes('403')) {
        errorMessage = 'Erro de autenticação com o serviço de boletos. Entre em contato com o suporte.';
      } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Tempo de resposta excedido. Tente novamente em alguns instantes.';
      }

      toast({
        title: "Erro ao gerar boleto",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setLoadingBoleto(null);
    }
  };
  return <Layout>
      <AppNavigation />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Vendas</h1>
            <p className="text-slate-600 mt-2">Gerencie todas as vendas de certificados digitais</p>
          </div>
          
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pedido Segura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Indicador</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendas.map(venda => <TableRow key={venda.id}>
                  <TableCell className="font-medium">{venda.id}</TableCell>
                  <TableCell>{venda.pedidoSegura}</TableCell>
                  <TableCell>{venda.cliente}</TableCell>
                  <TableCell>{venda.valor}</TableCell>
                  <TableCell>{venda.responsavel}</TableCell>
                  <TableCell>{venda.indicador}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(venda.status)}>
                      {venda.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPagamentoStatusColor(venda.statusPagamento)}>
                      {venda.statusPagamento}
                    </Badge>
                  </TableCell>
                  <TableCell>{venda.data}</TableCell>
                   <TableCell aria-label={`Ações da venda ${venda.pedidoSegura}`}>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(venda.id)} aria-label={`Visualizar venda ${venda.pedidoSegura}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(venda.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {venda.boletoUrl && <Button size="sm" variant="outline" onClick={() => window.open(venda.boletoUrl, '_blank', 'noopener,noreferrer')} aria-label={`Abrir boleto da venda ${venda.pedidoSegura}`} title="Ver Boleto">
                          <Receipt className="h-4 w-4 text-green-600" />
                        </Button>}
                      {venda.invoiceUrl && <Button size="sm" variant="outline" onClick={() => window.open(venda.invoiceUrl, '_blank', 'noopener,noreferrer')} aria-label={`Abrir fatura da venda ${venda.pedidoSegura}`} title="Ver Fatura">
                          <FileCheck className="h-4 w-4 text-blue-600" />
                        </Button>}
                      <Button size="sm" variant="secondary" onClick={() => handleGerarBoleto(venda.id)} disabled={!venda.clienteId || loadingBoleto === venda.id} aria-label={venda.boletoUrl ? `Regerar boleto para venda ${venda.pedidoSegura}` : `Gerar boleto para venda ${venda.pedidoSegura}`} title={venda.boletoUrl ? "Regerar Boleto" : "Gerar Boleto"}>
                        {loadingBoleto === venda.id ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <FileText className="h-4 w-4" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" aria-label={`Excluir venda ${venda.pedidoSegura}`}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta venda? Todas as comissões associadas a esta venda também serão excluídas. Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(venda.id)} aria-label="Confirmar exclusão">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </Card>
      </div>

      <VendaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} venda={selectedVenda} mode={modalMode} />
    </Layout>;
};
export default Vendas;