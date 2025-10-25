import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ContaPagar {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'Certificado' | 'Comissao' | 'Fornecedor' | 'Despesa Operacional' | 'Outros';
  fornecedor: string;
  dataEmissao: string;
  dataVencimento: string;
  dataPagamento: string | null;
  status: 'Pendente' | 'Pago' | 'Vencido' | 'Cancelado';
  certificadoId: string | null;
  vendaId: string | null;
  comissaoId: string | null;
  observacoes: string | null;
}

export const useContasAPagar = () => {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchContas = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contas_a_pagar')
        .select('*')
        .order('data_vencimento', { ascending: true });

      if (error) throw error;

      const mappedContas: ContaPagar[] = data.map(item => ({
        id: item.id,
        descricao: item.descricao,
        valor: item.valor,
        tipo: item.tipo,
        fornecedor: item.fornecedor,
        dataEmissao: new Date(item.data_emissao).toLocaleDateString('pt-BR'),
        dataVencimento: new Date(item.data_vencimento).toLocaleDateString('pt-BR'),
        dataPagamento: item.data_pagamento ? new Date(item.data_pagamento).toLocaleDateString('pt-BR') : null,
        status: item.status,
        certificadoId: item.certificado_id,
        vendaId: item.venda_id,
        comissaoId: item.comissao_id,
        observacoes: item.observacoes
      }));

      setContas(mappedContas);
    } catch (error: any) {
      console.error('Erro ao buscar contas a pagar:', error);
      toast({
        title: "Erro ao carregar contas a pagar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContas();
  }, [user]);

  const marcarComoPaga = async (id: string, dataPagamento?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contas_a_pagar')
        .update({
          status: 'Pago',
          data_pagamento: dataPagamento || new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchContas();
      
      toast({
        title: "Sucesso",
        description: "Conta marcada como paga"
      });
    } catch (error: any) {
      console.error('Erro ao marcar conta como paga:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const createConta = async (conta: Omit<ContaPagar, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contas_a_pagar')
        .insert({
          descricao: conta.descricao,
          valor: conta.valor,
          tipo: conta.tipo,
          fornecedor: conta.fornecedor,
          data_emissao: new Date(conta.dataEmissao.split('/').reverse().join('-')).toISOString().split('T')[0],
          data_vencimento: new Date(conta.dataVencimento.split('/').reverse().join('-')).toISOString().split('T')[0],
          data_pagamento: conta.dataPagamento ? new Date(conta.dataPagamento.split('/').reverse().join('-')).toISOString().split('T')[0] : null,
          status: conta.status,
          certificado_id: conta.certificadoId,
          venda_id: conta.vendaId,
          comissao_id: conta.comissaoId,
          observacoes: conta.observacoes,
          user_id: user.id
        });

      if (error) throw error;
      
      await fetchContas();
      
      toast({
        title: "Sucesso",
        description: "Conta a pagar criada"
      });
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteConta = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contas_a_pagar')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchContas();
      
      toast({
        title: "Sucesso",
        description: "Conta excluída"
      });
    } catch (error: any) {
      console.error('Erro ao deletar conta:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    contas,
    loading,
    marcarComoPaga,
    createConta,
    deleteConta,
    refresh: fetchContas
  };
};
