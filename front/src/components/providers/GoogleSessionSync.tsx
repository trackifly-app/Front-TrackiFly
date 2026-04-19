"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

export default function GoogleSessionSync() {
  const { data: session, status } = useSession();
  const { setUserData } = useAuth();

  useEffect(() => {
    if (status !== "authenticated" || !session?.backendToken) return;

    if (
      session.isNewGoogleUser === undefined ||
      session.isNewGoogleUser === null
    )
      return;

    const alreadyShown = localStorage.getItem("googleToastShown");
    if (alreadyShown === session.backendToken) return;

    localStorage.setItem("googleToastShown", session.backendToken);

    const stored = localStorage.getItem("userSession");
    if (!stored) {
      const googleSession = {
        token: session.backendToken,
        user: {
          id: session.user?.id || "",
          email: session.user?.email || "",
          first_name: session.user?.name?.split(" ")[0] || "",
          last_name: session.user?.name?.split(" ").slice(1).join(" ") || "",
          role: "user",
          address: "",
          phone: "",
        },
      };
      localStorage.setItem("userSession", JSON.stringify(googleSession));
      localStorage.setItem("userToken", session.backendToken);
      setUserData(googleSession);
    }

    const esNuevo = session.isNewGoogleUser;

    if (!esNuevo) {
      Swal.fire({
        icon: "success",
        title: "Hola denuevo",
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
  }, [status, session, setUserData]);

  return null;
}
