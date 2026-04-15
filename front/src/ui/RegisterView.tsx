'use client';

import { useState } from 'react';
import { Formik, Form } from 'formik';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { validateFormRegister } from '@/lib/validates';
import { RegisterFields } from '@/ui/RegisterFields';

const RegisterView = () => {
  const [activeRole, setActiveRole] = useState('usuario');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* SECCIÓN IZQUIERDA: Formulario */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#f7f7f7] px-4 sm:px-6 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8 my-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">{activeRole === 'usuario' ? 'Registro de Usuario' : 'Registro de Empleado'}</h2>

          <p className="mt-2 text-center text-sm text-gray-500">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-[#e76f51] font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>

          {/* Selector de Rol */}
          <div className="mt-6 space-y-2">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Registrarse como:</label>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              <button type="button" onClick={() => setActiveRole('usuario')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeRole === 'usuario' ? 'bg-[#e76f51] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>
                Usuario
              </button>
              <button type="button" onClick={() => setActiveRole('empleado')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeRole === 'empleado' ? 'bg-[#e76f51] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>
                Empleado
              </button>
            </div>
          </div>

          <Formik
            initialValues={{
              email: '',
              password: '',
              name: '',
              address: '',
              phone: '',
              gender: '',
              birthdate: '',
              country: '',
            }}
            validate={validateFormRegister}
            onSubmit={(values, { resetForm, setFieldValue }) => {
              const roleName = activeRole === 'usuario' ? 'Usuario' : 'Empleado';

              Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: `${roleName} creado correctamente en la plataforma.`,
                confirmButtonColor: '#e76f51',
              });

              resetForm();
              setFieldValue('country', '');
            }}
          >
            {(formikProps) => (
              <Form className="mt-6 space-y-5">
                <RegisterFields {...formikProps} showPassword={showPassword} setShowPassword={setShowPassword} />

                <button type="submit" disabled={!formikProps.isValid} className="w-full rounded-xl bg-[#e76f51] py-3 text-sm font-semibold text-white transition hover:bg-[#d65f45] disabled:bg-gray-300 shadow-lg shadow-[#e76f51]/20">
                  {activeRole === 'usuario' ? 'Registrarse como Usuario' : 'Registrarse como Empleado'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Informativa */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#1f2a37] p-12 text-white">
        <div className="flex flex-1 items-center">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              {activeRole === 'usuario' ? (
                <>
                  Creá tu cuenta y <br />
                  <span className="text-[#e76f51]">empezá en minutos.</span>
                </>
              ) : (
                <>
                  Sumate al equipo y <br />
                  <span className="text-[#e76f51]">gestioná tus envíos.</span>
                </>
              )}
            </h1>

            <p className="mt-4 text-gray-300 max-w-md text-lg">{activeRole === 'usuario' ? 'Unite a TrackiFly y comenzá a gestionar tus envíos de forma simple, rápida y segura.' : 'Formá parte de nuestra red logística. Registrate para comenzar a trabajar con empresas de todo el país.'}</p>

            <ul className="mt-8 space-y-4 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#e76f51]">✔</span>
                {activeRole === 'usuario' ? 'Registro rápido y sin complicaciones' : 'Acceso a rutas de entrega optimizadas'}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#e76f51]">✔</span>
                {activeRole === 'usuario' ? 'Acceso inmediato a tu panel' : 'Gestión de entregas en tiempo real'}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#e76f51]">✔</span>
                {activeRole === 'usuario' ? 'Control total de tus pedidos' : 'Soporte y seguimiento profesional'}
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-gray-400">© 2026 TrackiFly - Gestión Logística Inteligente</p>
      </div>
    </div>
  );
};

export default RegisterView;
