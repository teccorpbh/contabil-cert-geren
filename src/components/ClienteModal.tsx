import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cliente } from "@/hooks/useClientes";

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: any) => void;
  cliente?: Cliente | null;
  mode: 'create' | 'edit' | 'view';
}

export function ClienteModal({ isOpen, onClose, onSave, cliente, mode }: ClienteModalProps) {
  const [formData, setFormData] = useState({
    nome_razao_social: '',
    cpf_cnpj: '',
    tipo_pessoa: 'PF' as 'PF' | 'PJ',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    inscricao_municipal: '',
    inscricao_estadual: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
  });

  useEffect(() => {
    if (cliente && (mode === 'edit' || mode === 'view')) {
      setFormData({
        nome_razao_social: cliente.nome_razao_social || '',
        cpf_cnpj: cliente.cpf_cnpj || '',
        tipo_pessoa: cliente.tipo_pessoa || 'PF',
        email: cliente.email || '',
        telefone: cliente.telefone || '',
        cep: cliente.cep || '',
        endereco: cliente.endereco || '',
        numero: cliente.numero || '',
        complemento: cliente.complemento || '',
        bairro: cliente.bairro || '',
        cidade: cliente.cidade || '',
        estado: cliente.estado || '',
        inscricao_municipal: cliente.inscricao_municipal || '',
        inscricao_estadual: cliente.inscricao_estadual || '',
        status: cliente.status || 'Ativo',
      });
    } else {
      setFormData({
        nome_razao_social: '',
        cpf_cnpj: '',
        tipo_pessoa: 'PF',
        email: '',
        telefone: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        inscricao_municipal: '',
        inscricao_estadual: '',
        status: 'Ativo',
      });
    }
  }, [cliente, mode, isOpen]);

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
            {mode === 'create' && 'Novo Cliente'}
            {mode === 'edit' && 'Editar Cliente'}
            {mode === 'view' && 'Visualizar Cliente'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo_pessoa">Tipo de Pessoa *</Label>
              <Select
                value={formData.tipo_pessoa}
                onValueChange={(value: 'PF' | 'PJ') => setFormData({ ...formData, tipo_pessoa: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">Pessoa Física</SelectItem>
                  <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cpf_cnpj">{formData.tipo_pessoa === 'PF' ? 'CPF' : 'CNPJ'} *</Label>
              <Input
                id="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                disabled={isReadOnly}
                required
                placeholder={formData.tipo_pessoa === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nome_razao_social">
              {formData.tipo_pessoa === 'PF' ? 'Nome Completo' : 'Razão Social'} *
            </Label>
            <Input
              id="nome_razao_social"
              value={formData.nome_razao_social}
              onChange={(e) => setFormData({ ...formData, nome_razao_social: e.target.value })}
              disabled={isReadOnly}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isReadOnly}
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                disabled={isReadOnly}
                placeholder="00000-000"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={formData.complemento}
                onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                disabled={isReadOnly}
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                disabled={isReadOnly}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>

          {formData.tipo_pessoa === 'PJ' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inscricao_municipal">Inscrição Municipal</Label>
                <Input
                  id="inscricao_municipal"
                  value={formData.inscricao_municipal}
                  onChange={(e) => setFormData({ ...formData, inscricao_municipal: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                <Input
                  id="inscricao_estadual"
                  value={formData.inscricao_estadual}
                  onChange={(e) => setFormData({ ...formData, inscricao_estadual: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          )}

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
              disabled={!formData.nome_razao_social || !formData.cpf_cnpj}
            >
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}