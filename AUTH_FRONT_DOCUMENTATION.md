# Documentación de Auth para Frontend

## Resumen rápido

- `POST /auth/signup/user`: registra usuario común
- `POST /auth/signup/company`: registra usuario empresa
- `POST /auth/register-operator`: registra operador (solo empresas, requiere token)
- `POST /auth/signin`: login general
- `POST /auth/google`: login/registro con Google para usuario común

---

## 1. Flujo general de registro y login

### 1.1 Usuario común

1. El front envía `POST /auth/signup/user` con los datos de registro.
2. El backend crea un `User` y un `Profile`.
3. Devuelve `message` y `user_id`.
4. El usuario puede luego iniciar sesión con `POST /auth/signin`.

### 1.2 Usuario empresa

1. El front envía `POST /auth/signup/company`.
2. El backend crea un `User` y una `Company`.
3. La cuenta queda `pendiente de aprobación`.
4. Devuelve `message` y `user_id`.
5. La empresa debe iniciar sesión con `POST /auth/signin` cuando esté aprobada.

### 1.3 Empleado / Operador

1. La empresa inicia sesión con `POST /auth/signin`.
2. El front de empresa usa el `token` recibido.
3. Envía `POST /auth/register-operator` con el header `Authorization: Bearer <token>`.
4. El backend verifica que el token sea válido y que el rol sea `Company`.
5. Crea un `User` de tipo operador con `parentCompany`.
6. Devuelve `message` y `user_id`.

---

## 2. Endpoints detallados

### 2.1 `POST /auth/signup/user`

- Método: `POST`
- Ruta: `/auth/signup/user`
- Token: no

#### Body esperado

| Campo        | Tipo   | Validación                           | Comentario            |
| ------------ | ------ | ------------------------------------ | --------------------- |
| `email`      | string | obligatorio, email válido            |                       |
| `password`   | string | obligatorio, 6-100 caracteres        |                       |
| `address`    | string | obligatorio, 3-150 caracteres        |                       |
| `phone`      | string | obligatorio, 7-15 caracteres         |                       |
| `country`    | string | obligatorio, 2 caracteres            | ISO 3166-1            |
| `first_name` | string | obligatorio, 3-80 caracteres         |                       |
| `last_name`  | string | obligatorio, 3-80 caracteres         |                       |
| `gender`     | string | obligatorio, `male`/`female`/`other` |                       |
| `birthdate`  | string | obligatorio, ISO date                | ejemplo: `1990-05-20` |

#### Respuesta

```json
{
  "message": "Usuario registrado exitosamente.",
  "user_id": "..."
}
```

---

### 2.2 `POST /auth/signup/company`

- Método: `POST`
- Ruta: `/auth/signup/company`
- Token: no

#### Body esperado

| Campo          | Tipo   | Validación                        | Comentario |
| -------------- | ------ | --------------------------------- | ---------- |
| `email`        | string | obligatorio, email válido         |            |
| `password`     | string | obligatorio, 6-100 caracteres     |            |
| `address`      | string | obligatorio, 3-150 caracteres     |            |
| `phone`        | string | obligatorio, 7-15 caracteres      |            |
| `country`      | string | obligatorio, 2 caracteres         | ISO 3166-1 |
| `company_name` | string | obligatorio, 2-100 caracteres     |            |
| `industry`     | string | obligatorio, hasta 50 caracteres  |            |
| `contact_name` | string | obligatorio, 3-80 caracteres      |            |
| `plan`         | string | obligatorio, `free`/`basic`/`pro` |            |

#NUEVO

#### Estado inicial de la cuenta

- Al registrarse, la cuenta de empresa se crea con `status: PENDING` (pendiente de aprobación).
- Esto significa que la empresa no puede iniciar sesión hasta que un administrador apruebe la cuenta y cambie el status a `APPROVED`.

#### Qué significa "pendiente de aprobación"

- La cuenta queda en estado `PENDING` porque las empresas requieren verificación manual por parte del administrador del sistema.
- El usuario front debe mostrar un mensaje claro al usuario indicando que la cuenta está pendiente de aprobación y que debe esperar a que sea activada.
- Una vez aprobada, la empresa podrá iniciar sesión normalmente. Si es rechazada (`REJECTED`), no podrá loguearse.
  #NUEVO HASTA AQUI

#### Respuesta

```json
{
  "message": "Empresa registrada exitosamente. Cuenta pendiente de aprobación.",
  "user_id": "..."
}
```

---

### 2.3 `POST /auth/register-operator`

- Método: `POST`
- Ruta: `/auth/register-operator`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Body esperado

| Campo      | Tipo   | Validación                    | Comentario |
| ---------- | ------ | ----------------------------- | ---------- |
| `email`    | string | obligatorio, email válido     |            |
| `password` | string | obligatorio, 6-100 caracteres |            |
| `address`  | string | obligatorio, 3-150 caracteres |            |
| `phone`    | string | obligatorio, 7-15 caracteres  |            |
| `country`  | string | obligatorio, 2 caracteres     | ISO 3166-1 |

