"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function GoogleSessionSync() {
  const { data: session, status } = useSession();
  const { setUserData } = useAuth();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    // Pedimos los datos del usuario al back usando la cookie que seteó /auth/google
    const syncSession = async () => {
      try {
        const res = await fetch(`${APIURL}/auth/me`, {
          credentials: "include", // la cookie viaja sola
        });

        if (!res.ok) return;

        const userData = await res.json();

        setUserData({
          user: {
            id: userData.id,
            email: session.user?.email || "",
            first_name: session.user?.name?.split(" ")[0] || "",
            last_name: session.user?.name?.split(" ").slice(1).join(" ") || "",
            role: userData.role,
            address: "",
            phone: "",
          },
        });

        const esNuevo = session.isNewGoogleUser;

        if (!esNuevo) {
          Swal.fire({
            icon: "success",
            title: "Hola de nuevo",
            text: "Sesión iniciada con Google.",
            confirmButtonColor: "#e76f51",
            timer: 2500,
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "/";
          });
          return;
        }

        Swal.fire({
          icon: "success",
          title: "¡Bienvenido a TrackiFly!",
          text: "Tu cuenta fue creada con Google.",
          confirmButtonColor: "#e76f51",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/";
        });
      } catch (error) {
        console.error("Error sincronizando sesión de Google:", error);
      }
    };

    void syncSession();
  }, [status, session, setUserData]);

  return null;
}
