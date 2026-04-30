type CreatePaymentPayload = {
  orderId: string;
  userId: string;
};

export const createOrder = async (orderData: unknown) => {
  const response = await fetch(
    "https://back-trackifly-production.up.railway.app/orders",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(orderData),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear la orden");
  }

  return response.json();
};


export const createPayment = async (data: CreatePaymentPayload) => {
  const response = await fetch(
    'https://back-trackifly-production.up.railway.app/mercadopago/create-preference',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        orderId: data.orderId,
        userId: data.userId,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};
