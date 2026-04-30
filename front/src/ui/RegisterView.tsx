"use client";

import { validateFormRegister } from "@/lib/validates";
import { registerUser } from "@/services/authService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CountrySelect from "@/components/CountrySelect";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { IRegisterProps } from "@/interfaces/shipment";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

const RegisterView = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const maxDate = new Date().toISOString().split("T")[0];

  const inputStyle =
    "mt-1 w-full rounded-xl border border-border bg-surface-muted py-2.5 px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors placeholder:text-muted";

  const initialValues: IRegisterProps = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    gender: "",
    birthdate: "",
    country: "",
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background transition-colors duration-300">
      <div className="flex w-full lg:w-1/2 items-start lg:items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-2xl min-h-195 bg-surface rounded-2xl shadow-md p-8 sm:p-10 border border-border transition-colors duration-300 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
            Crear cuenta
          </h2>

          <div className="mt-2 text-center text-sm text-muted space-y-1">
            <p>
              ¿Ya tenés cuenta?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Iniciá sesión
              </Link>
            </p>
            <p>
              ¿Querés crear una cuenta empresa?{" "}
              <Link
                href="/registercompany"
                className="text-primary font-medium hover:underline"
              >
                Registrá tu Empresa
              </Link>
            </p>
          </div>

          <Formik<IRegisterProps>
            initialValues={initialValues}
            validate={validateFormRegister}
            onSubmit={async (values, { resetForm, setFieldValue }) => {
              const dataToSubmit = {
                ...values,
                country: values.country.slice(0, 2).toUpperCase(),
              };
              const success = await registerUser(dataToSubmit);
              if (success) {
                resetForm();
                setFieldValue("country", "");
                router.push("/login");
              }
            }}
          >
            {({
              isValid,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
              values,
            }) => (
              <Form className="mt-8 space-y-5 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    {
                      label: "Nombre",
                      name: "first_name",
                      type: "text",
                      max: 80,
                    },
                    {
                      label: "Apellido",
                      name: "last_name",
                      type: "text",
                      max: 80,
                    },
                    { label: "Email", name: "email", type: "email", max: 50 },
                    { label: "Teléfono", name: "phone", type: "text", max: 15 },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="text-sm font-medium text-muted">
                        {field.label}
                      </label>
                      <Field
                        type={field.type}
                        name={field.name}
                        maxLength={field.max}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          let val = e.target.value;
                          if (field.name.includes("name"))
                            val = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
                          if (field.name === "phone")
                            val = val.replace(/[^0-9]/g, "");
                          setFieldValue(field.name, val, true);
                          setFieldTouched(field.name, true, false);
                        }}
                        className={inputStyle}
                      />
                      <ErrorMessage
                        name={field.name}
                        component="div"
                        className="text-xs text-primary mt-1"
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted">
                      Dirección
                    </label>
                    <Field
                      type="text"
                      name="address"
                      maxLength={150}
                      className={inputStyle}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-xs text-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted">
                      Fecha de nacimiento
                    </label>
                    <Field
                      type="date"
                      name="birthdate"
                      max={maxDate}
                      className={inputStyle}
                    />
                    <ErrorMessage
                      name="birthdate"
                      component="div"
                      className="text-xs text-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted">
                      Contraseña
                    </label>
                    <div className="relative mt-1">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        maxLength={100}
                        className={`${inputStyle} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-xs text-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted">
                      Género
                    </label>
                    <Field as="select" name="gender" className={inputStyle}>
                      <option value="">Selecciona una opción</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otros</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-xs text-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted">
                      País
                    </label>
                    <div className="mt-1">
                      <CountrySelect
                        value={values.country}
                        onChange={(value) =>
                          setFieldValue("country", value, true)
                        }
                        onBlur={() => setFieldTouched("country", true)}
                      />
                    </div>
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-xs text-primary mt-1"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:bg-surface-muted disabled:text-muted mt-4 flex justify-center items-center"
                >
                  {isSubmitting ? "Procesando..." : "Crear cuenta"}
                </button>
                {/* Botón de google */}
                <GoogleAuthButton mode="register" />
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col bg-[#1f2a37] dark:bg-slate-900 p-10 lg:p-16 text-white transition-colors duration-300">
        <div className="flex flex-col flex-1 justify-center">
          <div className="mb-10 text-left">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Creá tu cuenta y <br />
              <span className="text-primary">empezá en minutos.</span>
            </h1>
            <p className="mt-4 text-gray-300 max-w-md text-lg">
              Unite a TrackiFly y gestioná tus envíos personales de forma
              simple, rápida y segura.
            </p>
          </div>
          <ul className="space-y-4 text-lg text-gray-300 text-left">
            <li className="flex items-center gap-3">
              <span className="text-primary text-xl">✔</span> Registro rápido y
              sin complicaciones
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary text-xl">✔</span> Acceso inmediato a
              tu panel de envíos
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary text-xl">✔</span> Seguimiento en
              tiempo real de tus paquetes
            </li>
          </ul>
        </div>
        <p className="text-xs text-gray-500 mt-10">© 2026 TrackiFly</p>
      </div>
    </div>
  );
};

export default RegisterView;
