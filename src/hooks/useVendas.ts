
import { useState } from 'react';

export interface Venda {
  id: string;
  pedidoSegura: string;
  cliente: string;
  valor: string;
  responsavel: string;
  indicador: string;
  status: 'Pendente' | 'Emitido' | 'Cancelado';
  data: string;
}

export const useVendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([
    {
      id: "V001",
      pedidoSegura: "SG123456",
      cliente: "Empresa ABC Ltda",
      valor: "R$ 450,00",
      responsavel: "João Silva",
      indicador: "Maria Santos",
      status: "Pendente",
      data: "15/01/2024"
    },
    {
      id: "V002",
      pedidoSegura: "SG123457",
      cliente: "Tech Solutions ME",
      valor: "R$ 320,00",
      responsavel: "Ana Costa",
      indicador: "Pedro Lima",
      status: "Emitido",
      data: "14/01/2024"
    },
    {
      id: "V003",
      pedidoSegura: "SG123458",
      cliente: "Consultoria XYZ",
      valor: "R$ 280,00",
      responsavel: "Carlos Oliveira",
      indicador: "-",
      status: "Cancelado",
      data: "13/01/2024"
    }
  ]);

  const createVenda = (venda: Omit<Venda, 'id'>) => {
    const newVenda: Venda = {
      ...venda,
      id: `V${String(vendas.length + 1).padStart(3, '0')}`
    };
    setVendas([newVenda, ...vendas]);
  };

  const updateVenda = (id: string, updatedVenda: Partial<Venda>) => {
    setVendas(vendas.map(venda => 
      venda.id === id ? { ...venda, ...updatedVenda } : venda
    ));
  };

  const deleteVenda = (id: string) => {
    setVendas(vendas.filter(venda => venda.id !== id));
  };

  const getVenda = (id: string) => {
    return vendas.find(venda => venda.id === id);
  };

  return {
    vendas,
    createVenda,
    updateVenda,
    deleteVenda,
    getVenda
  };
};
