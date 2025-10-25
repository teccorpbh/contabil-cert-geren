
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Certificado {
  id: string;
  tipo: string;
  documento: string;
  cliente: string;
  validade: string;
  status: 'Emitido' | 'Pendente' | 'Cancelado';
  diasVencimento: number;
  vendaId: string;
  precoCusto?: number;
}

export const useCertificados = () => {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCertificados = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificados')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedCertificados: Certificado[] = data.map(item => ({
        id: item.id,
        tipo: item.tipo,
        documento: item.documento,
        cliente: item.cliente,
        validade: new Date(item.validade).toLocaleDateString('pt-BR'),
        status: item.status,
        diasVencimento: item.dias_vencimento || 0,
        vendaId: item.venda_id,
        precoCusto: item.preco_custo
      }));

      setCertificados(mappedCertificados);
    } catch (error: any) {
      console.error('Erro ao buscar certificados:', error);
      toast({
        title: "Erro ao carregar certificados",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificados();
  }, [user]);

  const createCertificado = async (certificado: Omit<Certificado, 'id'>) => {
    if (!user) return;

    try {
      const validadeDate = new Date(certificado.validade.split('/').reverse().join('-'));
      
      const { error } = await supabase
        .from('certificados')
        .insert({
          tipo: certificado.tipo,
          documento: certificado.documento,
          cliente: certificado.cliente,
          validade: validadeDate.toISOString().split('T')[0],
          status: certificado.status,
          venda_id: certificado.vendaId,
          user_id: user.id
        });

      if (error) throw error;
      
      await fetchCertificados();
    } catch (error: any) {
      console.error('Erro ao criar certificado:', error);
      toast({
        title: "Erro ao criar certificado",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateCertificado = async (id: string, updatedCertificado: Partial<Certificado>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      if (updatedCertificado.tipo) updateData.tipo = updatedCertificado.tipo;
      if (updatedCertificado.documento) updateData.documento = updatedCertificado.documento;
      if (updatedCertificado.cliente) updateData.cliente = updatedCertificado.cliente;
      if (updatedCertificado.validade) {
        const validadeDate = new Date(updatedCertificado.validade.split('/').reverse().join('-'));
        updateData.validade = validadeDate.toISOString().split('T')[0];
      }
      if (updatedCertificado.status) updateData.status = updatedCertificado.status;
      if (updatedCertificado.vendaId) updateData.venda_id = updatedCertificado.vendaId;

      const { error } = await supabase
        .from('certificados')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      await fetchCertificados();
    } catch (error: any) {
      console.error('Erro ao atualizar certificado:', error);
      toast({
        title: "Erro ao atualizar certificado",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteCertificado = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('certificados')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchCertificados();
    } catch (error: any) {
      console.error('Erro ao deletar certificado:', error);
      toast({
        title: "Erro ao deletar certificado",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getCertificado = (id: string) => {
    return certificados.find(cert => cert.id === id);
  };

  return {
    certificados,
    loading,
    createCertificado,
    updateCertificado,
    deleteCertificado,
    getCertificado,
    refresh: fetchCertificados
  };
};
