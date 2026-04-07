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
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/login">Iniciar sesión</Link>
        <Link href="/register">Registrarse</Link>
        <Link href="/orders">Pedidos</Link>
        <Link href="/products">Productos</Link>
      </div>

      {/* BOTON STATUS CERRAR SESION */}
      <div className="flex items-center justify-end mr-4">
        <button>Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;