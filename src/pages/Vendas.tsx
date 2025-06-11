
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Vendas = () => {
  const vendas = [
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
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Emitido": return "bg-green-100 text-green-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      case "Cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <Navigation 
        brand={{ name: "Contabilcert", icon: FileText }}
        items={[
          { label: "Dashboard" },
          { label: "Vendas" },
          { label: "Certificados" },
          { label: "Comissões" },
          { label: "Relatórios" }
        ]}
        actions={[{ label: "Nova Venda" }]}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Vendas</h1>
            <p className="text-slate-600 mt-2">Gerencie todas as vendas de certificados digitais</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pedido Segura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Indicador</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell className="font-medium">{venda.id}</TableCell>
                  <TableCell>{venda.pedidoSegura}</TableCell>
                  <TableCell>{venda.cliente}</TableCell>
                  <TableCell>{venda.valor}</TableCell>
                  <TableCell>{venda.responsavel}</TableCell>
                  <TableCell>{venda.indicador}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(venda.status)}>
                      {venda.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{venda.data}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash className="h-4 w-4" />
                      </Button>
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

export default Vendas;
