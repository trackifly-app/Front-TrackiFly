import { ShipmentValues, ShipmentErrors } from '@/interfaces/shipment';
import { CalculatorValues } from '@/interfaces/shipment';
import { ILoginErrors, ILoginProps, IRegisterErrors, IRegisterProps } from '@/types/types';

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
