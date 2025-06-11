
import { useState } from 'react';

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
  const [indicadores, setIndicadores] = useState<Indicador[]>([
    {
      id: "IND001",
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(11) 99999-1111",
      percentualComissao: 10,
      status: "Ativo",
      dataCadastro: "10/01/2024"
    },
    {
      id: "IND002",
      nome: "Pedro Lima",
      email: "pedro.lima@email.com",
      telefone: "(11) 99999-2222",
      percentualComissao: 8,
      status: "Ativo",
      dataCadastro: "08/01/2024"
    },
    {
      id: "IND003",
      nome: "Lucas Ferreira",
      email: "lucas.ferreira@email.com",
      telefone: "(11) 99999-3333",
      percentualComissao: 12,
      status: "Inativo",
      dataCadastro: "05/01/2024"
    }
  ]);

  const createIndicador = (indicador: Omit<Indicador, 'id'>) => {
    const newIndicador: Indicador = {
      ...indicador,
      id: `IND${String(indicadores.length + 1).padStart(3, '0')}`
    };
    setIndicadores([newIndicador, ...indicadores]);
  };

  const updateIndicador = (id: string, updatedIndicador: Partial<Indicador>) => {
    setIndicadores(indicadores.map(ind => 
      ind.id === id ? { ...ind, ...updatedIndicador } : ind
    ));
  };

  const deleteIndicador = (id: string) => {
    setIndicadores(indicadores.filter(ind => ind.id !== id));
  };

  const getIndicador = (id: string) => {
    return indicadores.find(ind => ind.id === id);
  };

  const getIndicadorByNome = (nome: string) => {
    return indicadores.find(ind => ind.nome === nome);
  };

  return {
    indicadores,
    createIndicador,
    updateIndicador,
    deleteIndicador,
    getIndicador,
    getIndicadorByNome
  };
};
