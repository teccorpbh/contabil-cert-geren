
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Comissao {
  id: string;
  vendaId: string;
  indicador: string;
  indicadorId: string;
  valor: string;
  percentual: string;
  status: 'Pendente' | 'Paga';
  dataPagamento?: string;
  observacoes?: string;
}

export const useComissoes = () => {
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComissoes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comissoes')
        .select(`
          *,
          indicadores (
            nome
          ),
          vendas (
            pedido_segura
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedComissoes: Comissao[] = data.map(item => ({
        id: item.id,
        vendaId: item.venda_id,
        indicador: item.indicadores?.nome || 'N/A',
        indicadorId: item.indicador_id,
        valor: `R$ ${Number(item.valor).toFixed(2).replace('.', ',')}`,
        percentual: `${item.percentual}%`,
        status: item.status,
        dataPagamento: item.data_pagamento ? new Date(item.data_pagamento).toLocaleDateString('pt-BR') : undefined,
        observacoes: item.observacoes
      }));

      setComissoes(mappedComissoes);
    } catch (error: any) {
      console.error('Erro ao buscar comissões:', error);
      toast({
        title: "Erro ao carregar comissões",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComissoes();
  }, [user]);

  const createComissao = async (comissao: Omit<Comissao, 'id'>) => {
    if (!user) return;

    try {
      const valorNumerico = parseFloat(comissao.valor.replace('R$', '').replace(',', '.').trim());
      const percentualNumerico = parseInt(comissao.percentual.replace('%', ''));
      
      const { error } = await supabase
        .from('comissoes')
        .insert({
          venda_id: comissao.vendaId,
          indicador_id: comissao.indicadorId,
          valor: valorNumerico,
          percentual: percentualNumerico,
          status: comissao.status,
          data_pagamento: comissao.dataPagamento ? new Date(comissao.dataPagamento).toISOString() : null,
          observacoes: comissao.observacoes,
          user_id: user.id
        });

      if (error) throw error;
      
      await fetchComissoes();
    } catch (error: any) {
      console.error('Erro ao criar comissão:', error);
      toast({
        title: "Erro ao criar comissão",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateComissao = async (id: string, updatedComissao: Partial<Comissao>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      if (updatedComissao.vendaId) updateData.venda_id = updatedComissao.vendaId;
      if (updatedComissao.indicadorId) updateData.indicador_id = updatedComissao.indicadorId;
      if (updatedComissao.valor) {
        const valorNumerico = parseFloat(updatedComissao.valor.replace('R$', '').replace(',', '.').trim());
        updateData.valor = valorNumerico;
      }
      if (updatedComissao.percentual) {
        const percentualNumerico = parseInt(updatedComissao.percentual.replace('%', ''));
        updateData.percentual = percentualNumerico;
      }
      if (updatedComissao.status) updateData.status = updatedComissao.status;
      if (updatedComissao.dataPagamento !== undefined) {
        updateData.data_pagamento = updatedComissao.dataPagamento ? new Date(updatedComissao.dataPagamento).toISOString() : null;
      }
      if (updatedComissao.observacoes !== undefined) updateData.observacoes = updatedComissao.observacoes;

      const { error } = await supabase
        .from('comissoes')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      await fetchComissoes();
    } catch (error: any) {
      console.error('Erro ao atualizar comissão:', error);
      toast({
        title: "Erro ao atualizar comissão",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteComissao = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comissoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchComissoes();
    } catch (error: any) {
      console.error('Erro ao deletar comissão:', error);
      toast({
        title: "Erro ao deletar comissão",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    comissoes,
    loading,
    createComissao,
    updateComissao,
    deleteComissao,
    refresh: fetchComissoes
  };
};
