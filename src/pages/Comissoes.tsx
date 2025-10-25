import { useState } from "react";
import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Edit, Trash, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useComissoes } from "@/hooks/useComissoes";
import ComissaoModal from "@/components/ComissaoModal";
const Comissoes = () => {
  const {
    toast
  } = useToast();
  const {
    comissoes,
    createComissao,
    updateComissao,
    deleteComissao,
    getComissao
  } = useComissoes();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedComissao, setSelectedComissao] = useState<any>(null);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paga":
        return "bg-green-100 text-green-800";
      case "A Receber":
        return "bg-orange-100 text-orange-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const handleCreate = () => {
    setSelectedComissao(null);
    setModalMode('create');
    setModalOpen(true);
  };
  const handleView = (id: string) => {
    const comissao = getComissao(id);
    setSelectedComissao(comissao);
    setModalMode('view');
    setModalOpen(true);
  };
  const handleEdit = (id: string) => {
    const comissao = getComissao(id);
    setSelectedComissao(comissao);
    setModalMode('edit');
    setModalOpen(true);
  };
  const handleDelete = (id: string) => {
    deleteComissao(id);
    toast({
      title: "Comissão excluída",
      description: "A comissão foi excluída com sucesso."
    });
  };
  const handleSave = (comissaoData: any) => {
    if (modalMode === 'create') {
      createComissao(comissaoData);
      toast({
        title: "Comissão criada",
        description: "A comissão foi criada com sucesso."
      });
    } else if (modalMode === 'edit' && selectedComissao) {
      updateComissao(selectedComissao.id, comissaoData);
      toast({
        title: "Comissão atualizada",
        description: "A comissão foi atualizada com sucesso."
      });
    }
  };
  const totalPendente = comissoes.filter(c => c.status === 'Pendente').reduce((acc, c) => acc + parseFloat(c.valor.replace('R$ ', '').replace(',', '.')), 0);
  const totalAReceber = comissoes.filter(c => c.status === 'A Receber').reduce((acc, c) => acc + parseFloat(c.valor.replace('R$ ', '').replace(',', '.')), 0);
  const totalPago = comissoes.filter(c => c.status === 'Paga').reduce((acc, c) => acc + parseFloat(c.valor.replace('R$ ', '').replace(',', '.')), 0);
  return <Layout>
      <AppNavigation />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Comissões</h1>
            <p className="text-slate-600 mt-2">Gerencie todas as comissões de vendas</p>
          </div>
          
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Total Pendente</h3>
            <p className="text-3xl font-bold text-yellow-600">R$ {totalPendente.toFixed(2)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">A Receber</h3>
            <p className="text-3xl font-bold text-orange-600">R$ {totalAReceber.toFixed(2)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Total Pago</h3>
            <p className="text-3xl font-bold text-green-600">R$ {totalPago.toFixed(2)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Comissões Ativas</h3>
            <p className="text-3xl font-bold text-indigo-600">{comissoes.length}</p>
          </Card>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Venda</TableHead>
                <TableHead>Indicador</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Percentual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comissoes.map(comissao => <TableRow key={comissao.id}>
                  <TableCell className="font-medium">{comissao.id}</TableCell>
                  <TableCell>{comissao.vendaId}</TableCell>
                  <TableCell>{comissao.indicador}</TableCell>
                  <TableCell>{comissao.valor}</TableCell>
                  <TableCell>{comissao.percentual}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(comissao.status)}>
                      {comissao.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{comissao.dataPagamento || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(comissao.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(comissao.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta comissão? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(comissao.id)}>
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

      <ComissaoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} comissao={selectedComissao} mode={modalMode} />
    </Layout>;
};
export default Comissoes;