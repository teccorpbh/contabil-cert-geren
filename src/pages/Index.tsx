import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, DollarSign, Award, TrendingUp, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  vendasMes: number;
  vendasMesAnterior: number;
  certificadosEmitidosMes: number;
  certificadosMesAnterior: number;
  indicadoresAtivos: number;
  comissoesPendentes: number;
  certificadosVencendo: number;
  contasVencidas: number;
  atividadesRecentes: Array<{
    descricao: string;
    status: string;
    statusColor: string;
  }>;
}

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    vendasMes: 0,
    vendasMesAnterior: 0,
    certificadosEmitidosMes: 0,
    certificadosMesAnterior: 0,
    indicadoresAtivos: 0,
    comissoesPendentes: 0,
    certificadosVencendo: 0,
    contasVencidas: 0,
    atividadesRecentes: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const inicioMesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const fimMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

      // Buscar todas as métricas em paralelo
      const [
        vendasMesResult,
        vendasMesAnteriorResult,
        certificadosMesResult,
        certificadosMesAnteriorResult,
        indicadoresResult,
        comissoesResult,
        certificadosVencendoResult,
        contasVencidasResult,
        vendasRecentesResult,
        comissoesRecentesResult
      ] = await Promise.all([
        // Vendas do mês atual
        supabase
          .from('vendas')
          .select('valor')
          .gte('data', inicioMes),
        
        // Vendas do mês anterior
        supabase
          .from('vendas')
          .select('valor')
          .gte('data', inicioMesAnterior)
          .lte('data', fimMesAnterior),
        
        // Certificados emitidos no mês
        supabase
          .from('certificados')
          .select('id')
          .eq('status', 'Emitido')
          .gte('created_at', inicioMes),
        
        // Certificados emitidos mês anterior
        supabase
          .from('certificados')
          .select('id')
          .eq('status', 'Emitido')
          .gte('created_at', inicioMesAnterior)
          .lte('created_at', fimMesAnterior),
        
        // Indicadores ativos
        supabase
          .from('indicadores')
          .select('id')
          .eq('status', 'Ativo'),
        
        // Comissões pendentes
        supabase
          .from('comissoes')
          .select('valor')
          .eq('status', 'Pendente'),
        
        // Certificados vencendo em 7 dias
        supabase
          .from('certificados')
          .select('id, dias_vencimento')
          .lte('dias_vencimento', 7)
          .gt('dias_vencimento', 0),
        
        // Contas vencidas
        supabase
          .from('contas_a_pagar')
          .select('id')
          .eq('status', 'Vencido'),
        
        // Vendas recentes
        supabase
          .from('vendas')
          .select('pedido_segura, status, cliente')
          .order('created_at', { ascending: false })
          .limit(3),
        
        // Comissões recentes
        supabase
          .from('comissoes')
          .select('id, status, indicadores(nome), vendedores(nome)')
          .order('created_at', { ascending: false })
          .limit(2)
      ]);

      // Calcular totais
      const vendasMes = vendasMesResult.data?.reduce((sum, v) => sum + (Number(v.valor) || 0), 0) || 0;
      const vendasMesAnterior = vendasMesAnteriorResult.data?.reduce((sum, v) => sum + (Number(v.valor) || 0), 0) || 0;
      const certificadosEmitidosMes = certificadosMesResult.data?.length || 0;
      const certificadosMesAnterior = certificadosMesAnteriorResult.data?.length || 0;
      const indicadoresAtivos = indicadoresResult.data?.length || 0;
      const comissoesPendentes = comissoesResult.data?.reduce((sum, c) => sum + (Number(c.valor) || 0), 0) || 0;
      const certificadosVencendo = certificadosVencendoResult.data?.length || 0;
      const contasVencidas = contasVencidasResult.data?.length || 0;

      // Montar atividades recentes
      const atividadesRecentes: DashboardStats['atividadesRecentes'] = [];
      
      vendasRecentesResult.data?.forEach(venda => {
        const statusColor = venda.status === 'Emitido' ? 'text-green-600' : 
                           venda.status === 'Cancelado' ? 'text-red-600' : 'text-orange-600';
        atividadesRecentes.push({
          descricao: `Venda ${venda.pedido_segura}`,
          status: venda.status,
          statusColor
        });
      });

      comissoesRecentesResult.data?.forEach(comissao => {
        const nome = (comissao.indicadores as any)?.nome || (comissao.vendedores as any)?.nome || 'N/A';
        const statusColor = comissao.status === 'Paga' ? 'text-green-600' : 
                           comissao.status === 'A Receber' ? 'text-blue-600' : 'text-orange-600';
        atividadesRecentes.push({
          descricao: `Comissão ${nome}`,
          status: comissao.status,
          statusColor
        });
      });

      setStats({
        vendasMes,
        vendasMesAnterior,
        certificadosEmitidosMes,
        certificadosMesAnterior,
        indicadoresAtivos,
        comissoesPendentes,
        certificadosVencendo,
        contasVencidas,
        atividadesRecentes: atividadesRecentes.slice(0, 5)
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularVariacao = (atual: number, anterior: number): string => {
    if (anterior === 0) {
      return atual > 0 ? '+100%' : '0%';
    }
    const variacao = ((atual - anterior) / anterior) * 100;
    const sinal = variacao >= 0 ? '+' : '';
    return `${sinal}${variacao.toFixed(0)}%`;
  };

  const statsCards = [
    {
      title: "Vendas do Mês",
      value: formatCurrency(stats.vendasMes),
      icon: DollarSign,
      trend: calcularVariacao(stats.vendasMes, stats.vendasMesAnterior),
      color: "text-green-600"
    },
    {
      title: "Certificados Emitidos",
      value: stats.certificadosEmitidosMes.toString(),
      icon: Award,
      trend: calcularVariacao(stats.certificadosEmitidosMes, stats.certificadosMesAnterior),
      color: "text-blue-600"
    },
    {
      title: "Indicadores Ativos",
      value: stats.indicadoresAtivos.toString(),
      icon: Users,
      trend: "",
      color: "text-purple-600"
    },
    {
      title: "Comissões Pendentes",
      value: formatCurrency(stats.comissoesPendentes),
      icon: TrendingUp,
      trend: "",
      color: "text-orange-600"
    }
  ];

  return (
    <Layout>
      <AppNavigation />
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
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              </Card>
            ))
          ) : (
            statsCards.map((stat, index) => {
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
                      {stat.trend && (
                        <p className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'text-slate-500'} mt-1`}>
                          {stat.trend} vs mês anterior
                        </p>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg bg-slate-100`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
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
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                </div>
              ) : stats.atividadesRecentes.length > 0 ? (
                stats.atividadesRecentes.map((atividade, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-600 truncate">{atividade.descricao}</span>
                    <span className={`${atividade.statusColor} font-medium ml-2`}>{atividade.status}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-2">Nenhuma atividade recente</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Alertas
            </h3>
            <div className="space-y-3 text-sm">
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                </div>
              ) : (
                <>
                  {stats.certificadosVencendo > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <p className="text-yellow-800 font-medium">
                        {stats.certificadosVencendo} certificado{stats.certificadosVencendo > 1 ? 's' : ''} vence{stats.certificadosVencendo > 1 ? 'm' : ''} em 7 dias
                      </p>
                    </div>
                  )}
                  {stats.contasVencidas > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-red-800 font-medium">
                        {stats.contasVencidas} pagamento{stats.contasVencidas > 1 ? 's' : ''} em atraso
                      </p>
                    </div>
                  )}
                  {stats.certificadosVencendo === 0 && stats.contasVencidas === 0 && (
                    <p className="text-slate-500 text-center py-2">Nenhum alerta no momento</p>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
