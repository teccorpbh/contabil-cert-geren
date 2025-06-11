
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Edit, Trash, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Certificados = () => {
  const certificados = [
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
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Emitido": return "bg-green-100 text-green-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      case "Cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getVencimentoColor = (dias: number) => {
    if (dias < 0) return "bg-red-100 text-red-800";
    if (dias <= 30) return "bg-orange-100 text-orange-800";
    if (dias <= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <Layout>
      <Navigation 
        brand={{ name: "Contabilcert", icon: FileText }}
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Vendas", href: "/vendas" },
          { label: "Certificados", href: "/certificados" },
          { label: "Comissões", href: "/comissoes" },
          { label: "Relatórios", href: "/relatorios" }
        ]}
        actions={[{ label: "Nova Venda", href: "/vendas/nova" }]}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Certificados</h1>
            <p className="text-slate-600 mt-2">Gerencie todos os certificados digitais emitidos</p>
          </div>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Venda</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificados.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.id}</TableCell>
                  <TableCell>{cert.tipo}</TableCell>
                  <TableCell>{cert.documento}</TableCell>
                  <TableCell>{cert.cliente}</TableCell>
                  <TableCell>{cert.validade}</TableCell>
                  <TableCell>
                    <Badge className={getVencimentoColor(cert.diasVencimento)}>
                      {cert.diasVencimento > 0 ? `${cert.diasVencimento} dias` : 
                       cert.diasVencimento === 0 ? "Hoje" : "Vencido"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{cert.vendaId}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {cert.diasVencimento <= 30 && cert.status === "Emitido" && (
                        <Button size="sm" variant="outline" className="text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default Certificados;
