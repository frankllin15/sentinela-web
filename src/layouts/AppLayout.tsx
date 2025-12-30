import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import {
  Home,
  Search,
  Bell,
  Menu,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ThemeToggleMobile } from "@/components/theme/ThemeToggleMobile";

// UI Components
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/types/auth.types";

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso");
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-border shadow-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Zone A - Brand (Left) */}
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <Link to={ROUTES.HOME}>
              {/* <div className="flex items-center justify-center w-10 h-10 bg-blue-700 rounded-lg shadow-lg shadow-blue-900/50"> */}
              <img
                src="/logo.png"
                alt="Sentinela Logo"
                className="w-12 h-12 object-contain"
              />
              {/* <Shield className="w-6 h-6 text-white" /> */}
              {/* </div> */}
            </Link>

            {/* Brand Text - Hide subtitle on mobile */}
            <Link to={ROUTES.HOME}>
              <div className="flex flex-col">
                <h1 className="text-white font-bold text-sm lg:text-base uppercase tracking-wide leading-tight">
                  SENTINELA
                </h1>
                <span className="hidden lg:block text-slate-400 text-[10px] uppercase tracking-widest leading-tight">
                  Sistema Integrado
                </span>
              </div>
            </Link>
          </div>

          {/* Zone B - Navigation (Desktop Only) */}
          <nav className="hidden lg:flex items-center gap-1 ml-8">
            {/* <NavLink
              to={ROUTES.HOME}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
                  isActive
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )
              }
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Início</span>
            </NavLink> */}

            <NavLink
              to={ROUTES.SEARCH}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
                  isActive
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white bg-slate-800/30 hover:bg-slate-800/50"
                )
              }
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Buscar indivíduos</span>
            </NavLink>
          </nav>

          {/* Zone C - Actions & Profile (Right) */}
          <div className="flex items-center gap-3">
            {/* Quick Search - Desktop Only - UI placeholder */}
            {/* <div className="hidden lg:block">
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-48 h-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:w-64 transition-all duration-200 focus:ring-blue-500"
                disabled
              />
            </div> */}

            {/* Theme Toggle - Desktop */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {/* Notifications Bell - UI placeholder */}
            <button
              className="relative p-2 text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Vertical Separator - Desktop Only */}
            <Separator
              orientation="vertical"
              className="hidden lg:block h-8 bg-slate-700"
            />

            {/* Profile Dropdown - Desktop Only */}
            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="Menu principal"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="top" className="bg-card border-border">
          {/* User Header */}
          {user && (
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="text-foreground font-medium text-base">
                  {user.name || user.email}
                </span>
                <span className="text-sm">
                  <span className="text-primary">{formatRole(user.role)}</span>
                  {user.forceName && (
                    <>
                      <span className="text-muted-foreground mx-1">•</span>
                      <span className="text-muted-foreground">{user.forceName}</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col py-4">
            <NavLink
              to={ROUTES.HOME}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-4 text-base transition-colors duration-200",
                  isActive
                    ? "text-accent-foreground bg-accent border-l-4 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                )
              }
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Início</span>
            </NavLink>

            <NavLink
              to={ROUTES.SEARCH}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-4 text-base transition-colors duration-200",
                  isActive
                    ? "text-accent-foreground bg-accent border-l-4 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                )
              }
            >
              <Search className="w-5 h-5" />
              <span className="font-medium">Buscar</span>
            </NavLink>

            <NavLink
              to={ROUTES.PROFILE}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-4 text-base transition-colors duration-200",
                  isActive
                    ? "text-accent-foreground bg-accent border-l-4 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                )
              }
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Perfil</span>
            </NavLink>
          </nav>

          {/* Theme Toggle Section */}
          <ThemeToggleMobile />

          {/* Logout Section */}
          <div className="border-t border-border pt-4 mt-auto">
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-4 w-full text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-all duration-200 rounded-md"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function ProfileDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso");
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 hover:bg-slate-800/50 rounded-lg px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {/* User Info */}
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-white leading-tight">
              {user.name || user.email}
            </span>
            <span className="text-xs leading-tight">
              <span className="text-blue-400">{formatRole(user.role)}</span>
              {user.forceName && (
                <>
                  <span className="text-slate-400 mx-1">•</span>
                  <span className="text-slate-400">{user.forceName}</span>
                </>
              )}
            </span>
          </div>

          {/* Avatar */}
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
              {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Chevron */}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <DropdownMenuItem
          onClick={() => navigate(ROUTES.PROFILE)}
        >
          <User className="w-4 h-4 mr-2" />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const formatRole = (role: string) => {
  const roleMap = {
    admin_geral: "Administrador Geral",
    ponto_focal: "Ponto Focal",
    gestor: "Gestor",
    usuario: "Usuário",
  };
  return roleMap[role as UserRole] || role;
};
