
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Vendas from "./pages/Vendas";
import VendaDetalhe from "./pages/VendaDetalhe";
import Agendamentos from "./pages/Agendamentos";
import NovaVenda from "./pages/NovaVenda";
import Vendedores from "./pages/Vendedores";
import Clientes from "./pages/Clientes";
import Certificados from "./pages/Certificados";
import Indicadores from "./pages/Indicadores";
import Comissoes from "./pages/Comissoes";
import Relatorios from "./pages/Relatorios";
import ContasAPagar from "./pages/ContasAPagar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/vendas" element={
              <ProtectedRoute>
                <Vendas />
              </ProtectedRoute>
            } />
            <Route path="/vendas/nova" element={
              <ProtectedRoute>
                <NovaVenda />
              </ProtectedRoute>
            } />
            <Route path="/vendas/:id" element={
              <ProtectedRoute>
                <VendaDetalhe />
              </ProtectedRoute>
            } />
            <Route path="/agendamentos" element={
              <ProtectedRoute>
                <Agendamentos />
              </ProtectedRoute>
            } />
            <Route path="/vendedores" element={
              <ProtectedRoute>
                <Vendedores />
              </ProtectedRoute>
            } />
            <Route path="/clientes" element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            } />
            <Route path="/certificados" element={
              <ProtectedRoute>
                <Certificados />
              </ProtectedRoute>
            } />
            <Route path="/indicadores" element={
              <ProtectedRoute>
                <Indicadores />
              </ProtectedRoute>
            } />
            <Route path="/comissoes" element={
              <ProtectedRoute>
                <Comissoes />
              </ProtectedRoute>
            } />
            <Route path="/relatorios" element={
              <ProtectedRoute>
                <Relatorios />
              </ProtectedRoute>
            } />
            <Route path="/contas-a-pagar" element={
              <ProtectedRoute>
                <ContasAPagar />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
