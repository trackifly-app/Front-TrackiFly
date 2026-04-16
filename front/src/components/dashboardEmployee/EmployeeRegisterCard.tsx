'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import { validateFormRegister } from '@/lib/validates';
import CountrySelect from '@/components/CountrySelect';

/**
 * Componente que renderiza el formulario de registro de un nuevo empleado.
 * Utiliza Formik para el manejo de estado, validación y envío del formulario.
 */
export default function EmployeeRegisterCard() {
  // Estado local para controlar la visibilidad de la contraseña (mostrar/ocultar)
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="rounded-3xl bg-surface border border-border p-8 shadow-sm">
      {/* Encabezado del formulario con título y descripción */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Registrar Nuevo Empleado</h2>
        <p className="text-muted mt-1.5 text-sm">Completa los datos para agregar un nuevo miembro al equipo logístico.</p>
      </div>

      {/* Formulario gestionado con Formik */}
      <Formik
        initialValues={{
          name: '',
          email: '',
          address: '',
          phone: '',
          gender: '',
          birthdate: '',
          country: '',
          password: '',
        }}
        validate={validateFormRegister} // Validación personalizada externa
        onSubmit={(values, { resetForm }) => {
          console.log('Nuevo empleado registrado:', values);
          alert('Empleado registrado correctamente ✅');
          resetForm();
          setShowPassword(false);
        }}
      >
        {(formikProps) => (
          <Form className="space-y-5">
            {/* Campo: Nombre completo con filtro de caracteres especiales */}
            <div>
              <label className="text-sm text-muted font-medium mb-1 block">Nombre completo</label>
              <Field
                name="name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                  formikProps.setFieldValue('name', val, true);
                }}
                className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <ErrorMessage name="name" component="div" className="text-xs text-red-500 mt-1" />
            </div>

            {/* Campos: Email y Contraseña en grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Email</label>
                <Field name="email" type="email" className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Contraseña</label>
                <div className="relative">
                  <Field type={showPassword ? 'text' : 'password'} name="password" className="w-full rounded-2xl border border-border bg-surface py-3 px-5 pr-12 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  {/* Botón para alternar visibilidad de la contraseña */}
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            {/* Campos: Dirección y Teléfono en grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Dirección</label>
                <Field name="address" className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
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
                  className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <ErrorMessage name="phone" component="div" className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            {/* Campos: Fecha de nacimiento, Género y País en grid de 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Fecha de nacimiento</label>
                <Field type="date" name="birthdate" max={new Date().toISOString().split('T')[0]} className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                <ErrorMessage name="birthdate" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Género</label>
                <Field as="select" name="gender" className="w-full rounded-2xl border border-border bg-surface py-3 px-5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-all">
                  <option value="">Género...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otros">Otros</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div className="relative z-50">
                <label className="text-sm text-muted font-medium mb-1 block">País</label>
                <div className="mt-1">
                  {/* Componente personalizado para selección de país */}
                  <CountrySelect value={formikProps.values.country} onChange={(val) => formikProps.setFieldValue('country', val, true)} onBlur={() => formikProps.setFieldTouched('country', true)} />
                </div>
                <ErrorMessage name="country" component="div" className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            {/* Botón de envío del formulario */}
            <button type="submit" disabled={!formikProps.isValid || formikProps.isSubmitting} className="mt-9 w-full rounded-2xl bg-primary py-4 text-base font-semibold text-white hover:bg-primary-hover transition-all active:scale-[0.985] disabled:bg-surface-muted disabled:text-muted shadow-lg">
              Registrar Empleado
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
