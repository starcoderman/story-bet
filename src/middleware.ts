import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";
import { SESSION_OPTIONS } from "@constant";

export async function getSessionMiddleware(req: any, res: any) {
  const session = await getIronSession(req, res, SESSION_OPTIONS);
  return session;
}

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();


  return res;
};

export const config = {
  matcher: ["/platform/:path*", "/auth/:path*"],
};
