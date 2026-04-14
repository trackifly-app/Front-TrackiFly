'use client';

import { validateFormRegister } from '@/lib/validates';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import CountrySelect from '@/components/CountrySelect';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// Componente principal para la vista de registro de usuario
const RegisterView = () => {
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Sección izquierda: Formulario de registro */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#f7f7f7] px-4 sm:px-6 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">Crear cuenta</h2>

          <p className="mt-2 text-center text-sm text-gray-500">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-[#e76f51] font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>

          {/* Formulario usando Formik para manejo de estado y validación */}
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
              // Manejo del envío del formulario: muestra alerta de éxito y resetea el formulario
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
              <Form className="mt-6 space-y-5">
                {/* Campos de texto mapeados dinámicamente */}
                {[
                  { label: 'Nombre', name: 'name', type: 'text', max: 15 },
                  { label: 'Email', name: 'email', type: 'email', max: 50 },
                  { label: 'Dirección', name: 'address', type: 'text', max: 100 },
                  { label: 'Teléfono', name: 'phone', type: 'text', max: 15 },
                  { label: 'Fecha de nacimiento', name: 'birthdate', type: 'date' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-sm text-gray-600">{field.label}</label>

                    <Field
                      type={field.type}
                      name={field.name}
                      maxLength={field.max}
                      max={field.name === 'birthdate' ? new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0] : undefined}
                      onChange={(e: any) => {
                        setFieldValue(field.name, e.target.value, true);
                        setFieldTouched(field.name, true, false);
                      }}
                      onInput={(e: any) => {
                        if (field.name === 'name') {
                          e.target.value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                        }

                        if (field.name === 'phone') {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }
                      }}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm focus:border-[#e76f51] focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40"
                    />

                    <ErrorMessage name={field.name} component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                ))}

                {/* Campo de contraseña */}
                <div>
                  <label className="text-sm text-gray-600">Contraseña</label>

                  <div className="relative mt-1">
                    <Field type={showPassword ? 'text' : 'password'} name="password" maxLength={20} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 pr-10 text-sm focus:border-[#e76f51] focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40" />

                    {/* Botón para alternar visibilidad de la contraseña */}
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Campo de selección de género */}
                <div>
                  <label className="text-sm text-gray-600">Género</label>

                  <Field as="select" name="gender" className="mt-1 w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm focus:border-[#e76f51] focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40">
                    <option value="">Selecciona una opción</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otros">Otros</option>
                  </Field>

                  <ErrorMessage name="gender" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Campo de selección de país usando componente personalizado */}
                <div>
                  <label className="text-sm text-gray-600">País</label>

                  <div className="mt-1">
                    <CountrySelect key={values.country} value={values.country} onChange={(value) => setFieldValue('country', value, true)} onBlur={() => setFieldTouched('country', true)} />
                  </div>

                  <ErrorMessage name="country" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Botón de envío del formulario */}
                <button type="submit" disabled={!isValid} className="w-full rounded-xl bg-[#e76f51] py-3 text-sm font-semibold text-white transition hover:bg-[#d65f45] disabled:bg-gray-300">
                  Crear cuenta
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Sección derecha: Mensaje de bienvenida y características */}
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
