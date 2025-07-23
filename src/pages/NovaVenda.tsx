
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PedidoData {
  success: boolean;
  timestamp: string;
  debug: {
    ultimo_status_pagamento?: string;
    documentos_ok?: boolean;
    [key: string]: any;
  };
  data: {
    numero_pedido: string;
    status_pedido: string;
    cliente: {
      nome?: string;
      razao_social?: string;
      cpf?: string;
      cnpj?: string;
    };
    produto: {
      nome: string;
      tipo: string;
      validade: string;
    };
    pagamento: {
      status: string;
      valor: number;
      historico: Array<{
        data: string;
        status: string;
        valor?: number;
      }>;
    };
    documentos: Array<{
      nome: string;
      status: string;
      data_envio?: string;
    }>;
    observacoes?: string;
  };
}

const NovaVenda = () => {
  const [pedidoSegura, setPedidoSegura] = useState("");
  const [valorVenda, setValorVenda] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [indicador, setIndicador] = useState("");
  const [pedidoData, setPedidoData] = useState<PedidoData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleBuscarPedido = async () => {
    if (!pedidoSegura.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o número do pedido",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // URL do webhook n8n - deve ser configurada conforme o ambiente
      const webhookUrl = process.env.VITE_N8N_WEBHOOK_URL || "https://your-n8n-webhook-url.com/webhook/consultar-pedido";
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_pedido: pedidoSegura
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data: PedidoData = await response.json();

      if (!data.success) {
        toast({
          title: "Pedido não encontrado",
          description: "Não foi possível obter os dados do pedido. Verifique o número informado.",
          variant: "destructive"
        });
        return;
      }

      setPedidoData(data);
      
      // Preencher automaticamente alguns campos
      if (data.data.cliente.nome || data.data.cliente.razao_social) {
        // Aqui você pode preencher outros campos automaticamente se necessário
      }
      
      if (data.data.pagamento.valor) {
        setValorVenda(`R$ ${data.data.pagamento.valor.toFixed(2).replace('.', ',')}`);
      }

      toast({
        title: "Sucesso",
        description: "Dados do pedido carregados com sucesso!",
      });

    } catch (error: any) {
      console.error('Erro ao buscar pedido:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao sistema da Segura Online. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarVenda = () => {
    console.log("Salvando venda...");
    // Aqui seria feita a criação da venda
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Nova Venda</h1>
            <p className="text-slate-600 mt-2">Registre uma nova venda de certificado digital</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Pedido Segura Online */}
              <div className="space-y-2">
                <Label htmlFor="pedido">Número do Pedido (Segura Online)</Label>
                <div className="flex gap-2">
                  <Input
                    id="pedido"
                    placeholder="Ex: SG123456"
                    value={pedidoSegura}
                    onChange={(e) => setPedidoSegura(e.target.value)}
                  />
                  <Button onClick={handleBuscarPedido} variant="outline" disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                <p className="text-sm text-slate-500">
                  Insira o número do pedido para buscar automaticamente os dados na Segura Online
                </p>
              </div>

              {/* Valor da Venda */}
              <div className="space-y-2">
                <Label htmlFor="valor">Valor da Venda</Label>
                <Input
                  id="valor"
                  placeholder="R$ 0,00"
                  value={valorVenda}
                  onChange={(e) => setValorVenda(e.target.value)}
                />
              </div>

              {/* Responsável pela Venda */}
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável pela Venda</Label>
                <Select value={responsavel} onValueChange={setResponsavel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joao">João Silva</SelectItem>
                    <SelectItem value="ana">Ana Costa</SelectItem>
                    <SelectItem value="carlos">Carlos Oliveira</SelectItem>
                    <SelectItem value="maria">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Indicador */}
              <div className="space-y-2">
                <Label htmlFor="indicador">Indicador (Opcional)</Label>
                <Select value={indicador} onValueChange={setIndicador}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o indicador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maria">Maria Santos</SelectItem>
                    <SelectItem value="pedro">Pedro Lima</SelectItem>
                    <SelectItem value="lucas">Lucas Ferreira</SelectItem>
                    <SelectItem value="patricia">Patrícia Rocha</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dados do Certificado (preenchidos automaticamente) */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Dados do Certificado {pedidoData ? "(Carregados automaticamente)" : "(Preenchido automaticamente)"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Certificado</Label>
                    <Input 
                      value={pedidoData?.data.produto.tipo || ""} 
                      placeholder="A1 - Pessoa Física" 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF/CNPJ</Label>
                    <Input 
                      value={pedidoData?.data.cliente.cpf || pedidoData?.data.cliente.cnpj || ""} 
                      placeholder="000.000.000-00" 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Validade</Label>
                    <Input 
                      value={pedidoData?.data.produto.validade || ""} 
                      placeholder="1 ano" 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Input 
                      value={pedidoData?.data.status_pedido || ""} 
                      placeholder="Pendente" 
                      disabled 
                    />
                  </div>
                </div>
              </div>

              {/* Informações do Cliente (quando dados são carregados) */}
              {pedidoData && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Informações do Cliente
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cliente</Label>
                      <Input 
                        value={pedidoData.data.cliente.nome || pedidoData.data.cliente.razao_social || ""} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status do Pagamento</Label>
                      <Input 
                        value={pedidoData.data.pagamento.status || ""} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Produto</Label>
                      <Input 
                        value={pedidoData.data.produto.nome || ""} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Número do Pedido</Label>
                      <Input 
                        value={pedidoData.data.numero_pedido || ""} 
                        disabled 
                      />
                    </div>
                  </div>

                  {/* Documentos */}
                  {pedidoData.data.documentos && pedidoData.data.documentos.length > 0 && (
                    <div className="mt-6">
                      <Label className="text-sm font-medium">Documentos Enviados</Label>
                      <div className="mt-2 space-y-2">
                        {pedidoData.data.documentos.map((doc, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm">{doc.nome}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              doc.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                              doc.status === 'rejeitado' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doc.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Histórico de Pagamento */}
                  {pedidoData.data.pagamento.historico && pedidoData.data.pagamento.historico.length > 0 && (
                    <div className="mt-6">
                      <Label className="text-sm font-medium">Histórico de Pagamento</Label>
                      <div className="mt-2 space-y-2">
                        {pedidoData.data.pagamento.historico.map((hist, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <div>
                              <span className="text-sm font-medium">{hist.status}</span>
                              <span className="text-xs text-slate-500 ml-2">{hist.data}</span>
                            </div>
                            {hist.valor && (
                              <span className="text-sm font-medium">
                                R$ {hist.valor.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  {pedidoData.data.observacoes && (
                    <div className="mt-6">
                      <Label className="text-sm font-medium">Observações</Label>
                      <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-700">{pedidoData.data.observacoes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button onClick={handleSalvarVenda} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Venda
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NovaVenda;
