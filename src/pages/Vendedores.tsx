import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { useVendedores, type Vendedor } from "@/hooks/useVendedores";
import { VendedorModal } from "@/components/VendedorModal";

export default function Vendedores() {
  const { user } = useAuth();
  const { vendedores, loading, createVendedor, updateVendedor, deleteVendedor } = useVendedores();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVendedor, setSelectedVendedor] = useState<Vendedor | null>(null);

  const filteredVendedores = vendedores.filter(vendedor =>
    vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendedor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "default" : "secondary";
  };

  const handleCreate = () => {
    setSelectedVendedor(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (vendedor: Vendedor) => {
    setSelectedVendedor(vendedor);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (vendedor: Vendedor) => {
    setSelectedVendedor(vendedor);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteVendedor(id);
  };

  const handleSave = async (vendedorData: any) => {
    if (modalMode === 'create') {
      await createVendedor({
        ...vendedorData,
        user_id: user?.id || '',
      });
    } else if (modalMode === 'edit' && selectedVendedor) {
      await updateVendedor(selectedVendedor.id, vendedorData);
    }
  };

  return (
    <Layout>
      <AppNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendedores</h1>
            <p className="text-muted-foreground">
              Gerencie os vendedores do sistema
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar vendedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Vendedor
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Vendedores</CardTitle>
              <CardDescription>
                {filteredVendedores.length} vendedor(es) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendedores.map((vendedor) => (
                      <TableRow key={vendedor.id}>
                        <TableCell className="font-medium">{vendedor.nome}</TableCell>
                        <TableCell>{vendedor.email}</TableCell>
                        <TableCell>{vendedor.telefone || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(vendedor.status)}>
                            {vendedor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(vendedor.data_cadastro).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(vendedor)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(vendedor)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o vendedor "{vendedor.nome}"?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(vendedor.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredVendedores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum vendedor encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <VendedorModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          vendedor={selectedVendedor}
          mode={modalMode}
        />
      </main>
    </Layout>
  );
}