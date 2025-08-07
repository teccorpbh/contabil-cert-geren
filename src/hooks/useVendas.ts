
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Venda {
  id: string;
  pedidoSegura: string;
  cliente: string;
  clienteId?: string;
  valor: string;
  responsavel: string;
  vendedorId?: string;
  indicador: string;
  indicadorId?: string;
  status: 'Pendente' | 'Emitido' | 'Cancelado';
  statusPagamento: 'Pendente' | 'Pago' | 'Vencido';
  data: string;
  dataVencimento?: string;
}

export const useVendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVendas = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          *,
          indicadores (
            nome
          ),
          vendedores (
            nome
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedVendas: Venda[] = data.map(item => ({
        id: item.id,
        pedidoSegura: item.pedido_segura,
        cliente: item.cliente,
        clienteId: item.cliente_id,
        valor: `R$ ${Number(item.valor).toFixed(2).replace('.', ',')}`,
        responsavel: item.vendedores?.nome || item.responsavel,
        vendedorId: item.vendedor_id,
        indicador: item.indicadores?.nome || '-',
        indicadorId: item.indicador_id,
        status: item.status,
        statusPagamento: item.status_pagamento,
        data: new Date(item.data).toLocaleDateString('pt-BR'),
        dataVencimento: item.data_vencimento ? new Date(item.data_vencimento).toLocaleDateString('pt-BR') : undefined
      }));

      setVendas(mappedVendas);
    } catch (error: any) {
      console.error('Erro ao buscar vendas:', error);
      toast({
        title: "Erro ao carregar vendas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendas();
  }, [user]);

  const createVenda = async (venda: Omit<Venda, 'id'>) => {
    if (!user) {
      console.error('Usuário não autenticado');
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Dados da venda recebidos:', venda);
      console.log('User ID:', user.id);
      
      const valorNumerico = parseFloat(venda.valor.replace('R$', '').replace(',', '.').trim());
      console.log('Valor numérico processado:', valorNumerico);
      
      // Validar se vendedor_id existe na tabela vendedores (se fornecido)
      if (venda.vendedorId) {
        const { data: vendedorExists } = await supabase
          .from('vendedores')
          .select('id')
          .eq('id', venda.vendedorId)
          .single();
        
        if (!vendedorExists) {
          throw new Error('Vendedor selecionado não encontrado');
        }
        console.log('Vendedor validado:', vendedorExists.id);
      }
      
      // Validar se indicador_id existe na tabela indicadores (se fornecido)
      if (venda.indicadorId) {
        const { data: indicadorExists } = await supabase
          .from('indicadores')
          .select('id')
          .eq('id', venda.indicadorId)
          .single();
        
        if (!indicadorExists) {
          throw new Error('Indicador selecionado não encontrado');
        }
        console.log('Indicador validado:', indicadorExists.id);
      }
      
      const vendaData = {
        pedido_segura: venda.pedidoSegura,
        cliente: venda.cliente,
        cliente_id: venda.clienteId || null,
        valor: valorNumerico,
        responsavel: venda.responsavel,
        vendedor_id: venda.vendedorId || null,
        indicador_id: venda.indicadorId || null,
        status: venda.status,
        status_pagamento: venda.statusPagamento,
        data_vencimento: venda.dataVencimento ? new Date(venda.dataVencimento).toISOString() : null,
        user_id: user.id
      };
      
      console.log('Dados para inserção no banco:', vendaData);
      
      const { data, error } = await supabase
        .from('vendas')
        .insert([vendaData])
        .select();

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }
      
      console.log('Venda criada com sucesso:', data);
      
      toast({
        title: "Sucesso",
        description: "Venda criada com sucesso!",
      });
      
      await fetchVendas();
    } catch (error: any) {
      console.error('Erro ao criar venda:', error);
      toast({
        title: "Erro ao criar venda",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateVenda = async (id: string, updatedVenda: Partial<Venda>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      if (updatedVenda.pedidoSegura) updateData.pedido_segura = updatedVenda.pedidoSegura;
      if (updatedVenda.cliente) updateData.cliente = updatedVenda.cliente;
      if (updatedVenda.clienteId !== undefined) updateData.cliente_id = updatedVenda.clienteId || null;
      if (updatedVenda.valor) {
        const valorNumerico = parseFloat(updatedVenda.valor.replace('R$', '').replace(',', '.').trim());
        updateData.valor = valorNumerico;
      }
      if (updatedVenda.responsavel) updateData.responsavel = updatedVenda.responsavel;
      if (updatedVenda.vendedorId !== undefined) updateData.vendedor_id = updatedVenda.vendedorId || null;
      if (updatedVenda.indicadorId !== undefined) updateData.indicador_id = updatedVenda.indicadorId || null;
      if (updatedVenda.status) updateData.status = updatedVenda.status;
      if (updatedVenda.statusPagamento) updateData.status_pagamento = updatedVenda.statusPagamento;
      if (updatedVenda.dataVencimento !== undefined) {
        updateData.data_vencimento = updatedVenda.dataVencimento ? new Date(updatedVenda.dataVencimento).toISOString() : null;
      }

      const { error } = await supabase
        .from('vendas')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      await fetchVendas();
    } catch (error: any) {
      console.error('Erro ao atualizar venda:', error);
      toast({
        title: "Erro ao atualizar venda",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteVenda = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('vendas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchVendas();
    } catch (error: any) {
      console.error('Erro ao deletar venda:', error);
      toast({
        title: "Erro ao deletar venda",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getVenda = (id: string) => {
    return vendas.find(venda => venda.id === id);
  };

  return {
    vendas,
    loading,
    createVenda,
    updateVenda,
    deleteVenda,
    getVenda,
    refresh: fetchVendas
  };
};
