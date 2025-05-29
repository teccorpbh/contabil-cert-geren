
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

const Hero = ({ 
  title, 
  subtitle, 
  description, 
  primaryAction, 
  secondaryAction, 
  children 
}: HeroProps) => {
  return (
    <section className="container mx-auto px-6 py-16 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          {title}
          {subtitle && (
            <span className="text-indigo-600 block">{subtitle}</span>
          )}
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {primaryAction && (
              <Button 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-4"
                onClick={primaryAction.onClick}
              >
                {primaryAction.text}
              </Button>
            )}
            {secondaryAction && (
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.text}
              </Button>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
};

export default Hero;
