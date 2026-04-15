'use client';

import { CompanyPlan, validateFormRegisterCompany, CompanyRegisterValues } from '@/lib/validates';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import CountrySelect from '@/components/CountrySelect';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const RegisterView = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Estilo base para los inputs
  const inputStyle = "mt-1 w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm focus:border-[#e76f51] focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40";

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* SECCIÓN IZQUIERDA: Formulario expandido */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#f7f7f7] p-4 sm:p-8 lg:p-12">
        {/* max-w-2xl para que la tarjeta sea más grande y ocupe la zona blanca */}
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">Crear cuenta Empresa</h2>

          <p className="mt-2 text-center text-sm text-gray-500">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-[#e76f51] font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>
          
          <Formik<CompanyRegisterValues>
            initialValues={{
              email: '',
              password: '',
              company_name: '',
              industry: '',
              contact_name: '',
              phone: '',
              address: '',
              country: '', 
              plan: '',
            }}
            validate={validateFormRegisterCompany}
            onSubmit={(values, { resetForm, setFieldValue }) => {
              Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Compañía registrada correctamente',
                confirmButtonColor: '#e76f51',
              });

              resetForm();
              setFieldValue('country', '');
            }}
          >
            {({ isValid, setFieldValue, setFieldTouched, values }) => (
              <Form className="mt-8 space-y-5">
                
                {/* Grid de 2 columnas para los campos principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    { label: 'Nombre de la empresa', name: 'company_name', type: 'text', max: 50 },
                    { label: 'Industria', name: 'industry', type: 'text', max: 30 },
                    { label: 'Nombre del contacto', name: 'contact_name', type: 'text', max: 50 },
                    { label: 'Email', name: 'email', type: 'email', max: 50 },
                    { label: 'Teléfono', name: 'phone', type: 'text', max: 15 },
                    { label: 'Dirección', name: 'address', type: 'text', max: 100 },
                  ].map((field) => (
                    <div key={field.name} className={field.name === 'address' ? 'md:col-span-2' : ''}>
                      <label className="text-sm font-medium text-gray-600">{field.label}</label>
                      <Field
                        type={field.type}
                        name={field.name}
                        maxLength={field.max}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          let val = e.target.value;
                          if (field.name.includes('name')) val = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                          if (field.name === 'phone') val = val.replace(/[^0-9]/g, '');
                          
                          setFieldValue(field.name, val, true);
                          setFieldTouched(field.name, true, false);
                        }}
                        className={inputStyle}
                      />
                      <ErrorMessage name={field.name} component="div" className="text-xs text-red-500 mt-1" />
                    </div>
                  ))}

                  {/* Campo de contraseña */}
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

                  {/* Selección de país */}
                  <div>
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

                {/* Selección de Plan (Ocupa todo el ancho) */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Plan</label>
                  <Field
                    as="select"
                    name="plan"
                    className={inputStyle}
                  >
                    <option value="">Selecciona un plan...</option>
                    {Array.isArray(CompanyPlan) && CompanyPlan.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="plan" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                {/* Botón de envío */}
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

      {/* SECCIÓN DERECHA: Hero */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#1f2a37] p-12 text-white">
        <div className="flex flex-1 items-center">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Creá tu cuenta Empresa y <br />
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