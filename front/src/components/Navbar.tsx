import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    
    <nav className="w-full grid grid-cols-[auto_1fr_auto] items-center px-6 py-4">
      {/* LOGO */}
      <div className="flex items-center">
        <Link href="/"><Image src="/logo-trackifly.png"
            alt="Logo"
            width={300}
            height={80}
        /></Link>
      </div>

      {/* ZONA CENTRAL */}
      <div className="flex items-center justify-center gap-25">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard/Admin</Link>
        <Link href="/dashboard/user">Dashboard/User</Link>
        <Link href="/login">Iniciar sesión</Link>
        <Link href="/register">Registrarse</Link>
        <Link href="/orders">Pedidos/Admin</Link>
        <Link href="/products">Productos/Admin</Link>
      </div>

      {/* BOTON STATUS CERRAR SESION */}
      <div className="flex items-center justify-end mr-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;