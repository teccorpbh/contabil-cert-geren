import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showSidebar?: boolean;
}

const Layout = ({ children, className = "", showSidebar = true }: LayoutProps) => {
  if (!showSidebar) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <AppSidebar />
        <main className={`flex-1 ${className}`}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
