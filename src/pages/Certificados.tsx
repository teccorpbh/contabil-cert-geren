
import { useState } from "react";
import Layout from "@/components/Layout";
import AppNavigation from "@/components/AppNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Edit, Trash, AlertTriangle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCertificados } from "@/hooks/useCertificados";
import CertificadoModal from "@/components/CertificadoModal";

const Certificados = () => {
  const { toast } = useToast();
  const { certificados, createCertificado, updateCertificado, deleteCertificado, getCertificado } = useCertificados();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedCertificado, setSelectedCertificado] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Emitido": return "bg-green-100 text-green-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      case "Cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getVencimentoColor = (dias: number) => {
    if (dias < 0) return "bg-red-100 text-red-800";
    if (dias <= 30) return "bg-orange-100 text-orange-800";
    if (dias <= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const handleCreate = () => {
    setSelectedCertificado(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (id: string) => {
    const certificado = getCertificado(id);
    setSelectedCertificado(certificado);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const certificado = getCertificado(id);
    setSelectedCertificado(certificado);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCertificado(id);
    toast({
      title: "Certificado excluído",
      description: "O certificado foi excluído com sucesso."
    });
  };

  const handleSave = (certificadoData: any) => {
    if (modalMode === 'create') {
      createCertificado(certificadoData);
      toast({
        title: "Certificado criado",
        description: "O certificado foi criado com sucesso."
      });
    } else if (modalMode === 'edit' && selectedCertificado) {
      updateCertificado(selectedCertificado.id, certificadoData);
      toast({
        title: "Certificado atualizado",
        description: "O certificado foi atualizado com sucesso."
      });
    }
  };

  return (
    <Layout>
      <AppNavigation />

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Certificados</h1>
            <p className="text-slate-600 mt-2">Gerencie todos os certificados digitais emitidos</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Certificado
          </Button>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Venda</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificados.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.id}</TableCell>
                  <TableCell>{cert.tipo}</TableCell>
                  <TableCell>{cert.documento}</TableCell>
                  <TableCell>{cert.cliente}</TableCell>
                  <TableCell>{cert.validade}</TableCell>
                  <TableCell>
                    <Badge className={getVencimentoColor(cert.diasVencimento)}>
                      {cert.diasVencimento > 0 ? `${cert.diasVencimento} dias` : 
                       cert.diasVencimento === 0 ? "Hoje" : "Vencido"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{cert.vendaId}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(cert.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(cert.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este certificado? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(cert.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {cert.diasVencimento <= 30 && cert.status === "Emitido" && (
                        <Button size="sm" variant="outline" className="text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
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

      <CertificadoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        certificado={selectedCertificado}
        mode={modalMode}
      />
    </Layout>
  );
};

export default Certificados;
