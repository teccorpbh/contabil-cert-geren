import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useContasAPagar } from "@/hooks/useContasAPagar";
import { ContaPagarModal } from "@/components/ContaPagarModal";
import { Plus, Eye, Trash2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContasAPagar() {
  const { contas, loading, marcarComoPaga, createConta, deleteConta } = useContasAPagar();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedConta, setSelectedConta] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contaToDelete, setContaToDelete] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Contas a Pagar | Gestão Financeira";

    const metaDesc = "Contas a pagar: despesas, vencimentos e pagamentos pendentes.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', metaDesc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-500';
      case 'Pendente': return 'bg-yellow-500';
      case 'Vencido': return 'bg-red-500';
      case 'Cancelado': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Certificado': return 'bg-blue-500';
      case 'Fornecedor': return 'bg-purple-500';
      case 'Despesa Operacional': return 'bg-orange-500';
      case 'Comissao': return 'bg-teal-500';
      case 'Outros': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCreate = () => {
    setSelectedConta(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (conta: any) => {
    setSelectedConta(conta);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setContaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (contaToDelete) {
      await deleteConta(contaToDelete);
      setDeleteDialogOpen(false);
      setContaToDelete(null);
    }
  };

  const handleSave = async (conta: any) => {
    await createConta(conta);
  };

  const handleMarcarComoPaga = async (id: string) => {
    await marcarComoPaga(id);
  };

  const totalPendente = contas
    .filter(c => c.status === 'Pendente' || c.status === 'Vencido')
    .reduce((sum, c) => sum + c.valor, 0);

  const totalPago = contas
    .filter(c => c.status === 'Pago')
    .reduce((sum, c) => sum + c.valor, 0);

  const totalVencido = contas
    .filter(c => c.status === 'Vencido')
    .reduce((sum, c) => sum + c.valor, 0);

  if (loading) {
    return (
      <Layout>
        <AppNavigation />
        <div className="container mx-auto py-8">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AppNavigation />
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Contas a Pagar</h1>
            <p className="text-muted-foreground mt-2">Gerencie suas despesas e contas a pagar</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {contas.filter(c => c.status === 'Pendente').length} contas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vencido</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                R$ {totalVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {contas.filter(c => c.status === 'Vencido').length} contas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {contas.filter(c => c.status === 'Pago').length} contas
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Contas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Venda</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      Nenhuma conta a pagar cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  contas.map((conta) => (
                    <TableRow key={conta.id}>
                      <TableCell className="font-medium">{conta.descricao}</TableCell>
                      <TableCell>{conta.fornecedor}</TableCell>
                      <TableCell>
                        {conta.vendaPedidoSegura ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-primary hover:underline flex items-center gap-1"
                            onClick={() => navigate(`/vendas/${conta.vendaId}`)}
                          >
                            {conta.vendaPedidoSegura}
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getTipoColor(conta.tipo)}>{conta.tipo}</Badge>
                      </TableCell>
                      <TableCell>R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{conta.dataVencimento}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(conta.status)}>{conta.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(conta)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(conta.status === 'Pendente' || conta.status === 'Vencido') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarcarComoPaga(conta.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(conta.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ContaPagarModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        conta={selectedConta}
        mode={modalMode}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conta a pagar? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
