import { ShipmentValues, ShipmentErrors, IRegisterCompanyProps, IRegisterCompanyErrors } from '@/interfaces/shipment';
import { CalculatorValues } from '@/interfaces/shipment';
import { ILoginErrors, ILoginProps, IRegisterErrors, IRegisterProps } from '@/interfaces/shipment';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const PHONE_REGEX = /^[0-9]{7,15}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export const validateShipment = (values: ShipmentValues): ShipmentErrors => {
  const errors: ShipmentErrors = {};

  if (!values.name) {
    errors.name = 'El nombre es requerido';
  }

  if (!values.category_id) {
    errors.category_id = 'Selecciona una categoría';
  }

  if (!values.delivery_direction) {
    errors.delivery_direction = 'La dirección de entrega es obligatoria';
  }

  if (!values.pickup_direction) {
    errors.pickup_direction = 'La dirección de retiro es obligatoria';
  }

  if (typeof values.height === 'number' && values.height <= 0) errors.height = 'Debe ser mayor a 0';
  if (typeof values.width === 'number' && values.width <= 0) errors.width = 'Debe ser mayor a 0';
  if (typeof values.depth === 'number' && values.depth <= 0) errors.depth = 'Debe ser mayor a 0';

  return errors;
};

export const validateCalculator = (values: CalculatorValues) => {
  const errors: Partial<Record<keyof CalculatorValues, string>> = {};
  if (values.height <= 0) errors.height = 'Requerido';
  if (values.width <= 0) errors.width = 'Requerido';
  if (values.depth <= 0) errors.depth = 'Requerido';
  if (values.distance <= 0) errors.distance = 'Ingresa la distancia';
  return errors;
};

export const validateFormLogin = (values: ILoginProps) => {
  const errors: ILoginErrors = {};

  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Ingresa un email válido';
  }

  if (!values.password.trim()) {
    errors.password = 'La contraseña es obligatoria';
  } else if (values.password.length < 6) {
    errors.password = 'Debe tener al menos 6 caracteres';
  }

  return errors;
};

export const validateFormRegister = (values: IRegisterProps) => {
  const errors: IRegisterErrors = {};

  if (!values.first_name || !values.first_name.trim()) {
    errors.first_name = 'El nombre es obligatorio';
  } else if (!NAME_REGEX.test(values.first_name)) {
    errors.first_name = 'Solo se permiten letras';
  } else if (values.first_name.length < 3) {
    errors.first_name = 'Mínimo 3 caracteres';
  }

  if (!values.last_name || !values.last_name.trim()) {
    errors.last_name = 'El apellido es obligatorio';
  } else if (!NAME_REGEX.test(values.last_name)) {
    errors.last_name = 'Solo se permiten letras';
  } else if (values.last_name.length < 3) {
    errors.last_name = 'Mínimo 3 caracteres';
  }

  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Ingresa un email válido';
  }

  if (!values.password.trim()) {
    errors.password = 'La contraseña es obligatoria';
  } else if (values.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }

  if (!values.address.trim()) {
    errors.address = 'La dirección es obligatoria';
  } else if (values.address.length < 3) {
    errors.address = 'Mínimo 3 caracteres';
  }

  if (!values.phone.trim()) {
    errors.phone = 'El teléfono es obligatorio';
  } else if (!PHONE_REGEX.test(values.phone)) {
    errors.phone = 'Número inválido (7-15 dígitos)';
  }

  if (!values.gender) {
    errors.gender = 'Selecciona un género';
  }

  if (!values.birthdate) {
    errors.birthdate = 'La fecha es obligatoria';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birth = new Date(values.birthdate);
    birth.setHours(0, 0, 0, 0);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age < 18) {
      errors.birthdate = 'Debes ser mayor de 18 años';
    }
  }

  if (!values.country) {
    errors.country = 'Selecciona un país';
  }

  return errors;
};
export type CompanyRegisterErrors = Partial<IRegisterCompanyProps>;

export const validateFormRegisterCompany = (values: IRegisterCompanyProps): IRegisterCompanyErrors => {
  const errors: IRegisterCompanyErrors = {};

  // Email
  if (!values.email) {
    errors.email = 'El email es obligatorio';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Formato de email inválido';
  }

  // Password
  if (!values.password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (values.password.length < 6) {
    errors.password = 'Debe tener al menos 6 caracteres';
  }

  // Company Name
  if (!values.company_name) {
    errors.company_name = 'El nombre de la empresa es obligatorio';
  }

  // Industry
  if (!values.industry) {
    errors.industry = 'Campo obligatorio';
  }

  // Contact Name
  if (!values.contact_name) {
    errors.contact_name = 'El nombre de contacto es obligatorio';
  }

  // Phone
  if (!values.phone) {
    errors.phone = 'El teléfono es obligatorio';
  } else if (!/^\d+$/.test(values.phone)) {
    errors.phone = 'Solo se permiten números';
  }

  // Address
  if (!values.address) {
    errors.address = 'La dirección es obligatoria';
  }

  // Country
  if (!values.country) {
    errors.country = 'Debes seleccionar un país';
  }

  // Plan
  if (!values.plan) {
    errors.plan = 'Debes seleccionar un plan';
  }

  return errors;
};
