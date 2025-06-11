
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, Search } from "lucide-react";
import { useState } from "react";

const NovaVenda = () => {
  const [pedidoSegura, setPedidoSegura] = useState("");
  const [valorVenda, setValorVenda] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [indicador, setIndicador] = useState("");

  const handleBuscarPedido = () => {
    console.log("Buscando pedido na Segura Online:", pedidoSegura);
    // Aqui seria feita a integração com n8n para buscar dados do pedido
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
          { label: "Dashboard" },
          { label: "Vendas" },
          { label: "Certificados" },
          { label: "Comissões" },
          { label: "Relatórios" }
        ]}
        actions={[{ label: "Nova Venda" }]}
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
                  <Button onClick={handleBuscarPedido} variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
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
                  Dados do Certificado (Preenchido automaticamente)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Certificado</Label>
                    <Input placeholder="A1 - Pessoa Física" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF/CNPJ</Label>
                    <Input placeholder="000.000.000-00" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Validade</Label>
                    <Input placeholder="1 ano" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Input placeholder="Pendente" disabled />
                  </div>
                </div>
              </div>

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
