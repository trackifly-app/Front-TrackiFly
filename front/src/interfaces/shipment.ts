export interface ShipmentValues {
    nombre: string;
    descripcion: string;
    id_categoria: string | number;
    direccion_entrega: string;
    alto: number;
    ancho: number;
    profundidad: number;
    imagen: string;
}

export interface ShipmentErrors {
    nombre?: string;
    id_categoria?: string;
    direccion_entrega?: string;
    alto?: string;
    ancho?: string;
    profundidad?: string;
}
export interface CalculatorValues {
    alto: number;
    ancho: number;
    profundidad: number;
    distancia: number;
}