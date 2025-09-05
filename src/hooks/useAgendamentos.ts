import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Agendamento {
  id: string;
  venda_id: string;
  pedido_segura: string;
  cliente_id?: string;
  data_agendamento: string;
  status: 'Agendado' | 'Realizado' | 'Cancelado' | 'Reagendado';
  user_id: string;
  created_at: string;
  updated_at: string;
  // Joined data from related tables
  venda?: {
    id: string;
    cliente: string;
    valor: number;
    responsavel: string;
  };
  cliente?: {
    id: string;
    nome_razao_social: string;
    email?: string;
    telefone?: string;
  };
}

export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAgendamentos = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          venda:vendas(id, cliente, valor, responsavel),
          cliente:clientes(id, nome_razao_social, email, telefone)
        `)
        .eq('user_id', user.id)
        .order('data_agendamento', { ascending: false });

      if (error) {
        console.error('Error fetching agendamentos:', error);
        toast({
          title: "Erro ao carregar agendamentos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setAgendamentos(data || []);
    } catch (error: any) {
      console.error('Error fetching agendamentos:', error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAgendamento = async (agendamento: Omit<Agendamento, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([{ ...agendamento, user_id: user.id }])
        .select(`
          *,
          venda:vendas(id, cliente, valor, responsavel),
          cliente:clientes(id, nome_razao_social, email, telefone)
        `)
        .single();

      if (error) {
        console.error('Error creating agendamento:', error);
        toast({
          title: "Erro ao criar agendamento",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setAgendamentos(prev => [data, ...prev]);
      toast({
        title: "Agendamento criado",
        description: "Agendamento criado com sucesso!",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating agendamento:', error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  const updateAgendamento = async (id: string, updatedAgendamento: Partial<Agendamento>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .update(updatedAgendamento)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          venda:vendas(id, cliente, valor, responsavel),
          cliente:clientes(id, nome_razao_social, email, telefone)
        `)
        .single();

      if (error) {
        console.error('Error updating agendamento:', error);
        toast({
          title: "Erro ao atualizar agendamento",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setAgendamentos(prev => 
        prev.map(agendamento => 
          agendamento.id === id ? data : agendamento
        )
      );

      toast({
        title: "Agendamento atualizado",
        description: "Agendamento atualizado com sucesso!",
      });

      return data;
    } catch (error: any) {
      console.error('Error updating agendamento:', error);
      toast({
        title: "Erro ao atualizar agendamento",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  const deleteAgendamento = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting agendamento:', error);
        toast({
          title: "Erro ao excluir agendamento",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setAgendamentos(prev => prev.filter(agendamento => agendamento.id !== id));
      toast({
        title: "Agendamento excluído",
        description: "Agendamento excluído com sucesso!",
      });
    } catch (error: any) {
      console.error('Error deleting agendamento:', error);
      toast({
        title: "Erro ao excluir agendamento",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  const getAgendamento = (id: string) => {
    return agendamentos.find(agendamento => agendamento.id === id);
  };

  useEffect(() => {
    fetchAgendamentos();
  }, [user]);

  return {
    agendamentos,
    loading,
    createAgendamento,
    updateAgendamento,
    deleteAgendamento,
    getAgendamento,
    refresh: fetchAgendamentos,
  };
};