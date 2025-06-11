
import { useState } from "react";
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useVendas } from "@/hooks/useVendas";
import VendaModal from "@/components/VendaModal";

const Vendas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { vendas, createVenda, updateVenda, deleteVenda, getVenda } = useVendas();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVenda, setSelectedVenda] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Emitido": return "bg-green-100 text-green-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      case "Cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreate = () => {
    setSelectedVenda(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (id: string) => {
    const venda = getVenda(id);
    setSelectedVenda(venda);
    setModalMode('view');
    setModalOpen(true);
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

  return (
    <Layout>
      <Navigation 
        brand={{ name: "Contabilcert", icon: FileText }}
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Vendas", href: "/vendas" },
          { label: "Certificados", href: "/certificados" },
          { label: "Comissões", href: "/comissoes" },
          { label: "Relatórios", href: "/relatorios" }
        ]}
        actions={[{ label: "Nova Venda", onClick: handleCreate }]}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Vendas</h1>
            <p className="text-slate-600 mt-2">Gerencie todas as vendas de certificados digitais</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
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
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendas.map((venda) => (
                <TableRow key={venda.id}>
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
                  <TableCell>{venda.data}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(venda.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(venda.id)}>
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
                              Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(venda.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <VendaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        venda={selectedVenda}
        mode={modalMode}
      />
    </Layout>
  );
};

export default Vendas;
