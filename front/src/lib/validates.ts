import { ShipmentValues, ShipmentErrors } from '@/interfaces/shipment';
import { CalculatorValues } from '@/interfaces/shipment';
import { ILoginErrors, ILoginProps, IRegisterErrors, IRegisterProps } from '@/types/types';

export const validateShipment = (values: ShipmentValues): ShipmentErrors => {
  const errors: ShipmentErrors = {};

  if (!values.name) {
    errors.name = 'El nombre es requerido';
  }

  if (!values.category_id) {
    errors.category_id = 'Selecciona una categoría';
  }

  if (!values.delivery_direction) {
    errors.delivery_direction = 'La dirección es obligatoria';
  }

  if (values.haight <= 0) errors.haight = 'Debe ser mayor a 0';
  if (values.width <= 0) errors.width = 'Debe ser mayor a 0';
  if (values.depth <= 0) errors.depth = 'Debe ser mayor a 0';

  return errors;
};

export const validateCalculator = (values: CalculatorValues) => {
  const errors: any = {};
  if (values.haight <= 0) errors.haight = 'Requerido';
  if (values.width <= 0) errors.width = 'Requerido';
  if (values.depth <= 0) errors.depth = 'Requerido';
  if (values.distance <= 0) errors.distance = 'Ingresa la distancia';
  return errors;
};

export const validateFormLogin = (values: ILoginProps) => {
  const errors: ILoginErrors = {};
  if (!values.email) {
    errors.email = 'Email requerido';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'El email no es valido';
  }
  if (!values.password) {
    errors.password = 'Contraseña requerida';
  }
  return errors;
};

export const validateFormRegister = (values: IRegisterProps) => {
  const errors: IRegisterErrors = {};
  if (!values.email) {
    errors.email = 'Email requerido';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'El email no es valido';
  }
  if (!values.password) {
    errors.password = 'Contraseña requerida';
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i.test(values.password)) {
    errors.password = 'La contraseña debe contener minimo 8 caracteres entre letras y numeros';
  }
  if (!values.name) {
    errors.name = 'Nombre requerido';
  }
  if (!values.address) {
    errors.address = 'Dirección requerida';
  }
  if (!values.phone) {
    errors.phone = 'Numero de teléfono requerido';
  }
  if (!values.gender) {
    errors.gender = 'Género requerido';
  }
  if (!values.birthdate) {
    errors.birthdate = 'Fecha de nacimiento requerida';
  }
  if (!values.country) {
    errors.country = 'País requerido';
  }
  return errors;
};
