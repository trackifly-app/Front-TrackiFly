'use client';

import { validateFormRegister } from '@/lib/validates';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import CountrySelect from '@/components/CountrySelect';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const RegisterView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const inputStyle = "mt-1 w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm focus:border-[#e76f51] focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40";

  return (
    /* Contenedor principal: min-h-screen para evitar scrolls internos */
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f7f7f7]">
      
      {/* SECCIÓN IZQUIERDA: Formulario de Usuario */}
      <div className="flex w-full lg:w-1/2 items-start lg:items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">Crear cuenta</h2>

          <div className="mt-2 text-center text-sm text-gray-500 space-y-1">
            <p>
              ¿Ya tenés cuenta?{' '}
              <Link href="/login" className="text-[#e76f51] font-medium hover:underline">
                Iniciá sesión
              </Link>
            </p>
            <p>
              ¿Querés crear una cuenta empresa?{' '}
              <Link href="/registercompany" className="text-[#e76f51] font-medium hover:underline">
                Registrá tu Empresa
              </Link>
            </p>
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
              <Form className="mt-8 space-y-5 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    { label: 'Nombre completo', name: 'name', type: 'text', max: 50 },
                    { label: 'Email', name: 'email', type: 'email', max: 50 },
                    { label: 'Dirección', name: 'address', type: 'text', max: 100 },
                    { label: 'Teléfono', name: 'phone', type: 'text', max: 15 },
                    { label: 'Fecha de nacimiento', name: 'birthdate', type: 'date' },
                  ].map((field) => (
                    <div key={field.name} className={field.name === 'address' ? 'md:col-span-2' : ''}>
                      <label className="text-sm font-medium text-gray-600">{field.label}</label>
                      <Field
                        type={field.type}
                        name={field.name}
                        maxLength={field.max}
                        max={field.name === 'birthdate' ? new Date().toISOString().split('T')[0] : undefined}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          let val = e.target.value;
                          if (field.name === 'name') val = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                          if (field.name === 'phone') val = val.replace(/[^0-9]/g, '');
                          setFieldValue(field.name, val, true);
                          setFieldTouched(field.name, true, false);
                        }}
                        className={inputStyle}
                      />
                      <ErrorMessage name={field.name} component="div" className="text-xs text-red-500 mt-1" />
                    </div>
                  ))}

                  {/* Contraseña */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contraseña</label>
                    <div className="relative mt-1">
                      <Field 
                        type={showPassword ? 'text' : 'password'} 
                        name="password" 
                        maxLength={20} 
                        className={`${inputStyle} pr-10`} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
                  </div>

                  {/* Género */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Género</label>
                    <Field as="select" name="gender" className={inputStyle}>
                      <option value="">Selecciona una opción</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otros">Otros</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="text-xs text-red-500 mt-1" />
                  </div>

                  {/* País */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">País</label>
                    <div className="mt-1">
                      <CountrySelect 
                        key={values.country} 
                        value={values.country} 
                        onChange={(value) => setFieldValue('country', value, true)} 
                        onBlur={() => setFieldTouched('country', true)} 
                      />
                    </div>
                    <ErrorMessage name="country" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!isValid} 
                  className="w-full rounded-xl bg-[#e76f51] py-3.5 text-sm font-bold text-white transition hover:bg-[#d65f45] disabled:bg-gray-300 mt-4"
                >
                  Crear cuenta
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Hero informativo (Igual al de Empresa) */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#1f2a37] p-10 lg:p-16 text-white">
        <div className="flex flex-col flex-1 justify-center">
          <div className="mb-10 text-left">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Creá tu cuenta y <br />
              <span className="text-[#e76f51]">empezá en minutos.</span>
            </h1>
            <p className="mt-4 text-gray-300 max-w-md text-lg">
              Unite a TrackiFly y gestioná tus envíos personales de forma simple, rápida y segura.
            </p>
          </div>

          <ul className="space-y-4 text-lg text-gray-300 text-left">
            <li className="flex items-center gap-3">
              <span className="text-[#e76f51] text-xl">✔</span> 
              Registro rápido y sin complicaciones
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#e76f51] text-xl">✔</span> 
              Acceso inmediato a tu panel de envíos
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#e76f51] text-xl">✔</span> 
              Seguimiento en tiempo real de tus paquetes
            </li>
          </ul>
        </div>
        
        <p className="text-xs text-gray-500 mt-10">© 2026 TrackiFly</p>
      </div>
    </div>
  );
};

export default RegisterView;