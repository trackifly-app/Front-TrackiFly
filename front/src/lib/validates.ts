import { ShipmentValues, ShipmentErrors } from '@/interfaces/shipment';
import { CalculatorValues } from '@/interfaces/shipment';
import { ILoginErrors, ILoginProps, IRegisterErrors, IRegisterProps } from '@/types/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const PHONE_REGEX = /^[0-9]{7,15}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export const validateShipment = (values: ShipmentValues): ShipmentErrors => {
  const errors: ShipmentErrors = {};

  if (!values.nombre) {
    errors.nombre = 'El nombre es requerido';
  }

  if (!values.id_categoria) {
    errors.id_categoria = 'Selecciona una categoría';
  }

  if (!values.direccion_entrega) {
    errors.direccion_entrega = 'La dirección es obligatoria';
  }

  if (values.alto <= 0) errors.alto = 'Debe ser mayor a 0';
  if (values.ancho <= 0) errors.ancho = 'Debe ser mayor a 0';
  if (values.profundidad <= 0) errors.profundidad = 'Debe ser mayor a 0';

  return errors;
};

export const validateCalculator = (values: CalculatorValues) => {
  const errors: any = {};
  if (values.alto <= 0) errors.alto = 'Requerido';
  if (values.ancho <= 0) errors.ancho = 'Requerido';
  if (values.profundidad <= 0) errors.profundidad = 'Requerido';
  if (values.distancia <= 0) errors.distancia = 'Ingresa la distancia';
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

  if (!values.name.trim()) {
    errors.name = 'El nombre es obligatorio';
  } else if (!NAME_REGEX.test(values.name)) {
    errors.name = 'Solo se permiten letras';
  } else if (values.name.length > 15) {
    errors.name = 'Máximo 15 caracteres';
  } else if (values.name.length < 2) {
    errors.name = 'Debe tener al menos 2 caracteres';
  }

  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Ingresa un email válido';
  }

  if (!values.password.trim()) {
    errors.password = 'La contraseña es obligatoria';
  } else if (!PASSWORD_REGEX.test(values.password)) {
    errors.password = 'Mínimo 8 caracteres, con al menos una letra y un número';
  }

  if (!values.address.trim()) {
    errors.address = 'La dirección es obligatoria';
  } else if (values.address.length < 5) {
    errors.address = 'Dirección demasiado corta';
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
    const birth = new Date(values.birthdate);

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
