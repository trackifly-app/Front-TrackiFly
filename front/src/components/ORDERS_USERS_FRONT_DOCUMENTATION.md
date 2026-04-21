# Documentación API Frontend - Orders, Order Details, Users, Profiles y Companies

## Resumen rápido

- Todos los endpoints de `orders` requieren token: `Authorization: Bearer <token>`.
- Todos los endpoints de `order-details` requieren token.
- `orders` está protegido y solo permite ver/modificar las órdenes propias.
- `users`, `profiles` y `companies` no muestran `AuthGuard` en el controller, por lo que no se requiere token de forma explícita en esos controllers.

---

## 1. Órdenes (Orders)

### 1.1 `POST /orders`

- Método: `POST`
- Ruta: `/orders`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Body esperado

| Campo | Tipo | Validación | Comentario |
|---|---|---|---|
| `product` | string | obligatorio | |
| `quantity` | number | obligatorio, entero, mínimo 1 | |

#### Respuesta

Devuelve la orden creada como objeto `Order`.

Ejemplo de estructura:
```json
{
  "id": 1,
  "product": "...",
  "quantity": 2,
  "status": "pending",
  "user": { ... },
  "details": [ ... ]
}
```

#### Notas
- El backend asocia la orden al usuario autenticado (`req.user.id`).

---

### 1.2 `GET /orders`

- Método: `GET`
- Ruta: `/orders`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Respuesta

Devuelve un arreglo de órdenes del usuario autenticado.

Ejemplo:
```json
[
  {
    "id": 1,
    "product": "...",
    "quantity": 2,
    "status": "pending",
    "user": { ... },
    "details": [ ... ]
  }
]
```

#### Restricción importante
- Retorna solo las órdenes del usuario autenticado.

---

### 1.3 `GET /orders/:id`

- Método: `GET`
- Ruta: `/orders/:id`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Parámetros
- `id`: número (ID de la orden)

#### Respuesta

Devuelve un objeto `Order`.

Ejemplo:
```json
{
  "id": 1,
  "product": "...",
  "quantity": 2,
  "status": "pending",
  "user": { ... },
  "details": [ ... ]
}
```

#### Restricción importante
- El usuario autenticado solo puede ver la orden si es propietario.
- Si la orden pertenece a otro usuario, el backend lanza `ForbiddenException`.

---

### 1.4 `PATCH /orders/:id`

- Método: `PATCH`
- Ruta: `/orders/:id`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Parámetros
- `id`: número (ID de la orden)

#### Body esperado

| Campo | Tipo | Validación | Comentario |
|---|---|---|---|
| `product` | string | opcional | |
| `quantity` | number | opcional | no valida mínimo en DTO actual |
| `status` | string | opcional, enum | `pending`, `processing`, `completed`, `cancelled` |

#### Respuesta

Devuelve la orden actualizada.

Ejemplo:
```json
{
  "id": 1,
  "product": "...",
  "quantity": 2,
  "status": "processing",
  "user": { ... },
  "details": [ ... ]
}
```

#### Restricción importante
- Solo el propietario puede actualizar la orden.
- Si no es propietario, devuelve `ForbiddenException`.

---

### 1.5 `DELETE /orders/:id`

- Método: `DELETE`
- Ruta: `/orders/:id`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Parámetros
- `id`: número (ID de la orden)

#### Respuesta

Devuelve un objeto vacío o `204` implícito según implementación del controller.

#### Restricción importante
- Solo el propietario puede eliminar la orden.
- Si no es propietario, devuelve `ForbiddenException`.

---

## 2. Detalles de orden (Order Details)

> Todos los endpoints de `order-details` requieren token.

### 2.1 `POST /order-details`

- Método: `POST`
- Ruta: `/order-details`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Body esperado

| Campo | Tipo | Validación | Comentario |
|---|---|---|---|
| `product` | string | obligatorio | |
| `quantity` | number | obligatorio | |
| `unitPrice` | number | obligatorio | |
| `orderId` | number | obligatorio | ID de la orden asociada |

