import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AppNavigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <SidebarTrigger className="mr-4" />
        
        <Link to="/" className="flex items-center space-x-2 mr-auto">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Contabilcert</span>
        </Link>
        
        <Button
          className="bg-primary hover:bg-primary/90"
          asChild
        >
          <Link to="/vendas/nova">
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default AppNavigation;