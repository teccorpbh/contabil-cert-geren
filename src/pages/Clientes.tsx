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
import { useClientes, type Cliente } from "@/hooks/useClientes";
import { ClienteModal } from "@/components/ClienteModal";
export default function Clientes() {
  const {
    user
  } = useAuth();
  const {
    clientes,
    loading,
    createCliente,
    updateCliente,
    deleteCliente
  } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const filteredClientes = clientes.filter(cliente => cliente.nome_razao_social.toLowerCase().includes(searchTerm.toLowerCase()) || cliente.cpf_cnpj.includes(searchTerm) || cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "default" : "secondary";
  };
  const getTipoPessoaColor = (tipo: string) => {
    return tipo === "PF" ? "outline" : "default";
  };
  const handleCreate = () => {
    setSelectedCliente(null);
    setModalMode('create');
    setModalOpen(true);
  };
  const handleView = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalMode('view');
    setModalOpen(true);
  };
  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalMode('edit');
    setModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    await deleteCliente(id);
  };
  const handleSave = async (clienteData: any) => {
    if (modalMode === 'create') {
      await createCliente({
        ...clienteData,
        user_id: user?.id || ''
      });
    } else if (modalMode === 'edit' && selectedCliente) {
      await updateCliente(selectedCliente.id, clienteData);
    }
  };
  return <Layout>
      <AppNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie os clientes do sistema
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Buscar por nome, CPF/CNPJ ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                {filteredClientes.length} cliente(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <div className="text-center py-8">Carregando...</div> : <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome/Razão Social</TableHead>
                      <TableHead>CPF/CNPJ</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientes.map(cliente => <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome_razao_social}</TableCell>
                        <TableCell>{cliente.cpf_cnpj}</TableCell>
                        <TableCell>
                          <Badge variant={getTipoPessoaColor(cliente.tipo_pessoa)}>
                            {cliente.tipo_pessoa}
                          </Badge>
                        </TableCell>
                        <TableCell>{cliente.email || '-'}</TableCell>
                        <TableCell>{cliente.telefone || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(cliente.status)}>
                            {cliente.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleView(cliente)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>
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
                                    Tem certeza que deseja excluir o cliente "{cliente.nome_razao_social}"?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(cliente.id)}>
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>)}
                    {filteredClientes.length === 0 && <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum cliente encontrado
                        </TableCell>
                      </TableRow>}
                  </TableBody>
                </Table>}
            </CardContent>
          </Card>
        </div>

        <ClienteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} cliente={selectedCliente} mode={modalMode} />
      </main>
    </Layout>;
}