#### Respuesta

Devuelve el detalle creado.

Ejemplo:
```json
{
  "id": 1,
  "product": "...",
  "quantity": 2,
  "unitPrice": 10.5,
  "subtotal": 21.0,
  "order": { ... }
}
```

---

### 2.2 `GET /order-details`

- Método: `GET`
- Ruta: `/order-details`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Respuesta

Devuelve un arreglo con todos los detalles de orden.

Ejemplo:
```json
[
  {
    "id": 1,
    "product": "...",
    "quantity": 2,
    "unitPrice": 10.5,
    "subtotal": 21.0,
    "order": { ... }
  }
]
```

---

### 2.3 `GET /order-details/order/:orderId`

- Método: `GET`
- Ruta: `/order-details/order/:orderId`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Parámetros
- `orderId`: número (ID de la orden)

#### Respuesta

Devuelve un arreglo con los detalles de la orden solicitada.

Ejemplo:
```json
[
  {
    "id": 1,
    "product": "...",
    "quantity": 2,
    "unitPrice": 10.5,
    "subtotal": 21.0,
    "order": { ... }
  }
]
```

---

### 2.4 `GET /order-details/:id`

- Método: `GET`
- Ruta: `/order-details/:id`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Parámetros
- `id`: número (ID del detalle)

#### Respuesta

Devuelve el detalle de orden.

Ejemplo:
```json
{
  "id": 1,
  "product": "...",
  "quantity": 2,
  "unitPrice": 10.5,
  "subtotal": 21.0,
  "order": { ... }
}
```

---

### 2.5 `PATCH /order-details/:id`

- Método: `PATCH`
- Ruta: `/order-details/:id`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Body esperado

| Campo | Tipo | Validación | Comentario |
|---|---|---|---|
| `product` | string | opcional | |
| `quantity` | number | opcional | |
| `unitPrice` | number | opcional | |
| `orderId` | number | opcional | |

#### Respuesta

Devuelve el detalle actualizado.

Ejemplo:
```json
{
  "id": 1,
  "product": "...",
  "quantity": 3,
  "unitPrice": 10.5,
  "subtotal": 31.5,
  "order": { ... }
}
```

---

### 2.6 `DELETE /order-details/:id`

- Método: `DELETE`
- Ruta: `/order-details/:id`
- Token: sí
- Header requerido:
  - `Authorization: Bearer <token>`

#### Parámetros
- `id`: número (ID del detalle)

#### Respuesta

Devuelve un objeto vacío o `204` implícito según la implementación.

---

## 3. Usuarios

> En el controller de `users` no aparece `AuthGuard`, por lo que no se exige token de forma explícita en ese controller.

### 3.1 `GET /users`

- Método: `GET`
- Ruta: `/users`
- Token: no obligatorio en controller (verificar si hay guard global)
- Query params:
  - `page`: número opcional, página actual
  - `limit`: número opcional, cantidad por página

#### Respuesta

Devuelve un arreglo de usuarios sin la contraseña.

Ejemplo:
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "address": "...",
    "phone": "...",
    "country": "...",
    "role": { ... },
    "status": "approved"
  }
]
```

---

### 3.2 `GET /users/:id`

- Método: `GET`
- Ruta: `/users/:id`
- Token: no obligatorio en controller

#### Parámetros
- `id`: UUID

#### Respuesta

Devuelve el usuario solicitado sin la contraseña.

Ejemplo:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "address": "...",
  "phone": "...",
  "country": "...",
  "role": { ... },
  "status": "approved"
}
```

---

### 3.3 `PUT /users/:id`

- Método: `PUT`
- Ruta: `/users/:id`
- Token: no obligatorio en controller

#### Parámetros
- `id`: UUID

#### Body esperado

| Campo | Tipo | Validación | Comentario |
|---|---|---|---|
| `address` | string | opcional, 3-150 caracteres | |
| `phone` | string | opcional, 7-15 caracteres | |
| `country` | string | opcional, 2 caracteres | ISO 3166-1 |

