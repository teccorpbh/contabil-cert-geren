
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Venda } from '@/hooks/useVendas';

interface VendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (venda: Omit<Venda, 'id'> | Partial<Venda>) => void;
  venda?: Venda;
  mode: 'create' | 'edit' | 'view';
}

const VendaModal = ({ isOpen, onClose, onSave, venda, mode }: VendaModalProps) => {
  const [formData, setFormData] = useState({
    pedidoSegura: '',
    cliente: '',
    valor: '',
    responsavel: '',
    indicador: '',
    indicadorId: '',
    status: 'Pendente' as 'Pendente' | 'Emitido' | 'Cancelado',
    statusPagamento: 'Pendente' as 'Pendente' | 'Pago' | 'Vencido',
    data: new Date().toLocaleDateString('pt-BR'),
    dataVencimento: ''
  });

  useEffect(() => {
    if (venda) {
      setFormData({
        pedidoSegura: venda.pedidoSegura,
        cliente: venda.cliente,
        valor: venda.valor,
        responsavel: venda.responsavel,
        indicador: venda.indicador,
        indicadorId: venda.indicadorId || '',
        status: venda.status,
        statusPagamento: venda.statusPagamento,
        data: venda.data,
        dataVencimento: venda.dataVencimento || ''
      });
    }
  }, [venda]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Nova Venda'}
            {mode === 'edit' && 'Editar Venda'}
            {mode === 'view' && 'Visualizar Venda'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Pedido Segura</Label>
            <Input
              value={formData.pedidoSegura}
              onChange={(e) => setFormData({...formData, pedidoSegura: e.target.value})}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Cliente</Label>
            <Input
              value={formData.cliente}
              onChange={(e) => setFormData({...formData, cliente: e.target.value})}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Valor</Label>
            <Input
              value={formData.valor}
              onChange={(e) => setFormData({...formData, valor: e.target.value})}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Responsável</Label>
            <Select value={formData.responsavel} onValueChange={(value) => setFormData({...formData, responsavel: value})} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="João Silva">João Silva</SelectItem>
                <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                <SelectItem value="Carlos Oliveira">Carlos Oliveira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Indicador</Label>
            <Select value={formData.indicador} onValueChange={(value) => setFormData({...formData, indicador: value})} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                <SelectItem value="Pedro Lima">Pedro Lima</SelectItem>
                <SelectItem value="Lucas Ferreira">Lucas Ferreira</SelectItem>
                <SelectItem value="-">Sem indicador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Pendente' | 'Emitido' | 'Cancelado') => setFormData({...formData, status: value})} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Emitido">Emitido</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status de Pagamento</Label>
            <Select value={formData.statusPagamento} onValueChange={(value: 'Pendente' | 'Pago' | 'Vencido') => setFormData({...formData, statusPagamento: value})} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.statusPagamento === 'Pendente' || formData.statusPagamento === 'Vencido') && (
            <div>
              <Label>Data de Vencimento</Label>
              <Input
                type="date"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                disabled={isReadOnly}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {mode === 'view' ? 'Fechar' : 'Cancelar'}
          </Button>
          {mode !== 'view' && (
            <Button onClick={handleSave}>
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VendaModal;
