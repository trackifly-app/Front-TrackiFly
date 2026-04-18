'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import { validateFormRegister } from '@/lib/validates';
import CountrySelect from '@/components/CountrySelect';
import { registerEmployee } from '@/services/authService';

export default function EmployeeRegisterCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="rounded-3xl bg-surface border border-border p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Registrar Nuevo Empleado</h2>
        <p className="text-muted mt-1.5 text-sm">Completa los datos para agregar un nuevo miembro al equipo logístico.</p>
      </div>

      <Formik
        initialValues={{
          first_name: '',
          last_name: '',
          email: '',
          address: '',
          phone: '',
          gender: '',
          birthdate: '',
          country: '',
          password: '',
        }}
        validate={validateFormRegister}
        onSubmit={async (values, { resetForm, setFieldValue }) => {
          const dataToSubmit = {
            ...values,
            country: values.country.slice(0, 2).toUpperCase(),
          };

          const success = await registerEmployee(dataToSubmit);

          if (success) {
            resetForm();
            setFieldValue('country', '');
            setShowPassword(false);
          }
        }}
      >
        {(formikProps) => (
          <Form className="space-y-5">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Nombre</label>
                <Field
                  name="first_name"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                    formikProps.setFieldValue('first_name', val, true);
                  }}
                  className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground"
                />
                <ErrorMessage name="first_name" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Apellido</label>
                <Field
                  name="last_name"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                    formikProps.setFieldValue('last_name', val, true);
                  }}
                  className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground"
                />
                <ErrorMessage name="last_name" component="div" className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            {/* Email + Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Email</label>
                <Field name="email" type="email" className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground" />
                <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Contraseña</label>
                <div className="relative">
                  <Field type={showPassword ? 'text' : 'password'} name="password" className="w-full rounded-2xl border border-border bg-surface py-3 px-5 pr-12 text-foreground" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            {/* Dirección + Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Dirección</label>
                <Field name="address" className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground" />
                <ErrorMessage name="address" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Teléfono</label>
                <Field
                  name="phone"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    formikProps.setFieldValue('phone', val, true);
                  }}
                  className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground"
                />
                <ErrorMessage name="phone" component="div" className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            {/* Fecha + Género + País */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Fecha de nacimiento</label>
                <Field type="date" name="birthdate" max={new Date().toISOString().split('T')[0]} className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground" />
                <ErrorMessage name="birthdate" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Género</label>
                <Field as="select" name="gender" className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground">
                  <option value="">Género...</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otros</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div className="relative z-50">
                <label className="text-sm text-muted font-medium mb-1 block">País</label>
                <CountrySelect value={formikProps.values.country} onChange={(val) => formikProps.setFieldValue('country', val, true)} onBlur={() => formikProps.setFieldTouched('country', true)} />
                <ErrorMessage name="country" component="div" className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            <button type="submit" disabled={!formikProps.isValid || formikProps.isSubmitting} className="mt-9 w-full rounded-2xl bg-primary py-4 text-base font-semibold text-white disabled:bg-surface-muted">
              {formikProps.isSubmitting ? 'Registrando...' : 'Registrar Empleado'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
