'use client';

import { validateFormLogin } from '@/lib/validate';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import Swal from 'sweetalert2';

const LoginView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">Inicia sesión</h1>

        <Formik
          initialValues={{ email: '', password: '' }}
          validate={validateFormLogin}
          onSubmit={(values, { resetForm }) => {
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
            <Form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Email</label>

                <Field type="email" name="email" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-[#e76f51] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40" />

                <ErrorMessage name="email" component="div" className="text-xs text-red-500" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Contraseña</label>

                <Field type="password" name="password" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-[#e76f51] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40" />

                <ErrorMessage name="password" component="div" className="text-xs text-red-500" />
              </div>

              <button type="submit" disabled={!!errors.email || !!errors.password} className="mt-3 rounded-xl bg-[#e76f51] py-3 text-sm font-semibold text-white transition hover:bg-[#d65f45] disabled:cursor-not-allowed disabled:bg-gray-300">
                Iniciar sesión
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                ¿No tienes una cuenta?{' '}
                <Link href="/register" className="font-medium text-[#e76f51] hover:underline">
                  Crear cuenta
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginView;
