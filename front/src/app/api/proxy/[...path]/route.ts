import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.API_URL;

// IMPORTANTE: Exportar todos los métodos que usa tu App
export async function GET(req: NextRequest, { params }: { params: any }) {
  const { path } = await params;
  return forward(req, path);
}

export async function POST(req: NextRequest, { params }: { params: any }) {
  const { path } = await params;
  return forward(req, path);
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  const { path } = await params;
  return forward(req, path);
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const { path } = await params;
  return forward(req, path);
}

async function forward(req: NextRequest, path: string[]) {
  const baseUrl = BACKEND_URL?.replace(/\/$/, ""); 
  const targetUrl = `${baseUrl}/${path.join("/")}`;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  const allCookies = req.headers.get("cookie") ?? "";
  const cookieHeader = token && !allCookies.includes("token=")
    ? `${allCookies}; token=${token}`
    : allCookies;

  // Manejo del body para métodos que no son GET
  const body = req.method !== "GET" && req.method !== "HEAD" 
    ? await req.text() 
    : undefined;

  try {
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "cookie": cookieHeader,
      },
      body,
    });

    const responseBody = await backendResponse.text();
    
    const proxiedResponse = new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: { "Content-Type": "application/json" },
    });

    // REENVÍO DE COOKIES (Clave para que el login funcione al instante)
    const incomingCookies = backendResponse.headers.getSetCookie();
    if (incomingCookies.length > 0) {
      incomingCookies.forEach(cookie => {
        proxiedResponse.headers.append("set-cookie", cookie);
      });
    }

    return proxiedResponse;
  } catch (err) {
    console.error("Proxy error:", err);
    return new NextResponse("Proxy error", { status: 500 });
  }
}