import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function GET(request) {
  const session = await getIronSession(
    request,
    { setCookie: () => {} },
    sessionOptions
  );

  if (!session.user) {
    return new Response(JSON.stringify({ user: null }), { status: 200 });
  }

  return new Response(JSON.stringify({ user: session.user }), { status: 200 });
}
