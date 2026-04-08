import { ShipmentValues, ShipmentErrors } from "@/interfaces/shipment";
import { CalculatorValues } from "@/interfaces/shipment";
export const validateShipment = (values: ShipmentValues): ShipmentErrors => {
  const errors: ShipmentErrors = {};

  if (!values.nombre) {
    errors.nombre = "El nombre es requerido";
  }

  if (!values.id_categoria) {
    errors.id_categoria = "Selecciona una categoría";
  }

  if (!values.direccion_entrega) {
    errors.direccion_entrega = "La dirección es obligatoria";
  }


  if (values.alto <= 0) errors.alto = "Debe ser mayor a 0";
  if (values.ancho <= 0) errors.ancho = "Debe ser mayor a 0";
  if (values.profundidad <= 0) errors.profundidad = "Debe ser mayor a 0";

  return errors;
};



export const validateCalculator = (values: CalculatorValues) => {
  const errors: any = {};
  if (values.alto <= 0) errors.alto = "Requerido";
  if (values.ancho <= 0) errors.ancho = "Requerido";
  if (values.profundidad <= 0) errors.profundidad = "Requerido";
  if (values.distancia <= 0) errors.distancia = "Ingresa la distancia";
  return errors;
};