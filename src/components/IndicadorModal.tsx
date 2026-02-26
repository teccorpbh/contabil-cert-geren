
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Indicador } from '@/hooks/useIndicadores';

interface IndicadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (indicador: Omit<Indicador, 'id'> | Partial<Indicador>) => void;
  indicador?: Indicador;
  mode: 'create' | 'edit' | 'view';
}

const IndicadorModal = ({ isOpen, onClose, onSave, indicador, mode }: IndicadorModalProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    percentualComissao: 10,
    status: 'Ativo' as 'Ativo' | 'Inativo',
    dataCadastro: new Date().toLocaleDateString('pt-BR')
  });

  useEffect(() => {
    if (indicador) {
      setFormData({
        nome: indicador.nome,
        email: indicador.email,
        telefone: indicador.telefone,
        percentualComissao: indicador.percentualComissao,
        status: indicador.status,
        dataCadastro: indicador.dataCadastro
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        percentualComissao: 10,
        status: 'Ativo',
        dataCadastro: new Date().toLocaleDateString('pt-BR')
      });
    }
  }, [indicador]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Novo Indicador'}
            {mode === 'edit' && 'Editar Indicador'}
            {mode === 'view' && 'Visualizar Indicador'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                disabled={isReadOnly}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                disabled={isReadOnly}
              />
            </div>

            <div>
              <Label>Percentual de Comissão (%)</Label>
              <Input
                type="number"
                value={formData.percentualComissao}
                onChange={(e) => setFormData({...formData, percentualComissao: Number(e.target.value)})}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: 'Ativo' | 'Inativo') => setFormData({...formData, status: value})} disabled={isReadOnly}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

export default IndicadorModal;
