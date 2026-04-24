'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, ShieldCheck, UserCircle, Building2, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/roles';

const Navbar = () => {
  const { checkSession } = useAuth();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.ok) {
      await checkSession(); // <--- Esto carga al usuario en el Navbar sin recargar
      router.push('/dashboard');
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { userData, handleLogout } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isAuthenticated = !!userData?.user?.id;
  const userRole = userData?.user.role.name;

  const getRoleLinks = () => {
    if (!isAuthenticated || !userRole) return [];

    const links = [];

    // Dashboard Admin (solo Admins)
    if (userRole === Role.Admin || userRole === Role.SuperAdmin) {
      links.push({
        href: '/dashboard/admin',
        label: 'Admin',
        icon: <ShieldCheck size={30} />,
        mobileIcon: <ShieldCheck size={24} />,
      });
    }

    // Dashboard Empresa / Operaciones
    if (userRole === Role.Company || userRole === Role.Operator) {
      const isOp = userRole === Role.Operator;
      links.push({
        href: '/dashboard/company',
        label: isOp ? 'Operaciones' : `Empresa ${userData?.user?.company?.company_name}`,
        icon: isOp ? <LayoutDashboard size={30} /> : <Building2 size={30} />,
        mobileIcon: isOp ? <LayoutDashboard size={24} /> : <Building2 size={24} />,
      });
    }

    // === PERFIL - Visible para TODOS los roles EXCEPTO Company ===
    if (userRole !== Role.Company) {
      links.push({
        href: '/dashboard/user',
        label: `Perfil de ${userData?.user?.profile?.first_name}`,
        icon: <UserCircle size={30} />,
        mobileIcon: <UserCircle size={24} />,
      });

    }

    return links;
  };

  const roleLinks = getRoleLinks();

  return (
    <nav className="w-full border-b border-border sticky top-0 bg-surface z-50">
      <div className="w-full grid grid-cols-[auto_1fr_auto] items-center px-6 py-3">
        <Link href="/" onClick={closeMobileMenu}>
          <Image src="/logo-trackifly.png" alt="Trackifly Logo" width={180} height={52} className="object-contain" priority />
        </Link>

        {/* Links principales (Desktop) */}
        <div className="hidden md:flex items-center gap-6 justify-center list-none">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/orders" className="text-sm text-muted hover:text-foreground transition-colors">
            Pedidos
          </Link>
          <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">
            Conócenos
          </Link>
        </div>

        {/* Botón Hamburguesa (Móvil) */}
        <div className="md:hidden flex justify-end">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-primary p-2">
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Menú Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {!isMounted ? (
            <div className="w-32" />
          ) : isAuthenticated ? (
            <>
              {roleLinks.map((link) => (
                <div key={link.href} className="group flex items-center text-primary px-3 py-2 rounded-xl hover:bg-surface-muted transition-all duration-300">
                  {link.icon}
                  <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 text-sm">
                    <Link href={link.href}>{link.label}</Link>
                  </span>
                </div>
              ))}

              <button onClick={handleLogout} className="group flex items-center text-primary px-4 py-2 rounded-xl hover:bg-surface-muted transition-all duration-300 cursor-pointer">
                <LogOut size={18} className="stroke-current" />

                <span className="ml-2 w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:w-15 group-hover:opacity-100">Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-5 py-2 rounded-full border border-primary text-primary hover:bg-surface-muted transition-colors">
                Ingresar
              </Link>
              <Link href="/register" className="text-sm px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors font-medium">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col bg-surface px-6 py-4 gap-4 border-t border-border animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-3">
            <Link href="/" className="py-1 font-medium" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link href="/orders" className="py-1 font-medium" onClick={closeMobileMenu}>
              Pedidos
            </Link>
            <Link href="/about" className="py-1 font-medium" onClick={closeMobileMenu}>
              Conócenos
            </Link>
          </div>

          <hr className="border-border" />

          <div className="flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                {roleLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-primary flex items-center gap-3 py-2" onClick={closeMobileMenu}>
                    {link.mobileIcon} <span>{link.label}</span>
                  </Link>
                ))}
                <button onClick={handleLogout} className="group flex items-center text-primary px-4 py-2 rounded-xl hover:bg-surface-muted transition-all duration-300 cursor-pointer">
                  <LogOut size={18} className="stroke-current" />
                  <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-500 ease-in-out group-hover:max-w-25 group-hover:opacity-100 group-hover:ml-2">Salir</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" className="text-center py-2.5 border border-primary text-primary rounded-full font-medium" onClick={closeMobileMenu}>
                  Ingresar
                </Link>
                <Link href="/register" className="text-center py-2.5 bg-primary text-primary-foreground rounded-full shadow-md font-medium" onClick={closeMobileMenu}>
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
