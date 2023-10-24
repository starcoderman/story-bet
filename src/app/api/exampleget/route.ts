import { NextResponse } from "next/server";
import z from "zod";
import { buildLogout, getUserObject, parseParams } from "@utils/api/apiutil";
import prisma from "@utils/prisma";
import { withSessionRouteNewEdge } from "@utils/session/session-edge";

export const runtime = "edge"
const schema = z.object({
  variable: z.string(),
});

export const GET = withSessionRouteNewEdge(async (req) => {
  const { params, error } = await parseParams(req, schema);

  if (!params) {
    return NextResponse.json({ error: error }, { status: 400 });
  }

  const user = await getUserObject(req);

  if (!user) {
    return buildLogout(req);
  }

  return NextResponse.json({
    success: true,
  });
});
