"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, ShieldCheck, UserCircle, Building2, Menu, X } from "lucide-react";

const Navbar = () => {
  // Manejamos el estado del menú móvil (abierto/cerrado)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Un simple helper para resetear el menú cuando navegamos
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="w-full border-b border-gray-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-950 z-50">
      
      {/* Contenedor principal: Usamos grid para mantener el orden exacto de Trackifly */}
      <div className="w-full grid grid-cols-[auto_1fr_auto] items-center px-6 py-3">
        
        {/* Sección 1: Identidad visual */}
        <Link href="/" onClick={closeMobileMenu}>
          <Image
            src="/logo-trackifly.png"
            alt="Trackifly Logo"
            width={180}
            height={52}
            className="object-contain dark:brightness-110" // Un poquito de brillo extra para que destaque en dark mode
            quality={100}
            priority
          />
        </Link>

        {/* Sección 2: Navegación principal (Solo escritorio) */}
        <div className="hidden md:flex items-center gap-6 ml-16 list-none justify-start">
          <Link
            href="/"
            className="text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/orders"
            className="text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Pedidos
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Conocenos
          </Link>
        </div>

        {/* Sección 3: Disparador del menú para celulares */}
        <div className="md:hidden flex justify-end">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-primary dark:text-white p-2 transition-transform active:scale-90"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Sección 4: Accesos directos y Auth (Solo escritorio) */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Botones con efecto de expansión al pasar el mouse */}
          <div className="group flex items-center text-primary px-2 py-2 rounded-xl transition-all duration-300">
            <span className="text-xl">
              <ShieldCheck size={30} />
            </span>
            <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
              <Link href="/dashboard/admin">Administrador</Link>
            </span>
          </div>

          <div className="group flex items-center text-primary px-2 py-2 rounded-xl transition-all duration-300">
            <span className="text-xl">
              <Building2 size={30} />
            </span>
            <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
              <Link href="/dashboard/company">Empresas</Link>
            </span>
          </div>

          <div className="group flex items-center text-primary px-2 py-2 rounded-xl transition-all duration-300">
            <span className="text-xl">
              <UserCircle size={30} />
            </span>
            <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
              <Link href="/dashboard/user">Perfil</Link>
            </span>
          </div>

          {/* Botones de acción principal */}
          <Link
            href="/login"
            className="text-sm px-5 py-2 rounded-full border border-primary text-primary hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
          >
            Ingresar
          </Link>
          <Link
            href="/register"
            className="text-sm px-5 py-2 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
          >
            Registrarse
          </Link>
          
          <button className="group flex items-center text-red-700 dark:text-red-500 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300">
            <span className="text-xl">
              <LogOut size={18} />
            </span>
            <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
              Cerrar Sesión
            </span>
          </button>
        </div>
      </div>

      {/* Menú desplegable para móviles (Aparece cuando isMobileMenuOpen es true) */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col bg-white dark:bg-zinc-950 px-6 py-4 gap-4 border-t dark:border-zinc-800 animate-in slide-in-from-top duration-300">
          
          {/* Navegación simple */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="dark:text-white py-1 font-medium" onClick={closeMobileMenu}>Home</Link>
            <Link href="/orders" className="dark:text-white py-1 font-medium" onClick={closeMobileMenu}>Pedidos</Link>
            <Link href="/about" className="dark:text-white py-1 font-medium" onClick={closeMobileMenu}>Conocenos</Link>
          </div>
          
          <hr className="dark:border-zinc-800" />
          
          {/* Dashboard y Perfil con iconos visibles (mejor UX en móvil) */}
          <div className="flex flex-col gap-4">
            <Link href="/dashboard/admin" className="text-primary flex items-center gap-3 py-1" onClick={closeMobileMenu}>
              <ShieldCheck size={24}/> <span>Administrador</span>
            </Link>
            <Link href="/dashboard/company" className="text-primary flex items-center gap-3 py-1" onClick={closeMobileMenu}>
              <Building2 size={24}/> <span>Empresas</span>
            </Link>
            <Link href="/dashboard/user" className="text-primary flex items-center gap-3 py-1" onClick={closeMobileMenu}>
              <UserCircle size={24}/> <span>Perfil</span>
            </Link>
          </div>

          {/* Botones de cuenta */}
          <div className="flex flex-col gap-3 mt-2">
            <Link 
              href="/login" 
              className="text-center py-2.5 border border-primary text-primary rounded-full font-medium"
              onClick={closeMobileMenu}
            >
              Ingresar
            </Link>
            <Link 
              href="/register" 
              className="text-center py-2.5 bg-primary text-white rounded-full font-medium shadow-md"
              onClick={closeMobileMenu}
            >
              Registrarse
            </Link>
          </div>

          {/* Salida */}
          <button className="flex items-center gap-3 text-red-700 dark:text-red-500 pt-4 border-t dark:border-zinc-800 font-medium">
            <LogOut size={20} /> <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;