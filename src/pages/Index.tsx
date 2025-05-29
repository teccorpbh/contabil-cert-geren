
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-slate-900">Seu Projeto</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              Sobre
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Começar
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Bem-vindo ao seu
            <span className="text-indigo-600 block">Projeto em Branco</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Este é o ponto de partida perfeito para criar algo incrível. 
            Comece a personalizar e construir sua aplicação dos sonhos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-4">
              Começar a Construir
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              Ver Exemplos
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <Card className="p-8 border-none shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Moderno</h3>
              <p className="text-slate-600">
                Construído com as tecnologias mais recentes: React, TypeScript e Tailwind CSS.
              </p>
            </Card>

            <Card className="p-8 border-none shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <ArrowRight className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Responsivo</h3>
              <p className="text-slate-600">
                Design que funciona perfeitamente em todos os dispositivos e tamanhos de tela.
              </p>
            </Card>

            <Card className="p-8 border-none shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Customizável</h3>
              <p className="text-slate-600">
                Fácil de personalizar e estender com componentes reutilizáveis.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-20">
        <div className="text-center text-slate-500">
          <p>&copy; 2024 Seu Projeto. Feito com ❤️ usando Lovable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
