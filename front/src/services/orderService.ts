export const createOrder = async (orderData: any) => {
  try {
    const response = await fetch('https://back-trackifly-production.up.railway.app/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: orderData.userId,
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
        distance: Number(orderData.distance),
        price: Number(orderData.price),
        // Enviamos ambos para cubrir cualquier error de tipeo en el backend
        total_amount: Number(orderData.total_amount), 
        totalAmount: Number(orderData.total_amount), 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la orden');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createOrder service:', error);
    throw error;
  }
};