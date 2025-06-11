
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Comissoes = () => {
  const comissoes = [
    {
      id: "COM001",
      indicador: "Maria Santos",
      tipoIndicador: "Pessoa Física",
      documento: "123.456.789-00",
      vendaId: "V001",
      cliente: "Empresa ABC Ltda",
      valorVenda: "R$ 450,00",
      percentual: "10%",
      valorComissao: "R$ 45,00",
      status: "Pendente",
      dataVenda: "15/01/2024"
    },
    {
      id: "COM002",
      indicador: "Pedro Lima",
      tipoIndicador: "Pessoa Física",
      documento: "987.654.321-00",
      vendaId: "V002",
      cliente: "Tech Solutions ME",
      valorVenda: "R$ 320,00",
      percentual: "15%",
      valorComissao: "R$ 48,00",
      status: "Paga",
      dataVenda: "14/01/2024"
    },
    {
      id: "COM003",
      indicador: "Consultoria XYZ",
      tipoIndicador: "Pessoa Jurídica",
      documento: "11.222.333/0001-44",
      vendaId: "V004",
      cliente: "Indústria DEF",
      valorVenda: "R$ 580,00",
      percentual: "12%",
      valorComissao: "R$ 69,60",
      status: "Pendente",
      dataVenda: "13/01/2024"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paga": return "bg-green-100 text-green-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalPendente = comissoes
    .filter(c => c.status === "Pendente")
    .reduce((acc, c) => acc + parseFloat(c.valorComissao.replace("R$ ", "").replace(",", ".")), 0);

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
            <h1 className="text-3xl font-bold text-slate-900">Comissões</h1>
            <p className="text-slate-600 mt-2">Gerencie comissões de indicadores</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Indicador
          </Button>
        </div>

        {/* Resumo de Comissões */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Pago</p>
                <p className="text-2xl font-bold text-slate-900">R$ 48,00</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Pendente</p>
                <p className="text-2xl font-bold text-slate-900">R$ {totalPendente.toFixed(2).replace(".", ",")}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Comissões</p>
                <p className="text-2xl font-bold text-slate-900">R$ {(totalPendente + 48).toFixed(2).replace(".", ",")}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Indicador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Venda</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor Venda</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comissoes.map((comissao) => (
                <TableRow key={comissao.id}>
                  <TableCell className="font-medium">{comissao.id}</TableCell>
                  <TableCell>{comissao.indicador}</TableCell>
                  <TableCell>{comissao.tipoIndicador}</TableCell>
                  <TableCell>{comissao.documento}</TableCell>
                  <TableCell>{comissao.vendaId}</TableCell>
                  <TableCell>{comissao.cliente}</TableCell>
                  <TableCell>{comissao.valorVenda}</TableCell>
                  <TableCell>{comissao.percentual}</TableCell>
                  <TableCell className="font-medium">{comissao.valorComissao}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(comissao.status)}>
                      {comissao.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {comissao.status === "Pendente" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <DollarSign className="h-4 w-4" />
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

export default Comissoes;
