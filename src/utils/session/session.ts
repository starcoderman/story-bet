import { NextApiHandler } from "next";
import { JWT_SECRET, SESSION_OPTIONS } from "@constant";
import { withIronSessionApiRoute } from "iron-session/next";
import { IronSession, getIronSession, unsealData } from "iron-session";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, SESSION_OPTIONS);
}

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      email: string;
      name: string;
    };
  }
}

interface SessionIronData {
  email: string;
  id: string;
  name: string;
}

export async function getUserSSR(
  cookies: ReadonlyRequestCookies
): Promise<SessionIronData> {
  const found = cookies.get(SESSION_OPTIONS.cookieName);

  if (!found) return redirect("/auth/login");

  const { user } = await unsealData(found.value, {
    password: JWT_SECRET as string,
  });

  return user as unknown as SessionIronData;
}

export async function isUserLoggedInNoRedirect(
  cookies: ReadonlyRequestCookies
): Promise<boolean> {
  const found = cookies.get(SESSION_OPTIONS.cookieName);

  if (!found) return false;

  const { user } = await unsealData(found.value, {

    password: JWT_SECRET as string,
  });

  return user !== undefined;
}

export type DynamicSegments = {
  params: { 
    [key: string]: string
   } | undefined;
};

export type RouteHandler = (
  request: NextRequest,
  routeSegment: DynamicSegments
) => Promise<Response>;

export type RouteHandlerWithSession = (
  request: NextRequest & { session: IronSession },
  routeSegment: DynamicSegments
) => Promise<Response>;

export const withSessionRouteNew = (
  handler: RouteHandlerWithSession
): RouteHandler => {
  return async (request, routeSegment) => {
    const cookieResponse = new Response();
    const session = await getIronSession(
      request,
      cookieResponse,
      SESSION_OPTIONS
    );

    const sessionRequest = Object.assign(request, { session });
    const response = await handler(sessionRequest, routeSegment);

    const setCookie = cookieResponse.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  };
};
