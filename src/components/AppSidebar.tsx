import { 
  LayoutDashboard, 
  ShoppingCart, 
  Calendar, 
  Users, 
  UserCircle, 
  Award, 
  Target, 
  DollarSign, 
  FileText,
  Receipt,
  LogOut,
  ChevronRight
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    group: "Principal",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ]
  },
  {
    group: "Vendas",
    items: [
      { title: "Vendas", url: "/vendas", icon: ShoppingCart },
      { title: "Comissões", url: "/comissoes", icon: DollarSign },
    ]
  },
  {
    group: "Financeiro",
    items: [
      { title: "Contas a Pagar", url: "/contas-a-pagar", icon: Receipt },
    ]
  },
  {
    group: "Cadastros",
    items: [
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Vendedores", url: "/vendedores", icon: UserCircle },
      { title: "Certificados", url: "/certificados", icon: Award },
      { title: "Indicadores", url: "/indicadores", icon: Target },
    ]
  },
  {
    group: "Operações",
    items: [
      { title: "Agendamentos", url: "/agendamentos", icon: Calendar },
      { title: "Relatórios", url: "/relatorios", icon: FileText },
    ]
  }
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {menuItems.map((section) => (
          <SidebarGroup key={section.group}>
            <SidebarGroupLabel>{section.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
