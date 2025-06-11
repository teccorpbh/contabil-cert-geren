
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Filter, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";

const Relatorios = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [responsavel, setResponsavel] = useState("");

  const handleGerarRelatorio = () => {
    console.log("Gerando relatório:", { tipoRelatorio, dataInicio, dataFim, responsavel });
  };

  const relatoriosDisponiveis = [
    {
      id: "vendas-periodo",
      nome: "Vendas por Período",
      descricao: "Relatório detalhado de vendas em um período específico",
      icone: TrendingUp
    },
    {
      id: "certificados-vencimento",
      nome: "Certificados Vencendo",
      descricao: "Lista de certificados que vencem em 30, 60 ou 90 dias",
      icone: Calendar
    },
    {
      id: "comissoes-pendentes",
      nome: "Comissões Pendentes",
      descricao: "Relatório de comissões a serem pagas para indicadores",
      icone: FileText
    },
    {
      id: "inadimplencia",
      nome: "Inadimplência",
      descricao: "Clientes com pagamentos em atraso",
      icone: FileText
    },
    {
      id: "pagamentos-certificadora",
      nome: "Pagamentos à Certificadora",
      descricao: "Status dos pagamentos pendentes à Segura Online",
      icone: FileText
    },
    {
      id: "vendas-indicador",
      nome: "Vendas por Indicador",
      descricao: "Performance de vendas por indicador",
      icone: TrendingUp
    }
  ];

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
          <p className="text-slate-600 mt-2">Gere relatórios detalhados do sistema</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Relatório</Label>
                  <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {relatoriosDisponiveis.map((relatorio) => (
                        <SelectItem key={relatorio.id} value={relatorio.id}>
                          {relatorio.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data Fim</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável (Opcional)</Label>
                  <Select value={responsavel} onValueChange={setResponsavel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os responsáveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joao">João Silva</SelectItem>
                      <SelectItem value="ana">Ana Costa</SelectItem>
                      <SelectItem value="carlos">Carlos Oliveira</SelectItem>
                      <SelectItem value="maria">Maria Santos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGerarRelatorio} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={!tipoRelatorio}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </Card>
          </div>

          {/* Lista de Relatórios */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Relatórios Disponíveis</h2>
              
              <div className="grid gap-4">
                {relatoriosDisponiveis.map((relatorio) => {
                  const IconComponent = relatorio.icone;
                  return (
                    <Card key={relatorio.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{relatorio.nome}</h3>
                            <p className="text-slate-600 text-sm">{relatorio.descricao}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setTipoRelatorio(relatorio.id)}
                        >
                          Selecionar
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Relatorios;
