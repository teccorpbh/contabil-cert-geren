import { Button } from "@/components/ui/button";
import { FileText, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AppNavigation = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="container mx-auto px-6 py-8">
      <nav className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-slate-900">Contabilcert</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            asChild
          >
            <Link to="/">Dashboard</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            asChild
          >
            <Link to="/vendas">Vendas</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            asChild
          >
            <Link to="/vendedores">Vendedores</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            asChild
          >
            <Link to="/clientes">Clientes</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            asChild
          >
            <Link to="/certificados">Certificados</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            asChild
          >
            <Link to="/indicadores">Indicadores</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            asChild
          >
            <Link to="/comissoes">Comissões</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            asChild
          >
            <Link to="/relatorios">Relatórios</Link>
          </Button>
          
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            asChild
          >
            <Link to="/vendas/nova">Nova Venda</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default AppNavigation;