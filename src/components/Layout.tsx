
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className = "" }: LayoutProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}>
      {children}
    </div>
  );
};

export default Layout;
