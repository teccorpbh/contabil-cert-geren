import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Cliente {
  id: string;
  nome_razao_social: string;
  cpf_cnpj: string;
  tipo_pessoa: 'PF' | 'PJ';
  email?: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  inscricao_municipal?: string;
  inscricao_estadual?: string;
  status: 'Ativo' | 'Inativo';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ClienteInsert {
  nome_razao_social: string;
  cpf_cnpj: string;
  tipo_pessoa: 'PF' | 'PJ';
  email?: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  inscricao_municipal?: string;
  inscricao_estadual?: string;
  status?: 'Ativo' | 'Inativo';
  user_id: string;
}

export interface ClienteUpdate {
  nome_razao_social?: string;
  cpf_cnpj?: string;
  tipo_pessoa?: 'PF' | 'PJ';
  email?: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  inscricao_municipal?: string;
  inscricao_estadual?: string;
  status?: 'Ativo' | 'Inativo';
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome_razao_social', { ascending: true });

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (cliente: ClienteInsert) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([cliente])
        .select()
        .single();

      if (error) throw error;

      setClientes(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o cliente.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateCliente = async (id: string, updates: ClienteUpdate) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClientes(prev => 
        prev.map(cliente => 
          cliente.id === id ? { ...cliente, ...data } : cliente
        )
      );
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClientes(prev => prev.filter(cliente => cliente.id !== id));
      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso!",
      });
      return { error: null };
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const findClienteByCpfCnpj = async (cpfCnpj: string) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('cpf_cnpj', cpfCnpj)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar cliente por CPF/CNPJ:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    loading,
    createCliente,
    updateCliente,
    deleteCliente,
    findClienteByCpfCnpj,
    refetch: fetchClientes,
  };
}