import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request, context) {
  const params = await context.params;
  return handleRequest("GET", request, params);
}

export async function POST(request, context) {
  const params = await context.params;
  return handleRequest("POST", request, params);
}

export async function PUT(request, context) {
  const params = await context.params;
  return handleRequest("PUT", request, params);
}

export async function DELETE(request, context) {
  const params = await context.params;
  return handleRequest("DELETE", request, params);
}

async function handleRequest(method, request, params) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    const token = session.token || null;
    const pathArray = params?.path || [];
    const path = pathArray.join("/");
    let url = new URL(`${API_URL}/${path}`);

    if (method === "GET") {
      // Manage query params e.g ?limit=10
      const searchParams = new URL(request.url).searchParams;
      searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    }

    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    headers["Content-Type"] = "application/json";

    const fetchOptions = { method, headers };
    if (["POST", "PUT"].includes(method)) {
      const body = await request.json();
      fetchOptions.body = JSON.stringify(body);
    }

    // Fetch to API target
    const apiRes = await fetch(url.toString(), {
      ...fetchOptions,
      credentials: "include",
    });

    const data = await apiRes.json();

    // Handle token expired
    if (data.status === 401) {
      session.destroy();
      return new Response(
        JSON.stringify({
          status: 401,
          message: "Token expired, please login again",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: apiRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Tunnel error:", error);
    return new Response(
      JSON.stringify({ status: 500, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
