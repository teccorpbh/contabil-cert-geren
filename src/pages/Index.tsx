
import { useState } from "react";
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, DollarSign, Award, TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const stats = [
    {
      title: "Vendas do Mês",
      value: "R$ 45.000",
      icon: DollarSign,
      trend: "+12%",
      color: "text-green-600"
    },
    {
      title: "Certificados Emitidos",
      value: "156",
      icon: Award,
      trend: "+8%",
      color: "text-blue-600"
    },
    {
      title: "Indicadores Ativos",
      value: "24",
      icon: Users,
      trend: "+5%",
      color: "text-purple-600"
    },
    {
      title: "Comissões Pendentes",
      value: "R$ 8.500",
      icon: TrendingUp,
      trend: "-3%",
      color: "text-orange-600"
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
          { label: "Indicadores", href: "/indicadores" },
          { label: "Comissões", href: "/comissoes" },
          { label: "Relatórios", href: "/relatorios" }
        ]}
        actions={[
          { label: "Nova Venda", href: "/vendas/nova" },
          { 
            label: "Sair", 
            onClick: handleSignOut
          }
        ]}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bem-vindo, {user?.email}!
          </h1>
          <p className="text-slate-600">
            Aqui está um resumo das suas atividades recentes
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className={`text-sm ${stat.color} mt-1`}>
                      {stat.trend} vs mês anterior
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-slate-100`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start bg-indigo-600 hover:bg-indigo-700" 
                onClick={() => navigate('/vendas/nova')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Nova Venda
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/indicadores')}
              >
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Indicadores
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/relatorios')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Relatórios
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Atividade Recente
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Venda SG123456</span>
                <span className="text-green-600 font-medium">Emitido</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Comissão Maria Santos</span>
                <span className="text-orange-600 font-medium">Pendente</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Certificado João Silva</span>
                <span className="text-blue-600 font-medium">Processando</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Alertas
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">3 certificados vencem em 7 dias</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">2 pagamentos em atraso</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
