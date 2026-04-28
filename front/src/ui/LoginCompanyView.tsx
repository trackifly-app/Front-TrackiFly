'use client';
import {  CompanyPlan } from '@/types/types';
import {  validateFormRegisterCompany } from '@/lib/validates';
import { registerCompany } from '@/services/authService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CountrySelect from '@/components/CountrySelect';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { IRegisterCompanyProps } from '@/interfaces/shipment';

const RegisterCompanyView = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const inputStyle = 'mt-1 w-full rounded-xl border border-border bg-surface-muted py-2.5 px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background transition-colors duration-300">
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
        onSubmit={async (values, { resetForm, setFieldValue }) => {
          const dataToSubmit = {
            ...values,
            country: values.country.slice(0, 2).toUpperCase(),
          };

          const success = await registerCompany(dataToSubmit);
          if (success) {
            resetForm();
            setFieldValue('country', '');
            router.push('/login');
          }
        }}
      >
        {({ isValid, isSubmitting, setFieldValue, setFieldTouched, values }) => (
          <>
            <div className="flex w-full lg:w-1/2 items-start lg:items-center justify-center p-6 sm:p-10 lg:p-16">
              <div className="w-full max-w-2xl min-h-195 flex flex-col justify-center bg-surface rounded-2xl shadow-md p-8 sm:p-10 border border-border transition-colors duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">Crear cuenta Empresa</h2>

                <div className="mt-2 text-center text-sm text-muted space-y-1">
                  <p>
                    ¿Ya tenés cuenta?{' '}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                      Iniciá sesión
                    </Link>
                  </p>
                  <p>
                    ¿Querés una cuenta personal?{' '}
                    <Link href="/register" className="text-primary font-medium hover:underline">
                      Registrate aquí
                    </Link>
                  </p>
                </div>

                <Form className="mt-8 space-y-5 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {[
                      { label: 'Nombre de la empresa', name: 'company_name', type: 'text', max: 100 },
                      { label: 'Industria', name: 'industry', type: 'text', max: 50 },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="text-sm font-medium text-muted">{field.label}</label>
                        <Field type={field.type} name={field.name} maxLength={field.max} className={inputStyle} />
                        <ErrorMessage name={field.name} component="div" className="text-xs text-primary mt-1" />
                      </div>
                    ))}

                    {[
                      { label: 'Nombre del contacto', name: 'contact_name', type: 'text', max: 80 },
                      { label: 'Email', name: 'email', type: 'email', max: 50 },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="text-sm font-medium text-muted">{field.label}</label>
                        <Field type={field.type} name={field.name} maxLength={field.max} className={inputStyle} />
                        <ErrorMessage name={field.name} component="div" className="text-xs text-primary mt-1" />
                      </div>
                    ))}

                    <div>
                      <label className="text-sm font-medium text-muted">Teléfono</label>
                      <Field
                        type="text"
                        name="phone"
                        maxLength={15}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setFieldValue('phone', val, true);
                          setFieldTouched('phone', true, false);
                        }}
                        className={inputStyle}
                      />
                      <ErrorMessage name="phone" component="div" className="text-xs text-primary mt-1" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted">Dirección</label>
                      <Field type="text" name="address" maxLength={150} className={inputStyle} />
                      <ErrorMessage name="address" component="div" className="text-xs text-primary mt-1" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted">Contraseña</label>
                      <div className="relative mt-1">
                        <Field type={showPassword ? 'text' : 'password'} name="password" maxLength={100} className={`${inputStyle} pr-10`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="text-xs text-primary mt-1" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted">País</label>
                      <div className="mt-1">
                        <CountrySelect value={values.country} onChange={(value) => setFieldValue('country', value, true)} onBlur={() => setFieldTouched('country', true)} />
                      </div>
                      <ErrorMessage name="country" component="div" className="text-xs text-primary mt-1" />
                    </div>
                  </div>

                  {/* Fila 5: Selección de Plan */}
                  <div>
                    <label className="text-sm font-medium text-muted">Plan</label>
                    <Field as="select" name="plan" className={inputStyle}>
                      <option value="">Selecciona un plan...</option>
                      {CompanyPlan.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="plan" component="div" className="text-xs text-primary mt-1" />
                  </div>

                  <button type="submit" disabled={!isValid || isSubmitting} className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:bg-surface-muted disabled:text-muted mt-4">
                    {isSubmitting ? 'Cargando...' : 'Crear cuenta Empresa'}
                  </button>
                </Form>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col bg-[#1f2a37] dark:bg-slate-900 transition-colors duration-300 p-10 lg:p-16 text-white overflow-y-auto">
              <div className="flex flex-col flex-1 justify-center">
                <div className="mb-10 text-left">
                  <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                    Potenciá tu <br />
                    <span className="text-primary">logística hoy mismo.</span>
                  </h1>
                  <p className="mt-4 text-gray-300 max-w-md text-lg">Unite a TrackiFly y gestioná tus envíos de forma simple, rápida y segura.</p>
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

export default RegisterCompanyView;
