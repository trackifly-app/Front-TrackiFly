'use client';

import { CompanyPlan, validateFormRegisterCompany } from '@/lib/validates';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import CountrySelect from '@/components/CountrySelect';
import Swal from 'sweetalert2';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { IRegisterCompanyProps } from '@/interfaces/shipment';

const PLAN_CARD_DATA = [
  {
    id: 'plan-free',
    name: 'FREE',
    price: '$0',
    headerBg: 'bg-gray-500',
    features: ['5 envíos mensuales', 'Seguimiento básico', 'Soporte vía Email']
  },
  {
    id: 'plan-basic',
    name: 'Basic',
    price: '$15k',
    headerBg: 'bg-[#f4a261]',
    features: ['50 envíos mensuales', 'Seguimiento Real Time', 'Seguro básico', 'Soporte prioritario']
  },
  {
    id: 'plan-pro',
    name: 'PRO',
    price: '$45k',
    headerBg: 'bg-[#e76f51]',
    features: ['Envíos ilimitados', 'API Integration', 'Gestor dedicado', 'Seguro Todo Riesgo']
  }
];

const RegisterView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const inputStyle = "mt-1 w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm focus:border-[#e76f51] focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40";

  return (
    /* Eliminamos paddings extras para que pegue con la Navbar */
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f7f7f7]">
      <Formik<IRegisterCompanyProps>
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
          <>
            {/* SECCIÓN IZQUIERDA: Formulario */}
<div className="flex w-full lg:w-1/2 items-start lg:items-center justify-center p-6 sm:p-10 lg:p-16">
  <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 sm:p-10">
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">Crear cuenta Empresa</h2>
    
    <div className="mt-2 text-center text-sm text-gray-500 space-y-1">
      <p>
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="text-[#e76f51] font-medium hover:underline">
          Iniciá sesión
        </Link>
      </p>
      <p>
        ¿Querés crear una cuenta personal?{' '}
        <Link href="/register" className="text-[#e76f51] font-medium hover:underline">
          Registrá tu cuenta
        </Link>
      </p>
    </div>
                
                <Form className="mt-8 space-y-5 text-left">
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

                  <div>
                    <label className="text-sm font-medium text-gray-600">Plan</label>
                    <Field as="select" name="plan" className={inputStyle}>
                      <option value="">Selecciona un plan...</option>
                      {Array.isArray(CompanyPlan) && CompanyPlan.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="plan" component="div" className="text-xs text-red-500 mt-1" />
                  </div>

                  <button 
                    type="submit" 
                    disabled={!isValid} 
                    className="w-full rounded-xl bg-[#e76f51] py-3.5 text-sm font-bold text-white transition hover:bg-[#d65f45] disabled:bg-gray-300 mt-4"
                  >
                    Crear cuenta
                  </button>
                </Form>
              </div>
            </div>

            {/* SECCIÓN DERECHA: Hero + Planes */}
            <div className="w-full lg:w-1/2 flex flex-col bg-[#1f2a37] p-10 lg:p-16 text-white">
              <div className="flex flex-col flex-1 justify-center">
                <div className="mb-10 text-left">
                  <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                    Potenciá tu <br />
                    <span className="text-[#e76f51]">logística hoy mismo.</span>
                  </h1>
                  <p className="mt-4 text-gray-300 max-w-md text-lg">
                    Unite a TrackiFly y gestioná tus envíos de forma simple, rápida y segura.
                  </p>
                </div>

                {/* Grid de Tarjetas Blancas */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  {PLAN_CARD_DATA.map((plan) => {
                    const isSelected = values.plan === plan.id;
                    return (
                      <div 
                        key={plan.id}
                        className={`relative flex flex-col rounded-xl overflow-hidden transition-all duration-500 bg-white shadow-2xl ${
                          isSelected 
                            ? 'ring-4 ring-[#e76f51] scale-105 z-10 opacity-100' 
                            : 'opacity-90 scale-95 hover:opacity-100'
                        }`}
                      >
                        <div className={`${plan.headerBg} p-3 text-center relative`}>
                          <h3 className="text-[10px] font-black text-white tracking-widest uppercase">{plan.name}</h3>
                          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-${plan.headerBg.replace('bg-','')}`}></div>
                        </div>

                        <div className="p-5 pt-6 text-center flex-1 flex flex-col">
                          <p className="text-3xl font-black text-gray-900">{plan.price}</p>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">mensual</span>

                          <ul className="mt-5 space-y-2 text-left">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="text-[#e76f51] h-3.5 w-3.5 mt-0.5 shrink-0" />
                                <span className="text-[10px] text-gray-600 font-bold leading-tight">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-auto pt-5">
                              <div className={`text-[9px] font-black py-2 rounded-lg ${isSelected ? 'bg-[#e76f51] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  {isSelected ? 'SELECCIONADO' : 'ELEGIR PLAN'}
                              </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <ul className="mt-10 space-y-3 text-sm text-gray-300 text-left">
                  <li className="flex items-center gap-2">✔ Registro rápido y sin complicaciones</li>
                  <li className="flex items-center gap-2">✔ Acceso inmediato a tu panel</li>
                  <li className="flex items-center gap-2">✔ Control total de tus envíos</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 mt-10">© 2026 TrackiFly</p>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default RegisterView;