'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import CountrySelect from '@/components/CountrySelect';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import { validateFormRegister } from '@/lib/validates';

/**
 * Vista completa de registro de usuario (RegisterView).
 * Contiene el formulario de creación de cuenta y un panel lateral informativo (solo en desktop).
 */
const RegisterView = () => {
  // Estado local para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Sección izquierda: Formulario de registro */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background px-4 sm:px-6 py-8">
        <div className="w-full max-w-md bg-surface rounded-3xl shadow-sm border border-border p-8 max-h-[85vh] overflow-y-auto">
          {/* Título y enlace a login */}
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">Crear cuenta</h2>

          <p className="mt-3 text-center text-sm text-muted">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            ¿Queres crear una cuenta empresa?{' '}
            <Link href="/registercompany" className="text-[#e76f51] font-medium hover:underline">
              Registra tu Empresa
            </Link>
          </p>

          {/* Formulario gestionado con Formik */}
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
            validate={validateFormRegister} // Validación externa compartida
            onSubmit={(values, { resetForm, setFieldValue }) => {
              Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Usuario registrado correctamente',
                confirmButtonColor: '#e76f51',
              });

              resetForm();
              setFieldValue('country', '');
            }}
          >
            {({ isValid, setFieldValue, setFieldTouched, values }) => (
              <Form className="mt-8 space-y-6">
                {/* Campos dinámicos: Nombre, Email, Dirección, Teléfono y Fecha de nacimiento */}
                {[
                  { label: 'Nombre', name: 'name', type: 'text', max: 15 },
                  { label: 'Email', name: 'email', type: 'email', max: 50 },
                  { label: 'Dirección', name: 'address', type: 'text', max: 100 },
                  { label: 'Teléfono', name: 'phone', type: 'text', max: 15 },
                  { label: 'Fecha de nacimiento', name: 'birthdate', type: 'date' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-sm text-muted font-medium mb-1.5 block">{field.label}</label>
                    <Field
                      type={field.type}
                      name={field.name}
                      maxLength={field.max}
                      onInput={(e: any) => {
                        if (field.name === 'name') {
                          e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                        }
                        if (field.name === 'phone') {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }
                      }}
                      className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                    <ErrorMessage name={field.name} component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                ))}

                {/* Campo de Contraseña con toggle de visibilidad */}
                <div>
                  <label className="text-sm text-muted font-medium mb-1.5 block">Contraseña</label>
                  <div className="relative">
                    <Field type={showPassword ? 'text' : 'password'} name="password" maxLength={20} className="w-full rounded-2xl border border-border bg-surface py-3 px-5 pr-12 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Selector de Género */}
                <div>
                  <label className="text-sm text-muted font-medium mb-1.5 block">Género</label>
                  <Field as="select" name="gender" className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-all">
                    <option value="">Selecciona una opción</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otros">Otros</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Selector de País (componente personalizado) */}
                <div className="relative z-50">
                  <label className="text-sm text-muted font-medium mb-1.5 block">País</label>
                  <div className="mt-1">
                    <CountrySelect key={values.country} value={values.country} onChange={(value) => setFieldValue('country', value, true)} onBlur={() => setFieldTouched('country', true)} />
                  </div>
                  <ErrorMessage name="country" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Botón de registro */}
                <button type="submit" disabled={!isValid} className="mt-6 w-full rounded-2xl bg-primary py-3.5 text-base font-semibold text-white hover:bg-primary-hover transition-all disabled:bg-surface-muted disabled:text-muted shadow-lg">
                  Crear cuenta
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Sección derecha: Panel informativo (solo visible en pantallas lg y superiores) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#1f2a37] p-12 text-white">
        <div className="flex flex-1 items-center">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Creá tu cuenta y <br />
              <span className="text-[#e76f51]">empezá en minutos.</span>
            </h1>

            <p className="mt-4 text-gray-300 max-w-md">Unite a TrackiFly y comenzá a gestionar tus envíos de forma simple, rápida y segura.</p>

            <ul className="mt-8 space-y-3 text-sm text-gray-300">
              <li>✔ Registro rápido y sin complicaciones</li>
              <li>✔ Acceso inmediato a tu panel</li>
              <li>✔ Control total de tus envíos desde el primer momento</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-gray-400">© 2026 TrackiFly</p>
      </div>
    </div>
  );
};

export default RegisterView;
