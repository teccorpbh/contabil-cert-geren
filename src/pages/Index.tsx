
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, TrendingUp, AlertTriangle, DollarSign, Calendar } from "lucide-react";

const Index = () => {
  const handleNovaVenda = () => {
    console.log("Nova venda");
  };

  const handleRelatorios = () => {
    console.log("Relatórios");
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
        actions={[{ label: "Nova Venda", onClick: handleNovaVenda }]}
      />
      
      <Hero
        title="Sistema de Gerenciamento"
        subtitle="Certificados Digitais"
        description="Gerencie vendas, certificados, comissões e pagamentos de forma integrada e automatizada."
        primaryAction={{
          text: "Nova Venda",
          onClick: handleNovaVenda
        }}
        secondaryAction={{
          text: "Ver Relatórios",
          onClick: handleRelatorios
        }}
      />

      {/* Dashboard Metrics */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Dashboard</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Vendas */}
          <Card className="p-6 border-none shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-800">Este mês</Badge>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">156</h3>
            <p className="text-slate-600">Vendas realizadas</p>
          </Card>

          {/* Certificados Vencendo */}
          <Card className="p-6 border-none shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-800">30 dias</Badge>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">23</h3>
            <p className="text-slate-600">Certificados vencendo</p>
          </Card>

          {/* Comissões Pendentes */}
          <Card className="p-6 border-none shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-800">Pendente</Badge>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">R$ 8.450</h3>
            <p className="text-slate-600">Comissões a pagar</p>
          </Card>

          {/* Pagamentos Pendentes */}
          <Card className="p-6 border-none shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <Badge className="bg-red-100 text-red-800">Atrasado</Badge>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">R$ 12.300</h3>
            <p className="text-slate-600">Pagamentos em atraso</p>
          </Card>

          {/* Clientes */}
          <Card className="p-6 border-none shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-800">Total</Badge>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">1.247</h3>
            <p className="text-slate-600">Clientes cadastrados</p>
          </Card>

          {/* NFSe Emitidas */}
          <Card className="p-6 border-none shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <Badge className="bg-indigo-100 text-indigo-800">Este mês</Badge>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">142</h3>
            <p className="text-slate-600">NFSe emitidas</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Ações Rápidas</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-16 flex-col gap-2" variant="outline">
              <TrendingUp className="h-5 w-5" />
              Nova Venda
            </Button>
            <Button className="h-16 flex-col gap-2" variant="outline">
              <FileText className="h-5 w-5" />
              Emitir Cobrança
            </Button>
            <Button className="h-16 flex-col gap-2" variant="outline">
              <DollarSign className="h-5 w-5" />
              Pagar Certificadora
            </Button>
            <Button className="h-16 flex-col gap-2" variant="outline">
              <Calendar className="h-5 w-5" />
              Relatórios
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-20">
        <div className="text-center text-slate-500">
          <p>&copy; 2024 Contabilcert. Sistema de Gerenciamento de Certificados Digitais.</p>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
