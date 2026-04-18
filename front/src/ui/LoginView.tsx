'use client';

import { validateFormLogin } from '@/lib/validates';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { login } from '@/services/authService'; // Asegúrate de que se llame login o loginUser según tu servicio
import { useAuth } from '@/context/AuthContext'; // Para guardar el usuario globalmente
import { useRouter } from 'next/navigation';

const LoginView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useAuth(); // Traemos la función para guardar la sesión
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* LEFT (se mantiene tal cual) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#1f2a37] dark:bg-slate-900 p-12 text-white">
        <div className="flex flex-1 items-center">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Bienvenido de nuevo <br />
              <span className="text-[#e76f51]">a TrackiFly</span>
            </h1>
            <p className="mt-4 text-gray-300 max-w-md">Accedé a tu cuenta y continuá gestionando tus envíos de forma rápida y segura.</p>
            <ul className="mt-8 space-y-3 text-sm text-gray-300">
              <li>✔ Seguimiento en tiempo real</li>
              <li>✔ Gestión completa de envíos</li>
              <li>✔ Acceso a tu historial y reportes</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-400">© 2026 TrackiFly</p>
      </div>

      {/* RIGHT */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-surface-muted px-4 sm:px-6 py-8">
        <div className="w-full max-w-md bg-surface rounded-2xl shadow-sm p-6 sm:p-8 border border-border">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">Iniciar sesión</h2>

          <p className="mt-2 text-center text-sm text-muted">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Registrarte gratis
            </Link>
          </p>

          <Formik
            initialValues={{ email: '', password: '' }}
            validate={validateFormLogin}
            onSubmit={async (values, { setSubmitting }) => {
              // Llamamos a la función de servicio que definimos antes
              const response = await login(values);

              if (response) {
                // Si el login es exitoso, actualizamos el contexto global
                setUserData(response);
                
                // Redirigimos al dashboard
                router.push('/dashboard/user');
              }
              
              setSubmitting(false);
            }}
          >
            {({ errors, isSubmitting }) => (
              <Form className="mt-6 space-y-5">
                {/* Email */}
                <div>
                  <label className="text-sm text-muted">Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted" />
                    <Field
                      type="email"
                      name="email"
                      placeholder="ejemplo@gmail.com"
                      className="w-full rounded-xl border border-border bg-surface-muted text-foreground placeholder-muted py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-xs text-primary mt-1" />
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm text-muted">Contraseña</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted hover:text-foreground">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <Field 
                      type={showPassword ? 'text' : 'password'} 
                      name="password" 
                      placeholder="••••••••" 
                      className="w-full rounded-xl border border-border bg-surface-muted text-foreground py-2.5 pl-10 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" 
                    />
                  </div>
                  <ErrorMessage name="password" component="div" className="text-xs text-primary mt-1" />
                </div>

                {/* Button */}
                <button  
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Cargando...' : 'Ingresar'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
