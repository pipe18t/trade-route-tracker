import { verifySession } from "@/lib/dals";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Menu, LogOut, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/clientes", label: "Clientes" },
  { href: "/rutas", label: "Rutas" },
  { href: "/reportes/semanal", label: "Reportes" },
  { href: "/importar", label: "Importar" },
  { href: "/configuracion/zonas", label: "Zonas" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await verifySession();

  return (
    <div className="min-h-screen">
      <Sidebar userEmail={profile.email || undefined} userName={profile.full_name || undefined} />

      {/* Header mobile */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-zinc-900 text-white flex items-center justify-between px-4 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          <span className="font-bold">TradeRoute</span>
        </Link>
        <Sheet>
          <SheetTrigger>
            <span className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-white hover:bg-zinc-800")}>
              <Menu className="h-5 w-5" />
            </span>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-zinc-900 text-white border-zinc-800">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 py-4">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="font-bold">TradeRoute</span>
              </div>
              <Separator className="bg-zinc-800" />
              <nav className="flex-1 space-y-1 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Separator className="bg-zinc-800" />
              <div className="py-4">
                <p className="text-sm font-medium px-3">{profile.full_name || "Usuario"}</p>
                <p className="text-xs text-zinc-400 px-3 truncate">{profile.email}</p>
                <form action="/api/auth/logout" method="post" className="mt-2">
                  <Button
                    variant="ghost"
                    type="submit"
                    className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </form>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="pt-14 md:pt-0 pb-20 md:pb-0">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
