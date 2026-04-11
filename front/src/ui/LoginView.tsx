'use client';

import { validateFormLogin } from '@/lib/validates';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// Componente principal para la vista de inicio de sesión
const LoginView = () => {
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Sección izquierda: Mensaje de bienvenida y características */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#1f2a37] p-12 text-white">
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

      {/* Sección derecha: Formulario de inicio de sesión */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#f7f7f7] px-4 sm:px-6 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">Iniciar sesión</h2>

          <p className="mt-2 text-center text-sm text-gray-500">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="text-[#e76f51] font-medium hover:underline">
              Registrarte gratis
            </Link>
          </p>

          {/* Formulario usando Formik para manejo de estado y validación */}
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={validateFormLogin}
            onSubmit={(values, { resetForm }) => {
              // Manejo del envío del formulario: muestra alerta de éxito y resetea el formulario
              Swal.fire({
                icon: 'success',
                title: 'Login exitoso',
                text: 'Has iniciado sesión correctamente',
                confirmButtonColor: '#e76f51',
              });

              resetForm();
            }}
          >
            {({ errors }) => (
              <Form className="mt-6 space-y-5">
                {/* Campo de email */}
                <div>
                  <label className="text-sm text-gray-600">Email</label>

                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                    <Field
                      type="email"
                      name="email"
                      placeholder="ejemplo@gmail.com"
                      maxLength={50}
                      onInput={(e: any) => {
                        e.target.value = e.target.value.replace(/\s/g, '');
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#e76f51] focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40"
                    />
                  </div>

                  <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Campo de contraseña */}
                <div>
                  <label className="text-sm text-gray-600">Contraseña</label>

                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                    {/* Botón para alternar visibilidad de la contraseña */}
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>

                    <Field type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••" maxLength={20} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm focus:border-[#e76f51] focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40" />
                  </div>

                  <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Botón de envío del formulario */}
                <button type="submit" disabled={!!errors.email || !!errors.password} className="w-full rounded-xl bg-[#e76f51] py-3 text-sm font-semibold text-white transition hover:bg-[#d65f45] disabled:bg-gray-300">
                  Ingresar
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
