import { SESSION_OPTIONS } from "@constant";
import { IronSession } from "iron-session";
import { getIronSession } from "iron-session/edge";
import type { RequestContext } from '@vercel/edge';
import { NextRequest } from "next/server";

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

export const withSessionRouteNewEdge: (
  handler: RouteHandlerWithSession, 
) => RouteHandler = (
  handler: RouteHandlerWithSession, 
)  => {
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
