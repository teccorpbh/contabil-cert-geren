
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Venda } from '@/hooks/useVendas';
import { useIndicadores } from '@/hooks/useIndicadores';
import { useVendedores } from '@/hooks/useVendedores';

interface VendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (venda: Omit<Venda, 'id'> | Partial<Venda>) => void;
  venda?: Venda;
  mode: 'create' | 'edit' | 'view';
}

const VendaModal = ({ isOpen, onClose, onSave, venda, mode }: VendaModalProps) => {
  const { indicadores } = useIndicadores();
  const { vendedores } = useVendedores();
  
  const [formData, setFormData] = useState({
    pedidoSegura: '',
    cliente: '',
    valor: '',
    responsavel: '',
    vendedorId: '',
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
        vendedorId: venda.vendedorId || '',
        indicador: venda.indicador,
        indicadorId: venda.indicadorId || '',
        status: venda.status,
        statusPagamento: venda.statusPagamento,
        data: venda.data,
        dataVencimento: venda.dataVencimento || ''
      });
    } else {
      setFormData({
        pedidoSegura: '',
        cliente: '',
        valor: '',
        responsavel: '',
        vendedorId: '',
        indicador: '',
        indicadorId: '',
        status: 'Pendente',
        statusPagamento: 'Pendente',
        data: new Date().toLocaleDateString('pt-BR'),
        dataVencimento: ''
      });
    }
  }, [venda]);

  const handleSave = () => {
    const selectedIndicador = indicadores.find(ind => ind.id === formData.indicadorId);
    const selectedVendedor = vendedores.find(vend => vend.id === formData.vendedorId);
    const saveData = {
      ...formData,
      indicador: selectedIndicador?.nome || '-',
      indicadorId: formData.indicadorId === 'none' ? '' : formData.indicadorId,
      responsavel: selectedVendedor?.nome || formData.responsavel,
      vendedorId: formData.vendedorId === 'none' ? '' : formData.vendedorId
    };
    onSave(saveData);
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
              placeholder="R$ 0,00"
            />
          </div>

          <div>
            <Label>Responsável</Label>
            <Select 
              value={formData.vendedorId || 'none'} 
              onValueChange={(value) => setFormData({...formData, vendedorId: value})} 
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem vendedor</SelectItem>
                {vendedores
                  .filter(vend => vend.status === 'Ativo')
                  .map((vendedor) => (
                    <SelectItem key={vendedor.id} value={vendedor.id}>
                      {vendedor.nome}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Indicador</Label>
            <Select 
              value={formData.indicadorId || 'none'} 
              onValueChange={(value) => setFormData({...formData, indicadorId: value})} 
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um indicador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem indicador</SelectItem>
                {indicadores
                  .filter(ind => ind.status === 'Ativo')
                  .map((indicador) => (
                    <SelectItem key={indicador.id} value={indicador.id}>
                      {indicador.nome}
                    </SelectItem>
                  ))
                }
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
