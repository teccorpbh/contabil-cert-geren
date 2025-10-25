
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Comissao } from '@/hooks/useComissoes';

interface ComissaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comissao: Omit<Comissao, 'id'> | Partial<Comissao>) => void;
  comissao?: Comissao;
  mode: 'create' | 'edit' | 'view';
}

const ComissaoModal = ({ isOpen, onClose, onSave, comissao, mode }: ComissaoModalProps) => {
  const [formData, setFormData] = useState({
    vendaId: '',
    indicador: '',
    valor: '',
    percentual: '',
    status: 'Pendente' as 'Pendente' | 'A Receber' | 'Paga',
    dataPagamento: '',
    observacoes: ''
  });

  useEffect(() => {
    if (comissao) {
      setFormData({
        vendaId: comissao.vendaId,
        indicador: comissao.indicador,
        valor: comissao.valor,
        percentual: comissao.percentual,
        status: comissao.status,
        dataPagamento: comissao.dataPagamento || '',
        observacoes: comissao.observacoes || ''
      });
    }
  }, [comissao]);

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
            {mode === 'create' && 'Nova Comissão'}
            {mode === 'edit' && 'Editar Comissão'}
            {mode === 'view' && 'Visualizar Comissão'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Venda ID</Label>
            <Input
              value={formData.vendaId}
              onChange={(e) => setFormData({...formData, vendaId: e.target.value})}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Indicador</Label>
            <Input
              value={formData.indicador}
              onChange={(e) => setFormData({...formData, indicador: e.target.value})}
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
            <Label>Percentual</Label>
            <Input
              value={formData.percentual}
              onChange={(e) => setFormData({...formData, percentual: e.target.value})}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Pendente' | 'A Receber' | 'Paga') => setFormData({...formData, status: value})} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="A Receber">A Receber</SelectItem>
                <SelectItem value="Paga">Paga</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === 'Paga' && (
            <div>
              <Label>Data do Pagamento</Label>
              <Input
                value={formData.dataPagamento}
                onChange={(e) => setFormData({...formData, dataPagamento: e.target.value})}
                disabled={isReadOnly}
              />
            </div>
          )}

          <div>
            <Label>Observações</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              disabled={isReadOnly}
            />
          </div>
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

export default ComissaoModal;
