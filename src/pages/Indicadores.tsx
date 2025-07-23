
import { useState } from "react";
import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Edit, Trash, User } from "lucide-react";
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
import { useIndicadores } from "@/hooks/useIndicadores";
import IndicadorModal from "@/components/IndicadorModal";

const Indicadores = () => {
  const { toast } = useToast();
  const { indicadores, createIndicador, updateIndicador, deleteIndicador, getIndicador } = useIndicadores();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedIndicador, setSelectedIndicador] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Inativo": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreate = () => {
    setSelectedIndicador(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (id: string) => {
    const indicador = getIndicador(id);
    setSelectedIndicador(indicador);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const indicador = getIndicador(id);
    setSelectedIndicador(indicador);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteIndicador(id);
    toast({
      title: "Indicador excluído",
      description: "O indicador foi excluído com sucesso."
    });
  };

  const handleSave = (indicadorData: any) => {
    if (modalMode === 'create') {
      createIndicador(indicadorData);
      toast({
        title: "Indicador criado",
        description: "O indicador foi criado com sucesso."
      });
    } else if (modalMode === 'edit' && selectedIndicador) {
      updateIndicador(selectedIndicador.id, indicadorData);
      toast({
        title: "Indicador atualizado",
        description: "O indicador foi atualizado com sucesso."
      });
    }
  };

  return (
    <Layout>
      <AppNavigation />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Indicadores</h1>
            <p className="text-slate-600 mt-2">Gerencie todos os indicadores de vendas</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Indicador
          </Button>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Comissão (%)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indicadores.map((indicador) => (
                <TableRow key={indicador.id}>
                  <TableCell className="font-medium">{indicador.id}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {indicador.nome}
                  </TableCell>
                  <TableCell>{indicador.email}</TableCell>
                  <TableCell>{indicador.telefone}</TableCell>
                  <TableCell>{indicador.percentualComissao}%</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(indicador.status)}>
                      {indicador.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{indicador.dataCadastro}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(indicador.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(indicador.id)}>
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
                              Tem certeza que deseja excluir este indicador? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(indicador.id)}>
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

      <IndicadorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        indicador={selectedIndicador}
        mode={modalMode}
      />
    </Layout>
  );
};

export default Indicadores;
