
import { useState } from 'react';

export interface Comissao {
  id: string;
  vendaId: string;
  indicador: string;
  valor: string;
  percentual: string;
  status: 'Paga' | 'Pendente';
  dataPagamento?: string;
  observacoes?: string;
}

export const useComissoes = () => {
  const [comissoes, setComissoes] = useState<Comissao[]>([
    {
      id: "COM001",
      vendaId: "V001",
      indicador: "Maria Santos",
      valor: "R$ 45,00",
      percentual: "10%",
      status: "Pendente",
      observacoes: "Aguardando confirmação do pagamento"
    },
    {
      id: "COM002",
      vendaId: "V002",
      indicador: "Pedro Lima",
      valor: "R$ 32,00",
      percentual: "10%",
      status: "Paga",
      dataPagamento: "20/01/2024"
    },
    {
      id: "COM003",
      vendaId: "V003",
      indicador: "Lucas Ferreira",
      valor: "R$ 28,00",
      percentual: "10%",
      status: "Pendente"
    }
  ]);

  const createComissao = (comissao: Omit<Comissao, 'id'>) => {
    const newComissao: Comissao = {
      ...comissao,
      id: `COM${String(comissoes.length + 1).padStart(3, '0')}`
    };
    setComissoes([newComissao, ...comissoes]);
  };

  const updateComissao = (id: string, updatedComissao: Partial<Comissao>) => {
    setComissoes(comissoes.map(com => 
      com.id === id ? { ...com, ...updatedComissao } : com
    ));
  };

  const deleteComissao = (id: string) => {
    setComissoes(comissoes.filter(com => com.id !== id));
  };

  const getComissao = (id: string) => {
    return comissoes.find(com => com.id === id);
  };

  return {
    comissoes,
    createComissao,
    updateComissao,
    deleteComissao,
    getComissao
  };
};
