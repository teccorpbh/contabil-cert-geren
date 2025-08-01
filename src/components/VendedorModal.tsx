import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vendedor } from "@/hooks/useVendedores";

interface VendedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendedor: any) => void;
  vendedor?: Vendedor | null;
  mode: 'create' | 'edit' | 'view';
}

export function VendedorModal({ isOpen, onClose, onSave, vendedor, mode }: VendedorModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
  });

  useEffect(() => {
    if (vendedor && (mode === 'edit' || mode === 'view')) {
      setFormData({
        nome: vendedor.nome || '',
        email: vendedor.email || '',
        telefone: vendedor.telefone || '',
        status: vendedor.status || 'Ativo',
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        status: 'Ativo',
      });
    }
  }, [vendedor, mode, isOpen]);

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
            {mode === 'create' && 'Novo Vendedor'}
            {mode === 'edit' && 'Editar Vendedor'}
            {mode === 'view' && 'Visualizar Vendedor'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              disabled={isReadOnly}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isReadOnly}
              required
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              disabled={isReadOnly}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Ativo' | 'Inativo') => setFormData({ ...formData, status: value })}
              disabled={isReadOnly}
            >
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {mode === 'view' ? 'Fechar' : 'Cancelar'}
          </Button>
          {mode !== 'view' && (
            <Button 
              onClick={handleSave}
              disabled={!formData.nome || !formData.email}
            >
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}