#### Reglas adicionales

- Solo puede ejecutar este endpoint un usuario con rol `Company`.
- Si el token existe pero el rol no es `Company`, el backend lanza `ForbiddenException`.
- **Nuevo:** El backend valida que la empresa madre (quien ejecuta el registro) tenga `status: APPROVED`. Si la empresa no está aprobada, el operador se registra pero no podrá iniciar sesión.

#### Validaciones sobre la empresa madre

- La empresa que registra al operador debe existir en la base de datos.
- La empresa debe tener `status: APPROVED`. Si no, el registro falla con error 400.
- Esto asegura que solo empresas autorizadas puedan crear operadores.

#### Errores posibles

| Código de error | Mensaje de error                            | Cuando ocurre                                     |
| --------------- | ------------------------------------------- | ------------------------------------------------- |
| 403             | `Solo empresas pueden registrar operadores` | El token pertenece a un usuario que no es Company |
| 400             | `Empresa no encontrada`                     | La empresa madre no existe                        |
| 400             | `El email ya se encuentra registrado`       | Email duplicado                                   |

#NUEVO HASTA QUI

#### Respuesta

```json
{
  "message": "Operador registrado exitosamente.",
  "user_id": "..."
}
```

#HUEVO

#### Impacto en el login del operador

- Los operadores se crean con `status: APPROVED` automáticamente.
- Sin embargo, al intentar loguearse, el sistema verifica que su empresa madre esté aprobada. Si no, el login falla con: `"La empresa contratista no está autorizada para operar"`.

---

### 2.4 `POST /auth/signin`

- Método: `POST`
- Ruta: `/auth/signin`
- Token: no

#### Body esperado

| Campo      | Tipo   | Validación                    | Comentario |
| ---------- | ------ | ----------------------------- | ---------- |
| `email`    | string | obligatorio, email válido     |            |
| `password` | string | obligatorio, 6-100 caracteres |            |

#NUEVO

#### Validaciones adicionales

- El usuario debe existir en la base de datos.
- La cuenta debe estar activa (`is_active: true`).
- La contraseña debe coincidir con la almacenada (hasheada).
- **Nuevo:** El `status` del usuario debe ser `APPROVED`. Si es `PENDING` o `REJECTED`, el login falla.
- **Nuevo para operadores:** Si el usuario es operador, la empresa madre (`parentCompany`) debe existir y tener `status` `APPROVED`.

#### Errores posibles

| Código de error | Mensaje de error                                        | Cuando ocurre                                |
| --------------- | ------------------------------------------------------- | -------------------------------------------- |
| 400             | `Email o password Incorrectos`                          | Email no existe o contraseña incorrecta      |
| 400             | `La cuenta se encuentra desactivada`                    | `is_active` es `false`                       |
| 400             | `La cuenta aún no ha sido aprobada o fue rechazada`     | `status` no es `APPROVED`                    |
| 400             | `La empresa contratista no está autorizada para operar` | Usuario operador y empresa madre no aprobada |

#### Respuesta exitosa

```json
{
  "message": "Usuario Logeado",
  "token": "..."
}
```

#NUEVO

#### Cambios respecto a versiones anteriores

- **Validación de status:** Ahora se requiere que la cuenta esté aprobada (`APPROVED`) para poder iniciar sesión. Anteriormente, no había esta verificación.
- **Validación para operadores:** Los operadores solo pueden loguearse si su empresa contratista está autorizada (aprobada).
  #NUEVO HASTA AQUI

## 4. Uso del JWT en llamadas posteriores

### ¿Qué hacer con el token?

- Guardar el `token` devuelto por `/auth/signin` o `/auth/google`.
- En los endpoints protegidos, enviar en el header:

```http
Authorization: Bearer <token>
```

### Endpoint protegido en este proyecto

- `POST /auth/register-operator`

### Qué valida el backend

- El token existe y es válido.
- El token no expiró.
- El payload contiene `id`, `role`, `status`.
- El rol debe ser `Company` para registrar operadores.

---

## 5. Resumen práctico de implementación front

### Formularios de frontend

- `signupUserForm`
  - email, password, address, phone, country, first_name, last_name, gender, birthdate

- `signupCompanyForm`
  - email, password, address, phone, country, company_name, industry, contact_name, plan

- `registerOperatorForm` (solo empresas)
  - email, password, address, phone, country

- `signInForm`
  - email, password

### Ejemplo de fetch

```ts
const BASE_URL = "http://localhost:3000";

async function signIn(values) {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return res.json();
}

async function registerOperator(values, token) {
  const res = await fetch(`${BASE_URL}/auth/register-operator`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });
  return res.json();
}
```

---

## 6. Observaciones clave para front

- `signup/company` no devuelve token.
- `signup/company` queda pendiente de aprobación.
- `register-operator` solo funciona con `Authorization: Bearer`.
- `signup/user` y `signup/company` devuelven solo `message` y `user_id`..
- El rol `Operator` no genera perfil extendido adicional.
