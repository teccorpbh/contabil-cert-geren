
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NavigationProps {
  brand?: {
    name: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  items?: NavigationItem[];
  actions?: NavigationItem[];
}

const Navigation = ({ 
  brand = { name: "Seu Projeto", icon: Sparkles },
  items = [{ label: "Sobre" }],
  actions = [{ label: "Começar" }]
}: NavigationProps) => {
  const IconComponent = brand.icon || Sparkles;

  return (
    <header className="container mx-auto px-6 py-8">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <IconComponent className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-slate-900">{brand.name}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {items.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="text-slate-600 hover:text-slate-900"
              onClick={item.onClick}
              asChild={!!item.href}
            >
              {item.href ? <a href={item.href}>{item.label}</a> : item.label}
            </Button>
          ))}
          
          {actions.map((action, index) => (
            <Button
              key={index}
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={action.onClick}
              asChild={!!action.href}
            >
              {action.href ? <a href={action.href}>{action.label}</a> : action.label}
            </Button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
