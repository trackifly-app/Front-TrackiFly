import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No se recibieron mensajes." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta GEMINI_API_KEY en .env.local" },
        { status: 500 }
      );
    }

    const systemPrompt = `
Sos el asistente virtual de Trackifly, una plataforma web de logística y distribución de envíos.

Tu trabajo es guiar al usuario dentro de la página y responder de forma clara, breve y útil.

Contexto del sistema:
- En la Home el usuario puede ver accesos rápidos, servicios y abrir el chatbot.
- En la página Pedidos puede crear una orden de envío, cargar producto, origen, destino, dimensiones y extras.
- En la sección Tracking el usuario puede consultar el estado de un envío con su código.
- En Sucursales puede buscar puntos de atención.
- También existen preguntas frecuentes y soporte.

Reglas:
- Respondé siempre en español.
- Respondé en máximo 4 líneas, salvo que el usuario pida más detalle.
- No inventes datos del sistema ni estados que no te hayan dado.
- Si el usuario pregunta cómo hacer algo, indicá en qué sección o página debe hacerlo.
- Si el usuario quiere rastrear un envío, pedile el código de seguimiento.
- Si el usuario quiere crear un pedido, indicá que vaya a la sección Pedidos y complete el formulario.
- Si no sabés algo específico, decilo con honestidad.
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      ...messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }],
      })),
    ];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.4,
            topP: 0.8,
            maxOutputTokens: 220,
          },
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini completo:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Error al consultar Gemini." },
        { status: 500 }
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text)
        .filter(Boolean)
        .join(" ") ||
      data?.candidates?.[0]?.output ||
      null;

    if (!text) {
      return NextResponse.json({
        message:
          "Hola, soy el asistente de Trackifly. Puedo ayudarte a crear un pedido, rastrear un envío o buscar sucursales.",
      });
    }

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("API /chat error:", error);
    return NextResponse.json(
      { error: "Ocurrió un error interno." },
      { status: 500 }
    );
  }
}