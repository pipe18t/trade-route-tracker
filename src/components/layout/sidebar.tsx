import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/rutas", label: "Rutas", icon: MapPin },
  { href: "/reportes/semanal", label: "Reportes", icon: FileText },
  { href: "/importar", label: "Importar", icon: Upload },
  { href: "/configuracion/zonas", label: "Zonas", icon: Settings },
];

interface SidebarProps {
  userEmail?: string;
  userName?: string;
}

export function Sidebar({ userEmail, userName }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-zinc-900 text-white">
      <div className="flex items-center h-16 px-6 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-400" />
          <span className="font-bold text-lg">TradeRoute</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pt-4">
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium">
            {userName?.charAt(0) || userEmail?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {userName || "Usuario"}
            </p>
            <p className="text-xs text-zinc-400 truncate">{userEmail}</p>
          </div>
        </div>
        <form action="/api/auth/logout" method="post">
          <Button
            variant="ghost"
            type="submit"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800 mt-1"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </form>
      </div>
    </aside>
  );
}
