export interface ShipmentValues {
    name: string;
    category_id: string;
    pickup_direction: string;    
    delivery_direction: string; 
    height: number;
    width: number;
    depth: number;
    weight: number;
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