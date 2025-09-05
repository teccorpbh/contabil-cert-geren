import { useState } from 'react';
import Layout from '@/components/Layout';
import AppNavigation from '@/components/AppNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AgendamentoModal } from '@/components/AgendamentoModal';
import { useAgendamentos, Agendamento } from '@/hooks/useAgendamentos';
import { Calendar, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Agendamentos = () => {
  const { agendamentos, loading, deleteAgendamento, updateAgendamento, createAgendamento } = useAgendamentos();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Realizado': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Reagendado': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Agendado': return <Clock className="h-3 w-3" />;
      case 'Realizado': return <CheckCircle className="h-3 w-3" />;
      case 'Cancelado': return <XCircle className="h-3 w-3" />;
      case 'Reagendado': return <RotateCcw className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleView = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAgendamento(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteAgendamento(id);
  };

  const handleSave = async (agendamento: Omit<Agendamento, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    console.log('handleSave called with:', agendamento);
    console.log('Modal mode:', modalMode);
    console.log('Selected agendamento:', selectedAgendamento);
    
    if (modalMode === 'edit' && selectedAgendamento) {
      console.log('Updating agendamento...');
      await updateAgendamento(selectedAgendamento.id, agendamento);
    } else if (modalMode === 'create') {
      console.log('Creating new agendamento...');
      await createAgendamento(agendamento);
    }
    setModalOpen(false);
  };

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const matchesStatus = statusFilter === 'all' || agendamento.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      agendamento.pedido_segura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agendamento.venda?.cliente || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agendamento.cliente?.nome_razao_social || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <Layout>
        <AppNavigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando agendamentos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AppNavigation />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Agendamentos</h1>
            <p className="text-muted-foreground">Gerencie os agendamentos de certificados digitais</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Agendamentos</CardTitle>
            <CardDescription>
              {filteredAgendamentos.length} agendamento(s) encontrado(s)
            </CardDescription>
            
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar</Label>
                <Input 
                  id="search"
                  placeholder="Buscar por pedido, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-48">
                <Label htmlFor="status-filter">Filtrar por Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Realizado">Realizado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                    <SelectItem value="Reagendado">Reagendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgendamentos.map((agendamento) => (
                  <TableRow key={agendamento.id}>
                    <TableCell>
                      {format(new Date(agendamento.data_agendamento), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {agendamento.pedido_segura}
                    </TableCell>
                    <TableCell>
                      {agendamento.venda?.cliente || agendamento.cliente?.nome_razao_social || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {agendamento.venda?.valor 
                        ? `R$ ${agendamento.venda.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(agendamento.status)}>
                        {getStatusIcon(agendamento.status)}
                        <span className="ml-1">{agendamento.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(agendamento)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(agendamento)}
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
                                Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(agendamento.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                {filteredAgendamentos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum agendamento encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AgendamentoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          agendamento={selectedAgendamento}
          mode={modalMode}
        />
      </div>
    </Layout>
  );
};

export default Agendamentos;