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
    pickup_direction?: string;  
    delivery_direction?: string;
    height?: string;
    width?: string;
    depth?: string;
    image?: string;
    weight?: string;
}
export interface CalculatorValues {
    height: number;
    width: number;
    depth: number;
    distance: number;
}