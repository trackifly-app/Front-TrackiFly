'use client';
import { validateFormRegister } from '@/lib/validate';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import CountrySelect from '@/components/CountrySelect';

const RegisterView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">Crea tu cuenta</h1>
        <p className="mb-6 text-center text-sm text-gray-500">Empieza a gestionar tus envíos fácilmente</p>

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
          onSubmit={(values) => {
            console.log('Registro exitoso', values);
          }}
        >
          {({ errors, setFieldValue, setFieldTouched, values }) => (
            <Form className="flex flex-col gap-4">
              {[
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Contraseña', name: 'password', type: 'password' },
                { label: 'Nombre', name: 'name', type: 'text' },
                { label: 'Dirección', name: 'address', type: 'text' },
                { label: 'Teléfono', name: 'phone', type: 'number' },
                { label: 'Género', name: 'gender', type: 'text' },
                { label: 'Fecha de nacimiento', name: 'birthdate', type: 'date' },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">{field.label}</label>

                  <Field type={field.type} name={field.name} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-[#e76f51] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40" />

                  <ErrorMessage name={field.name} component="div" className="text-xs text-red-500" />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">País</label>

                <CountrySelect
                  value={values.country}
                  onChange={(value) => {
                    setFieldValue('country', value);
                    setFieldTouched('country', true);
                  }}
                  onBlur={() => setFieldTouched('country', true)}
                />

                <ErrorMessage name="country" component="div" className="text-xs text-red-500" />
              </div>

              <button type="submit" disabled={!!errors.email || !!errors.password || !!errors.name || !!errors.address || !!errors.phone || !!errors.gender || !!errors.birthdate || !!errors.country} className="mt-3 rounded-xl bg-[#e76f51] py-3 text-sm font-semibold text-white transition hover:bg-[#d65f45] disabled:cursor-not-allowed disabled:bg-gray-300">
                Crear cuenta
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="font-medium text-[#e76f51] hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterView;
