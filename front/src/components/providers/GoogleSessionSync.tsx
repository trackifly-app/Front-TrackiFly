"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function GoogleSessionSync() {
  const { data: session, status } = useSession();
  const { checkSession, userData } = useAuth();
  const synced = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (localStorage.getItem("manualLogout")) {
      localStorage.removeItem("manualLogout");
      synced.current = false;
      return;
    }

    if (status !== "authenticated" || !session?.user) return;
    if (synced.current) return;

    const sessionKey = `google_synced_${session.user.email}`;
    if (sessionStorage.getItem(sessionKey)) return;

    synced.current = true;
    sessionStorage.setItem(sessionKey, "true");

    // ← leer desde dónde vino: login o register
    const googleMode = searchParams.get("googleMode") || "login";
    const isNew = session.isNewGoogleUser;

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

        // Vino desde register pero ya tenía cuenta
        if (googleMode === "register" && !isNew) {
          sessionStorage.removeItem(sessionKey);
          synced.current = false;

          Swal.fire({
            icon: "info",
            title: "Ya tenés cuenta",
            text: "Tu cuenta de Google ya está registrada. Iniciando sesión...",
            confirmButtonColor: "#e76f51",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => router.push("/"));
          return;
        }

        // Vino desde register y ES NUEVO → incentivo de perfil
        if (googleMode === "register" && isNew) {
          Swal.fire({
            icon: "success",
            title: "¡Bienvenido a TrackiFly!",
            html: `
      <p>Tu cuenta fue creada con Google.</p>
      <br/>
      <p>🎁 <strong>Completá tu perfil ahora</strong> y obtené un <strong style="color:#e76f51">5% de descuento</strong> en tu primer envío.</p>
    `,
            confirmButtonText: "Completar perfil",
            cancelButtonText: "Ahora no",
            showCancelButton: true,
            confirmButtonColor: "#e76f51",
            cancelButtonColor: "#6b7280",
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.setItem(
                `profile_discount_${userData?.user?.id}`,
                "true",
              );
              router.push(`/es/dashboard/user`);
            } else {
              router.push("/");
            }
          });
          return;
        }

        // Vino desde login y es nuevo (se registró sin querer)
        if (googleMode === "login" && isNew) {
          Swal.fire({
            icon: "success",
            title: "¡Bienvenido a TrackiFly!",
            text: "No tenías cuenta, la creamos automáticamente con Google.",
            confirmButtonColor: "#e76f51",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => router.push("/"));
          return;
        }

        // Vino desde login y ya tenía cuenta
        Swal.fire({
          icon: "success",
          title: "Hola de nuevo",
          text: "Sesión iniciada con Google.",
          confirmButtonColor: "#e76f51",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => router.push("/"));
      } catch (err) {
        console.error("Error sincronizando sesión de Google:", err);
      }
    };

    void syncSession();
  }, [status, session, router, checkSession, searchParams, userData?.user?.id]);

  return null;
}
