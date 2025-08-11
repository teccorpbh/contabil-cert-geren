
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Eye, Edit, ArrowLeft, ExternalLink } from "lucide-react";
import { useVendas } from "@/hooks/useVendas";
import { useComissoes } from "@/hooks/useComissoes";
import { useCertificados } from "@/hooks/useCertificados";
import VendaModal from "@/components/VendaModal";
import ComissaoModal from "@/components/ComissaoModal";
import CertificadoModal from "@/components/CertificadoModal";

const formatStatusBadge = (status: string) => {
  switch (status) {
    case "Emitido":
    case "Pago":
      return "bg-green-100 text-green-800";
    case "Pendente":
      return "bg-yellow-100 text-yellow-800";
    case "Vencido":
    case "Cancelado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const VendaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vendas, getVenda, updateVenda } = useVendas();
  const { comissoes } = useComissoes();
  const { certificados } = useCertificados();

  const [vendaModalOpen, setVendaModalOpen] = useState(false);
  const [comissaoModalOpen, setComissaoModalOpen] = useState(false);
  const [certificadoModalOpen, setCertificadoModalOpen] = useState(false);
  const [selectedComissaoId, setSelectedComissaoId] = useState<string | null>(null);

  const venda = useMemo(() => (id ? getVenda(id) : undefined), [id, vendas]);
  const comissoesDaVenda = useMemo(() => comissoes.filter(c => c.vendaId === id), [comissoes, id]);
  const certificadoDaVenda = useMemo(() => certificados.find(c => c.vendaId === id), [certificados, id]);

  // Basic SEO tags without extra deps
  useEffect(() => {
    const title = venda
      ? `Venda ${venda.pedidoSegura} – Detalhes, Certificado e Comissões`
      : "Detalhes da Venda";
    document.title = title;

    const desc = venda
      ? `Detalhes completos da venda ${venda.pedidoSegura}: valores, status, comissões e certificado.`
      : "Visualize detalhes da venda, comissões geradas e certificado.";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
  }, [venda]);

  const handleSaveVenda = (data: any) => {
    if (!venda) return;
    updateVenda(venda.id, data);
    setVendaModalOpen(false);
  };

  if (!id) return null;

  return (
    <Layout>
      <AppNavigation />
      <header className="container mx-auto px-6 pt-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <h1 className="text-3xl font-bold text-slate-900">Detalhes da Venda</h1>
        <p className="text-slate-600 mt-2">
          Visualize informações completas da venda, comissões geradas e certificado.
        </p>
      </header>

      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* Resumo da venda */}
        <section>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Resumo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Pedido Segura</p>
                    <p className="font-medium">{venda?.pedidoSegura || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Cliente</p>
                    <p className="font-medium">{venda?.cliente || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Responsável</p>
                    <p className="font-medium">{venda?.responsavel || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Valor</p>
                    <p className="font-medium">{venda?.valor || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Indicador</p>
                    <p className="font-medium">{venda?.indicador || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Data</p>
                    <p className="font-medium">{venda?.data || "-"}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[220px]">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Status</span>
                  <Badge className={formatStatusBadge(venda?.status || "")}>{venda?.status}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Pagamento</span>
                  <Badge className={formatStatusBadge(venda?.statusPagamento || "")}>{venda?.statusPagamento}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Vencimento</span>
                  <span className="font-medium">{venda?.dataVencimento || "-"}</span>
                </div>
                <Button variant="outline" onClick={() => setVendaModalOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" /> Editar venda
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <Separator />

        {/* Comissões da venda */}
        <section aria-labelledby="comissoes-title">
          <div className="flex items-center justify-between mb-3">
            <h2 id="comissoes-title" className="text-xl font-semibold">Comissões</h2>
            <Link to="/comissoes" className="text-indigo-600 hover:underline inline-flex items-center">
              Ver todas <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Beneficiário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Percentual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comissoesDaVenda.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-6">
                      Nenhuma comissão gerada para esta venda.
                    </TableCell>
                  </TableRow>
                )}
                {comissoesDaVenda.map((c) => {
                  const tipo = c.indicadorId ? "Indicador" : c.vendedorId ? "Vendedor" : "-";
                  const beneficiario = c.indicador || c.vendedor || "-";
                  return (
                    <TableRow key={c.id}>
                      <TableCell>{tipo}</TableCell>
                      <TableCell className="font-medium">{beneficiario}</TableCell>
                      <TableCell>{c.valor}</TableCell>
                      <TableCell>{c.percentual}</TableCell>
                      <TableCell>
                        <Badge className={formatStatusBadge(c.status)}>{c.status}</Badge>
                      </TableCell>
                      <TableCell>{c.dataPagamento || '-'}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedComissaoId(c.id); setComissaoModalOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* Certificado da venda */}
        <section aria-labelledby="certificado-title">
          <div className="flex items-center justify-between mb-3 mt-6">
            <h2 id="certificado-title" className="text-xl font-semibold">Certificado</h2>
            <Link to="/certificados" className="text-indigo-600 hover:underline inline-flex items-center">
              Ver todos <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <Card className="p-6">
            {!certificadoDaVenda ? (
              <p className="text-slate-500">Nenhum certificado gerado para esta venda.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Tipo</p>
                  <p className="font-medium">{certificadoDaVenda.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Documento</p>
                  <p className="font-medium">{certificadoDaVenda.documento}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Cliente</p>
                  <p className="font-medium">{certificadoDaVenda.cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Validade</p>
                  <p className="font-medium">{certificadoDaVenda.validade}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge className={formatStatusBadge(certificadoDaVenda.status)}>{certificadoDaVenda.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Dias p/ Vencer</p>
                  <p className="font-medium">{certificadoDaVenda.diasVencimento}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <Button variant="outline" onClick={() => setCertificadoModalOpen(true)}>
                    <Eye className="h-4 w-4 mr-2" /> Visualizar certificado
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </section>
      </main>

      {/* Modais */}
      {venda && (
        <VendaModal
          isOpen={vendaModalOpen}
          onClose={() => setVendaModalOpen(false)}
          onSave={handleSaveVenda}
          venda={venda}
          mode="edit"
        />
      )}

      {selectedComissaoId && (
        <ComissaoModal
          isOpen={comissaoModalOpen}
          onClose={() => setComissaoModalOpen(false)}
          onSave={() => setComissaoModalOpen(false)}
          comissao={comissoesDaVenda.find(c => c.id === selectedComissaoId)}
          mode="view"
        />
      )}

      {certificadoDaVenda && (
        <CertificadoModal
          isOpen={certificadoModalOpen}
          onClose={() => setCertificadoModalOpen(false)}
          onSave={() => setCertificadoModalOpen(false)}
          certificado={certificadoDaVenda}
          mode="view"
        />
      )}
    </Layout>
  );
};

export default VendaDetalhe;
