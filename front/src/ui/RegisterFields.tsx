'use client';

import { Field, ErrorMessage } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';

export const RegisterFields = ({ showPassword, setShowPassword, values, setFieldValue, setFieldTouched }: any) => {
  return (
    <div className="space-y-4">
      {/* 1. Nombre */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">Nombre</label>
        <Field
          name="name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
            setFieldValue('name', val, true);
          }}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100 dark:border-slate-700 placeholder-gray-500 dark:placeholder-slate-400 py-2 px-4 text-sm focus:border-[#e76f51] focus:outline-none focus:ring-2 focus:ring-[#f4a261]/40"
        />
        <ErrorMessage name="name" component="div" className="text-xs text-red-500 mt-1" />
      </div>

      {/* 2. Email */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">Email</label>
        <Field name="email" type="email" className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100 dark:border-slate-700 placeholder-gray-500 dark:placeholder-slate-400 py-2 px-4 text-sm focus:border-[#e76f51] focus:outline-none" />
        <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
      </div>

      {/* 3. Dirección */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">Dirección</label>
        <Field name="address" className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100 dark:border-slate-700 placeholder-gray-500 dark:placeholder-slate-400 py-2 px-4 text-sm focus:border-[#e76f51] focus:outline-none" />
        <ErrorMessage name="address" component="div" className="text-xs text-red-500 mt-1" />
      </div>

      {/* 4. Teléfono */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">Teléfono</label>
        <Field
          name="phone"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            setFieldValue('phone', val, true);
          }}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100 dark:border-slate-700 placeholder-gray-500 dark:placeholder-slate-400 py-2 px-4 text-sm focus:border-[#e76f51] focus:outline-none"
        />
        <ErrorMessage name="phone" component="div" className="text-xs text-red-500 mt-1" />
      </div>

      {/* --- GRID DE 2 COLUMNAS PARA NACIMIENTO Y GÉNERO --- */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">Nacimiento</label>
          <Field type="date" name="birthdate" max={new Date().toISOString().split('T')[0]} className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100 dark:border-slate-700 placeholder-gray-500 dark:placeholder-slate-400 py-2 px-4 text-sm focus:border-[#e76f51] focus:outline-none" />
          <ErrorMessage name="birthdate" component="div" className="text-xs text-red-500 mt-1" />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">Género</label>
          <Field as="select" name="gender" className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100 dark:border-slate-700 placeholder-gray-500 dark:placeholder-slate-400 py-2 px-4 text-sm focus:border-[#e76f51] focus:outline-none cursor-pointer">
            <option value="">Elegir...</option>
            <option value="masculino">Masc.</option>
            <option value="femenino">Fem.</option>
            <option value="otros">Otros</option>
          </Field>
          <ErrorMessage name="gender" component="div" className="text-xs text-red-500 mt-1" />
        </div>
      </div>

      {/* 5. Contraseña */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">Contraseña</label>
        <div className="relative mt-1">
          <Field type={showPassword ? 'text' : 'password'} name="password" className="w-full rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100 dark:border-slate-700 py-2 px-4 pr-10 text-sm focus:border-[#e76f51] focus:outline-none" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
      </div>

      {/* 6. País */}
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">País</label>
        <div className="mt-1">
          <CountrySelect value={values.country} onChange={(val) => setFieldValue('country', val, true)} onBlur={() => setFieldTouched('country', true)} />
        </div>
        <ErrorMessage name="country" component="div" className="text-xs text-red-500 mt-1" />
      </div>
    </div>
  );
};
