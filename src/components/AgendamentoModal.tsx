import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useVendas } from '@/hooks/useVendas';
import { useClientes } from '@/hooks/useClientes';
import { Agendamento } from '@/hooks/useAgendamentos';
import { Calendar, Clock, User, DollarSign, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agendamento: Omit<Agendamento, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  agendamento: Agendamento | null;
  mode: 'view' | 'edit' | 'create';
}

export const AgendamentoModal = ({ isOpen, onClose, onSave, agendamento, mode }: AgendamentoModalProps) => {
  const { vendas } = useVendas();
  const { clientes } = useClientes();
  
  const [formData, setFormData] = useState({
    venda_id: '',
    pedido_segura: '',
    cliente_id: '',
    data_agendamento: '',
    status: 'Agendado' as 'Agendado' | 'Realizado' | 'Cancelado' | 'Reagendado',
  });

  useEffect(() => {
    if (agendamento) {
      setFormData({
        venda_id: agendamento.venda_id,
        pedido_segura: agendamento.pedido_segura,
        cliente_id: agendamento.cliente_id || '',
        data_agendamento: format(new Date(agendamento.data_agendamento), "yyyy-MM-dd'T'HH:mm"),
        status: agendamento.status,
      });
    } else {
      setFormData({
        venda_id: '',
        pedido_segura: '',
        cliente_id: '',
        data_agendamento: '',
        status: 'Agendado' as 'Agendado' | 'Realizado' | 'Cancelado' | 'Reagendado',
      });
    }
  }, [agendamento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const agendamentoData = {
      ...formData,
      data_agendamento: new Date(formData.data_agendamento).toISOString(),
      cliente_id: formData.cliente_id || null,
    };

    onSave(agendamentoData);
  };

  const selectedVenda = vendas.find(v => v.id === formData.venda_id);
  const selectedCliente = clientes.find(c => c.id === formData.cliente_id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      case 'Realizado': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      case 'Reagendado': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isCreateMode ? 'Novo Agendamento' : isViewMode ? 'Detalhes do Agendamento' : 'Editar Agendamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Badge */}
          {!isCreateMode && (
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Badge className={getStatusColor(formData.status)}>
                {formData.status}
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pedido Segura */}
            <div className="space-y-2">
              <Label htmlFor="pedido_segura" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Pedido Segura
              </Label>
              <Input
                id="pedido_segura"
                value={formData.pedido_segura}
                onChange={(e) => setFormData(prev => ({ ...prev, pedido_segura: e.target.value }))}
                disabled={isViewMode}
                required
              />
            </div>

            {/* Status */}
            {!isViewMode && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Realizado">Realizado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                    <SelectItem value="Reagendado">Reagendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Data e Hora */}
          <div className="space-y-2">
            <Label htmlFor="data_agendamento" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Data e Hora do Agendamento
            </Label>
            <Input
              id="data_agendamento"
              type="datetime-local"
              value={formData.data_agendamento}
              onChange={(e) => setFormData(prev => ({ ...prev, data_agendamento: e.target.value }))}
              disabled={isViewMode}
              required
            />
          </div>

          {/* Venda */}
          <div className="space-y-2">
            <Label htmlFor="venda_id" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Venda Relacionada
            </Label>
            <Select 
              value={formData.venda_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, venda_id: value }))}
              disabled={isViewMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma venda" />
              </SelectTrigger>
              <SelectContent>
                {vendas.map((venda) => (
                  <SelectItem key={venda.id} value={venda.id}>
                    {venda.pedidoSegura} - {venda.cliente} - R$ {Number(venda.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <Label htmlFor="cliente_id" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente (Opcional)
            </Label>
            <Select 
              value={formData.cliente_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
              disabled={isViewMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum cliente selecionado</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome_razao_social} - {cliente.cpf_cnpj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informações da Venda Selecionada */}
          {selectedVenda && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Detalhes da Venda</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Cliente:</Label>
                    <p className="font-medium">{selectedVenda.cliente}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Valor:</Label>
                    <p className="font-medium">R$ {Number(selectedVenda.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Responsável:</Label>
                    <p className="font-medium">{selectedVenda.responsavel}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status:</Label>
                    <p className="font-medium">{selectedVenda.status}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Informações do Cliente Selecionado */}
          {selectedCliente && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Detalhes do Cliente</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Nome/Razão Social:</Label>
                    <p className="font-medium">{selectedCliente.nome_razao_social}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">CPF/CNPJ:</Label>
                    <p className="font-medium">{selectedCliente.cpf_cnpj}</p>
                  </div>
                  {selectedCliente.email && (
                    <div>
                      <Label className="text-muted-foreground">Email:</Label>
                      <p className="font-medium">{selectedCliente.email}</p>
                    </div>
                  )}
                  {selectedCliente.telefone && (
                    <div>
                      <Label className="text-muted-foreground">Telefone:</Label>
                      <p className="font-medium">{selectedCliente.telefone}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? 'Fechar' : 'Cancelar'}
            </Button>
            {!isViewMode && (
              <Button type="submit">
                {isCreateMode ? 'Criar' : 'Salvar'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};