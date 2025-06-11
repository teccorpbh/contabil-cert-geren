
import { useState } from 'react';

export interface Certificado {
  id: string;
  tipo: string;
  documento: string;
  cliente: string;
  validade: string;
  status: 'Emitido' | 'Pendente' | 'Cancelado';
  diasVencimento: number;
  vendaId: string;
}

export const useCertificados = () => {
  const [certificados, setCertificados] = useState<Certificado[]>([
    {
      id: "CERT001",
      tipo: "A1 - Pessoa Física",
      documento: "123.456.789-00",
      cliente: "João Silva",
      validade: "15/01/2025",
      status: "Emitido",
      diasVencimento: 35,
      vendaId: "V001"
    },
    {
      id: "CERT002",
      tipo: "A3 - Pessoa Jurídica",
      documento: "12.345.678/0001-90",
      cliente: "Empresa ABC Ltda",
      validade: "25/02/2024",
      status: "Pendente",
      diasVencimento: -5,
      vendaId: "V002"
    },
    {
      id: "CERT003",
      tipo: "A1 - Pessoa Física",
      documento: "987.654.321-00",
      cliente: "Maria Santos",
      validade: "10/03/2024",
      status: "Cancelado",
      diasVencimento: -15,
      vendaId: "V003"
    }
  ]);

  const createCertificado = (certificado: Omit<Certificado, 'id'>) => {
    const newCertificado: Certificado = {
      ...certificado,
      id: `CERT${String(certificados.length + 1).padStart(3, '0')}`
    };
    setCertificados([newCertificado, ...certificados]);
  };

  const updateCertificado = (id: string, updatedCertificado: Partial<Certificado>) => {
    setCertificados(certificados.map(cert => 
      cert.id === id ? { ...cert, ...updatedCertificado } : cert
    ));
  };

  const deleteCertificado = (id: string) => {
    setCertificados(certificados.filter(cert => cert.id !== id));
  };

  const getCertificado = (id: string) => {
    return certificados.find(cert => cert.id === id);
  };

  return {
    certificados,
    createCertificado,
    updateCertificado,
    deleteCertificado,
    getCertificado
  };
};
