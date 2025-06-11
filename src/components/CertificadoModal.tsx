
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Certificado } from '@/hooks/useCertificados';

interface CertificadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (certificado: Omit<Certificado, 'id'> | Partial<Certificado>) => void;
  certificado?: Certificado;
  mode: 'create' | 'edit' | 'view';
}

const CertificadoModal = ({ isOpen, onClose, onSave, certificado, mode }: CertificadoModalProps) => {
  const [formData, setFormData] = useState({
    tipo: '',
    documento: '',
    cliente: '',
    validade: '',
    status: 'Pendente' as const,
    diasVencimento: 0,
    vendaId: ''
  });

  useEffect(() => {
    if (certificado) {
      setFormData({
        tipo: certificado.tipo,
        documento: certificado.documento,
        cliente: certificado.cliente,
        validade: certificado.validade,
        status: certificado.status,
        diasVencimento: certificado.diasVencimento,
        vendaId: certificado.vendaId
      });
    }
  }, [certificado]);

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
            {mode === 'create' && 'Novo Certificado'}
            {mode === 'edit' && 'Editar Certificado'}
            {mode === 'view' && 'Visualizar Certificado'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Tipo</Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})} disabled={isReadOnly}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A1 - Pessoa Física">A1 - Pessoa Física</SelectItem>
                <SelectItem value="A3 - Pessoa Física">A3 - Pessoa Física</SelectItem>
                <SelectItem value="A1 - Pessoa Jurídica">A1 - Pessoa Jurídica</SelectItem>
                <SelectItem value="A3 - Pessoa Jurídica">A3 - Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>CPF/CNPJ</Label>
            <Input
              value={formData.documento}
              onChange={(e) => setFormData({...formData, documento: e.target.value})}
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
            <Label>Validade</Label>
            <Input
              value={formData.validade}
              onChange={(e) => setFormData({...formData, validade: e.target.value})}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})} disabled={isReadOnly}>
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
            <Label>Venda ID</Label>
            <Input
              value={formData.vendaId}
              onChange={(e) => setFormData({...formData, vendaId: e.target.value})}
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

export default CertificadoModal;
