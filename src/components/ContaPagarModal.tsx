import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContaPagar } from "@/hooks/useContasAPagar";

interface ContaPagarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (conta: Omit<ContaPagar, 'id'>) => void;
  conta?: ContaPagar;
  mode: 'create' | 'edit' | 'view';
}

export const ContaPagarModal = ({ isOpen, onClose, onSave, conta, mode }: ContaPagarModalProps) => {
  const [formData, setFormData] = useState<Omit<ContaPagar, 'id'>>({
    descricao: '',
    valor: 0,
    tipo: 'Certificado',
    fornecedor: '',
    dataEmissao: new Date().toLocaleDateString('pt-BR'),
    dataVencimento: new Date().toLocaleDateString('pt-BR'),
    dataPagamento: null,
    status: 'Pendente',
    certificadoId: null,
    vendaId: null,
    comissaoId: null,
    observacoes: null
  });

  useEffect(() => {
    if (conta && (mode === 'edit' || mode === 'view')) {
      setFormData({
        descricao: conta.descricao,
        valor: conta.valor,
        tipo: conta.tipo,
        fornecedor: conta.fornecedor,
        dataEmissao: conta.dataEmissao,
        dataVencimento: conta.dataVencimento,
        dataPagamento: conta.dataPagamento,
        status: conta.status,
        certificadoId: conta.certificadoId,
        vendaId: conta.vendaId,
        comissaoId: conta.comissaoId,
        observacoes: conta.observacoes
      });
    } else if (mode === 'create') {
      setFormData({
        descricao: '',
        valor: 0,
        tipo: 'Certificado',
        fornecedor: '',
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        dataVencimento: new Date().toLocaleDateString('pt-BR'),
        dataPagamento: null,
        status: 'Pendente',
        certificadoId: null,
        vendaId: null,
        comissaoId: null,
        observacoes: null
      });
    }
  }, [conta, mode, isOpen]);

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
            {mode === 'create' && 'Nova Conta a Pagar'}
            {mode === 'edit' && 'Editar Conta a Pagar'}
            {mode === 'view' && 'Detalhes da Conta'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              disabled={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                disabled={isReadOnly}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certificado">Certificado</SelectItem>
                  <SelectItem value="Comissao">Comissão</SelectItem>
                  <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="Despesa Operacional">Despesa Operacional</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input
              id="fornecedor"
              value={formData.fornecedor}
              onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
              disabled={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dataEmissao">Data Emissão</Label>
              <Input
                id="dataEmissao"
                value={formData.dataEmissao}
                onChange={(e) => setFormData({ ...formData, dataEmissao: e.target.value })}
                disabled={isReadOnly}
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dataVencimento">Data Vencimento</Label>
              <Input
                id="dataVencimento"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                disabled={isReadOnly}
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.status === 'Pago' && (
            <div className="grid gap-2">
              <Label htmlFor="dataPagamento">Data Pagamento</Label>
              <Input
                id="dataPagamento"
                value={formData.dataPagamento || ''}
                onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
                disabled={isReadOnly}
                placeholder="DD/MM/AAAA"
              />
            </div>
          )}

          {formData.comissaoId && (
            <div className="grid gap-2 p-4 bg-orange-50 border border-orange-200 rounded">
              <p className="text-sm text-orange-900 font-semibold">
                ⚠️ Conta relacionada a comissão
              </p>
              <p className="text-xs text-orange-800">
                Ao pagar esta conta, a comissão relacionada será automaticamente marcada como paga.
              </p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes || ''}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              disabled={isReadOnly}
              rows={3}
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
