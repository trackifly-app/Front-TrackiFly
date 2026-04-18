'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, ShieldCheck, UserCircle, Building2, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; 

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Traemos la función de cerrar sesión del contexto
  const { handleLogout } = useAuth(); 

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="w-full border-b border-border sticky top-0 bg-surface z-50">
      <div className="w-full grid grid-cols-[auto_1fr_auto] items-center px-6 py-3">
        
        {/* Logo que resetea el menú móvil al clickearlo */}
        <Link href="/" onClick={closeMobileMenu}>
          <Image src="/logo-trackifly.png" alt="Trackifly Logo" width={180} height={52} className="object-contain" priority />
        </Link>

        {/* Links principales de navegación para escritorio */}
        <div className="hidden md:flex items-center gap-6 justify-center list-none">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">Home</Link>
          <Link href="/orders" className="text-sm text-muted hover:text-foreground transition-colors">Pedidos</Link>
          <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">Conócenos</Link>
        </div>

        {/* Botón de hamburguesa para móviles */}
        <div className="md:hidden flex justify-end">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-primary p-2 rounded-lg hover:bg-surface-muted transition-all active:scale-90">
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Accesos rápidos y botones de autenticación (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <div className="group flex items-center text-primary px-2 py-2 rounded-xl hover:bg-surface-muted transition-all duration-300">
            <ShieldCheck size={30} />
            <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
              <Link href="/dashboard/admin">Administrador</Link>
            </span>
          </div>

          <div className="group flex items-center text-primary px-2 py-2 rounded-xl hover:bg-surface-muted transition-all duration-300">
            <Building2 size={30} />
            <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
              <Link href="/dashboard/company">Empresas</Link>
            </span>
          </div>

          <div className="group flex items-center text-primary px-2 py-2 rounded-xl hover:bg-surface-muted transition-all duration-300">
            <UserCircle size={30} />
            <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
              <Link href="/dashboard/user">Perfil</Link>
            </span>
          </div>

          <Link href="/login" className="text-sm px-5 py-2 rounded-full border border-primary text-primary hover:bg-surface-muted transition-colors">Ingresar</Link>
          <Link href="/register" className="text-sm px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm">Registrarse</Link>

          {/* Botón de logout: dispara la función del contexto */}
          <button 
            type="button"
            onClick={handleLogout}
            className="group flex items-center text-muted px-4 py-2 rounded-xl hover:bg-surface-muted transition-all duration-300 cursor-pointer"
          >
            <LogOut size={18} />
            <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col bg-surface px-6 py-4 gap-4 border-t border-border animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-3">
            <Link href="/" className="py-1 font-medium text-foreground" onClick={closeMobileMenu}>Home</Link>
            <Link href="/orders" className="py-1 font-medium text-foreground" onClick={closeMobileMenu}>Pedidos</Link>
            <Link href="/about" className="py-1 font-medium text-foreground" onClick={closeMobileMenu}>Conócenos</Link>
          </div>
          <hr className="border-border" />
          <div className="flex flex-col gap-4">
            <Link href="/dashboard/admin" className="text-primary flex items-center gap-3 py-1" onClick={closeMobileMenu}>
              <ShieldCheck size={24} /> <span>Administrador</span>
            </Link>
            <Link href="/dashboard/company" className="text-primary flex items-center gap-3 py-1" onClick={closeMobileMenu}>
              <Building2 size={24} /> <span>Empresas</span>
            </Link>
            <Link href="/dashboard/user" className="text-primary flex items-center gap-3 py-1" onClick={closeMobileMenu}>
              <UserCircle size={24} /> <span>Perfil</span>
            </Link>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <Link href="/login" className="text-center py-2.5 border border-primary text-primary rounded-full font-medium" onClick={closeMobileMenu}>Ingresar</Link>
            <Link href="/register" className="text-center py-2.5 bg-primary text-primary-foreground rounded-full font-medium shadow-md" onClick={closeMobileMenu}>Registrarse</Link>
          </div>
          <button 
            type="button"
            onClick={() => { handleLogout(); closeMobileMenu(); }}
            className="flex items-center gap-3 text-muted pt-4 border-t border-border font-medium cursor-pointer"
          >
            <LogOut size={20} /> <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;