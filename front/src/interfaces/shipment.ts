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
    description?: string;
}
export interface CalculatorValues {
    height: number;
    width: number;
    depth: number;
    distance: number;
}
export interface IRegisterCompanyProps {
    email: string;
    password: string;
    company_name: string;
    industry: string;       // ej: "retail", "farmacia", "tecnología"
    contact_name: string;
    phone: string;
    address: string;
    country: string;        // ISO 3166-1 alpha-2
    plan: string;
    }
    
    export interface IRegisterCompanyErrors {
    email?: string;
    password?: string;
    company_name?: string;
    industry?: string;
    contact_name?: string;
    phone?: string;
    address?: string;
    country?: string;
    plan?: string;
}
