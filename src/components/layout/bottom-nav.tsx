"use client";

import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  MoreHorizontal,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const mainItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/rutas", label: "Rutas", icon: MapPin },
  { href: "/reportes/semanal", label: "Reporte", icon: FileText },
];

const moreItems = [
  { href: "/importar", label: "Importar", icon: Upload },
  { href: "/configuracion/zonas", label: "Zonas", icon: Settings },
  { href: "/api/auth/logout", label: "Cerrar sesión", icon: LogOut, isPost: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-zinc-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1 text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <button
              className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1 text-[11px] font-medium transition-colors ${
                pathname.startsWith("/importar") || pathname.startsWith("/configuracion")
                  ? "text-blue-600"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="truncate">Más</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[50vh] rounded-t-xl">
            <div className="space-y-1 py-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                if (item.isPost) {
                  return (
                    <form key={item.href} action={item.href} method="post" className="w-full">
                      <button
                        type="submit"
                        className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium text-zinc-700 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    </form>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
