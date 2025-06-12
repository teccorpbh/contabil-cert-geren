
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Indicador {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  percentualComissao: number;
  status: 'Ativo' | 'Inativo';
  dataCadastro: string;
}

export const useIndicadores = () => {
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchIndicadores = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('indicadores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedIndicadores: Indicador[] = data.map(item => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        telefone: item.telefone,
        percentualComissao: item.percentual_comissao,
        status: item.status as 'Ativo' | 'Inativo',
        dataCadastro: new Date(item.data_cadastro).toLocaleDateString('pt-BR')
      }));

      setIndicadores(mappedIndicadores);
    } catch (error: any) {
      console.error('Erro ao buscar indicadores:', error);
      toast({
        title: "Erro ao carregar indicadores",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicadores();
  }, [user]);

  const createIndicador = async (indicador: Omit<Indicador, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('indicadores')
        .insert({
          nome: indicador.nome,
          email: indicador.email,
          telefone: indicador.telefone,
          percentual_comissao: indicador.percentualComissao,
          status: indicador.status,
          user_id: user.id
        });

      if (error) throw error;
      
      await fetchIndicadores();
    } catch (error: any) {
      console.error('Erro ao criar indicador:', error);
      toast({
        title: "Erro ao criar indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateIndicador = async (id: string, updatedIndicador: Partial<Indicador>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      if (updatedIndicador.nome) updateData.nome = updatedIndicador.nome;
      if (updatedIndicador.email) updateData.email = updatedIndicador.email;
      if (updatedIndicador.telefone) updateData.telefone = updatedIndicador.telefone;
      if (updatedIndicador.percentualComissao !== undefined) updateData.percentual_comissao = updatedIndicador.percentualComissao;
      if (updatedIndicador.status) updateData.status = updatedIndicador.status;

      const { error } = await supabase
        .from('indicadores')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      await fetchIndicadores();
    } catch (error: any) {
      console.error('Erro ao atualizar indicador:', error);
      toast({
        title: "Erro ao atualizar indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteIndicador = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('indicadores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchIndicadores();
    } catch (error: any) {
      console.error('Erro ao deletar indicador:', error);
      toast({
        title: "Erro ao deletar indicador",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getIndicador = (id: string) => {
    return indicadores.find(ind => ind.id === id);
  };

  const getIndicadorByNome = (nome: string) => {
    return indicadores.find(ind => ind.nome === nome);
  };

  return {
    indicadores,
    loading,
    createIndicador,
    updateIndicador,
    deleteIndicador,
    getIndicador,
    getIndicadorByNome,
    refresh: fetchIndicadores
  };
};
