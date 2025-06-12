
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Users, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const stats = [
    { title: "Vendas do Mês", value: "156", icon: TrendingUp, color: "bg-blue-500" },
    { title: "Certificados Ativos", value: "89", icon: Shield, color: "bg-green-500" },
    { title: "Indicadores", value: "23", icon: Users, color: "bg-purple-500" },
    { title: "Comissões Pendentes", value: "R$ 2.450", icon: FileText, color: "bg-orange-500" },
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
            onClick: handleLogout,
            icon: LogOut
          }
        ]}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Bem-vindo, {user?.email}! Gerencie seus certificados digitais
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Hero />
      </div>
    </Layout>
  );
};

export default Index;
