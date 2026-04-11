export interface ShipmentValues {
    name: string;
    description: string;
    category_id: string | number;
    delivery_direction: string;
    haight: number;
    width: number;
    depth: number;
    image: string;
}

export interface ShipmentErrors {
    name?: string;
    category_id?: string;
    delivery_direction?: string;
    haight?: string;
    width?: string;
    depth?: string;
}
export interface CalculatorValues {
    haight: number;
    width: number;
    depth: number;
    distance: number;
}