#### Respuesta

```json
{
  "message": "Usuario actualizado exitosamente.",
  "user_id": "..."
}
```

---

### 3.4 `DELETE /users/:id`

- Método: `DELETE`
- Ruta: `/users/:id`
- Token: no obligatorio en controller

#### Parámetros
- `id`: UUID

#### Respuesta

```json
{
  "message": "Usuario eliminado exitosamente.",
  "user_id": "..."
}
```

---

### 3.5 `PUT /users/:id/status`

- Método: `PUT`
- Ruta: `/users/:id/status`
- Token: no obligatorio en controller

#### Parámetros
- `id`: UUID

#### Body esperado

| Campo | Tipo | Validación | Comentario |
|---|---|---|---|
| `status` | string | enum | valores posibles definidos en `UserStatus` |

#### Respuesta

```json
{
  "message": "El estado del usuario ha sido actualizado correctamente.",
  "user_id": "...",
  "status": "..."
}
```

---

## 4. Perfiles y Empresas

> Los endpoints de `profiles` y `companies` no aplican `AuthGuard` en sus controllers.

### 4.1 `GET /profiles/user/:userId`

- Método: `GET`
- Ruta: `/profiles/user/:userId`
- Token: no obligatorio en controller

#### Parámetros
- `userId`: UUID

#### Respuesta

Devuelve el perfil del usuario.

Ejemplo:
```json
{
  "id": "uuid",
  "first_name": "...",
  "last_name": "...",
  "birthdate": "1990-01-01",
  "gender": "male"
}
```

---

### 4.2 `PUT /profiles/user/:userId`

- Método: `PUT`
- Ruta: `/profiles/user/:userId`
- Token: no obligatorio en controller

#### Parámetros
- `userId`: UUID

#### Body esperado

Campos opcionales con las mismas reglas que en `CreateProfileDto`:

| Campo | Tipo | Validación | Comentario |
|---|---|---|---|
| `first_name` | string | 3-80 caracteres | opcional |
| `last_name` | string | 3-80 caracteres | opcional |
| `birthdate` | string | fecha ISO | opcional |
| `gender` | string | enum `male`/`female`/`other` | opcional |

#### Respuesta

Devuelve el perfil actualizado.

---

### 4.3 `GET /companies/user/:userId`

- Método: `GET`
- Ruta: `/companies/user/:userId`
- Token: no obligatorio en controller

#### Parámetros
- `userId`: UUID

#### Respuesta

Devuelve la compañía asociada al usuario.

Ejemplo:
```json
{
  "id": "uuid",
  "company_name": "...",
  "industry": "...",
  "contact_name": "...",
  "plan": "free"
}
```

---

### 4.4 `PUT /companies/user/:userId`

- Método: `PUT`
- Ruta: `/companies/user/:userId`
- Token: no obligatorio en controller

#### Parámetros
- `userId`: UUID

#### Body esperado

Campos opcionales con las mismas reglas que en `CreateCompanyDto`:

| Campo | Tipo | Validación | Comentario |
|---|---|---|---|
| `company_name` | string | 2-100 caracteres | opcional |
| `industry` | string | hasta 50 caracteres | opcional |
| `contact_name` | string | 3-80 caracteres | opcional |
| `plan` | string | enum `free`/`basic`/`pro` | opcional |

#### Respuesta

Devuelve la compañía actualizada.

---

## 5. Notas importantes para front

- `orders` está protegido con `AuthGuard` y solo permite visualizar/editar las órdenes propias.
- `order-details` también está protegido con `AuthGuard` en el controller.
- `users`, `profiles` y `companies` no muestran protección explícita en el controller actual.
- `PUT /users/:id`, `PUT /profiles/user/:userId` y `PUT /companies/user/:userId` usan DTOs de actualización con campos opcionales.
- En `order-details`, el backend calcula `subtotal` y lo devuelve en la respuesta.
