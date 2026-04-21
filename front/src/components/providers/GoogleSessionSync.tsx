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

    const syncSession = async () => {
      try {
        // La cookie ya fue seteada por el signIn callback de NextAuth
        // Solo pedimos los datos del usuario
        const res = await fetch(`${APIURL}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const userData = (await res.json()) as { id: string; role: string };

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

        if (!session.isNewGoogleUser) {
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
      } catch (err) {
        console.error("Error sincronizando sesión de Google:", err);
      }
    };

    void syncSession();
  }, [status, session, setUserData]);

  return null;
}
