import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Vendedor {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  status: 'Ativo' | 'Inativo';
  percentualComissao: number;
  data_cadastro: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface VendedorInsert {
  nome: string;
  email: string;
  telefone?: string;
  status?: 'Ativo' | 'Inativo';
  percentual_comissao?: number;
  user_id: string;
}

export interface VendedorUpdate {
  nome?: string;
  email?: string;
  telefone?: string;
  status?: 'Ativo' | 'Inativo';
  percentual_comissao?: number;
}

export function useVendedores() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVendedores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendedores')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      
      const mappedVendedores = (data || []).map(vendedor => ({
        ...vendedor,
        percentualComissao: vendedor.percentual_comissao || 5
      }));
      
      setVendedores(mappedVendedores);
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os vendedores.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVendedor = async (vendedor: VendedorInsert) => {
    try {
      const { data, error } = await supabase
        .from('vendedores')
        .insert([vendedor])
        .select()
        .single();

      if (error) throw error;

      const mappedVendedor = {
        ...data,
        percentualComissao: data.percentual_comissao || 5
      };

      setVendedores(prev => [...prev, mappedVendedor]);
      toast({
        title: "Sucesso",
        description: "Vendedor criado com sucesso!",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar vendedor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o vendedor.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateVendedor = async (id: string, updates: VendedorUpdate) => {
    try {
      const { data, error } = await supabase
        .from('vendedores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const mappedData = {
        ...data,
        percentualComissao: data.percentual_comissao || 5
      };

      setVendedores(prev => 
        prev.map(vendedor => 
          vendedor.id === id ? { ...vendedor, ...mappedData } : vendedor
        )
      );
      toast({
        title: "Sucesso",
        description: "Vendedor atualizado com sucesso!",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o vendedor.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteVendedor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendedores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVendedores(prev => prev.filter(vendedor => vendedor.id !== id));
      toast({
        title: "Sucesso",
        description: "Vendedor excluído com sucesso!",
      });
      return { error: null };
    } catch (error) {
      console.error('Erro ao deletar vendedor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o vendedor.",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchVendedores();
  }, []);

  return {
    vendedores,
    loading,
    createVendedor,
    updateVendedor,
    deleteVendedor,
    refetch: fetchVendedores,
  };
}