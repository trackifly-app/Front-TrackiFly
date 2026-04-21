import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL;

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return forward(req, path);
}

async function forward(req: NextRequest, path: string[]) {
  const targetUrl = `${BACKEND_URL}/${path.join("/")}`;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const allCookies = req.headers.get("cookie") ?? "";
  const cookieHeader = token && !allCookies.includes("token=")
  ? `${allCookies}; token=${token}`
  : allCookies;
  console.log("Cookie enviada al back:", cookieHeader);

  console.log("Token encontrado:", !!token);
  console.log("Proxy →", targetUrl);

  const body = req.method !== "GET" ? await req.text() : undefined;

  try {
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body,
    });

    const responseBody = await backendResponse.text();
    console.log("Proxy status:", backendResponse.status);

    const proxiedResponse = new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: { "Content-Type": "application/json" },
    });

    const incomingCookie = backendResponse.headers.get("set-cookie");
    if (incomingCookie) {
      proxiedResponse.headers.set("set-cookie", incomingCookie);
    }

    return proxiedResponse;
  } catch (err) {
    console.error("Proxy error:", err);
    return new NextResponse("Proxy error", { status: 500 });
  }
}