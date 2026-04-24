/**
 * Envía una nueva orden de envío al backend de TrackiFly
 * @param orderData Datos provenientes del formulario de Formik
 * @returns La respuesta del servidor en formato JSON
 */
export const createOrder = async (orderData: any) => {
    try {
    const response = await fetch("https://back-trackifly-production.up.railway.app/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
        name: orderData.name,
        description: orderData.description,
        category_id: orderData.category_id,
        image: orderData.image,
        pickup_direction: orderData.pickup_direction,
        delivery_direction: orderData.delivery_direction,
        weight: Number(orderData.weight),
        height: Number(orderData.height),
        width: Number(orderData.width),
        depth: Number(orderData.depth),
        unit: orderData.unit,
        fragile: orderData.fragile,
        dangerous: orderData.dangerous,
        cooled: orderData.cooled,
        urgent: orderData.urgent,
        // Si el backend espera la distancia calculada por Google Maps:
        distance: orderData.distance,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la orden");
    }

    return await response.json();
    } catch (error) {
    console.error("Error en createOrder service:", error);
    throw error;
    }
};