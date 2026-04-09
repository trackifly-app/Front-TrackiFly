import Link from "next/link";
import Image from "next/image";
import { LogOut, ShieldCheck, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full grid grid-cols-[auto_1fr_auto] items-center px-6 py-3 border-b border-gray-200 sticky top-0 bg-white">
      {/* LOGO */}
      <Link href="/">
        <Image
          src="/logo-trackifly.png"
          alt="Trackifly"
          width={180}
          height={52}
          className="object-contain"
          quality={100}
          priority
        />
      </Link>

      {/* ZONA CENTRAL */}
      <div className="flex items-center gap-6 ml-16 list-none justify-start">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/orders"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Pedidos
        </Link>
        <Link
          href="/about"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Conocenos
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="group flex items-center text-primary px-4 py-2 rounded-xl transition-all duration-300 ease-in-out">
          <span className="text-xl">
            {" "}
            <ShieldCheck size={30} />
          </span>

          <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
            <Link href="/dashboard/admin">Administrador</Link>
          </span>
        </div>
        <Link
          href="/dashboard/user"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <UserCircle size={30} className="text-primary" />
        </Link>
        <Link
          href="/login"
          className="text-sm px-5 py-2 rounded-full border border-primary text-primary hover:bg-orange-50 transition-colors"
        >
          Ingresar
        </Link>
        <Link
          href="/register"
          className="text-sm px-5 py-2 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors"
        >
          Registrarse
        </Link>
        <button className="group flex items-center text-red-700 px-4 py-2 rounded-xl transition-all duration-300 ease-in-out">
          <span className="text-xl">
            {" "}
            <LogOut size={18} />
          </span>

          <span className="max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
            Cerrar Sesión
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
