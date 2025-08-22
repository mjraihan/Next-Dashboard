import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import { getUserDetail } from "@/lib/userDetails";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const data = await res.json();
    const detailData = await getUserDetail(data.id, data.token);
    const cookieStore = await cookies();

    const session = await getIronSession(cookieStore, sessionOptions);
    session.user = {
      id: data.id,
      username: data.username,
      email: data.email,
      image: data.image,
      role: detailData.role || null,
    };
    session.token = data.accessToken;
    await session.save();

    return new Response(JSON.stringify({ ok: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
