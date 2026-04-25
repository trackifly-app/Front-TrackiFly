"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function GoogleSessionSync() {
  const { data: session, status } = useSession();
  const { checkSession } = useAuth();
  const synced = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    if (synced.current) return;
    synced.current = true;

    const syncSession = async () => {
      try {
        const googleRes = await fetch(`${APIURL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: session.user?.email,
            name: session.user?.name,
            googleId: session.user?.image,
            picture: session.user?.image,
          }),
        });

        if (!googleRes.ok) return;

        await checkSession();

        if (!session.isNewGoogleUser) {
          Swal.fire({
            icon: "success",
            title: "Hola de nuevo",
            text: "Sesión iniciada con Google.",
            confirmButtonColor: "#e76f51",
            timer: 2500,
            showConfirmButton: false,
          }).then(() => {
            router.push("/");
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
          router.push("/");
        });
      } catch (err) {
        console.error("Error sincronizando sesión de Google:", err);
      }
    };

    void syncSession();
  }, [status, session, router, checkSession]);

  return null;
}
